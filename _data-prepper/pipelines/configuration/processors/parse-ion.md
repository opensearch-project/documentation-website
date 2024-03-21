---
layout: default
title: parse_ion 
parent: Processors
grand_parent: Pipelines
nav_order: 79
---

# parse_ion

The `parse_ion` processor takes any nested fields inside an event and parses them into Ion data.

## Configuration

You can configure the `parse_ion` processor with the following options.

| Option | Required | Type | Description |
| :--- | :--- | :--- | :--- | 
| `source` | No | String | The field in the `event` that will be parsed. Default value is `message`. |
| `destination` | No | String | The destination field of the parsed JSON. Defaults to the root of the `event`. Cannot be `""`, `/`, or any white-space-only `string` because these are not valid `event` fields. |
| `pointer` | No | String | A JSON pointer to the field to be parsed. There is no `pointer` by default, meaning the entire `source` is parsed. The `pointer` can access JSON array indexes as well. If the JSON pointer is invalid then the entire `source` data is parsed into the outgoing `event`. If the key that is pointed to already exists in the `event` and the `destination` is the root, then the pointer uses the entire path of the key. |
| `tags_on_failure` | No | String | A list of strings which specify the tags to be set in the event when the processors fails or unknown exception occurs while parsing. 

## Usage

The following examples show how to use `parse_ion` processor in your pipeline.

### Example: Minimum configuration

The following example shows the minimum configuration for the `parse_ion` processor:

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
{% include copy.html %}

When the input event contains the following data:

```
{"outer_key": {"inner_key": "inner_value"}}
```

The processor will parse the event into the following output:

```
{"message": {"outer_key": {"inner_key": "inner_value"}}", "outer_key":{"inner_key":"inner_value"}}
```

### Example: Using a JSON pointer

The following example shows how to parse a selection of the ion data using the `pointer` option:

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
{% include copy.html %}

When the input event contains the following data:

```
{"outer_key": {"inner_key": "inner_value"}}
```

The processor will parse the event into the following output:

```
{"message": {"outer_key": {"inner_key": "inner_value"}}", "inner_key": "inner_value"}
```
