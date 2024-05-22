---
layout: default
title: Foreach
parent: Ingest processors
nav_order: 110
---

# Foreach processor

The `foreach` processor is used to iterate over a list of values in an input document and perform some operation on each value. This can be useful for tasks like extracting information from a nested JSON structure or applying transformations to a collection of fields.

The following is the syntax for the `foreach` processor:

```json
{
  "foreach": {
    "field": "<field_name>",
    "processor": {
      "<processor_type>": {
        "<processor_config>": "<processor_value>"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `foreach` processor.

Parameter | Required/Optional | Description |
|-----------|-----------|-----------|
`field` | Required | The array field to iterate over.
`processor` | Required | The processor to execute against each field.
`ignore_missing` | Optional | If `true` and the specified field does not exist or is 
null, the processor will quietly exit without modifying the document.
`if` | Optional | A conditional expression to determine whether to execute this processor.
`on_failure` | Optional	| Specifies how to handle failures for this processor. See the documentation on [Handling failures in pipelines]({{site.url}}{{site.baseurl}}/ingest-pipelines/pipeline-failures/).
`ignore_failure` | Optional | If `true`, failures for this processor are ignored. See the documentation on [Handling failures in pipelines]({{site.url}}{{site.baseurl}}/ingest-pipelines/pipeline-failures/).
`tag` | Optional | An identifier for this processor. Useful for debugging and metrics.

## Using the processor

Follow these steps to use the processor in a pipeline.

### Step 1: Create a pipeline

The following query creates a pipeline named `test-foreach` that uses the `foreach` processor to extract information from a nested JSON structure: 

```json
PUT _ingest/pipeline/test-foreach
{
  "description": "Extracts nested JSON data",
  "processors": [
    {
      "foreach": {
        "field": "users",
        "processor": {
          "json": {
            "field": "_ingest._value",
            "target_field": "user_data"
          }
        }
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
<insert code example>
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
          "user_data": {
            "name": "Jane Smith",
            "age": 28
          },
          "users": [
            """{"name":"John Doe","age":32}""",
            """{"name":"Jane Smith","age":28}"""
          ]
        },
        "_ingest": {
          "_value": null,
          "timestamp": "2024-05-22T18:27:27.299741001Z"
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
PUT testindex1/_doc/1?pipeline=test-foreach
{
  "users": [
    "{\"name\":\"John Doe\",\"age\":32}",
    "{\"name\":\"Jane Smith\",\"age\":28}"
  ]
}
```
{% include copy-curl.html %}

#### Response

The request indexes the document into the index `testindex1` and indexes all documents with the extracted JSON data from the `users` field:

```json
{
  "_index": "testindex1",
  "_id": "1",
  "_version": 2,
  "result": "updated",
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 1,
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

#### Response

The response shows the document with the extracted JSON data from the `users` field:

```json
{
  "_index": "testindex1",
  "_id": "1",
  "_version": 2,
  "_seq_no": 1,
  "_primary_term": 1,
  "found": true,
  "_source": {
    "user_data": {
      "name": "Jane Smith",
      "age": 28
    },
    "users": [
      """{"name":"John Doe","age":32}""",
      """{"name":"Jane Smith","age":28}"""
    ]
  }
}
```
{% include copy-curl.html %}
