---
layout: default
title: Append
parent: Ingest processors 
grand_parent: Ingest APIs
nav_order: 10
---

# Append

The `append` processor is used to add values to a field:
- If the field is an array, the `append` processor appends the specified values to that array.
- If the field is a scalar field, the `append` processor converts it to an array and appends the specified values to that array.
- If the field does not exist, the `append` processor creates an array with the specified values.

The following is the syntax for the `append` processor: 

```json
{
    "append": {
        "field": "your_target_field",
        "value": ["your_appended_value"]
    }
}
```
{% include copy-curl.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `append` processor.

Parameter | Required | Description |
|-----------|-----------|-----------|
`field`  | Required  | The name of the field where the data should be appended. Supports template snippets.|
`value`  | Required  | The value to be appended. This can be a static value, a dynamic value derived from existing fields, or a value obtained from external lookups. Supports template snippets. | 
`description`  | Optional  | A brief description of the processor.  |
`if` | Optional | Condition to run this processor. |
`ignore_failure` | Optional | If set to `true`, failures are ignored. Default is `false`. |
`on_failure` | Optional | A list of processors to run if the processor fails. |
`tag` | Optional | An identifier tag for the processor. Useful for debugging to distinguish between processors of the same type. |

## Using the processor

Follow these steps to use the processor in a pipeline.

**Step 1: Create a pipeline.** 

The following query creates a pipeline, named `user-behavior`, that has one append processor. It appends the `event_type` of each new document ingested into OpenSearch to an array field named `event_types`:

```json
PUT _ingest/pipeline/user-behavior
{
  "description": "Pipeline that appends event type",
  "processors": [
    {
      "append": {
        "field": "event_types",
        "value": ["page_view"]
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
POST _ingest/pipeline/user-behavior/_simulate
{
  "docs": [
    {
      "_index": "testindex1",
      "_id": "1",
      "_source": {
        "event_type": "page_view",
        "event_types":
          "event_type"
      }
    }
  ]
}
```
{% include copy-curl.html %}

**Step 3: Ingest a document.**

The following query ingests a document into an index named `testindex1`:

```json
PUT testindex1/_doc/1?pipeline=user-behavior
{
}
```
{% include copy-curl.html %}

**Step 4 (Optional): Retrieve the document.**

To retrieve the document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}

Because the document does not contain an `event_types` field, an array field is created and the event is appended to the array:

```json
{
  "_index": "testindex1",
  "_id": "1",
  "_version": 2,
  "_seq_no": 1,
  "_primary_term": 1,
  "found": true,
  "_source": {
    "event_type": "page_view",
    "event_types": [
      "page_view"
    ]
  }
}
```

#### Response

The following example response confirms the pipeline is working correctly and producing the expected output:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "testindex1",
        "_id": "1",
        "_source": {
          "event_type": "page_view",
          "event_types": [
            "event_type",
            "event_type"
          ]
        },
        "_ingest": {
          "timestamp": "2023-08-22T16:02:37.893458209Z"
        }
      }
    }
  ]
}
```
