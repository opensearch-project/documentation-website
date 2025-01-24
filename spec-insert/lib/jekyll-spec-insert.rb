# frozen_string_literal: true

require 'active_support/all'
require 'listen'
require 'yaml'
require_relative 'spec_hash'
require_relative 'doc_processor'

# Jekyll plugin to insert document components generated from the spec into the Jekyll site
class JekyllSpecInsert < Jekyll::Command
  # @param [Mercenary::Program] prog
  def self.init_with_program(prog)
    prog.command(:'spec-insert') do |c|
      c.syntax 'spec-insert [options]'
      c.option 'watch', '--watch', '-W', 'Watch for changes and rebuild'
      c.option 'refresh-spec', '--refresh-spec', '-R', 'Redownload the OpenSearch API specification'
      c.option 'fail-on-error', '--fail-on-error', '-F', 'Fail on error'
      c.action do |_args, options|
        spec_file = File.join(Dir.pwd, 'spec-insert/opensearch-openapi.yaml')
        excluded_paths = YAML.load_file('_config.yml')['exclude']
        download_spec(spec_file, forced: options['refresh-spec'])
        SpecHash.load_file(spec_file)
        run_once(excluded_paths, fail_on_error: options['fail-on-error'])
        watch(excluded_paths, fail_on_error: options['fail-on-error']) if options['watch']
      end
    end
  end

  def self.download_spec(spec_file, forced: false)
    return if !forced && File.exist?(spec_file) && (File.mtime(spec_file) > 1.day.ago)
    Jekyll.logger.info 'Downloading OpenSearch API specification...'
    system 'curl -L -X GET ' \
           'https://github.com/opensearch-project/opensearch-api-specification' \
           '/releases/download/main-latest/opensearch-openapi.yaml ' \
           "-o #{spec_file}"
  end

  def self.process_file(file, fail_on_error: false)
    DocProcessor.new(file, logger: Jekyll.logger).process
  rescue StandardError => e
    raise e if fail_on_error
    Jekyll.logger.error "Error processing #{file}: #{e.message}"
  end

  def self.run_once(excluded_paths, fail_on_error: false)
    excluded_paths = excluded_paths.map { |path| File.join(Dir.pwd, path) }
    Dir.glob(File.join(Dir.pwd, '**/*.md'))
       .filter { |file| excluded_paths.none? { |excluded| file.start_with?(excluded) } }
       .each { |file| process_file(file, fail_on_error: fail_on_error) }
  end

  def self.watch(excluded_paths, fail_on_error: false)
    Jekyll.logger.info "\nWatching for changes...\n"
    excluded_paths = excluded_paths.map { |path| /\.#{path}$/ }

    Listen.to(Dir.pwd, only: /\.md$/, ignore: excluded_paths) do |modified, added, _removed|
      (modified + added).each { |file| process_file(file, fail_on_error: fail_on_error) }
    end.start

    trap('INT') { exit }
    trap('TERM') { exit }
    sleep
  end
end
