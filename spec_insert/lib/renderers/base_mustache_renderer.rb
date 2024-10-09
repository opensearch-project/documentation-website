# frozen_string_literal: true

# Base Mustache Renderer
class BaseMustacheRenderer < Mustache
  self.template_path = './lib/renderers/templates'

  def initialize(output_file)
    @output_file = output_file
    super
  end

  def generate
    @output_file.write(render)
  end
end
