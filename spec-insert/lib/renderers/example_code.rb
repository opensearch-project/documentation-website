# frozen_string_literal: true

require 'json'
require_relative 'example_code_python'

class ExampleCode < BaseMustacheRenderer
  self.template_file = "#{__dir__}/templates/example_code.mustache"

  def initialize(action, args)
    super(action, args)
  end

  def rest_lines
    @args.rest.raw_lines
  end

  def rest_code
    base = rest_lines.join("\n")
    body = @args.rest.body
    if body
      body.is_a?(String) ? base + "\n" + body : base + "\n" + JSON.pretty_generate(body)
    else
      base
    end
  end

  def python_code
    ExampleCodePython.new(@action, @args).render
  end
end
