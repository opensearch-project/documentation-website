# frozen_string_literal: true

require_relative 'parameter'
require_relative '../config'

module Api
  # Represents a group of parameters of an object within a request or response body
  class BodyParameterGroup
    def self.from_schema(schema, description:, ancestors:)
      is_array = schema.type == 'array' || schema.items.present?
      parameters = BodyParameter.from_schema(is_array ? schema.items : schema)
      new(parameters:, ancestors:, description:, is_array:)
    end

    attr_reader :parameters, :ancestors, :description, :is_array

    # @param [Array<Api::BodyParameter>] parameters
    # @param [Array<String>] ancestors
    # @param [String] description
    # @param [Boolean] is_array
    def initialize(parameters:, ancestors:, description:, is_array:)
      @parameters = parameters
      @ancestors = ancestors
      @description = description
      @is_array = is_array
      parameters.each { |param| param.group = self }
    end

    # @return [Array<BodyParameterGroup>] The child groups of the group
    def descendants
      @parameters.map(&:child_params_group).compact.flat_map do |group|
        [group] + group.descendants
      end
    end
  end

  # TODO: Handle cyclic references
  # Represents a body parameter of different levels of a request or response body
  class BodyParameter < Parameter
    # @param [SpecHash] schema The schema of an object
    # @return [Array<Api::BodyParameter>] The parameters of the object
    def self.from_schema(schema)
      properties = schema.properties || {}
      parameters = properties.map do |name, prop|
        BodyParameter.new(name:, schema: prop, required: schema.required&.include?(name))
      end.sort { |a, b| a.name <=> b.name }
      return parameters unless schema.additionalProperties
      additional_schema = schema.additionalProperties === true ? {} : schema.additionalProperties
      free_form_name = CONFIG.param_table.parameter_column.freeform_text
      parameters + [BodyParameter.new(name: free_form_name, schema: SpecHash.new(additional_schema))]
    end

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

    # @return [BodyParameterGroup, nil] The parameters of the object
    def child_params_group
      return nil unless @include_object
      return @child_params_group if defined?(@child_params_group)
      @child_params_group ||= BodyParameterGroup.from_schema(
        @schema,
        ancestors: @group.ancestors + [@name],
        description: @description
      )
    end

    private

    # TODO: Turn this into a configurable setting
    def parse_array(schema)
      "Array of #{parse_doc_type(schema.items).pluralize}"
    end
  end
end
