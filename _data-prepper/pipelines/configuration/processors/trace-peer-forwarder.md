---
layout: default
title: Trace peer forwarder
parent: Processors
grand_parent: Pipelines
nav_order: 45
---

# Trace peer forwarder

The `Trace peer forwarder` processor is used to reduce the number of events that are forwarded in a [Trace analytics]({{site.url}}{{site.baseurl}}/data-prepper/common-use-cases/trace-analytics/) pipeline by half when using [Peer forwarder]({{site.url}}{{site.baseurl}}/data-prepper/managing-data-prepper/peer-forwarder/). It groups the events based on `trace_id` similar to the `service_map_stateful` and `otel_trace_raw ` processors. 

<!--- Why is it reducing events? Why by half? WHat is the benefit/how does it help? How does it actually reduce events? Then lead into grouping by `trace_id` --->

In [Trace analytics]({{site.url}}{{site.baseurl}}/data-prepper/common-use-cases/trace-analytics/), each event is duplicated when it is sent from the `otel-trace-pipeline` to the `raw-pipeline` and to the `service-map-pipeline`. The event is forwarded once in each pipeline. When you use this processor, the event is forwarded once in the `otel-trace-pipeline` pipeline to the correct peer. 

<!--- How does this connect to Trace peer forwarder? How does the processor have an impact on Trace peer forwarder? --->

## Usage

To get started with `trace peer forwarder`, create the following `pipelines.yaml` file along with [Peer forwarder]({{site.url}}{{site.baseurl}}/managing-data-prepper/peer-forwarder/) <!--- What does this specifically mean? This is confusing. Can we delete this? Keep each YAML file separate in the explanation. Is order important?---> in your `data-prepper-config.yaml` file. For more detailed information, see [Configuring Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/#2-configuring-data-prepper).


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

In the preceding pipeline, <!--- Which preceding pipeline are we referring to? Do they mean in the preceding exampl? YAML file?---> events are forwarded in the `otel-trace-pipeline` to the correct peer <!--- How do we know they're correct? --->, and no forwarding is performed in `raw-pipeline` or `service-map-pipeline`. <!--- Is this how it reduces events? WHy does it skip these pipelines?--->

<!--- What is the  last image in the Trace analytics pipeline image? ---> 