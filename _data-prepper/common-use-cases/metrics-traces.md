---
layout: default
title: Deriving metrics from traces
parent: Common use cases
nav_order: 20
---

# Deriving metrics from traces

You can use OpenSearch Data Prepper to derive metrics from OpenTelemetry traces. The following example pipeline receives incoming traces and extracts a metric called `durationInNanos`, aggregated over a tumbling window of 30 seconds. It then derives a histogram from the incoming traces.

The pipeline contains the following pipelines:

- `entry-pipeline` – Receives trace data from the OpenTelemetry collector and forwards it to the `trace_to_metrics_pipeline` pipeline.

- `trace-to-metrics-pipeline` - Receives the trace data from the `entry-pipeline` pipeline, aggregates it, and derives a histogram of `durationInNanos` from the traces based on the value of the `serviceName` field. It then sends the derived metrics to the OpenSearch index called `metrics_for_traces`.

```json
entry-pipeline:
  source:
    otel_trace_source:
      # Provide the path for ingestion. ${pipelineName} will be replaced with pipeline name.
      # In this case it would be "/entry-pipeline/v1/traces". This will be endpoint URI path in OpenTelemetry Exporter configuration.
      path: "/${pipelineName}/v1/traces"
  sink:
    - pipeline:
        name: "trace-to-metrics-pipeline"

trace-to-metrics-pipeline:
  source:
    pipeline:
      name: "entry-pipeline"
  processor:
    - aggregate:
        # Pick the required identification keys
        identification_keys: ["serviceName"]
        action:
          histogram:
            # Pick the appropriate values for each of the following fields
            key: "durationInNanos"
            record_minmax: true
            units: "seconds"
            buckets: [0, 10000000, 50000000, 100000000]
        # Specify an aggregation period
        group_duration: "30s"
  sink:
    - opensearch:
        ...
        index: "metrics_for_traces"
```
{% include copy-curl.html %}
