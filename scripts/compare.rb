#!/usr/bin/env ruby
# frozen_string_literal: true

# Compare Rails vs Juntos rendered HTML for the same pages
#
# Usage:
#   scripts/compare.rb [options] PATH [PATH...]
#
# Options:
#   --diff              Show unified diff for each page
#   --verbose, -v       Show full normalized HTML
#   --test              Use test database with fixtures
#   --help, -h          Show this help message
#
# Examples:
#   scripts/compare.rb / /studios /people
#   scripts/compare.rb --diff /studios
#   scripts/compare.rb --test /studios

require 'optparse'
require 'open3'
require 'tempfile'

options = {
  diff: false,
  verbose: false,
  test: false
}

parser = OptionParser.new do |opts|
  opts.banner = "Usage: scripts/compare.rb [options] PATH [PATH...]"
  opts.separator ""
  opts.separator "Compare Rails vs Juntos rendered HTML"
  opts.separator ""

  opts.on("--diff", "Show unified diff for each page") do
    options[:diff] = true
  end

  opts.on("--test", "Use test database with fixtures") do
    options[:test] = true
  end

  opts.on("-v", "--verbose", "Show full normalized HTML") do
    options[:verbose] = true
  end

  opts.on("-h", "--help", "Show this help message") do
    puts opts
    exit
  end
end

begin
  parser.parse!
rescue OptionParser::InvalidOption => e
  $stderr.puts "Error: #{e.message}"
  $stderr.puts parser
  exit 1
end

if ARGV.empty?
  $stderr.puts "Error: No paths specified"
  $stderr.puts parser
  exit 1
end

paths = ARGV.dup

# Set up Rails environment
rails_root = File.expand_path('..', __dir__)
Dir.chdir(rails_root)

ENV['RAILS_ENV'] = options[:test] ? 'test' : 'development'
require File.expand_path('config/environment', rails_root)

if options[:test]
  require 'rake'
  Rails.application.load_tasks
  Rake::Task['db:prepare'].invoke
  Rake::Task['db:fixtures:load'].invoke
end

# Normalize HTML to strip environment-specific differences
def normalize(html)
  lines = html.lines

  # Strip non-HTML preamble (e.g., migration output from juntos)
  # Also strip <!DOCTYPE html> line itself (Rails strips it via routes.call)
  first_html = lines.index { |l| l.strip.start_with?('<!DOCTYPE', '<html') }
  lines = lines[first_html..] if first_html && first_html > 0
  lines.reject! { |l| l.strip.start_with?('<!DOCTYPE') }

  text = lines.join

  # Strip ERB debug comments: <!-- BEGIN ... --> and <!-- END ... -->
  text.gsub!(/<!--\s*(?:BEGIN|END)\s+.*?-->\n?/m, '')

  # Strip CSRF meta tag
  text.gsub!(/<meta\s+name="csrf-token"[^>]*>\n?/, '')

  # Strip importmap script block
  text.gsub!(/<script\s+type="importmap"[^>]*>.*?<\/script>\n?/m, '')

  # Strip modulepreload links
  text.gsub!(/<link\s+rel="modulepreload"[^>]*>\n?/, '')

  # Strip module import script
  text.gsub!(/<script\s+type="module">.*?<\/script>\n?/m, '')

  # Strip Rails-only application.css stylesheet
  text.gsub!(/<link\s+rel="stylesheet"\s+href="\/assets\/application-[^"]*"[^>]*>\n?/, '')

  # Normalize asset fingerprints: /assets/name-HASH.ext → /assets/name.ext
  text.gsub!(%r{/assets/([\w/]+)-[A-Za-z0-9]{8,}\.(css|js|png|svg|jpg)}, '/assets/\1.\2')

  # Note: data-turbo-track is now produced by both Rails and Juntos

  # Strip trailing self-closing slash inconsistencies: normalize " />" to ">"
  text.gsub!(%r{\s*/>}, '>')

  # Note: flash notice placeholder now handled correctly by both Rails and Juntos

  # Strip empty authenticity_token hidden inputs (present in Juntos forms, absent in Rails routes.call)
  text.gsub!(/<input\s+type="hidden"\s+name="authenticity_token"\s+value="">\s*/, '')

  # Strip leading/trailing whitespace per line (indentation differs between Rails and Juntos)
  text = text.lines.map { |l| l.strip }.join("\n")

  # Remove all blank lines (whitespace differences between Rails and Juntos are not meaningful)
  text.gsub!(/\n{2,}/, "\n")

  # Trim leading/trailing whitespace
  text.strip + "\n"
end

# Render a path via Rails
def rails_render(path)
  path_info, query_string = path.split('?', 2)
  env = {
    "PATH_INFO" => path_info,
    "REQUEST_METHOD" => "GET",
    "QUERY_STRING" => query_string || ""
  }
  code, _headers, response = Rails.application.routes.call(env)
  return nil unless code == 200

  response.body.force_encoding('utf-8')
end

# Render a path via Juntos
def juntos_render(path)
  stdout, stderr, status = Open3.capture3("npx", "juntos", "render", "--html", path)
  return nil unless status.success?

  stdout
end

# Compare two strings and return diff
def compute_diff(rails_html, juntos_html, path)
  rails_file = Tempfile.new([ 'rails', '.html' ])
  juntos_file = Tempfile.new([ 'juntos', '.html' ])
  begin
    rails_file.write(rails_html)
    rails_file.close
    juntos_file.write(juntos_html)
    juntos_file.close

    diff, = Open3.capture2(
      "diff", "-u",
      "--label", "rails:#{path}",
      "--label", "juntos:#{path}",
      rails_file.path, juntos_file.path
    )
    diff
  ensure
    rails_file.unlink
    juntos_file.unlink
  end
end

# Process each path
exit_code = 0
results = []

paths.each do |path|
  $stderr.print "  #{path} ... "

  rails_html = rails_render(path)
  unless rails_html
    $stderr.puts "Rails render failed"
    results << { path: path, status: :rails_error }
    exit_code = 1
    next
  end

  juntos_html = juntos_render(path)
  unless juntos_html
    $stderr.puts "Juntos render failed"
    results << { path: path, status: :juntos_error }
    exit_code = 1
    next
  end

  rails_norm = normalize(rails_html)
  juntos_norm = normalize(juntos_html)

  if rails_norm == juntos_norm
    $stderr.puts "match"
    results << { path: path, status: :match }
  else
    diff = compute_diff(rails_norm, juntos_norm, path)
    diff_lines = diff.lines.count { |l| l.start_with?('+', '-') && !l.start_with?('+++', '---') }
    $stderr.puts "#{diff_lines} line(s) differ"
    results << { path: path, status: :differ, diff: diff, diff_lines: diff_lines }
    exit_code = 1
  end

  if options[:verbose]
    puts "=== Rails normalized: #{path} ==="
    puts rails_norm
    puts "=== Juntos normalized: #{path} ==="
    puts juntos_norm
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
  when :rails_error
    puts "  #{r[:path]}  RAILS ERROR"
  when :juntos_error
    puts "  #{r[:path]}  JUNTOS ERROR"
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
