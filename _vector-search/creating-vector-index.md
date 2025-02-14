---
layout: default
title: Creating a vector index
nav_order: 20
redirect_from:
  - /vector-search/creating-a-vector-db/
  - /search-plugins/knn/knn-index/
  - /vector-search/creating-vector-index/
---

# Creating a vector index

Creating a vector index in OpenSearch involves a common core process with some variations depending on the type of vector search. This guide outlines the key elements shared across all vector indexes and the differences specific to supported use cases.

To create a vector index, set the `settings.index.knn` parameter to `true`:

```json
PUT /test-index
{
  "settings": {
    "index": {
      "knn": true
    }
  },
  "mappings": {
    "properties": {
      "my_vector1": {
        "type": "knn_vector",
        "dimension": 3,
        "space_type": "l2"
      }
    }
  }
}
```
{% include copy-curl.html %}


Regardless of the type of vector search, the following elements are part of creating a vector index:

1. **Enable k-NN search**:
   Set `index.knn` to `true` in the index settings to enable k-NN search functionality.

2. **Define a vector field**:
   Specify the field that will store the vector data. When defining a `knn_vector` field in OpenSearch, you can select from different data types to balance storage requirements and performance. By default, k-NN vectors are float vectors, but you can also opt for byte or binary vectors for more efficient storage. For more information, see [k-NN vector]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector/).

3. **Specify dimension**:
   Set the `dimension` property to match the size of the vectors used.

4. **Choose a space type**:
   Select a distance metric for similarity comparisons, such as `l2` (Euclidean distance) or `cosinesimil`. For more information, see [Spaces]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-spaces/).

5. (Advanced) **Select a method**:
   Optionally, configure the indexing method, such as HNSW or IVF, to optimize vector search performance. For more information, see [Methods and engines]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-methods-engines/).

To create a vector index, choose one of the following options:

- [Pre-generated embeddings or raw vectors](#pre-generated-embeddings-or-raw-vectors): Ingest pre-generated embeddings or raw vectors into your index to perform raw vector search. 
- [Auto-generated embeddings](#auto-generated-embeddings): Ingest text that will be converted into vector embeddings within OpenSearch in order to perform semantic search using ML models. 


The following table summarizes key index configuration differences for the supported use cases.


| Feature                  | Vector field type | Ingest pipeline | Transformation     | Use case   |
|--------------------------|-----------------------|---------------------|-------------------------|-------------------------|
| **Pre-generated embeddings or raw vectors**   | [`knn_vector`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector/)         | Not required        | Direct ingestion        | Raw vector search   |
| **Auto-generated embeddings**      | [`knn_vector`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector/)         | Required            | Auto-generated vectors  | ML-powered search     |

## Pre-generated embeddings or raw vectors

To ingest raw vectors into an index, configure a vector field (in this request, `my_vector`) and specify its `dimension`:

```json
PUT /my-raw-vector-index
{
  "settings": {
    "index.knn": true
  },
  "mappings": {
    "properties": {
      "my_vector": {
        "type": "knn_vector",
        "dimension": 128,
        "method": {
          "name": "hnsw",
          "engine": "faiss",
          "space_type": "l2"
        }
      }
    }
  }
}
```

## Auto-generated embeddings

Auto-generating embeddings require configuring an [ingest pipeline]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/index/) with a model ID of the embedding model: 

```json
PUT /_ingest/pipeline/nlp-ingest-pipeline
{
  "description": "An NLP ingest pipeline",
  "processors": [
    {
      "text_embedding": {
        "model_id": "aVeif4oB5Vm0Tdw8zYO2",
        "field_map": {
          "text": "passage_embedding"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

For more information about configuring a model, see [Integrating ML models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/integrating-ml-models/).

When creating an index, specify the pipeline as the default pipeline:

```json
PUT /my-semantic-search-index
{
  "settings": {
    "index.knn": true,
    "default_pipeline": "nlp-ingest-pipeline"
  },
  "mappings": {
    "properties": {
      "passage_text": {
        "type": "text"
      },
      "passage_embedding": {
        "type": "knn_vector",
        "dimension": 768,  
        "method": {
          "name": "hnsw",
          "engine": "lucene",
          "space_type": "l2"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Related articles

- [Ingesting data into a vector index]({{site.url}}{{site.baseurl}}/vector-search/searching-data/)
- [k-NN vector]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector/)
- [Methods and engines]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-methods-engines/)
- [k-NN vector field type]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector/)