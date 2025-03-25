# frozen_string_literal: true

require 'yaml'
require_relative 'spec_hash'
require_relative 'doc_processor'

# Utility methods for the Spec-Insert
module Utils
  REPO_ROOT = File.expand_path('../..', __dir__)
  SPEC_FILE = File.join(REPO_ROOT, 'spec-insert/opensearch-openapi.yaml')
  COMPONENTS = {
    'endpoints' => 'Endpoints',
    'query_parameters' => 'Query Parameters',
    'path_parameters' => 'Path Parameters',
    'request_body_parameters' => 'Request Body Parameters',
    'response_body_parameters' => 'Response Body Parameters'
  }.freeze

  # @return [Array<String>] list of markdown files to insert the spec components into
  def self.target_files
    excluded_paths = config_exclude.map { |path| File.join(REPO_ROOT, path) }
    Dir.glob(File.join(REPO_ROOT, '**/*.md')).filter do |file|
      excluded_paths.none? { |exc| file.start_with?(exc) }
    end
  end

  # @return [Array<String>] list of paths excluded by Jekyll
  def self.config_exclude
    YAML.load_file(File.join(REPO_ROOT, '_config.yml'))['exclude']
  end

  def self.load_spec(forced: false, logger: nil)
    download_spec(forced:, logger:)
    SpecHash.load_file(SPEC_FILE)
  end

  def self.download_spec(forced: false, logger: nil)
    return if !forced && File.exist?(SPEC_FILE) && (File.mtime(SPEC_FILE) > 1.day.ago)
    logger&.info 'Downloading OpenSearch API specification...'
    system 'curl -L -X GET ' \
           'https://github.com/opensearch-project/opensearch-api-specification' \
           '/releases/download/main-latest/opensearch-openapi.yaml ' \
           "-o #{SPEC_FILE}"
  end

  # @return [Hash] where each is an API/action name and each value is an array of generated component for that API
  def self.utilized_components
    @utilized_components ||= begin
      logger = Logger.new(IO::NULL)
      spec_inserts = target_files.flat_map { |file| DocProcessor.new(file, logger:).spec_inserts }
      Set.new(spec_inserts.map { |insert| [insert.args.api, insert.args.component] })
         .to_a.group_by(&:first).transform_values { |values| values.map(&:last) }
    end
  end

  # @param [String] value
  # @return [Boolean]
  def self.parse_boolean(value)
    return true if value == true || value =~ /^(true|t|yes|y|1)$/i
    return false if value == false || value.nil? || value =~ /^(false|f|no|n|0)$/i
    raise ArgumentError, "invalid value for Boolean: #{value}"
  end
end
