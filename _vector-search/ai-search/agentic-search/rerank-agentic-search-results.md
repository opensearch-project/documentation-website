---
layout: default
title: Reranking agentic search results
parent: Agentic search
grand_parent: AI search
nav_order: 105
has_children: false
---

# Reranking agentic search results

Agentic search requests are processed by the [`agentic_query_translator` search request processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/agentic-query-translator-processor/), which intercepts the given query text and passes it to the configured agent in order to generate and execute an OpenSearch DSL query. To further adjust relevance scores, search results can also be reranked using the [`rerank` search response processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/rerank-processor/).

## Prerequisite

Before using agentic search, you must configure an agent with the [`QueryPlanningTool`]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/tools/query-planning-tool/).

## Step 1: Create an index for ingestion

Create an index for ingestion:

```json
PUT /iris-index
{
  "mappings": {
    "properties": {
      "petal_length_in_cm": {
        "type": "float"
      },
      "petal_width_in_cm": {
        "type": "float"
      },
      "sepal_length_in_cm": {
        "type": "float"
      },
      "sepal_width_in_cm": {
        "type": "float"
      },
      "species": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword",
            "ignore_above": 256
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Step 2: Ingest documents into the index

To ingest documents into the index created in the previous step, send the following request:

```json
POST _bulk
{ "index": { "_index": "iris-index", "_id": "1" } }
{ "petal_length_in_cm": 1.4, "petal_width_in_cm": 0.2, "sepal_length_in_cm": 5.1, "sepal_width_in_cm": 3.5, "species": "setosa" }
{ "index": { "_index": "iris-index", "_id": "2" } }
{ "petal_length_in_cm": 1.4, "petal_width_in_cm": 0.2, "sepal_length_in_cm": 4.9, "sepal_width_in_cm": 3.0, "species": "setosa" }
{ "index": { "_index": "iris-index", "_id": "3" } }
{ "petal_length_in_cm": 1.3, "petal_width_in_cm": 0.2, "sepal_length_in_cm": 4.7, "sepal_width_in_cm": 3.2, "species": "setosa" }
{ "index": { "_index": "iris-index", "_id": "4" } }
{ "petal_length_in_cm": 1.5, "petal_width_in_cm": 0.2, "sepal_length_in_cm": 4.6, "sepal_width_in_cm": 3.1, "species": "setosa" }
{ "index": { "_index": "iris-index", "_id": "5" } }
{ "petal_length_in_cm": 1.4, "petal_width_in_cm": 0.2, "sepal_length_in_cm": 5.0, "sepal_width_in_cm": 3.6, "species": "setosa" }
{ "index": { "_index": "iris-index", "_id": "6" } }
{ "petal_length_in_cm": 6.6, "petal_width_in_cm": 2.1, "sepal_length_in_cm": 7.6, "sepal_width_in_cm": 3.0, "species": "virginica" }
{ "index": { "_index": "iris-index", "_id": "7" } }
{ "petal_length_in_cm": 4.5, "petal_width_in_cm": 1.7, "sepal_length_in_cm": 4.9, "sepal_width_in_cm": 2.5, "species": "virginica" }
{ "index": { "_index": "iris-index", "_id": "8" } }
{ "petal_length_in_cm": 6.3, "petal_width_in_cm": 1.8, "sepal_length_in_cm": 7.3, "sepal_width_in_cm": 2.9, "species": "virginica" }
{ "index": { "_index": "iris-index", "_id": "9" } }
{ "petal_length_in_cm": 5.8, "petal_width_in_cm": 1.8, "sepal_length_in_cm": 6.7, "sepal_width_in_cm": 2.5, "species": "virginica" }
{ "index": { "_index": "iris-index", "_id": "10" } }
{ "petal_length_in_cm": 6.1, "petal_width_in_cm": 2.5, "sepal_length_in_cm": 7.2, "sepal_width_in_cm": 3.6, "species": "virginica" }
```
{% include copy-curl.html %}

## Step 3: Register a model and an agent

Follow these steps to register a model and an agent:

1. [Create a model for the agent and QueryPlanningTool]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/#step-3-create-a-model-for-the-agent-and-queryplanningtool).
2. [Create an agent]({{site.url}}{{site.baseurl}}/vector-search/ai-search/agentic-search/#step-4-create-an-agent).

## Step 4: Create a search pipeline

Create a search pipeline that uses your agent and a `rerank` response processor. This example uses a `by_field` rerank processor that reranks documents based on the `petal_length_in_cm` field.

### Step 4(a): Configure a by_field rerank processor

Create an agentic search pipeline containing a `by_field` rerank processor:

```json
PUT _search/pipeline/agentic-pipeline
{
  "request_processors": [
    {
      "agentic_query_translator": {
        "agent_id": "your-agent-id-from-step-3"
      }
    }
  ],
  "response_processors": [
    {
      "rerank": {
        "by_field": {
          "target_field": "petal_length_in_cm",
          "keep_previous_score": true
        }
      }
    },
    {
      "agentic_context": {
        "dsl_query": true
      }
    }
  ]
}
```
{% include copy-curl.html %}

Alternatively, you can use an `ml_opensearch` rerank processor to apply OpenSearch-provided [cross-encoder models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/#cross-encoder-models) to rerank results.

### Step 4(b): Configure an ml_opensearch rerank processor

Register an `ms-marco-MiniLM-L-6-v2` cross-encoder model:

```json
POST _plugins/_ml/models/_register?deploy=true
{
  "name": "huggingface/cross-encoders/ms-marco-MiniLM-L-6-v2",
  "version": "1.0.2",
  "model_format": "TORCH_SCRIPT"
}
```
{% include copy-curl.html %}

Then configure an `ml_opensearch` rerank processor by providing the model ID returned in the response. You can configure the rerank processor for any text field in your index. In this example, you'll use the `species` field: 

```json
POST _search/pipeline/agentic-pipeline
{
  "request_processors": [
    {
      "agentic_query_translator": {
        "agent_id": "your-agent-id-from-step-3"
      }
    }
  ],
  "response_processors": [
    {
      "rerank": {
        "ml_opensearch": {
          "model_id": "your-cross-encoder-model-id",
          "keep_previous_score": true
        },
        "context": {
          "document_fields": [
            "species"
          ]
        }
      }
    },
    {
      "agentic_context": {
        "dsl_query": true
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Step 5: Test a question

Test your reranking agentic search pipeline by asking a question.

### Step 5(a): Test the by_field rerank processor

To test the `by_field` rerank processor, send the following request:

```json
POST /iris-index/_search?search_pipeline=agentic-pipeline
{
  "query": {
    "agentic": {
      "query_text": "Show me virginica flowers"
    }
  }
}
```
{% include copy-curl.html %}

The generated DSL query shows that the agent opted to use a basic `term` query on the `species` field of the `iris-index`. The query returns all documents matching the given term. In the response, each document includes two scores: `previous_score` (the original relevance score) and `_score` (the updated score after reranking). The documents are ranked by petal length in descending order: 

```json
{
  "took": 3402,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 5,
      "relation": "eq"
    },
    "max_score": 6.6,
    "hits": [
      {
        "_index": "iris-index",
        "_id": "6",
        "_score": 6.6,
        "_source": {
          "sepal_width_in_cm": 3.0,
          "species": "virginica",
          "previous_score": 1.0,
          "sepal_length_in_cm": 7.6,
          "petal_width_in_cm": 2.1,
          "petal_length_in_cm": 6.6
        }
      },
      {
        "_index": "iris-index",
        "_id": "8",
        "_score": 6.3,
        "_source": {
          "sepal_width_in_cm": 2.9,
          "species": "virginica",
          "previous_score": 1.0,
          "sepal_length_in_cm": 7.3,
          "petal_width_in_cm": 1.8,
          "petal_length_in_cm": 6.3
        }
      },
      {
        "_index": "iris-index",
        "_id": "10",
        "_score": 6.1,
        "_source": {
          "sepal_width_in_cm": 3.6,
          "species": "virginica",
          "previous_score": 1.0,
          "sepal_length_in_cm": 7.2,
          "petal_width_in_cm": 2.5,
          "petal_length_in_cm": 6.1
        }
      },
      {
        "_index": "iris-index",
        "_id": "9",
        "_score": 5.8,
        "_source": {
          "sepal_width_in_cm": 2.5,
          "species": "virginica",
          "previous_score": 1.0,
          "sepal_length_in_cm": 6.7,
          "petal_width_in_cm": 1.8,
          "petal_length_in_cm": 5.8
        }
      },
      {
        "_index": "iris-index",
        "_id": "7",
        "_score": 4.5,
        "_source": {
          "sepal_width_in_cm": 2.5,
          "species": "virginica",
          "previous_score": 1.0,
          "sepal_length_in_cm": 4.9,
          "petal_width_in_cm": 1.7,
          "petal_length_in_cm": 4.5
        }
      }
    ]
  },
  "ext": {
    "dsl_query": "{\"query\":{\"term\":{\"species.keyword\":\"virginica\"}}}"
  }
}
```

### Step 5(b): Test the ml_opensearch rerank processor

To test the `ml_opensearch` rerank processor, send the following request:

```json
POST /iris-index/_search?search_pipeline=agentic-pipeline
{
  "query": {
    "agentic": {
      "query_text": "Show me virginica flowers"
    }
  },
  "ext": {
    "rerank": {
      "query_context": {
        "query_text": "Show me virginica flowers"
      }
    }
  }
}
```
{% include copy-curl.html %}

The model receives both the query text and the document text and generates a new relevance score based on both:

```json
{
  "took": 2667,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 5,
      "relation": "eq"
    },
    "max_score": 0.65176475,
    "hits": [
      {
        "_index": "iris-index",
        "_id": "9",
        "_score": 0.65176475,
        "_source": {
          "petal_length_in_cm": 5.8,
          "petal_width_in_cm": 1.8,
          "sepal_length_in_cm": 6.7,
          "sepal_width_in_cm": 2.5,
          "species": "virginica"
        }
      },
      {
        "_index": "iris-index",
        "_id": "7",
        "_score": 0.65176475,
        "_source": {
          "petal_length_in_cm": 4.5,
          "petal_width_in_cm": 1.7,
          "sepal_length_in_cm": 4.9,
          "sepal_width_in_cm": 2.5,
          "species": "virginica"
        }
      },
      {
        "_index": "iris-index",
        "_id": "8",
        "_score": 0.65176475,
        "_source": {
          "petal_length_in_cm": 6.3,
          "petal_width_in_cm": 1.8,
          "sepal_length_in_cm": 7.3,
          "sepal_width_in_cm": 2.9,
          "species": "virginica"
        }
      },
      {
        "_index": "iris-index",
        "_id": "10",
        "_score": 0.65176475,
        "_source": {
          "petal_length_in_cm": 6.1,
          "petal_width_in_cm": 2.5,
          "sepal_length_in_cm": 7.2,
          "sepal_width_in_cm": 3.6,
          "species": "virginica"
        }
      },
      {
        "_index": "iris-index",
        "_id": "6",
        "_score": 0.65176475,
        "_source": {
          "petal_length_in_cm": 6.6,
          "petal_width_in_cm": 2.1,
          "sepal_length_in_cm": 7.6,
          "sepal_width_in_cm": 3.0,
          "species": "virginica"
        }
      }
    ]
  },
  "ext": {
    "dsl_query": "{\"query\":{\"term\":{\"species.keyword\":\"virginica\"}}}"
  }
}
```

## Related documentation

- [Reranking search results]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/reranking-search-results/)
- [Rerank processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/rerank-processor/)
