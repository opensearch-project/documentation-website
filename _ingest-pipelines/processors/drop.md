---
layout: default
title: Drop
parent: Ingest processors
nav_order: 70
---

# Drop processor

The `drop` processor is used to discard documents without indexing them. This is useful for preventing documents from being indexed based on certain conditions. For example, you might use a `drop` processor to prevent documents that are missing important fields or contain sensitive information from being indexed. 

The `drop` processor does not raise any errors when it discards documents, making it useful for preventing indexing problems without cluttering your OpenSearch logs with error messages.

## Syntax example

The following is the syntax for the `drop` processor:

```json
{
  "drop": {
    "if": "date_field",
    "field": "field-to-be-dropped"]"
  }
}
```
{% include copy-curl.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `date` processor.

Parameter | Required | Description |
|-----------|-----------|-----------|
`description`  | Optional  | A brief description of the processor.  |
`if` | Optional | A condition for running this processor. |
`ignore_failure` | Optional | If set to `true`, failures are ignored. Default is `false`. See [Handling pipeline failures]({{site.url}}{{site.baseurl}}/ingest-pipelines/pipeline-failures/) for more information. |
`on_failure` | Optional | A list of processors to run if the processor fails. See [Handling pipeline failures]({{site.url}}{{site.baseurl}}/ingest-pipelines/pipeline-failures/) for more information. |
`tag` | Optional | An identifier tag for the processor. Useful for debugging to distinguish between processors of the same type. |

## Using the processor

Follow these steps to use the processor in a pipeline.

**Step 1: Create a pipeline.**

The following query creates a pipeline, named `drop-user`, that uses the `drop` processor to prevent a document containing personally identifiable information (PII) from being indexed:

```json
PUT /_ingest/pipeline/drop-pii
{
  "description": "Pipeline that prevents PII from being indexed",
  "processors": [
    {
      "drop": {
        "if" : "ctx.user_info.contains('password') || ctx.user_info.contains('credit_card')"
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

The following example response confirms that the pipeline is working as expected:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "testindex1",
        "_id": "1",
        "_source": {
          "user_info": "Sensitive information including credit card"
        },
        "_ingest": {
          "timestamp": "2023-12-01T20:49:52.476308925Z"
        }
      }
    }
  ]
}
```

**Step 3: Ingest a document.**

The following query ingests a document into an index named `testindex1`:

```json
PUT testindex1/_doc/1?pipeline=drop-pii
{
  "user_info": "Sensitive information including credit card"
}
```
{% include copy-curl.html %}

**Step 4 (Optional): Retrieve the document.**

To retrieve the document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}
