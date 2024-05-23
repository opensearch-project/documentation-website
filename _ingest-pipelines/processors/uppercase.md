---
layout: default
title: Uppercase
parent: Ingest processors
nav_order: 310
redirect_from:
   - /api-reference/ingest-apis/processors/uppercase/
---

This documentation describes using the `uppercase` processor in OpenSearch ingest pipelines. Consider using the [Data Prepper `uppercase_string` processor]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/uppercase-string/), which runs on the OpenSearch cluster, if your use case involves large or complex datasets.
{: .note}

# Uppercase processor

The `uppercase` processor converts all the text in a specific field to uppercase letters. 

## Syntax

The following is the syntax for the `uppercase` processor: 

```json
{
  "uppercase": {
    "field": "field_name"
  }
}
```
{% include copy-curl.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `uppercase` processor.

| Parameter  | Required/Optional  | Description  |
|---|---|---|
`field`  | Required  | The name of the field containing the data to be appended. Supports [template snippets]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#template-snippets). |
`description`  | Optional  | A brief description of the processor.  |
`if` | Optional | A condition for running the processor. |
`ignore_failure` | Optional |  Specifies whether the processor continues execution even if it encounters errors. If set to `true`, failures are ignored. Default is `false`. |
`ignore_missing`  | Optional  | Specifies whether the processor should ignore documents that do not contain the specified field. If set to `true`, the processor does not modify the document if the field does not exist or is `null`. Default is `false`.  |
`on_failure` | Optional | A list of processors to run if the processor fails. |
`tag` | Optional | An identifier tag for the processor. Useful for debugging in order to distinguish between processors of the same type. |
`target_field`  | Optional  | The name of the field in which to store the parsed data. Default is `field`. By default, `field` is updated in place. |

## Using the processor

Follow these steps to use the processor in a pipeline.

**Step 1: Create a pipeline** 

The following query creates a pipeline, named `uppercase`, that converts the text in the `field` field to uppercase:

```json
PUT _ingest/pipeline/uppercase
{
  "processors": [
    {
      "uppercase": {
        "field": "name"
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
POST _ingest/pipeline/uppercase/_simulate
{
  "docs": [
    {
      "_index": "testindex1",
      "_id": "1",
      "_source": {
        "name": "John"
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
          "name": "JOHN"
        },
        "_ingest": {
          "timestamp": "2023-08-28T19:54:42.289624792Z"
        }
      }
    }
  ]
}
```

**Step 3: Ingest a document**

The following query ingests a document into an index named `testindex1`:

```json
PUT testindex1/_doc/1?pipeline=uppercase
{
  "name": "John"
}
```
{% include copy-curl.html %}

**Step 4 (Optional): Retrieve the document**

To retrieve the document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}
