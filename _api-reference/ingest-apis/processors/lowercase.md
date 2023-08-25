---
layout: default
title: Lowercase
parent: Ingest processors 
grand_parent: Ingest APIs
nav_order: 210
---

# Lowercase

This processor converts all the text in a specific field to lowercase letters. The following is the syntax for the `lowercase` processor: 

```json
{
  "lowercase": {
    "field": "field_name"
  }
}
```
{% include copy-curl.html %}

#### Configuration parameters

The following table lists the required and optional parameters for the `lowercase` processor.

| Name  | Required  | Description  |
|---|---|---|
`field`  | Required  | Name of the field where the data should be converted. Supports template snippets.|
`description`  | Optional  | Brief description of the processor.  |
`if` | Optional | Condition to run this processor. |
`ignore_failure` | Optional | If set to `true`, failures are ignored. Default is `false`. |
`on_failure` | Optional | A list of processors to run if the processor fails. |
`ignore_missing`  | Optional  | Specifies whether the processor should ignore documents that do not have the specified field. Default is `false`.  |
`tag` | Optional | An identifier tag for the processor. Useful for debugging to distinguish between processors of the same type. |
`target_field`  | Optional  | Name of the field to store the parsed data in. Default is `field`. By default, `field` is updated in-place. |

## Using the processor

Follow these steps to use the processor in a pipeline.

**Step 1: Create a pipeline.** 

The following query creates a pipeline, named `lowercase-title`, that uses the `lowercase` processor to lowercase the `title` field of a document:

```json
PUT _ingest/pipeline/lowercase-title
{
  "description" : "Pipeline that lowercases the title field",
  "processors" : [
    {
      "lowercase" : {
        "field" : "title"
      }
    }
  ]
}
```
{% include copy-curl.html %}

**Step 2 (Optional): Test the pipeline.**

It is recommended that you test a pipeline before you ingest documents.
{: .tip}

To test the pipeline, run the following query:

```json
POST _ingest/pipeline/lowercase-title/_simulate
{
  "docs": [
    {
      "_index": "testindex1",
      "_id": "1",
      "_source": {
        "title": "war and peace"
      }
    }
  ]
}
```
{% include copy-curl.html %}

**Step 3: Ingest a document.**

The following query ingests a document into an index named `testindex1`:

```json
PUT testindex1/_doc/1?pipeline=lowercase-title
{
  "title": "WAR AND PEACE"
}
```
{% include copy-curl.html %}

**Step 4 (Optional): Retrieve the document.**

To view an ingested document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}

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
          "title": "war and peace"
        },
        "_ingest": {
          "timestamp": "2023-08-22T17:39:39.872671834Z"
        }
      }
    }
  ]
}
```
