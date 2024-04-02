---
layout: default
title: split-event
parent: Processors
grand_parent: Pipelines
nav_order: 96
---

# split-event

The `split-event` processor is used to split events based on a delimiter and generates multiple events from a user-specified field.

## Configuration

The following table describes the configuration options for the `split-event` processor.

| Option           | Type    | Description                                                                                   |
|------------------|---------|-----------------------------------------------------------------------------------------------|
| `field`          | String  | The event field to be split.                                                           |
| `delimiter_regex`| String  | The regular expression used as the delimiter for splitting the field.                         |
| `delimiter`      | String  | The delimiter used for splitting the field. If not specified, the default delimiter is used.  |

# Usage

To use the `split-event` processor, add the following to your `pipelines.yaml` file:

```
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

```
{"query" : "open source", "some_other_field" : "abc" }
```

The input will be split into multiple events based on the `query` field, with the delimiter set as white space, as shown in the following example:

```
{"query" : "open", "some_other_field" : "abc" }
{"query" : "source", "some_other_field" : "abc" }
```

