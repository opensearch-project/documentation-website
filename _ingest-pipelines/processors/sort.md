---
layout: default
title: Sort
parent: Ingest processors
nav_order: 250
canonical_url: https://docs.opensearch.org/latest/ingest-pipelines/processors/sort/
---

# Sort processor

The `sort` processor sorts an array of items in either ascending or descending order. Numeric arrays are sorted numerically, while string or mixed arrays (strings and numbers) are sorted lexicographically. The processor throws an error if the input is not an array.

The following is the syntax for the `sort` processor:

```json
{
  "description": "Sort an array of items",
  "processors": [
    {
      "sort": {
        "field": "my_array_field",
        "order": "desc"
      }
    }
  ]
}
```
{% include copy.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `sort` processor.

| Parameter  | Required/Optional  | Description  |
|---|---|---|
`field`  | Required | The field to be sorted. Must be an array.
`order`  | Optional | The sort order to apply. Accepts `asc` for ascending or `desc` for descending. Default is `asc`.
`target_field` | Optional | The name of the field in which the sorted array is stored. If not specified, then the sorted array is stored in the same field as the original array (the `field` variable). 
`description`  | Optional  | A description of the processor's purpose or configuration.
`if` | Optional | Specifies to conditionally execute the processor.
`ignore_failure` | Optional | Specifies to ignore processor failures. See [Handling pipeline failures]({{site.url}}{{site.baseurl}}/ingest-pipelines/pipeline-failures/).
`on_failure` | Optional | Specifies a list of processors to run if the processor fails during execution. These processors are executed in the order they are specified.
`tag` | Optional | An identifier tag for the processor. Useful for debugging in order to distinguish between processors of the same type.

## Using the processor

Follow these steps to use the processor in a pipeline.

### Step 1: Create a pipeline

The following query creates a pipeline named `sort-pipeline` that uses the `sort` processor to sort the `my_field` in descending order and store the sorted values in the `sorted_field`:

```json
PUT _ingest/pipeline/sort-pipeline
{
  "description": "Sort an array of items in descending order",
  "processors": [
    {
      "sort": {
        "field": "my_array_field",
        "order": "desc",
        "target_field": "sorted_array"
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
        "my_array_field": [3, 1, 4, 1, 5, 9, 2, 6, 5]
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
          "sorted_array": [
            9,
            6,
            5,
            5,
            4,
            3,
            2,
            1,
            1
          ],
          "my_array_field": [
            3,
            1,
            4,
            1,
            5,
            9,
            2,
            6,
            5
          ]
        },
        "_ingest": {
          "timestamp": "2024-05-30T22:10:13.405692128Z"
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
POST testindex1/_doc?pipeline=sort-pipeline
{
  "my_array_field": [3, 1, 4, 1, 5, 9, 2, 6, 5]
}
```
{% include copy-curl.html %}

#### Response

The request indexes the document into the index `testindex1` and then indexes all documents with the `my_array_field` sorted in descending order, as shown in the following response:

```json
{
  "_index": "testindex1",
  "_id": "no-Py48BwFahnwl9KZzf",
  "_version": 1,
  "result": "created",
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 9,
  "_primary_term": 2
}
```
{% include copy-curl.html %}

### Step 4 (Optional): Retrieve the document

To retrieve the document, run the following query:

```json
GET testindex1/_doc/no-Py48BwFahnwl9KZzf
```
{% include copy-curl.html %}

