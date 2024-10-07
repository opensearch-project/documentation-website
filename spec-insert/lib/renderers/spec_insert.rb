# frozen_string_literal: true

require_relative 'base_mustache_renderer'
require_relative '../insert_arguments'
require_relative '../api/action'
require_relative '../spec_insert_error'
require_relative 'paths_and_methods'
require_relative 'path_parameters'
require_relative 'query_parameters'

# Class to render spec insertions
class SpecInsert < BaseMustacheRenderer
  COMPONENTS = Set.new(%w[query_params path_params paths_and_http_methods]).freeze
  self.template_file = "#{__dir__}/templates/spec_insert.mustache"

  # @param [Array<String>] arg_lines the lines between <!-- doc_insert_start and -->
  def initialize(arg_lines)
    super
    @args = InsertArguments.new(arg_lines)
    @action = Action.actions[@args.api]
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
    when :paths_and_http_methods
      PathsAndMethods.new(@action).render
    else
      raise SpecInsertError, "Invalid component: #{@args.component}"
    end
  end
end
