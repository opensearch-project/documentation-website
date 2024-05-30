---
layout: default
title: script
parent: Ingest processors
nav_order: 230
---

# `script` processor

The `script` processor executes inline and stored scripts that can modify or transform data in an OpenSearch document during the ingestion process. The processor uses script caching for improved performance, as scripts may be recompiled per document. Refer to [Script APIs](https://opensearch.org/docs/latest/api-reference/script-apis/index/) for information about working with scripts in OpenSearch. 

The following is the syntax for the `script` processor:

```json
{
  "processor": {
    "script": {
      "tag": "<processor_tag>",
      "description": "<processor_description>",
      "source": "<script_source>",
      "lang": "<script_language>",
      "params": {
        "<param_name>": "<param_value>"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `script` processor.

| Parameter  | Required/Optional  | Description  |
|---|---|---|
`source`  | Required  | The Painless script to be executed.
`lang`  | Required  | The programming language of the script. Default is `painless`.
`params` | Required |  The parameters that can be passed to the script.
`description`  | Optional  | A description of the processor's purpose or configuration.
`if` | Optional | Specifies to conditionally execute the processor.
`ignore_failure` | Optional | Specifies to ignore failures for the processor. See [Handling pipeline failures]({{site.url}}{{site.baseurl}}/ingest-pipelines/pipeline-failures/).
`on_failure` | Optional | Specifies a list of processors to run if the processor fails during execution. These processors are executed in the order they are specified.
`tag` | Optional | An identifier tag for the processor. Useful for debugging in order to distinguish between processors of the same type.

## Using the processor

Follow these steps to use the processor in a pipeline.

### Step 1: Create a pipeline

The following query creates a pipeline named <pipeline name> that uses the script processor to <do what?>: 

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
{% include copy-curl.html %}

### Step 3: Ingest a document 

The following query ingests a document into an index named `testindex1`:

```json
POST testindex1/_doc?pipeline=my-script-pipeline
{
  "message": "hello, world!"
}
```
{% include copy-curl.html %}

#### Response

This repsonse confirms that the document is indexed into `testindex1` and is indexing all documents with the `message` field transformed to uppercase.

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
{% include copy-curl.html %}

### Step 4 (Optional): Retrieve the document

To retrieve the document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}

<Provide any other information and code examples relevant to the user or use cases.>
