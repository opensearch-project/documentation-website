# frozen_string_literal: true

require_relative 'parameter_table_renderer'
require_relative '../components/action'

# Class to render spec insertions
class SpecInsert
  COMPONENTS = Set.new(%w[query_params path_params paths_and_http_methods]).freeze

  # @param [Array<Hash>] args
  def initialize(args)
    @args = args
    @action = Action.actions[args['api']]
    raise ArgumentError, "API Action not found: #{args['api']}" unless @action
  end

  def render_lines
    lines = ['<!-- spec_insert_start'] +
            @args.map { |k, v| "#{k}: #{v.is_a?(Array) ? v.join(', ') : v}" } +
            ['-->'] +
            render_spec_component +
            ['<!-- spec_insert_end -->']
    lines.map { |line| "#{line}\n" }
  end

  private

  def render_spec_component
    columns = @args['columns']
    pretty = parse_boolean(@args['pretty'], default: false)
    include_global = parse_boolean(@args['include_global'], default: false)
    include_deprecated = parse_boolean(@args['include_deprecated'], default: true)

    case @args['component']
    when 'query_params', 'query_parameters'
      arguments = @action.arguments.select { |arg| arg.location == ArgLocation::QUERY }
      ParameterTableRenderer.new(arguments, columns:, include_global:, include_deprecated:, pretty:).render_lines
    when 'path_params', 'path_parameters'
      arguments = @action.arguments.select { |arg| arg.location == ArgLocation::PATH }
      ParameterTableRenderer.new(arguments, columns:, pretty:).render_lines
    when 'paths_and_http_methods'
      render_paths_and_http_methods
    else
      raise ArgumentError, "Invalid component: #{@args['component']}"
    end
  end

  # @param [String] value
  # @param [Boolean] default value to return when nil
  def parse_boolean(value, default:)
    return default if value.nil?
    return true if value.in?(%w[true True TRUE yes Yes YES 1])
    return false if value.in?(%w[false False FALSE no No NO 0])
    raise ArgumentError, "Invalid boolean value: #{value}"
  end

  # @return [Array<String>]
  def render_paths_and_http_methods
    ljust = @action.operations.map { |op| op.http_verb.length }.max
    signatures = @action.operations
                        .sort_by { |op| [op.url.length, op.http_verb] }
                        .map { |op| "#{op.http_verb.ljust(ljust)} #{op.url}" }
    ['```json'] + signatures + ['```']
  end
end
