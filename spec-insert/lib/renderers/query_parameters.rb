# frozen_string_literal: true

require_relative 'base_mustache_renderer'
require_relative 'parameter_table_renderer'

# Renders query parameters
class QueryParameters < BaseMustacheRenderer
  self.template_file = "#{__dir__}/templates/query_parameters.mustache"

  def table
    ParameterTableRenderer.new(params, @args).render
  end

  def optional
    params.none?(&:required)
  end

  private

  def params
    return @params if defined?(@params)
    @params = @action.arguments.select { |arg| arg.location == ArgLocation::QUERY }
    @params += Parameter.global if @args.include_global
    @params
  end
end
