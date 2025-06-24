---
layout: default
title: Drop
parent: Ingest processors
nav_order: 70
canonical_url: https://docs.opensearch.org/docs/latest/ingest-pipelines/processors/drop/
---

This documentation describes using the `drop` processor in OpenSearch ingest pipelines. Consider using the [Data Prepper `drop_events` processor]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/drop-events/), which runs on the OpenSearch cluster, if your use case involves large or complex datasets.
{: .note}

# Drop processor

The `drop` processor is used to discard documents without indexing them. This can be useful for preventing documents from being indexed based on certain conditions. For example, you might use a `drop` processor to prevent documents that are missing important fields or contain sensitive information from being indexed. 

The `drop` processor does not raise any errors when it discards documents, making it useful for preventing indexing problems without cluttering your OpenSearch logs with error messages.

## Syntax example

The following is the syntax for the `drop` processor:

```json
{
  "drop": {
    "if": "ctx.foo == 'bar'"
  }
}
```
{% include copy.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `drop` processor.

Parameter | Required | Description |
|-----------|-----------|-----------|
`description`  | Optional  | A brief description of the processor.  |
`if` | Optional | A condition for running the processor. |
`ignore_failure` | Optional | If set to `true`, failures are ignored. Default is `false`. See [Handling pipeline failures]({{site.url}}{{site.baseurl}}/ingest-pipelines/pipeline-failures/) for more information. |
`on_failure` | Optional | A list of processors to run if the processor fails. See [Handling pipeline failures]({{site.url}}{{site.baseurl}}/ingest-pipelines/pipeline-failures/) for more information. |
`tag` | Optional | An identifier tag for the processor. Useful for distinguishing between processors of the same type when debugging. |

## Using the processor

Follow these steps to use the processor in a pipeline.

**Step 1: Create a pipeline**

The following query creates a pipeline, named `drop-pii`, that uses the `drop` processor to prevent a document containing personally identifiable information (PII) from being indexed:

```json
PUT /_ingest/pipeline/drop-pii
{
  "description": "Pipeline that prevents PII from being indexed",
  "processors": [
    {
      "drop": {
        "if" : "ctx.user_info.contains('password') || ctx.user_info.contains('credit card')"
      }
    }
  ]
}
```
{% include copy-curl.html %}

**Step 2 (Optional): Test the pipeline**

It is recommended that you test your pipeline before ingesting documents.
{: .tip}

To test the pipeline, run the following query:

```json
POST _ingest/pipeline/drop-pii/_simulate
{
  "docs": [
    {
      "_index": "testindex1",
      "_id": "1",
      "_source": {
        "user_info": "Sensitive information including credit card"
      }
    }
  ]
}
```
{% include copy-curl.html %}

#### Response

The following example response confirms that the pipeline is working as expected (the document has been dropped):

```json
{
  "docs": [
    null
  ]
}
```
{% include copy-curl.html %}

**Step 3: Ingest a document**

The following query ingests a document into an index named `testindex1`:

```json
PUT testindex1/_doc/1?pipeline=drop-pii
{
  "user_info": "Sensitive information including credit card"
}
```
{% include copy-curl.html %}

The following response confirms that the document with the ID of `1` was not indexed: 

{
  "_index": "testindex1",
  "_id": "1",
  "_version": -3,
  "result": "noop",
  "_shards": {
    "total": 0,
    "successful": 0,
    "failed": 0
  }
}
{% include copy-curl.html %}
