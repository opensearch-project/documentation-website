---
layout: default
title: OpenSearch Dashboards plugins
parent: Install OpenSearch Dashboards
nav_order: 50
canonical_url: https://docs.opensearch.org/latest/install-and-configure/install-dashboards/plugins/
---

# Standalone plugin install

If you don't want to use the all-in-one installation options, you can install the various plugins for OpenSearch Dashboards individually.

---

#### Table of contents
1. TOC
{:toc}


---

## Plugin compatibility

<table>
  <thead style="text-align: left">
    <tr>
      <th>OpenSearch Dashboards version</th>
      <th>Plugin versions</th>
    </tr>
  </thead>
  <tbody>
  <tr>
    <td>1.1.0</td>
    <td>
      <pre>alertingDashboards          1.1.0.0
anomalyDetectionDashboards  1.1.0.0
ganttChartDashboards        1.1.0.0
indexManagementDashboards   1.1.0.0
notebooksDashboards         1.1.0.0
queryWorkbenchDashboards    1.1.0.0
reportsDashboards           1.1.0.0
securityDashboards          1.1.0.0
traceAnalyticsDashboards    1.1.0.0
</pre>
    </td>
  </tr>
  <tr>
    <td>1.0.1</td>
    <td>
      <pre>alertingDashboards          1.0.0.0
anomalyDetectionDashboards  1.0.0.0
ganttChartDashboards        1.0.0.0
indexManagementDashboards   1.0.1.0
notebooksDashboards         1.0.0.0
queryWorkbenchDashboards    1.0.0.0
reportsDashboards           1.0.1.0
securityDashboards          1.0.1.0
traceAnalyticsDashboards    1.0.0.0
</pre>
    </td>
  </tr>
  <tr>
    <td>1.0.0</td>
    <td>
      <pre>alertingDashboards          1.0.0.0
anomalyDetectionDashboards  1.0.0.0
ganttChartDashboards        1.0.0.0
indexManagementDashboards   1.0.0.0
notebooksDashboards         1.0.0.0
queryWorkbenchDashboards    1.0.0.0
reportsDashboards           1.0.0.0
securityDashboards          1.0.0.0
traceAnalyticsDashboards    1.0.0.0
</pre>
    </td>
  </tr>
  </tbody>
</table>


## Prerequisites

- A compatible OpenSearch cluster
- The corresponding OpenSearch plugins [installed on that cluster]({{site.url}}{{site.baseurl}}/opensearch/install/plugins/)
- The corresponding version of [OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/) (e.g. OpenSearch Dashboards 1.0.0 works with OpenSearch 1.0.0)


## Install

Navigate to the OpenSearch Dashboards home directory (likely `/usr/share/opensearch-dashboards`) and run the install command for each plugin.

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

## List installed plugins

To check your installed plugins:

```bash
sudo bin/opensearch-dashboards-plugin list
```


## Remove plugins

To remove a plugin:

```bash
sudo bin/opensearch-dashboards-plugin remove <plugin-name>
```

Then remove all associated entries from `opensearch_dashboards.yml`.

For certain plugins, you must also remove the "optimze" bundle. This is a sample command for the Anomaly Detection plugin:

```bash
sudo rm /usr/share/opensearch-dashboards/optimize/bundles/opensearch-anomaly-detection-opensearch-dashboards.*
```

Then restart OpenSearch Dashboards. After you remove any plugin, OpenSearch Dashboards performs an optimize operation the next time you start it. This operation takes several minutes even on fast machines, so be patient.


## Update plugins

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

For example, to remove and reinstall the anomaly detection plugin:

```bash
sudo bin/opensearch-plugin remove opensearch-anomaly-detection
sudo rm /usr/share/opensearch-dashboards/optimize/bundles/opensearch-anomaly-detection-opensearch-dashboards.*
sudo bin/opensearch-dashboards-plugin install <AD OpenSearch Dashboards plugin artifact URL>
```
