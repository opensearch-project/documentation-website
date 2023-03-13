---
layout: default
title: Parse JSON processor
parent: Processors
grand_parent: Pipelines
nav_order: 45
---

# Parse JSON processor

The `parse_json` processor parses JSON data for an event, including any nested fields. 

## Usage

To get started, create the following `pipelines.yaml` file:

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

You can test the JSON Processor with the above configuration by using the following example.

Run the pipeline and paste the following line into your console, then enter `exit` on a new line:

```
{"outer_key": {"inner_key": "inner_value"}}
```

The processor parses the message into the following format:

```
{"message": {"outer_key": {"inner_key": "inner_value"}}", "outer_key":{"inner_key":"inner_value"}}}
```

### Example with JSON pointer

You can parse a selection of the JSON data by specifying a JSON pointer and using the `pointer` option in the configuration. The following configuration file and example demonstrate a basic pointer use case:

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

Run the pipeline and paste the following line into your console, then enter `exit` on a new line.

```
{"outer_key": {"inner_key": "inner_value"}}
```

The processor parses the message into the following format:

```
{"message": {"outer_key": {"inner_key": "inner_value"}}", "inner_key": "inner_value"}
```

## Configuration

You can configure the `Parse JSON` processor with the following options.

Option | Required | Type | Description
:--- | :--- | :--- | :---
`source` | No | String | The field in the `Event` that will be parsed. Default value is `message`.
`destination` | No | String | The destination field of the parsed JSON. Defaults to the root of the `Event`. Cannot be `""`, `/`, or any whitespace-only `String` because these are not valid `Event` fields.
`pointer` | No | String | A JSON Pointer to the field to be parsed. There is no `pointer` by default, meaning the entire `source` is parsed. The `pointer` can access JSON Array indices as well. If the JSON Pointer is invalid then the entire `source` data is parsed into the outgoing `Event`. If the pointed-to key already exists in the `Event` and the `destination` is the root, then the pointer uses the entire path of the key.