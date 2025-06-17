# frozen_string_literal: true

class ExampleCode < BaseMustacheRenderer
  self.template_file = "#{__dir__}/templates/example_code.mustache"

  def initialize(action, args)
    super(action, args)
  end

  def query_params
    @args.raw['query_params']&.split(',')&.map(&:strip) || []
  end

  def rest_code
    method = @action.http_verbs.first.upcase rescue 'GET'
    path = @action.urls.first rescue '/'
    query = query_params
    query_string = query.any? ? "?#{query.join('&')}" : ""
    "#{method} #{path}#{query_string}"
  end

  def python_code
    query = query_params
    args = query.map { |k| "#{k}: true" }.join(', ')
    "response = client.#{@action.full_name}(#{args})"
  end

  def javascript_code
    "// TODO: add JS client call for #{@action.full_name}"
  end
end