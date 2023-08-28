---
layout: default
title: Uppercase
parent: Ingest processors 
grand_parent: Ingest APIs
nav_order: 310
---

# Uppercase

The `uppercase` processor converts all the text in a specific field to uppercase letters. The following is the syntax for the `uppercase` processor: 

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
`field`  | Required  | The name of the field where the data should be appended. Supports template snippets. |
`description`  | Optional  | Brief description of the processor.  |
`if` | Optional | Condition to run this processor. |
`ignore_failure` | Optional | If set to `true`, failures are ignored. Default is `false`. |
`ignore_missing`  | Optional  | Specifies whether the processor should ignore documents that do not have the specified field. Default is `false`.  |
`on_failure` | Optional | A list of processors to run if the processor fails. |
`tag` | Optional | An identifier tag for the processor. Useful for debugging to distinguish between processors of the same type. |
`target_field`  | Optional  | Name of the field to store the parsed data in. Default is `field`. By default, `field` is updated in-place. |

## Using the processor

Follow these steps to use the processor in a pipeline.

**Step 1: Create a pipeline.** 

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


**Step 2 (Optional): Test the pipeline.**

It is recommended that you test a pipeline before you ingest documents.
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
        "name": "{John}"
      }
    }
  ]
}
```
{% include copy-curl.html %}

**Step 3: Ingest a document.**

The following query ingests a document into an index named `testindex1`:

```json
PUT testindex1/_doc/1?pipeline=uppercase
{
  "name": "John"
}
```
{% include copy-curl.html %}

**Step 4 (Optional): Retrieve the document.**

To retrieve the document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}

#### Response

The following example response confirms the pipeline is working correctly and producing the expected output:

```json
{
  "_index": "testindex1",
  "_id": "1",
  "_version": 44,
  "_seq_no": 43,
  "_primary_term": 3,
  "found": true,
  "_source": {
    "name": "JOHN"
  }
}
```