---
layout: default
title: list_to_map 
parent: Processors
grand_parent: Pipelines
nav_order: 58
---

# list_to_map

The `list_to_map` processor converts a list of objects from an event, where each object contains a `key` field, into a map of target keys.

## Configuration

The following table describes the configuration options used to generate target keys for the mappings.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`key` | Yes | String | The key of the fields to be extracted as keys in the generated mappings.
`source` | Yes | String | The list of objects with `key` fields to be converted into keys for the generated map.
`target` | No | String | The target for the generated map. When not specified, the generated map will be placed in the root node.
`value_key` | No | String | When specified, values given a `value_key` in objects contained in the source list will be extracted and converted into the value specified by this option based on the generated map. When not specified, objects contained in the source list retain their original value when mapped.
`flatten` | No | Boolean | When `true`, values in the generated map output flatten into single items based on the `flattened_element`. Otherwise, objects mapped to values from the generated map appear as lists.
`flattened_element` | Conditionally | String | The element to keep, either `first` or `last`, when `flatten` is set to `true`.

## Usage

The following example shows how to test the usage of the `list_to_map` processor before using the processor on your own source. 

Create a source file named `logs_json.log`. Because the `file` source reads each line in the `.log` file as an event, the object list appears as one line even though it contains multiple objects:

```json
{"mylist":[{"name":"a","value":"val-a"},{"name":"b","value":"val-b1"},{"name":"b",  "value":"val-b2"},{"name":"c","value":"val-c"}]}
```
{% include copy.html %}

Next, create a `pipeline.yaml` file that uses the `logs_json.log` file as the `source` by pointing to the `.log` file's correct path:  

```yaml
pipeline:
  source:
    file:
      path: "/full/path/to/logs_json.log"
      record_type: "event"
      format: "json"
  processor:
    - list_to_map:
        key: "name"
        source: "mylist"
        value_key: "value"
        flatten: true
  sink:
    - stdout:
```
{% include copy.html %}

Run the pipeline. If successful, the processor returns the generated map with objects mapped according to their `value_key`. Similar to the original source, which contains one line and therefore one event, the processor returns the following JSON as one line. For readability, the following example and all subsequent JSON examples have been adjusted to span multiple lines:

```json
{
  "mylist": [
    {
      "name": "a",
      "value": "val-a"
    },
    {
      "name": "b",
      "value": "val-b1"
    },
    {
      "name": "b",
      "value": "val-b2"
    },
    {
      "name": "c",
      "value": "val-c"
    }
  ],
  "a": "val-a",
  "b": "val-b1",
  "c": "val-c"
}
```

### Example: Maps set to `target`

The following example `pipeline.yaml` file shows the `list_to_map` processor when set to a specified target, `mymap`:

```yaml
pipeline:
  source:
    file:
      path: "/full/path/to/logs_json.log"
      record_type: "event"
      format: "json"
  processor:
    - list_to_map:
        key: "name"
        source: "mylist"
        target: "mymap"
        value_key: "value"
        flatten: true
  sink:
    - stdout:
```
{% include copy.html %}

The generated map appears under the target key:

```json
{
  "mylist": [
    {
      "name": "a",
      "value": "val-a"
    },
    {
      "name": "b",
      "value": "val-b1"
    },
    {
      "name": "b",
      "value": "val-b2"
    },
    {
      "name": "c",
      "value": "val-c"
    }
  ],
  "mymap": {
    "a": "val-a",
    "b": "val-b1",
    "c": "val-c"
  }
}
```

### Example: No `value_key` specified

The follow example `pipeline.yaml` file shows the `list_to_map` processor with no `value_key` specified. Because `key` is set to `name`, the processor extracts the object names to use as keys in the map. 

```yaml
pipeline:
  source:
    file:
      path: "/full/path/to/logs_json.log"
      record_type: "event"
      format: "json"
  processor:
    - list_to_map:
        key: "name"
        source: "mylist"
        flatten: true
  sink:
    - stdout:
```
{% include copy.html %}

The values from the generated map appear as original objects from the `.log` source, as shown in the following example response:

```json
{
  "mylist": [
    {
      "name": "a",
      "value": "val-a"
    },
    {
      "name": "b",
      "value": "val-b1"
    },
    {
      "name": "b",
      "value": "val-b2"
    },
    {
      "name": "c",
      "value": "val-c"
    }
  ],
  "a": {
    "name": "a",
    "value": "val-a"
  },
  "b": {
    "name": "b",
    "value": "val-b1"
  },
  "c": {
    "name": "c",
    "value": "val-c"
  }
}
```

### Example: `flattened_element` set to `last`

The following example `pipeline.yaml` file sets the `flattened_element` to last, therefore flattening the processor output based on each value's last element: 

```yaml
pipeline:
  source:
    file:
      path: "/full/path/to/logs_json.log"
      record_type: "event"
      format: "json"
  processor:
    - list_to_map:
        key: "name"
        source: "mylist"
        target: "mymap"
        value_key: "value"
        flatten: true
        flattened_element: "last"
  sink:
    - stdout:
```
{% include copy.html %}

The processor maps object `b` to value `val-b2` because `val-b2` is the last element in object `b`, as shown in the following output:

```json
{
  "mylist": [
    {
      "name": "a",
      "value": "val-a"
    },
    {
      "name": "b",
      "value": "val-b1"
    },
    {
      "name": "b",
      "value": "val-b2"
    },
    {
      "name": "c",
      "value": "val-c"
    }
  ],
  "a": "val-a",
  "b": "val-b2",
  "c": "val-c"
}
```


### Example: `flatten` set to false

The following example `pipeline.yaml` file sets `flatten` to `false`, causing the processor to output values from the generated map as a list: 

```yaml
pipeline:
  source:
    file:
      path: "/full/path/to/logs_json.log"
      record_type: "event"
      format: "json"
  processor:
    - list_to_map:
        key: "name"
        source: "mylist"
        target: "mymap"
        value_key: "value"
        flatten: false
  sink:
    - stdout:
```
{% include copy.html %}

Some objects in the response may have more than one element in their values, as shown in the following response:

```json
{
  "mylist": [
    {
      "name": "a",
      "value": "val-a"
    },
    {
      "name": "b",
      "value": "val-b1"
    },
    {
      "name": "b",
      "value": "val-b2"
    },
    {
      "name": "c",
      "value": "val-c"
    }
  ],
  "a": [
    "val-a"
  ],
  "b": [
    "val-b1",
    "val-b2"
  ],
  "c": [
    "val-c"
  ]
}
```