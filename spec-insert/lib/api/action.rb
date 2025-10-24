# SPDX-License-Identifier: Apache-2.0
#
# The OpenSearch Contributors require contributions made to
# this file be licensed under the Apache-2.0 license or a
# compatible open source license.

# frozen_string_literal: true

require_relative 'parameter'
require_relative 'body'
require_relative 'operation'

module Api
  # A collection of operations that comprise a single API Action
  # AKA operation-group
  class Action
    SUCCESS_CODES = %w[200 201 202 203 204 205 206 207 208 226].freeze

    # @param [SpecHash] spec Parsed OpenAPI spec
    def self.actions=(spec)
      operations = spec.paths.flat_map do |url, ops|
        ops.filter_map { |verb, op| Operation.new(op, url, verb) unless op['x-ignorable'] }
      end
      @actions = operations.group_by(&:group).values.map { |ops| Action.new(ops) }
    end

    # @return [Array<Action>] API Actions
    def self.all
      raise 'Actions not set' unless @actions
      @actions
    end

    def self.by_full_name
      @by_full_name ||= all.index_by(&:full_name).to_h
    end

    def self.by_namespace
      @by_namespace ||= all.group_by(&:namespace)
    end

    # @return [Array<Api::Operation>] Operations in the action
    attr_reader :operations

    # @param [Array<Api::Operation>] operations
    def initialize(operations)
      @operations = operations
      @operation = operations.first || {}
      @spec = @operation&.spec
    end

    def query_parameters
      @operations.map(&:spec).flat_map(&:parameters).filter { |param| !param['x-global'] && param.in == 'query' }
                 .group_by(&:name).values
                 .map { |params| Parameter.from_param_specs(params, @operations.size) }
    end

    def path_parameters
      @operations.map(&:spec).flat_map(&:parameters).filter { |param| param.in == 'path' }
                 .group_by(&:name).values
                 .map { |params| Parameter.from_param_specs(params, @operations.size) }
    end

    # @return [Api::Body] Request body
    def request_body
      @request_body ||= begin
        operation = @operations.find { |op| op.spec.requestBody.present? }
        required = @operations.all? { |op| op.spec.requestBody&.required }
        content = operation ? operation.spec.requestBody.content : nil
        Body.new(content, required:)
      end
    end

    # @return [Api::Body] Response body
    def response_body
      @response_body ||= begin
        spec = @operations.first.spec
        code = SUCCESS_CODES.find { |c| spec.responses[c].present? }
        Body.new(spec.responses[code].content, required: nil)
      end
    end

    # @return [String] Full name of the action (i.e. namespace.action)
    def full_name; @operation.group; end

    # return [String] Name of the action
    def name; @operation.action; end

    # @return [String] Namespace of the action
    def namespace; @operation.namespace || ''; end

    # @return [Array<String>] Sorted unique HTTP verbs
    def http_verbs; @operations.map(&:http_verb).uniq.sort; end

    # @return [Array<String>] Unique URLs
    def urls; @operations.map(&:url).uniq; end

    # @return [String] Description of the action
    def description; @spec.description; end

    # @return [Boolean] Whether the action is deprecated
    def deprecated; @spec.deprecated; end

    # @return [String] Deprecation message
    def deprecation_message; @spec['x-deprecation-message']; end

    def self.find_by_rest(rest_line)
      method, raw_path = rest_line.strip.split(' ', 2)
      return nil unless method && raw_path

      # Remove query parameters
      path = raw_path.split('?').first

      all.find do |action|
        action.operations.any? do |op|
          op.http_verb.casecmp?(method) &&
            path_template_matches?(op.url, path)
        end
      end
    end

    def self.path_template_matches?(template, actual)
      # "/{index}/_doc/{id}" => "^/[^/]+/_doc/[^/]+$"
      regex = Regexp.new("^" + template.gsub(/\{[^\/]+\}/, '[^/]+') + "$")
      regex.match?(actual)
    end
    # @return [String] API reference
    def api_reference; @operation.external_docs.url; end
  end
end
