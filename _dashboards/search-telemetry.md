---
layout: default
title: Search telemetry
nav_order: 30
---


# About search telemetry

You can use search telemetry to analyze performance for success or failed search requests in OpenSearch Dashboards. OpenSearch stores telemetry data in the `.kibana_1` index.

Because there are thousands of concurrent search requests from OpenSearch Dashboards, the large traffic can cause significant load in an OpenSearch cluster.

OpenSearch clusters perform better with search telemetry turned off.
{: .tip }

## Enable search telemetry

Search usage telemetry is disabled by default. To enable it, you need to set `data.search.usageTelemetry.enabled` to `true` in the `opensearch_dashboards.yml` file.

You can find the [OpenSearch Dashboards YAML file](https://github.com/opensearch-project/OpenSearch-Dashboards/blob/main/config/opensearch_dashboards.yml) in the opensearch-project repository on GitHub.

Enabling telemetry in the `opensearch_dashboards.yml` file overrides the default search telemetry setting of `false` in the [Data plugin configuration file](https://github.com/opensearch-project/OpenSearch-Dashboards/blob/main/src/plugins/data/config.ts).
{: .note }

### To opt-in or opt-out of search telemetry data

The following table shows the `data.search.usageTelemetry.enabled` values you can set in `opensearch_dashboards.yml` to opt-in or opt-out of search telemetry.

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