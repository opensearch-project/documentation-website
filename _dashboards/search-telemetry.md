---
layout: default
title: Search telemetry
nav_order: 30
---


# About Search telemetry

Search Telemetry is used to analyze performance for success or failed search requests in OpenSearch Dashboards. Telemetry data is saved in the `.kibana_1` index.

Because there are thousands of concurrent search request from OpenSearch Dashboards, the large traffic causes significant load in an OpenSearch cluster.

To improve performance for your OpenSearch cluster, you can turn off search telemetry.

## Disable search telemetry to improve cluster performance

You can suppress the search usage telemetry by enabling the `data.search.usageTelemetry.enabled` setting in your `opensearch_dashboard.yml` file.

{: note}
You can find the OpenSearch Dashboards YAML file in the opensearch-project GitHub directory: OpenSearch-Dashboards/config/opensearch_dashboards.yml

Alternatively, you can modify the Data plugin config file to opt out of search telemetry.

### To opt-in or opt-out of search telemetry data

You can opt-in or opt-out of using search telemetry in your cluster by changing the configuration values in both the OpenSearch Dashboards YAML and Data plugin configuration files.

The following table shows the combination of values for the OpenSearch Dashboards YAML file setting `data.search.usageTelemetry.enabled` and the Data plugin configuration file setting `search.usageTelemetry.enabled` values that will result in search telemetry opt-in or opt-out.

OpenSearch Dashboards YML value  | Data plugin config value | Opt-in or Opt-out of search telemetry
:--- | :--- | :---
 `true`  |  `false` | Opt-in
 `true`  |  `true`  | Opt-in
 `none`  |  `true`  | Opt-in
 `true`  |  `true`  | Opt-in
 `none`  |  `false` | Opt-out
 `false` |  `true`  | Opt-out
 `false` |  `false` | Opt-out

 #### Sample opensearch_dashboards.yml

 This OpenSearch Dashboards YAML file excerpt shows the telemetry setting set to `false` to opt-out:

 ```json
 # Set the value of this setting to false to suppress search usage telemetry to reduce the load of the OpenSearch cluster.
# data.search.usageTelemetry.enabled: false
```