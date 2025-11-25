# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = 'jekyll-pdf-generator'
  spec.version       = '0.1.0'
  spec.authors       = ['OpenSearch Contributors']
  spec.email         = []

  spec.summary       = 'A Jekyll plugin for generating PDF versions of documentation collections.'

  spec.files         = Dir['lib/**/*.rb']
  spec.require_paths = ['lib']

  spec.metadata['rubygems_mfa_required'] = 'true'
  spec.required_ruby_version = '>= 3.1.0'

  spec.add_dependency 'pdfkit', '~> 0.8'
end

