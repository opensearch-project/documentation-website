# frozen_string_literal: true

require_relative 'table_renderer'

# Renders a table of parameters of an API action
class ParameterTableRenderer
  # @param [Array<Parameter>] parameters
  # @param [InsertArguments] args
  def initialize(parameters, args)
    @columns = args.columns
    @pretty = args.pretty
    @parameters = parameters
    @parameters = @parameters.reject(&:deprecated) unless args.include_deprecated
    @parameters = @parameters.sort_by { |arg| [arg.required ? 0 : 1, arg.deprecated ? 1 : 0, arg.name] }
  end

  # @return [String]
  def render
    columns = @columns.map { |col| TableRenderer::Column.new(col, col) }
    rows = @parameters.map { |arg| row(arg) }
    TableRenderer.new(columns, rows, pretty: @pretty).render_lines.join("\n")
  end

  private

  def row(param)
    {
      'Parameter' => "`#{param.name}`#{' <br> _DEPRECATED_' if param.deprecated}",
      'Description' => description(param),
      'Required' => param.required ? 'Required' : nil,
      'Data Type' => param.doc_type,
      'Default' => param.default.nil? ? nil : "`#{param.default}`"
    }
  end

  def description(param)
    deprecation = deprecation(param)
    required = param.required && @columns.exclude?('Required') ? '**(Required)** ' : ''
    description = param.description.gsub("\n", ' ')
    default = param.default.nil? || @columns.include?('Default') ? '' : " _(Default: `#{param.default}`)_"

    "#{deprecation}#{required}#{description}#{default}"
  end

  def deprecation(param)
    message = ": #{param.deprecation_message}" if param.deprecation_message.present?
    since = " since #{param.version_deprecated}" if param.version_deprecated.present?
    "_(Deprecated#{since}#{message})_ " if param.deprecated
  end
end
