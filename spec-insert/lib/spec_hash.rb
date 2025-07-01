# frozen_string_literal: true

require_relative 'config'
require_relative 'dot_hash'
require_relative 'api/action'
require_relative 'api/parameter'

# Spec class for parsing OpenAPI spec
# It's basically a wrapper around a Hash that allows for accessing hash values as object attributes
# and resolving of $refs
class SpecHash < DotHash
  def self.load_file(file_path)
    @root = YAML.load_file(file_path)
    parsed = SpecHash.new(@root)
    Api::Action.actions = parsed
    Api::Parameter.global = parsed
  end

  # @return [Hash] Root of the raw OpenAPI Spec used to resolve $refs
  class << self; attr_accessor :root; end

  def description
    text = @hash['description']
    return unless text.present?
    CONFIG.text_replacements.each { |h| text.gsub!(h['replace'], h['with']) }
    text
  end

  private

  def parse(value)
    return value.map { |v| parse(v) } if value.is_a?(Array)
    return value if value.is_a?(SpecHash.class)
    return value unless value.is_a?(Hash)
    ref = value.delete('$ref')
    value.transform_values! { |v| parse(v) }
    value.merge!(resolve(ref)) if ref
    SpecHash.new(value)
  end

  def resolve(ref)
    parts = ref.split('/')
    parts.shift
    self.class.root.dig(*parts)
  end
end
