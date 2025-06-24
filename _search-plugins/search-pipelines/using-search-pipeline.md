---
layout: default
title: Using a search pipeline
nav_order: 20
has_children: false
parent: Search pipelines
grand_parent: Search
canonical_url: https://docs.opensearch.org/docs/latest/search-plugins/search-pipelines/using-search-pipeline/
---

# Using a search pipeline

You can use a search pipeline in the following ways:

- [Specify an existing pipeline](#specifying-an-existing-search-pipeline-for-a-request) for a request.
- [Use a temporary pipeline](#using-a-temporary-search-pipeline-for-a-request) for a request.
- Set a [default pipeline](#default-search-pipeline) for all requests in an index.

## Specifying an existing search pipeline for a request

After you [create a search pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/creating-search-pipeline/), you can use the pipeline with a query in the following ways. For a complete example of using a search pipeline with a `filter_query` processor, see [`filter_query` processor example]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/filter-query-processor#example).

### Specifying the pipeline in a query parameter

You can specify the pipeline name in the `search_pipeline` query parameter as follows:

```json
GET /my_index/_search?search_pipeline=my_pipeline
```
{% include copy-curl.html %}

### Specifying the pipeline in the request body

You can provide a search pipeline ID in the search request body as follows:

```json
GET /my-index/_search
{
    "query": {
        "match_all": {}
    },
    "from": 0,
    "size": 10,
    "search_pipeline": "my_pipeline"
}
```
{% include copy-curl.html %}

For multi-search, you can provide a search pipeline ID in the search request body as follows:

```json
GET /_msearch
{ "index": "test"}
{ "query": { "match_all": {} }, "from": 0, "size": 10, "search_pipeline": "my_pipeline"}
{ "index": "test-1", "search_type": "dfs_query_then_fetch"}
{ "query": { "match_all": {} }, "search_pipeline": "my_pipeline1" }

```
{% include copy-curl.html %}

## Using a temporary search pipeline for a request

As an alternative to creating a search pipeline, you can define a temporary search pipeline to be used for only the current query:

```json
POST /my-index/_search
{
  "query" : {
    "match" : {
      "text_field" : "some search text"
    }
  },
  "search_pipeline" : {
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
    ],
    "response_processors": [
      {
        "rename_field": {
          "field": "message",
          "target_field": "notification"
        }
      }
    ]
  }
}
```
{% include copy-curl.html %}

With this syntax, the pipeline does not persist and is used only for the query for which it is specified.

## Default search pipeline

For convenience, you can set a default search pipeline for an index. Once your index has a default pipeline, you don't need to specify the `search_pipeline` query parameter in every search request.

### Setting a default search pipeline for an index

To set a default search pipeline for an index, specify the `index.search.default_pipeline` in the index's settings:

```json
PUT /my_index/_settings 
{
  "index.search.default_pipeline" : "my_pipeline"
}
```
{% include copy-curl.html %}

After setting the default pipeline for `my_index`, you can try the same search for all documents:

```json
GET /my_index/_search
```
{% include copy-curl.html %}

The response contains only the public document, indicating that the pipeline was applied by default:

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

You can search across multiple indexes that share the same default pipeline. For example, `alias1` has two indexes, `my_index1` and `my_index2`, both of which have the default pipeline `my_pipeline` attached to them:

```json
GET /alias1/_search
```
{% include copy-curl.html %}

The response includes only the public version of the document, confirming that the default pipeline was successfully applied:

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
    "took": 59,
    "timed_out": false,
    "_shards": {
        "total": 2,
        "successful": 2,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 1,
            "relation": "eq"
        },
        "max_score": 0.0,
        "hits": [
            {
                "_index": "my_index1",
                "_id": "1",
                "_score": 0.0,
                "_source": {
                    "message": "This is a public message",
                    "visibility": "public"
                }
            }
        ]
    }
}
```
</details>

### Disabling the default pipeline for a request

If you want to run a search request without applying the default pipeline, you can set the `search_pipeline` query parameter to `_none`:

```json
GET /my_index/_search?search_pipeline=_none
```
{% include copy-curl.html %}

### Removing the default pipeline

To remove the default pipeline from an index, set it to `null` or `_none`:

```json
PUT /my_index/_settings 
{
  "index.search.default_pipeline" : null
}
```
{% include copy-curl.html %}

```json
PUT /my_index/_settings 
{
  "index.search.default_pipeline" : "_none"
}
```
{% include copy-curl.html %}
