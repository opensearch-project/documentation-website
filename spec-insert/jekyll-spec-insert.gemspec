# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = 'jekyll-spec-insert'
  spec.version       = '0.1.0'
  spec.authors       = ['Theo Truong']
  spec.email         = ['theo.nam.truong@gmail.com']

  spec.summary       = 'A Jekyll plugin for inserting OpenSearch OpenAPI specifications into Jekyll sites.'

  spec.files         = Dir['lib/**/*.rb']
  spec.require_paths = ['lib']

  spec.metadata['rubygems_mfa_required'] = 'true'
  spec.required_ruby_version = '>= 3.1.0'
end
