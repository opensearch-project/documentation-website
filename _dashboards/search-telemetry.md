---
layout: default
title: Search telemetry
nav_order: 21
---


# About Search telemetry

Search Telemetry is used to analyze performance for success or failed search requests in OpenSearch Dashboards. Telemetry data is saved in the `.kibana_1` index.

Because there are thousands of concurrent search request from OpenSearch Dashboards, the large traffic causes significant load in an OpenSearch cluster.

To improve performance for your OpenSearch cluster, you can turn off search telemetry.

## Disable search telemetry to improve cluster performance

You can suppress the search usage telemetry by enabling the `data.search.usageTelemetry.enabled` setting in your `opensearch_dashboard.yml` file.

Alternatively, you can modify the Data plugin config file to opt out of search telemetry.

### To opt-in or opt-out of search telemetry data

There are several combinations of OpenSearch Dashboards YAML file and Data plugin configuration file values that allow you to either opt-in or opt-out of using search telemetry in your cluster.

The following table shows the combination of values for the OpenSearch Dashboards YAML file setting `data.search.usageTelemetry.enabled` and the Data plugin configuration file values that will result in search telemetry opt-in or opt-out.
This table refers to these settings:

* OpenSearch Dashboards YAML file setting `data.search.usageTelemetry.enabled` value is either `true`, `false` or `none`.
* Data plugin configuration file value is either `true`, or `false`.

OpenSearch Dashboards YML value | Data plugin config value | Opt-in or Opt-out of search telemetry
:--- | :--- | :---
 `true`  |  `false` | Opt-in
 `true`  |  `true`  | Opt-in
 `none`  |  `true`  | Opt-in
 `true`  |  `true`  | Opt-in
 `none`  |  `false` | Opt-out
 `false` |  `true`  | Opt-out
 `false` |  `false` | Opt-out