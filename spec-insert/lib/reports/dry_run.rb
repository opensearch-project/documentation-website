# frozen_string_literal: true

require 'mustache'
require_relative '../utils'
require_relative '../renderers/spec_insert'
require_relative '../insert_arguments'

# Generate a dry run for a specific API action
class DryRun < Mustache
  self.template_path = "#{__dir__}/templates"
  self.template_file = "#{__dir__}/templates/dry_run.mustache"

  # @param [Api::Action] action
  # @param [Hash{String => String[]] errors_report
  def initialize(action:, errors_report:)
    super
    @action = action
    @errors_report = errors_report
    puts "Generating dry run for #{action.full_name}"
  end

  def api_name
    @action.full_name
  end

  def components
    ::Utils::COMPONENTS.map do |id, name|
      args = InsertArguments.new(api: @action.full_name, component: id)
      { component: SpecInsert.new(args).render, error: false }
    rescue StandardError, SystemStackError => e
      @errors_report[id] << { api: @action.full_name, message: e.message }
      { message: e.message, component: name, error: true }
    end
  end
end
