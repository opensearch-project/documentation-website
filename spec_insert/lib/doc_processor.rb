# frozen_string_literal: true

require_relative 'renderers/spec_insert'

# Processes a file, replacing spec_insert blocks with rendered content
class DocProcessor
  START_MARKER = /<!-- spec_insert_start/
  END_MARKER = /<!-- spec_insert_end -->/

  def initialize(file_path)
    @file_path = file_path
    @lines = File.readlines(file_path)
  end

  # Processes the file, replacing spec_insert blocks with rendered content
  # @param [Boolean] write_to_file Whether to write the changes back to the file
  def process(write_to_file: true)
    insertions = find_insertions
    insertions.reverse_each { |start, finish, insert| @lines[start..finish] = insert.render_lines }
    content = @lines.join
    if insertions.any? && write_to_file
      puts "Updating #{@file_path}"
      File.write(@file_path, content)
    end
    content
  rescue StandardError => e
    puts "Error processing #{@file_path}: #{e.message}"
    throw e
  end

  private

  def find_insertions
    start_indices = @lines.each_with_index
                          .filter { |line, _index| line.match?(START_MARKER) }
                          .map { |_line, index| index }
    end_indices = start_indices.map do |index|
      (index..@lines.length - 1).find { |i| @lines[i].match?(END_MARKER) } || (@lines.length - 1)
    end

    raise 'Mismatched start/end markers' if start_indices.length != end_indices.length

    start_indices.zip(end_indices).map do |start, finish|
      [start, finish, SpecInsert.new(extract_args(@lines[start..finish]))]
    end
  end

  def extract_args(lines)
    end_index = lines.each_with_index.find { |line, _index| line.match?(/^\s*-->/) }&.last&.- 1

    lines[1..end_index].filter { |line| line.include?(':') }.to_h do |line|
      key, value = line.split(':')
      value = value.include?(',') ? value.split(',').map(&:strip) : value.strip
      [key.strip, value]
    end
  end
end
