---
layout: default
title: Paginating hybrid query results
parent: Hybrid search
grand_parent: AI search
has_children: false
nav_order: 60
canonical_url: https://docs.opensearch.org/latest/vector-search/ai-search/hybrid-search/pagination/
---

## Paginating hybrid query results
**Introduced 2.19**
{: .label .label-purple }

You can apply pagination to hybrid query results by using the `pagination_depth` parameter in the hybrid query clause, along with the standard `from` and `size` parameters. The `pagination_depth` parameter defines the maximum number of search results that can be retrieved from each shard per subquery. For example, setting `pagination_depth` to `50` allows up to 50 results per subquery to be maintained in memory from each shard.

To navigate through the results, use the `from` and `size` parameters:

- `from`: Specifies the document number from which you want to start showing the results. Default is `0`.
- `size`: Specifies the number of results to return on each page. Default is `10`.

For example, to show 10 documents starting from the 20th document, specify `from: 20` and `size: 10`. For more information about pagination, see [Paginate results]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/paginate/#the-from-and-size-parameters).

### The impact of pagination_depth on hybrid search results

Changing `pagination_depth` affects the underlying set of search results retrieved before any ranking, filtering, or pagination adjustments are applied. This is because `pagination_depth` determines the number of results retrieved per subquery from each shard, which can ultimately change the result order after normalization. To ensure consistent pagination, keep the `pagination_depth` value the same while navigating between pages.  

By default, hybrid search without pagination retrieves results using the `from + size` formula, where `from` is always `0`.
{: .note}  

To enable deeper pagination, increase the `pagination_depth` value. You can then navigate through results using the `from` and `size` parameters. Note that deeper pagination can impact search performance because retrieving and processing more results requires additional computational resources.

The following example shows a search request configured with `from: 0`, `size: 5`, and `pagination_depth: 10`. This means that up to 10 search results per shard will be retrieved for both the `bool` and `term` queries before pagination is applied:

```json
GET /my-nlp-index/_search?search_pipeline=nlp-search-pipeline
{
  "size": 5,      
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

The response contains the first five results:

```json
{
    "hits": {
        "total": {
            "value": 6,
            "relation": "eq"
        },
        "max_score": 0.5,
        "hits": [
            {
                "_index": "my-nlp-index",
                "_id": "d3eXlZQBJkWerFzHv4eV",
                "_score": 0.5,
                "_source": {
                    "category": "permission",
                    "doc_keyword": "workable",
                    "doc_index": 4976,
                    "doc_price": 100
                }
            },
            {
                "_index": "my-nlp-index",
                "_id": "eneXlZQBJkWerFzHv4eW",
                "_score": 0.5,
                "_source": {
                    "category": "editor",
                    "doc_index": 9871,
                    "doc_price": 30
                }
            },
            {
                "_index": "my-nlp-index",
                "_id": "e3eXlZQBJkWerFzHv4eW",
                "_score": 0.5,
                "_source": {
                    "category": "statement",
                    "doc_keyword": "entire",
                    "doc_index": 8242,
                    "doc_price": 350
                }
            },
            {
                "_index": "my-nlp-index",
                "_id": "fHeXlZQBJkWerFzHv4eW",
                "_score": 0.24999997,
                "_source": {
                    "category": "statement",
                    "doc_keyword": "idea",
                    "doc_index": 5212,
                    "doc_price": 200
                }
            },
            {
                "_index": "index-test",
                "_id": "fXeXlZQBJkWerFzHv4eW",
                "_score": 5.0E-4,
                "_source": {
                    "category": "editor",
                    "doc_keyword": "bubble",
                    "doc_index": 1298,
                    "doc_price": 130
                }
            }
        ]
    }
}
```

The following search request is configured with `from: 6`, `size: 5`, and `pagination_depth: 10`. The `pagination_depth` remains unchanged to ensure that pagination is based on the same set of search results:

```json
GET /my-nlp-index/_search?search_pipeline=nlp-search-pipeline
{
  "size":5,      
  "from":6,      
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

The response excludes the first five entries and displays the remaining results:

```json
{
    "hits": {
        "total": {
            "value": 6,
            "relation": "eq"
        },
        "max_score": 0.5,
        "hits": [
            {
                "_index": "index-test",
                "_id": "fneXlZQBJkWerFzHv4eW",
                "_score": 5.0E-4,
                "_source": {
                    "category": "editor",
                    "doc_keyword": "bubble",
                    "doc_index": 521,
                    "doc_price": 75
                }
            }
        ]
    }
}
```

