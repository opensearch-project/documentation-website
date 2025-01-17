---
layout: default
title: flatten 
parent: Processors
grand_parent: Pipelines
nav_order: 48
---

# flatten

The `flatten` processor transforms nested objects inside of events into flattened structures. 

## Configuration

The following table describes configuration options for the `flatten` processor.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`source` | Yes | String | The source key on which to perform the operation. If set to an empty string (`""`), then the processor uses the root of the event as the source.
`target` | Yes | String | The target key to put into the flattened fields. If set to an empty string (`""`), then the processor uses the root of the event as the target.
`exclude_keys` | No | List | The keys from the source field that should be excluded from processing. Default is an empty list (`[]`).
`remove_processed_fields` | No | Boolean | When `true`, the processor removes all processed fields from the source. Default is `false`.
`remove_list_indices` | No | Boolean | When `true`, the processor converts the fields from the source map into lists and puts the lists into the target field. Default is `false`.
`flatten_when` | No | String | A [conditional expression]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/expression-syntax/), such as `/some-key == "test"'`, that determines whether the `flatten` processor will be run on the event. Default is `null`, which means that all events will be processed unless otherwise stated.
`tags_on_failure` | No | List | A list of tags to add to the event metadata when the event fails to process.

## Usage

The following examples show how the `flatten` processor can be used in OpenSearch Data Prepper pipelines.

### Minimum configuration

The following example shows only the parameters that are required for using the `flatten` processor, `source` and `target`:

```yaml
...
  processor:
    - flatten:
        source: "key2"   
        target: "flattened-key2"  
...
```
{% include copy.html %}

For example, when the input event contains the following nested objects:

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

The `flatten` processor creates a flattened structure under the `flattened-key2` object, as shown in the following output:

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

### Remove processed fields

Use the `remove_processed_fields` option when flattening all of an event's nested objects. This removes all the event's processed fields, as shown in the following example:

```yaml
...
  processor:
    - flatten:
        source: ""   # empty string represents root of event
        target: ""   # empty string represents root of event
        remove_processed_fields: true
...
```

For example, when the input event contains the following nested objects:

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


The `flatten` processor creates a flattened structure in which all processed fields are absent, as shown in the following output:

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

### Exclude specific keys from flattening

Use the `exclude_keys` option to prevent specific keys from being flattened in the output, as shown in the following example, where the `key2` value is excluded:

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

For example, when the input event contains the following nested objects:

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

All other nested objects in the input event, excluding the `key2` key, will be flattened, as shown in the following example:

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

### Remove list indexes

Use the `remove_list_indices` option to convert the fields from the source map into lists and put the lists into the target field, as shown in the following example:

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

For example, when the input event contains the following nested objects:

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

The processor removes all indexes from the output and places them into the source map as a flattened, structured list, as shown in the following example:

```json
{
  "key1": "val1",
  "key2.key3.key4": "val2",
  "list1[].list2[].name": ["name1","name2"],
  "list1[].list2[].value": ["value1","value2"]
}
```
