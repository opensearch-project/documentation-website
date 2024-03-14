---
layout: default
title: flatten 
parent: Processors
grand_parent: Pipelines
nav_order: 54
---

# flatten

The `flatten` processor transforms nested objects in events into flattened structures. 

## Configuration

The following table describes the available configuration options.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`source` | Yes | String | The source key to perform the operation on; If set to empty string (`""`), it will use the root of the event as source.
`target` | Yes | String | The target key to put the flattened fields. If set to empty string (`""`), it will use the root of the event as target.
`exclude_keys` | No | List | The keys in source field that will be excluded from processing. Default is an empty list (`[]`).
`remove_processed_fields` | No | Boolean | If `true`, the processor will remove processed fields from the source. Default is `false`.
`remove_list_indices` | No | Boolean | If `true`, the processor will convert the fields from source map to lists and put them in the target field. Default is `false`.
`flatten_when` | No | String | A [conditional expression](https://opensearch.org/docs/latest/data-prepper/pipelines/expression-syntax/), such as `/some-key == "test"'`, that will be evaluated to determine whether the processor will be run on the event. Default is null and all events will be processed.
`tags_on_failure` | No | List | A list of tags to add to the event metadata when the event fails to process.

## Usage

Here we show a few examples for using the `flatten` processor.

### Example: minimum configuration

The following example shows only required parameters `source` and `target` configured. 

```yaml
...
  processor:
    - flatten:
        source: "key2"   
        target: "flattened-key2"  
...
```

If the input event contains the following data:
```json
{
  "key1": "val1",
  "key2": {
    "key3": {
      "key4": "val2"
    }
  }
}
```
the processed event will have the following data:
```json
{
  "key1": "val1",
  "key2": {
    "key3": {
      "key4": "val2"
    }
  },
  "flattened-key2": {
    "key3.key4": "val2"
  }
}
```

### Example: remove processed fields

The option `remove_processed_fields` can be useful when flattening the entire event. The following example shows how to flattening the entire event and remove processed fields.

```yaml
...
  processor:
    - flatten:
        source: ""   # empty string represents root of event
        target: ""   # empty string represents root of event
        remove_processed_fields: true
...
```

If the input event contains the following data:
```json
{
  "key1": "val1",
  "key2": {
    "key3": {
      "key4": "val2"
    }
  },
  "list1": [
    {
      "list2": [
        {
          "name": "name1",
          "value": "value1"
        },
        {
          "name": "name2",
          "value": "value2"
        }
      ]
    }
  ]
}
```
the processed event will have the following data:
```json
{
  "key1": "val1",
  "key2.key3.key4": "val2",
  "list1[0].list2[0].name": "name1",
  "list1[0].list2[0].value": "value1",
  "list1[0].list2[1].name": "name2",
  "list1[0].list2[1].value": "value2",
}
```

### Example: exclude specific keys from flattening

The following example shows how to exclude specific keys from flattening using `exclude_keys`.

```yaml
...
  processor:
    - flatten:
        source: ""   # empty string represents root of event
        target: ""   # empty string represents root of event
        remove_processed_fields: true
        exclude_keys: ["key2"]
...
```

If the input event contains the following data:
```json
{
  "key1": "val1",
  "key2": {
    "key3": {
      "key4": "val2"
    }
  },
  "list1": [
    {
      "list2": [
        {
          "name": "name1",
          "value": "value1"
        },
        {
          "name": "name2",
          "value": "value2"
        }
      ]
    }
  ]
}
```
the processed event will have the following data, "key2" field will not be flattened:
```json
{
  "key1": "val1",
  "key2": {
    "key3": {
      "key4": "val2"
    }
  },
  "list1[0].list2[0].name": "name1",
  "list1[0].list2[0].value": "value1",
  "list1[0].list2[1].name": "name2",
  "list1[0].list2[1].value": "value2",
}
```

### Example: remove list indices

The following example shows how to use `remove_list_indices` option.

```yaml
...
  processor:
    - flatten:
        source: ""   # empty string represents root of event
        target: ""   # empty string represents root of event
        remove_processed_fields: true
        remove_list_indices: true
...
```

If the input event contains the following data:
```json
{
  "key1": "val1",
  "key2": {
    "key3": {
      "key4": "val2"
    }
  },
  "list1": [
    {
      "list2": [
        {
          "name": "name1",
          "value": "value1"
        },
        {
          "name": "name2",
          "value": "value2"
        }
      ]
    }
  ]
}
```
the processed event will have the following data. List indices will be removed and values under that same flattened key will be put in a list.
```json
{
  "key1": "val1",
  "key2.key3.key4": "val2",
  "list1[].list2[].name": ["name1","name2"],
  "list1[].list2[].value": ["value1","value2"]
}
```
