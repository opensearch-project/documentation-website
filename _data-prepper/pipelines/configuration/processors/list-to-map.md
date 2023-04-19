---
layout: default
title: List to map processor
parent: Processors
grand_parent: Pipelines
nav_order: 55
---

# list_to_map

The `list-to-map` processor converts a list of objects from an event where each object contains a `key` field, into a map of target keys.

## Configuration

The following table describes the configuration options to generate target keys to object mappings:

Option | Required | Type | Description
:--- | :--- | :--- | :---
`key` | Yes | String | The key of the fields to be extracted as keys in the generated mappings
`source` | Yes | String | The list of objects with `key` fields that be converted to keys based on the generated mappings.
`target` | No | String | The target for the generated map. When not specified, the generated map will be placed in the root directory.
`value_key` | No | String | When specified, values given a `value_key` in objects contained in the source list will be extracted and converted into the value specified by this option based on the generated map. When not specified, objects contained in the source list retain their original value when mapped.
`flatten` | No | Boolean | When `true`, values in the generated map output flatten into single items based on the `flattened_element`. Otherwise, objects mapped to values from the generated map appear as lists.
`flattened_element` | Conditionally | String | The element to keep, either `first` or `last`, when `flatten` is set to `true`.

## Usage

To use the `list_to_map` processor, create a `.log` file to create a list of source objects with values. The following example creates a file named `logs_json.log`.  Because the `source` parameter reads each line in the `.log` file as an event, the object list appears as one line even though it contains three objects.

```json
{"mylist":[{"name":"a","value":"val-a"},{"name":"b","value":"val-b1"},{"name":"b","value":"val-b2"},{"name":"c","value":"val-c"}]}
```
{% include copy.html %}

Next, create a `pipeline.yaml` that uses `logs_json.log` as `source` by pointing to the log files correct path.  

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

Run the pipeline. If successful, the processor returns the generated map based with objects mapped according to the `value_key`. For readability, the following example has been adjusted to multiple lines.

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

The following example `pipeline.yaml` shows the `list_to_map` processor when set to a specified target, `mymap`.

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

The generated map appears under the target key.

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

The follow example `pipeline.yaml` shows the `list_to_map` processor with no `value_key` specified. Since `key` is set to the objects `name`, the processor extracts the names of each object to use as keys in the map. 

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

The values from the generated map appear as original objects from the `.log` source as shown in the following example response:

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

The following example `pipeline.yaml` sets the `flattened_element` to last, therefore flattening the processor output based on each values last element. 

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

The processor maps object `b` to value `val-b2`, since `val-b2` is the last element in object `b`, as shown in the following output:

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

The following example `pipeline.yaml` sets `flatten` to `false`, causing the processor to out values from the generated map as a list. 

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