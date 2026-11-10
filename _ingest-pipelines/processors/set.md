---
layout: default
title: Set
parent: Ingest processors
nav_order: 240
---

# Set processor

The `set` processor adds or updates fields in a document. It sets one field and associates it with the specified value. If the field already exists, then its value is replaced with the provided one unless the `override` parameter is set to `false`. When `override` is `false` and the specified field exists and isn't `null`, the value of the field remains unchanged. A field whose value is `null` is always overwritten.

The following is the syntax for the `set` processor:

```json
{
  "description": "...",
  "processors": [
    {
      "set": {
        "field": "new_field",
        "value": "some_value"
      }
    }
  ]
}
```
{% include copy.html %}

## Parameters

The following table lists the required and optional parameters for the `set` processor.

Parameter | Required/Optional | Description |
|-----------|-----------|-----------|
`field` | Required | The name of the field to be set or updated. Supports [template snippets]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#template-snippets).
`value` | Required | The value assigned to the field. Supports [template snippets]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#template-snippets).
`override` | Optional | A Boolean flag that determines whether the processor should override the existing value of the field. Default is `true`.
`ignore_empty_value` | Optional | A Boolean flag that determines whether the processor should ignore `null` values or empty strings. Default is `false`.
`description`  | Optional  | A description of the processor's purpose or configuration.
`if` | Optional | Specifies to conditionally execute the processor.
`ignore_failure` | Optional | Specifies to ignore processor failures. See [Handling pipeline failures]({{site.url}}{{site.baseurl}}/ingest-pipelines/pipeline-failures/).
`on_failure` | Optional | Specifies a list of processors to run if the processor fails during execution. These processors are executed in the order they are specified.
`tag` | Optional | An identifier tag for the processor. Useful for debugging in order to distinguish between processors of the same type. For more information, see [Using processor tags for monitoring and debugging]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#using-processor-tags-for-monitoring-and-debugging).

## Using the processor

Follow these steps to use the processor in a pipeline.

### Step 1: Create a pipeline

The following query creates a pipeline named `set-pipeline` that uses the `set` processor to add a new field `new_field` with the value `some_value` to the document: 

```json
PUT _ingest/pipeline/set-pipeline
{
  "description": "Adds a new field 'new_field' with the value 'some_value'",
  "processors": [
    {
      "set": {
        "field": "new_field",
        "value": "some_value"
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
POST _ingest/pipeline/set-pipeline/_simulate
{
  "docs": [
    {
      "_source": {
        "existing_field": "value"
      }
    }
  ]
}
```
{% include copy-curl.html %}

The following example response confirms that the pipeline is working as expected:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "existing_field": "value",
          "new_field": "some_value"
        },
        "_ingest": {
          "timestamp": "2024-05-30T21:56:15.066180712Z"
        }
      }
    }
  ]
}
```

### Step 3: Ingest a document

The following query ingests a document into an index named `testindex1`:

```json
POST testindex1/_doc?pipeline=set-pipeline
{
  "existing_field": "value"
}
```
{% include copy-curl.html %}

The request indexes the document into the `testindex1` index with the `new_field` field set to `some_value`, as shown in the following response:

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

### Step 4 (Optional): Retrieve the document

To retrieve the document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}

The response contains the ingested document, transformed as shown in the response in Step 2.

## Copying a value from another field

To copy a value from one field to another, reference the source field in `value` using a template snippet. The following request copies the value of the `customer.address.city` field to the `shipping.city` field:

```json
POST _ingest/pipeline/_simulate
{
  "pipeline": {
    "processors": [
      {
        "set": {
          "field": "shipping.city",
          "value": "{% raw %}{{{customer.address.city}}}{% endraw %}"
        }
      }
    ]
  },
  "docs": [
    {
      "_source": {
        "customer": {
          "address": {
            "city": "Portland"
          }
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

The response shows that the `shipping.city` field contains the copied value:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "shipping": {
            "city": "Portland"
          },
          "customer": {
            "address": {
              "city": "Portland"
            }
          }
        },
        "_ingest": {
          "timestamp": "2026-10-14T19:44:03.269176256Z"
        }
      }
    }
  ]
}
```

Template snippets always produce a string. For example, copying a numeric field value of `24.99` produces the string `"24.99"`. To copy a value while preserving its type, or to copy an entire object, use the [`copy` processor]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/copy/).
