# frozen_string_literal: true

module Api
  # Represents a parameter of an API action
  # Acting as base class for URL parameters and Body parameters
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

    def initialize(name:, description:, required:, schema:, default:, deprecated:, deprecation_message:,
                   version_deprecated:)
      @name = name
      @description = description
      @required = required
      @schema = schema
      @doc_type = parse_doc_type(schema)
      @default = default
      @deprecated = deprecated
      @deprecation_message = deprecation_message
      @version_deprecated = version_deprecated
    end

    # @param [SpecHash] Full OpenAPI spec
    def self.global=(spec)
      @global = spec.components.parameters.filter { |_, p| p['x-global'] }.map { |_, p| from_param_specs([p], nil) }
    end

    # @return [Array<Api::UrlParameter>] Global parameters
    def self.global
      raise 'Global parameters not set' unless @global
      @global
    end

    # @param [Array<SpecHash>] params List of parameters of the same name
    # @param [Integer, nil] opts_count Number of operations involved
    # @return [UrlParameter] Single parameter distilled from the list
    def self.from_param_specs(params, opts_count)
      param = params.first || SpecHash.new
      schema = param.schema || SpecHash.new
      required = opts_count.nil? ? param.required : params.filter(&:required).size == opts_count
      Parameter.new(name: param.name,
                    description: param.description || schema.description,
                    required:,
                    schema:,
                    default: param['default'] || schema['default'],
                    deprecated: param.deprecated || schema.deprecated,
                    deprecation_message: param['x-deprecation-message'] || schema['x-deprecation-message'],
                    version_deprecated: param['x-version-deprecated'] || schema['x-version-deprecated'])
    end

    private

    # @param [SpecHash, nil] schema
    # @return [String] Documentation type
    def parse_doc_type(schema)
      return nil if schema.nil?
      return 'any' if schema == true
      union = schema.anyOf || schema.oneOf
      return union.map { |sch| parse_doc_type(sch) }.uniq.sort.join(' or ') if union.present?
      return parse_doc_type(schema.allOf.first) if schema.allOf.present?
      type = schema.type
      return 'Integer' if type == 'integer'
      return 'Float' if type == 'number'
      return 'Boolean' if type == 'boolean'
      return 'String' if type == 'string'
      return parse_array(schema) if type == 'array' || schema.items.present?
      return 'NULL' if type == 'null'
      return 'Object' if type == 'object' || type.nil?
      return type.map { |t| parse_doc_type(SpecHash.new({ 'type' => t })) }.uniq.sort.join(' or ') if type.is_a?(Array)
      raise "Unhandled JSON Schema Type: #{type}"
    end

    def parse_array(_schema)
      'List'
    end
  end
end
