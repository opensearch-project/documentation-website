---
layout: default
title: Getting started
nav_order: 10
has_children: true
redirect_from:
  - /vector-database/getting-started/
---

# Getting started with vector search

You can either upload pre-generated embeddings to OpenSearch or have OpenSearch automatically generate embeddings from your text.

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

