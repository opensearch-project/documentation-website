---
layout: default
title: Parse JSON
parent: Processors
grand_parent: Pipelines
nav_order: 45
---

# Parse JSON processor

The `Parse JSON` processor takes in an event and parses its JSON data, including any nested fields.

## Basic usage

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

Option | Optional | Default value | Description
:--- | :--- | :--- | :---

 `source` | Yes | `message` | The field in the `Event` that is parsed.
 `destination` | Yes |  | * The destination field of the parsed JSON. The processor writes to root when the `destination` has a value of `null`. Cannot be `""`, `/`, or any whitespace-only `String` because these options are not valid `Event` fields.
`pointer` | Yes | A JSON pointer that points to the field that must be parsed. No `pointer` exists by default and the entire `source` is parsed. The `pointer` can access JSON array indexes. If the JSON `pointer` is invalid, all `source` data is parsed into the outgoing `event`. If the key that is pointed to exists in `Event`, and the `destination` is the root, then the full path of the key is used. | 