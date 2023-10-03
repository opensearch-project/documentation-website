---
layout: default
title: Metrics analytics
nav_order: 40
redirect_from:
  - /observing-your-data/prometheusmetrics/
---

# Metrics analytics
Introduced 2.4
{: .label .label-purple }

Starting with OpenSearch 2.4, you can ingest and visualize metric data from log data aggregated within OpenSearch, allowing you to analyze and correlate data across logs, traces, and metrics. Previously, you could ingest and visualize only logs and traces from your monitored environments. With this feature, you can observe your digital assets with more granularity, gain deeper insight into the health of your infrastructure, and better inform your root cause analysis.

The following image shows the process of ingesting metrics from Prometheus and visualizing them in a dashboard.

![Prometheus and Metrics]({{site.url}}{{site.baseurl}}/images/metrics/metricsgif.gif)

## Configuring a data source connection from Prometheus to OpenSearch

You can view metrics collected from Prometheus in OpenSearch Dashboards by first creating a connection from [Prometheus](https://prometheus.io/) to OpenSearch using the SQL plugin. 

To configure a connection to Prometheus, you can use the `_datasources` configuration API endpoint. 

The following example request configures a Prometheus data source with no authentication:

```json
POST _plugins/_query/_datasources 
{
    "name" : "my_prometheus",
    "connector": "prometheus",
    "properties" : {
        "prometheus.uri" : "http://localhost:9090"
    }
}
```

The following example request configures a Prometheus data source with AWS SigV4 authentication:

```json
POST _plugins/_query/_datasources
{
    "name" : "my_prometheus",
    "connector": "prometheus",
    "properties" : {
        "prometheus.uri" : "http://localhost:8080",
        "prometheus.auth.type" : "awssigv4",
        "prometheus.auth.region" : "us-east-1",
        "prometheus.auth.access_key" : "{{accessKey}}"
        "prometheus.auth.secret_key" : "{{secretKey}}"
    }
}
```

After configuring the connection from Prometheus to OpenSearch, Prometheus metrics are displayed in Dashboards in the **Observability** > **Metrics analytics** window, as shown in the following image.

![Metrics UI example 1]({{site.url}}{{site.baseurl}}/images/metrics/metrics1.png)

* For more information about authentication and authorization of data source APIs, see [data source documentation on GitHub](https://github.com/opensearch-project/sql/blob/main/docs/user/ppl/admin/datasources.rst).
* For more information about the Prometheus connector, see the [Prometheus Connector](https://github.com/opensearch-project/sql/blob/main/docs/user/ppl/admin/connectors/prometheus_connector.rst) GitHub page.

## Creating visualizations based on metrics

You can create visualizations based on Prometheus metrics and other metrics collected by your OpenSearch cluster.

To create a visualization, do the following:

1. In **Observability** > **Metrics analytics** > **Available Metrics**, select the metrics you would like to include in your visualization.
1. These visualizations can now be saved.
1. From the **Metrics analytics** window, select **Save**.
1. When prompted for a **Custom operational dashboards/application**, choose one of the available options.
1. Optionally, you can edit the predefined name values under the **Metric Name** fields to suit your needs.
1. Select **Save**.

The following image shows an example of the visualizations that are displayed in the **Observability** > **Metrics analytics** window.

![Metrics UI example 2]({{site.url}}{{site.baseurl}}/images/metrics/metrics2.png)

## Defining PPL queries for use with Prometheus

You can define [Piped Processing Language]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/index) (PPL) queries against metrics collected by Prometheus. The following example shows a metric-selecting query with specific dimensions:

```
source = my_prometheus.prometheus_http_requests_total | stats avg(@value) by span(@timestamp,15s), handler, code
```

Additionally, you can create a custom visualization by performing the following steps:

1. From the **Events Analytics** window, enter your PPL query and select **Refresh**. The **Explorer page** is now displayed.
1. From the **Explorer page**, select **Save**.
1. When prompted for a **Custom operational dashboards/application**, choose one of the available options.
1. Optionally, you can edit the predefined name values under the **Metric Name** fields to suit your needs.
1. Optionally, you can choose to save the visualization as a metric.
1. Select **Save**.

Note: Only queries that include a time-series visualization and stats/span can be saved as a metric, as shown in the following image.

![Metrics UI example 3]({{site.url}}{{site.baseurl}}/images/metrics/metrics3.png)
