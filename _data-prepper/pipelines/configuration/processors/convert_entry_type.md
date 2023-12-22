---
layout: default
title: convert_entry_type
parent: Processors
grand_parent: Pipelines
nav_order: 47
---

# convert_entry_type

The `convert_entry_type` processor converts a value type associated with the specified key in a event to the specified type. It is a casting processor that changes the types of some fields in events. Some data must be converted to a different type, such as an integer to a double, or a string to an integer, so that it will pass the events through condition-based processors or perform conditional routing. 

## Configuration

You can configure the `convert_entry_type` processor with the following options.

| Option | Required | Description |
| :--- | :--- | :--- |
| `key`| Yes | Keys whose value needs to be converted to a different type. |
| `type` | No | Target type for the key-value pair. Possible values are `integer`, `double`, `string`, and `Boolean`. Default value is `integer`. |

## Usage

To get started, create the following `pipeline.yaml` file:

```yaml
type-conv-pipeline:
  source:
    ...
  ....  
  processor:
    - convert_entry_type:
        key: "response_status"
        type: "integer"
```
{% include copy.html %}

Next, create a log file named `logs_json.log` and replace the `path` in the file source of your `pipeline.yaml` file with that filepath. For more information, see [Configuring Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/getting-started/#2-configuring-data-prepper). 

For example, before you run the `convert_entry_type` processor, if the `logs_json.log` file contains the following event record:


```json
{"message": "value", "response_status":"200"}
```

The `convert_entry_type` processor converts the output received to the following output, where the type of `response_status` value changes from a string to an integer:

```json
{"message":"value","response_status":200}
```
