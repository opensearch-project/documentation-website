# frozen_string_literal: true

require_relative 'table_renderer'
require_relative '../config'

# Renders a table of parameters of an API action
class ParameterTableRenderer
  COLUMNS = ['Parameter', 'Description', 'Required', 'Data type', 'Default'].freeze
  DEFAULT_COLUMNS = ['Parameter', 'Data type', 'Description'].freeze

  # @param [Array<Parameter>] parameters
  # @param [InsertArguments] args
  def initialize(parameters, args)
    @config = CONFIG.param_table
    @parameters = filter_parameters(parameters, args)
    @columns = determine_columns(args)
    @pretty = args.pretty
  end

  # @return [String]
  def render
    columns = @columns.map { |col| TableRenderer::Column.new(col, col) }
    rows = @parameters.map { |arg| row(arg) }
    TableRenderer.new(columns, rows, pretty: @pretty).render_lines.join("\n")
  end

  private

  # @param [InsertArguments] args
  def determine_columns(args)
    if args.columns.present?
      invalid = args.columns - COLUMNS
      raise ArgumentError, "Invalid column(s): #{invalid.join(', ')}." unless invalid.empty?
      return args.columns
    end

    required = @parameters.any?(&:required) ? 'Required' : nil
    default = @parameters.any? { |p| p.default.present? } ? 'Default' : nil
    ['Parameter', required, 'Data type', 'Description', default].compact
  end

  # @param [Array<Parameter>] parameters
  # @param [InsertArguments] args
  def filter_parameters(parameters, args)
    parameters = parameters.reject(&:deprecated) unless args.include_deprecated
    parameters.sort_by { |arg| [arg.required ? 0 : 1, arg.deprecated ? 1 : 0, arg.name] }
  end

  def row(param)
    {
      'Parameter' => "`#{param.name}`#{' <br> _DEPRECATED_' if param.deprecated}",
      'Description' => description(param),
      'Required' => param.required ? @config.required_column.true_text : @config.required_column.false_text,
      'Data type' => param.doc_type,
      'Default' => param.default.nil? ? @config.default_column.empty_text : "`#{param.default}`"
    }
  end

  # @param [Parameter] param
  def description(param)
    deprecation = deprecation(param)
    required = param.required && @columns.exclude?('Required') ? '**(Required)** ' : ''
    description = param.description.gsub("\n", ' ')
    valid_values = valid_values(param)
    default = param.default.nil? || @columns.include?('Default') ? '' : " _(Default: `#{param.default}`)_"

    "#{deprecation}#{required}#{description}#{default}#{valid_values}"
  end

  # @param [Parameter] param
  def valid_values(param)
    enums = extract_enum_values(param.schema)&.compact
    return '' unless enums.present?
    if enums.none? { |enum| enum[:description].present? }
      " <br> Valid values are: #{enums.map { |enum| "`#{enum[:value]}`" }.join(', ')}"
    else
      " <br> Valid values are: <br> #{enums.map { |enum| "- `#{enum[:value]}`: #{enum[:description]}" }
                                           .join(' <br> ')}"
    end
  end

  # @param [SpecHash] schema
  # @return [Hash]
  def extract_enum_values(schema)
    return schema.enum.map { |value| { value: } } if schema.enum.present?
    if schema.const.present?
      { value: schema.const, description: schema.description }
    elsif schema.oneOf.present?
      schema.oneOf.map { |sch| extract_enum_values(sch) }.flatten
    end
  end

  def deprecation(param)
    message = ": #{param.deprecation_message}" if param.deprecation_message.present?
    since = " since #{param.version_deprecated}" if param.version_deprecated.present?
    "_(Deprecated#{since}#{message})_ " if param.deprecated
  end
end
