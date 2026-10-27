---
layout: default
title: Paginating hybrid query results
parent: Hybrid search
grand_parent: AI search
has_children: false
nav_order: 20
---

# Paginating hybrid query results
**Introduced 2.19**
{: .label .label-purple }

You can apply pagination to hybrid query results by using the `pagination_depth` parameter in the hybrid query clause, along with the standard `from` and `size` parameters. The `pagination_depth` parameter defines the maximum number of search results that can be retrieved from each shard per subquery. For example, setting `pagination_depth` to `50` allows up to 50 results per subquery to be maintained in memory from each shard.

A hybrid query with a `from` value greater than `0` must specify `pagination_depth`. The `pagination_depth` value cannot exceed the `index.max_result_window` index setting.

When the hybrid query runs in [fusion mode]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/fusion-mode/), `pagination_depth` is optional even if `from` is greater than `0`. If you specify it, it raises the number of results that each subquery contributes to fusion, unless the query also sets `fusion.window_size`. A page that starts past the last fused result is empty. For more information, see [Candidate window size]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/fusion-mode/#candidate-window-size).

To navigate through the results, use the `from` and `size` parameters:

- `from`: Specifies the document number from which you want to start showing the results. Default is `0`.
- `size`: Specifies the number of results to return on each page. Default is `10`.

For example, to skip the first 20 documents and show the next 10, specify `from: 20` and `size: 10`. For more information about pagination, see [Paginate results]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/paginate/#the-from-and-size-parameters).

## Prerequisites

The examples on this page use the `my-nlp-index` index and the `nlp-search-pipeline` search pipeline. To create the index and ingest the documents, follow the steps in [Combining hybrid search and aggregations]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/aggregations/). To create the search pipeline, see [Step 3: Configure a search pipeline]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/#step-3-configure-a-search-pipeline).

## The impact of pagination_depth on hybrid search results

Changing `pagination_depth` affects the underlying set of search results retrieved before any ranking, filtering, or pagination adjustments are applied. This is because `pagination_depth` determines the number of results retrieved per subquery from each shard, which can ultimately change the result order after normalization. To ensure consistent pagination, keep the `pagination_depth` value the same while navigating between pages.  

By default, hybrid search without pagination retrieves results using the `from + size` formula, where `from` is always `0`.
{: .note}  

To enable deeper pagination, increase the `pagination_depth` value. You can then navigate through results using the `from` and `size` parameters. Note that deeper pagination can impact search performance because retrieving and processing more results requires additional computational resources.

The following example shows a search request configured with `from: 0`, `size: 2`, and `pagination_depth: 10`. This means that up to 10 search results per shard will be retrieved for both the `bool` and `term` queries before pagination is applied:

```json
GET /my-nlp-index/_search?search_pipeline=nlp-search-pipeline
{
  "size": 2,
  "query": {
    "hybrid": {
      "pagination_depth":10,  
      "queries": [
        {
          "term": {
            "category": "permission"
          }
        },
        {
          "bool": {
            "should": [
              {
                "term": {
                  "category": "editor"
                }
              },
              {
                "term": {
                  "category": "statement"
                }
              }
            ]
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

The response contains the first two of the four matching documents:

```json
{
    "hits": {
        "total": {
            "value": 4,
            "relation": "eq"
        },
        "max_score": 0.7,
        "hits": [
            {
                "_index": "my-nlp-index",
                "_id": "eneXlZQBJkWerFzHv4eW",
                "_score": 0.7,
                "_source": {
                    "category": "editor",
                    "doc_index": 9871,
                    "doc_price": 30
                }
            },
            {
                "_index": "my-nlp-index",
                "_id": "e3eXlZQBJkWerFzHv4eW",
                "_score": 0.7,
                "_source": {
                    "category": "statement",
                    "doc_keyword": "entire",
                    "doc_index": 8242,
                    "doc_price": 350
                }
            }
        ]
    }
}
```

The following search request is configured with `from: 2`, `size: 2`, and `pagination_depth: 10`. The `pagination_depth` remains unchanged to ensure that pagination is based on the same set of search results:

```json
GET /my-nlp-index/_search?search_pipeline=nlp-search-pipeline
{
  "size": 2,
  "from": 2,
  "query": {
    "hybrid": {
      "pagination_depth":10,  
      "queries": [
        {
          "term": {
            "category": "permission"
          }
        },
        {
          "bool": {
            "should": [
              {
                "term": {
                  "category": "editor"
                }
              },
              {
                "term": {
                  "category": "statement"
                }
              }
            ]
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

The response skips the first two documents and contains the next two:

```json
{
    "hits": {
        "total": {
            "value": 4,
            "relation": "eq"
        },
        "max_score": 0.7,
        "hits": [
            {
                "_index": "my-nlp-index",
                "_id": "fHeXlZQBJkWerFzHv4eW",
                "_score": 0.7,
                "_source": {
                    "category": "statement",
                    "doc_keyword": "idea",
                    "doc_index": 5212,
                    "doc_price": 200
                }
            },
            {
                "_index": "my-nlp-index",
                "_id": "d3eXlZQBJkWerFzHv4eV",
                "_score": 0.3,
                "_source": {
                    "category": "permission",
                    "doc_keyword": "workable",
                    "doc_index": 4976,
                    "doc_price": 100
                }
            }
        ]
    }
}
```

