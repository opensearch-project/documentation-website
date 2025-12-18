---
layout: default
title: Using sorting with a hybrid query
parent: Hybrid search
grand_parent: AI search
has_children: false
nav_order: 10
canonical_url: https://docs.opensearch.org/latest/vector-search/ai-search/hybrid-search/sorting/
---

# Using sorting with a hybrid query
**Introduced 2.16**
{: .label .label-purple }

By default, hybrid search returns results ordered by scores in descending order. You can apply sorting to hybrid query results by providing the `sort` criteria in the search request. For more information about sort criteria, see [Sort results]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/sort/).
When sorting is applied to a hybrid search, results are fetched from the shards based on the specified sort criteria. As a result, the search results are sorted accordingly, and the document scores are `null`. Scores are only present in the hybrid search sorting results if documents are sorted by `_score`. 

In the following example, sorting is applied by `doc_price` in the hybrid query search request:

```json
GET /my-nlp-index/_search?search_pipeline=nlp-search-pipeline
{
  "query": {
    "hybrid": {
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
  }, 
    "sort":[
       {
         "doc_price": {
             "order": "desc"
         }
       }
    ]
}
```
{% include copy-curl.html %}

The response contains the matching documents sorted by `doc_price` in descending order:

```json
{
    "took": 35,
    "timed_out": false,
    "_shards": {
        "total": 3,
        "successful": 3,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 4,
            "relation": "eq"
        },
        "max_score": 0.5,
        "hits": [
            {
                "_index": "my-nlp-index",
                "_id": "7yaM4JABZkI1FQv8AwoN",
                "_score": null,
                "_source": {
                    "category": "statement",
                    "doc_keyword": "entire",
                    "doc_index": 8242,
                    "doc_price": 350
                },
                "sort": [
                    350
                ]
            },
            {
                "_index": "my-nlp-index",
                "_id": "8CaM4JABZkI1FQv8AwoN",
                "_score": null,
                "_source": {
                    "category": "statement",
                    "doc_keyword": "idea",
                    "doc_index": 5212,
                    "doc_price": 200
                },
                "sort": [
                    200
                ]
            },
            {
                "_index": "my-nlp-index",
                "_id": "6yaM4JABZkI1FQv8AwoM",
                "_score": null,
                "_source": {
                    "category": "permission",
                    "doc_keyword": "workable",
                    "doc_index": 4976,
                    "doc_price": 100
                },
                "sort": [
                    100
                ]
            },
            {
                "_index": "my-nlp-index",
                "_id": "7iaM4JABZkI1FQv8AwoN",
                "_score": null,
                "_source": {
                    "category": "editor",
                    "doc_index": 9871,
                    "doc_price": 30
                },
                "sort": [
                    30
                ]
            }
        ]
    }
}
```

In the following example, sorting is applied by `_id`:

```json
GET /my-nlp-index/_search?search_pipeline=nlp-search-pipeline
{
  "query": {
    "hybrid": {
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
  },
  "sort":[
     {
        "_id": {
          "order": "desc"   
        }
     } 
  ]
}
```
{% include copy-curl.html %}

The response contains the matching documents sorted by `_id` in descending order:

```json
{
    "took": 33,
    "timed_out": false,
    "_shards": {
        "total": 3,
        "successful": 3,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 4,
            "relation": "eq"
        },
        "max_score": 0.5,
        "hits": [
            {
                "_index": "my-nlp-index",
                "_id": "8CaM4JABZkI1FQv8AwoN",
                "_score": null,
                "_source": {
                    "category": "statement",
                    "doc_keyword": "idea",
                    "doc_index": 5212,
                    "doc_price": 200
                },
                "sort": [
                    "8CaM4JABZkI1FQv8AwoN"
                ]
            },
            {
                "_index": "my-nlp-index",
                "_id": "7yaM4JABZkI1FQv8AwoN",
                "_score": null,
                "_source": {
                    "category": "statement",
                    "doc_keyword": "entire",
                    "doc_index": 8242,
                    "doc_price": 350
                },
                "sort": [
                    "7yaM4JABZkI1FQv8AwoN"
                ]
            },
            {
                "_index": "my-nlp-index",
                "_id": "7iaM4JABZkI1FQv8AwoN",
                "_score": null,
                "_source": {
                    "category": "editor",
                    "doc_index": 9871,
                    "doc_price": 30
                },
                "sort": [
                    "7iaM4JABZkI1FQv8AwoN"
                ]
            },
            {
                "_index": "my-nlp-index",
                "_id": "6yaM4JABZkI1FQv8AwoM",
                "_score": null,
                "_source": {
                    "category": "permission",
                    "doc_keyword": "workable",
                    "doc_index": 4976,
                    "doc_price": 100
                },
                "sort": [
                    "6yaM4JABZkI1FQv8AwoM"
                ]
            }
        ]
    }
}
```
