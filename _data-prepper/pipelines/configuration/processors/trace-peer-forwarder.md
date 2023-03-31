---
layout: default
title: Trace peer forwarder
parent: Processors
grand_parent: Pipelines
nav_order: 45
---

# Trace peer forwarder

The `Trace peer forwarder` processor is used to reduce the number of events that are forwarded in a [Trace analytics]({{site.url}}{{site.baseurl}}/data-prepper/common-use-cases/trace-analytics/) pipeline by half when using [Peer forwarder]({{site.url}}{{site.baseurl}}/data-prepper/managing-data-prepper/peer-forwarder/). Pipelines peer forward events, which causes the core peer forwarder to make multiple HTTP requests for the same event. You can use `Trace peer forwarder` to forward the event one time in the entry pipeline (`otel-trace`) instead of other pipelines, such as `service--map-pipeline` and `raw-pipeline`, and prevents unnecessary HTTP requests. `Trace peer forwarder` groups events based on `trace_id` similar to the `service_map_stateful` and `otel_trace_raw ` processors. 

You should use `Trace peer forwarder` when you have multiple nodes, and for trace analytics pipelines.

In [Trace analytics]({{site.url}}{{site.baseurl}}/data-prepper/common-use-cases/trace-analytics/), each event is duplicated when it is sent from the `otel-trace-pipeline` to the `raw-pipeline` and to the `service-map-pipeline`. The event is forwarded once in each pipeline. When you use this processor, the event is forwarded once in the `otel-trace-pipeline` pipeline to the correct peer. 

## Usage

To get started with `Trace peer forwarder`, configure [Peer forwarder]({{site.url}}{{site.baseurl}}/managing-data-prepper/peer-forwarder/). Then, create the a `pipelines.yaml` file and include `Trace peer forwarder` in your `data-prepper-config.yaml` file. For more detailed information, see [Configuring Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/#2-configuring-data-prepper).

See the following `pipeline.yaml` file example: 

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

In the preceding `pipeline.yaml` file, events are forwarded in the `otel-trace-pipeline` to the target peer, and no forwarding is performed in `raw-pipeline` or `service-map-pipeline`. This process helps improve network performance by forwarding events (as HTTP requests) once instead of twice. 