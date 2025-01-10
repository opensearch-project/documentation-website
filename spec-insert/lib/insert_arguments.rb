# frozen_string_literal: true

# Doc Insert Arguments
class InsertArguments
  COLUMNS = ['Parameter', 'Description', 'Required', 'Data Type', 'Default'].freeze
  DEFAULT_COLUMNS = ['Parameter', 'Data Type', 'Description'].freeze
  attr_reader :raw

  # @param [Array<String>] lines the lines between <!-- doc_insert_start and -->
  def initialize(lines)
    end_index = lines.each_with_index.find { |line, _index| line.match?(/^\s*-->/) }&.last&.- 1
    @raw = lines[1..end_index].filter { |line| line.include?(':') }.to_h do |line|
      key, value = line.split(':')
      [key.strip, value.strip]
    end
  end

  # @return [String]
  def api
    @raw['api']
  end

  # @return [String]
  def component
    @raw['component']
  end

  # @return [Array<String>]
  def columns
    cols = parse_array(@raw['columns']) || DEFAULT_COLUMNS
    invalid = cols - COLUMNS
    raise ArgumentError, "Invalid column(s): #{invalid.join(', ')}" unless invalid.empty?
    cols
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
