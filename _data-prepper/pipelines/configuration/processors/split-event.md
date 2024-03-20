---
layout: default
title: split_event
parent: Processors
grand_parent: Pipelines
nav_order: 56
---

# SplitEventProcessor

The `split_event` processor is used to split events based on a delimiter and generates multiple events for a user specified field.

## Configuration

The following table describes the configuration options for the SplitEventProcessor.

| Option           | Type    | Description                                                                                   |
|------------------|---------|-----------------------------------------------------------------------------------------------|
| `field`          | String  | The field in the event to be split.                                                           |
| `delimiter_regex`| String  | The regular expression used as the delimiter for splitting the field.                         |
| `delimiter`      | String  | The delimiter used for splitting the field. If not specified, the default delimiter is used.  |

# Usage

Add the following examples to your pipelines.yaml file

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

For example, if the input is as follows:
```
{"query" : "open source", "some_other_field" : "abc" }
```

The input will be split into multiple events based on the field `query` with delimiter as whitespace as follows:
```
{"query" : "open", "some_other_field" : "abc" }
{"query" : "source", "some_other_field" : "abc" }
```

