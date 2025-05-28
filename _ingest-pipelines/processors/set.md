---
layout: default
title: Set
parent: Ingest processors
nav_order: 240
---

# Set processor

The `set` processor adds or updates fields in a document. It sets one field and associates it with the specified value. If the field already exists, then its value is replaced with the provided one unless the `override` parameter is set to `false`. When `override` is `false` and the specified field exists, the value of the field remains unchanged.

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

## Configuration parameters

The following table lists the required and optional parameters for the `set` processor.

Parameter | Required/Optional | Description |
|-----------|-----------|-----------|
`field` | Required | The name of the field to be set or updated. Supports [template snippets]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#template-snippets).
`value` | Required | The value assigned to the field. Supports [template snippets]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#template-snippets).
`override` | Optional | A Boolean flag that determines whether the processor should override the existing value of the field.
`ignore_empty_value` | Optional | A Boolean flag that determines whether the processor should ignore `null` values or empty strings. Default is `false`.
`description`  | Optional  | A description of the processor's purpose or configuration.
`if` | Optional | Specifies to conditionally execute the processor.
`ignore_failure` | Optional | Specifies to ignore processor failures. See [Handling pipeline failures]({{site.url}}{{site.baseurl}}/ingest-pipelines/pipeline-failures/).
`on_failure` | Optional | Specifies a list of processors to run if the processor fails during execution. These processors are executed in the order they are specified.
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
          "timestamp": "2024-05-30T21:56:15.066180712Z"
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
POST testindex1/_doc?pipeline=set-pipeline
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
{% include copy-curl.html %}

### Step 4 (Optional): Retrieve the document

To retrieve the document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}
