---
layout: default
title: select_entries
parent: Processors
grand_parent: Pipelines
nav_order: 59
---

# select_entries

The `select_entries` processor selects entries from an event.

### Configuration

You can configure the `select_entries` processor with the following options.

| Option | Required | Description |
| :--- | :--- | :--- |
| `include_keys` | Yes | A list of keys to be selected from an event. |
| `select_when` | No | A [conditional expression](https://opensearch.org/docs/latest/data-prepper/pipelines/expression-syntax/), such as `/some-key == "test"'`, that will be evaluated to determine whether the processor will be run on the event. |

### Usage

To get started, create the following `pipeline.yaml` file:

```yaml
pipeline:
  source:
    ...
  ....  
  processor:
    - select_entries:
        entries:
        - include_keys: [ "key1", "key2" ]
          add_when: '/some_key == "test"'
  sink:
```
{% include copy.html %}


For example, when your source contains the following event record:

```json
{"message": "hello", "key1" : "value1", "key2" : "value2", "some_key" : "test"}
```

And then you run the `select_entries` processor using the example pipeline, only "key1" and "key2" are selected from the event

```json
{"key1": "value1", "key2": "value2"}
```
