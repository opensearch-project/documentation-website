# frozen_string_literal: true

require_relative 'base_mustache_renderer'
require_relative 'parameter_table_renderer'

# Renders query parameters
class QueryParameters < BaseMustacheRenderer
  self.template_file = "#{__dir__}/templates/query_parameters.mustache"

  # @param [Action] action API Action
  # @param [InsertArguments] args
  def initialize(action, args)
    super(nil)
    @params = action.arguments.select { |arg| arg.location == ArgLocation::QUERY }
    @args = args
  end

  def table
    ParameterTableRenderer.new(@params, @args).render
  end

  def optional
    @params.none?(&:required)
  end
end
