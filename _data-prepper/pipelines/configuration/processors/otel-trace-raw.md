---
layout: default
title: otel_trace_raw
parent: Processors
grand_parent: Pipelines
nav_order: 45
---

# otel_trace_raw

## Overview

This processor is a Data Prepper event record type replacement of `otel_trace_raw_prepper` (no longer supported since Data Prepper 2.0). The processor fills in trace group related fields including the following.

* `traceGroup`: root span name
* `endTime`: end time of the entire trace in ISO 8601
* `durationInNanos`: duration of the entire trace in nanoseconds
* `statusCode`: status code for the entire trace in nanoseconds

in all incoming Data Prepper span records by state caching the root span info per traceId. 

Option | Required | Type | Description
:--- | :--- | :--- | :---
trace_flush_interval | No | Integer | Represents the time interval in seconds to flush all the descendant spans without any root span. Default is 180.

<!---## Configuration

Content will be added to this section.--->

## Metrics

Apart from common metrics in the [Abstract processor](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-api/src/main/java/org/opensearch/dataprepper/model/processor/AbstractProcessor.java), the `OTel_trace_raw` processor introduces the following custom metrics:

* `traceGroupCacheCount` - (gauge) The count of trace groups in the trace group cache
* `spanSetCount` - (gauge) The count of span sets in the span set collection