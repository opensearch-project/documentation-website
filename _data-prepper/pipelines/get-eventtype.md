---
layout: default
title: getEventType()
parent: Functions
grand_parent: Pipelines
nav_order: 45
---

# getEventType()

The `getEventType()` function returns the internal event type of the current event. This function is particularly useful when working with unified sources like the OTLP source that can receive multiple types of telemetry data.

## Syntax

```
getEventType()
```

## Return value

The function returns a string representing the event type. The supported event types are: `LOG`, `TRACE`, `METRIC`, `DOCUMENT` 

## Usage

Use this function to check the event type before performing conditional processing or routing. This is especially useful when you need to handle different types of telemetry data differently in your pipeline.

### Basic example

Check if an event is a trace event:

```json
getEventType() == "TRACE"
```
{% include copy.html %}

### Routing example with OTLP source

Route different telemetry signals to different pipelines based on event type:

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

Process events differently based on their type:

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
