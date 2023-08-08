---
layout: default
title: Managing OpenSearch Dashboards plugins
nav_order: 100
redirect_from: 
  - /dashboards/install/plugins/
  - /install-and-configure/install-dashboards/plugins/
---

# Managing OpenSearch Dashboards plugins

OpenSearch Dashboards provides a command line tool called `opensearch-plugin` for managing plugins. This tool allows you to:

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

The following table lists available OpenSearch Dashboards plugins.

| Plugin Name | Repository | Earliest Available Version |
| :--- | :--- | :--- |
| Alerting Dashboards | [alerting-dashboards-plugin](https://github.com/opensearch-project/alerting-dashboards-plugin) | 1.0.0 |
| Anomaly Detection Dashboards | [anomaly-detection-dashboards-plugin](https://github.com/opensearch-project/anomaly-detection-dashboards-plugin) | 1.0.0 |
| Custom Import Maps Dashboards | [dashboards-maps](https://github.com/opensearch-project/dashboards-maps) | 2.2.0 |
| Search Relevance Dashboards | [dashboards-search-relevance](https://github.com/opensearch-project/dashboards-search-relevance) | 2.4.0 |
| Gantt Chart Dashboards | [gantt-chart](https://github.com/opensearch-project/dashboards-visualizations/tree/main/gantt-chart) | 1.0.0 |
| Index Management Dashboards | [index-management-dashboards-plugin](https://github.com/opensearch-project/index-management-dashboards-plugin) | 1.0.0 |
| Notebooks Dashboards | [dashboards-notebooks](https://github.com/opensearch-project/dashboards-notebooks) | 1.0.0 |
| Notifications Dashboards | [dashboards-notifications](https://github.com/opensearch-project/dashboards-notifications) | 2.0.0 |
| Observability Dashboards | [dashboards-observability](https://github.com/opensearch-project/dashboards-observability) | 2.0.0 |
| Query Workbench Dashboards | [query-workbench](https://github.com/opensearch-project/dashboards-query-workbench) | 1.0.0 |
| Reports Dashboards | [dashboards-reporting](https://github.com/opensearch-project/dashboards-reporting) | 1.0.0 |
| Security Analytics Dashboards | [security-analytics-dashboards-plugin](https://github.com/opensearch-project/security-analytics-dashboards-plugin)| 2.4.0 |
| Security Dashboards | [security-dashboards-plugin](https://github.com/opensearch-project/security-dashboards-plugin) | 1.0.0 |

## Install

Navigate to the OpenSearch Dashboards home directory (for example, `/usr/share/opensearch-dashboards`) and run the install command for each plugin.

{% comment %}

#### Security OpenSearch Dashboards

```bash
sudo bin/opensearch-dashboards-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/opensearch-dashboards-plugins/opensearch-security/opensearchSecurityOpenSearch Dashboards-{{site.opensearch_major_minor_version}}.0.1.zip
```

This plugin provides a user interface for managing users, roles, mappings, action groups, and tenants.

#### Alerting OpenSearch Dashboards

```bash
sudo bin/opensearch-dashboards-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/opensearch-dashboards-plugins/opensearch-alerting/opensearchAlertingOpenSearch Dashboards-{{site.opensearch_major_minor_version}}.0.0.zip
```

This plugin provides a user interface for creating monitors and managing alerts.

#### Index State Management OpenSearch Dashboards

```bash
sudo bin/opensearch-dashboards-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/opensearch-dashboards-plugins/opensearch-index-management/opensearchIndexManagementOpenSearch Dashboards-{{site.opensearch_major_minor_version}}.0.1.zip
```

This plugin provides a user interface for managing policies.

#### Anomaly Detection OpenSearch Dashboards

```bash
sudo bin/opensearch-dashboards-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/opensearch-dashboards-plugins/opensearch-anomaly-detection/opensearchAnomalyDetectionOpenSearch Dashboards-{{site.opensearch_major_minor_version}}.0.0.zip
```

This plugin provides a user interface for adding detectors.

#### Query Workbench OpenSearch Dashboards

```bash
sudo bin/opensearch-dashboards-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/opensearch-dashboards-plugins/opensearch-query-workbench/opensearchQueryWorkbenchOpenSearch Dashboards-{{site.opensearch_major_minor_version}}.0.0.zip
```

This plugin provides a user interface for using SQL queries to explore your data.

#### Trace Analytics

```bash
sudo bin/opensearch-dashboards-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/opensearch-dashboards-plugins/opensearch-trace-analytics/opensearchTraceAnalyticsOpenSearch Dashboards-{{site.opensearch_major_minor_version}}.2.0.zip
```

This plugin uses distributed trace data (indexed in OpenSearch using Data Prepper) to display latency trends, error rates, and more.

#### Notebooks OpenSearch Dashboards

```bash
sudo bin/opensearch-dashboards-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/opensearch-dashboards-plugins/opensearch-notebooks/opensearchNotebooksOpenSearch Dashboards-{{site.opensearch_major_minor_version}}.2.0.zip
```

This plugin lets you combine OpenSearch Dashboards visualizations and narrative text in a single interface.

#### Reports OpenSearch Dashboards

```bash
# x86 Linux
sudo bin/opensearch-dashboards-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/opensearch-dashboards-plugins/opensearch-reports/linux/x64/opensearchReportsOpenSearch Dashboards-{{site.opensearch_major_minor_version}}.2.0-linux-x64.zip
# ARM64 Linux
sudo bin/opensearch-dashboards-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/opensearch-dashboards-plugins/opensearch-reports/linux/arm64/opensearchReportsOpenSearch Dashboards-{{site.opensearch_major_minor_version}}.2.0-linux-arm64.zip
# x86 Windows
sudo bin/opensearch-dashboards-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/opensearch-dashboards-plugins/opensearch-reports/windows/x64/opensearchReportsOpenSearch Dashboards-{{site.opensearch_major_minor_version}}.2.0-windows-x64.zip
```

This plugin lets you export and share reports from OpenSearch Dashboards dashboards, visualizations, and saved searches.

#### Gantt Chart OpenSearch Dashboards

```bash
sudo bin/opensearch-dashboards-plugin install https://d3g5vo6xdbdb9a.cloudfront.net/downloads/opensearch-dashboards-plugins/opensearch-gantt-chart/opensearchGanttChartOpenSearch Dashboards-{{site.opensearch_major_minor_version}}.0.0.zip
```

This plugin adds a new Gantt chart visualization.

{% endcomment %}

## Viewing a list of installed plugins

To view the list of installed plugins from the command line, use the following command:

```bash
sudo bin/opensearch-dashboards-plugin list
```

## Remove plugins

To remove a plugin:

```bash
sudo bin/opensearch-dashboards-plugin remove <plugin-name>
```

Then remove all associated entries from `opensearch_dashboards.yml`.

For certain plugins, you must also remove the "optimize" bundle. This is a sample command for the Anomaly Detection plugin:

```bash
sudo rm /usr/share/opensearch-dashboards/optimize/bundles/opensearch-anomaly-detection-opensearch-dashboards.*
```

Then restart OpenSearch Dashboards. After you remove any plugin, OpenSearch Dashboards performs an optimize operation the next time you start it. This operation takes several minutes even on fast machines, so be patient.

## Updating plugins

OpenSearch Dashboards doesn’t update plugins. Instead, you have to remove the old version and its optimized bundle, reinstall them, and restart OpenSearch Dashboards:

1. Remove the old version:

   ```bash
   sudo bin/opensearch-dashboards-plugin remove <plugin-name>
   ```

1. Remove the optimized bundle:

   ```bash
   sudo rm /usr/share/opensearch-dashboards/optimize/bundles/<bundle-name>
   ```

1. Reinstall the new version:

   ```bash
   sudo bin/opensearch-dashboards-plugin install <plugin-name>
   ```

1. Restart OpenSearch Dashboards.

For example, to remove and reinstall the Anomaly Detection plugin:

```bash
sudo bin/opensearch-dashboards-plugin remove anomalyDetectionDashboards
sudo rm /usr/share/opensearch-dashboards/optimize/bundles/opensearch-anomaly-detection-opensearch-dashboards.*
sudo bin/opensearch-dashboards-plugin install <AD OpenSearch Dashboards plugin artifact URL>
```
