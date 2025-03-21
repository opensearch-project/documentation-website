# frozen_string_literal: true

require_relative 'components/base_mustache_renderer'
require_relative '../insert_arguments'
require_relative '../api/action'
require_relative '../spec_insert_error'
require_relative 'endpoints'
require_relative 'path_parameters'
require_relative 'query_parameters'
require_relative 'body_parameters'

# Class to render spec insertions
class SpecInsert < BaseMustacheRenderer
  self.template_file = "#{__dir__}/templates/spec_insert.mustache"

  # @param [Array<String>] lines the lines between "<!-- doc_insert_start" and "<!-- spec_insert_end -->"
  def initialize(lines)
    args = InsertArguments.new(lines)
    action = Api::Action.by_full_name[args.api]
    super(action, args)
    raise SpecInsertError, '`api` argument not specified.' unless @args.api
    raise SpecInsertError, "API Action '#{@args.api}' does not exist in the spec." unless @action
  end

  def arguments
    @args.raw.map { |key, value| { key:, value: } }
  end

  def content
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
    else
      raise SpecInsertError, "Invalid component: #{@args.component}"
    end
  end
end
