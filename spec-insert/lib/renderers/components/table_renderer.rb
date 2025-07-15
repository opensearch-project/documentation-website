# frozen_string_literal: true

# TableRenderer renders a markdown table with the given columns and rows
class TableRenderer
  # Column object for rendering markdown tables
  class Column
    attr_reader :title, :key
    attr_accessor :width

    # @param [String] title display title
    # @param [String | Symbol] key key to access in row hash
    def initialize(title, key)
      @title = title
      @key = key
      @width = 0
    end
  end

  # @param [Array<Column>] columns
  # @param [Array<Hash>] rows
  # @param [Boolean] pretty whether to render a pretty table or a compact one
  def initialize(columns, rows, pretty:)
    @column = columns
    @rows = rows
    @pretty = pretty
  end

  # @return [Array<String>]
  def render_lines
    calculate_column_widths if @pretty
    ['', render_column, render_divider] + render_rows + ['']
  end

  private

  def calculate_column_widths
    @column.each do |column|
      column.width = [@rows.map { |row| row[column.key].to_s.length }.max || 0, column.title.length].max
    end
  end

  def render_column
    columns = @column.map { |column| column.title.ljust(column.width) }.join(' | ')
    "| #{columns} |"
  end

  def render_divider
    dividers = @column.map { |column| ":#{'-' * [column.width + 1, 3].max}" }
    @pretty ? "|#{dividers.join('|')}|" : "| #{dividers.join(' | ')} |"
  end

  def render_rows
    @rows.map do |row|
      cells = @column.map { |column| row[column.key].to_s.ljust(column.width).gsub('|', '\|') }.join(' | ')
      "| #{cells} |"
    end
  end
end
