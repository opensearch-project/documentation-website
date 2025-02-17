---
layout: default
title: Vector search
nav_order: 1
has_children: false
has_toc: false
nav_exclude: true
permalink: /vector-search/
redirect_from:
  - /vector-search/index/
  - /search-plugins/vector-search/
---

# Vector search

Vector search enhances traditional lexical search by encoding data such as text or images as vectors, enabling similarity search with semantic understanding. OpenSearch unifies traditional search, analytics, and vector search in a single solution. As a vector database, it streamlines AI application development by efficiently storing and retrieving high-dimensional data.

<span class="centering-container">
[Get started]({{site.url}}{{site.baseurl}}/vector-search/getting-started/){: .btn-dark-blue}
</span>

## Key features

OpenSearch vector search supports the following key features:

- [**Automatic embedding generation**]({{site.url}}{{site.baseurl}}/vector-search/getting-started/auto-generated-embeddings/): Generate vector embeddings dynamically within OpenSearch using built-in machine learning models, eliminating the need for external preprocessing of your data.
- [**Advanced filtering capabilities**]({{site.url}}{{site.baseurl}}/vector-search/filter-search-knn/): Combine vector search with traditional filters to refine results, enabling precise control over search outcomes while maintaining semantic relevance.
- [**Multi-vector support**]({{site.url}}{{site.baseurl}}/vector-search/specialized-operations/nested-search-knn/): Store and search multiple vectors per document using nested fields, useful for complex documents with multiple components requiring separate vector representations.
- [**Memory-efficient search**]({{site.url}}{{site.baseurl}}/vector-search/optimizing-storage/): Optimize memory usage through various quantization techniques and efficient indexing methods, making vector search practical even with large-scale deployments.
- [**Hybrid search capabilities**]({{site.url}}{{site.baseurl}}/vector-search/ml-powered-search/hybrid-search/): Combine traditional keyword search with vector-based semantic search to use the strengths of both approaches, improving search relevance and accuracy.
