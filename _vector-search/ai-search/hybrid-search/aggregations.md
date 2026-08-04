---
layout: default
title: Combining hybrid search and aggregations
parent: Hybrid search
grand_parent: AI search
has_children: false
nav_order: 50
canonical_url: https://docs.opensearch.org/latest/vector-search/ai-search/hybrid-search/aggregations/
---

# Combining hybrid search and aggregations
**Introduced 2.13**
{: .label .label-purple }

You can enhance search results by combining a hybrid query clause with any aggregation that OpenSearch supports. Aggregations allow you to use OpenSearch as an analytics engine. For more information about aggregations, see [Aggregations]({{site.url}}{{site.baseurl}}/aggregations/).

Most aggregations are performed on the subset of documents that is returned by a hybrid query. The only aggregation that operates on all documents is the [`global`]({{site.url}}{{site.baseurl}}/aggregations/bucket/global/) aggregation.

To use aggregations with a hybrid query, first create an index. Aggregations are typically used on fields of special types, like `keyword` or `integer`. The following example creates an index with several such fields:

```json
PUT /my-nlp-index
{
  "settings": {
    "number_of_shards": 2
  },
  "mappings": {
    "properties": {
      "doc_index": {
        "type": "integer"
      },
      "doc_keyword": {
        "type": "keyword"
      },
      "category": {
        "type": "keyword"
      }
    }
  }
}
```
{% include copy-curl.html %}

The following request ingests six documents into your new index:

```json
POST /_bulk
{ "index": { "_index": "my-nlp-index" } }
{ "category": "permission", "doc_keyword": "workable", "doc_index": 4976, "doc_price": 100}
{ "index": { "_index": "my-nlp-index" } }
{ "category": "sister", "doc_keyword": "angry", "doc_index": 2231, "doc_price": 200 }
{ "index": { "_index": "my-nlp-index" } }
{ "category": "hair", "doc_keyword": "likeable", "doc_price": 25 }
{ "index": { "_index": "my-nlp-index" } }
{ "category": "editor", "doc_index": 9871, "doc_price": 30 }
{ "index": { "_index": "my-nlp-index" } }
{ "category": "statement", "doc_keyword": "entire", "doc_index": 8242, "doc_price": 350  } 
{ "index": { "_index": "my-nlp-index" } }
{ "category": "statement", "doc_keyword": "idea", "doc_index": 5212, "doc_price": 200  } 
{ "index": { "_index": "index-test" } }
{ "category": "editor", "doc_keyword": "bubble", "doc_index": 1298, "doc_price": 130 } 
{ "index": { "_index": "index-test" } }
{ "category": "editor", "doc_keyword": "bubble", "doc_index": 521, "doc_price": 75  } 
```
{% include copy-curl.html %}

Now you can combine a hybrid query clause with a `min` aggregation:

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
  "aggs": {
    "total_price": {
      "sum": {
        "field": "doc_price"
      }
    },
    "keywords": {
      "terms": {
        "field": "doc_keyword",
        "size": 10
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the matching documents and the aggregation results: 

```json
{
  "took": 9,
  "timed_out": false,
  "_shards": {
    "total": 2,
    "successful": 2,
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
        "_id": "mHRPNY4BlN82W_Ar9UMY",
        "_score": 0.5,
        "_source": {
          "doc_price": 100,
          "doc_index": 4976,
          "doc_keyword": "workable",
          "category": "permission"
        }
      },
      {
        "_index": "my-nlp-index",
        "_id": "m3RPNY4BlN82W_Ar9UMY",
        "_score": 0.5,
        "_source": {
          "doc_price": 30,
          "doc_index": 9871,
          "category": "editor"
        }
      },
      {
        "_index": "my-nlp-index",
        "_id": "nXRPNY4BlN82W_Ar9UMY",
        "_score": 0.5,
        "_source": {
          "doc_price": 200,
          "doc_index": 5212,
          "doc_keyword": "idea",
          "category": "statement"
        }
      },
      {
        "_index": "my-nlp-index",
        "_id": "nHRPNY4BlN82W_Ar9UMY",
        "_score": 0.5,
        "_source": {
          "doc_price": 350,
          "doc_index": 8242,
          "doc_keyword": "entire",
          "category": "statement"
        }
      }
    ]
  },
  "aggregations": {
    "total_price": {
      "value": 680
    },
    "doc_keywords": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "entire",
          "doc_count": 1
        },
        {
          "key": "idea",
          "doc_count": 1
        },
        {
          "key": "workable",
          "doc_count": 1
        }
      ]
    }
  }
}
```