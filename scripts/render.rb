#!/usr/bin/env ruby
# frozen_string_literal: true

# Render Rails pages without starting a server
#
# Usage:
#   scripts/render.rb [options] PATH [PATH...]
#
# Options:
#   --check           Only check if page renders (exit 0 on success, 1 on failure)
#   --html            Output full HTML content
#   --search TEXT     Search for specific text in rendered output
#   --test            Use test database with fixtures
#   --verbose, -v     Show detailed information
#   --help, -h        Show this help message
#
# Examples:
#   scripts/render.rb /studios
#   scripts/render.rb --check / /studios /people /heats /dances
#   scripts/render.rb --html /studios
#   scripts/render.rb --search "Studios" /
#   scripts/render.rb --test /studios

require 'optparse'

options = {
  check: false,
  html: false,
  search: nil,
  verbose: false,
  test: false
}

parser = OptionParser.new do |opts|
  opts.banner = "Usage: scripts/render.rb [options] PATH [PATH...]"
  opts.separator ""
  opts.separator "Render Rails pages without starting a server"
  opts.separator ""

  opts.on("--check", "Only check if page renders (exit 0/1)") do
    options[:check] = true
  end

  opts.on("--html", "Output full HTML content (single path only)") do
    options[:html] = true
  end

  opts.on("--search TEXT", "Search for text in rendered output") do |text|
    options[:search] = text
  end

  opts.on("--test", "Use test database with fixtures") do
    options[:test] = true
  end

  opts.on("-v", "--verbose", "Show detailed information") do
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

# Load test fixtures if --test
if options[:test]
  require 'rake'
  Rails.application.load_tasks
  Rake::Task['db:prepare'].invoke
  Rake::Task['db:fixtures:load'].invoke
end

# Render each path
exit_code = 0

paths.each do |path|
  path_info, query_string = path.split('?', 2)

  env = {
    "PATH_INFO" => path_info,
    "REQUEST_METHOD" => "GET",
    "QUERY_STRING" => query_string || "",
    "SERVER_NAME" => "localhost",
    "SERVER_PORT" => "3000",
    "HTTP_HOST" => "localhost:3000",
    "rack.url_scheme" => "http"
  }

  begin
    code, headers, response = Rails.application.routes.call(env)
    html = code == 200 ? response.body.force_encoding('utf-8') : nil

    if options[:html]
      if code == 200
        puts html
      else
        $stderr.puts "Error: #{path} returned HTTP #{code}"
        exit_code = 1
      end

    elsif options[:search]
      if code == 200 && html.include?(options[:search])
        puts "Found: \"#{options[:search]}\" in #{path}"
      elsif code == 200
        $stderr.puts "Not found: \"#{options[:search]}\" in #{path}"
        exit_code = 1
      else
        $stderr.puts "Error: #{path} returned HTTP #{code}"
        exit_code = 1
      end

    elsif options[:check]
      if code != 200
        exit_code = 1
        $stderr.puts "#{code} #{path}" if options[:verbose]
      else
        $stderr.puts "200 #{path}" if options[:verbose]
      end

    else
      if code == 200
        size = html.bytesize
        size_str = size > 1024 ? "#{(size / 1024.0).round(1)}KB" : "#{size}B"
        puts "200 OK  #{path}  (#{size_str})"
      else
        $stderr.puts "#{code} Error  #{path}"
        exit_code = 1
      end
    end

  rescue => e
    $stderr.puts "500 Error  #{path}"
    $stderr.puts "  #{e.message}" if options[:verbose]
    $stderr.puts e.backtrace.first(5).map { |l| "  #{l}" }.join("\n") if options[:verbose]
    exit_code = 1
  end
end

exit exit_code
