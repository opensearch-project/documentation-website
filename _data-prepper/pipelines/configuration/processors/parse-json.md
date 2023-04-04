---
layout: default
title: Parse_JSON
parent: Processors
grand_parent: Pipelines
nav_order: 45
---

# Parse_JSON

The `Parse_JSON` processor parses JSON data for an event, including any nested fields. The processor extracts the JSON pointer data and adds the input event to the extracted fields.


## Configuration

You can configure the `Parse_JSON` processor with the following options.

| Option | Required | Type | Description |
| :--- | :--- | :--- | :--- | 
| `source` | No | String | The field in the `Event` that will be parsed. Default value is `message`. |
| `destination` | No | String | The destination field of the parsed JSON. Defaults to the root of the `Event`. Cannot be `""`, `/`, or any whitespace-only `String` because these are not valid `Event` fields. |
| `pointer` | No | String | A JSON pointer to the field to be parsed. There is no `pointer` by default, meaning the entire `source` is parsed. The `pointer` can access JSON array indexes as well. If the JSON pointer is invalid then the entire `source` data is parsed into the outgoing `Event`. If the key that is pointed to already exists in the `Event` and the `destination` is the root, then the pointer uses the entire path of the key. |

## Usage

To get started, create the following `pipeline.yaml` file:

```yaml
parse-json-pipeline:
  source:
    stdin:
  processor:
    - parse_json:
  sink:
    - stdout:
```

### Basic example

To test the `Parse JSON` processor with the previous configuration, run the pipeline and paste the following line into your console, then enter `exit` on a new line:

```
{"outer_key": {"inner_key": "inner_value"}}
```
{% include copy.html %}

The processor parses the message into the following format:

```
{"message": {"outer_key": {"inner_key": "inner_value"}}", "outer_key":{"inner_key":"inner_value"}}}
```

### Example with JSON pointer

Use a JSON pointer to parse a selection of the JSON data by specifying the `pointer` option in the configuration. To get started, create the following `pipeline.yaml` file:

```yaml
parse-json-pipeline:
  source:
    stdin:
  processor:
    - parse_json:
        pointer: "outer_key/inner_key"
  sink:
    - stdout:
```

To test the JSON processor with the pointer option, run the pipeline, paste the following line into your console, and then enter `exit` on a new line:

```
{"outer_key": {"inner_key": "inner_value"}}
```
{% include copy.html %}

The processor parses the message into the following format:

```
{"message": {"outer_key": {"inner_key": "inner_value"}}", "inner_key": "inner_value"}
```