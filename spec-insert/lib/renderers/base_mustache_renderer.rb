# frozen_string_literal: true

require 'mustache'

# Base Mustache Renderer
class BaseMustacheRenderer < Mustache
  self.template_path = "#{__dir__}/templates"

  def initialize(output_file = nil)
    @output_file = output_file
    super
  end

  def generate
    raise 'Output file not specified' unless @output_file
    @output_file&.write(render)
  end
end
