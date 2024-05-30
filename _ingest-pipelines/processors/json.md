---
layout: default
title: JSON
parent: Ingest processors
nav_order: 170
---

# JSON processor

The `json` processor serializes a string-valued field into a map of maps, which can be useful for various data processing and enrichment tasks.

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
`target_field` | Optional | The name of the field where the deserialized JSON data will be stored. If this parameter is not provided, the deserialized data is added to the root of the document.
`add_to_root` | Optional | A boolean flag that determines whether the deserialized JSON data should be added to the root of the document (`true`) or stored in the target_field (`false`). Default value is `false`. 
`description` | Optional | A description of the processor's purpose or configuration.
`if` | Optional | Specifies to conditionally execute the processor.
`ignore_failure` | Optional | Specifies to ignore failures for the processor. See [Handling pipeline failures]({{site.url}}{{site.baseurl}}/ingest-pipelines/pipeline-failures/).
`on_failure`| Optional | Specifies a list of processors to run if the processor fails during execution. These processors are executed in the order they are specified. 
`tag` | Optional | An identifier tag for the processor. Useful for debugging in order to distinguish between processors of the same type.

## Using the processor

Follow these steps to use the processor in a pipeline.

### Step 1: Create a pipeline

The following query creates a pipeline named `json-pipeline` that uses the `json` processor to flatten a nested JSON structure in the message field:: 

```json
PUT _ingest/pipeline/json-pipeline
{
  "description": "Flattens nested JSON data in the message field",
  "processors": [
    {
      "json": {
        "field": "message",
        "add_to_root": true
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
POST _ingest/pipeline/json-pipeline/_simulate
{
  "docs": [
    {
      "_source": {
        "message": "{\"user\":{\"name\":\"John Doe\",\"age\":32}}"
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
          "message": """{"user":{"name":"John Doe","age":32}}""",
          "user": {
            "name": "John Doe",
            "age": 32
          }
        },
        "_ingest": {
          "timestamp": "2024-05-22T18:07:27.269027084Z"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Step 3: Ingest a document 

The following query ingests a document into an index named `testindex1`:

```json
PUT testindex1/_doc/1?pipeline=json-pipeline
{
  "message": "{\"user\":{\"name\":\"Jane Smith\",\"age\":28}}"
}
```
{% include copy-curl.html %}

#### Response

The request indexes the document into the index <index name> and will index all documents with the flattened JSON data from the message field..

```json
{
  "_index": "testindex1",
  "_id": "1",
  "_version": 1,
  "result": "created",
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 0,
  "_primary_term": 1
}
```
{% include copy-curl.html %}

### Step 4 (Optional): Retrieve the document

To retrieve the document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}

#### Response

```json
{
  "_index": "testindex1",
  "_id": "1",
  "_version": 1,
  "_seq_no": 0,
  "_primary_term": 1,
  "found": true,
  "_source": {
    "message": """{"user":{"name":"Jane Smith","age":28}}""",
    "user": {
      "name": "Jane Smith",
      "age": 28
    }
  }
}
```
{% include copy-curl.html %}
