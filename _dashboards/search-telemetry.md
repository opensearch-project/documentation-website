---
layout: default
title: Search telemetry
nav_order: 30
---


# About search telemetry

You can use search telemetry to analyze performance for success or failed search requests in OpenSearch Dashboards. OpenSearch stores telemetry data in the `.kibana_1` index.

Because there are thousands of concurrent search request from OpenSearch Dashboards, the large traffic causes significant load in an OpenSearch cluster.

By default it is disabled, so you need to do some configuration changes to enable it.

OpenSearch clusters perform better with search telemetry turned off.
{: .tip }

To learn more about using telemetry data with OpenSearch Dashboards, see [Trace Analytics OpenSearch Dashboards plugin](docs/2.0/observability-plugin/trace/ta-dashboards/).

## Enable search telemetry

Search usage telemetry is disabled by default. To enable it, you need to set the `data.search.usageTelemetry.enabled` setting to `true` in the `opensearch_dashboard.yml` file.

You can find the OpenSearch Dashboards YAML file in the opensearch-project GitHub directory: `OpenSearch-Dashboards/config/opensearch_dashboards.yml`
{: .note }

Alternatively, you can modify the Data plugin config file to opt out of search telemetry.

### To opt-in or opt-out of search telemetry data

You can opt-in or opt-out of using search telemetry in your cluster by changing the configuration values in both the OpenSearch Dashboards YAML and Data plugin configuration files.

The following table shows the combination of values for the OpenSearch Dashboards YAML file setting `data.search.usageTelemetry.enabled` and the Data plugin configuration file src/plugins/data/config.ts setting `search.usageTelemetry.enabled` values that will result in search telemetry opt-in or opt-out.

In the data configuration file (), 



OpenSearch Dashboards YAML value  | Data plugin config value | Opt-in or Opt-out of search telemetry
:--- | :--- | :---
 `true`  |  `false` | Opt-in
 `true`  |  `true`  | Opt-in
 `none`  |  `true`  | Opt-in
 `none`  |  `false` | Opt-out
 `false` |  `true`  | Opt-out
 `false` |  `false` | Opt-out

#### Sample opensearch_dashboards.yml

 This OpenSearch Dashboards YAML file excerpt shows the telemetry setting set to `false` to opt-out:

 ```json
# Set the value of this setting to false to suppress 
# search usage telemetry to reduce the load of the OpenSearch cluster.
 data.search.usageTelemetry.enabled: false
```

#### Sample data configuration file with telemetry enabled

This excerpt shows the `/src/plugins/data/config.ts` file with telemetry set to enabled:
```json
. . .
usageTelemetry: schema.object({
   enabled: schema.boolean({ defaultValue: false }),
```