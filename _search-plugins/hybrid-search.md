---
layout: default
title: Hybrid search
has_children: false
nav_order: 60
canonical_url: https://docs.opensearch.org/latest/search-plugins/hybrid-search/
---

# Hybrid search
Introduced 2.11
{: .label .label-purple }

Hybrid search combines keyword and neural search to improve search relevance. To implement hybrid search, you need to set up a [search pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/index/) that runs at search time. The search pipeline you'll configure intercepts search results at an intermediate stage and applies the [`normalization_processor`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/normalization-processor/) to them. The `normalization_processor` normalizes and combines the document scores from multiple query clauses, rescoring the documents according to the chosen normalization and combination techniques. 

**PREREQUISITE**<br>
Before using hybrid search, you must set up a text embedding model. For more information, see [Choosing a model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/integrating-ml-models/#choosing-a-model).
{: .note}

## Using hybrid search

To use hybrid search, follow these steps:

1. [Create an ingest pipeline](#step-1-create-an-ingest-pipeline).
1. [Create an index for ingestion](#step-2-create-an-index-for-ingestion).
1. [Ingest documents into the index](#step-3-ingest-documents-into-the-index).
1. [Configure a search pipeline](#step-4-configure-a-search-pipeline).
1. [Search the index using hybrid search](#step-5-search-the-index-using-hybrid-search).

## Step 1: Create an ingest pipeline

To generate vector embeddings, you need to create an [ingest pipeline]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/index/) that contains a [`text_embedding` processor]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/processors/text-embedding/), which will convert the text in a document field to vector embeddings. The processor's `field_map` determines the input fields from which to generate vector embeddings and the output fields in which to store the embeddings.

The following example request creates an ingest pipeline that converts the text from `passage_text` to text embeddings and stores the embeddings in `passage_embedding`:

```json
PUT /_ingest/pipeline/nlp-ingest-pipeline
{
  "description": "A text embedding pipeline",
  "processors": [
    {
      "text_embedding": {
        "model_id": "bQ1J8ooBpBj3wT4HVUsb",
        "field_map": {
          "passage_text": "passage_embedding"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Step 2: Create an index for ingestion

In order to use the text embedding processor defined in your pipeline, create a k-NN index, adding the pipeline created in the previous step as the default pipeline. Ensure that the fields defined in the `field_map` are mapped as correct types. Continuing with the example, the `passage_embedding` field must be mapped as a k-NN vector with a dimension that matches the model dimension. Similarly, the `passage_text` field should be mapped as `text`.

The following example request creates a k-NN index that is set up with a default ingest pipeline:

```json
PUT /my-nlp-index
{
  "settings": {
    "index.knn": true,
    "default_pipeline": "nlp-ingest-pipeline"
  },
  "mappings": {
    "properties": {
      "id": {
        "type": "text"
      },
      "passage_embedding": {
        "type": "knn_vector",
        "dimension": 768,
        "method": {
          "engine": "lucene",
          "space_type": "l2",
          "name": "hnsw",
          "parameters": {}
        }
      },
      "passage_text": {
        "type": "text"
      }
    }
  }
}
```
{% include copy-curl.html %}

For more information about creating a k-NN index and using supported methods, see [k-NN index]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index/).

## Step 3: Ingest documents into the index

To ingest documents into the index created in the previous step, send the following requests:

```json
PUT /my-nlp-index/_doc/1
{
  "passage_text": "Hello world",
  "id": "s1"
}
```
{% include copy-curl.html %}

```json
PUT /my-nlp-index/_doc/2
{
  "passage_text": "Hi planet",
  "id": "s2"
}
```
{% include copy-curl.html %}

Before the document is ingested into the index, the ingest pipeline runs the `text_embedding` processor on the document, generating text embeddings for the `passage_text` field. The indexed document includes the `passage_text` field, which contains the original text, and the `passage_embedding` field, which contains the vector embeddings. 

## Step 4: Configure a search pipeline

To configure a search pipeline with a [`normalization-processor`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/normalization-processor/), use the following request. The normalization technique in the processor is set to `min_max`, and the combination technique is set to `arithmetic_mean`. The `weights` array specifies the weights assigned to each query clause as decimal percentages:

```json
PUT /_search/pipeline/nlp-search-pipeline
{
  "description": "Post processor for hybrid search",
  "phase_results_processors": [
    {
      "normalization-processor": {
        "normalization": {
          "technique": "min_max"
        },
        "combination": {
          "technique": "arithmetic_mean",
          "parameters": {
            "weights": [
              0.3,
              0.7
            ]
          }
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Step 5: Search the index using hybrid search

To perform hybrid search on your index, use the [`hybrid` query]({{site.url}}{{site.baseurl}}/query-dsl/compound/hybrid/), which combines the results of keyword and semantic search.

#### Example: Combining a neural query and a match query

The following example request combines two query clauses---a `neural` query and a `match` query. It specifies the search pipeline created in the previous step as a query parameter:

```json
GET /my-nlp-index/_search?search_pipeline=nlp-search-pipeline
{
  "_source": {
    "exclude": [
      "passage_embedding"
    ]
  },
  "query": {
    "hybrid": {
      "queries": [
        {
          "match": {
            "passage_text": {
              "query": "Hi world"
            }
          }
        },
        {
          "neural": {
            "passage_embedding": {
              "query_text": "Hi world",
              "model_id": "aVeif4oB5Vm0Tdw8zYO2",
              "k": 5
            }
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

Alternatively, you can set a default search pipeline for the `my-nlp-index` index. For more information, see [Default search pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/using-search-pipeline/#default-search-pipeline).

The response contains the matching document:

```json
{
  "took" : 36,
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
    "max_score" : 1.2251667,
    "hits" : [
      {
        "_index" : "my-nlp-index",
        "_id" : "1",
        "_score" : 1.2251667,
        "_source" : {
          "passage_text" : "Hello world",
          "id" : "s1"
        }
      }
    ]
  }
}
```
{% include copy-curl.html %}

#### Example: Combining a match query and a term query

The following example request combines two query clauses---a `match` query and a `term` query. It specifies the search pipeline created in the previous step as a query parameter:

```json
GET /my-nlp-index/_search?search_pipeline=nlp-search-pipeline
{
  "_source": {
    "exclude": [
      "passage_embedding"
    ]
  },
  "query": {
    "hybrid": {
      "queries": [
           {
             "match":{
                 "passage_text": "hello"
              }
           },
           {
             "term":{
              "passage_text":{
                 "value":"planet"
              }
             }
           }
      ]
    }
  }
}
```
{% include copy-curl.html %}

The response contains the matching documents:

```json
{
    "took": 11,
    "timed_out": false,
    "_shards": {
        "total": 2,
        "successful": 2,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 2,
            "relation": "eq"
        },
        "max_score": 0.7,
        "hits": [
            {
                "_index": "my-nlp-index",
                "_id": "2",
                "_score": 0.7,
                "_source": {
                    "id": "s2",
                    "passage_text": "Hi planet"
                }
            },
            {
                "_index": "my-nlp-index",
                "_id": "1",
                "_score": 0.3,
                "_source": {
                    "id": "s1",
                    "passage_text": "Hello world"
                }
            }
        ]
    }
}
```
{% include copy-curl.html %}

## Hybrid search with post-filtering
**Introduced 2.13**
{: .label .label-purple }

You can perform post-filtering on hybrid search results by providing the `post_filter` parameter in your query.

The `post_filter` clause is applied after the search results have been retrieved. Post-filtering is useful for applying additional filters to the search results without impacting the scoring or the order of the results. 

Post-filtering does not impact document relevance scores or aggregation results.
{: .note}

#### Example: Post-filtering

The following example request combines two query clauses---a `term` query and a `match` query. This is the same query as in the [preceding example](#example-combining-a-match-query-and-a-term-query), but it contains a `post_filter`:

```json
GET /my-nlp-index/_search?search_pipeline=nlp-search-pipeline
{
  "query": {
    "hybrid":{
      "queries":[
        {
          "match":{
            "passage_text": "hello"
          }
        },
        {
          "term":{
            "passage_text":{
              "value":"planet"
            }
          }
        }
      ]
    }

  },
  "post_filter":{
    "match": { "passage_text": "world" }
  }
}

```
{% include copy-curl.html %}

Compare the results to the results without post-filtering in the [preceding example](#example-combining-a-match-query-and-a-term-query). Unlike the preceding example response, which contains two documents, the response in this example contains one document because the second document is filtered using post-filtering:

```json
{
  "took": 18,
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
    "max_score": 0.3,
    "hits": [
      {
        "_index": "my-nlp-index",
        "_id": "1",
        "_score": 0.3,
        "_source": {
          "id": "s1",
          "passage_text": "Hello world"
        }
      }
    ]
  }
}
```


## Combining hybrid search and aggregations
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