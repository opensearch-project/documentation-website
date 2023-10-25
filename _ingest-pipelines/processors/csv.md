---
layout: default
title: CSV
parent: Ingest processors
nav_order: 40
redirect_from:
   - /api-reference/ingest-apis/processors/csv/
---

# CSV
**Introduced 1.0**
{: .label .label-purple }

The `csv` processor is used to parse CSVs and store them as individual fields in a document. The processor ignores empty fields. 

## Example
The following is the syntax for the `csv` processor: 

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

Parameter | Required | Description |
|-----------|-----------|-----------|
`field`  | Required  | The name of the field that contains the data to be converted. Supports template snippets. |
`target_fields`  | Required  | The name of the field in which to store the parsed data. |
`description`  | Optional  | A brief description of the processor.  |
`empty_value`  | Optional  | Represents optional parameters that are not required or are not applicable.  |
`if` | Optional | A condition for running this processor. |
`ignore_failure` | Optional | If set to `true`, failures are ignored. Default is `false`. |
`ignore_missing`  | Optional | If set to `true`, the processor will not fail if the field does not exist. Default is `true`.  | 
`on_failure` | Optional | A list of processors to run if the processor fails. |
`quote`  | Optional  | The character used to quote fields in the CSV data. Default is `"`. |
`separator`  | Optional  | The delimiter used to separate the fields in the CSV data. Default is `,`.  |
`tag` | Optional | An identifier tag for the processor. Useful for debugging to distinguish between processors of the same type. |
`trim`  | Optional  | If set to `true`, the processor trims white space from the beginning and end of the text. Default is `false`.  |

## Using the processor

Follow these steps to use the processor in a pipeline.

**Step 1: Create a pipeline.**

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

**Step 2 (Optional): Test the pipeline.**

It is recommended that you test your pipeline before you ingest documents.
{: .tip}

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

#### Response

The following example response confirms that the pipeline is working as expected:

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

**Step 3: Ingest a document.**

The following query ingests a document into an index named `testindex1`:

```json
PUT testindex1/_doc/1?pipeline=csv-processor
{
  "resource_usage": "25,4096,10"
}
```
{% include copy-curl.html %}

**Step 4 (Optional): Retrieve the document.**

To retrieve the document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}
