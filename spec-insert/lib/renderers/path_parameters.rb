# frozen_string_literal: true

require_relative 'base_mustache_renderer'
require_relative 'parameter_table_renderer'

# Renders path parameters
class PathParameters < BaseMustacheRenderer
  self.template_file = "#{__dir__}/templates/path_parameters.mustache"

  # @param [Action] action
  # @param [InsertArguments] args
  def initialize(action, args)
    super(nil)
    @params = action.arguments.select { |arg| arg.location == ArgLocation::PATH }
    @args = args
  end

  def table
    ParameterTableRenderer.new(@params, @args).render
  end
end
