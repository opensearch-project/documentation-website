# frozen_string_literal: true

require_relative 'utils'
require_relative 'spec_insert_error'

# Doc Insert Arguments
class InsertArguments
  attr_reader :raw

  # @param [Hash] args raw arguments read from the doc insert marker
  def initialize(args)
    @raw = args.to_h.with_indifferent_access
  end

  # @param [Array<String>] lines the lines between "<!-- doc_insert_start" and "<!-- spec_insert_end -->"
  # @return [InsertArguments]
  def self.from_marker(lines)
    end_index = lines.each_with_index.find { |line, _index| line.match?(/^\s*-->/) }&.last&.- 1
    args = lines[1..end_index].filter { |line| line.include?(':') }.to_h do |line|
      key, value = line.split(':',2)
      [key.strip, value.strip]
    end
    new(args)
  end

  # @return [String]
  def api
    @raw['api']
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

  # @return [Boolean]
  def pretty
    parse_boolean(@raw['pretty'], default: false)
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
