---
layout: default
title: CSV
parent: Ingest processors 
grand_parent: Ingest APIs
nav_order: 40
---

# CSV

The `csv` processor is used to parse comma-separated values (CSV) and store them as individual fields in a document. The processor ignores empty fields. The syntax for the `csv` processor is: 

```json
{
  "csv": {
    "field": "field_name",
    "target_fields": ["field1, field2, ..."]
  }
}
```
{% include copy-curl.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `csv` processor.

**Parameter** | **Required** | **Description** |
|-----------|-----------|-----------|
`field`  | Required  | Name of the field where the data should be converted. Supports template snippets.|
`target_fields`  | Required  | Name of the field to store the parsed data in. |
`value`  | Required  | Value to be appended. This can be a static value, a dynamic value derived from existing fields, or a value obtained from external lookups. Supports template snippets. | 
`description`  | Optional  | Brief description of the processor.  |
`empty_value`  | Optional  | Represents optional parameters that are not required to be present or are not applicable.  |
`if` | Optional | Condition to run this processor. |
`ignore_failure` | Optional | If set to `true`, failures are ignored. Default is `false`. |
`ignore_missing`  | Optional | If set to `true`, the processor will not fail if the field does not exist. Default is `true`.  | 
`on_failure` | Optional | A list of processors to run if the processor fails. |
`quote`  | Optional  | The character used to quote fields in the CSV data.  |
`separator`  | Optional  | The delimiter used to separate the fields in the CSV data.  |
`tag` | Optional | An identifier tag for the processor. Useful for debugging to distinguish between processors of the same type. |
`trim`  | Optional  | If set to `true`, the processor trims whitespace from the beginning and end of the text. Default is `false`.  |

## Using the processor

Follow these steps to use the processor in a pipeline.

**Step 1: Create pipeline.**

The following query creates a pipeline, named `csv-processor`, that splits `resource_usage` into three new fields named `cpu_usage`, `memory_usage`, and `disk_usage`:

```json
PUT _ingest/pipeline/csv-processor
{
  "description": "Split resource usage into individual fields",
  "processors": [
    {
      "csv": {
        "field": "resource_usage",
        "target_fields": ["cpu_usage", "memory_usage", "disk_usage"],
        "separator": ","
      }
    }
  ]
}
```
{% include copy-curl.html %}

**Step 2: Ingest a document into the index.**

The following query ingests a document into the index named `testindex1`:

```json
PUT testindex1/_doc/1?pipeline=csv-processor
{
  "resource_usage": "25,4096,10"
}
```
{% include copy-curl.html %}

**Step 3: View the ingested document.**

To view the ingested document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}

**Step 4: Test the pipeline.**

To test the pipeline, run the following query:

```json
POST _ingest/pipeline/csv-processor/_simulate
{
  "docs": [
    {
      "_index": "testindex1",
      "_id": "1",
      "_source": {
        "resource_usage": "25,4096,10",
        "memory_usage": "4096",
        "disk_usage": "10",
        "cpu_usage": "25"
      }
    }
  ]
}
```
{% include copy-curl.html %}

You'll get the following response, which confirms the pipeline is working correctly and producing the expected output:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "testindex1",
        "_id": "1",
        "_source": {
          "memory_usage": "4096",
          "disk_usage": "10",
          "resource_usage": "25,4096,10",
          "cpu_usage": "25"
        },
        "_ingest": {
          "timestamp": "2023-08-22T16:40:45.024796379Z"
        }
      }
    }
  ]
}
```