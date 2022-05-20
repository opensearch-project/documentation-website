---
layout: default
title: Search telemetry
nav_order: 30
---


# About search telemetry

You can use search telemetry to analyze performance for success or failed search requests in OpenSearch Dashboards. OpenSearch stores telemetry data in the `.kibana_1` index.

Because there are thousands of concurrent search request from OpenSearch Dashboards, the large traffic causes significant load in an OpenSearch cluster.

OpenSearch clusters perform better with search telemetry turned off.
{: .tip }

## Enable search telemetry

Search usage telemetry is disabled by default. To enable it, you need to change the OpenSearch Dashboards YAML file `opensearch_dashboards.yml` setting `data.search.usageTelemetry.enabled` to `true`.

You can find the OpenSearch Dashboards YAML file in the opensearch-project GitHub directory: `OpenSearch-Dashboards/config/opensearch_dashboards.yml`.

When you enable telemetry in the OpenSearch Dashboards YAML file, this overrides the default `false` telemetry setting in the [Data plugin configuration file](https://github.com/opensearch-project/OpenSearch-Dashboards/blob/main/src/plugins/data/config.ts).
{: .note }
### To opt-in or opt-out of search telemetry data

The following table shows the OpenSearch Dashboards YAML file setting `data.search.usageTelemetry.enabled` values you can choose to opt-in or opt-out of search telemetry.

OpenSearch Dashboards YAML value  | Opt-in or Opt-out of search telemetry
:--- |  :---
 `true`  | Opt-in
 `false` | Opt-out
 `none`  | Opt-out

#### Sample opensearch_dashboards.yml with telemetry enabled

 This OpenSearch Dashboards YAML file excerpt shows the telemetry setting set to `true` to opt-in to search telemetry:

 ```json
# Set the value of this setting to false to suppress 
# search usage telemetry to reduce the load of the OpenSearch cluster.
 data.search.usageTelemetry.enabled: true
```