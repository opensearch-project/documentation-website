---
layout: default
title: Anomaly detection with Data Prepper
parent: Common use cases
nav_order: 30
---

# Anomaly detection with Data Prepper

You can use Data Prepper to train models and generate anomalies in near real-time on time-series aggregated events. You can generate anomalies either on events generated within the pipeline, or on events coming directly into the pipeline, like OpenTelemetry metrics. You can feed these tumbling window aggregated time-series events to the [Anomaly detector]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/anomaly-detector/) processor, which trains a model and generates anomalies with a grade score. Then write the anomalies to a separate index to create document monitors and trigger fast alerting.

## Metrics from logs 

The following pipeline receives logs using an HTTP source like FluentBit, extracts important values from the logs by matching the value in the `log` key against the grok common Apache log pattern, and then forwards the grokked logs to both the `log-to-metrics-pipeline sub-pipeline` and to an OpenSearch index named `logs`.

The `log-to-metrics-pipeline` sub-pipeline receives the grokked logs from the `apache-log-pipeline-with-metrics sub-pipeline`, aggregates them, and derives histogram metrics based on the values in the `clientip` and `request` keys. It then sends the histogram metrics to an OpenSearch index named `histogram_metrics`, as well as to the `log-to-metrics-anomaly-detector` sub-pipeline.

The `log-to-metrics-anomaly-detector-pipeline` sub-pipeline receives the aggregated histogram metrics from the `log-to-metrics-pipeline` sub-pipeline and sends them to the Anomaly detector processor to detect anomalies using the Random Cut Forest algorithm. If it detects anomalies, it sends them to an OpenSearch index named `log-metric-anomalies`.

```json
apache-log-pipeline-with-metrics:
  source:
    http:
      # Provide the path for ingestion. ${pipelineName} will be replaced with pipeline name configured for this pipeline.
      # In this case it would be "/apache-log-pipeline-with-metrics/logs". This will be the FluentBit output URI value.
      path: "/${pipelineName}/logs"
  processor:
    - grok:
        match:
          log: [ "%{COMMONAPACHELOG_DATATYPED}" ]
  sink:
    - opensearch:
        ...
        index: "logs"
    - pipeline:
        name: "log-to-metrics-pipeline"

log-to-metrics-pipeline:
  source:
    pipeline:
      name: "apache-log-pipeline-with-metrics"
  processor:
    - aggregate:
        # Specify the required identification keys
        identification_keys: ["clientip", "request"]
        action:
          histogram:
            # Specify the appropriate values for each the following fields
            key: "bytes"
            record_minmax: true
            units: "bytes"
            buckets: [0, 25000000, 50000000, 75000000, 100000000]
        # Pick the required aggregation period
        group_duration: "30s"
  sink:
    - opensearch:
        ...
        index: "histogram_metrics"
    - pipeline:
        name: "log-to-metrics-anomaly-detector-pipeline"

log-to-metrics-anomaly-detector-pipeline:
  source:
    pipeline:
      name: "log-to-metrics-pipeline"
  processor:
    - anomaly_detector:
        # Specify the key on which to run anomaly detection
        keys: [ "bytes" ]
        mode:
          random_cut_forest:
  sink:
    - opensearch:
        ...
        index: "log-metric-anomalies"
```

## Metrics from traces

You can derive metrics from traces and find anomalies in these generated metrics. In this example, the `entry-pipeline` sub-pipeline receives trace data from the OpenTelemetry Collector and forwards it to the following sub-pipelines:

- `span-pipeline` – Extracts the raw spans from the traces. It sends the raw spans to any indexes OpenSearch prefixed with `otel-v1-apm-span`.

- `service-map-pipeline` – Aggregates and analyzes it to create documents that represent connections between services. It sends these documents to an OpenSearch index named `otel-v1-apm-service-map`. You can then see a visualization of the service map through the [Trace Analytics]({{site.url}}{{site.baseurl}}/observing-your-data/trace/index/) plugin for OpenSearch Dashboards.

- `trace-to-metrics-pipeline` -–Aggregates and derives histogram metrics from the traces based on the value of the `serviceName`. It then sends the derived metrics to an OpenSearch index named `metrics_for_traces` and to the `trace-to-metrics-anomaly-detector-pipeline` sub-pipeline.

The `trace-to-metrics-anomaly-detector-pipeline` sub-pipeline receives the aggregated histogram metrics from the `trace-to-metrics-pipeline` and sends them to the Anomaly detector processor to detect anomalies using the Random Cut Forest algorithm. If it detects any anomalies, it sends them to an OpenSearch index named `trace-metric-anomalies`.