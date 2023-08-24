---
layout: default
title: Uppercase
parent: Ingest processors 
grand_parent: Ingest APIs
nav_order: 310
---

# Uppercase

This processor converts all the text in a specific field to uppercase letters. The syntax for the `uppercase` processor is: 

```json
{
  "uppercase": {
    "field": "field_name"
  }
}
```
{% include copy-curl.html %}

#### Configuration parameters

The following table lists the required and optional parameters for the `uppercase` processor.

| Name  | Required  | Description  |
|---|---|---|
`field`  | Required  | Name of the field where the data should be appended. Supports template snippets.|
`description`  | Optional  | Brief description of the processor.  |
`if` | Optional | Condition to run this processor. |
`ignore_failure` | Optional | If set to `true`, failures are ignored. Default is `false`. |
`ignore_missing`  | Optional  | Specifies whether the processor should ignore documents that do not have the specified field. Default is `false`.  |
`on_failure` | Optional | A list of processors to run if the processor fails. |
`tag` | Optional | An identifier tag for the processor. Useful for debugging to distinguish between processors of the same type. |
`target_field`  | Optional  | Name of the field to store the parsed data in. Default is `field`. By default, `field` is updated in-place. |

## Using the processor

Follow these steps to use the processor in a pipeline.

**Step 1: Create pipeline.** 

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

**Step 2: Ingest a document into the index.**

The following query ingests a document into the index named `testindex1`:

```json
PUT testindex1/_doc/1?pipeline=uppercase
{
  "name": "John"
}
```
{% include copy-curl.html %}

**Step 3: View the ingested document.**

To view the ingested document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}

**Step 4: Test the pipeline.**

To test the pipeline, run the following query:

```json
POST _ingest/pipeline/uppercase/_simulate
{
  "docs": [
    {
      "_index": "testindex1",
      "_id": "1",
      "_source": {
        "name": "JOHN"
      }
    }
  ]
}
```
{% include copy-curl.html %}

You'll receive the following response, which confirms that the pipeline is working correctly and producing the expected output:

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
          "timestamp": "2023-08-22T18:40:40.870808043Z"
        }
      }
    }
  ]
}
```
