# frozen_string_literal: true

# DotHash is a hash that allows access to its keys using dot notation
class DotHash
  # @param [Hash] hash
  def initialize(hash = {}, fully_parsed: false)
    raise ArgumentError, "#{self.class} must be initialized with a Hash" unless hash.is_a?(Hash)
    @hash = hash
    @fully_parsed = fully_parsed
    @parsed_keys = fully_parsed ? nil : Set.new
  end

  def to_s
    "<#{self.class}: #{@hash}>"
  end

  def inspect
    "<#{self.class}: #{@hash}>"
  end

  def [](key)
    retrieve(key)
  end

  def respond_to_missing?(name, include_private = false)
    @hash.key?(name.to_s) || {}.respond_to?(name) || super
  end

  def method_missing(name, ...)
    name = name.to_s
    if {}.respond_to?(name)
      warn "Accessing Hash attribute `#{name}` which is also a key of the #{self.class} instance" if @hash.key?(name)
      return @hash.send(name, ...)
    end
    retrieve(name)
  end

  private

  def parse(value)
    return value.map { |v| parse(v) } if value.is_a?(Array)
    return value if value.is_a?(DotHash)
    return value unless value.is_a?(Hash)
    DotHash.new(value)
  end

  def retrieve(key)
    return @hash[key] if @fully_parsed || @parsed_keys.include?(key)
    @parsed_keys.add(key)
    @hash[key] = parse(@hash[key])
  end
end
