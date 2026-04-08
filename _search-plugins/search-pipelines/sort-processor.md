---
layout: default
title: Sort
nav_order: 130
has_children: false
parent: User-defined search processors
grand_parent: Search pipelines
canonical_url: https://docs.opensearch.org/latest/search-plugins/search-pipelines/sort-processor/
---

# Sort processor
Introduced 2.16
{: .label .label-purple }

The `sort` processor sorts an array of items in either ascending or descending order. Numeric arrays are sorted numerically, while string or mixed arrays (strings and numbers) are sorted lexicographically. The processor throws an error if the input is not an array.

## Request body fields

The following table lists all available request fields.

Field | Data type | Description
:--- | :--- | :---
`field`  | String | The field to be sorted. Must be an array. Required.
`order`  | String | The sort order to apply. Accepts `asc` for ascending or `desc` for descending. Default is `asc`.
`target_field` | String | The name of the field in which the sorted array is stored. If not specified, then the sorted array is stored in the same field as the original array (the `field` variable). 
`tag` | String | The processor's identifier. 
`description` | String | A description of the processor. 
`ignore_failure` | Boolean | If `true`, then OpenSearch [ignores any failure]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/creating-search-pipeline/#ignoring-processor-failures) of this processor and continues to run the remaining processors in the search pipeline. Optional. Default is `false`.

## Example 

The following example demonstrates using a search pipeline with a `sort` processor.

### Setup

Create an index named `my_index` and index a document with the field `message` that contains an array of strings:

```json
POST /my_index/_doc/1
{
  "message": ["one", "two", "three", "four"], 
  "visibility": "public"
}
```
{% include copy-curl.html %}

### Creating a search pipeline 

Create a search pipeline with a `sort` response processor that sorts the `message` field and stores the sorted results in the `sorted_message` field:

```json
PUT /_search/pipeline/my_pipeline
{
  "response_processors": [
    {
      "sort": {
        "field": "message",
        "target_field": "sorted_message"
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Using a search pipeline

Search for documents in `my_index` without a search pipeline:

```json
GET /my_index/_search
```
{% include copy-curl.html %}

The response contains the field `message`:

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 1,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "my_index",
        "_id": "1",
        "_score": 1,
        "_source": {
          "message": [
            "one",
            "two",
            "three",
            "four"
          ],
          "visibility": "public"
        }
      }
    ]
  }
}
```
</details>

To search with a pipeline, specify the pipeline name in the `search_pipeline` query parameter:

```json
GET /my_index/_search?search_pipeline=my_pipeline
```
{% include copy-curl.html %}

The `sorted_message` field contains the strings from the `message` field sorted alphabetically:

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 3,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "my_index",
        "_id": "1",
        "_score": 1,
        "_source": {
          "visibility": "public",
          "sorted_message": [
            "four",
            "one",
            "three",
            "two"
          ],
          "message": [
            "one",
            "two",
            "three",
            "four"
          ]
        }
      }
    ]
  }
}
```
</details>

You can also use the `fields` option to search for specific fields in a document:

```json
POST /my_index/_search?pretty&search_pipeline=my_pipeline
{
    "fields": ["visibility", "message"]
}
``` 
{% include copy-curl.html %}

In the response, the `message` field is sorted and the results are stored in the `sorted_message` field:

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 2,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "my_index",
        "_id": "1",
        "_score": 1,
        "_source": {
          "visibility": "public",
          "sorted_message": [
            "four",
            "one",
            "three",
            "two"
          ],
          "message": [
            "one",
            "two",
            "three",
            "four"
          ]
        },
        "fields": {
          "visibility": [
            "public"
          ],
          "sorted_message": [
            "four",
            "one",
            "three",
            "two"
          ],
          "message": [
            "one",
            "two",
            "three",
            "four"
          ]
        }
      }
    ]
  }
}
```
</details>