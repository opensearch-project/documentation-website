---
layout: default
title: Vector search
nav_order: 22
has_children: false
has_toc: false
---

# Vector search

You can use OpenSearch as a vector database in two ways:

- [k-NN vector search](#k-nn-vector-search) provides traditional vector database capability in OpenSearch. When using this option, you must generate vectors using a library of your choice before ingesting them into OpenSearch. Once you ingest vectors into an index, you can perform a vector similarity search on the vector space. 
- [Neural search](#neural-search) is built on top of k-NN search and provides the ability to generate vectors from text at ingestion time and at search time. At ingestion time, neural search transforms text into vector embeddings and indexes both the text and its vector embeddings in a vector index. At search time, neural search converts the query text into vector embeddings and uses vector search to return the most relevant results.

## k-NN vector search

After you generate vectors, upload them into an OpenSearch index and search this index using vector search.

### k-NN index and k-NN vector

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
        "method": {
          "name": "hnsw",
          "space_type": "l2",
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

You must designate the field that will hold vectors as a [`knn_vector`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector/) field type. OpenSearch supports vectors of up to 16,000 dimensions, each of which is represented as a 32-bit float. 

To save storage space, you can use `byte` vectors. For more information, see [Lucene byte vector]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector#lucene-byte-vector).

### k-NN vector search

Vector search finds the vectors in your database that are most similar to the query vector. OpenSearch supports the following search methods:

- Exact search (exact k-NN): A brute-force, exact k-NN search over vector fields 
  - [Exact k-NN with scoring script]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-score-script/): Using the k-NN score script, you can apply a filter on an index before executing the nearest neighbor search. 
  - [Painless extensions]({{site.url}}{{site.baseurl}}/search-plugins/knn/painless-functions/): Adds the distance functions as Painless extensions that you can use in more complex combinations. You can use this method to perform a brute force, exact k-NN search across an index, which also supports pre-filtering. 

- [Approximate search]({{site.url}}{{site.baseurl}}/search-plugins/knn/approximate-knn/) (approximate k-NN, or ANN): Returns approximate nearest neighbors to the query vector. Usually, approximate search algorithms sacrifice indexing speed and search accuracy in return for performance benefits such as lower latency, smaller memory footprints, and more scalable search. 

### Approximate vector search

To use approximate vector search, specify one of the following search methods (algorithms) in the `method` parameter:

- Hierarchical Navigable Small World (HNSW)
- Inverted File System (IVF)

Additionally, specify the engine (library) that implements this method in the `engine` parameter:

- [Non-Metric Space Library (NMSLIB)](https://github.com/nmslib/nmslib)
- [Facebook AI Similarity Search (Faiss)](https://github.com/facebookresearch/faiss)
- Lucene

The following table lists the combination of search methods and libraries that the k-NN engine supports for approximate vector search.

Method | Engine
:--- | :---
HNSW | NMSLIB, Faiss, Lucene
IVF | Faiss 

For more information about the search methods and engines, see [Method definitions]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index/#method-definitions). For method recommendations, see [Choosing the right method]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index/#choosing-the-right-method).

### Engine recommendations

In general, select NMSLIB and Faiss for large-scale use cases. Lucene is a good option for smaller deployments but offers benefits like smart filtering where the optimal filtering strategy—pre-filtering, post-filtering, or exact k-NN—is automatically applied depending on the situation. The following table summarizes the differences between each option.

| |  NMSLIB/HNSW |  Faiss/HNSW |  Faiss/IVF |  Lucene/HNSW |
|:---|:---|:---|:---|:---|
|  Max dimensions |  16,000  |  16,000 |  16,000 |  1,024 |
|  Filter |  Post filter |  Post filter |  Post filter |  Filter while search |
|  Training required |  No |  No |  Yes |  No |
|  Similarity metrics |  `l2`, `innerproduct`, `cosinesimil`, `l1`, `linf`  |  `l2`, `innerproduct` |  `l2`, `innerproduct` |  `l2`, `cosinesimil` |
|  Number of vectors   |  Tens of billions |  Tens of billions |  Tens of billions |  Less than ten million |
|  Indexing latency |  Low |  Low  |  Lowest  |  Low  |
|  Query latency and quality  |  Low latency and high quality |  Low latency and high quality  |  Low latency and low quality  |  High latency and high quality  |
|  Vector compression  |  Flat |  Flat <br>Product quantization |  Flat <br>Product quantization |  Flat  |
|  Memory consumption |  High  |  High <br> Low with PQ |  Medium <br> Low with PQ |  High  |

### Vector search with filtering

For information about vector search with filtering, see [k-NN search with filters]({{site.url}}{{site.baseurl}}/search-plugins/knn/filter-search-knn/).

## Neural search

Neural search is built on top of k-NN search. It transforms text into vector embeddings and indexes both the text and its vector embeddings in a vector index. When you use a neural query during search, neural search converts the query text into vector embeddings and uses vector search to return the most relevant results.

### Choosing a model

The first step in setting up neural search is choosing a model. You can upload a model to your OpenSearch cluster, use one of the pretrained models provided by OpenSearch, or connect to an externally hosted model. For more information, see [Integrating ML models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/integrating-ml-models/).

### Neural search tutorial

For a step-by-step tutorial, see [Neural search tutorial]({{site.url}}{{site.baseurl}}/search-plugins/neural-search-tutorial/).

### Search methods

You can choose one of the following search methods to use your model for neural search:

- [Semantic search]({{site.url}}{{site.baseurl}}/search-plugins/semantic-search/): Uses dense retrieval based on text embedding models to search text data. 

- [Hybrid search]({{site.url}}{{site.baseurl}}/search-plugins/hybrid-search/): Combines keyword and neural search to improve search relevance. 

- [Multimodal search]({{site.url}}{{site.baseurl}}/search-plugins/multimodal-search/): Uses neural search with multimodal embedding models to search text and image data.

- [Sparse search]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-search/): Uses neural search with sparse retrieval based on sparse embedding models to search text data.

- [Conversational search]({{site.url}}{{site.baseurl}}/search-plugins/conversational-search/): With conversational search, you can ask questions in natural language, receive a text response, and ask additional clarifying questions.
