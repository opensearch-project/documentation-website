---
layout: default
title: Multimodal search
nav_order: 20
has_children: false
parent: Neural search
---

# Multimodal search
Introduced 2.11
{: .label .label-purple }

Use multimodal search to search text and image data. In neural search, text search is facilitated by multimodal embedding models. 

**PREREQUISITE**<br>
Before using text search, you must set up a multimodal embedding model. For more information, see [Using ML models within OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/ml-framework/) and [Connecting to remote models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/extensibility/index/).
{: .note}

## Using multimodal search

To use neural search with text and image embeddings, follow these steps:

1. [Create an ingest pipeline](#step-1-create-an-ingest-pipeline).
1. [Create an index for ingestion](#step-2-create-an-index-for-ingestion).
1. [Ingest documents into the index](#step-3-ingest-documents-into-the-index).
1. [Search the index using neural search](#step-4-search-the-index-using-neural-search).

## Step 1: Create an ingest pipeline

To generate vector embeddings, you need to create an [ingest pipeline]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/index/) that contains a [`text_image_embedding` processor]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/processors/text-image-embedding/), which will convert the text or image in a document field to vector embeddings. The processor's `field_map` determines the text and image fields from which to generate vector embeddings and the output vector field in which to store the embeddings.

The following example request creates an ingest pipeline where the text from `image_description` and an image from `image_binary` will be converted into text embeddings and the embeddings will be stored in `vector_embedding`:

```json
PUT /_ingest/pipeline/nlp-ingest-pipeline
{
  "description": "A text/image embedding pipeline",
  "processors": [
    {
      "text_image_embedding": {
        "model_id": "-fYQAosBQkdnhhBsK593",
        "embedding": "vector_embedding",
        "field_map": {
          "text": "image_description",
          "image": "image_binary"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Step 2: Create an index for ingestion

In order to use the text embedding processor defined in your pipeline, create a k-NN index, adding the pipeline created in the previous step as the default pipeline. Ensure that the fields defined in the `field_map` are mapped as correct types. Continuing with the example, the `vector_embedding` field must be mapped as a k-NN vector with a dimension that matches the model dimension. Similarly, the `image_description` field should be mapped as `text`, and the `image_binary` should be mapped as `binary`.

The following example request creates a k-NN index that is set up with a default ingest pipeline:

```json
PUT /my-nlp-index
{
  "settings": {
    "index.knn": true,
    "default_pipeline": "nlp-ingest-pipeline",
    "number_of_shards": 2
  },
  "mappings": {
    "properties": {
      "vector_embedding": {
        "type": "knn_vector",
        "dimension": 1024,
        "method": {
          "name": "hnsw",
          "engine": "lucene",
          "parameters": {}
        }
      },
      "image_description": {
        "type": "text"
      },
      "image_binary": {
        "type": "binary"
      }
    }
  }
}
```
{% include copy-curl.html %}

For more information about creating a k-NN index and its supported methods, see [k-NN index]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index/).

## Step 3: Ingest documents into the index

To ingest documents into the index created in the previous step, send the following request:

```json
PUT /nlp-index/_doc/1
{
 "image_description": "Orange table",
 "image_binary": "iVBORw0KGgoAAAANSUI..."
}
```
{% include copy-curl.html %}

Before the document is ingested into the index, the ingest pipeline runs the `text_image_embedding` processor on the document, generating vector embeddings for the `image_description` and `image_binary` fields. In addition to the original `image_description` and `image_binary` fields, the indexed document includes the `vector_embedding` field, which contains the combined vector embeddings. 

## Step 4: Search the index using neural search

To perform vector search on your index, use the `neural` query clause either in the [k-NN plugin API]({{site.url}}{{site.baseurl}}/search-plugins/knn/api/#search-model) or [Query DSL]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/index/) queries. You can refine the results by using a [k-NN search filter]({{site.url}}{{site.baseurl}}/search-plugins/knn/filter-search-knn/). You can search by text, image, or both text and image.

The following example request uses a neural query to search for text and image:

```json
GET /my-nlp-index/_search
{
  "size": 10,
  "query": {
    "neural": {
      "vector_embedding": {
        "query_text": "Orange table",
        "query_image": "iVBORw0KGgoAAAANSUI...",
        "model_id": "-fYQAosBQkdnhhBsK593",
        "k": 5
      }
    }
  }
}
```
{% include copy-curl.html %}

To eliminate passing the model ID with each neural query request, you can set a default model on a k-NN index or a field. To learn more, see [Setting a default model on an index or field]({{site.url}}{{site.baseurl}}/search-plugins/neural-text-search/##setting-a-default-model-on-an-index-or-field).
