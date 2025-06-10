# frozen_string_literal: true

require 'yaml'
require_relative 'spec_hash'

# Utility methods for the Spec-Insert
module Utils
  REPO_ROOT = File.expand_path('../..', __dir__)
  SPEC_INSERT_DIR = File.join(REPO_ROOT, 'spec-insert')
  SPEC_FILE = File.join(SPEC_INSERT_DIR, 'opensearch-openapi.yaml')
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

  # @param [String] api
  # @param [String] component
  # @return [Array<string>] lines representing dummy marker used as input for SpecInsert
  def self.dummy_marker(api, component)
    [
      '<!-- doc_insert_start',
      "api: #{api}",
      "component: #{component}",
      '-->',
      '<!-- spec_insert_end -->'
    ]
  end
end
