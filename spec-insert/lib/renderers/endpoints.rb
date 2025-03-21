# frozen_string_literal: true

require_relative 'components/base_mustache_renderer'

# Renders Endpoints
class Endpoints < BaseMustacheRenderer
  self.template_file = "#{__dir__}/templates/endpoints.mustache"

  def operations
    ljust = @action.operations.map { |op| op.http_verb.length }.max
    @action.operations
           .sort_by { |op| [op.url.length, op.http_verb] }
           .map { |op| { verb: op.http_verb.ljust(ljust), path: op.url } }
  end
end
