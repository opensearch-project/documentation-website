---
layout: default
title: map_to_list
parent: Processors
grand_parent: Pipelines
nav_order: 63
canonical_url: https://docs.opensearch.org/docs/latest/data-prepper/pipelines/configuration/processors/map-to-list/
---

# map_to_list

The `map_to_list` processor converts a map of key-value pairs to a list of objects. Each object contains the key and value in separate fields.

## Configuration

The following table describes the configuration options for the `map_to_list` processor.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`source` | Yes | String | The source map used to perform the mapping operation. When set to an empty string (`""`), it will use the root of the event as the `source`.
`target` | Yes | String | The target for the generated list. 
`key_name` | No | String | The name of the field in which to store the original key. Default is `key`.
`value_name` | No | String |  The name of the field in which to store the original value. Default is `value`.
`exclude_keys` | No | List | The keys in the source map that will be excluded from processing. Default is an empty list (`[]`).
`remove_processed_fields` | No | Boolean | When `true`, the processor will remove the processed fields from the source map. Default is `false`.
`convert_field_to_list` | No | Boolean | If `true`, the processor will convert the fields from the source map into lists and place them in fields in the target list. Default is `false`.
`map_to_list_when` | No | String | A [conditional expression]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/expression-syntax/), such as `/some-key == "test"'`, that will be evaluated to determine whether the processor will be run on the event. Default is `null`. All events will be processed unless otherwise stated.
`tags_on_failure` | No | List | A list of tags to add to the event metadata when the event fails to process.

## Usage

The following examples show how the `map_to_list` processor can be used in your pipeline.

### Example: Minimum configuration

The following example shows the `map_to_list` processor with only the required parameters, `source` and `target`, configured: 

```yaml
...
  processor:
    - map_to_list:
        source: "my-map"
        target: "my-list"
...
```
{% include copy.html %}

When the input event contains the following data:

```json
{
  "my-map": {
    "key1": "value1",
    "key2": "value2",
    "key3": "value3"
  }
}
```


The processed event will contain the following output:

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

### Example: Custom key name and value name

The following example shows how to configure a custom key name and value name:

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
{% include copy.html %}

When the input event contains the following data:

```json
{
  "my-map": {
    "key1": "value1",
    "key2": "value2",
    "key3": "value3"
  }
}
```

The processed event will contain the following output:

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

### Example: Exclude specific keys from processing and remove any processed fields

The following example shows how to exclude specific keys and remove any processed fields from the output:

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
{% include copy.html %}

When the input event contains the following data:
```json
{
  "my-map": {
    "key1": "value1",
    "key2": "value2",
    "key3": "value3"
  }
}
```

The processed event will remove the "key2" and "key3" fields, but the "my-map" object, "key1", will remain, as shown in the following output:

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

### Example: Use convert_field_to_list

The following example shows how to use the `convert_field_to_list` option in the processor:

```yaml
...
  processor:
    - map_to_list:
        source: "my-map"
        target: "my-list"
        convert_field_to_list: true
...
```
{% include copy.html %}

When the input event contains the following data:

```json
{
  "my-map": {
    "key1": "value1",
    "key2": "value2",
    "key3": "value3"
  }
}
```

The processed event will convert all fields into lists, as shown in the following output:

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

### Example: Use the event root as the source

The following example shows how you can use an event's root as the source by setting the `source` setting to an empty string (`""`):

```yaml
...
  processor:
    - map_to_list:
        source: ""
        target: "my-list"
...
```
{% include copy.html %}

When the input event contains the following data:

```json
{
  "key1": "value1",
  "key2": "value2",
  "key3": "value3"
}
```

The processed event will contain the following output:

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
