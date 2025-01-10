# frozen_string_literal: true

require_relative 'base_mustache_renderer'
require_relative 'parameter_table_renderer'

# Renders path parameters
class PathParameters < BaseMustacheRenderer
  self.template_file = "#{__dir__}/templates/path_parameters.mustache"

  def table
    ParameterTableRenderer.new(params, @args).render
  end

  def optional
    params.none? { |param| param.required }
  end

  private

  def params
    @param ||= @action.arguments.select { |arg| arg.location == ArgLocation::PATH }
  end
end
