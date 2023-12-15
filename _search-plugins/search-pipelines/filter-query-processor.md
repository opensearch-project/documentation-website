---
layout: default
title: Filter query
nav_order: 10
has_children: false
parent: Search processors
grand_parent: Search pipelines
---

# Filter query processor

The `filter_query` search request processor intercepts a search request and applies an additional query to the request, filtering the results. This is useful when you don't want to rewrite existing queries in your application but need additional filtering of the results.

## Request fields

The following table lists all available request fields.

Field | Data type | Description
:--- | :--- | :---
`query` | Object | A query in query domain-specific language (DSL). For a list of OpenSearch query types, see [Query DSL]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/). Required. 
`tag` | String | The processor's identifier. Optional.
`description` | String | A description of the processor. Optional.
`ignore_failure` | Boolean | If `true`, OpenSearch [ignores any failure]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/creating-search-pipeline/#ignoring-processor-failures) of this processor and continues to run the remaining processors in the search pipeline. Optional. Default is `false`.

## Example 

The following example demonstrates using a search pipeline with a `filter_query` processor.

### Setup

Create an index named `my_index` and index two documents, one public and one private:

```json
POST /my_index/_doc/1
{
  "message": "This is a public message", 
  "visibility":"public"
}
```
{% include copy-curl.html %}

```json
POST /my_index/_doc/2
{
  "message": "This is a private message", 
  "visibility": "private"
}
```
{% include copy-curl.html %}

### Creating a search pipeline 

The following request creates a search pipeline called `my_pipeline` with a `filter_query` request processor that uses a term query to return only public messages:

```json
PUT /_search/pipeline/my_pipeline 
{
  "request_processors": [
    {
      "filter_query" : {
        "tag" : "tag1",
        "description" : "This processor is going to restrict to publicly visible documents",
        "query" : {
          "term": {
            "visibility": "public"
          }
        }
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

The response contains both documents:

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}
```json
{
  "took" : 47,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "my_index",
        "_id" : "1",
        "_score" : 1.0,
        "_source" : {
          "message" : "This is a public message",
          "visibility" : "public"
        }
      },
      {
        "_index" : "my_index",
        "_id" : "2",
        "_score" : 1.0,
        "_source" : {
          "message" : "This is a private message",
          "visibility" : "private"
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

The response contains only the document with `public` visibility:

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}
```json
{
  "took" : 19,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 1,
      "relation" : "eq"
    },
    "max_score" : 0.0,
    "hits" : [
      {
        "_index" : "my_index",
        "_id" : "1",
        "_score" : 0.0,
        "_source" : {
          "message" : "This is a public message",
          "visibility" : "public"
        }
      }
    ]
  }
}
```
</details>