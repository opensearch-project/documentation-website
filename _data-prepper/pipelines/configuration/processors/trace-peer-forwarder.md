---
layout: default
title: add_entries
parent: Processors
grand_parent: Pipelines
nav_order: 45
---

# Trace peer forwarder processor

The `trace peer forwarder` processor is used to reduce the number of events that are forwarded in a trace analytics pipeline by half when using [Peer Forwarder](https://github.com/opensearch-project/data-prepper/blob/main/docs/peer_forwarder.md). 
It groups the events based on `trace_id` similar to `service_map_stateful` and `otel_trace_raw ` processors. 

In [Trace Analytics pipeline](https://github.com/opensearch-project/data-prepper/blob/main/docs/trace_analytics.md#trace-analytics-pipeline) each event is duplicated, when it is sent from `otel-trace-pipeline` to `raw-pipeline` and `service-map-pipeline`.
The event is forwarded once in each pipeline. Using this processor event will be forwarded only once in `otel-trace-pipeline` to correct peer. 

## Basic usage

To get started with `trace peer forwarder`, create the following `pipeline.yaml` file along with [Peer Forwarder]({{site.url}}{{site.baseurl}}/managing-data-prepper/peer-forwarder/) in the `data-prepper-config.yaml` file:


```yaml
otel-trace-pipeline:
  delay: "100"
  source:
    otel_trace_source:
  processor:
    - trace_peer_forwarder:
  sink:
    - pipeline:
        name: "raw-pipeline"
    - pipeline:
        name: "service-map-pipeline"
raw-pipeline:
  source:
    pipeline:
      name: "entry-pipeline"
  processor:
    - otel_trace_raw:
  sink:
    - opensearch:
service-map-pipeline:
  delay: "100"
  source:
    pipeline:
      name: "entry-pipeline"
  processor:
    - service_map_stateful:
  sink:
    - opensearch:
```

In the preceding pipeline, events are forwarded in the `otel-trace-pipeline` to correct peer, and no forwarding is performed in `raw-pipeline` or `service-map-pipeline`.
