---
layout: default
title: aggregate
parent: Processors
grand_parent: Pipelines
nav_order: 45
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/processors/aggregate/
redirect_to: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/processors/aggregate/
---

# aggregate

## Overview

The `aggregate` processor groups events based on the keys provided and performs an action on each group. The following table describes the options you can use to configure the `aggregate` processor.

Option | Required | Type | Description
:--- | :--- | :--- | :---
identification_keys | Yes | List | An unordered list by which to group events. Events with the same values as these keys are put into the same group. If an event does not contain one of the `identification_keys`, then the value of that key is considered to be equal to `null`. At least one identification_key is required (for example, `["sourceIp", "destinationIp", "port"]`).
action | Yes | AggregateAction | The action to be performed for each group. One of the available aggregate actions must be provided or you can create custom aggregate actions. `remove_duplicates` and `put_all` are the available actions. For more information, see [Creating New Aggregate Actions](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/aggregate-processor#creating-new-aggregate-actions).
group_duration | No | String | The amount of time that a group should exist before it is concluded automatically. Supports ISO_8601 notation strings ("PT20.345S", "PT15M", etc.) as well as simple notation for seconds (`"60s"`) and milliseconds (`"1500ms"`). Default value is `180s`.

<!---## Configuration

Content will be added to this section.--->

## Metrics

The following table describes common [Abstract processor](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-api/src/main/java/org/opensearch/dataprepper/model/processor/AbstractProcessor.java) metrics.

| Metric name | Type | Description |
| ------------- | ---- | -----------|
| `recordsIn` | Counter | Metric representing the ingress of records to a pipeline component. |
| `recordsOut` | Counter | Metric representing the egress of records from a pipeline component. |
| `timeElapsed` | Timer | Metric representing the time elapsed during execution of a pipeline component. |


The `aggregate` processor includes the following custom metrics.

**Counter**

* `actionHandleEventsOut`: The number of events that have been returned from the `handleEvent` call to the configured [action](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/aggregate-processor#action).
* `actionHandleEventsDropped`: The number of events that have not been returned from the `handleEvent` call to the configured [action](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/aggregate-processor#action).
* `actionHandleEventsProcessingErrors`: The number of calls made to `handleEvent` for the configured [action](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/aggregate-processor#action) that resulted in an error.
* `actionConcludeGroupEventsOut`: The number of events that have been returned from the `concludeGroup` call to the configured [action](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/aggregate-processor#action).
* `actionConcludeGroupEventsDropped`: The number of events that have not been returned from the `condludeGroup` call to the configured [action](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/aggregate-processor#action).
* `actionConcludeGroupEventsProcessingErrors`: The number of calls made to `concludeGroup` for the configured [action](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/aggregate-processor#action) that resulted in an error.

**Gauge**

* `currentAggregateGroups`: The current number of groups. This gauge decreases when a group concludes and increases when an event initiates the creation of a new group.