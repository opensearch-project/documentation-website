# frozen_string_literal: true

require_relative 'table_renderer'
require_relative '../../config'

# Renders a table of parameters of an API action
class ParameterTableRenderer
  SHARED_COLUMNS = ['Description', 'Required', 'Data type', 'Default'].freeze
  URL_PARAMS_COLUMNS = (['Parameter'] + SHARED_COLUMNS).freeze
  BODY_PARAMS_COLUMNS = (['Property'] + SHARED_COLUMNS).freeze

  # @param [Array<Api::Parameter>] parameters
  # @param [InsertArguments] args
  def initialize(parameters, args, is_body: false)
    @config = CONFIG.param_table
    @parameters = filter_parameters(parameters, args)
    @is_body = is_body
    @pretty = args.pretty
    @columns = determine_columns(args)
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
      invalid = args.columns - (@is_body ? BODY_PARAMS_COLUMNS : URL_PARAMS_COLUMNS)
      raise ArgumentError, "Invalid column(s): #{invalid.join(', ')}." unless invalid.empty?
      return args.columns
    end

    required = @parameters.any?(&:required) ? 'Required' : nil
    default = @parameters.any? { |p| p.default.present? } ? 'Default' : nil
    name = @is_body ? 'Property' : 'Parameter'
    [name, required, 'Data type', 'Description', default].compact
  end

  # @param [Array<Api::Parameter>] parameters
  # @param [InsertArguments] args
  def filter_parameters(parameters, args)
    parameters = parameters.reject(&:deprecated) unless args.include_deprecated
    parameters.sort_by { |arg| [arg.required ? 0 : 1, arg.deprecated ? 1 : 0, arg.name] }
  end

  def row(param)
    parameter = "`#{param.name}`#{' <br> _DEPRECATED_' if param.deprecated}"
    {
      'Parameter' => parameter,
      'Property' => parameter,
      'Description' => description(param),
      'Required' => param.required ? @config.required_column.true_text : @config.required_column.false_text,
      'Data type' => param.doc_type,
      'Default' => param.default.nil? ? @config.default_column.empty_text : "`#{param.default}`"
    }
  end

  # @param [Api::Parameter] param
  def description(param)
    deprecation = deprecation(param)
    required = param.required && @columns.exclude?('Required') ? '**(Required)**' : ''
    description = param.description
    default = param.default.nil? || @columns.include?('Default') ? '' : "_(Default: `#{param.default}`)_"
    valid_values = valid_values(param)

    main_line = [deprecation, required, description, default].compact.map(&:strip).reject(&:empty?).join(' ')
    [main_line, valid_values].reject(&:empty?).join(' <br> ')
  end

  # @param [Api::Parameter] param
  def valid_values(param)
    enums = extract_enum_values(param.schema)&.compact
    return '' unless enums.present?
    if enums.none? { |enum| enum[:description].present? }
      "Valid values are: #{enums.map { |enum| "`#{enum[:value]}`" }.join(', ').gsub(/, ([^,]+)$/, ', and \1')}."
    else
      "Valid values are: <br> #{enums.map { |enum| "- `#{enum[:value]}`: #{enum[:description]}" }
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
    "_(Deprecated#{since}#{message})_" if param.deprecated
  end
end
