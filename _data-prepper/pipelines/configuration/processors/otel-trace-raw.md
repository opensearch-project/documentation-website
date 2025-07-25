---
layout: default
title: otel_trace_raw
parent: Processors
grand_parent: Pipelines
nav_order: 45
redirect_from: 
 - /data-prepper/pipelines/configuration/processors/otel-trace-raw/
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/processors/otel-trace-raw/
redirect_to: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/processors/otel-trace-raw/
---

# otel_trace_raw

## Overview

The `otel_trace_raw` processor completes trace-group-related fields in all incoming Data Prepper span records by state caching the root span information for each `tradeId`. This processor includes the following parameters.

* `traceGroup`: Root span name
* `endTime`: End time of the entire trace in International Organization for Standardization (ISO) 8601 format
* `durationInNanos`: Duration of the entire trace in nanoseconds
* `statusCode`: Status code for the entire trace in nanoseconds

The following table describes the options you can use to configure the `otel_trace_raw` processor.

Option | Required | Type | Description
:--- | :--- | :--- | :---
trace_flush_interval | No | Integer | Represents the time interval in seconds to flush all the descendant spans without any root span. Default is 180.

<!---## Configuration

Content will be added to this section.--->

## Metrics

The following table describes common [Abstract processor](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-api/src/main/java/org/opensearch/dataprepper/model/processor/AbstractProcessor.java) metrics.

| Metric name | Type | Description |
| ------------- | ---- | -----------|
| `recordsIn` | Counter | Metric representing the ingress of records to a pipeline component. |
| `recordsOut` | Counter | Metric representing the egress of records from a pipeline component. |
| `timeElapsed` | Timer | Metric representing the time elapsed during execution of a pipeline component. |

The `otel_trace_raw` processor includes the following custom metrics.

* `traceGroupCacheCount`: The number of trace groups in the trace group cache.
* `spanSetCount`: The number of span sets in the span set collection.