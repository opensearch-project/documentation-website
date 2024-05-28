---
layout: default
title: Set
parent: Ingest processors
nav_order: 240
---

# Set processor

The `set` processor adds or updates fields in the source document. It sets one field and associates it with the specified value. If the field already exists, its value is replaced with the provided one.

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
{% include copy-curl.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `set` processor.

Parameter | Required/Optional | Description |
|-----------|-----------|-----------|
`field` | Required | The field to be set or updated. Supports [template snippets]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#template-snippets).
`value` | Required | The value to be assigned to the field. Supports [template snippets]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#template-snippets).
`description`  | Optional  | A brief description of the processor.
`if` | Optional | A condition for running the processor.
`ignore_failure` | Optional | Specifies whether the processor continues execution even if it encounters errors. If set to `true`, failures are ignored. Default is `false`.
`on_failure` | Optional | A list of processors to run if the processor fails. Refer to [Handling pipeline failures]({{site.url}}{{site.baseurl}}/ingest-pipelines/pipeline-failures/).
`override` | Optional | If `true`, the processor updates fields with pre-existing non-null-valued fields. When set to `false`, such fields are not touched. Default is `true`.
`tag` | Optional | An identifier tag for the processor. Useful for debugging in order to distinguish between processors of the same type.

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

#### Response

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
          "timestamp": "2024-05-28T20:46:44.984160378Z"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Step 3: Ingest a document 

The following query ingests a document into an index named `testindex1`:

```json
POST testindex1/_doc
{
  "existing_field": "value"
}
```
{% include copy-curl.html %}

#### Response

The request indexes the document into the index `testindex1` and then indexes all documents with the `new_field` set to `some_value`, as shown in the following response:

```json
{
  "_index": "testindex1",
  "_id": "Nln2wI8B_I3uRxx2fPjH",
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
{% include copy-curl.html %}

### Step 4 (Optional): Retrieve the document

To retrieve the document, run the following query:

```json
GET testindex1/_doc/Aw3456789
```
{% include copy-curl.html %}

```json
{
  "_index": "testindex1",
  "_id": "Aw3456789",
  "found": false
}
```
{% include copy-curl.html %}

