---
layout: default
title: getEventType()
parent: Functions
grand_parent: Pipelines
nav_order: 12
---

# getEventType()

The `getEventType()` function returns the internal event type of the current event. This function is particularly useful when working with unified sources that can receive multiple types of telemetry data, such as the [OTLP source]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/otlp-source/).

## Syntax

```java
getEventType()
```

## Return value

The function returns a string representing the event type. The supported event types are `LOG`, `TRACE`, `METRIC`, and `DOCUMENT`.

## Usage

Use this function to check the event type before performing conditional processing or routing. This is especially useful when you need to handle different types of telemetry data differently in your pipeline.

### Basic example

Check whether an event is a trace event:

```json
getEventType() == "TRACE"
```
{% include copy.html %}

### Routing example with OTLP source

To route different telemetry signals to different pipelines based on event type, use the `getEventType()` function to determine each event's type and route the different event types to different pipelines:

```yaml
otel-telemetry-pipeline:
  source:
    otlp:
      ssl: false
  route:
    - logs: 'getEventType() == "LOG"'
    - traces: 'getEventType() == "TRACE"'
    - metrics: 'getEventType() == "METRIC"'
  sink:
    - pipeline:
        name: "logs-pipeline"
        routes:
          - "logs"
    - pipeline:
        name: "traces-pipeline"
        routes:
          - "traces"
    - pipeline:
        name: "metrics-pipeline"
        routes:
          - "metrics"
```
{% include copy.html %}

### Conditional processing example

To process events differently based on their type, use the `add_when` expression to conditionally add fields to each event:

```yaml
processor:
  - add_entries:
      entries:
        - key: "log_processed"
          value: true
          add_when: 'getEventType() == "LOG"'
  - add_entries:
      entries:
        - key: "metric_type"
          value: "otel"
          add_when: 'getEventType() == "METRIC"'
```
{% include copy.html %}

## Related documentation

- [OTLP source]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/sources/otlp-source/)