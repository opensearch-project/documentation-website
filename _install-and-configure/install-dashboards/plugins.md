---
layout: default
title: Managing OpenSearch Dashboards plugins
nav_order: 100
redirect_from: 
  - /dashboards/install/plugins/
---

# Managing OpenSearch Dashboards plugins

OpenSearch Dashboards provides a command line tool called `opensearch-dashboards-plugin` for managing plugins.

## Prerequisites

- A compatible OpenSearch cluster
- The corresponding OpenSearch plugins [installed on that cluster]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/)
- The corresponding version of [OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/) (for example, OpenSearch Dashboards 2.3.0 works with OpenSearch 2.3.0)

## Using the `opensearch-dashboards-plugin` tool

Use the `opensearch-dashboards-plugin` tool to perform the following actions:

- [List](#listing-installed-plugins) installed plugins.
- [Install](#installing-plugins) plugins.
- [Remove](#removing-plugins) installed plugins.

### Listing installed plugins

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

### Installing plugins

To install a plugin, provide the URL of the plugin's zip file:

```bash
sudo bin/opensearch-dashboards-plugin install <plugin-zip-url>
```
{% include copy.html %}

To install a plugin from a zip file on the host, provide the file path using the `file://` scheme:

```bash
sudo bin/opensearch-dashboards-plugin install file:///<path-to-plugin-zip>
```
{% include copy.html %}

The plugin version must match your OpenSearch Dashboards version. For more information, see [Plugin compatibility](#plugin-compatibility). After installing the plugin, restart OpenSearch Dashboards.

### Removing plugins

To remove a plugin, use the following command:

```bash
sudo bin/opensearch-dashboards-plugin remove alertingDashboards
```
{% include copy.html %}

Then remove all associated entries from `opensearch_dashboards.yml` and restart OpenSearch Dashboards. 

### Updating plugins

The `opensearch-dashboards-plugin` tool does not update plugins. To update a plugin, [remove the old version](#removing-plugins), [install the new version](#installing-plugins), and restart OpenSearch Dashboards.

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

_<sup>*</sup>`dashboardNotebooks` was merged into the Observability plugin with the release of OpenSearch 1.2.0._<br>

## Plugin compatibility

Major, minor, and patch plugin versions must match OpenSearch major, minor, and patch versions in order to be compatible. For example, plugins versions 2.3.0.x work only with OpenSearch 2.3.0.
{: .warning}

## Plugin dependencies

Some plugins extend functionality of other plugins. If a plugin has a dependency on another plugin, you must install the required dependency before installing the dependent plugin. For plugin dependencies, see the [manifest file](https://github.com/opensearch-project/opensearch-build/blob/main/manifests/{{site.opensearch_dashboards_version}}/opensearch-dashboards-{{site.opensearch_dashboards_version}}.yml). In this file, each plugin's dependencies are listed in the `depends_on` parameter.

## Related documentation

- [Installing OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/install-and-configure/install-dashboards/index/)
- [Managing OpenSearch plugins]({{site.url}}{{site.baseurl}}/install-and-configure/plugins/)
