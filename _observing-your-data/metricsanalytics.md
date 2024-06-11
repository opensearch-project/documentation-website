---
layout: default
title: Metrics analytics
nav_order: 40
redirect_from:
  - /observing-your-data/metricsanalytics/
---

# Metrics analytics
Introduced 2.4
{: .label .label-purple }

Starting with OpenSearch 2.4, you can ingest and visualize metric data from metrics data stored directly within OpenSearch, allowing you to analyze and correlate data across logs, traces, and metrics.
Previously, you could ingest and visualize only logs and traces from your monitored environments. With this feature, you can observe your digital assets with more granularity, gain deeper insight into the health of your infrastructure, and better inform your root cause analysis.

Metrics Analytics offers a comprehensive federated visualization on top of any of the following:
 - OpenSearch Cluster containing an [OpenTelemetry compatible Metrics Index](https://github.com/opensearch-project/opensearch-catalog/tree/main/docs/schema/observability/metrics) with OTEL based signals
 - OpenSearch Cluster containing a [Prometheus datasource](https://github.com/opensearch-project/sql/blob/main/docs/dev/datasource-prometheus.md) connected to a Prometheus Server 


The following image shows the process of querying metrics from Prometheus and visualizing them in a dashboard.

![Prometheus and Metrics]({{site.url}}{{site.baseurl}}/images/metrics/prom-metrics.png)

The following image shows the querying OpenTelemetry metrics stored within an OpenSearch Index visualizing them in Metrics Analytics

![OTEL Metrics]({{site.url}}{{site.baseurl}}/images/metrics/otel-metrics.png)

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
* For more information about the OpenTelemetry pipeline and schema, see the [OTEL schema](https://github.com/opensearch-project/opensearch-catalog/tree/main/docs/schema/observability) GitHub page.
* For more information about the Data-Prepper Metrics pipeline and Ingestion, see the [Data Prepper Metrics](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/otel-metrics-source) GitHub page.

## Using an OpenTelemetry Metrics OpenSearch Index  

As briefly discussed previously, OpenSearch is an [OpenTelemetry compatible datastore](https://opentelemetry.io/docs/what-is-opentelemetry/) which allows visualization of the different telemetry signals.
In Metrics Analytics the main goal is to monitor and visualize [OTEL Metrics signals](https://opentelemetry.io/docs/specs/otel/metrics/) allowing users to federate multiple metrics signals from different sources (Prometheus, remote OpenSearch Cluster, Etc )

OpenTelemetry has a demo staging environment purposely build to stage the Telemetry collection and export process and allow users and vendors to showcase and experiment with the different tools and capabilities. 
OpenSearch [`opentelemetry-demo` repository](https://github.com/opensearch-project/opentelemetry-demo) does exactly that by leveraging OpenSearch Server, Dashboards and data-prepper to instrument, export, visualize and analyze telemetry data.

The next section details how OpenTelemetry metrics can be viewed using the `opentelemetry-demo` application - see [Getting Started](https://github.com/opensearch-project/opentelemetry-demo/blob/main/tutorial/GettingStarted.md) for additional information.  

Enabling Metrics Ingestion into OpenSearch to allow working with metrics requires the following steps:
 - User [OTEL collector ](https://opentelemetry.io/docs/collector/)to collect OpenTelemetry signals (including metrics signals)

First [configure OTEL pipeline](https://github.com/opensearch-project/opentelemetry-demo/tree/main/src/otelcollector) to emit metrics signals using the `service` attribute  

```yaml
    service:
      extensions: [basicauth/client]
      pipelines:
        traces:
          receivers: [otlp]
          processors: [batch]
          exporters: [otlp, debug, spanmetrics, otlp/traces, opensearch/traces]
        metrics:
          receivers: [otlp, spanmetrics]
          processors: [filter/ottl, transform, batch]
          exporters: [otlphttp/prometheus, otlp/metrics, debug]
        logs:
          receivers: [otlp]
          processors: [batch]
          exporters: [otlp/logs,  opensearch/logs, debug]
```
    
 - Enable Data-prepper to export these metrics signals into OpenSearch Metrics Index

Next setup [data-prepper's pipeline](https://github.com/opensearch-project/opentelemetry-demo/blob/main/src/dataprepper/pipelines.yaml) to emit the metrics into OpenSearch
```yaml
    otel-metrics-pipeline:
      workers: 8
      delay: 3000
      source:
        otel_metrics_source:
          health_check_service: true
          ssl: false
      buffer:
        bounded_blocking:
          buffer_size: 1024 # max number of records the buffer accepts
          batch_size: 1024 # max number of records the buffer drains after each read
      processor:
        - otel_metrics:
            calculate_histogram_buckets: true
            calculate_exponential_histogram_buckets: true
            exponential_histogram_max_allowed_scale: 10
            flatten_attributes: false
      sink:
        - opensearch:
            hosts: ["https://opensearch-node1:9200"]
            username: "admin"
            password: "my_%New%_passW0rd!@#"
            insecure: true
            index_type: custom
            template_file: "templates/ss4o_metrics.json"
            index: ss4o_metrics-otel-%{yyyy.MM.dd}
            bulk_size: 4
```
Ingest data into OpenSearch OTEL Metrics schema compatible index - once the demo starts producing data the metrics signals will be emitted downstream into opensearch

 - Open Metrics analytics and view the data

Select the `Otel-Index` drop down and choose the Simple Schema for Observability Index that contains the metrics signals

![OTEL Metrics]({{site.url}}{{site.baseurl}}/images/metrics/otel-metrics.png)


## Accessing remote cluster to visualize its remote metrics
Introduced 2.14
{: .label .label-purple }

Metrics Analytics has introduces the capability to federate and view remote OpenSearch cluster metrics by using the Data-Source selection drop-down and changing the local cluster into a remote one. 

![Change Data Source]({{site.url}}{{site.baseurl}}/images/metrics/remote-cluster-selection.png)

It is also possible to federate remote metrics visualization in addition to local metrics visualization using the **Data-Source Selection** drop down and adding the remote metrics visualization to the existing views. 

![Change Data Source]({{site.url}}{{site.baseurl}}/images/metrics/otel-metrics-remote-cluster-selection.png)

For additional insight into data-source multi-cluster support see [here](https://github.com/opensearch-project/OpenSearch-Dashboards/issues/1388)

## Creating visualizations based on metrics

In addition to the Metrics analytics, one can create visualizations based on Prometheus metrics and other metrics collected by your OpenSearch cluster.

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
