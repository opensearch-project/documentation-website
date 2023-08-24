---
layout: default
title: Remove
parent: Ingest processors 
grand_parent: Ingest APIs
nav_order: 230
---

# Remove

The remove processor is used to remove a field from a document. The syntax for the `remove` processor is: 

```json
{
    "remove": {
        "field": "field_name"
    }
}
```
{% include copy-curl.html %}

#### Configuration parameters

The following table lists the required and optional parameters for the `remove` processor.

| Name  | Required  | Description  |
|---|---|---|
`field`  | Required  | Name of the field where the data should be appended. Supports template snippets.|
`description`  | Optional  | Brief description of the processor.  |
`if` | Optional | Condition to run this processor. |
`ignore_failure` | Optional | If set to `true`, failures are ignored. Default is `false`. |
`on_failure` | Optional | A list of processors to run if the processor fails. |
`tag` | Optional | An identifier tag for the processor. Useful for debugging to distinguish between processors of the same type. |

## Using the processor

Follow these steps to use the processor in a pipeline.

**Step 1: Create pipeline.** 

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

**Step 2: Ingest a document into the index.**

The following query ingests a document into the index named `testindex1`:

```json
PUT testindex1/_doc/1?pipeline=remove_ip
{
  "ip_address": "203.0.113.1"
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
POST _ingest/pipeline/remove_ip/_simulate
{
  "docs": [
    {
      "_index": "testindex1",
      "_id": "1",
      "_source":{
         "ip_address": "203.0.113.1"
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
        "_source": {},
        "_ingest": {
          "timestamp": "2023-08-22T17:58:33.970510012Z"
        }
      }
    }
  ]
}
```
