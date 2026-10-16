# frozen_string_literal: true

require 'json'

# Renders the Python client example for an API request
class ExampleCodePython < BaseMustacheRenderer
  self.template_file = "#{__dir__}/templates/example_code.python.mustache"

  def call_code
    return '# Invalid action' unless @action&.full_name
    parts = @action.full_name.split('.')
    client_call = 'client'

    if parts.length == 2
      namespace, method = parts
      client_call += ".#{namespace}.#{method}"
    else
      namespace = parts[0]
      client_call += ".#{namespace}"
    end

    args = []

    rest = @args.rest
    http_verb = rest.verb
    full_path = [rest.path, rest.query&.map { |k, v| "#{k}=#{v}" }&.join('&')].compact.join('?')
    path_part, query_string = full_path.to_s.split('?', 2)
    path_values = path_part.split('/').reject(&:empty?)

    spec_path = match_spec_path(full_path)
    spec_parts = spec_path.split('/').reject(&:empty?)

    param_mapping = {}
    spec_parts.each_with_index do |part, i|
      param_mapping[::Regexp.last_match(1)] = path_values[i] if part =~ /\{(.+?)\}/ && path_values[i]
    end

    @action.path_parameters.each do |param|
      args << "#{param.name} = \"#{param_mapping[param.name]}\"" if param_mapping.key?(param.name)
    end

    if query_string
      query_pairs = query_string.split('&').map { |s| s.split('=', 2) }
      query_hash = query_pairs.map do |k, v|
        "\"#{k}\": \"#{v}\""
      end.join(', ')
      args << "params = { #{query_hash} }" unless query_hash.empty?
    end

    body = rest.body
    if body && expects_body?(http_verb)
      raw_body = @args.raw['body']
      begin
        parsed = JSON.parse(raw_body)
        pretty = JSON.pretty_generate(parsed).gsub(/^/, '  ')
        args << "body = #{pretty}"
      rescue JSON::ParserError
        args << if raw_body.include?("\n")
                  "body = '''\n#{raw_body.rstrip}\n'''"
                else
                  "body = #{JSON.dump(raw_body)}"
                end
      end
    end

    if args.empty?
      "response = #{client_call}()"
    else
      final_args = args.map { |line| "  #{line}" }.join(",\n")
      <<~PYTHON

        response = #{client_call}(
        #{final_args}
        )
      PYTHON
    end
  end

  def include_client_setup
    @args.include_client_setup
  end

  private

  def expects_body?(verb)
    verb = verb.downcase
    @action.operations.any? do |op|
      op.http_verb.to_s.downcase == verb &&
        op.spec&.requestBody &&
        op.spec.requestBody.respond_to?(:content)
    end
  end

  def match_spec_path(full_path)
    request_path = full_path.split('?').first
    request_segments = request_path.split('/').reject(&:empty?)

    best = ''
    best_score = -1

    @action.urls.each do |spec_path|
      spec_segments = spec_path.split('/').reject(&:empty?)
      next unless spec_segments.size == request_segments.size

      score = 0
      spec_segments.each_with_index do |seg, i|
        if seg.start_with?('{')
          score += 1
        elsif seg == request_segments[i]
          score += 2
        else
          score = -1
          break
        end
      end

      if score > best_score
        best = spec_path
        best_score = score
      end
    end

    best
  end
end
