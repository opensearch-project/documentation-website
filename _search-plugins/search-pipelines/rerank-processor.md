---
layout: default
title: Rerank
nav_order: 110
has_children: false
parent: Search processors
grand_parent: Search pipelines
---

# Rerank processor
Introduced 2.12
{: .label .label-purple }

The `rerank` search response processor can take different forms as specified by [reranker type]({{sit.url}}{{site.baseurl}}/search-plugins/search-pipelines/rerank-processor/#reranker-types). When used, it intercepts search results and reranks based on the logic the reranker type uses. The processor orders documents in the search results based on their new scores. 

## Request body fields

The following table lists all available request fields.

Field | Data type | Description
:--- | :--- | :---
`<reranker_type>` | Object | The reranker type provides the rerank processor with static information needed across all reranking calls. Required.
`context` | Object | Provides the rerank processor with information necessary for generating reranking context at query time. Optional for the `by_field` reranker type
`tag` | String | The processor's identifier. Optional.
`description` | String | A description of the processor. Optional.
`ignore_failure` | Boolean | If `true`, OpenSearch [ignores any failure]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/creating-search-pipeline/#ignoring-processor-failures) of this processor and continues to run the remaining processors in the search pipeline. Optional. Default is `false`.

### Reranker-types

Type | Description | Earliest available version
:--- | :--- | :---
[`ml_opensearch`](#the-ml_opensearch-reranker-type) | Applies an OpenSearch provided cross encoder model. | 2.12
[`by_field`](#the-by_field-reranker-type) | Applies reranking based on a user provided field. | 2.18

### The `ml_opensearch` reranker type

The `ml_opensearch` reranker type is designed to work with the cross-encoder model provided by OpenSearch. For this reranker type, specify the following fields.

Field  | Data type | Description
:--- | :---  | :--- 
`ml_opensearch` | Object | Provides the rerank processor with model information. Required.
`ml_opensearch.model_id` | String | The model ID for the cross-encoder model. Required. For more information, see [Using ML models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/using-ml-models/).
`context.document_fields` | Array | An array of document fields that specifies the fields from which to retrieve context for the cross-encoder model. Required.

## Example 

The following example demonstrates using a search pipeline with a `rerank` processor implemented using the `ml_opensearch` rerank logic.

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


### The `by_field` reranker type

The `by_field` reranker type is designed to work with a provided field that is in your document. This can be helpful if you have ran a model previously and a nuermical score is in your document, or if you applied a previous search response processor and want to rerank your documents differently based on a field that was aggregated. For this reranker type, specify the following fields.

Field  | Data type | Description
:--- | :---  | :--- 
`by_field` | Object | Provides the rerank processor with reranking information. Required.
`by_field.target_field` | String | This can be a path to your field that has a numerical score, in the form of `key[.key]`. Required.
`by_field.remove_target_field` | boolean | if `true` it will delete the `target_field` used to perform reranking. Otherwise, the field is kept in the search result. Optional. Default is `false`.
`by_field.keep_previous_score` | boolean | if `true` it will append a `previous_score`, this was the score calculated before reranking, its useful when debugging. When `false`, there wont be an additional field in your search result. Optional. Default is `false`.

## Example 

The following example demonstrates using a search pipeline with a `rerank` processor implemented using the `by_field` rerank logic.

### Create an index with data
Create an index and ingest data that has a numerical score you wish to rerank by. In this example we will ingest the following data for a index named `book-index`

```json
POST _bulk
{ "index": { "_index": "book-index", "_id": "1" } }
{ "title": "The Lost City", "author": "Jane Doe", "genre": "Adventure Fiction", "rating": 4.2, "description": "An exhilarating journey through a hidden civilization in the Amazon rainforest." }
{ "index": { "_index": "book-index", "_id": "2" } }
{ "title": "Whispers of the Past", "author": "John Smith", "genre": "Historical Mystery", "rating": 4.7, "description": "A gripping tale set in Victorian England, unraveling a century-old mystery." }
{ "index": { "_index": "book-index", "_id": "3" } }
{ "title": "Starlit Dreams", "author": "Emily Clark", "genre": "Science Fiction", "rating": 4.5, "description": "In a future where dreams can be shared, one girl discovers her imagination's power." }
{ "index": { "_index": "book-index", "_id": "4" } }
{ "title": "The Enchanted Garden", "author": "Alice Green", "genre": "Fantasy", "rating": 4.8, "description": "A magical garden holds the key to a young girl's destiny and friendship." }
```
{% include copy-curl.html %}


### Creating a search pipeline

The following request creates a search pipeline with a `by_field` rerank response processor. We want to rerank `by_field` using the `target_field` : rating.

```json
PUT /_search/pipeline/rerank_byfield_pipeline
{
  "response_processors": [
    {
      "rerank": {
        "by_field": {
          "target_field": "rating",
          "keep_previous_score" : true
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Using a search pipeline

Combine an OpenSearch query with this new pipeline and see your results reranked.

```json
POST /_search?search_pipeline=rerank_byfield_pipeline
{
  "query": {
     "match_all": {}
  }
}
```
{% include copy-curl.html %}

Which now yields the following. Observe that our documents are now sorted in a descending order based on the rating of each book, we kept the `previous_score` to help keep track of how we originally scored before reranking.

```json
{
  "took": 5,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 4,
      "relation": "eq"
    },
    "max_score": 4.8,
    "hits": [
      {
        "_index": "book-index",
        "_id": "4",
        "_score": 4.8,
        "_source": {
          "author": "Alice Green",
          "genre": "Fantasy",
          "rating": 4.8,
          "description": "A magical garden holds the key to a young girl's destiny and friendship.",
          "previous_score": 1.0,
          "title": "The Enchanted Garden"
        }
      },
      {
        "_index": "book-index",
        "_id": "2",
        "_score": 4.7,
        "_source": {
          "author": "John Smith",
          "genre": "Historical Mystery",
          "rating": 4.7,
          "description": "A gripping tale set in Victorian England, unraveling a century-old mystery.",
          "previous_score": 1.0,
          "title": "Whispers of the Past"
        }
      },
      {
        "_index": "book-index",
        "_id": "3",
        "_score": 4.5,
        "_source": {
          "author": "Emily Clark",
          "genre": "Science Fiction",
          "rating": 4.5,
          "description": "In a future where dreams can be shared, one girl discovers her imagination's power.",
          "previous_score": 1.0,
          "title": "Starlit Dreams"
        }
      },
      {
        "_index": "book-index",
        "_id": "1",
        "_score": 4.2,
        "_source": {
          "author": "Jane Doe",
          "genre": "Adventure Fiction",
          "rating": 4.2,
          "description": "An exhilarating journey through a hidden civilization in the Amazon rainforest.",
          "previous_score": 1.0,
          "title": "The Lost City"
        }
      }
    ]
  },
  "profile": {
    "shards": []
  }
}
```

For more information about setting up reranking, see [Reranking search results]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/reranking-search-results/).