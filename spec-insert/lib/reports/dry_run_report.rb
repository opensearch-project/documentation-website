# frozen_string_literal: true

require_relative '../utils'
require_relative '../api/action'
require_relative 'dry_run'

# Generate a dry run report for all API actions
class DryRunReport < Mustache
  self.template_path = "#{__dir__}/templates"
  self.template_file = "#{__dir__}/templates/dry_run_report.mustache"

  OUTPUT_DIR = File.join(::Utils::SPEC_INSERT_DIR, 'dry-run')

  def initialize
    super
    @errors_report = Hash.new { |hash, key| hash[key] = [] }
    generate_dry_runs
  end

  def any_errors?
    @errors_report.keys.any?
  end

  def errors
    ::Utils::COMPONENTS.map do |comp_id, comp_name|
      { component_name: comp_name,
        component_id: comp_id,
        apis: @errors_report[comp_id],
        error_count: @errors_report[comp_id].count }
    end
  end

  private

  def generate_dry_runs
    FileUtils.rm_rf(OUTPUT_DIR)
    FileUtils.mkdir_p(OUTPUT_DIR)
    Api::Action.all.each do |action|
      dry_run = DryRun.new(action:, errors_report: @errors_report)
      file = File.join(OUTPUT_DIR, "#{action.full_name}.md")
      File.write(file, dry_run.render)
    end
  end
end
