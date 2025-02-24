# frozen_string_literal: true

require_relative 'parameter'
require_relative 'body_parameter'

module Api
  # Request or response body
  class Body
    # @return [Boolean] Whether the body is in NDJSON format
    attr_reader :ndjson

    # @return [Boolean]
    attr_reader :required

    # @return [Array<Api::BodyParameterGroup>]
    attr_reader :params_group

    # @param [SpecHash] content
    # @param [Boolean, nil] required
    def initialize(content, required:)
      @required = required
      @ndjson = content['application/json'].nil?
      spec = content['application/json'] || content['application/x-ndjson']
      @params_group = BodyParameterGroup.from_schema(
        flatten_schema(spec.schema),
        description: spec.description || spec.schema.description,
        ancestors: []
      )
    end

    # @param [SpecHash] schema
    # @return [SpecHash] a schema with allOf flattened
    def flatten_schema(schema)
      return schema if schema.type.present? && schema.type != 'object'
      return schema if schema.properties.present?
      return schema if schema.additionalProperties.present?
      return schema.anyOf.map { |sch| flatten_schema(sch) } if schema.anyOf.present?
      return schema.oneOf.map { |sch| flatten_schema(sch) } if schema.oneOf.present?
      return schema if schema.allOf.blank?

      schema = schema.allOf.each_with_object({ properties: {}, required: [] }) do |sch, h|
        sch = flatten_schema(sch)
        h[:properties].merge!(sch.properties || {})
        h[:required] += sch.required || []
        h[:additionalProperties] ||= sch.additionalProperties
      end

      SpecHash.new(schema, fully_parsed: true)
    end
  end
end
