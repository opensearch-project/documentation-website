# frozen_string_literal: true

require 'yaml'
require_relative 'api/action'
require_relative 'api/parameter'

# Spec class for parsing OpenAPI spec
# It's basically a wrapper around a Hash that allows for accessing hash values as object attributes
# and resolving of $refs
class SpecHash
  def self.load_file(file_path)
    @raw = YAML.load_file(file_path)
    @parsed = SpecHash.new(@raw, parsed: false)
    Action.actions = @parsed
    Parameter.global = @parsed
  end

  # @return [Hash] Raw OpenAPI Spec
  class << self; attr_reader :raw; end

  # @return [Spec] Parsed OpenAPI Spec
  class << self; attr_reader :parsed; end

  attr_reader :hash

  # @param [Hash] hash
  def initialize(hash = {}, parsed: true)
    @hash = parsed ? hash : parse(hash)
  end

  def [](key)
    parse(@hash[key])
  end

  def respond_to_missing?(name, include_private = false)
    @hash.key?(name.to_s) || @hash.respond_to?(name) || super
  end

  def method_missing(name, ...)
    return @hash.send(name, ...) if @hash.respond_to?(name)
    parse(@hash[name.to_s])
  end

  private

  def parse(value)
    return value.map { |v| parse(v) } if value.is_a?(Array)
    return value unless value.is_a?(Hash)
    ref = value.delete('$ref')
    value.transform_values! { |v| parse(v) }
    return SpecHash.new(value) unless ref
    SpecHash.new(parse(resolve(ref)).merge(value))
  end

  def resolve(ref)
    parts = ref.split('/')
    parts.shift
    self.class.raw.dig(*parts)
  end
end
