# frozen_string_literal: true

require 'mustache'
require 'logger'
require_relative '../utils'
require_relative '../api/action'

# Renders utilization coverage of Spec-Insert components to a markdown file
class UtilizationCoverage < Mustache
  self.template_file = "#{__dir__}/templates/utilization_coverage.mustache"

  def components
    total = Api::Action.all.count
    ::Utils::COMPONENTS.map do |id, component|
      utilization = ::Utils.utilized_components.values.flatten.count { |comp| comp == id }
      percent = (utilization.to_f / total * 100).round(2)
      { component:, utilization:, total:, percent:, namespaces: namespace_utilization(id) }
    end
  end

  private

  def namespace_utilization(component)
    Api::Action.by_namespace.entries.sort_by(&:first).map do |namespace, actions|
      namespace = '[root]' unless namespace.present?
      actions = actions.map do |action|
        { name: action.full_name,
          utilized: ::Utils.utilized_components[action.full_name]&.include?(component) }
      end.sort_by { |action| action[:name] }
      total = actions.count
      utilization = actions.count { |action| action[:utilized] }
      percent = (utilization.to_f / total * 100).round(2)
      { namespace:, utilization:, total:, percent:, actions: }
    end
  end
end
