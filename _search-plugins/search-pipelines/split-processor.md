---
layout: default
title: Split
nav_order: 140
has_children: false
parent: Search processors
grand_parent: Search pipelines
canonical_url: https://docs.opensearch.org/latest/search-plugins/search-pipelines/split-processor/
---

# Split processor
Introduced 2.17
{: .label .label-purple }

The `split` processor splits a string field into an array of substrings based on a specified delimiter.

## Request body fields

The following table lists all available request fields.

Field | Data type | Description
:--- | :--- | :---
`field` | String | The field containing the string to be split. Required.
`separator` | String | The delimiter used to split the string. Specify either a single separator character or a regular expression pattern. Required.
`preserve_trailing` | Boolean | If set to `true`, preserves empty trailing fields (for example, `''`) in the resulting array. If set to `false`, then empty trailing fields are removed from the resulting array. Default is `false`. 
`target_field` | String | The field in which the array of substrings is stored. If not specified, then the field is updated in place. 
`tag` | String | The processor's identifier. 
`description` | String | A description of the processor. 
`ignore_failure` | Boolean | If `true`, then OpenSearch [ignores any failure]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/creating-search-pipeline/#ignoring-processor-failures) of this processor and continues to run the remaining processors in the search pipeline. Optional. Default is `false`.

## Example 

The following example demonstrates using a search pipeline with a `split` processor.

### Setup

Create an index named `my_index` and index a document containing the field `message`:

```json
POST /my_index/_doc/1
{
  "message": "ingest, search, visualize, and analyze data",
  "visibility": "public"
}
```
{% include copy-curl.html %}

### Creating a search pipeline 

The following request creates a search pipeline with a `split` response processor that splits the `message` field and stores the results in the `split_message` field:

```json
PUT /_search/pipeline/my_pipeline
{
  "response_processors": [
    {
      "split": {
        "field": "message",
        "separator": ", ",
        "target_field": "split_message"
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
          "message": "ingest, search, visualize, and analyze data",
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

The `message` field is split and the results are stored in the `split_message` field:

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 6,
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
          "message": "ingest, search, visualize, and analyze data",
          "split_message": [
            "ingest",
            "search",
            "visualize",
            "and analyze data"
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

In the response, the `message` field is split and the results are stored in the `split_message` field:

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 7,
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
          "message": "ingest, search, visualize, and analyze data",
          "split_message": [
            "ingest",
            "search",
            "visualize",
            "and analyze data"
          ]
        },
        "fields": {
          "visibility": [
            "public"
          ],
          "message": [
            "ingest, search, visualize, and analyze data"
          ],
          "split_message": [
            "ingest",
            "search",
            "visualize",
            "and analyze data"
          ]
        }
      }
    ]
  }
}
```
</details>