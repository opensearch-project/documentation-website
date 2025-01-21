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
raw_steps:
  - heading: "Pre-generated embeddings quickstart"
    description: "Follow a quickstart tutorial for raw vector search."
    link: "/vector-search/getting-started/pre-generated-embeddings/"
  - heading: "Vector search techniques"
    description: "Select a search technique and configure your vector search."
    link: "/vector-search/vector-search-techniques/"
  - heading: "Specialized vector search"
    description: "Learn about specialized vector search use cases, such as filtering, nested field search, and radial search."
    link: "/vector-search/specialized-operations/"
  - heading: "Optimizing vector storage"
    description: "Learn about storage saving techniques, such as disk-based vector search and vector quantization."
    link: "/vector-search/optimizing-storage/"
  - heading: "Performance tuning"
    description: "Improve search performance."
    link: "/vector-search/performance-tuning/"
ml_steps:
  - heading: "Auto-generated embeddings quickstart"
    description: "Follow a quickstart tutorial for text-to-embedding search."
    link: "/vector-search/getting-started/auto-generated-embeddings/"
  - heading: "Semantic and hybrid search tutorial"
    description: "Dive into semantic search and hybrid search."
    link: "/vector-search/getting-started/neural-search-tutorial/"
  - heading: "ML-powered search"
    description: "Learn about many ML-powered search options that OpenSearch provides."
    link: "/vector-search/ml-powered-search/"
  - heading: "Specialized vector search"
    description: "Learn about specialized vector search use cases, such as filtering, nested field search, and radial search."
    link: "/vector-search/specialized-operations/"
  - heading: "Optimizing vector storage"
    description: "Learn about storage saving techniques, such as disk-based vector search and vector quantization."
    link: "/vector-search/optimizing-storage/"
  - heading: "Performance tuning"
    description: "Improve search performance."
    link: "/vector-search/performance-tuning/"
---

# Vector search

OpenSearch is a comprehensive search platform that supports a variety of data types, including vectors. OpenSearch vector database functionality is seamlessly integrated with its generic database function.

In OpenSearch, you can generate vector embeddings, store those embeddings in an index, and use them for vector search.

<span class="centering-container">
[Get started]({{site.url}}{{site.baseurl}}/vector-search/getting-started/){: .btn-dark-blue}
</span>

---

## Bring your own vectors

If you’ve already generated your own vector embeddings, OpenSearch makes it easy to ingest and search them. Follow this documentation sequence to get started:

{% include list.html list_items=page.raw_steps%}

--- 

## Seamless text-to-embedding search

Simplify your search process by letting OpenSearch handle embedding generation. Follow this documentation sequence to begin using text-to-embedding search:

{% include list.html list_items=page.ml_steps%}