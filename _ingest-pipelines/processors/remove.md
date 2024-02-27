---
layout: default
title: Remove
parent: Ingest processors
nav_order: 230
redirect_from:
   - /api-reference/ingest-apis/processors/remove/
---

# Remove processor

The `remove` processor is used to remove a field from a document. 

## Syntax

The following is the syntax for the `remove` processor: 

```json
{
    "remove": {
        "field": "field_name"
    }
}
```
{% include copy-curl.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `remove` processor.

| Parameter  | Required/Optional  | Description  |
|---|---|---|
`field`  | Optional  | The field name containing the data to be removed. Supports [template snippets]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#template-snippets). The metadata fields `_index`, `_version`, `_version_type`, and `_id` cannot be removed. If `version` is specified, `_id` cannot be removed from the ingested document. |
`exclude_field`  | Optional  | The field name to be retained. All other fields, except metadata fields, will be removed. The `exclude_field` and `field` options are mutually exclusive. Supports [template snippets]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#template-snippets).  |
`description`  | Optional  | A brief description of the processor.  |
`if` | Optional | A condition for running the processor. |
`ignore_failure` | Optional | Specifies whether the processor continues execution even if it encounters errors. If set to `true`, failures are ignored. Default is `false`. |
`on_failure` | Optional | A list of processors to run if the processor fails. |
`tag` | Optional | An identifier tag for the processor. Useful for debugging in order to distinguish between processors of the same type. |

## Using the processor

Follow these steps to use the processor in a pipeline.

**Step 1: Create a pipeline** 

The following query creates a pipeline, named `remove_ip`, that removes the `ip_address` field from a document: 

```json
PUT /_ingest/pipeline/remove_ip
{
  "description": "Pipeline that excludes the ip_address field.",
  "processors": [
    {
      "remove": {
        "field": "ip_address"
      }
    }
  ]
}
```
{% include copy-curl.html %}

**Step 2 (Optional): Test the pipeline**

It is recommended that you test your pipeline before you ingest documents.
{: .tip}

To test the pipeline, run the following query:

```json
POST _ingest/pipeline/remove_ip/_simulate
{
  "docs": [
    {
      "_index": "testindex1",
      "_id": "1",
      "_source":{
         "ip_address": "203.0.113.1",
         "name": "John Doe"
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
          "name": "John Doe"
        },
        "_ingest": {
          "timestamp": "2023-08-24T18:02:13.218986756Z"
        }
      }
    }
  ]
}
```

**Step 3: Ingest a document**

The following query ingests a document into an index named `testindex1`:

```json
PUT testindex1/_doc/1?pipeline=remove_ip
{
  "ip_address": "203.0.113.1",
  "name": "John Doe"
}
```
{% include copy-curl.html %}

**Step 4 (Optional): Retrieve the document**

To retrieve the document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}
