---
layout: default
title: Reranking search results
parent: Search relevance
has_children: false
nav_order: 60
canonical_url: https://docs.opensearch.org/latest/search-plugins/search-relevance/reranking-search-results/
---

# Reranking search results
Introduced 2.12
{: .label .label-purple }

You can rerank search results using a cross-encoder reranker in order to improve search relevance. To implement reranking, you need to configure a [search pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/index/) that runs at search time. The search pipeline intercepts search results and applies the [`rerank` processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/rerank-processor/) to them. The `rerank` processor evaluates the search results and sorts them based on the new scores provided by the cross-encoder model. 

**PREREQUISITE**<br>
Before configuring a reranking pipeline, you must set up a cross-encoder model. For information about using an OpenSearch-provided model, see [Cross-encoder models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/#cross-encoder-models). For information about using a custom model, see [Custom local models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/custom-local-models/).
{: .note}

## Running a search with reranking

To run a search with reranking, follow these steps:

1. [Configure a search pipeline](#step-1-configure-a-search-pipeline).
1. [Create an index for ingestion](#step-2-create-an-index-for-ingestion).
1. [Ingest documents into the index](#step-3-ingest-documents-into-the-index).
1. [Search using reranking](#step-4-search-using-reranking).

## Step 1: Configure a search pipeline

Next, configure a search pipeline with a [`rerank` processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/rerank-processor/).

The following example request creates a search pipeline with an `ml_opensearch` rerank processor. In the request, provide a model ID for the cross-encoder model and the document fields to use as context:

```json
PUT /_search/pipeline/my_pipeline
{
  "description": "Pipeline for reranking with a cross-encoder",
  "response_processors": [
    {
      "rerank": {
        "ml_opensearch": {
          "model_id": "gnDIbI0BfUsSoeNT_jAw"
        },
        "context": {
          "document_fields": [
            "passage_text"
          ]
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

For more information about the request fields, see [Request fields]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/rerank-processor/#request-fields).

## Step 2: Create an index for ingestion

In order to use the rerank processor defined in your pipeline, create an OpenSearch index and add the pipeline created in the previous step as the default pipeline:

```json
PUT /my-index
{
  "settings": {
    "index.search.default_pipeline" : "my_pipeline"
  },
  "mappings": {
    "properties": {
      "passage_text": {
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
{ "index": { "_index": "my-index" } }
{ "passage_text" : "I said welcome to them and we entered the house" }
{ "index": { "_index": "my-index" } }
{ "passage_text" : "I feel welcomed in their family" }
{ "index": { "_index": "my-index" } }
{ "passage_text" : "Welcoming gifts are great" }

```
{% include copy-curl.html %}

## Step 4: Search using reranking

To perform reranking search on your index, use any OpenSearch query and provide an additional `ext.rerank` field:

```json
POST /my-index/_search
{
  "query": {
    "match": {
      "passage_text": "how to welcome in family"
    }
  },
  "ext": {
    "rerank": {
      "query_context": {
         "query_text": "how to welcome in family"
      }
    }
  }
}
```
{% include copy-curl.html %}

Alternatively, you can provide the full path to the field containing the context. For more information, see [Rerank processor example]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/rerank-processor/#example).