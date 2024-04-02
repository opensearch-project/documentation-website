---
layout: default
title: parse_xml
parent: Processors
grand_parent: Pipelines
nav_order: 83
---

# parse_xml

The `parse_xml` processor parses XML data for an event.

## Configuration

You can configure the `parse_xml` processor with the following options.

| Option | Required | Type | Description |
| :--- | :--- | :--- | :--- | 
| `source` | No | String | Specifies which `event` field to parse. |
| `destination` | No | String | The destination field of the parsed XML. Defaults to the root of the `event`. Cannot be `""`, `/`, or any white-space-only string because these are not valid `event` fields. |
| `pointer` | No | String | A JSON pointer to the field to be parsed. The value is null by default, meaning that the entire `source` is parsed. The `pointer` can access JSON array indexes as well. If the JSON pointer is invalid, then the entire `source` data is parsed into the outgoing `event` object. If the key that is pointed to already exists in the `event` object and the `destination` is the root, then the pointer uses the entire path of the key. |
| `parse_when` | No | String | Specifies under what conditions the processor should perform parsing. Default is no condition. Accepts a Data Prepper expression string following the [Data Prepper Expression Syntax]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/expression-syntax/). |
| `tags_on_failure` | No | String | A list of strings that specify the tags to be set if the processor fails or an unknown exception occurs while parsing. 

## Usage

The following examples show how to use the `parse_xml` processor in your pipeline.

### Example: Minimum configuration

The following example shows the minimum configuration for the `parse_xml` processor:

```yaml
parse-xml-pipeline:
  source:
    stdin:
  processor:
    - parse_xml:
        source: "my_xml"
  sink:
    - stdout:
```
{% include copy.html %}

When the input event contains the following data:

```
{ "my_xml": "<Person><name>John Doe</name><age>30</age></Person>" }
```

The processor parses the event into the following output:

```
{ "name": "John Doe", "age": "30" }
```