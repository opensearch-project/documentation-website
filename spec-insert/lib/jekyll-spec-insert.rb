# frozen_string_literal: true

require 'active_support/all'
require 'listen'
require 'yaml'
require_relative 'spec_hash'
require_relative 'doc_processor'
require_relative 'utils'

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
        Utils.load_spec(forced: options['refresh-spec'], logger: Jekyll.logger)
        Utils.target_files.each { |file| process_file(file, fail_on_error: options['fail-on-error']) }
        watch(fail_on_error: options['fail-on-error']) if options['watch']
      end
    end
  end

  def self.process_file(file, fail_on_error: false)
    DocProcessor.new(file, logger: Jekyll.logger).process
  rescue StandardError => e
    raise e if fail_on_error
    relative_path = Pathname(file).relative_path_from(Pathname.new(Dir.pwd))
    Jekyll.logger.error "Error processing #{relative_path}: #{e.message}"
  end

  def self.watch(fail_on_error: false)
    excluded_paths = Utils.config_exclude.map { |path| /\.#{path}$/ }

    Listen.to(Dir.pwd, only: /\.md$/, ignore: excluded_paths) do |modified, added, _removed|
      (modified + added).each { |file| process_file(file, fail_on_error:) }
    end.start

    trap('INT') { exit }
    trap('TERM') { exit }
    sleep
  end
end
