# frozen_string_literal: true

require_relative 'utils'
require_relative 'spec_insert_error'
require 'json'
# Doc Insert Arguments
class InsertArguments
  attr_reader :raw

  Rest = Struct.new(:verb, :path, :query, :body, :raw_lines, keyword_init:true)

  # @param [Hash] args raw arguments read from the doc insert marker
  def initialize(args)
    @raw = args.to_h.with_indifferent_access
  end

  # @param [Array<String>] lines the lines between "<!-- doc_insert_start" and "<!-- spec_insert_end -->"
  # @return [InsertArguments]
  def self.from_marker(lines)
    # Extract lines between start and end marker
    end_index = lines.each_with_index.find { |line, _index| line.match?(/^\s*-->/) }&.last&.- 1
    args = {}
    i = 1

    while i <= end_index
      line = lines[i]
      next unless line.include?(':')

      key, value = line.split(':', 2)
      key = key.strip
      value = value.strip

      if value == '|'
        # Multi-line block value
        multiline_value = []
        i += 1
        while i <= end_index
          line = lines[i]
          break if line.match?(/^\s*\w+:/) # Stop at new top-level key
          multiline_value << line.rstrip
          i += 1
        end
        args[key] = multiline_value.join("\n")
        next
      else
        args[key] = value
      end
      i += 1
    end

    new(args)
  end

  # @return [String]
  def api
    return @raw['api'] if @raw['api'].present?

    if rest_line = rest&.raw_lines&.first
      inferred_action = Api::Action.find_by_rest(rest_line)
      raise SpecInsertError, "Could not infer API from rest line: #{rest_line}" unless inferred_action

      return inferred_action.full_name
    end

    nil
  end

  # @return [String]
  def component
    @raw['component'].tap do |component|
      raise SpecInsertError, 'Component not specified.' if component.nil?
      raise SpecInsertError, "Invalid component: #{component}" unless component.in?(Utils::COMPONENTS)
    end
  end

  # @return [Array<String>]
  def columns
    parse_array(@raw['columns']) || []
  end

  def skip?
    parse_boolean(@raw['skip'], default: false)
  end

  # @return [Boolean]
  def pretty
    parse_boolean(@raw['pretty'], default: false)
  end

  def include_client_setup
    parse_boolean(@raw['include_client_setup'], default: false)
  end

  # @return [Boolean]
  def include_global
    parse_boolean(@raw['include_global'], default: false)
  end

  # @return [Boolean]
  def include_deprecated
    parse_boolean(@raw['include_deprecated'], default: true)
  end

  # @return [Boolean]
  def omit_header
    parse_boolean(@raw['omit_header'], default: false)
  end

  # @return [Rest, nil]
  def rest
    lines = @raw['rest']&.split("\n")&.map(&:strip) || []
    return nil if lines.empty?

    verb, full_path = lines.first.to_s.split
    path, query_string = full_path.to_s.split('?', 2)

    query = (query_string || "").split('&').to_h do |pair|
      k, v = pair.split('=', 2)
      [k, v || "false"]
    end

    body = begin
             JSON.parse(@raw['body']) if @raw['body']
           rescue JSON::ParserError
             @raw['body']
           end

    Rest.new(
      verb: verb,
      path: path,
      query: query,
      body: body,
      raw_lines: lines
    )
  end

  private

  # @param [String] value comma-separated array
  def parse_array(value)
    return nil if value.nil?
    value.split(',').map(&:strip)
  end

  # @param [String] value
  # @param [Boolean] default value to return when nil
  def parse_boolean(value, default:)
    return default if value.nil?
    return true if value.in?(%w[true True TRUE yes Yes YES 1])
    return false if value.in?(%w[false False FALSE no No NO 0])
    raise ArgumentError, "Invalid boolean value: #{value}"
  end
end
