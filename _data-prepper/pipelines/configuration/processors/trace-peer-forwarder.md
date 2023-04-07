---
layout: default
title: Trace peer forwarder
parent: Processors
grand_parent: Pipelines
nav_order: 45
---

# Trace peer forwarder

The Trace peer forwarder processor is used with [Peer forwarder](https://github.com/opensearch-project/documentation-website/pull/3238/%7B%7Bsite.url%7D%7D%7B%7Bsite.baseurl%7D%7D/data-prepper/managing-data-prepper/peer-forwarder/) to reduce by half the number of events forwarded in a [Trace analytics](https://github.com/opensearch-project/documentation-website/pull/3238/%7B%7Bsite.url%7D%7D%7B%7Bsite.baseurl%7D%7D/data-prepper/common-use-cases/trace-analytics/) pipeline. Typically in Trace analytics, each event is duplicated when it is sent from `otel-trace-pipeline` to `raw-pipeline` and `service-map-pipeline`. When pipelines forward events, this causes the core peer forwarder to make multiple HTTP requests for the same event. You can use Trace peer forwarder to forward an event once through the `otel-trace-pipeline` instead of `raw-pipeline` and `service-map-pipeline`, which prevents unnecessary HTTP requests.

You should use `Trace peer forwarder` for trace analytics pipelines when you have multiple nodes.

## Usage

To get started with `Trace peer forwarder`, first configure [Peer forwarder]({{site.url}}{{site.baseurl}}/managing-data-prepper/peer-forwarder/). Then, create the a `pipeline.yaml` file and specify `trace peer forwarder` as the processor. You can configure `Peer forwarder` in your `data-prepper-config.yaml` file. For more detailed information, see [Configuring Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/#2-configuring-data-prepper).

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