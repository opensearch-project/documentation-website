---
layout: default
title: Ingesting application telemetry
nav_order: 10
parent: Application Performance Monitoring
---

# Ingesting application telemetry
**Introduced 3.5**
{: .label .label-purple }

To use APM, you need to ingest application traces and logs into OpenSearch using the following pipeline:

1. **OpenTelemetry Collector**: Receives telemetry from your instrumented applications and routes it to Data Prepper and Prometheus.
2. **Data Prepper**: Processes traces and logs, generates service maps and RED metrics, and writes data to OpenSearch and Prometheus.
3. **OpenSearch**: Stores traces, logs, and service topology data for querying and visualization.
4. **Prometheus**: Stores time-series RED metrics for service performance monitoring.

## Configuring the OpenTelemetry Collector

The [OpenTelemetry (OTel) Collector](https://opentelemetry.io/docs/collector/) acts as the entry point for all application telemetry. It receives data through the OpenTelemetry Protocol (OTLP) and routes traces and logs to Data Prepper while sending metrics to Prometheus.

The following example shows the key exporter and pipeline configuration for routing telemetry to Data Prepper and Prometheus:

```yaml
exporters:
  otlp/opensearch:
    endpoint: "data-prepper:21893"
    tls:
      insecure: true
      insecure_skip_verify: true

  otlphttp/prometheus:
    endpoint: "http://prometheus:9090/api/v1/otlp"
    tls:
      insecure: true

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [resourcedetection, memory_limiter, transform, batch]
      exporters: [otlp/opensearch]

    metrics:
      receivers: [otlp]
      processors: [resourcedetection, memory_limiter, batch]
      exporters: [otlphttp/prometheus]

    logs:
      receivers: [otlp]
      processors: [resourcedetection, memory_limiter, transform, batch]
      exporters: [otlp/opensearch]
```
{% include copy.html %}

The `otlp/opensearch` exporter sends traces and logs to Data Prepper. The `otlphttp/prometheus` exporter sends metrics directly to Prometheus. For a complete OTel Collector configuration example including receivers, processors, and telemetry settings, see the [observability-stack repository](https://github.com/opensearch-project/observability-stack/blob/main/docker-compose/otel-collector/config.yaml).
{: .note}

## Configuring Data Prepper pipelines

Data Prepper receives telemetry from the OTel Collector and processes it into the formats required for APM. The pipeline architecture routes data through specialized sub-pipelines for logs, traces, and service map generation.

The following example shows a complete Data Prepper pipeline configuration:

```yaml
# Main OTLP pipeline - receives all telemetry and routes by type
otlp-pipeline:
  source:
    otlp:
      ssl: false
  route:
    - logs: "getEventType() == \"LOG\""
    - traces: "getEventType() == \"TRACE\""
  sink:
    - pipeline:
        name: "otel-logs-pipeline"
        routes:
          - "logs"
    - pipeline:
        name: "otel-traces-pipeline"
        routes:
          - "traces"

# Log processing pipeline
otel-logs-pipeline:
  workers: 5 # config example to set workers 
  delay: 10 # config example to set delay 
  source:
    pipeline:
      name: "otlp-pipeline"
  buffer:
    bounded_blocking:
  sink:
    - opensearch:
        hosts: ["https://<opensearch-host>:9200"]
        username: <username>
        password: <password>
        insecure: true
        index_type: log-analytics-plain

# Trace processing pipeline
otel-traces-pipeline:
  source:
    pipeline:
      name: "otlp-pipeline"
  sink:
    - pipeline:
        name: "traces-raw-pipeline"
    - pipeline:
        name: "service-map-pipeline"

# Raw trace storage pipeline
traces-raw-pipeline:
  source:
    pipeline:
      name: "otel-traces-pipeline"
  processor:
    - otel_traces:
  sink:
    - opensearch:
        hosts: ["https://<opensearch-host>:9200"]
        username: <username>
        password: <password>
        insecure: true
        index_type: trace-analytics-plain-raw

# Service map and APM metrics pipeline
service-map-pipeline:
  source:
    pipeline:
      name: "otel-traces-pipeline"
  processor:
    - otel_apm_service_map:
        group_by_attributes: [telemetry.sdk.language] # Add any resource attribute to group by
  route:
    - otel_apm_service_map_route: 'getEventType() == "SERVICE_MAP"'
    - service_processed_metrics: 'getEventType() == "METRIC"'
  sink:
    - opensearch:
        hosts: ["https://<opensearch-host>:9200"]
        username: <username>
        password: <password>
        index_type: otel-v2-apm-service-map
        routes: [otel_apm_service_map_route]
        insecure: true
    - prometheus:
        url: "http://prometheus:9090/api/v1/write"
        routes: [service_processed_metrics]
```
{% include copy.html %}

### Pipeline architecture

The Data Prepper pipeline processes telemetry data through the following stages:

1. **Entry pipeline (`otlp-pipeline`)**: Receives all telemetry on port 21893 and routes logs and traces to their respective sub-pipelines.
2. **Log pipeline (`otel-logs-pipeline`)**: Maps the `time` field to `@timestamp` and writes logs to OpenSearch using the `log-analytics-plain` index type.
3. **Trace pipeline (`otel-traces-pipeline`)**: Distributes traces to both the raw storage pipeline and the service map pipeline.
4. **Raw trace pipeline (`traces-raw-pipeline`)**: Processes individual trace spans using the `otel_traces` processor and stores them in OpenSearch using the `trace-analytics-plain-raw` index type.
5. **Service map pipeline (`service-map-pipeline`)**: Uses the `otel_apm_service_map` processor to generate service dependency maps and RED metrics. Service map topology data is written to OpenSearch, and RED metrics are exported to Prometheus through remote write.

For more information about the `otel_apm_service_map` processor, see [APM service map processor]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/otel-apm-service-map/).
{: .note}

### Key configuration options

The following table describes the key options for the `otel_apm_service_map` processor.

| Option | Description |
| :--- | :--- |
| `group_by_attributes` | A list of resource attributes used to group services in the application map (for example, `telemetry.sdk.language`). |
| `window_duration` | The time window for aggregating trace data into service map entries. Default is `60s`. |

## Verifying ingestion

After configuring the OTel Collector and Data Prepper, verify that data is flowing correctly:

1. **Check OpenSearch indexes**: Verify that the following indexes are created in your OpenSearch cluster:
   - `otel-v1-apm-span-*`: Raw trace spans.
   - `otel-v2-apm-service-map`: Service topology data.
   - `logs-otel-v1-*`: Application logs.

2. **Check Prometheus targets**: Verify that the Data Prepper remote write target is active in your Prometheus instance.

3. **View the APM dashboard**: Navigate to **Observability** > **APM** in OpenSearch Dashboards to confirm that services appear in the [Services]({{site.url}}{{site.baseurl}}/observing-your-data/apm/services/) catalog and the [Application map]({{site.url}}{{site.baseurl}}/observing-your-data/apm/application-map/).

Ensure that all port mappings are correct between the OTel Collector, Data Prepper, OpenSearch, and Prometheus. Mismatched ports are a common cause of ingestion failures.
{: .warning}

## Next steps

- [Services]({{site.url}}{{site.baseurl}}/observing-your-data/apm/services/): View service performance metrics and dependencies.
- [Application map]({{site.url}}{{site.baseurl}}/observing-your-data/apm/application-map/): Explore the service topology visualization.
