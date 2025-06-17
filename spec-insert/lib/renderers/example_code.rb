# frozen_string_literal: true

require 'json'

class ExampleCode < BaseMustacheRenderer
  self.template_file = "#{__dir__}/templates/example_code.mustache"

  def initialize(action, args)
    super(action, args)
  end

  # Resolves the correct OpenSearch client method call
  def client_method_call
    segments = @action.full_name.to_s.split('.')
    return "client" if segments.empty?
 
    if segments.size == 1
      "client.#{segments.first}"
    else
      "client.#{se  gments.first}.#{segments[1]}"
    end
  end

  def rest_lines
    @args.raw['rest']&.split("\n")&.map(&:strip) || []
  end

  def rest_code
    rest_lines.join("\n")
  end

  # Uses the declared HTTP method in the OpenAPI spec
  def http_method
    @action.http_verbs.first&.upcase || "GET"
  end

  # Converts OpenAPI-style path (/index/{id}) into Ruby-style interpolation (/index/#{id})
  def path_only
    url = @action.urls.first
    return '' unless url
    url.gsub(/\{(\w+)\}/, '#{\1}')
  end
  def javascript_code
    "JavaScript example code not yet implemented"
  end
  # Assembles a query string from the declared query parameters
  def query_string
    return '' if @action.query_parameters.empty?
    @action.query_parameters.map { |param| "#{param.name}=example" }.join('&')
  end

  # Combines path and query string for display
  def path_with_query
    qs = query_string
    qs.empty? ? path_only : "#{path_only}?#{qs}"
  end

  # Hash version of query params
  def query_params
    @action.query_parameters.to_h { |param| [param.name, "example"] }
  end

  # Parses the body from the REST example (only for preserving raw formatting)
  def body
    body_lines = rest_lines[1..]
    return nil if body_lines.empty?
    begin
      JSON.parse(body_lines.join("\n"))
    rescue
      nil
    end
  end

  def action_expects_body?(verb)
    verb = verb.downcase
    @action.operations.any? do |op|
      op.http_verb.to_s.downcase == verb &&
        op.spec&.requestBody &&
        op.spec.requestBody.respond_to?(:content)
    end
  end

  def matching_spec_path
    return @matching_spec_path if defined?(@matching_spec_path)

    # Extract raw request path from rest line
    raw_line = rest_lines.first.to_s
    _, request_path = raw_line.split
    request_segments = request_path.split('?').first.split('/').reject(&:empty?)

    # Choose the best matching spec URL
    best = nil
    best_score = -1

    @action.urls.each do |spec_path|
      spec_segments = spec_path.split('/').reject(&:empty?)
      next unless spec_segments.size == request_segments.size

      score = 0
      spec_segments.each_with_index do |seg, i|
        if seg.start_with?('{')
          score += 1 # parameter match
        elsif seg == request_segments[i]
          score += 2 # exact match
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

    @matching_spec_path = best
  end

  # Final Python code using action metadata
  def python_code
    return "# Invalid action" unless @action&.full_name

    client_setup = <<~PYTHON
    from opensearchpy import OpenSearch
    
    host = 'localhost'
    port = 9200
    auth = ('admin', 'admin') # For testing only. Don't store credentials in code.
    ca_certs_path = '/full/path/to/root-ca.pem' # Provide a CA bundle if you use intermediate CAs with your root CA.
    
    # Create the client with SSL/TLS enabled, but hostname verification disabled.
    client = OpenSearch(
        hosts = [{'host': host, 'port': port}],
        http_compress = True, # enables gzip compression for request bodies
        http_auth = auth,
        use_ssl = True,
        verify_certs = True,
        ssl_assert_hostname = False,
        ssl_show_warn = False,
        ca_certs = ca_certs_path
    )

    PYTHON

    if @args.raw['body'] == '{"hello"}'
      puts "# This is a debug example"
    end

    namespace, method = @action.full_name.split('.')
    client_call = "client"
    client_call += ".#{namespace}" if namespace
    client_call += ".#{method}"

    args = []

    # Extract actual path and query from the first line of the REST input
    raw_line = rest_lines.first.to_s
    http_verb, full_path = raw_line.split
    path_part, query_string = full_path.to_s.split('?', 2)

    # Extract used path values from the path part
    path_values = path_part.split('/').reject(&:empty?)

    # Match spec path (e.g. /_cat/aliases/{name}) to determine which param this value belongs to
    spec_path = matching_spec_path.to_s
    spec_parts = spec_path.split('/').reject(&:empty?)

    param_mapping = {}
    spec_parts.each_with_index do |part, i|
      if part =~ /\{(.+?)\}/ && path_values[i]
        param_mapping[$1] = path_values[i]
      end
    end

    # Add path parameters if they were present in the example
    @action.path_parameters.each do |param|
      if param_mapping.key?(param.name)
        args << "#{param.name} = \"#{param_mapping[param.name]}\""
      end
    end

    # Add query parameters from query string
    if query_string
      query_pairs = query_string.split('&').map { |s| s.split('=', 2) }
      query_hash = query_pairs.map do |k, v|
        "#{k}: #{v ? "\"#{v}\"" : "True"}"
      end.join(', ')
      args << "params = { #{query_hash} }" unless query_hash.empty?
    end

    # Add body if spec allows it AND it's present in REST
    if action_expects_body?(http_verb)
      if @args.raw['body']
        begin
          parsed = JSON.parse(@args.raw['body'])
          pretty = JSON.pretty_generate(parsed).gsub(/^/, '  ')
          args << "body = #{pretty}"
        rescue JSON::ParserError
          args << "body = #{JSON.dump(@args.raw['body'])}"
        end
      else
        args << 'body = { "Insert body here" }'
      end
    end

    # Final result
    call_code = if args.empty?
                  "response = #{client_call}()"
                else
                  final_args = args.map { |line| "  #{line}" }.join(",\n")
                  <<~PYTHON
                  response = #{client_call}(
                  #{final_args}
                  )
                  PYTHON
                end
    # Prepend client if requested
    if @args.raw['include_client_setup']
      client_setup + call_code
    else
      call_code
    end
  end
end