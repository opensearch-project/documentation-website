---
layout: default
title: Getting started
nav_order: 10
has_children: true
redirect_from:
  - /vector-database/getting-started/
---

# Getting started with OpenSearch as a vector database

To get started using OpenSearch as a vector database, choose one of the following approaches.

## Pre-generated embeddings

With this approach, you generate embeddings externally and then index them into OpenSearch. This method offers greater flexibility in how embeddings are created. The workflow for this approach is as follows:

1. Generate embeddings using external tools
  - Custom machine learning models
  - Embedding services (OpenAI, Cohere)
  - Domain-specific embedding techniques
2. Ingest pre-computed vector embeddings into OpenSearch
3. Perform vector similarity search

For a complete example, see [Getting started with pre-generated embeddings]({{site.url}}{{site.baseurl}}/vector-database/getting-started/pre-generated-embeddings/).

This approach is suitable for the following use cases:
  - Scientific research
  - Domain-specific applications
  - Custom embedding requirements

## Auto-generated embeddings

With this approach, embeddings are generated dynamically within OpenSearch. This method provides a simplified workflow by offering automatic text-to-vector conversion. The workflow for this approach is as follows:

1. Choose an embedding model:
  - Pretrained models
  - Custom uploaded models
  - Externally hosted model connections
2. Index text data
3. OpenSearch automatically generates embeddings
4. Perform semantic search

For a complete example, see [Getting started with auto-generated embeddings]({{site.url}}{{site.baseurl}}/vector-database/getting-started/auto-generated-embeddings/).

For a comprehensive tutorial, see [Neural search tutorial]({{site.url}}{{site.baseurl}}/search-plugins/neural-search-tutorial/).

This approach is suitable for the following use cases:
  - General-purpose search
  - Rapid prototyping
  - Standard text corpus
  - Quick implementation


### k-NN vector search

Vector search finds the vectors in your database that are most similar to the query vector. OpenSearch supports the following search methods:


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





### Search methods

Choose one of the following search methods to use your model for neural search:

- [Semantic search]({{site.url}}{{site.baseurl}}/search-plugins/semantic-search/): Uses dense retrieval based on text embedding models to search text data. 

- [Hybrid search]({{site.url}}{{site.baseurl}}/search-plugins/hybrid-search/): Combines lexical and neural search to improve search relevance. 

- [Multimodal search]({{site.url}}{{site.baseurl}}/search-plugins/multimodal-search/): Uses neural search with multimodal embedding models to search text and image data.

- [Neural sparse search]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-search/): Uses neural search with sparse retrieval based on sparse embedding models to search text data.

- [Conversational search]({{site.url}}{{site.baseurl}}/search-plugins/conversational-search/): With conversational search, you can ask questions in natural language, receive a text response, and ask additional clarifying questions.
