---
layout: default
title: Collapse
nav_order: 7
has_children: false
parent: Search processors
grand_parent: Search pipelines
---

# Collapse processor

The `collapse` response processor discards hits that have the same value for some field as a previous document in the result set.
This is similar to the `collapse` parameter that can be passed in a search request, but the response processor is applied to the
response after fetching from all shards. The `collapse` response processor may be used in conjunction with the `rescore` search
request parameter or may be applied after a reranking response processor.

Using the `collapse` response processor will likely result in fewer than `size` results being returned, since hits are discarded 
from a set whose size is already less than or equal to `size`. To increase the likelihood of returning `size` hits, use the 
`oversample` request processor and `truncate_hits` response processor, as shown in [this example]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/truncate-hits-processor/#oversample-collapse-and-truncate-hits).

## Request fields

The following table lists all request fields.

Field | Data type | Description
:--- | :--- | :---
`field` | String | The field whose value will be read from each returned search hit. Only the first hit for each given field value will be returned in the search response. Required.
`context_prefix` | String | May be used to read the `original_size` variable from a specific scope to avoid collisions. Optional.
`tag` | String | The processor's identifier. Optional.
`description` | String | A description of the processor. Optional.
`ignore_failure` | Boolean | If `true`, OpenSearch [ignores any failure]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/creating-search-pipeline/#ignoring-processor-failures) of this processor and continues to run the remaining processors in the search pipeline. Optional. Default is `false`.

## Example

The following example demonstrates using a search pipeline with a `collapse` processor.

### Setup

Create many documents with a field that we'll use for collapsing:

```json
POST /_bulk
{ "create":{"_index":"my_index","_id":1}}
{ "title" : "document 1", "color":"blue" }
{ "create":{"_index":"my_index","_id":2}}
{ "title" : "document 2", "color":"blue" }
{ "create":{"_index":"my_index","_id":3}}
{ "title" : "document 3", "color":"red" }
{ "create":{"_index":"my_index","_id":4}}
{ "title" : "document 4", "color":"red" }
{ "create":{"_index":"my_index","_id":5}}
{ "title" : "document 5", "color":"yellow" }
{ "create":{"_index":"my_index","_id":6}}
{ "title" : "document 6", "color":"yellow" }
{ "create":{"_index":"my_index","_id":7}}
{ "title" : "document 7", "color":"orange" }
{ "create":{"_index":"my_index","_id":8}}
{ "title" : "document 8", "color":"orange" }
{ "create":{"_index":"my_index","_id":9}}
{ "title" : "document 9", "color":"green" }
{ "create":{"_index":"my_index","_id":10}}
{ "title" : "document 10", "color":"green" }
``` 
{% include copy-curl.html %}

Create a pipeline that just collapses on the `color` field:

```json
PUT /_search/pipeline/collapse_pipeline
{
  "response_processors": [
    {
      "collapse" : {
        "field": "color"
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Using a search pipeline

In this example, we request the top 3 documents before collapsing on the "color" field. Since the first 2 documents have the same "color", the second one is discarded,
and the request returns the first and third document:

```json
POST /my_index/_search?search_pipeline=collapse_pipeline
{
  "size": 3
}
```
{% include copy-curl.html %}


<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}
```json
{
  "took" : 2,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 10,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "my_index",
        "_id" : "1",
        "_score" : 1.0,
        "_source" : {
          "title" : "document 1",
          "color" : "blue"
        }
      },
      {
        "_index" : "my_index",
        "_id" : "3",
        "_score" : 1.0,
        "_source" : {
          "title" : "document 3",
          "color" : "red"
        }
      }
    ]
  },
  "profile" : {
    "shards" : [ ]
  }
}
```
</details>
