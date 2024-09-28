# frozen_string_literal: true

require_relative 'spec_helper'
require_relative '../lib/doc_processor'
require_relative '../lib/spec_hash'

describe DocProcessor do
  SpecHash.load_file('spec/_fixtures/opensearch_spec.yaml')

  def test_file(file_name)
    expected_output = File.read("./spec/_fixtures/output/#{file_name}.md")
    actual_output = described_class.new("spec/_fixtures/input/#{file_name}.md").process(write_to_file: false)
    expect(actual_output).to eq(expected_output)
  end

  it 'inserts the param tables correctly' do
    test_file('param_tables')
  end

  it 'inserts the paths and http methods correctly' do
    test_file('paths_and_http_methods')
  end
end
