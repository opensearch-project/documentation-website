---
layout: default
title: service_map_stateful
parent: Processors
grand_parent: Pipelines
nav_order: 45
---

# service_map_stateful

## Overview

Uses OpenTelemetry data to create a distributed service map for visualization in OpenSearch Dashboards.

Option | Required | Type | Description
:--- | :--- | :--- | :---
window_duration | No | Integer | Represents the fixed time window in seconds to evaluate service-map relationships. Default value is 180.

<!---## Configuration

Content will be added to this section.--->

## Metrics

In addition to the metrics from [AbstractProcessor](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-api/src/main/java/org/opensearch/dataprepper/model/processor/AbstractProcessor.java):

<!--- This is incomplete. Add the following? "Apart from common metrics in the [Abstract processor](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-api/src/main/java/org/opensearch/dataprepper/model/processor/AbstractProcessor.java)"--->

* `traceGroupCacheCount` - (gauge) The count of trace groups in the trace group cache
* `spanSetCount` - (gauge) The count of span sets in the span set collection