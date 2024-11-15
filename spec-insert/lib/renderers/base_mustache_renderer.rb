# frozen_string_literal: true

require 'mustache'

# Base Mustache Renderer
class BaseMustacheRenderer < Mustache
  self.template_path = "#{__dir__}/templates"

  # @param [Action] action API Action
  # @param [InsertArguments] args
  def initialize(action, args)
    super()
    @action = action
    @args = args
  end

  def omit_header
    @args.omit_header
  end
end
