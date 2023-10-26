---
layout: default
title: grok
parent: Processors
grand_parent: Pipelines
nav_order: 54
---

# grok


The `Grok` processor takes unstructured data and utilizes pattern matching to structure and extract important keys. 

## Configuration

The following table describes options you can use with the `Grok` processor to structure your data and make your data easier to query.

Option | Required | Type | Description
:--- | :--- | :--- | :---
match | No | Map | Specifies which keys to match specific patterns against. Default value is an empty body.
keep_empty_captures | No | Boolean | Enables preserving `null` captures. Default value is `false`.
named_captures_only | No | Boolean | Specifies whether to keep only named captures. Default value is `true`.
break_on_match | No | Boolean | Specifies whether to match all patterns or stop once the first successful match is found. Default value is `true`.
keys_to_overwrite | No | List | Specifies which existing keys will be overwritten if there is a capture with the same key value. Default value is `[]`.
pattern_definitions | No | Map | Allows for custom pattern use inline. Default value is an empty body.
patterns_directories | No | List | Specifies the path of directories that contain customer pattern files. Default value is an empty list.
pattern_files_glob | No | String | Specifies which pattern files to use from the directories specified for `pattern_directories`. Default value is `*`.
target_key | No | String | Specifies a parent-level key used to store all captures. Default value is `null`.
timeout_millis | No | Integer | The maximum amount of time during which matching occurs. Setting to `0` disables the timeout. Default value is `30,000`.

<!---## Configuration

Content will be added to this section.--->

## Metrics

The following table describes common [Abstract processor](https://github.com/opensearch-project/data-prepper/blob/main/data-prepper-api/src/main/java/org/opensearch/dataprepper/model/processor/AbstractProcessor.java) metrics.

| Metric name | Type | Description |
| ------------- | ---- | -----------|
| `recordsIn` | Counter | Metric representing the ingress of records to a pipeline component. |
| `recordsOut` | Counter | Metric representing the egress of records from a pipeline component. |
| `timeElapsed` | Timer | Metric representing the time elapsed during execution of a pipeline component. |

The `Grok` processor includes the following custom metrics.

### Counter

* `grokProcessingMismatch`: Records the number of records that did not match any of the patterns specified in the match field.
* `grokProcessingMatch`: Records the number of records that matched at least one pattern from the `match` field.
* `grokProcessingErrors`: Records the total number of record processing errors.
* `grokProcessingTimeouts`: Records the total number of records that timed out while matching.

### Timer

* `grokProcessingTime`: The time taken by individual records to match against patterns from `match`. The `avg` metric is the most useful metric for this timer because it provides you with an average value of the time it takes records to match. 