---
layout: default
title: add_entries
parent: Processors
grand_parent: Pipelines
nav_order: 40
---

# add_entries

The `add_entries` processor adds entries to an event.

### Configuration

You can configure the `add_entries` processor with the following options.

| Option | Required | Description |
| :--- | :--- | :--- |
| `entries` | Yes | A list of entries to add to an event. |
| `key` | Yes | The key of the new entry to be added. Some examples of keys include `my_key`, `myKey`, and `object/sub_Key`. |
| `value` | Yes | The value of the new entry to be added. You can use the following data types: strings, Booleans, numbers, null, nested objects, and arrays. |
| `overwrite_if_key_exists` | No | When set to `true`, the existing value is overwritten if `key` already exists in the event. The default value is `false`. |

### Usage

To get started, create the following `pipeline.yaml` file:

```yaml
pipeline:
  source:
    ...
  ....  
  processor:
    - add_entries:
        entries:
        - key: "newMessage"
          value: 3
          overwrite_if_key_exists: true
  sink:
```
{% include copy.html %}


For example, when your source contains the following event record:

```json
{"message": "hello"}
```

And then you run the `add_entries` processor using the example pipeline, it adds a new entry, `{"newMessage": 3}`, to the existing event, `{"message": "hello"}`, so that the new event contains two entries in the final output:

```json
{"message": "hello", "newMessage": 3}
```

> If `newMessage` already exists, its existing value is overwritten with a value of `3`.

