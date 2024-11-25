---
layout: default
title: Reranking by a field
parent: Reranking search results
grand_parent: Search relevance
has_children: false
nav_order: 20
---

# Reranking search results by a field
Introduced 2.18
{: .label .label-purple }

You can use a `by_field` rerank type to rerank search results by a document field. Reranking search results by a field is useful if a model has already run and produced a numerical score for your documents or if a previous search response processor was applied and you want to rerank documents differently based on an aggregated field.

To implement reranking, you need to configure a [search pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/index/) that runs at search time. The search pipeline intercepts search results and applies the [`rerank` processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/rerank-processor/) to them. The `rerank` processor evaluates the search results and sorts them based on the new scores obtained from a document field. 

## Running a search with reranking

To run a search with reranking, follow these steps:

1. [Configure a search pipeline](#step-1-configure-a-search-pipeline).
1. [Create an index for ingestion](#step-2-create-an-index-for-ingestion).
1. [Ingest documents into the index](#step-3-ingest-documents-into-the-index).
1. [Search using reranking](#step-4-search-using-reranking).

## Step 1: Configure a search pipeline

Configure a search pipeline with a [`rerank` processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/rerank-processor/) and specify the `by_field` rerank type. The pipeline sorts by the `reviews.stars` field (specified by a complete dot path to the field) and returns the original query scores for all documents along with their new scores:

```json
PUT /_search/pipeline/rerank_byfield_pipeline
{
  "response_processors": [
    {
      "rerank": {
        "by_field": {
          "target_field": "reviews.stars",
          "keep_previous_score" : true
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

For more information about the request fields, see [Request fields]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/rerank-processor/#request-body-fields).

## Step 2: Create an index for ingestion

In order to use the `rerank` processor defined in your pipeline, create an OpenSearch index and add the pipeline created in the previous step as the default pipeline:

```json
PUT /book-index
{
  "settings": {
    "index.search.default_pipeline" : "rerank_byfield_pipeline"
  },
  "mappings": {
    "properties": {
      "title": {
        "type": "text"
      },
      "author": {
        "type": "text"
      },
      "genre": {
        "type": "keyword"
      },
      "reviews": {
        "properties": {
          "stars": {
            "type": "float"
          }
        }
      },
      "description": {
        "type": "text"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Step 3: Ingest documents into the index

To ingest documents into the index created in the previous step, send the following bulk request:

```json
POST /_bulk
{ "index": { "_index": "book-index", "_id": "1" } }
{ "title": "The Lost City", "author": "Jane Doe", "genre": "Adventure Fiction", "reviews": { "stars": 4.2 }, "description": "An exhilarating journey through a hidden civilization in the Amazon rainforest." }
{ "index": { "_index": "book-index", "_id": "2" } }
{ "title": "Whispers of the Past", "author": "John Smith", "genre": "Historical Mystery", "reviews": { "stars": 4.7 }, "description": "A gripping tale set in Victorian England, unraveling a century-old mystery." }
{ "index": { "_index": "book-index", "_id": "3" } }
{ "title": "Starlit Dreams", "author": "Emily Clark", "genre": "Science Fiction", "reviews": { "stars": 4.5 }, "description": "In a future where dreams can be shared, one girl discovers her imaginations power." }
{ "index": { "_index": "book-index", "_id": "4" } }
{ "title": "The Enchanted Garden", "author": "Alice Green", "genre": "Fantasy", "reviews": { "stars": 4.8 }, "description": "A magical garden holds the key to a young girls destiny and friendship." }

```
{% include copy-curl.html %}

## Step 4: Search using reranking

As an example, run a `match_all` query on your index:

```json
POST /book-index/_search
{
  "query": {
     "match_all": {}
  }
}
```
{% include copy-curl.html %}

The response contains documents sorted in descending order based on the `reviews.stars` field. Each document contains the original query score in the `previous_score` field:

```json
{
  "took": 33,
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
          "reviews": {
            "stars": 4.8
          },
          "author": "Alice Green",
          "genre": "Fantasy",
          "description": "A magical garden holds the key to a young girls destiny and friendship.",
          "previous_score": 1,
          "title": "The Enchanted Garden"
        }
      },
      {
        "_index": "book-index",
        "_id": "2",
        "_score": 4.7,
        "_source": {
          "reviews": {
            "stars": 4.7
          },
          "author": "John Smith",
          "genre": "Historical Mystery",
          "description": "A gripping tale set in Victorian England, unraveling a century-old mystery.",
          "previous_score": 1,
          "title": "Whispers of the Past"
        }
      },
      {
        "_index": "book-index",
        "_id": "3",
        "_score": 4.5,
        "_source": {
          "reviews": {
            "stars": 4.5
          },
          "author": "Emily Clark",
          "genre": "Science Fiction",
          "description": "In a future where dreams can be shared, one girl discovers her imaginations power.",
          "previous_score": 1,
          "title": "Starlit Dreams"
        }
      },
      {
        "_index": "book-index",
        "_id": "1",
        "_score": 4.2,
        "_source": {
          "reviews": {
            "stars": 4.2
          },
          "author": "Jane Doe",
          "genre": "Adventure Fiction",
          "description": "An exhilarating journey through a hidden civilization in the Amazon rainforest.",
          "previous_score": 1,
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

## Next steps

- Learn more about the [`rerank` processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/rerank-processor/).
- See a comprehensive example of [reranking by a field using an externally hosted cross-encoder model]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/rerank-by-field-cross-encoder/).