---
layout: default
title: Grok
parent: Processors
grand_parent: Pipelines
nav_order: 50
---

# Grok

The Grok processor uses pattern matching to structure and extract important keys from unstructured data.

## Configuration

The following table describes options you can use with the Grok processor to structure your data and make your data easier to query.

Option | Required | Type | Description
:--- | :--- |:--- | :---
`break_on_match` | No | Boolean | Specifies whether to match all patterns (`true`) or stop once the first successful match is found (`false`). Default is `true`.
`grok_when` | No | String  | Specifies under what condition the `grok` processor should perform matching. Default is no condition.
`keep_empty_captures` | No | Boolean | Enables the preservation of `null` captures from the processed output. Default is `false`.
`keys_to_overwrite` | No | List | Specifies which existing keys will be overwritten if there is a capture with the same key value. Default is `[]`.
`match` | No | Map | Specifies which keys should match specific patterns. Default is an empty response body.
`named_captures_only` | No | Boolean | Specifies whether to keep only named captures. Default is `true`.
`pattern_definitions` | No | Map | Allows for a custom pattern that can be used inline inside the response body. Default is an empty response body.
`patterns_directories` | No | List | Specifies which directory paths contain the custom pattern files. Default is an empty list.
`pattern_files_glob` | No | String | Specifies which pattern files to use from the directories specified for `pattern_directories`. Default is `*`.
`target_key` | No | String | Specifies a parent-level key used to store all captures. Default value is `null`.
`timeout_millis` | No | Integer | The maximum amount of time during which matching occurs. Setting to `0` prevents any matching from occurring. Default is `30,000`.
`performance_metadata` | No | Boolean | Whether or not to add the performance metadata to events. Default is `false`. For more information, see [Grok performance metadata](#grok-performance-metadata).


## Conditional grok

The `grok` processor can be configured to run conditionally by using the `grok_when` option. The following is an example Grok processor configuration that uses `grok_when`:

```
processor:
  - grok:
      grok_when: '/type == "ipv4"'
        match:
          message: ['%{IPV4:clientip} %{WORD:request} %{POSINT:bytes}']
  - grok:
      grok_when: '/type == "ipv6"'
        match:
          message: ['%{IPV6:clientip} %{WORD:request} %{POSINT:bytes}']
```
{% include copy.html %}

The `grok_when` option can take a conditional expression. This expression is detailed in the [Expression syntax](https://opensearch.org/docs/latest/data-prepper/pipelines/expression-syntax/) documentation.

## Grok performance metadata

When the `performance_metadata` option is set to `true`, the `grok` processor adds the following metadata keys to each event:

* `_total_grok_processing_time`: The total amount of time, in milliseconds, that the `grok` processor takes to match the event. This is the sum of the processing time based on all of the `grok` processors that ran on the event and have the `performance_metadata` option enabled.
* `_total_grok_patterns_attempted`: The total number of `grok` pattern match attempts across all `grok` processors that ran on the event.

To include Grok performance metadata when the event is sent to the sink inside the pipeline, use the `add_entries` processor to describe the metadata you want to include, as shown in the following example:


```yaml
processor:
    - grok:
        performance_metadata: true
        match:
          log: "%{COMMONAPACHELOG"}
    - add_entries:
        entries:
          - add_when: 'getMetadata("_total_grok_patterns_attempted") != null'
            key: "grok_patterns_attempted"
            value_expression: 'getMetadata("_total_grok_patterns_attempted")'
          - add_when: 'getMetadata("_total_grok_processing_time") != null'
            key: "grok_time_spent"
            value_expression: 'getMetadata("_total_grok_processing_time")'
```

## Metrics

The following table describes common [Abstract processor](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-api/src/main/java/org/opensearch/dataprepper/model/processor/AbstractProcessor.java) metrics.

| Metric name | Type | Description |
| ------------- | ---- | -----------|
| `recordsIn` | Counter | Metric representing the ingress of records to a pipeline component. |
| `recordsOut` | Counter | Metric representing the egress of records from a pipeline component. |
| `timeElapsed` | Timer | Metric representing the time elapsed during execution of a pipeline component. |

The Grok processor includes the following custom metrics.

### Counter

* `grokProcessingMismatch`: Records the number of records that did not match any of the patterns specified in the match field.
* `grokProcessingMatch`: Records the number of records that matched at least one pattern from the `match` field.
* `grokProcessingErrors`: Records the total number of record processing errors.
* `grokProcessingTimeouts`: Records the total number of records that timed out while matching.

### Timer

* `grokProcessingTime`: The time taken by individual records to match against `match` patterns. The `avg` metric is the most useful metric for this timer because because it provides the average time taken to match records.
