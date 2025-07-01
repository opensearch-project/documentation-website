# frozen_string_literal: true

require_relative 'parameter'
require_relative 'body_parameter'

module Api
  # Request or response body
  class Body
    # @param [Boolean] empty whether a schema is defined
    attr_reader :empty
    # @return [Boolean]
    attr_reader :required

    # @param [SpecHash, nil] content
    # @param [Boolean, nil] required
    def initialize(content, required:)
      @required = required
      content ||= {}
      @spec = content['application/json'] || content['application/x-ndjson']
      @empty = @spec&.schema.nil?
    end

    # @return [Api::BodyParameterGroup]
    def params_group
      @params_group ||= BodyParameterGroup.new(
        schema: @spec.schema,
        description: @spec.description || @spec.schema.description,
        ancestors: []
      )
    end
  end
end
