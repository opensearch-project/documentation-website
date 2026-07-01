---
layout: default
title: Aggregate
parent: Processors
grand_parent: Pipelines
nav_order: 20
---

# Aggregate processor

The `aggregate` processor groups events based on the values of `identification_keys`. Then, the processor performs an action on each group, helping reduce unnecessary log volume and creating aggregated logs over time. You can use existing actions or create your own custom aggregations using Java code.


## Configuration

The following table describes the options you can use to configure the `aggregate` processor.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`identification_keys` | Yes | List | An unordered list by which to group events. Events with the same values as these keys are put into the same group. If an event does not contain one of the `identification_keys`, then the value of that key is considered to be equal to `null`. At least one identification_key is required (for example, `["sourceIp", "destinationIp", "port"]`).
`action` | Yes | AggregateAction | The action to be performed on each group. One of the [available aggregate actions](#available-aggregate-actions) must be provided, or you can create custom aggregate actions. `remove_duplicates` and `put_all` are the available actions. For more information, see [Creating New Aggregate Actions](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/aggregate-processor#creating-new-aggregate-actions).
`group_duration` | No | String | The amount of time that a group should exist before it is concluded automatically. Supports ISO_8601 notation strings ("PT20.345S", "PT15M", etc.) as well as simple notation for seconds (`"60s"`) and milliseconds (`"1500ms"`). Default value is `180s`.
`local_mode` | No | Boolean | When `local_mode` is set to `true`, the aggregation is performed locally on each OpenSearch Data Prepper node instead of forwarding events to a specific node based on the `identification_keys` using a hash function. Default is `false`.
`output_unaggregated_events` | No | Boolean | When set to `true`, unaggregated events are forwarded to the next processor or sink in the pipeline. Default is `false`.
`aggregated_events_tag` | No | String | A tag to add to aggregated events in order to distinguish them from unaggregated events. Required when `output_unaggregated_events` is `true`.
`aggregate_when` | No | String | A conditional expression that determines whether the aggregate processor processes an event. When the condition evaluates to `false`, the event is forwarded without aggregation.
`acknowledge_on_conclude` | No | Boolean | When set to `true`, releases the group's event handle when the group is finalized (either by reaching the `group_duration` timeout or by a condition defined by the action). This sacrifices end-to-end acknowledgments but prevents reprocessing. Default is `false`.
`disable_group_acknowledgments` | No | Boolean | When set to `true`, disables group acknowledgments. Default is `false`.

## Available aggregate actions

Use the following aggregate actions to determine how the `aggregate` processor processes events in each group.

### remove_duplicates 

The `remove_duplicates` action processes the first event for a group immediately and drops any events that duplicate the first event from the source. For example, when using `identification_keys: ["sourceIp", "destination_ip"]`:

1. The `remove_duplicates` action processes `{ "sourceIp": "127.0.0.1", "destinationIp": "192.168.0.1", "status": 200 }`, the first event in the source.
2. OpenSearch Data Prepper drops the `{ "sourceIp": "127.0.0.1", "destinationIp": "192.168.0.1", "bytes": 1000 }` event because the `sourceIp` and `destinationIp` match the first event in the source.
3. The `remove_duplicates` action processes the next event, `{ "sourceIp": "127.0.0.2", "destinationIp": "192.168.0.1", "bytes": 1000 }`. Because the `sourceIp` is different from the first event of the group, Data Prepper creates a new group based on the event.

### put_all

The `put_all` action combines events belonging to the same group by overwriting existing keys and adding new keys, similarly to the Java `Map.putAll`. The action drops all events that make up the combined event. For example, when using `identification_keys: ["sourceIp", "destination_ip"]`, the `put_all` action processes the following three events:

```json
{ "sourceIp": "127.0.0.1", "destinationIp": "192.168.0.1", "status": 200 }
{ "sourceIp": "127.0.0.1", "destinationIp": "192.168.0.1", "bytes": 1000 }
{ "sourceIp": "127.0.0.1", "destinationIp": "192.168.0.1", "http_verb": "GET" }
```

Then the action combines the events into one. The pipeline then uses the following combined event:

```json
{ "sourceIp": "127.0.0.1", "destinationIp": "192.168.0.1", "status": 200, "bytes": 1000, "http_verb": "GET" }
```

### count

The `count` event counts events that belong to the same group and generates a new event with values of the `identification_keys` and the count, which indicates the number of new events. You can customize the processor with the following configuration options:


 * `count_key`: The key used for storing the count. Default name is `aggr._count`.
* `start_time_key`: The key used for storing the start time. Default name is `aggr._start_time`.
* `end_time_key`: The key used for storing the end time. Default name is `aggr._end_time`.
* `metric_name`: The name of the metric when using the `otel_metrics` output format. Default is `count`.
* `unique_keys`: A list of keys for which to count unique values. When specified, the count reflects the number of unique combinations of these keys rather than the total number of events.
* `output_format`: Format of the aggregated event.
     * `otel_metrics`: Default output format. Outputs in OTel metrics SUM type with count as value.
    * `raw` - Generates a JSON object with the `count_key` field as a count value and the `start_time_key` field with aggregation start time as value.

For an example, when using `identification_keys: ["sourceIp", "destination_ip"]`, the `count` action counts and processes the following events:

```json
{ "sourceIp": "127.0.0.1", "destinationIp": "192.168.0.1", "status": 200 }
{ "sourceIp": "127.0.0.1", "destinationIp": "192.168.0.1", "status": 503 }
{ "sourceIp": "127.0.0.1", "destinationIp": "192.168.0.1", "status": 400 }
```

The processor creates the following event:

```json
{"isMonotonic":true,"unit":"1","aggregationTemporality":"AGGREGATION_TEMPORALITY_DELTA","kind":"SUM","name":"count","description":"Number of events","startTime":"2022-12-02T19:29:51.245358486Z","time":"2022-12-02T19:30:15.247799684Z","value":3.0,"sourceIp":"127.0.0.1","destinationIp":"192.168.0.1"}
```

### histogram

The `histogram` action aggregates events belonging to the same group and generates a new event with values of the `identification_keys` and histogram of the aggregated events based on a configured `key`. The histogram contains the number of events, sum, buckets, bucket counts, and optionally min and max of the values corresponding to the `key`. The action drops all events that make up the combined event.

You can customize the processor with the following configuration options:

* `key`: Name of the field in the events the histogram generates.
* `generated_key_prefix`: `key_prefix` used by all the fields created in the aggregated event. Having a prefix ensures that the names of the histogram event do not conflict with the field names in the event.
* `units`: The units for the values in the `key`.
* `record_minmax`: A Boolean value indicating whether the histogram should include the min and max of the values in the aggregation.
* `buckets`: A list of buckets (values of type `double`) indicating the buckets in the histogram.
* `metric_name`: The name of the metric when using the `otel_metrics` output format. Default is `histogram`.
* `output_format`: Format of the aggregated event.
    * `otel_metrics`: Default output format. Outputs in OTel metrics SUM type with count as value.
    * `raw`: Generates a JSON object with `count_key` field with count as value and `start_time_key` field with aggregation start time as value.


For example, when using `identification_keys: ["sourceIp", "destination_ip", "request"]`, `key: latency`, and `buckets: [0.0, 0.25, 0.5]`, the `histogram` action processes the following events:

```json
{ "sourceIp": "127.0.0.1", "destinationIp": "192.168.0.1", "request" : "/index.html", "latency": 0.2 }
{ "sourceIp": "127.0.0.1", "destinationIp": "192.168.0.1", "request" : "/index.html", "latency": 0.55}
{ "sourceIp": "127.0.0.1", "destinationIp": "192.168.0.1", "request" : "/index.html", "latency": 0.25 }
{ "sourceIp": "127.0.0.1", "destinationIp": "192.168.0.1", "request" : "/index.html", "latency": 0.15 }
```

Then the processor creates the following event:

```json
{"max":0.55,"kind":"HISTOGRAM","buckets":[{"min":-3.4028234663852886E38,"max":0.0,"count":0},{"min":0.0,"max":0.25,"count":2},{"min":0.25,"max":0.50,"count":1},{"min":0.50,"max":3.4028234663852886E38,"count":1}],"count":4,"bucketCountsList":[0,2,1,1],"description":"Histogram of latency in the events","sum":1.15,"unit":"seconds","aggregationTemporality":"AGGREGATION_TEMPORALITY_DELTA","min":0.15,"bucketCounts":4,"name":"histogram","startTime":"2022-12-14T06:43:40.848762215Z","explicitBoundsCount":3,"time":"2022-12-14T06:44:04.852564623Z","explicitBounds":[0.0,0.25,0.5],"request":"/index.html","sourceIp": "127.0.0.1", "destinationIp": "192.168.0.1", "key": "latency"}
```

### rate_limiter

The `rate_limiter` action controls the number of events aggregated per second. By default, `rate_limiter` blocks the `aggregate` processor from running if it receives more events than the configured number allowed. You can overwrite the number of events that triggers the `rate_limiter` by using the `when_exceeds` configuration option. 

You can customize the processor with the following configuration options:

* `events_per_second`: The number of events allowed per second.
* `when_exceeds`: Indicates what action the `rate_limiter` takes when the number of events received is greater than the number of events allowed per second. Default value is `block`, which blocks the processor from running after the maximum number of events allowed per second is reached until the next second. Alternatively, the `drop` option drops the excess events received in that second.

For example, if `events_per_second` is set to `1` and `when_exceeds` is set to `drop`, the action tries to process the following events when received during the one second time interval:

```json
{ "sourceIp": "127.0.0.1", "destinationIp": "192.168.0.1", "status": 200 }
{ "sourceIp": "127.0.0.1", "destinationIp": "192.168.0.1", "bytes": 1000 }
{ "sourceIp": "127.0.0.1", "destinationIp": "192.168.0.1", "http_verb": "GET" }
```

The first event is processed, but the remaining events are dropped because `when_exceeds` is set to `drop`:

```json
{ "sourceIp": "127.0.0.1", "destinationIp": "192.168.0.1", "status": 200 }
```

If `when_exceeds` is set to `block`, the processor pauses until the next second before processing the remaining events.

### append

The `append` action combines multiple events into a single event by appending values from the specified keys across all events in the group. Unlike `put_all`, which overwrites values, `append` collects all values for the specified keys into lists.

You can customize the processor with the following configuration option:

* `keys_to_append`: A list of keys whose values should be appended across the events in the group. The aggregated event contains lists of all values encountered for each key.

For example, when using `identification_keys: ["sourceIp"]` and `keys_to_append: ["status"]`, the `append` action processes the following events:

```json
{ "sourceIp": "127.0.0.1", "status": 200 }
{ "sourceIp": "127.0.0.1", "status": 503 }
{ "sourceIp": "127.0.0.1", "status": 400 }
```

The processor creates the following event:

```json
{ "sourceIp": "127.0.0.1", "status": [200, 503, 400] }
```

### tail_sampler

The `tail_sampler` action samples OpenTelemetry traces after collecting all spans for a trace within the group duration. It allows you to keep all error traces while sampling a percentage of successful traces, reducing storage while retaining all error traces.

You can customize the processor with the following configuration options:

* `wait_period`: The amount of time to wait before considering a trace complete. Must be greater than 0 and no more than 60 seconds. Required.
* `percent`: The percentage of non-error traces to sample (0--100, exclusive). All error traces are always kept. Required.
* `condition`: A conditional expression that determines whether an event is an error event. Events matching this condition are always kept regardless of the `percent` setting.

For example, when using `identification_keys: ["traceId"]`, `wait_period: "10s"`, `percent: 20`, and `condition: '/status_code == 2'`, the `tail_sampler` action keeps all traces that contain at least one span with `status_code == 2` (error) and samples 20% of the remaining successful traces.

### percent_sampler

The `percent_sampler` action controls the number of events aggregated based on a percentage of events. The action drops any events not included in the percentage. 

You can set the percentage of events using the `percent` configuration, which indicates the percentage of events processed during a one second interval (0%--100%).

For example, if percent is set to `50`, the action tries to process the following events in the one-second interval:

```json
{ "sourceIp": "127.0.0.1", "destinationIp": "192.168.0.1", "bytes": 2500 }
{ "sourceIp": "127.0.0.1", "destinationIp": "192.168.0.1", "bytes": 500 }
{ "sourceIp": "127.0.0.1", "destinationIp": "192.168.0.1", "bytes": 1000 }
{ "sourceIp": "127.0.0.1", "destinationIp": "192.168.0.1", "bytes": 3100 }
```

The pipeline processes 50% of the events, drops the other events, and does not generate a new event:

```json
{ "sourceIp": "127.0.0.1", "destinationIp": "192.168.0.1", "bytes": 500 }
{ "sourceIp": "127.0.0.1", "destinationIp": "192.168.0.1", "bytes": 3100 }
```

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
* `actionConcludeGroupEventsDropped`: The number of events that have not been returned from the `concludeGroup` call to the configured [action](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/aggregate-processor#action).
* `actionConcludeGroupEventsProcessingErrors`: The number of calls made to `concludeGroup` for the configured [action](https://github.com/opensearch-project/data-prepper/tree/main/data-prepper-plugins/aggregate-processor#action) that resulted in an error.

**Gauge**

* `currentAggregateGroups`: This gauge represents the current number of active aggregate groups. It decreases when an aggregate group is completed and its results are emitted and increases when a new event initiates the creation of a new aggregate group.
