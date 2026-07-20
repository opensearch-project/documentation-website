---
layout: default
title: Split event
parent: Processors
grand_parent: Pipelines
nav_order: 340
---

# Split event processor

The `split_event` processor is used to split events based on a delimiter and generates multiple events from a user-specified field.

## Configuration

The following table describes the configuration options for the `split_event` processor.

| Option           | Type    | Description                                                                                   |
|------------------|---------|-----------------------------------------------------------------------------------------------|
| `field`          | String  | The event field to be split.                                                           |
| `delimiter_regex`| String  | The regular expression used as the delimiter for splitting the field.                         |
| `delimiter`      | String  | The delimiter used for splitting the field. If not specified, the default delimiter is used.  |
| `split_when`     | String  | A [conditional expression]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/expression-syntax/) that determines whether the processor will be run on the event. If the condition evaluates to `false`, the event passes through unchanged. Default is `null` (all events are processed). |

# Usage

To use the `split_event` processor, add the following to your `pipelines.yaml` file:

```yaml
split-event-pipeline:
  source:
    http:
  processor:
    - split_event:
        field: query
        delimiter: ' '    
  sink:
    - stdout:
```
{% include copy.html %}

When an event contains the following example input:

```json
{"query" : "open source", "some_other_field" : "abc" }
```

The input will be split into multiple events based on the `query` field, with the delimiter set as white space, as shown in the following example:

```json
{"query" : "open", "some_other_field" : "abc" }
{"query" : "source", "some_other_field" : "abc" }
```

## Conditional splitting with split_when

You can use `split_when` to conditionally apply the split based on event content. This is useful in multi-tenant pipelines where only certain events should be split.

```yaml
split-event-pipeline:
  source:
    http:
  processor:
    - split_event:
        field: body
        delimiter: "\n"
        split_when: 'contains(/body, "\n")'
  sink:
    - stdout:
```
{% include copy.html %}

In this example, the `split_event` processor only splits events where the `body` field contains a newline character. Events without newlines pass through unchanged.

