---
layout: default
title: Rename
parent: Ingest processors
nav_order: 230
redirect_from:
   - /api-reference/ingest-apis/processors/rename/
canonical_url: https://docs.opensearch.org/latest/ingest-pipelines/processors/rename/
---

# Rename processor

The `rename` processor is used to rename an existing field, which can also be used to move a field from one object to another object or to the root level.

## Syntax

The following is the syntax for the `rename` processor: 

```json
{
    "rename": {
        "field": "field_name",
        "target_field" : "target_field_name"
    }
}
```
{% include copy-curl.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `rename` processor.

| Parameter  | Required/Optional  | Description  |
|---|---|---|
`field`  | Required  | The field name containing the data to be removed. Supports [template snippets]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#template-snippets). |
`target_field`  | Required  | The new name of the field. Supports [template snippets]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#template-snippets). |
`ignore_missing`  | Optional  | Specifies whether the processor should ignore documents that do not contain the specified `field`. If set to `true`, the processor does not modify the document if the `field` does not exist. Default is `false`. |
`description`  | Optional  | A brief description of the processor.  |
`if` | Optional | A condition for running the processor. |
`ignore_failure` | Optional | Specifies whether the processor continues execution even if it encounters an error. If set to `true`, failures are ignored. Default is `false`. |
`on_failure` | Optional | A list of processors to run if the processor fails. |
`tag` | Optional | An identifier tag for the processor. Useful for debugging in order to distinguish between processors of the same type. |

## Using the processor

Follow these steps to use the processor in a pipeline.

**Step 1: Create a pipeline** 

The following query creates a pipeline named `rename_field` that moves a field in an object to the root level: 

```json
PUT /_ingest/pipeline/rename_field
{
  "description": "Pipeline that moves a field to the root level.",
  "processors": [
    {
      "rename": {
        "field": "message.content",
        "target_field": "content"
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
POST _ingest/pipeline/rename_field/_simulate
{
  "docs": [
    {
      "_index": "testindex1",
      "_id": "1",
      "_source":{
         "message": {
           "type": "nginx",
           "content": "192.168.1.10 - - [03/Nov/2023:15:20:45 +0000] \"POST /login HTTP/1.1\" 200 3456"
         }
      }
    }
  ]
}
```
{% include copy-curl.html %}

**Response**

The following example response confirms that the pipeline is working as expected:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "testindex1",
        "_id": "1",
        "_source": {
          "message": {
            "type": "nginx",
          },
          "content": """192.168.1.10 - - [03/Nov/2023:15:20:45 +0000] "POST /login HTTP/1.1" 200 3456"""
        },
        "_ingest": {
          "timestamp": "2024-04-15T07:54:16.010447Z"
        }
      }
    }
  ]
}
```

**Step 3: Ingest a document**

The following query ingests a document into an index named `testindex1`:

```json
PUT testindex1/_doc/1?pipeline=rename_field
{
  "message": {
    "type": "nginx",
    "content": "192.168.1.10 - - [03/Nov/2023:15:20:45 +0000] \"POST /login HTTP/1.1\" 200 3456"
  }
}
```
{% include copy-curl.html %}

**Step 4 (Optional): Retrieve the document**

To retrieve the document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}
