---
layout: default
title: Script
parent: Ingest processors
nav_order: 230
---

# Script ingest processor

The `script` processor executes inline and stored scripts that can modify or transform data in an OpenSearch document during the ingestion process. The processor uses script caching for improved performance because scripts may be recompiled per document. Refer to [Script APIs]({{site.url}}{{site.baseurl}}/api-reference/script-apis/index/) for information about working with scripts in OpenSearch. 

The following is the syntax for the `script` processor:

```json
{
  "script": {
    "source": "<script_source>",
    "lang": "<script_language>",
    "params": {
      "<param_name>": "<param_value>"
    }
  }
}
```
{% include copy.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `script` processor.

| Parameter  | Required/Optional  | Description  |
|---|---|---|
`source`  | Optional  | The Painless script to be executed. For more information, see [Painless scripting language]({{site.url}}{{site.baseurl}}/scripting/painless/). Either `id` or `source` must be specified---but not both. If `source` is specified, then the script is executed using the provided source code.
`id` | Optional | The ID of a stored script previously created using the [Create Stored Script API]({{site.url}}{{site.baseurl}}/api-reference/script-apis/create-stored-script/). Either `id` or `source` must be specified, but not both. If `id` is specified, then the script source is retrieved from the stored script with the specified ID. 
`lang`  | Optional  | The programming language of the script. Default is `painless`.
`params` | Optional |  The parameters that can be passed to the script.
`description`  | Optional  | A description of the processor's purpose or configuration.
`if` | Optional | Specifies to conditionally execute the processor.
`ignore_failure` | Optional | Specifies to ignore processor failures. See [Handling pipeline failures]({{site.url}}{{site.baseurl}}/ingest-pipelines/pipeline-failures/).
`on_failure` | Optional | Specifies a list of processors to run if the processor fails during execution. These processors are executed in the order they are specified. See [Handling pipeline failures]({{site.url}}{{site.baseurl}}/ingest-pipelines/pipeline-failures/).
`tag` | Optional | An identifier tag for the processor. Useful for debugging in order to distinguish between processors of the same type. For more information, see [Using processor tags for monitoring and debugging]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#using-processor-tags-for-monitoring-and-debugging).

## Using the processor

Follow these steps to use the processor in a pipeline.

### Step 1: Create a pipeline

The following query creates a pipeline named `my-script-pipeline` that uses the `script` processor to convert the `message` field to uppercase: 

```json
PUT _ingest/pipeline/my-script-pipeline
{
  "description": "Example pipeline using the ScriptProcessor",
  "processors": [
    {
      "script": {
        "source": "ctx.message = ctx.message.toUpperCase()",
        "lang": "painless",
        "description": "Convert message field to uppercase"
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
POST _ingest/pipeline/my-script-pipeline/_simulate
{
  "docs": [
    {
      "_source": {
        "message": "hello, world!"
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
          "message": "HELLO, WORLD!"
        },
        "_ingest": {
          "timestamp": "2024-05-30T16:24:23.30265405Z"
        }
      }
    }
  ]
}
```

### Step 3: Ingest a document 

The following query ingests a document into an index named `testindex1`:

```json
PUT testindex1/_doc/1?pipeline=my-script-pipeline
{
  "message": "hello, world!"
}
```
{% include copy-curl.html %}

#### Response

The response confirms that the document has been indexed into `testindex1` and has indexed all documents with the `message` field converted to uppercase:

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
  "_seq_no": 6,
  "_primary_term": 2
}
```

### Step 4 (Optional): Retrieve the document

To retrieve the document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}

## Using parameters and modifying metadata

In the script, the `ctx` variable provides access to the document fields and metadata fields, such as `_index`. Parameters passed in `params` are available in the script as `params.<name>`. When values are passed as parameters, the script source stays the same as the values change, so OpenSearch can reuse the compiled script. For more information, see [How to use scripts]({{site.url}}{{site.baseurl}}/scripting/using-scripts/).

The following request calculates a total price using a discount passed as a parameter and changes the target index of the document:

```json
POST _ingest/pipeline/_simulate
{
  "pipeline": {
    "processors": [
      {
        "script": {
          "source": "ctx.total_price = ctx.unit_price * ctx.quantity * (1 - params.discount); ctx._index = params.target_index;",
          "params": {
            "discount": 0.1,
            "target_index": "orders-processed"
          }
        }
      }
    ]
  },
  "docs": [
    {
      "_index": "orders-raw",
      "_source": {
        "unit_price": 20.0,
        "quantity": 3
      }
    }
  ]
}
```
{% include copy-curl.html %}

The response shows the calculated `total_price` and the changed `_index`:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "orders-processed",
        "_id": "_id",
        "_source": {
          "quantity": 3,
          "unit_price": 20.0,
          "total_price": 54.0
        },
        "_ingest": {
          "timestamp": "2026-10-14T20:10:38.9908023Z"
        }
      }
    }
  ]
}
```
