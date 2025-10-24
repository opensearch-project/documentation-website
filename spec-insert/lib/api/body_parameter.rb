# frozen_string_literal: true

require_relative 'parameter'
require_relative '../config'

module Api
  # Represents a group of parameters of an object within a request or response body
  class BodyParameterGroup
    attr_reader :members, :ancestors, :description, :is_array, :is_nested, :schema

    # @param [SpecHash] schema schema of an object or an array of objects
    # @param [Array<String>] ancestors
    # @param [String] description
    def initialize(schema:, ancestors:, description:)
      @ancestors = ancestors
      @description = description
      @is_array = schema.items.present?
      @schema = @is_array ? schema.items : schema
      @schema = flatten_schema(@schema)
      @members = parse_members(@schema)
      @is_nested = @members.any? { |param| param.is_a?(BodyParameterGroup) }
      members.each { |param| param.group = self } unless @is_nested
    end

    # @return [Array<BodyParameterGroup>] The child groups of the group
    def descendants(seen_schemas = Set.new([@schema]))
      child_groups = @is_nested ? @members : @members.map(&:child_params_group).compact
      child_groups.reject { |g| seen_schemas.include?(g.schema) }.flat_map do |group|
        seen_schemas.add(group.schema)
        [group] + group.descendants(seen_schemas)
      end
    end

    # @param [SpecHash] schema
    # @return [Array<Api::BodyParameter>, Array<Api::BodyParameterGroup] members
    def parse_members(schema)
      union = schema.anyOf || schema.oneOf
      if union.present?
        return union.map { |sch| BodyParameterGroup.new(schema: sch, ancestors: @ancestors, description:) }
      end
      properties = schema.properties || {}
      parameters = properties.map do |name, prop|
        BodyParameter.new(name:, schema: prop, required: schema.required&.include?(name))
      end.sort { |a, b| a.name <=> b.name }
      return parameters unless schema.additionalProperties
      additional_schema = schema.additionalProperties == true ? SpecHash.new({}) : schema.additionalProperties
      free_form_name = CONFIG.param_table.parameter_column.freeform_text
      parameters + [BodyParameter.new(name: free_form_name, schema: additional_schema)]
    end

    # @param [SpecHash] schema
    # @return [SpecHash] a schema with allOf flattened
    def flatten_schema(schema)
      return schema if schema.allOf.blank?

      schema = schema.allOf.each_with_object({ 'properties' => {}, 'required' => [] }) do |sch, h|
        sch = flatten_schema(sch)
        h['properties'].merge!(sch.properties || {})
        h['required'] += sch.required || []
        h['additionalProperties'] ||= sch.additionalProperties
      end

      SpecHash.new(schema, fully_parsed: true)
    end
  end

  # TODO: Handle cyclic references
  # Represents a body parameter of different levels of a request or response body
  class BodyParameter < Parameter
    attr_accessor :group

    # @param [String] name
    # @param [SpecHash] schema
    # @param [Boolean] required
    def initialize(name:, schema:, required: false)
      super(name:,
            required:,
            schema:,
            description: schema.description,
            default: schema['default'],
            deprecated: schema.deprecated || schema['x-version-deprecated'].present?,
            version_deprecated: schema['x-version-deprecated'],
            deprecation_message: schema['x-deprecation-message'])
      @include_object = @doc_type.include?('Object')
    end

    # @return [BodyParameterGroup, nil] The parameters group of an object parameter
    def child_params_group
      return nil unless @include_object
      return @child_params_group if defined?(@child_params_group)
      @child_params_group ||= BodyParameterGroup.new(
        schema: @schema,
        ancestors: @group.ancestors + [@name],
        description: @description
      )
    end

    private

    # TODO: Turn this into a configurable setting
    def parse_array(schema)
      return 'Array' if schema.items == true || schema.items.nil?
      "Array of #{parse_doc_type(schema.items).pluralize}"
    end
  end
end
