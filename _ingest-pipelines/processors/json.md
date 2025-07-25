---
layout: default
title: JSON
parent: Ingest processors
nav_order: 170
canonical_url: https://docs.opensearch.org/latest/ingest-pipelines/processors/json/
---

# JSON processor

The `json` processor serializes a string value field into a map of maps, which can be useful for various data processing and enrichment tasks.

The following is the syntax for the `json` processor:

```json
{
  "processor": {
    "json": {
      "field": "<field_name>",
      "target_field": "<target_field_name>",
      "add_to_root": <boolean>
    }
  }
}
```
{% include copy-curl.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `json` processor.

Parameter | Required/Optional | Description |
|-----------|-----------|-----------|
`field` | Required | The name of the field containing the JSON-formatted string to be deserialized.
`target_field` | Optional | The name of the field in which the deserialized JSON data is stored. When not provided, the data is stored in the `field` field. If `target_field` exists, its existing value is overwritten with the new JSON data.
`add_to_root` | Optional | A Boolean flag that determines whether the deserialized JSON data should be added to the root of the document (`true`) or stored in the target_field (`false`). If `add_to_root` is `true`, then `target-field` is invalid. Default value is `false`. 
`description` | Optional | A description of the processor's purpose or configuration.
`if` | Optional | Specifies to conditionally execute the processor.
`ignore_failure` | Optional | Specifies to ignore processor failures. See [Handling pipeline failures]({{site.url}}{{site.baseurl}}/ingest-pipelines/pipeline-failures/).
`on_failure`| Optional | Specifies a list of processors to run if the processor fails during execution. These processors are executed in the order they are specified. 
`tag` | Optional | An identifier tag for the processor. Useful for debugging in order to distinguish between processors of the same type.

## Using the processor

Follow these steps to use the processor in a pipeline.

### Step 1: Create a pipeline

The following query creates a pipeline named `my-json-pipeline` that uses the `json` processor to process JSON data and enrich the documents with additional information: 

```json
PUT _ingest/pipeline/my-json-pipeline
{
  "description": "Example pipeline using the JsonProcessor",
  "processors": [
    {
      "json": {
        "field": "raw_data",
        "target_field": "parsed_data"
        "on_failure": [
          {
            "set": {
              "field": "error_message",
              "value": "Failed to parse JSON data"
            }
          },
          {
            "fail": {
              "message": "Failed to process JSON data"
            }
          }
        ]
      }
    },
    {
      "set": {
        "field": "processed_timestamp",
        "value": "{{_ingest.timestamp}}"
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Step 2 (Optional): Test the pipeline

It is recommended that you test your pipeline before you ingest documents.
{: .tip}

To test the pipeline, run the following query:

```json
POST _ingest/pipeline/my-json-pipeline/_simulate
{
  "docs": [
    {
      "_source": {
        "raw_data": "{\"name\":\"John\",\"age\":30,\"city\":\"New York\"}"
      }
    },
    {
      "_source": {
        "raw_data": "{\"name\":\"Jane\",\"age\":25,\"city\":\"Los Angeles\"}"
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
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "processed_timestamp": "2024-05-30T15:24:48.064472090Z",
          "raw_data": """{"name":"John","age":30,"city":"New York"}""",
          "parsed_data": {
            "name": "John",
            "city": "New York",
            "age": 30
          }
        },
        "_ingest": {
          "timestamp": "2024-05-30T15:24:48.06447209Z"
        }
      }
    },
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "processed_timestamp": "2024-05-30T15:24:48.064543006Z",
          "raw_data": """{"name":"Jane","age":25,"city":"Los Angeles"}""",
          "parsed_data": {
            "name": "Jane",
            "city": "Los Angeles",
            "age": 25
          }
        },
        "_ingest": {
          "timestamp": "2024-05-30T15:24:48.064543006Z"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Step 3: Ingest a document 

The following query ingests a document into an index named `my-index`:

```json
POST my-index/_doc?pipeline=my-json-pipeline
{
  "raw_data": "{\"name\":\"John\",\"age\":30,\"city\":\"New York\"}"
}
```
{% include copy-curl.html %}

#### Response

The response confirms that the document containing the JSON data from the `raw_data` field was successfully indexed:

```json
{
  "_index": "my-index",
  "_id": "mo8yyo8BwFahnwl9WpxG",
  "_version": 1,
  "result": "created",
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 3,
  "_primary_term": 2
}
```
{% include copy-curl.html %}

### Step 4 (Optional): Retrieve the document

To retrieve the document, run the following query:

```json
GET my-index/_doc/1
```
{% include copy-curl.html %}
