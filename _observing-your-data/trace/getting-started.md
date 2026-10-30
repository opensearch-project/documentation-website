---
layout: default
title: Getting started
parent: Trace analytics
grand_parent: Classic observability apps
nav_order: 1
redirect_from:
  - /observability-plugin/trace/get-started/
  - /monitoring-plugins/trace/get-started/
---

# Getting started with trace analytics

Trace analytics uses [OpenSearch Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/) to ingest trace data into OpenSearch and [Trace analytics in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/observing-your-data/trace/ta-dashboards/) to visualize it. In this tutorial, you'll run a sample application that generates traces, send the traces to OpenSearch, and view them in OpenSearch Dashboards.

If you already use Jaeger with OpenSearch as its storage backend, see [Analyzing Jaeger trace data]({{site.url}}{{site.baseurl}}/observing-your-data/trace/trace-analytics-jaeger/) instead.

## Basic flow of data

The following diagram shows how trace data flows from an application to OpenSearch.

![Data flow diagram from a distributed application to OpenSearch]({{site.url}}{{site.baseurl}}/images/ta.svg)

1. You instrument your application to generate trace data. The [OpenTelemetry documentation](https://opentelemetry.io/docs/) contains example applications for many programming languages, including Java, Python, Go, and JavaScript.
1. The [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/) receives trace data from the application using the OpenTelemetry Protocol (OTLP) and sends it to Data Prepper.
1. Data Prepper processes the trace data and writes spans to the `otel-v1-apm-span-*` indexes and service relationships to the `otel-v1-apm-service-map` index.
1. Trace analytics in OpenSearch Dashboards displays the data as charts and tables that show service dependencies, latency, error rate, and throughput.

## Running the Jaeger HotROD example

The following example uses Docker Compose to run a single-node OpenSearch cluster, OpenSearch Dashboards, Data Prepper, the OpenTelemetry Collector, and the [Jaeger HotROD](https://github.com/jaegertracing/jaeger/tree/main/examples/hotrod) sample application, which simulates a ride-sharing service made up of several microservices.

### Step 1: Set the admin password

OpenSearch requires a custom password for the `admin` user. In an empty directory, create a file named `.env` containing the following line, replacing `<custom-admin-password>` with a strong password:

```bash
OPENSEARCH_INITIAL_ADMIN_PASSWORD=<custom-admin-password>
```
{% include copy.html %}

Docker Compose reads this file and passes the password to OpenSearch. For more information, see [Admin password requirements]({{site.url}}{{site.baseurl}}/security/configuration/demo-configuration/#admin-password-requirements).

### Step 2: Configure the OpenTelemetry Collector

In the same directory, create a file named `otel-collector-config.yaml` containing the following configuration. The Collector receives OTLP data from HotROD and sends traces to Data Prepper:

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

processors:
  batch:

exporters:
  otlp_grpc/data-prepper:
    endpoint: data-prepper:21890
    tls:
      insecure: true

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlp_grpc/data-prepper]
```
{% include copy.html %}

### Step 3: Configure the Data Prepper pipelines

In the same directory, create a file named `pipelines.yaml` containing the following configuration, replacing both instances of `<custom-admin-password>` with the password that you set in Step 1. The `entry-pipeline` receives trace data and passes it to two pipelines: `raw-trace-pipeline` writes spans to OpenSearch, and `service-map-pipeline` writes the relationships between services. For more information, see [Trace analytics]({{site.url}}{{site.baseurl}}/data-prepper/common-use-cases/trace-analytics/).

```yaml
entry-pipeline:
  source:
    otel_trace_source:
      ssl: false
  sink:
    - pipeline:
        name: raw-trace-pipeline
    - pipeline:
        name: service-map-pipeline

raw-trace-pipeline:
  source:
    pipeline:
      name: entry-pipeline
  processor:
    - otel_traces:
  sink:
    - opensearch:
        hosts: ["https://opensearch:9200"]
        insecure: true # The demo security configuration uses self-signed certificates
        username: admin
        password: <custom-admin-password>
        index_type: trace-analytics-raw

service-map-pipeline:
  source:
    pipeline:
      name: entry-pipeline
  processor:
    - service_map:
  sink:
    - opensearch:
        hosts: ["https://opensearch:9200"]
        insecure: true
        username: admin
        password: <custom-admin-password>
        index_type: trace-analytics-service-map
```
{% include copy.html %}

### Step 4: Create the Docker Compose file

In the same directory, create a file named `docker-compose.yml` containing the following configuration:

```yaml
services:
  opensearch:
    image: opensearchproject/opensearch:latest
    environment:
      - discovery.type=single-node
      - bootstrap.memory_lock=true
      - "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m"
      - OPENSEARCH_INITIAL_ADMIN_PASSWORD=${OPENSEARCH_INITIAL_ADMIN_PASSWORD}
    ulimits:
      memlock:
        soft: -1
        hard: -1
      nofile:
        soft: 65536
        hard: 65536
    volumes:
      - opensearch-data:/usr/share/opensearch/data
    ports:
      - "9200:9200"
    healthcheck: # Data Prepper starts only after the cluster is available
      test: ["CMD-SHELL", "curl -sk -u admin:$$OPENSEARCH_INITIAL_ADMIN_PASSWORD https://localhost:9200/_cluster/health | grep -qE '\"status\":\"(green|yellow)\"'"]
      interval: 10s
      timeout: 5s
      retries: 30
    networks:
      - opensearch-net

  opensearch-dashboards:
    image: opensearchproject/opensearch-dashboards:latest
    ports:
      - "5601:5601"
    environment:
      OPENSEARCH_HOSTS: '["https://opensearch:9200"]'
    networks:
      - opensearch-net
    depends_on:
      - opensearch

  data-prepper:
    image: opensearchproject/data-prepper:latest
    volumes:
      - ./pipelines.yaml:/usr/share/data-prepper/pipelines/pipelines.yaml:ro
    networks:
      - opensearch-net
    depends_on:
      opensearch:
        condition: service_healthy

  otel-collector:
    image: otel/opentelemetry-collector:latest
    command: ["--config=/etc/otelcol/config.yaml"]
    volumes:
      - ./otel-collector-config.yaml:/etc/otelcol/config.yaml:ro
    networks:
      - opensearch-net
    depends_on:
      - data-prepper

  hotrod:
    image: jaegertracing/example-hotrod:latest
    command: ["all"]
    environment:
      - OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318
    ports:
      - "8080:8080"
    networks:
      - opensearch-net
    depends_on:
      - otel-collector

volumes:
  opensearch-data:

networks:
  opensearch-net:
```
{% include copy.html %}

### Step 5: Start the containers

To start the containers, run the following command:

```bash
docker compose up -d
```
{% include copy.html %}

Data Prepper starts after the OpenSearch cluster reports a `green` or `yellow` health status, which can take a minute or longer. To confirm that Data Prepper is ready to receive trace data, run the following command until the output contains a line similar to `Started otel_trace_source on port 21890`:

```bash
docker compose logs data-prepper | grep "Started otel_trace_source"
```
{% include copy.html %}

### Step 6: Generate trace data

To open the HotROD sample application, go to [http://localhost:8080](http://localhost:8080). Each time you select a customer, HotROD sends a request through its services and generates a trace. Some requests fail intentionally, so the error views in trace analytics display data.

Select several customers. Data Prepper writes spans after it receives the complete trace, so the data can take up to three minutes to appear. To verify that OpenSearch contains the trace data, run the following command:

```bash
curl -sk -u admin:<custom-admin-password> "https://localhost:9200/_cat/indices/otel-v1-apm-*?v"
```
{% include copy.html %}

The response lists the `otel-v1-apm-span-000001` and `otel-v1-apm-service-map` indexes. The `docs.count` column shows a nonzero number of documents for each index.

### Step 7: View trace data in OpenSearch Dashboards

Go to [http://localhost:5601](http://localhost:5601) and log in as the `admin` user with the password that you set in Step 1. On the top menu, go to **Observability** > **Traces**. Make sure that **Data Prepper** is selected as the data source.

The **Traces** page lists the spans and traces from HotROD, and the **Services** page shows each service and a map of the dependencies between them. If you don't see any data, use the time picker to select a time range that includes the time at which you generated the traces. For more information, see [Trace analytics in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/observing-your-data/trace/ta-dashboards/).

### Step 8: Clean up

To stop the containers and delete their data, run the following command:

```bash
docker compose down -v
```
{% include copy.html %}
