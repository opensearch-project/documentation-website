---
layout: default
title: Hybrid search
parent: ML-powered search
has_children: false
nav_order: 60
redirect_from:
   - /search-plugins/hybrid-search/
---

# Hybrid search
Introduced 2.11
{: .label .label-purple }

Hybrid search combines keyword and semantic search to improve search relevance. To implement hybrid search, you need to set up a [search pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/index/) that runs at search time. The search pipeline intercepts search results at an intermediate stage and applies processing to normalize and combine document scores.  

There are two types of processors available for hybrid search:  

- [Normalization processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/normalization-processor/) (Introduced 2.10): A score-based processor that normalizes and combines document scores from multiple query clauses, rescoring the documents using the selected normalization and combination techniques.  
- [Score ranker processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/score-ranker-processor/) (Introduced 2.19): A rank-based processor that uses rank fusion to combine and rerank documents from multiple query clauses.

**PREREQUISITE**<br>
To follow this example, you must set up a text embedding model. For more information, see [Choosing a model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/integrating-ml-models/#choosing-a-model). If you have already generated text embeddings, ingest the embeddings into an index and skip to [Step 4](#step-4-configure-a-search-pipeline).
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

In order to use the text embedding processor defined in your pipeline, create a vector index, adding the pipeline created in the previous step as the default pipeline. Ensure that the fields defined in the `field_map` are mapped as correct types. Continuing with the example, the `passage_embedding` field must be mapped as a k-NN vector with a dimension that matches the model dimension. Similarly, the `passage_text` field should be mapped as `text`.

The following example request creates a vector index that is set up with a default ingest pipeline:

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

For more information about creating a vector index and using supported methods, see [Creating a vector index]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index/).

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

## Using sorting with a hybrid query
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

## Hybrid search with search_after
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
        "_id": {
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

## Explain
**Introduced 2.19**
{: .label .label-purple }

You can provide the `explain` parameter to understand how scores are calculated, normalized, and combined in hybrid queries. When enabled, it provides detailed information about the scoring process for each search result. This includes revealing the score normalization techniques used, how different scores were combined, and the calculations for individual subquery scores. This comprehensive insight makes it easier to understand and optimize your hybrid query results. For more information about `explain`, see [Explain API]({{site.url}}{{site.baseurl}}/api-reference/explain/). 

`explain` is an expensive operation in terms of both resources and time. For production clusters, we recommend using it sparingly for the purpose of troubleshooting.
{: .warning }

You can provide the `explain` parameter in a URL when running a complete hybrid query using the following syntax:

```json
GET <index>/_search?search_pipeline=<search_pipeline>&explain=true
POST <index>/_search?search_pipeline=<search_pipeline>&explain=true
```

To use the `explain` parameter, you must configure the `hybrid_score_explanation` response processor in your search pipeline. For more information, see [Hybrid score explanation processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/explanation-processor/). 

You can also use `explain` with the individual document ID:

```json
GET <index>/_explain/<id>
POST <index>/_explain/<id>
```

In this case, the result will contain only low-level scoring information, for example, [Okapi BM25](https://en.wikipedia.org/wiki/Okapi_BM25) scores for text-based queries such as `term` or `match`. For an example response, see [Explain API example response]({{site.url}}{{site.baseurl}}/api-reference/explain/#example-response).

To see the `explain` output for all results, set the parameter to `true` either in the URL or in the request body:

```json
POST my-nlp-index/_search?search_pipeline=my_pipeline&explain=true
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
            "text": {
              "query": "horse"
            }
          }
        },
        {
          "neural": {
            "passage_embedding": {
              "query_text": "wild west",
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

The response contains scoring information:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
    "took": 54,
    "timed_out": false,
    "_shards": {
        "total": 2,
        "successful": 2,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 5,
            "relation": "eq"
        },
        "max_score": 0.9251075,
        "hits": [
            {
                "_shard": "[my-nlp-index][0]",
                "_node": "IsuzeVYdSqKUfy0qfqil2w",
                "_index": "my-nlp-index",
                "_id": "5",
                "_score": 0.9251075,
                "_source": {
                    "text": "A rodeo cowboy , wearing a cowboy hat , is being thrown off of a wild white horse .",
                    "id": "2691147709.jpg"
                },
                "_explanation": {
                    "value": 0.9251075,
                    "description": "arithmetic_mean combination of:",
                    "details": [
                        {
                            "value": 1.0,
                            "description": "min_max normalization of:",
                            "details": [
                                {
                                    "value": 1.2336599,
                                    "description": "weight(text:horse in 0) [PerFieldSimilarity], result of:",
                                    "details": [
                                        {
                                            "value": 1.2336599,
                                            "description": "score(freq=1.0), computed as boost * idf * tf from:",
                                            "details": [
                                                {
                                                    "value": 2.2,
                                                    "description": "boost",
                                                    "details": []
                                                },
                                                {
                                                    "value": 1.2039728,
                                                    "description": "idf, computed as log(1 + (N - n + 0.5) / (n + 0.5)) from:",
                                                    "details": [
                                                        {
                                                            "value": 1,
                                                            "description": "n, number of documents containing term",
                                                            "details": []
                                                        },
                                                        {
                                                            "value": 4,
                                                            "description": "N, total number of documents with field",
                                                            "details": []
                                                        }
                                                    ]
                                                },
                                                {
                                                    "value": 0.46575344,
                                                    "description": "tf, computed as freq / (freq + k1 * (1 - b + b * dl / avgdl)) from:",
                                                    "details": [
                                                        {
                                                            "value": 1.0,
                                                            "description": "freq, occurrences of term within document",
                                                            "details": []
                                                        },
                                                        {
                                                            "value": 1.2,
                                                            "description": "k1, term saturation parameter",
                                                            "details": []
                                                        },
                                                        {
                                                            "value": 0.75,
                                                            "description": "b, length normalization parameter",
                                                            "details": []
                                                        },
                                                        {
                                                            "value": 16.0,
                                                            "description": "dl, length of field",
                                                            "details": []
                                                        },
                                                        {
                                                            "value": 17.0,
                                                            "description": "avgdl, average length of field",
                                                            "details": []
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "value": 0.8503647,
                            "description": "min_max normalization of:",
                            "details": [
                                {
                                    "value": 0.015177966,
                                    "description": "within top 5",
                                    "details": []
                                }
                            ]
                        }
                    ]
...
```
</details>

### Response body fields

Field | Description
:--- | :---
`explanation` | The `explanation` object has three properties: `value`, `description`, and `details`. The `value` property shows the result of the calculation, `description` explains what type of calculation was performed, and `details` shows any subcalculations performed. For score normalization, the information in the `description` property includes the technique used for normalization or combination and the corresponding score. 

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

## Next steps

- Explore our [tutorials]({{site.url}}{{site.baseurl}}/vector-search/getting-started/tutorials/) to learn how to build ML-powered search applications. 