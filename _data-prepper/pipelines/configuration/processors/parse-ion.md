---
layout: default
title: parse_ion 
parent: Processors
grand_parent: Pipelines
nav_order: 79
canonical_url: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/processors/parse-ion/
redirect_to: https://docs.opensearch.org/latest/data-prepper/pipelines/configuration/processors/parse-ion/
---

# parse_ion

The `parse_ion` processor parses [Amazon Ion](https://amazon-ion.github.io/ion-docs/) data.

## Configuration

You can configure the `parse_ion` processor with the following options.

| Option | Required | Type | Description |
| :--- | :--- | :--- | :--- | 
| `source` | No | String | The field in the `event` that is parsed. Default value is `message`. |
| `destination` | No | String | The destination field of the parsed JSON. Defaults to the root of the `event`. Cannot be `""`, `/`, or any white-space-only `string` because these are not valid `event` fields. |
| `pointer` | No | String | A JSON pointer to the field to be parsed. There is no `pointer` by default, meaning that the entire `source` is parsed. The `pointer` can access JSON array indexes as well. If the JSON pointer is invalid, then the entire `source` data is parsed into the outgoing `event`. If the key that is pointed to already exists in the `event` and the `destination` is the root, then the pointer uses the entire path of the key. |
| `tags_on_failure` | No | String | A list of strings that specify the tags to be set in the event that the processors fails or an unknown exception occurs while parsing. 

## Usage

The following examples show how to use the `parse_ion` processor in your pipeline.

### Example: Minimum configuration

The following example shows the minimum configuration for the `parse_ion` processor:

```yaml
parse-json-pipeline:
  source:
    stdin:
  processor:
    - parse_json:
        source: "my_ion"
  sink:
    - stdout:
```
{% include copy.html %}

When the input event contains the following data:

```
{"my_ion": "{ion_value1: \"hello\", ion_value2: \"world\"}"}
```

The processor parses the event into the following output:

```
{"ion_value1": "hello", "ion_value2" : "world"}
```


