---
layout: default
title: Hybrid search with search_after
parent: Hybrid search
grand_parent: AI search
has_children: false
nav_order: 30
---

# Hybrid search with search_after
**Introduced 2.16**
{: .label .label-purple }

You can control sorting results by applying a `search_after` condition that provides a live cursor and uses the previous page's results to obtain the next page's results. For more information about `search_after`, see [The search_after parameter]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/paginate/#the-search_after-parameter).

You can paginate the sorted results by applying a `search_after` condition in the sort queries.

In the following example, sorting is applied by `doc_price` with a `search_after` condition:

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
  ],
  "search_after":[200]
}
```
{% include copy-curl.html %}

The response contains the matching documents that are listed after the `200` sort value, sorted by `doc_price` in descending order:

```json
{
    "took": 8,
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

In the following example, sorting is applied by `id` with a `search_after` condition:

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
  ],
  "search_after":["7yaM4JABZkI1FQv8AwoN"]
}
```
{% include copy-curl.html %}

The response contains the matching documents that are listed after the `7yaM4JABZkI1FQv8AwoN` sort value, sorted by `id` in descending order:

```json
{
    "took": 17,
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