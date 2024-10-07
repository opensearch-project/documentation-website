# frozen_string_literal: true

require 'active_support/all'
require_relative 'spec_hash'
require_relative 'doc_processor'

# Insert the OpenSearch API specification info into the documentation repository
class SpecInserter
  # @param [String] spec_file Path to the OpenSearch API specification file
  # @param [String] root_folder Path to the documentation website root folder
  # @param [String] ignored Path to the file containing the list of ignored files and folders
  def initialize(spec_file:, root_folder:, ignored:)
    SpecHash.load_file(spec_file)
    @root_folder = Pathname.new root_folder
    @ignored_folders = File.readlines(ignored).map(&:strip).filter_map do |path|
      @root_folder.join(path) if path.present? && !path.start_with?('#')
    end.map(&:to_s)
    puts "Ignored folders: #{@ignored_folders}"
  end

  def insert_spec
    Dir.glob(@root_folder.join('**/*.md'))
       .filter { |file| @ignored_folders.none? { |ignored| file.start_with?(ignored) } }
       .filter { |file| File.basename(file) !~ /^[A-Z_]+\.md$/ }
       .each do |file|
      DocProcessor.new(file).process
    end
  end
end
