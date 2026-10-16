---
layout: default
title: Remove
parent: Ingest processors
nav_order: 222
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
{% include copy.html %}

To remove multiple fields, specify an array of field names:

```json
{
    "remove": {
        "field": ["field_name_1", "field_name_2"]
    }
}
```
{% include copy.html %}

The `exclude_field` parameter also accepts an array of field names to retain.

## Configuration parameters

The following table lists the required and optional parameters for the `remove` processor.

| Parameter  | Required/Optional  | Description  |
|---|---|---|
`field`  | Optional  | The field name containing the data to be removed. Supports [template snippets]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#template-snippets). The metadata fields `_index`, `_version`, and `_version_type` cannot be removed. The `_id` field cannot be removed if the request specifies an external version type. Either `field` or `exclude_field` must be specified. |
`exclude_field`  | Optional  | The field name to be retained. All other fields, except metadata fields, will be removed. The `exclude_field` and `field` options are mutually exclusive. Only top-level field names are supported. If you specify a nested field such as `user.name`, it doesn't match any top-level field, so the processor removes all fields, including the entire `user` object. Supports [template snippets]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#template-snippets).  |
`ignore_missing`  | Optional  | Specifies whether the processor should ignore documents that do not contain the specified field. If set to `true`, the processor does not modify the document if the field does not exist. Default is `false`. |
`description`  | Optional  | A brief description of the processor.  |
`if` | Optional | A condition for running the processor. |
`ignore_failure` | Optional | Specifies whether the processor continues execution even if it encounters errors. If set to `true`, failures are ignored. Default is `false`. |
`on_failure` | Optional | A list of processors to run if the processor fails. |
`tag` | Optional | An identifier tag for the processor. Useful for debugging in order to distinguish between processors of the same type. For more information, see [Using processor tags for monitoring and debugging]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#using-processor-tags-for-monitoring-and-debugging). |

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

## Removing multiple fields

The following request removes the `internal_sku` and `warehouse_code` fields from a document:

```json
POST _ingest/pipeline/_simulate
{
  "pipeline": {
    "processors": [
      {
        "remove": {
          "field": ["internal_sku", "warehouse_code"]
        }
      }
    ]
  },
  "docs": [
    {
      "_source": {
        "product": "Wireless mouse",
        "internal_sku": "WM-4471",
        "warehouse_code": "SEA-02",
        "price": 24.99
      }
    }
  ]
}
```
{% include copy-curl.html %}

The response shows that both fields were removed:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "product": "Wireless mouse",
          "price": 24.99
        },
        "_ingest": {
          "timestamp": "2026-10-14T19:44:03.195795881Z"
        }
      }
    }
  ]
}
```
