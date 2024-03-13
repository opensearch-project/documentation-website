---
layout: default
title: map_to_list 
parent: Processors
grand_parent: Pipelines
nav_order: 58
---

# map_to_list

The `map_to_list` processor converts a map of key-value pairs to a list of objects, each contains the key and value in separate fields.

## Configuration

The following table describes the configuration options used to generate target keys for the mappings.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`source` | Yes | String | The source map to perform the operation; If set to empty string (""), it will use the event root as source.
`target` | Yes | List | The target list to put the converted list
`key_name` | No | String | The key name of the field to hold the original key, default is "key"                                             
`value_name` | No | String | The key name of the field to hold the original value, default is "value"
`exclude_keys` | No | List | The keys in source map that will be excluded from processing, default is empty list
`remove_processed_fields` | No | Boolean | Default is false; if true, will remove processed fields from source map
`map_to_list_when` | No | String | Used to configure a condition for event processing based on certain property of the incoming event. Default is null (all events will be processed).
`convert_field_to_list`| No | Boolean | Default to false; if true, will convert fields to lists instead of objects
`tags_on_failure` | No | List | A list of tags to add to event metadata when the event fails to process 

## Usage

The following examples shows how to test the usage of the `map_to_list` processor before using the processor on your own source. 

For example, if the input event has the following data:
```json
{
  "my-map": {
    "key1": "value1",
    "key2": "value2",
    "key3": "value3"
  }
}
```
with `map_to_list` processor configured to:
```yaml
...
processor:
  - map_to_list:
      source: "my-map"
      target: "my-list"
...
```
The processed event will have the following data:
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

If we enable `convert_field_to_list` option:
```yaml
...
processor:
  - map_to_list:
      source: "my-map"
      target: "my-list"
      convert_field_to_list: true
...
```
the processed event will have the following data:
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

If source is set to empty string (""), it will use the event root as source.
```yaml
...
processor:
  - map_to_list:
      source: ""
      target: "my-list"
      convert_field_to_list: true
...
```
Input data like this:
```json
{
  "key1": "value1",
  "key2": "value2",
  "key3": "value3"
}
```
will end up with this after processing:
```json
{
  "my-list": [
    ["key1", "value1"],
    ["key2", "value2"],
    ["key3", "value3"]
  ],
  "key1": "value1",
  "key2": "value2",
  "key3": "value3"
}
```
