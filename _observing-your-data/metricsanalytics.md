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

With the release of OpenSearch 2.4, you can now ingest and visualize metrics data stored directly within OpenSearch using the **Metrics analytics** tool. This equips you with tools to analyze and correlate data across logs, traces, and metrics.

Before this feature, you could only ingest and visualize logs and traces from your monitored environments. With **Metrics analytics**, you can now observe your digital assets with more granularity, gain deeper insight into the health of your infrastructure, and better inform your root cause analysis.

**Metrics analytics** offers federated visualization capabilities on top of the following:

 - An OpenSearch cluster containing an [OpenTelemetry (OTel)-compatible metrics index](https://github.com/opensearch-project/opensearch-catalog/tree/main/docs/schema/observability/metrics) with OTel-based signals. See [What is OpenTelemetry?](https://opentelemetry.io/docs/what-is-opentelemetry/) for an overview of OTel.
 - An OpenSearch cluster containing a [Prometheus data source](https://github.com/opensearch-project/sql/blob/main/docs/dev/datasource-prometheus.md) connected to a Prometheus server. 

The following image shows the flow for retrieving metrics from Prometheus and displaying them on a visualization dashboard.

![Prometheus and metrics]({{site.url}}{{site.baseurl}}/images/metrics/prom-metrics.png)

The following image displays an observability dashboard that visualizes metrics data from the OpenSearch index using OTel queries.

![OTel metrics]({{site.url}}{{site.baseurl}}/images/metrics/otel-metrics.png)

---

## Configuring Prometheus to send metrics data to OpenSearch

You must first create a connection from [Prometheus](https://prometheus.io/) to OpenSearch using the [SQL plugin](https://github.com/opensearch-project/sql). You can then configure a connection to Prometheus by using the `_datasources` configuration API endpoint. 

The following example shows a request that sets up a Prometheus data source without any authentication:

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

The following example shows how to set up a Prometheus data source using AWS Signature Version 4 (SigV4) authentication:

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

After setting up the Prometheus to OpenSearch connection, you can view Prometheus metrics in OpenSearch Dashboards by going to the **Observability** > **Metrics analytics** page, where the metrics will be displayed, similar to the following image.

![Prometheus metrics dashboard]({{site.url}}{{site.baseurl}}/images/metrics/metrics1.png)

### Developer resources

See the following developer resources for sample code, articles, tutorials, and API references:

* [Datasource Settings](https://github.com/opensearch-project/sql/blob/main/docs/user/ppl/admin/datasources.rst), which contains information about authentication and authorization of data source APIs.
* [Prometheus Connector](https://github.com/opensearch-project/sql/blob/main/docs/user/ppl/admin/connectors/prometheus_connector.rst), which contains configuration information.
* [Simple Schema for Observability](https://github.com/opensearch-project/opensearch-catalog/tree/main/docs/schema/observability), which contains information about the OTel schema and ingestion pipeline.
* [OTel Metrics Source](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/otel-metrics-source), which contains information about the Data Prepper metrics pipeline and ingestion.

---

## Experimenting with OTel Metrics in the OpenSearch demo environment 

The OpenSearch [`opentelemetry-demo` repository](https://github.com/opensearch-project/opentelemetry-demo) is a practical demonstration of collecting, processing, and visualizing metrics data through **OTel Metrics** from OpenTelemetry, following OpenTelemetry standards, and using the **Metrics analytics** tool in OpenSearch Dashboards.

### Visualizing OTel metrics in OpenSearch

To visualize OTel metrics in OpenSearch, follow these steps: 

**Step 1: Install the demo**

Install the [`opentelemetry-demo` repository](https://github.com/opensearch-project/opentelemetry-demo). See the [Getting Started](https://github.com/opensearch-project/opentelemetry-demo/blob/main/tutorial/GettingStarted.md) guide for instructions.

**Step 2: Collect the OTel signals**

Collect the OTel signals, including metrics signals. See the [OTel Collector](https://opentelemetry.io/docs/collector/) guide for instructions.  

**Step 3: Configure the OTel pipeline**

Configure the OTel pipeline to emit metrics signals. See the [OTEL Collector Pipeline](https://github.com/opensearch-project/opentelemetry-demo/tree/main/src/otelcollector) guide for instructions.

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
    
**Step 4: Export metrics signals to OpenSearch**

Configure the [Data Prepper pipeline](https://github.com/opensearch-project/opentelemetry-demo/blob/main/src/dataprepper/pipelines.yaml) to emit the collected metrics signals into the OpenSearch metrics index.

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

**Step 5: Ingest metrics data into OpenSearch**

As the demo starts generating data, the metrics signals will be added to the OpenSearch index that supports the OTel Metrics schema format.

**Step 6: View metrics data**

On the **Metrics analytics** page, choose `Otel-Index` from the **Data sources** dropdown menu and `Simple Schema for Observability Index` from the **Otel index** dropdown menu. This step is shown in the following image.

![Metrics analytics page with OTel sources dropdown menus]({{site.url}}{{site.baseurl}}/images/metrics/otel-metrics.png)

---

## Accessing remote clusters to visualize remote metrics
Introduced 2.14
{: .label .label-purple }

You can federate and view metrics from remote OpenSearch clusters by using the **Metrics analytics** tool. Select the dastabase icon on the upper-right toolbar and choose the desired cluster listed in the **DATA SOURCES** dropdown menu, as shown in the following image. You can switch from a local cluster to a remote cluster.

![Switching clusters]({{site.url}}{{site.baseurl}}/images/metrics/remote-cluster-selection.png)

You can also federate remote metrics visualization alongside local metrics visualization. From the **DATA SOURCES** dropdown menu choose the remote metrics visualization to add it to the group of visualizations already shown on the dashboard. An example dashboard is shown in the following image.

![Metrics dashboard]({{site.url}}{{site.baseurl}}/images/metrics/otel-metrics-remote-cluster-selection.png)

To learn more about multi-cluster support for data sources, see [this GitHub issue](https://github.com/opensearch-project/OpenSearch-Dashboards/issues/1388).

## Creating visualizations based on custom metrics

You can create visualizations based on Prometheus metrics and custom metrics collected by your OpenSearch cluster.

To create a visualization based on custom metrics, follow these steps:

1. From the OpenSearch Dashboards main menu, navigate to **Observability** > **Metrics** > **Available Metrics**.
2. Choose the metrics to add to your visualization and then select **Save**.
3. When prompted for a **Custom operational dashboards/application**, choose one of the listed options. You can edit the predefined name values under the **Metric Name** fields.
4. Select **Save** to save your visualization.

The following image is an example of the visualizations displayed in the **Observability** > **Metrics analytics** window.

![Visualizations displayed in the Metric analytics window]({{site.url}}{{site.baseurl}}/images/metrics/metrics2.png)

## Defining PPL queries for Prometheus metrics

You can define [Piped Processing Language (PPL)]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/index) queries to interact with metrics collected by Prometheus. The following example shows a metric-selecting query with specific dimensions:

```
source = my_prometheus.prometheus_http_requests_total | stats avg(@value) by span(@timestamp,15s), handler, code
```
{% include copy-curl.html %}

### Creating a custom visualization 

To create a custom visualization based on your PPL query, follow these steps:

1. From the **Events Analytics** window, enter your PPL query and select **Refresh**. This will display the **Explorer** page.
2. On the **Explorer** page, select **Save**.
3. When prompted to choose a **Custom Operational Dashboards/Application**, select one of the listed options. Optionally, you can edit the predefined name values under the **Metric Name** fields and can choose to save the visualization as a metric.
5. Select **Save** to save your custom visualization. 

Only queries that include a time-series visualization and statistics or span information can be saved as a metric, as shown in the following image.

![Saving queries as metrics]({{site.url}}{{site.baseurl}}/images/metrics/metrics3.png)
