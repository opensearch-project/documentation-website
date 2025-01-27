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
  - heading: "Optimizing vector search performance"
    description: "Learn about optimizing vector search reduce memory usage and improve performance."
    link: "/vector-search/optimizing-performance/"
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
  - heading: "Optimizing vector search performance"
    description: "Learn about optimizing vector search reduce memory usage and improve performance."
    link: "/vector-search/optimizing-performance/"
---

# Vector search

Traditional lexical search, based on term frequency models like BM25, is effective for many search applications. However, these techniques often require substantial time and expertise to fine-tune for capturing the meaning or relevance of search terms. To add semantic understanding to your search application, you can use machine learning embedding models. These models encode the meaning and context of text, images, and audio into vectors, enabling similarity search. OpenSearch supports this functionality through its k-nearest neighbors (k-NN) search capabilities. 

OpenSearch combines traditional search, analytics, and vector search into a single, unified solution. Its vector database capabilities simplify the development of artificial intelligence (AI) applications by reducing the effort required to manage and integrate AI-generated assets. You can bring your models, vectors, and metadata into OpenSearch to enable vector, lexical, and hybrid search and analytics, all with built-in performance and scalability.

## Using OpenSearch as a vector database

OpenSearch provides an integrated  vector database that can support AI systems by serving as a knowledge base. This benefits AI applications like generative AI and natural language search by providing a long-term memory of AI-generated outputs. These outputs can be used to enhance information retrieval and analytics, improve efficiency and stability, and give generative AI models a broader and deeper pool of data from which to draw more accurate responses to queries.

<span class="centering-container">
[Get started]({{site.url}}{{site.baseurl}}/vector-search/getting-started/){: .btn-dark-blue}
</span>

---

## Bring your own vectors

If you’ve already generated your own vector embeddings, OpenSearch makes it easy to ingest and search them. Follow this documentation sequence to get started:

{% include list.html list_items=page.raw_steps%}

--- 

## Seamless text-to-embedding search

Simplify your search process by letting OpenSearch handle embedding generation. Follow this documentation sequence to get started:

{% include list.html list_items=page.ml_steps%}