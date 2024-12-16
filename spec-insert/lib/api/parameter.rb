# frozen_string_literal: true

module ArgLocation
  PATH = :path
  QUERY = :query
end

# Represents a parameter of an API action
class Parameter
  # @return [String] The name of the parameter
  attr_reader :name
  # @return [String] The description of the parameter
  attr_reader :description
  # @return [Boolean] Whether the parameter is required
  attr_reader :required
  # @return [SpecHash] The JSON schema of the parameter
  attr_reader :schema
  # @return [String] Argument type in documentation
  attr_reader :doc_type
  # @return [String] The default value of the parameter
  attr_reader :default
  # @return [Boolean] Whether the parameter is deprecated
  attr_reader :deprecated
  # @return [String] The deprecation message
  attr_reader :deprecation_message
  # @return [String] The OpenSearch version when the parameter was deprecated
  attr_reader :version_deprecated
  # @return [ArgLocation] The location of the parameter
  attr_reader :location

  def initialize(name:, description:, required:, schema:, default:, deprecated:, deprecation_message:,
                 version_deprecated:, location:)
    @name = name
    @description = description
    @required = required
    @schema = schema
    @doc_type = get_doc_type(schema).gsub('String / List', 'List').gsub('List / String', 'List')
    @default = default
    @deprecated = deprecated
    @deprecation_message = deprecation_message
    @version_deprecated = version_deprecated
    @location = location
  end

  # @param [SpecHash | nil] schema
  # @return [String | nil] Documentation type
  def get_doc_type(schema)
    return nil if schema.nil?
    union = schema.anyOf || schema.oneOf
    return union.map { |sch| get_doc_type(sch) }.join(' / ') unless union.nil?
    return 'Integer' if schema.type == 'integer'
    return 'Float' if schema.type == 'number'
    return 'Boolean' if schema.type == 'boolean'
    return 'String' if schema.type == 'string'
    return 'NULL' if schema.type == 'null'
    return 'List' if schema.type == 'array'
    'Object'
  end

  # @param [SpecHash] Full OpenAPI spec
  def self.global=(spec)
    @global = spec.components.parameters.filter { |_, p| p['x-global'] }.map { |_, p| from_parameters([p], 1) }
  end

  # @return [Array<Parameter>] Global parameters
  def self.global
    raise 'Global parameters not set' unless @global
    @global
  end

  # @param [Array<SpecHash>] operations List of operations of the same group
  # @return [Array<Parameter>] List of parameters of the operation group
  def self.from_operations(operations)
    operations.flat_map(&:parameters).filter { |param| !param['x-global'] }
              .group_by(&:name).values.map { |params| from_parameters(params, operations.size) }
  end

  # @param [Array<SpecHash>] params List of parameters of the same name
  # @param [Integer] opts_count Number of operations involved
  # @return [Parameter] Single parameter distilled from the list
  def self.from_parameters(params, opts_count)
    param = params.first || SpecHash.new
    schema = param&.schema || SpecHash.new
    Parameter.new(name: param.name,
                  description: param.description || schema.description,
                  required: params.filter(&:required).size >= opts_count,
                  schema:,
                  default: param.default || schema.default,
                  deprecated: param.deprecated || schema.deprecated,
                  deprecation_message: param['x-deprecation-message'] || schema['x-deprecation-message'],
                  version_deprecated: param['x-version-deprecated'] || schema['x-version-deprecated'],
                  location: params.any? { |p| p.in == 'path' } ? ArgLocation::PATH : ArgLocation::QUERY)
  end
end
