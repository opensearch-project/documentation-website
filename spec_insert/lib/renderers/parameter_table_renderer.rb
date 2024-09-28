# frozen_string_literal: true

require_relative 'table_renderer'

# Renders a table of parameters of an API action
class ParameterTableRenderer
  COLUMNS = %w[Parameter Description Required Type Default].freeze
  DEFAULT_COLUMNS = %w[Parameter Type Description].freeze

  # @param [Array<Parameter>] parameters
  # @param [Boolean] include_global whether to include global arguments
  # @param [Boolean] include_deprecated whether to include deprecated arguments
  # @param [Boolean] pretty whether to render a pretty table or a compact one
  def initialize(parameters, include_global: false, include_deprecated: true, columns: DEFAULT_COLUMNS, pretty: false)
    columns ||= DEFAULT_COLUMNS
    invalid = columns - COLUMNS
    raise ArgumentError, "Invalid column(s): #{invalid.join(', ')}" unless invalid.empty?

    @pretty = pretty
    @columns = columns
    @parameters = parameters
    @parameters = @parameters.reject(&:deprecated) unless include_deprecated
    @parameters += Parameter.global if include_global
    @parameters = @parameters.sort_by { |arg| [arg.required ? 0 : 1, arg.deprecated ? 1 : 0, arg.name] }
  end

  # @return [Array<String>]
  def render_lines
    columns = @columns.map { |col| TableRenderer::Column.new(col, col) }
    rows = @parameters.map { |arg| row(arg) }
    TableRenderer.new(columns, rows, pretty: @pretty).render_lines
  end

  private

  def row(param)
    {
      'Parameter' => "`#{param.name}`#{' <br> _DEPRECATED_' if param.deprecated}",
      'Description' => description(param),
      'Required' => param.required ? 'Required' : nil,
      'Type' => param.doc_type,
      'Default' => param.default
    }
  end

  def description(param)
    deprecation = deprecation(param)
    required = param.required && @columns.exclude?('Required') ? '**(Required)** ' : ''
    description = param.description.gsub("\n", ' ')
    default = param.default.nil? || @columns.includes('Default') ? '' : " _(Default: #{param.default})_"

    "#{deprecation}#{required}#{description}#{default}"
  end

  def deprecation(param)
    message = ": #{param.deprecation_message}" if param.deprecation_message.present?
    since = " since #{param.version_deprecated}" if param.version_deprecated.present?
    "_(Deprecated#{since}#{message})_ " if param.deprecated
  end
end
