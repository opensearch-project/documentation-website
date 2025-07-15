---
layout: default
title: Hybrid search
parent: AI search
has_children: true
nav_order: 40
redirect_from:
   - /search-plugins/hybrid-search/
   - /vector-search/ai-search/hybrid-search/
---

# Hybrid search
Introduced 2.11
{: .label .label-purple }

Hybrid search combines keyword and semantic search to improve search relevance. To implement hybrid search, you need to set up a [search pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/index/) that runs at search time. The search pipeline intercepts search results at an intermediate stage and applies processing to normalize and combine document scores.  

There are two types of processors available for hybrid search:  

- [Normalization processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/normalization-processor/) (Introduced 2.10): A score-based processor that normalizes and combines document scores from multiple query clauses, rescoring the documents using the selected normalization and combination techniques.  
- [Score ranker processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/score-ranker-processor/) (Introduced 2.19): A rank-based processor that uses rank fusion to combine and rerank documents from multiple query clauses.

**PREREQUISITE**<br>
To follow this example, you must set up a text embedding model. For more information, see [Choosing a model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/integrating-ml-models/#choosing-a-model). If you have already generated text embeddings, skip to [Step 3](#step-3-configure-a-search-pipeline).
{: .note}

## Configuring hybrid search

There are two ways to configure hybrid search:

- [**Automated workflow**](#automated-workflow) (Recommended for quick setup): Automatically create an ingest pipeline, an index, and a search pipeline with minimal configuration.
- [**Manual setup**](#manual-setup) (Recommended for custom configurations): Manually configure each component for greater flexibility and control.

## Automated workflow

OpenSearch provides a [workflow template]({{site.url}}{{site.baseurl}}/automating-configurations/workflow-templates/#hybrid-search) that automatically creates an ingest pipeline, an index, and a search pipeline. You must provide the model ID for the configured model when creating a workflow. Review the hybrid search workflow template [defaults](https://github.com/opensearch-project/flow-framework/blob/main/src/main/resources/defaults/hybrid-search-defaults.json) to determine whether you need to update any of the parameters. For example, if the model dimensionality is different from the default (`1024`), specify the dimensionality of your model in the `output_dimension` parameter. To create the default hybrid search workflow, send the following request:

```json
POST /_plugins/_flow_framework/workflow?use_case=hybrid_search&provision=true
{
"create_ingest_pipeline.model_id": "mBGzipQB2gmRjlv_dOoB"
}
```
{% include copy-curl.html %}

OpenSearch responds with a workflow ID for the created workflow:

```json
{
  "workflow_id" : "U_nMXJUBq_4FYQzMOS4B"
}
```

To check the workflow status, send the following request:

```json
GET /_plugins/_flow_framework/workflow/U_nMXJUBq_4FYQzMOS4B/_status
```
{% include copy-curl.html %}

Once the workflow completes, the `state` changes to `COMPLETED`. The workflow creates the following components:

- An ingest pipeline named `nlp-ingest-pipeline`
- An index named `my-nlp-index` 
- A search pipeline named `nlp-search-pipeline`

You can now continue with [steps 4 and 5](#step-4-ingest-documents-into-the-index) to ingest documents into the index and search the index.

## Manual setup

To manually configure hybrid search, follow these steps:

1. [Create an ingest pipeline](#step-1-create-an-ingest-pipeline).
1. [Create an index for ingestion](#step-2-create-an-index-for-ingestion).
1. [Configure a search pipeline](#step-3-configure-a-search-pipeline).
1. [Ingest documents into the index](#step-4-ingest-documents-into-the-index).
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


## Step 3: Configure a search pipeline

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

## Step 4: Ingest documents into the index

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

## Next steps

- Explore our [tutorials]({{site.url}}{{site.baseurl}}/vector-search/tutorials/) to learn how to build AI search applications. 