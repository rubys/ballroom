#!/usr/bin/env ruby
# frozen_string_literal: true

# Compare Showcase (Rails) vs Ballroom (Juntos) rendered HTML
#
# Usage:
#   scripts/compare-showcase.rb DATABASE [options] PATH [PATH...]
#
# Arguments:
#   DATABASE          Showcase database (e.g., ~/git/showcase/db/2025-charlotte.sqlite3)
#                     Can be a full path, relative path, or just a name (looks in showcase/db/)
#
# Options:
#   --diff              Show unified diff for each page
#   --verbose, -v       Show full normalized HTML
#   --help, -h          Show this help message
#
# Examples:
#   scripts/compare-showcase.rb ~/git/showcase/db/2025-charlotte.sqlite3 / /studios /people
#   scripts/compare-showcase.rb 2025-charlotte --diff /studios
#   scripts/compare-showcase.rb 2025-charlotte --diff /studios/1

require 'optparse'
require 'open3'
require 'tempfile'
require 'fileutils'

options = {
  diff: false,
  verbose: false
}

parser = OptionParser.new do |opts|
  opts.banner = "Usage: scripts/compare-showcase.rb DATABASE [options] PATH [PATH...]"
  opts.separator ""
  opts.separator "Compare Showcase (Rails) vs Ballroom (Juntos) rendered HTML"
  opts.separator ""

  opts.on("--diff", "Show unified diff for each page") do
    options[:diff] = true
  end

  opts.on("-v", "--verbose", "Show full normalized HTML") do
    options[:verbose] = true
  end

  opts.on("-h", "--help", "Show this help message") do
    puts opts
    exit
  end
end

# Extract database argument (first non-option, non-path argument)
database = nil
args = ARGV.dup
if args.first && !args.first.start_with?('-') && !args.first.start_with?('/')
  database = args.shift
end

# Re-parse remaining args
begin
  parser.parse!(args)
rescue OptionParser::InvalidOption => e
  $stderr.puts "Error: #{e.message}"
  $stderr.puts parser
  exit 1
end

paths = args.dup

if database.nil?
  $stderr.puts "Error: DATABASE argument required"
  $stderr.puts parser
  exit 1
end

if paths.empty?
  $stderr.puts "Error: No paths specified"
  $stderr.puts parser
  exit 1
end

# Resolve paths
ballroom_root = File.expand_path('..', __dir__)
showcase_root = File.expand_path('~/git/showcase')
showcase_render = File.join(showcase_root, '.claude/skills/render-page/scripts/render.rb')

unless File.directory?(showcase_root)
  $stderr.puts "Error: Showcase not found at #{showcase_root}"
  exit 1
end

unless File.exist?(showcase_render)
  $stderr.puts "Error: Showcase render script not found at #{showcase_render}"
  exit 1
end

# Resolve database path
db_path = nil
db_name = nil

if File.exist?(database)
  db_path = File.expand_path(database)
  db_name = File.basename(database, '.sqlite3')
elsif File.exist?(File.join(showcase_root, 'db', "#{database}.sqlite3"))
  db_path = File.join(showcase_root, 'db', "#{database}.sqlite3")
  db_name = database
elsif File.exist?(File.join(showcase_root, database))
  db_path = File.join(showcase_root, database)
  db_name = File.basename(database, '.sqlite3')
else
  $stderr.puts "Error: Database not found: #{database}"
  $stderr.puts "  Tried: #{database}"
  $stderr.puts "  Tried: #{File.join(showcase_root, 'db', "#{database}.sqlite3")}"
  exit 1
end

$stderr.puts "Database: #{db_path}"

# Copy database to ballroom storage
ballroom_db = File.join(ballroom_root, 'storage', 'development.sqlite3')
$stderr.puts "Copying to ballroom: #{ballroom_db}"
FileUtils.cp(db_path, ballroom_db)

# Extract <main>...</main> content from HTML
def extract_main(html)
  if html =~ /<main[^>]*>(.*?)<\/main>/m
    $1
  elsif html =~ /<body[^>]*>(.*?)<\/body>/m
    $1
  else
    html
  end
end

# Normalize HTML to strip only environment-level rendering artifacts.
# Everything functional (data attributes, classes, links, content) is preserved.
def normalize(html)
  text = extract_main(html)

  # Strip ERB debug comments (Rails dev-mode artifacts)
  text.gsub!(/<!--\s*(?:BEGIN|END)\s+.*?-->\n?/m, '')

  # Normalize asset fingerprints: /assets/name-HASH.ext → /assets/name.ext
  text.gsub!(%r{/assets/([\w/]+)-[A-Za-z0-9]{8,}\.(css|js|png|svg|jpg)}, '/assets/\1.\2')

  # Normalize self-closing tags: " />" → ">"
  text.gsub!(%r{\s*/>}, '>')

  # Strip leading/trailing whitespace per line (indentation differs)
  text = text.lines.map { |l| l.strip }.join("\n")

  # Collapse blank lines
  text.gsub!(/\n{2,}/, "\n")

  text.strip + "\n"
end

# Render a path via Showcase (Rails)
def showcase_render(path, db_name, showcase_render_script)
  stdout, stderr, status = Open3.capture3(
    "ruby", showcase_render_script, db_name, "--html", path
  )
  return nil unless status.success?
  stdout
end

# Render a path via Ballroom (Juntos)
def juntos_render(path, ballroom_root)
  stdout, stderr, status = Open3.capture3(
    "npx", "juntos", "render", "--html", path,
    chdir: ballroom_root
  )
  return nil unless status.success?
  stdout
end

# Compare two strings and return diff
def compute_diff(showcase_html, juntos_html, path)
  showcase_file = Tempfile.new(['showcase', '.html'])
  juntos_file = Tempfile.new(['juntos', '.html'])
  begin
    showcase_file.write(showcase_html)
    showcase_file.close
    juntos_file.write(juntos_html)
    juntos_file.close

    diff, = Open3.capture2(
      "diff", "-u",
      "--label", "showcase:#{path}",
      "--label", "ballroom:#{path}",
      showcase_file.path, juntos_file.path
    )
    diff
  ensure
    showcase_file.unlink
    juntos_file.unlink
  end
end

# Process each path
exit_code = 0
results = []

paths.each do |path|
  $stderr.print "  #{path} ... "

  sc_html = showcase_render(path, db_name, showcase_render)
  unless sc_html
    $stderr.puts "Showcase render failed"
    results << { path: path, status: :showcase_error }
    exit_code = 1
    next
  end

  jr_html = juntos_render(path, ballroom_root)
  unless jr_html
    $stderr.puts "Ballroom render failed"
    results << { path: path, status: :ballroom_error }
    exit_code = 1
    next
  end

  sc_norm = normalize(sc_html)
  jr_norm = normalize(jr_html)

  if sc_norm == jr_norm
    $stderr.puts "match"
    results << { path: path, status: :match }
  else
    diff = compute_diff(sc_norm, jr_norm, path)
    diff_lines = diff.lines.count { |l| l.start_with?('+', '-') && !l.start_with?('+++', '---') }
    $stderr.puts "#{diff_lines} line(s) differ"
    results << { path: path, status: :differ, diff: diff, diff_lines: diff_lines }
    exit_code = 1
  end

  if options[:verbose]
    puts "=== Showcase normalized: #{path} ==="
    puts sc_norm
    puts "=== Ballroom normalized: #{path} ==="
    puts jr_norm
  end
end

# Summary
puts ""
puts "Results:"
results.each do |r|
  case r[:status]
  when :match
    puts "  #{r[:path]}  MATCH"
  when :differ
    puts "  #{r[:path]}  DIFFER (#{r[:diff_lines]} lines)"
  when :showcase_error
    puts "  #{r[:path]}  SHOWCASE ERROR"
  when :ballroom_error
    puts "  #{r[:path]}  BALLROOM ERROR"
  end
end

# Show diffs if requested
if options[:diff]
  results.select { |r| r[:status] == :differ }.each do |r|
    puts ""
    puts r[:diff]
  end
end

match_count = results.count { |r| r[:status] == :match }
total = results.length
puts ""
puts "#{match_count}/#{total} pages match"

exit exit_code
