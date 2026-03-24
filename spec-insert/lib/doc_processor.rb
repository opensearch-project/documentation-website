# frozen_string_literal: true

require 'pathname'
require_relative 'renderers/spec_insert'
require_relative 'spec_insert_error'
require_relative 'insert_arguments'

# Processes a file, replacing spec-insert blocks with rendered content
class DocProcessor
  START_MARKER = /<!-- spec_insert_start/
  END_MARKER = /<!-- spec_insert_end -->/

  def initialize(file_path, logger:)
    @file_path = Pathname(file_path)
    @logger = logger
  end

  # Processes the file, replacing spec-insert blocks with rendered content
  # @param [Boolean] write_to_file Whether to write the changes back to the file
  def process(write_to_file: true)
    lines = File.readlines(@file_path)
    original_content = lines.join
    insertions = find_insertions(lines)
    return if insertions.empty?

    insertions.reverse_each { |start, finish, insert| lines[start..finish] = insert.render }
    rendered_content = lines.join
    if write_to_file && rendered_content != original_content
      File.write(@file_path, rendered_content)
      relative_path = @file_path.relative_path_from(Pathname.new(Dir.pwd))
      @logger.info "Successfully updated #{relative_path}."
    end
    rendered_content
  end

  # @return [Array<SpecInsert>] the spec inserts targeted by this processor
  def spec_inserts
    find_insertions(File.readlines(@file_path)).map(&:last)
  end

  private

  # @return Array<[Integer, Integer, SpecInsert]>
  def find_insertions(lines)
    start_indices = lines.each_with_index
                         .filter { |line, _index| line.match?(START_MARKER) }
                         .map { |_line, index| index }
    end_indices = start_indices.map do |index|
      (index..(lines.length - 1)).find { |i| lines[i].match?(END_MARKER) }
    end.compact

    validate_markers!(start_indices, end_indices)

    start_indices.zip(end_indices).map do |start, finish|
      args = InsertArguments.from_marker(lines[start..finish])
      next nil if args.skip?
      [start, finish, SpecInsert.new(args)]
    end.compact
  end

  # @param [Array<Integer>] start_indices
  # @param [Array<Integer>] end_indices
  def validate_markers!(start_indices, end_indices)
    return if start_indices.length == end_indices.length &&
              start_indices.zip(end_indices).flatten.each_cons(2).all? { |a, b| a < b }
    raise SpecInsertError, 'Mismatched "spec_insert_start" and "spec_insert_end" markers.'
  end
end
