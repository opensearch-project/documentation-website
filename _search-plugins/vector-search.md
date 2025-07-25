---
layout: default
title: Vector search
nav_order: 22
has_children: false
has_toc: false
canonical_url: https://docs.opensearch.org/latest/search-plugins/vector-search/
---

# Vector search

OpenSearch is a comprehensive search platform that supports a variety of data types, including vectors. OpenSearch vector database functionality is seamlessly integrated with its generic database function.

In OpenSearch, you can generate vector embeddings, store those embeddings in an index, and use them for vector search. Choose one of the following options:

- Generate embeddings using a library of your choice before ingesting them into OpenSearch. Once you ingest vectors into an index, you can perform a vector similarity search on the vector space. For more information, see [Working with embeddings generated outside of OpenSearch](#working-with-embeddings-generated-outside-of-opensearch). 
- Automatically generate embeddings within OpenSearch. To use embeddings for semantic search, the ingested text (the corpus) and the query need to be embedded using the same model. [Neural search]({{site.url}}{{site.baseurl}}/search-plugins/neural-search/) packages this functionality, eliminating the need to manage the internal details. For more information, see [Generating vector embeddings within OpenSearch](#generating-vector-embeddings-in-opensearch).

## Working with embeddings generated outside of OpenSearch

After you generate vector embeddings, upload them to an OpenSearch index and search the index using vector search. For a complete example, see [Example](#example).

### k-NN index

To build a vector database and use vector search, you must specify your index as a [k-NN index]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index/) when creating it by setting `index.knn` to `true`:

```json
PUT test-index
{
  "settings": {
    "index": {
      "knn": true,
      "knn.algo_param.ef_search": 100
    }
  },
  "mappings": {
    "properties": {
      "my_vector1": {
        "type": "knn_vector",
        "dimension": 1024,
        "space_type": "l2",
        "method": {
          "name": "hnsw",
          "engine": "nmslib",
          "parameters": {
            "ef_construction": 128,
            "m": 24
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

### k-NN vector

You must designate the field that will store vectors as a [`knn_vector`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector/) field type. OpenSearch supports vectors of up to 16,000 dimensions, each of which is represented as a 32-bit or 16-bit float. 

To save storage space, you can use `byte` or `binary` vectors. For more information, see [Byte vectors]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector#byte-vectors) and [Binary vectors]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector#binary-vectors).

### k-NN vector search

Vector search finds the vectors in your database that are most similar to the query vector. OpenSearch supports the following search methods:

- [Approximate search](#approximate-search) (approximate k-NN, or ANN): Returns approximate nearest neighbors to the query vector. Usually, approximate search algorithms sacrifice indexing speed and search accuracy in exchange for performance benefits such as lower latency, smaller memory footprints, and more scalable search. For most use cases, approximate search is the best option.

- Exact search (exact k-NN): A brute-force, exact k-NN search of vector fields. OpenSearch supports the following types of exact search: 
  - [Exact k-NN with scoring script]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-score-script/): Using the k-NN scoring script, you can apply a filter to an index before executing the nearest neighbor search. 
  - [Painless extensions]({{site.url}}{{site.baseurl}}/search-plugins/knn/painless-functions/): Adds the distance functions as Painless extensions that you can use in more complex combinations. You can use this method to perform a brute-force, exact k-NN search of an index, which also supports pre-filtering. 

### Approximate search

OpenSearch supports several algorithms for approximate vector search, each with its own advantages. For complete documentation, see [Approximate search]({{site.url}}{{site.baseurl}}/search-plugins/knn/approximate-knn/). For more information about the search methods and engines, see [Method definitions]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index/#method-definitions). For method recommendations, see [Choosing the right method]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index/#choosing-the-right-method).

To use approximate vector search, specify one of the following search methods (algorithms) in the `method` parameter:

- Hierarchical Navigable Small World (HNSW)
- Inverted File System (IVF)

Additionally, specify the engine (library) that implements this method in the `engine` parameter:

- [Non-Metric Space Library (NMSLIB)](https://github.com/nmslib/nmslib)
- [Facebook AI Similarity Search (Faiss)](https://github.com/facebookresearch/faiss)
- Lucene

The following table lists the combinations of search methods and libraries supported by the k-NN engine for approximate vector search.

Method | Engine
:--- | :---
HNSW | NMSLIB, Faiss, Lucene
IVF | Faiss 

### Engine recommendations

In general, select NMSLIB or Faiss for large-scale use cases. Lucene is a good option for smaller deployments and offers benefits like smart filtering, where the optimal filtering strategy—pre-filtering, post-filtering, or exact k-NN—is automatically applied depending on the situation. The following table summarizes the differences between each option.

| |  NMSLIB/HNSW |  Faiss/HNSW |  Faiss/IVF |  Lucene/HNSW |
|:---|:---|:---|:---|:---|
|  Max dimensions |  16,000  |  16,000 |  16,000 |  16,000 |
|  Filter |  Post-filter |  Post-filter |  Post-filter |  Filter during search |
|  Training required |  No |  No |  Yes |  No |
|  Similarity metrics |  `l2`, `innerproduct`, `cosinesimil`, `l1`, `linf`  |  `l2`, `innerproduct` |  `l2`, `innerproduct` |  `l2`, `cosinesimil` |
|  Number of vectors   |  Tens of billions |  Tens of billions |  Tens of billions |  Less than 10 million |
|  Indexing latency |  Low |  Low  |  Lowest  |  Low  |
|  Query latency and quality  |  Low latency and high quality |  Low latency and high quality  |  Low latency and low quality  |  High latency and high quality  |
|  Vector compression  |  Flat |  Flat <br>Product quantization |  Flat <br>Product quantization |  Flat  |
|  Memory consumption |  High  |  High <br> Low with PQ |  Medium <br> Low with PQ |  High  |

### Example

In this example, you'll create a k-NN index, add data to the index, and search the data.

#### Step 1: Create a k-NN index

First, create an index that will store sample hotel data. Set `index.knn` to `true` and specify the `location` field as a `knn_vector`:

```json
PUT /hotels-index
{
  "settings": {
    "index": {
      "knn": true,
      "knn.algo_param.ef_search": 100,
      "number_of_shards": 1,
      "number_of_replicas": 0
    }
  },
  "mappings": {
    "properties": {
      "location": {
        "type": "knn_vector",
        "dimension": 2,
        "space_type": "l2",
        "method": {
          "name": "hnsw",
          "engine": "lucene",
          "parameters": {
            "ef_construction": 100,
            "m": 16
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Step 2: Add data to your index

Next, add data to your index. Each document represents a hotel. The `location` field in each document contains a vector specifying the hotel's location:

```json
POST /_bulk
{ "index": { "_index": "hotels-index", "_id": "1" } }
{ "location": [5.2, 4.4] }
{ "index": { "_index": "hotels-index", "_id": "2" } }
{ "location": [5.2, 3.9] }
{ "index": { "_index": "hotels-index", "_id": "3" } }
{ "location": [4.9, 3.4] }
{ "index": { "_index": "hotels-index", "_id": "4" } }
{ "location": [4.2, 4.6] }
{ "index": { "_index": "hotels-index", "_id": "5" } }
{ "location": [3.3, 4.5] }
```
{% include copy-curl.html %}

#### Step 3: Search your data

Now search for hotels closest to the pin location `[5, 4]`. This location is labeled `Pin` in the following image. Each hotel is labeled with its document number.

![Hotels on a coordinate plane]({{site.url}}{{site.baseurl}}/images/k-nn-search-hotels.png/)

To search for the top three closest hotels, set `k` to `3`:

```json
POST /hotels-index/_search
{
  "size": 3,
  "query": {
    "knn": {
      "location": {
        "vector": [
          5,
          4
        ],
        "k": 3
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the hotels closest to the specified pin location:

```json
{
  "took": 1093,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 3,
      "relation": "eq"
    },
    "max_score": 0.952381,
    "hits": [
      {
        "_index": "hotels-index",
        "_id": "2",
        "_score": 0.952381,
        "_source": {
          "location": [
            5.2,
            3.9
          ]
        }
      },
      {
        "_index": "hotels-index",
        "_id": "1",
        "_score": 0.8333333,
        "_source": {
          "location": [
            5.2,
            4.4
          ]
        }
      },
      {
        "_index": "hotels-index",
        "_id": "3",
        "_score": 0.72992706,
        "_source": {
          "location": [
            4.9,
            3.4
          ]
        }
      }
    ]
  }
}
```

### Vector search with filtering

For information about vector search with filtering, see [k-NN search with filters]({{site.url}}{{site.baseurl}}/search-plugins/knn/filter-search-knn/).

## Generating vector embeddings in OpenSearch

[Neural search]({{site.url}}{{site.baseurl}}/search-plugins/neural-search/) encapsulates the infrastructure needed to perform semantic vector searches. After you integrate an inference (embedding) service, neural search functions like lexical search, accepting a textual query and returning relevant documents.

When you index your data, neural search transforms text into vector embeddings and indexes both the text and its vector embeddings in a vector index. When you use a neural query during search, neural search converts the query text into vector embeddings and uses vector search to return the results.

### Choosing a model

The first step in setting up neural search is choosing a model. You can upload a model to your OpenSearch cluster, use one of the pretrained models provided by OpenSearch, or connect to an externally hosted model. For more information, see [Integrating ML models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/integrating-ml-models/).

### Neural search tutorial

For a step-by-step tutorial, see [Neural search tutorial]({{site.url}}{{site.baseurl}}/search-plugins/neural-search-tutorial/).

### Search methods

Choose one of the following search methods to use your model for neural search:

- [Semantic search]({{site.url}}{{site.baseurl}}/search-plugins/semantic-search/): Uses dense retrieval based on text embedding models to search text data. 

- [Hybrid search]({{site.url}}{{site.baseurl}}/search-plugins/hybrid-search/): Combines lexical and neural search to improve search relevance. 

- [Multimodal search]({{site.url}}{{site.baseurl}}/search-plugins/multimodal-search/): Uses neural search with multimodal embedding models to search text and image data.

- [Neural sparse search]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-search/): Uses neural search with sparse retrieval based on sparse embedding models to search text data.

- [Conversational search]({{site.url}}{{site.baseurl}}/search-plugins/conversational-search/): With conversational search, you can ask questions in natural language, receive a text response, and ask additional clarifying questions.
