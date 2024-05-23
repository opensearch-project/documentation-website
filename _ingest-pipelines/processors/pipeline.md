---
layout: default
title: Pipeline
parent: Ingest processors
nav_order: 200
---

# Pipeline processor

The `pipeline` processor defines a series of processing steps to be executed on documents during the ingestion or update process. This is particularly useful when you need to perform complex data transformations or apply multiple processing steps to your data before it is indexed.

The following is the syntax for the `pipeline` processor:

```json
{
  "pipeline": {
    "name": "<pipeline_name>",
    "description": "<pipeline_description>",
    "processors": [
      {
        "<processor_type>": {
          "<processor_config>": "<processor_value>"
        }
      },
      {
        "<processor_type>": {
          "<processor_config>": "<processor_value>"
        }
      }
    ]
  }
}
```
{% include copy-curl.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `pipeline` processor.

Parameter | Required/Optional | Description |
|-----------|-----------|-----------|
`name` | Required	| The name of the pipeline to execute.
`processors` | Required | An array of other processor configurations to execute in the specified order.
`ignore_missing_pipeline` | Optional | Determines whether to ignore a missing or undefined pipeline. Default is `false`.
`description` | Optional | Description of the processor's purpose or configuration.
`if` | Optional | Conditionally execute the processor.
`ignore_failure` | Optional | Ignore failures for the processor. See [Handling pipeline failures]({{site.url}}{{site.baseurl}}/ingest-pipelines/pipeline-failures/).
`on_failure` | Optional | Handle failures for the processor. See [Handling pipeline failures]({{site.url}}{{site.baseurl}}/ingest-pipelines/pipeline-failures/).
`tag` | Optional | Identifier for the processor. Useful for debugging and metrics.

## Using the processor

Follow these steps to use the processor in a pipeline.

### Step 1: Create a pipeline

The following query creates a pipeline named `my_pipeline` that uses the `pipeline` processor to add a new field `my_field` with a static value and convert the `message` field to uppercase: 

```json
PUT _ingest/pipeline/my_pipeline
{
  "description": "My custom pipeline",
  "processors": [
    {
      "set": {
        "field": "my_field",
        "value": "static_value"
      }
    },
    {
      "uppercase": {
        "field": "message"
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
POST _ingest/pipeline/my_pipeline/_simulate
{
  "docs": [
    {
      "_source": {
        "message": "hello world"
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
          "my_field": "static_value",
          "message": "HELLO WORLD"
        },
        "_ingest": {
          "timestamp": "2024-05-23T22:28:49.718036588Z"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Step 3: Ingest a document 

The following query ingests a document into an index named `my_index`:

```json
PUT my_index/_doc/1?pipeline=my_pipeline
{
  "message": "hello world"
}
```
{% include copy-curl.html %}

#### Response

The request indexes the document into the index `my_index` and then indexes all documents with the `message` field converted to uppercase and a new `my_field` field added with the value `static_value`.

```json
{
  "_index": "my_index",
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
GET my_index/_doc/1
```
{% include copy-curl.html %}

#### Response

The response shows the document with the `message` field converted to uppercase and the `my_field` field added with the value `static_value`.

```json
{
  "_index": "my_index",
  "_id": "1",
  "_version": 1,
  "_seq_no": 0,
  "_primary_term": 1,
  "found": true,
  "_source": {
    "my_field": "static_value",
    "message": "HELLO WORLD"
  }
}
```

