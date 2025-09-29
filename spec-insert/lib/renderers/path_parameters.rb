# frozen_string_literal: true

require_relative 'components/base_mustache_renderer'
require_relative 'components/parameter_table_renderer'

# Renders path parameters
class PathParameters < BaseMustacheRenderer
  self.template_file = "#{__dir__}/templates/path_parameters.mustache"

  def table
    ParameterTableRenderer.new(params, @args).render
  end

  def optional
    params.none?(&:required)
  end

  private

  def params
    @params ||= @action.path_parameters
  end
end
