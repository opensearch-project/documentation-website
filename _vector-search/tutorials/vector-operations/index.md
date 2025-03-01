---
layout: default
title: Vector operations
parent: Tutorials
has_children: true
has_toc: false
nav_order: 10
redirect_from:
  - /vector-search/tutorials/vector-operations/
vector_operations:
  - heading: "Generating embeddings from arrays of objects"
    list: 
      - "<b>Platform</b>: OpenSearch" 
      - "<b>Model</b>: Amazon Titan"
      - "<b>Deployment</b>: Amazon Bedrock" 
    link: "/vector-search/tutorials/vector-operations/generate-embeddings/"
  - heading: "Semantic search using byte-quantized vectors"
    list:
      - "<b>Platform:</b> OpenSearch"
      - "<b>Model:</b> Cohere Embed"  
      - "<b>Deployment:</b> Provider API"  
    link: "/vector-search/tutorials/vector-operations/semantic-search-byte-vectors/"
---

# Vector operation tutorials

The following tutorials show you how to implement vector operations.

{% include cards.html cards=page.vector_operations %}