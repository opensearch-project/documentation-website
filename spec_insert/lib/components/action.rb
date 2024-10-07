# SPDX-License-Identifier: Apache-2.0
#
# The OpenSearch Contributors require contributions made to
# this file be licensed under the Apache-2.0 license or a
# compatible open source license.

# frozen_string_literal: true

require_relative 'parameter'
require_relative 'operation'

# A collection of operations that comprise a single API Action
# AKA operation-group
class Action
  # @param [SpecHash] spec Parsed OpenAPI spec
  def self.actions=(spec)
    operations = spec.paths.flat_map do |url, ops|
      ops.filter_map { |verb, op| Operation.new(op, url, verb) unless op['x-ignorable'] }
    end
    @actions = operations.group_by(&:group).values.map { |ops| Action.new(ops) }.index_by(&:full_name)
  end

  # @return [Hash<String, Action>] API Actions indexed by operation-group
  def self.actions
    raise 'Actions not set' unless @actions
    @actions
  end

  # @return [Array<Operation>] Operations in the action
  attr_reader :operations

  # @param [Array<Operation>] operations
  def initialize(operations)
    @operations = operations
    @operation = operations.first
    @spec = @operation&.spec
  end

  # @return [Array<Parameter>] Input arguments.
  def arguments; @arguments ||= Parameter.from_operations(@operations.map(&:spec)); end

  # @return [String] Full name of the action (i.e. namespace.action)
  def full_name; @operation&.group; end

  # return [String] Name of the action
  def name; @operation&.action; end

  # @return [String] Namespace of the action
  def namespace; @operation&.namespace; end

  # @return [Array<String>] Sorted unique HTTP verbs
  def http_verbs; @operations.map(&:http_verb).uniq.sort; end

  # @return [Array<String>] Unique URLs
  def urls; @operations.map(&:url).uniq; end

  # @return [String] Description of the action
  def description; @spec&.description; end

  # @return [Boolean] Whether the action is deprecated
  def deprecated; @spec&.deprecated; end

  # @return [String] Deprecation message
  def deprecation_message; @spec['x-deprecation-message']; end

  # @return [String] API reference
  def api_reference; @operation&.external_docs&.url; end
end
