# frozen_string_literal: true

require_relative 'components/base_mustache_renderer'
require_relative 'components/parameter_table_renderer'

# Renders request body parameters
class BodyParameters < BaseMustacheRenderer
  self.template_file = "#{__dir__}/templates/body_parameters.mustache"

  def initialize(action, args, is_request:)
    super(action, args)
    @is_request = is_request
    @body = is_request ? @action.request_body : @action.response_body
    @empty = @body.empty
  end

  def header
    @header ||= "#{@is_request ? 'Request' : 'Response'} body fields"
  end

  def description
    name = "The #{@is_request ? 'request' : 'response'} body"
    required = @body.required ? ' is __required__. It' : ' is optional. It' if @is_request
    schema_desc = if @body.params_group.is_array
                    "#{name}#{required} is an __array of JSON objects__ (NDJSON). Each object has the following fields."
                  else
                    "#{name}#{required} is a JSON object with the following fields."
                  end
    [@body.params_group.description, schema_desc].compact.reject(&:empty?).join("\n\n")
  end

  def required
    @body.required
  end

  def root_tables
    render_tables(@body.params_group)
  end

  def descendants
    @body.params_group.descendants.map do |group|
      { block_name: "#{@args.api}::#{@is_request ? 'request' : 'response'}_body",
        summary: "#{header}: <code>#{group.ancestors.join('</code> > <code>')}</code>",
        description: descendant_desc(group),
        descendant_tables: render_tables(group) }
    end
  end

  private

  # @param [Api::BodyParameterGroup] group
  # @return [Array<String>]
  def render_tables(group)
    return group.members.flat_map { |g| render_tables(g) } if group.is_nested
    [ParameterTableRenderer.new(group.members, @args, is_body: true).render]
  end

  # @param [Api::BodyParameterGroup] group
  def descendant_desc(group)
    schema_desc =
      if group.is_array
        "`#{group.ancestors.last}` is an __array of JSON objects__ (NDJSON). Each object has the following fields."
      else
        "`#{group.ancestors.last}` is a JSON object with the following fields."
      end
    [group.description, schema_desc].compact.reject(&:empty?).join("\n\n")
  end
end
