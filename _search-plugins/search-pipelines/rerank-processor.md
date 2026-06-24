---
layout: default
title: Rerank
nav_order: 25
has_children: false
parent: Search processors
grand_parent: Search pipelines
canonical_url: https://docs.opensearch.org/latest/search-plugins/search-pipelines/rerank-processor/
---

# Rerank processor

The `rerank` search request processor intercepts search results and passes them to a cross-encoder model to be reranked. The model reranks the results, taking into account the scoring context. Then the processor orders documents in the search results based on their new scores.

## Request fields

The following table lists all available request fields.

Field | Data type | Description
:--- | :--- | :---
`<reranker_type>` | Object | The reranker type provides the rerank processor with static information needed across all reranking calls. Required.
`context` | Object | Provides the rerank processor with information necessary for generating reranking context at query time.
`tag` | String | The processor's identifier. Optional.
`description` | String | A description of the processor. Optional.
`ignore_failure` | Boolean | If `true`, OpenSearch [ignores any failure]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/creating-search-pipeline/#ignoring-processor-failures) of this processor and continues to run the remaining processors in the search pipeline. Optional. Default is `false`.

### The `ml_opensearch` reranker type

The `ml_opensearch` reranker type is designed to work with the cross-encoder model provided by OpenSearch. For this reranker type, specify the following fields.

Field  | Data type | Description
:--- | :---  | :--- 
`ml_opensearch` | Object | Provides the rerank processor with model information. Required.
`ml_opensearch.model_id` | String | The model ID for the cross-encoder model. Required. For more information, see [Using ML models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/using-ml-models/).
`context.document_fields` | Array | An array of document fields that specifies the fields from which to retrieve context for the cross-encoder model. Required.

## Example 

The following example demonstrates using a search pipeline with a `rerank` processor.

### Creating a search pipeline

The following request creates a search pipeline with a `rerank` response processor:

```json
PUT /_search/pipeline/rerank_pipeline
{
  "response_processors": [
    {
      "rerank": {
        "ml_opensearch": {
          "model_id": "gnDIbI0BfUsSoeNT_jAw"
        },
        "context": {
          "document_fields": [ "title", "text_representation"]
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Using a search pipeline

Combine an OpenSearch query with an `ext` object that contains the query context for the large language model (LLM). Provide the `query_text` that will be used to rerank the results:

```json
POST /_search?search_pipeline=rerank_pipeline
{
  "query": {
    "match": {
      "text_representation": "Where is Albuquerque?"
    }
  },
  "ext": {
    "rerank": {
      "query_context": {
        "query_text": "Where is Albuquerque?"
      }
    }
  }
}
```
{% include copy-curl.html %}

Instead of specifying `query_text`, you can provide a full path to the field containing text to use for reranking. For example, if you specify a subfield `query` in the `text_representation` object, specify its path in the `query_text_path` parameter:

```json
POST /_search?search_pipeline=rerank_pipeline
{
  "query": {
    "match": {
      "text_representation": {
        "query": "Where is Albuquerque?"
      }
    }
  },
  "ext": {
    "rerank": {
      "query_context": {
        "query_text_path": "query.match.text_representation.query"
      }
    }
  }
}
```
{% include copy-curl.html %}

The `query_context` object contains the following fields. 

Field name  | Description
:--- | :---  
`query_text` | The natural language text of the question that you want to use to rerank the search results. Either `query_text` or `query_text_path` (not both) is required.
`query_text_path` | The full JSON path to the text of the question that you want to use to rerank the search results. Either `query_text` or `query_text_path` (not both) is required. The maximum number of characters in the path is `1000`.

For more information about setting up reranking, see [Reranking search results]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/reranking-search-results/).