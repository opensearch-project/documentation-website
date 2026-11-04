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
**Introduced 2.11**
{: .label .label-purple }

Hybrid search combines keyword and semantic search to improve search relevance. A [`hybrid` query]({{site.url}}{{site.baseurl}}/query-dsl/compound/hybrid/) runs each query clause, normalizes the results, and combines them into a single ranking.

## Choosing a combination approach

OpenSearch combines the query clause results using one of the approaches listed in the following table.

Approach | Description | Choose it when
:--- | :--- | :---
Score based | Converts the scores from each query clause to a common scale and then combines them, preserving the margins between documents. | The difference between two documents' scores contains information that the final ranking must reflect, or you need fine-grained control through normalization techniques, combination techniques, and score bounds.
Rank based | Uses [reciprocal rank fusion (RRF)]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/rrf/) to combine documents according to their position in each query clause's results, ignoring the scores themselves. | You want a configuration that works without first measuring how your query clauses score documents.

To compare both approaches on your own data and judgment lists, see [Optimizing hybrid search]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/optimize-hybrid-search/).

## Search pipeline and fusion mode

You can configure either approach in one of the following places:

- A [search pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/index/) containing a [normalization processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/normalization-processor/) for score-based combination or a [score ranker processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/score-ranker-processor/) for rank-based combination. The pipeline applies the same configuration to every request that uses it.
- The `hybrid` query itself, by adding a `fusion` object. This method, called fusion mode, supports the same techniques and does not require a search pipeline. For more information, see [Fusion mode]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/fusion-mode/).

### Choosing between a search pipeline and fusion mode

Consider using fusion mode in the following cases:

- You want to run hybrid search without creating and maintaining a search pipeline. The normalization and combination configuration is part of each request, so different requests to the same index can use different techniques.
- You want candidate selection that does not depend on the number of shards. With a search pipeline, each subquery contributes its top results from each shard, so the set of candidates increases with the number of shards. In fusion mode, each subquery contributes its top `window_size` results across all shards, so the set of candidates is the same regardless of how the documents are distributed. For more information, see [Candidate window size]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/fusion-mode/#candidate-window-size).
- You need to nest the hybrid query inside another query, such as a `bool` or `dis_max` query, or apply a `rescore` to the combined results. For more information, see [Nesting a hybrid query]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/fusion-mode/#nesting-a-hybrid-query) and [Rescoring]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/fusion-mode/#rescoring).

Consider using a search pipeline in the following cases:

- You want to manage the normalization and combination configuration in one place and apply it to every request that uses the pipeline.
- You need the `lower_bounds` and `upper_bounds` normalization parameters.
- You need to paginate deeper than the fusion mode [window size limits]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/fusion-mode/#window-size-limits) allow.
- You need a feature that fusion mode does not support, such as a `scroll` request or cross-cluster search. For a complete list, see [Limitations]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/fusion-mode/#limitations).

## Configuring hybrid search

The following table specifies how to configure each combination approach.

Approach | Search pipeline | Fusion mode
:--- | :--- | :---
Score based | Use the normalization processor. For an example, see [Configuring score-based hybrid search using a search pipeline](#configuring-score-based-hybrid-search-using-a-search-pipeline). | Set the normalization technique to `min_max`, `l2`, or `z_score`. For an example, complete the setup in [Using fusion mode]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/fusion-mode/#using-fusion-mode) and then see [Using score-based combination]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/fusion-mode/#using-score-based-combination).
Rank based | Use the score ranker processor. For an example, see [Reciprocal rank fusion]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/rrf/#example-combining-keyword-and-vector-results). | Set the normalization and combination techniques to `rrf`. For an example, complete the setup in [Using fusion mode]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/fusion-mode/#using-fusion-mode) and then see [Using rank-based combination]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/fusion-mode/#using-rank-based-combination).

## Configuring score-based hybrid search using a search pipeline

The following example configures hybrid search using a search pipeline that contains a normalization processor.

**PREREQUISITE**<br>
To follow this example, you must set up a text embedding model. For more information, see [Choosing a model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/integrating-ml-models/#choosing-a-model). If you have already generated text embeddings, skip to [Step 3](#step-3-configure-a-search-pipeline).
{: .note}

To configure hybrid search, follow these steps:

1. [Create an ingest pipeline](#step-1-create-an-ingest-pipeline).
1. [Create an index for ingestion](#step-2-create-an-index-for-ingestion).
1. [Configure a search pipeline](#step-3-configure-a-search-pipeline).
1. [Ingest documents into the index](#step-4-ingest-documents-into-the-index).
1. [Search the index using hybrid search](#step-5-search-the-index-using-hybrid-search).

### Step 1: Create an ingest pipeline

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

### Step 2: Create an index for ingestion

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


### Step 3: Configure a search pipeline

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

The pipeline's weights apply to every request that uses the pipeline. To use different weights for a particular request without changing the pipeline, specify a `weights` array in the `hybrid` query itself. For more information, see [Weighting subqueries]({{site.url}}{{site.baseurl}}/query-dsl/compound/hybrid/#weighting-subqueries).

### Step 4: Ingest documents into the index

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

### Step 5: Search the index using hybrid search

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
              "model_id": "bQ1J8ooBpBj3wT4HVUsb",
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

The response contains the matching documents:

```json
{
  "took" : 32,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "my-nlp-index",
        "_id" : "2",
        "_score" : 1.0,
        "_source" : {
          "passage_text" : "Hi planet",
          "id" : "s2"
        }
      },
      {
        "_index" : "my-nlp-index",
        "_id" : "1",
        "_score" : 0.3007,
        "_source" : {
          "passage_text" : "Hello world",
          "id" : "s1"
        }
      }
    ]
  }
}
```

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
    "took": 3,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
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

To create the ingest pipeline, index, and search pipeline in one step, you can use the [hybrid search workflow template]({{site.url}}{{site.baseurl}}/vector-search/ai-search/workflows/workflow-templates/#hybrid-search).
{: .tip}

## Filtering data

Hybrid search supports two approaches to filtering:

- **Pre-filtering** removes documents before they are scored. To use pre-filtering, add a top-level `filter` to the `hybrid` query. This is the most common approach for filtering hybrid search results. For more information, see [Hybrid search with pre-filtering]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/pre-filtering/)
- **Post-filtering** removes documents after all scoring is complete. To use post-filtering, add a `post_filter` to the search request. Use this approach for faceted search with aggregations when you want the facets to reflect the unfiltered query while filtering only the displayed hits. For more information, see [Hybrid search with post-filtering]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/post-filtering/).

## Next steps

- Explore our [tutorials]({{site.url}}{{site.baseurl}}/vector-search/tutorials/) to learn how to build AI search applications. 