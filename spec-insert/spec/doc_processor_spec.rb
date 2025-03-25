# frozen_string_literal: true

require_relative 'spec_helper'
require_relative '../lib/doc_processor'
require_relative '../lib/spec_hash'

describe DocProcessor do
  SpecHash.load_file('spec/_fixtures/opensearch_spec.yaml')

  def test_file(file_name)
    expected_output = File.read("#{__dir__}/_fixtures/expected_output/#{file_name}.md")
    actual_output = described_class.new("#{__dir__}/_fixtures/input/#{file_name}.md", logger: Logger.new($stdout)).process(write_to_file: false)
    File.write("./spec/_fixtures/actual_output/#{file_name}.md", actual_output)
    expect(actual_output).to eq(expected_output)
  end

  it 'inserts the endpoints correctly' do
    test_file('endpoints')
  end

  it 'inserts the url param tables correctly' do
    test_file('url_params_tables')
  end

  it 'inserts the body param tables correctly' do
    test_file('body_params_tables')
  end
end
