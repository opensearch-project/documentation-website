# frozen_string_literal: true

require_relative 'base_mustache_renderer'

# Renders paths and http methods
class PathsAndMethods < BaseMustacheRenderer
  self.template_file = "#{__dir__}/templates/paths_and_methods.mustache"

  # @param [Action] action API Action
  def initialize(action)
    super
    @action = action
  end

  def operations
    ljust = @action.operations.map { |op| op.http_verb.length }.max
    @action.operations
           .sort_by { |op| [op.url.length, op.http_verb] }
           .map { |op| { verb: op.http_verb.ljust(ljust), path: op.url } }
  end
end
