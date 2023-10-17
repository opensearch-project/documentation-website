---
layout: default
title: parse_json 
parent: Processors
grand_parent: Pipelines
nav_order: 80
---

# parse_json

The `parse_json` processor parses JSON data for an event, including any nested fields. The processor extracts the JSON pointer data and adds the input event to the extracted fields.


## Configuration

You can configure the `parse_json` processor with the following options.

| Option | Required | Type | Description |
| :--- | :--- | :--- | :--- | 
| `source` | No | String | The field in the `event` that will be parsed. Default value is `message`. |
| `destination` | No | String | The destination field of the parsed JSON. Defaults to the root of the `event`. Cannot be `""`, `/`, or any whitespace-only `string` because these are not valid `event` fields. |
| `pointer` | No | String | A JSON pointer to the field to be parsed. There is no `pointer` by default, meaning the entire `source` is parsed. The `pointer` can access JSON array indexes as well. If the JSON pointer is invalid then the entire `source` data is parsed into the outgoing `event`. If the key that is pointed to already exists in the `event` and the `destination` is the root, then the pointer uses the entire path of the key. |

## Usage

To get started, create the following `pipeline.yaml` file:

```yaml
parse-json-pipeline:
  source:
    ...
  ....  
  processor:
    - parse_json:
```

### Basic example

To test the `parse_json` processor with the previous configuration, run the pipeline and paste the following line into your console, then enter `exit` on a new line:

```
{"outer_key": {"inner_key": "inner_value"}}
```
{% include copy.html %}

The `parse_json` processor parses the message into the following format:

```
{"message": {"outer_key": {"inner_key": "inner_value"}}", "outer_key":{"inner_key":"inner_value"}}}
```

### Example with a JSON pointer

You can use a JSON pointer to parse a selection of the JSON data by specifying the `pointer` option in the configuration. To get started, create the following `pipeline.yaml` file:

```yaml
parse-json-pipeline:
  source:
    ...
  ....  
  processor:
    - parse_json:
        pointer: "outer_key/inner_key"
```

To test the `parse_json` processor with the pointer option, run the pipeline, paste the following line into your console, and then enter `exit` on a new line:

```
{"outer_key": {"inner_key": "inner_value"}}
```
{% include copy.html %}

The processor parses the message into the following format:

```
{"message": {"outer_key": {"inner_key": "inner_value"}}", "inner_key": "inner_value"}
```