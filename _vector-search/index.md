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

OpenSearch is a comprehensive search platform that supports a variety of data types, including vectors. OpenSearch vector database functionality is seamlessly integrated with its generic database function.

In OpenSearch, you can generate vector embeddings, store those embeddings in an index, and use them for vector search in the following ways:

- **Pre-generated embeddings**: Generate embeddings using a library of your choice before ingesting them into OpenSearch. Once you ingest vectors into an index, you can perform a vector similarity search on the vector space. For more information, see [Working with embeddings generated outside of OpenSearch](#working-with-embeddings-generated-outside-of-opensearch). 
- **Auto-generated embeddings**: Automatically generate embeddings within OpenSearch. To use embeddings for semantic search, the ingested text (the corpus) and the query need to be embedded using the same model. [Neural search]({{site.url}}{{site.baseurl}}/search-plugins/neural-search/) packages this functionality, eliminating the need to manage the internal details. For more information, see [Generating vector embeddings within OpenSearch](#generating-vector-embeddings-in-opensearch).


To get started, see [Getting started]({{site.url}}{{site.baseurl}}/vector-database/getting-started/).
