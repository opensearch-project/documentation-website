require 'json'

class ExampleCodePython < BaseMustacheRenderer
  self.template_file = "#{__dir__}/templates/example_code.python.mustache"

  def initialize(action, args)
    super(action, args)
  end

  def call_code
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

    parts = @action.full_name.split('.')
    client_call = "client"

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
    full_path = [rest.path, rest.query&.map { |k,v| "#{k}=#{v}" }.join('&')].compact.join('?')
    path_part, query_string = full_path.to_s.split('?', 2)
    path_values = path_part.split('/').reject(&:empty?)

    spec_path = match_spec_path(full_path)
    spec_parts = spec_path.split('/').reject(&:empty?)

    param_mapping = {}
    spec_parts.each_with_index do |part, i|
      if part =~ /\{(.+?)\}/ && path_values[i]
        param_mapping[$1] = path_values[i]
      end
    end

    @action.path_parameters.each do |param|
      if param_mapping.key?(param.name)
        args << "#{param.name} = \"#{param_mapping[param.name]}\""
      end
    end

    if query_string
      query_pairs = query_string.split('&').map { |s| s.split('=', 2) }
      query_hash = query_pairs.map do |k, v|
        "\"#{k}\": #{v ? "\"#{v}\"" : "\"true\""}"
      end.join(', ')
      args << "params = { #{query_hash} }" unless query_hash.empty?
    end

    body = rest.body
    if expects_body?(http_verb)
      if body
        raw_body = @args.raw['body']
        begin
          parsed = JSON.parse(raw_body)
          pretty = JSON.pretty_generate(parsed).gsub(/^/, '  ')
          args << "body = #{pretty}"
        rescue JSON::ParserError
          if raw_body.include?("\n")
            args << "body = '''\n#{raw_body.rstrip}\n'''"
          else
            args << "body = #{JSON.dump(raw_body)}"
          end
        end
      else
        args << 'body = { "Insert body here" }'
      end
    end

    python_setup = if args.empty?
                      "response = #{client_call}()"
                    else
                      final_args = args.map { |line| "  #{line}" }.join(",\n")
                      <<~PYTHON
                
                        response = #{client_call}(
                        #{final_args}
                        )
                      PYTHON
                    end
    if @args.include_client_setup
      client_setup + python_setup
    else
      python_setup
    end
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
