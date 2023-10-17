---
layout: default
title: service_map 
parent: Processors
grand_parent: Pipelines
nav_order: 95
---

# service_map

The `service_map` processor uses OpenTelemetry data to create a distributed service map for visualization in OpenSearch Dashboards. 

## Configuration

The following table describes the option you can use to configure the `service_map` processor.

Option | Required | Type | Description
:--- | :--- | :--- | :---
window_duration | No | Integer | Represents the fixed time window, in seconds, during which service map relationships are evaluated. Default value is 180.

<!---## Configuration

Content will be added to this section.--->

## Metrics

The following table describes common [Abstract processor](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-api/src/main/java/org/opensearch/dataprepper/model/processor/AbstractProcessor.java) metrics.

| Metric name | Type | Description |
| ------------- | ---- | -----------|
| `recordsIn` | Counter | Metric representing the ingress of records to a pipeline component. |
| `recordsOut` | Counter | Metric representing the egress of records from a pipeline component. |
| `timeElapsed` | Timer | Metric representing the time elapsed during execution of a pipeline component. |

The `service-map-stateful` processor includes following custom metrics:

* `traceGroupCacheCount`: The number of trace groups in the trace group cache.
* `spanSetCount`: The number of span sets in the span set collection.