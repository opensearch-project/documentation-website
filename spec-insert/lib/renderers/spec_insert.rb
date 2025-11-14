# frozen_string_literal: true

require_relative 'components/base_mustache_renderer'
require_relative '../api/action'
require_relative '../spec_insert_error'
require_relative 'endpoints'
require_relative 'path_parameters'
require_relative 'query_parameters'
require_relative 'body_parameters'
require_relative 'example_code'

# Class to render spec insertions
class SpecInsert < BaseMustacheRenderer
  self.template_file = "#{__dir__}/templates/spec_insert.mustache"

  # @param [InsertArguments]
  def initialize(args)
    action = Api::Action.by_full_name[args.api]
    super(action, args)
    raise SpecInsertError, '`api` argument could not be resolved.' unless @action
    raise SpecInsertError, "API Action '#{@args.api}' does not exist in the spec." unless @action
  end

  def arguments
    @args.raw.map do |key, value|
      if value.is_a?(String) && value.include?("\n")
        { key: key, value: "|\n" + value }
      else
        { key: key, value: value }
      end
    end
  end

  def api; @args.api end
  def component; @args.component end

  def content
    return "" if @args.skip?
    raise SpecInsertError, '`component` argument not specified.' unless @args.component
    case @args.component.to_sym
    when :query_parameters
      QueryParameters.new(@action, @args).render
    when :path_parameters
      PathParameters.new(@action, @args).render
    when :endpoints
      Endpoints.new(@action, @args).render
    when :request_body_parameters
      BodyParameters.new(@action, @args, is_request: true).render
    when :response_body_parameters
      BodyParameters.new(@action, @args, is_request: false).render
    when :example_code
      ExampleCode.new(@action, @args).render
    else
      raise SpecInsertError, "Invalid component: #{@args.component}, from spec_insert.rb "
    end
  end
end
