---
layout: default
title: Managing OpenSearch Dashboards plugins
nav_order: 100
redirect_from: 
  - /dashboards/install/plugins/
  - /install-and-configure/install-dashboards/plugins/
---

# Managing OpenSearch Dashboards plugins

OpenSearch Dashboards provides a command line tool called `opensearch-dashboards-plugin` for managing plugins. This tool allows you to:

- List installed plugins.
- Install plugins.
- Remove an installed plugin.

## Plugin compatibility

Major, minor, and patch plugin versions must match OpenSearch major, minor, and patch versions in order to be compatible. For example, plugins versions 2.3.0.x work only with OpenSearch 2.3.0.
{: .warning}

## Prerequisites

- A compatible OpenSearch cluster
- The corresponding OpenSearch plugins [installed on that cluster]({{site.url}}{{site.baseurl}}/opensearch/install/plugins/)
- The corresponding version of [OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/) (for example, OpenSearch Dashboards 2.3.0 works with OpenSearch 2.3.0)

## Available plugins

The following table lists available OpenSearch Dashboards plugins. All listed plugins are included in the default OpenSearch distributions.

| Plugin name | Repository | Earliest available version |
| :--- | :--- | :--- |
| `alertingDashboards` | [alerting-dashboards-plugin](https://github.com/opensearch-project/alerting-dashboards-plugin) | 1.0.0 |
| `anomalyDetectionDashboards` | [anomaly-detection-dashboards-plugin](https://github.com/opensearch-project/anomaly-detection-dashboards-plugin) | 1.0.0 |
| `assistantDashboards` | [dashboards-assistant](https://github.com/opensearch-project/dashboards-assistant) | 2.13.0 |
| `customImportMapDashboards` | [dashboards-maps](https://github.com/opensearch-project/dashboards-maps) | 2.2.0 |
| `flowFrameworkDashboards` | [dashboards-flow-framework](https://github.com/opensearch-project/dashboards-flow-framework) | 2.19.0 |
| `indexManagementDashboards` | [index-management-dashboards-plugin](https://github.com/opensearch-project/index-management-dashboards-plugin) | 1.0.0 |
| `mlCommonsDashboards` | [ml-commons-dashboards](https://github.com/opensearch-project/ml-commons-dashboards) | 2.6.0 |
| `notificationsDashboards` | [dashboards-notifications](https://github.com/opensearch-project/dashboards-notifications) | 2.0.0 |
| `observabilityDashboards` | [dashboards-observability](https://github.com/opensearch-project/dashboards-observability) | 2.0.0 |
| `queryInsightsDashboards` | [query-insights-dashboards](https://github.com/opensearch-project/query-insights-dashboards) | 2.19.0 |
| `queryWorkbenchDashboards` | [query-workbench](https://github.com/opensearch-project/dashboards-query-workbench) | 1.0.0 |
| `reportsDashboards` | [dashboards-reporting](https://github.com/opensearch-project/dashboards-reporting) | 1.0.0 |
| `searchRelevanceDashboards` | [dashboards-search-relevance](https://github.com/opensearch-project/dashboards-search-relevance) | 2.4.0 |
| `securityAnalyticsDashboards` | [security-analytics-dashboards-plugin](https://github.com/opensearch-project/security-analytics-dashboards-plugin)| 2.4.0 |
| `securityDashboards` | [security-dashboards-plugin](https://github.com/opensearch-project/security-dashboards-plugin) | 1.0.0 |

_<sup>*</sup>Dashboard Notebooks was merged in to the Observability plugin with the release of OpenSearch 1.2.0._<br>

## Install

Navigate to the OpenSearch Dashboards home directory (for example, `/usr/share/opensearch-dashboards`) and run the install command for the plugin:

```bash
sudo bin/opensearch-dashboards-plugin install alertingDashboards
```
{% include copy.html %}

## Viewing a list of installed plugins

To view the list of installed plugins from the command line, use the following command:

```bash
sudo bin/opensearch-dashboards-plugin list
```
{% include copy.html %}

The command returns the list of installed plugins and their versions:

```bash
alertingDashboards@3.1.0.0
anomalyDetectionDashboards@3.1.0.0
assistantDashboards@3.1.0.0
customImportMapDashboards@3.1.0.0
flowFrameworkDashboards@3.1.0.0
indexManagementDashboards@3.1.0.0
mlCommonsDashboards@3.1.0.0
notificationsDashboards@3.1.0.0
observabilityDashboards@3.1.0.0
queryInsightsDashboards@3.1.0.0
queryWorkbenchDashboards@3.1.0.0
reportsDashboards@3.1.0.0
searchRelevanceDashboards@3.1.0.0
securityAnalyticsDashboards@3.1.0.0
```

## Remove plugins

To remove a plugin, use the following command:

```bash
sudo bin/opensearch-dashboards-plugin remove alertingPlugin
```
{% include copy.html %}

Then remove all associated entries from `opensearch_dashboards.yml`.

For certain plugins, you must also remove the optimized bundle. This is a sample command for the Anomaly Detection plugin:

```bash
sudo rm /usr/share/opensearch-dashboards/optimize/bundles/opensearch-anomaly-detection-opensearch-dashboards.*
```
{% include copy.html %}

Then restart OpenSearch Dashboards. After you remove any plugin, OpenSearch Dashboards performs an optimize operation the next time you start it. This operation takes several minutes even on fast machines, so be patient.

## Updating plugins

OpenSearch Dashboards doesn’t update plugins. Instead, you have to remove the old version and its optimized bundle, reinstall them, and restart OpenSearch Dashboards:

1. Remove the old version:

   ```bash
   sudo bin/opensearch-dashboards-plugin remove <plugin-name>
   ```
   {% include copy.html %}

1. Remove the optimized bundle:

   ```bash
   sudo rm /usr/share/opensearch-dashboards/optimize/bundles/<bundle-name>
   ```
   {% include copy.html %}

1. Reinstall the new version:

   ```bash
   sudo bin/opensearch-dashboards-plugin install <plugin-name>
   ```
   {% include copy.html %}

1. Restart OpenSearch Dashboards.

For example, to remove and reinstall the Anomaly Detection plugin:

```bash
sudo bin/opensearch-dashboards-plugin remove anomalyDetectionDashboards
sudo rm /usr/share/opensearch-dashboards/optimize/bundles/opensearch-anomaly-detection-opensearch-dashboards.*
sudo bin/opensearch-dashboards-plugin install <AD OpenSearch Dashboards plugin artifact URL>
```
