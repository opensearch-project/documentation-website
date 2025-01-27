# frozen_string_literal: true

require 'mustache'
require 'logger'
require_relative '../utils'
require_relative '../api/action'

class UtilizationCoverage < Mustache
  self.template_file = "#{__dir__}/templates/utilization_coverage.mustache"

  def components
    total = Api::Action.all.count
    ::Utils::COMPONENTS.map do | id, component|
      utilization = ::Utils.utilized_components.values.flatten.count { |comp| comp == id }
      percent = (utilization.to_f / total * 100).round(2)
      { component:, utilization:, total:, percent:, namespaces: namespace_utilization(id) }
    end
  end

  private

  def namespace_utilization(component)
    Api::Action.by_namespace.entries.sort_by(&:first).map do |namespace, actions|
      namespace = namespace.present? ? namespace : '[root]'
      actions_covered = actions.select { |action| ::Utils.utilized_components[action.full_name]&.include?(component) }
                               .map(&:full_name)
      total = actions.count
      utilization = actions_covered.count
      percent = (utilization.to_f / total * 100).round(2)
      any_actions = actions_covered.any?
      { namespace:, utilization:, total:, percent:, actions_covered:, any_actions: }
    end
  end
end
