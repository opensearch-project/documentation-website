---
layout: default
title: Sort
parent: Ingest processors
nav_order: 250
---

# Sort processor

The `sort` processor is used to <explain what is used to do>.

The following is the syntax for the `sort` processor:

```json
{
  "description": "...",
  "processors": [
    {
      "sort": {
        "field": "my_field",
        "order": "desc"
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `sort` processor.

| Parameter  | Required/Optional  | Description  |
|---|---|---|
`field`  | Required | The field to be sorted.
`order`  | Optional | The sort order to apply. Accepts `asc` for ascending or `desc` for descending. Default is `asc`.
`description`  | Optional  | A brief description of the processor.
`if` | Optional | A condition for running the processor.
`ignore_failure` | Optional | Specifies whether the processor continues execution even if it encounters an error. If set to `true`, failures are ignored. Default is `false`.
`on_failure` | Optional | A list of processors to run if the processor fails.
`tag` | Optional | An identifier tag for the processor. Useful for debugging in order to distinguish between processors of the same type.


## Using the processor

Follow these steps to use the processor in a pipeline.

### Step 1: Create a pipeline

The following query creates a pipeline named `sort-pipeline` that uses the `sort` processor to sort the `my_field` in descending order and store the sorted values in the `sorted_field`:

```json
PUT _ingest/pipeline/sort-pipeline
{
  "description": "Sorts the 'my_field' in descending order and stores the result in 'sorted_field'",
  "processors": [
    {
      "sort": {
        "field": "my_field",
        "order": "desc"
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
POST _ingest/pipeline/sort-pipeline/_simulate
{
  "docs": [
    {
      "_source": {
        "my_field": [3, 1, 2]
      }
    },
    {
      "_source": {
        "my_field": [5, 2, 3]
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
          "my_field": [
            3,
            2,
            1
          ]
        },
        "_ingest": {
          "timestamp": "2024-05-28T21:12:20.082403005Z"
        }
      }
    },
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "my_field": [
            5,
            3,
            2
          ]
        },
        "_ingest": {
          "timestamp": "2024-05-28T21:12:20.082476797Z"
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
  "my_field": [5, 2, 3]
}
```
{% include copy-curl.html %}

#### Response

The request indexes the document into the index `testindex1` and then indexes all documents with the `my_field` sorted in descending order, as shown in the following response:

```json
{
  "_index": "testindex1",
  "_id": "N1kNwY8B_I3uRxx2Y_jy",
  "_version": 1,
  "result": "created",
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
GET testindex1/_doc/Aw3456789
```
{% include copy-curl.html %}

#### Response

```json
{
  "_index": "testindex1",
  "_id": "Aw3456789",
  "found": false
}
```
{% include copy-curl.html %}
