---
layout: default
title: map_to_list
parent: Processors
grand_parent: Pipelines
nav_order: 63
---

# map_to_list

The `map_to_list` processor converts a map of key-value pairs to a list of objects, each contains the key and value in separate fields.

## Configuration

The following table describes the available configuration options.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`source` | Yes | String | the source map to perform the operation; If set to empty string (`""`), it will use the root of the event as source.
`target` | Yes | String | The target for the generated list. 
`key_name` | No | String | The name of the field to hold the original key. Default is "key".
`value_name` | No | String |  The name of the field to hold the original value. Default is "value".
`exclude_keys` | No | List | The keys in source map that will be excluded from processing. Default is an empty list (`[]`).
`remove_processed_fields` | No | Boolean | If `true`, the processor will remove processed fields from source map. Default is `false`.
`convert_field_to_list` | No | Boolean | If `true`, the processor will convert the fields from source map to lists and put them in the target list. Default is `false`.
`map_to_list_when` | No | String | A [conditional expression](https://opensearch.org/docs/latest/data-prepper/pipelines/expression-syntax/), such as `/some-key == "test"'`, that will be evaluated to determine whether the processor will be run on the event. Default is null and all events will be processed.
`tags_on_failure` | No | List | A list of tags to add to the event metadata when the event fails to process.

## Usage

Here we show a few examples for using the `map_to_list` processor.

### Example: minimum configuration

The following example shows only required parameters `source` and `target` configured. 

```yaml
...
  processor:
    - map_to_list:
        source: "my-map"
        target: "my-list"
...
```

If the input event contains the following data:
```json
{
  "my-map": {
    "key1": "value1",
    "key2": "value2",
    "key3": "value3"
  }
}
```
the processed event will have the following data:
```json
{
  "my-list": [
    {
      "key": "key1",
      "value": "value1"
    },
    {
      "key": "key2",
      "value": "value2"
    },
    {
      "key": "key3",
      "value": "value3"
    }
  ],
  "my-map": {
    "key1": "value1",
    "key2": "value2",
    "key3": "value3"
  }
}
```

### Example: custom key name and value name

The following example shows how custom key name and value name can be configured. 

```yaml
...
  processor:
    - map_to_list:
        source: "my-map"
        target: "my-list"
        key_name: "name"
        value_name: "data"
...
```

If the input event contains the following data:
```json
{
  "my-map": {
    "key1": "value1",
    "key2": "value2",
    "key3": "value3"
  }
}
```
the processed event will have the following data:
```json
{
  "my-list": [
    {
      "name": "key1",
      "data": "value1"
    },
    {
      "name": "key2",
      "data": "value2"
    },
    {
      "name": "key3",
      "data": "value3"
    }
  ],
  "my-map": {
    "key1": "value1",
    "key2": "value2",
    "key3": "value3"
  }
}
```

### Example: exclude specific keys from processing and remove processed fields

The following example shows how to exclude specific keys and remove processed fields. 

```yaml
...
  processor:
    - map_to_list:
        source: "my-map"
        target: "my-list"
        exclude_keys: ["key1"]
        remove_processed_fields: true
...
```

If the input event contains the following data:
```json
{
  "my-map": {
    "key1": "value1",
    "key2": "value2",
    "key3": "value3"
  }
}
```
the processed event will process fields "key2" and "key3" and remove them from "my-map". "key1" remains in "my-map" unchanged:
```json
{
  "my-list": [
    {
      "key": "key2",
      "value": "value2"
    },
    {
      "key": "key3",
      "value": "value3"
    }
  ],
  "my-map": {
    "key1": "value1"
  }
}
```

### Example: use convert_field_to_list

The following example shows how `convert_field_to_list` option works.

```yaml
...
  processor:
    - map_to_list:
        source: "my-map"
        target: "my-list"
        convert_field_to_list: true
...
```

If the input event contains the following data:
```json
{
  "my-map": {
    "key1": "value1",
    "key2": "value2",
    "key3": "value3"
  }
}
```
the processed event will have the following data, with fields converted to lists:
```json
{
  "my-list": [
    ["key1", "value1"],
    ["key2", "value2"],
    ["key3", "value3"]
  ],
  "my-map": {
    "key1": "value1",
    "key2": "value2",
    "key3": "value3"
  }
}
```

### Example: use event root as source

The following example shows that we can use event root as source by setting source to empty string (`""`). 

```yaml
...
  processor:
    - map_to_list:
        source: ""
        target: "my-list"
...
```

If the input event contains the following data:
```json
{
  "key1": "value1",
  "key2": "value2",
  "key3": "value3"
}
```
the processed event will have the following data:
```json
{
  "my-list": [
    {
      "key": "key1",
      "value": "value1"
    },
    {
      "key": "key2",
      "value": "value2"
    },
    {
      "key": "key3",
      "value": "value3"
    }
  ],
  "key1": "value1",
  "key2": "value2",
  "key3": "value3"
}
```
