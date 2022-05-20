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

## Enable search telemetry

Search usage telemetry is disabled by default. To enable it, you need to change the OpenSearch Dashboards YAML file `opensearch_dashboards.yml` setting `data.search.usageTelemetry.enabled` to `true`.

You can find the OpenSearch Dashboards YAML file in the opensearch-project GitHub directory: `OpenSearch-Dashboards/config/opensearch_dashboards.yml`.

When you enable telemetry in the OpenSearch Dashboards YAML file, this overrides the default `false` telemetry setting in the [Data plugin configuration file](https://github.com/opensearch-project/OpenSearch-Dashboards/blob/main/src/plugins/data/config.ts).
{: .note }

<!-- they don't need this table after all. the .yml file changed to 'true' will override the detault setting in the data plugin config file. but saving in-case SMEs decide they can change the data plugin config file at a later date.

### To opt-in or opt-out of search telemetry data

You can opt-in or opt-out of using search telemetry in your cluster by changing the configuration values in both the OpenSearch Dashboards YAML and Data plugin configuration files.

The following table shows the combination of values for the OpenSearch Dashboards YAML file setting `data.search.usageTelemetry.enabled` and the 
 values that will result in search telemetry opt-in or opt-out.

OpenSearch Dashboards YAML value  | Data plugin config value | Opt-in or Opt-out of search telemetry
:--- | :--- | :---
 `true`  |  `false` | Opt-in
 `true`  |  `true`  | Opt-in
 `none`  |  `true`  | Opt-in
 `none`  |  `false` | Opt-out
 `false` |  `true`  | Opt-out
 `false` |  `false` | Opt-out
 -->

#### Sample opensearch_dashboards.yml with telemetry enabled

 This OpenSearch Dashboards YAML file excerpt shows the telemetry setting set to `true` to opt-in to search telemetry:

 ```json
# Set the value of this setting to false to suppress 
# search usage telemetry to reduce the load of the OpenSearch cluster.
 data.search.usageTelemetry.enabled: true
```