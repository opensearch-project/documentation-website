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

* `source` (optional): The field in the `Event` that will be parsed.
    * Default: `message`

* `destination` (optional): The destination field of the parsed JSON. Defaults to the root of the `Event`.
    * Defaults to writing to the root of the `Event`. The processor writes to root when the `destination` has a value of `null`.
    * Cannot be `""`, `/`, or any whitespace-only `String` because these options are not valid `Event` fields.

* `pointer` (optional): A JSON pointer to the field to be parsed.
    * There is no `pointer` by default, and the entire `source` is parsed.
    * The `pointer` can access JSON array indexes.
    * If the JSON pointer is invalid, then the entire `source` data is parsed into the outgoing `Event`.
    * If the key that is pointed to exists in the `Event`, and the `destination` is the root, then the entire path of the key will be used.

## Developer guide

This plugin is compatible with Java 8 and up. See the following: 

<!--- Java 8, or Java 14? Other docs say 14.--->

- [Contributing](https://github.com/opensearch-project/data-prepper/blob/main/CONTRIBUTING.md)
- [Monitoring]({{site.url}}{{site.baseurl}}/data-prepper/monitoring/) <!--- Is this correct?---> 