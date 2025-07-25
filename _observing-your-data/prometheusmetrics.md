---
layout: default
title: Metric analytics
nav_order: 40
canonical_url: https://docs.opensearch.org/latest/observing-your-data/prometheusmetrics/
---

# Metric analytics
Introduced 2.4
{: .label .label-purple }

With the release of OpenSearch 2.4, you can now ingest and visualize metric data stored directly in OpenSearch using the **Metrics** tool. This equips you with tools to analyze and correlate data across logs, traces, and metrics.

Before the introduction of this feature, you could only ingest and visualize logs and traces from your monitored environments. With the **Metrics** tool, you can now observe your digital assets with more granularity, gain deeper insight into the health of your infrastructure, and better inform your root cause analysis.

The **Metrics** tool offers federated visualization capabilities in addition to the following:

 - An OpenSearch cluster containing an [OpenTelemetry (OTel)-compatible metrics index](https://github.com/opensearch-project/opensearch-catalog/tree/main/docs/schema/observability/metrics) with OTel-based signals. See [What is OpenTelemetry?](https://opentelemetry.io/docs/what-is-opentelemetry/) for an overview of OTel.
 - An OpenSearch cluster containing a [Prometheus data source](https://github.com/opensearch-project/sql/blob/main/docs/dev/datasource-prometheus.md) connected to a Prometheus server. 

The following image displays the flow for retrieving metrics from Prometheus and displaying them on a visualization dashboard.

<img src="{{site.url}}{{site.baseurl}}/images/metrics/prom-metrics.png" alt="Prometheus data source" width="700"/>

The following image displays an observability dashboard that visualizes metric data from the OpenSearch index using OTel queries.

<img src="{{site.url}}{{site.baseurl}}/images/metrics/otel-metrics.png" alt="OTel data source" width="700"/>

---

## Configuring Prometheus to send metric data to OpenSearch

You must first create a connection from [Prometheus](https://prometheus.io/) to OpenSearch using the [SQL plugin](https://github.com/opensearch-project/sql). You can then configure a connection to Prometheus by using the `_datasources` API endpoint. 

The following example shows a request that configures a Prometheus data source without any authentication:

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
{% include copy-curl.html %}

The following example shows how to configure a Prometheus data source using AWS Signature Version 4 authentication:

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
{% include copy-curl.html %}

After configuring the connection, you can view Prometheus metrics in OpenSearch Dashboards by going to the **Observability** > **Metrics** page, as shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/metrics/metrics1.png" alt="Prometheus metrics displayed on a dashboard" width="700"/>

### Developer resources

See the following developer resources for sample code, articles, tutorials, and API references:

* [Datasource Settings](https://github.com/opensearch-project/sql/blob/main/docs/user/ppl/admin/datasources.rst), which contains information about authentication and authorization of data source APIs.
* [Prometheus Connector](https://github.com/opensearch-project/sql/blob/main/docs/user/ppl/admin/connectors/prometheus_connector.rst), which contains configuration information.
* [Simple Schema for Observability](https://github.com/opensearch-project/opensearch-catalog/tree/main/docs/schema/observability), which contains information about the OTel schema and ingest pipeline.
* [OTel Metrics Source](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/otel-metrics-source), which contains information about the Data Prepper metrics pipeline and ingestion.

---

## Experimenting with OpenTelemetry Metrics in the OpenSearch demo environment 

The OpenSearch [`opentelemetry-demo` repository](https://github.com/opensearch-project/opentelemetry-demo) provides a practical demonstration of collecting, processing, and visualizing metric data through **OpenTelemetry Metrics** from OpenTelemetry and using the **Metrics** tool in OpenSearch Dashboards.

### Visualizing OTel metrics in OpenSearch

To visualize OTel metric data in OpenSearch, follow these steps: 

1. Install the [`opentelemetry-demo` repository](https://github.com/opensearch-project/opentelemetry-demo). See the [Getting Started](https://github.com/opensearch-project/opentelemetry-demo/blob/main/tutorial/GettingStarted.md) guide for instructions.
2. Collect the OTel signals, including metric signals. See the [OTel Collector](https://opentelemetry.io/docs/collector/) guide for instructions.  
3. Configure the OTel pipeline to emit metric signals. See the [OTel Collector Pipeline](https://github.com/opensearch-project/opentelemetry-demo/tree/main/src/otelcollector) guide for instructions.

#### Example YAML config file

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
{% include copy-curl.html %}
    
4. Configure the [Data Prepper pipeline](https://github.com/opensearch-project/opentelemetry-demo/blob/main/src/dataprepper/pipelines.yaml) to emit the collected metric signals into the OpenSearch metrics index.

#### Example YAML config file

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
{% include copy-curl.html %}

5. Ingest metric data into OpenSearch. As the demo starts generating data, the metric signals will be added to the OpenSearch index that supports the OpenTelemetry Metrics schema format.
6. On the **Metrics** page, choose `Otel-Index` from the **Data sources** dropdown menu and `Simple Schema for Observability Index` from the **OTel index** dropdown menu. A visualization is displayed, as shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/metrics/otel-metrics.png" alt="OTel metrics dashboard" width="700"/>

---

## Visualizing metrics in remote clusters
Introduced 2.14
{: .label .label-purple }

You can view metrics from remote OpenSearch clusters by using the **Metrics** tool. Select the database icon on the upper-right toolbar and choose a cluster from the **DATA SOURCES** dropdown menu, as shown in the following image. You can switch from a local cluster to a remote cluster.

<img src="{{site.url}}{{site.baseurl}}/images/metrics/remote-cluster-selection.png" alt="Switching clusters using the Metrics analytics tool" width="700"/>

You can also view metric visualizations from other sources alongside local metric visualizations. From the **DATA SOURCES** dropdown menu, choose the remote metric visualization to add it to the group of visualizations already shown on the dashboard. An example dashboard is shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/metrics/otel-metrics-remote-cluster-selection.png" alt="Metrics dashboard" width="700"/>

To learn about multi-cluster support for data sources, see [Enable OpenSearch Dashboards to support multiple OpenSearch clusters](https://github.com/opensearch-project/OpenSearch-Dashboards/issues/1388).

## Creating visualizations based on custom metrics

You can create visualizations using the metric data collected by your OpenSearch cluster, including Prometheus metrics and custom metrics.

To create these visualizations, follow these steps:

1. From the OpenSearch Dashboards main menu, navigate to **Observability** > **Metrics** > **Available Metrics**.
2. Choose the metrics to add to your visualization and then select **Save**.
3. When prompted for a **Custom operational dashboards/application**, choose one of the listed options. You can edit the predefined name values in the **Metric Name** field.
4. Select **Save** to save your visualization. An example visualization is shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/metrics/metrics2.png" alt="Metrics analytics dashboard with visualizations" width="700"/>

## Defining PPL queries for Prometheus metrics

You can define [Piped Processing Language (PPL)]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/index/) queries to interact with metrics collected by Prometheus. The following is an example PPL query for a Prometheus metric:

```
source = my_prometheus.prometheus_http_requests_total | stats avg(@value) by span(@timestamp,15s), handler, code
```
{% include copy-curl.html %}

### Creating a custom visualization based on the PPL query

To create a custom visualization based on the PPL query, follow these steps:

1. From the **Logs** page, select > **Event Explorer**.
2. On the **Explorer** page,  enter your PPL query and select **Run**. Then select **Save**.
3. When prompted to choose a **Custom Operational Dashboards/Application**, select one of the listed options. Optionally, you can edit the predefined name values in the **Metric Name** fields and can choose to save the visualization as a metric.
5. Select **Save** to save your custom visualization. 

Only queries that include a time-series visualization and statistics or span information can be saved as a metric, as shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/metrics/metrics3.png" alt="Saving queries as metrics" width="700"/>
