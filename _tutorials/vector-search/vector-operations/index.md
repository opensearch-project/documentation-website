---
layout: default
title: Vector operations
parent: Vector search
has_children: true
has_toc: false
nav_order: 10
redirect_from:
  - /vector-search/tutorials/vector-operations/
  - /tutorials/vector-search/vector-operations/
vector_operations:
  - heading: "Generating embeddings from arrays of objects"
    list: 
      - "<b>Platform</b>: OpenSearch" 
      - "<b>Model</b>: Amazon Titan"
      - "<b>Deployment</b>: Amazon Bedrock" 
    link: "/tutorials/vector-search/vector-operations/generate-embeddings/"
  - heading: "Semantic search using byte-quantized vectors"
    list:
      - "<b>Platform:</b> OpenSearch"
      - "<b>Model:</b> Cohere Embed"  
      - "<b>Deployment:</b> Provider API"  
    link: "/tutorials/vector-search/vector-operations/semantic-search-byte-vectors/"
  - heading: "Optimizing vector search using Cohere compressed embeddings"
    list:
      - "<b>Platform:</b> OpenSearch"
      - "<b>Model:</b> Cohere Embed Multilingual v3"  
      - "<b>Deployment:</b> Amazon Bedrock"  
    link: "/tutorials/vector-search/vector-operations/optimize-compression/"
---

# Vector operation tutorials

The following tutorials show you how to implement vector operations.

{% include cards.html cards=page.vector_operations %}