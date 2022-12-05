---
layout: default
title: otel_trace_raw
parent: Processors
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

## Configuration

Content will be added to this section.

## Metrics

Content will be added to this section.