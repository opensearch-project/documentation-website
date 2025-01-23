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

Traditional lexical search, based on term frequency models like BM25, is widely used and effective for many search applications. However, lexical search techniques require significant investment in time and expertise to tune them to account for the meaning or relevance of the terms searched. To embed semantic understanding into your search application, you can use machine learning embedding models that can encode the meaning and context of documents, images, and audio into vectors for similarity search. These embedded meanings can be searched using the k-nearest neighbors (k-NN) functionality provided by OpenSearch. 

Using OpenSearch as a vector database brings together the power of traditional search, analytics, and vector search in one complete package. OpenSearch’s vector database capabilities can accelerate artificial intelligence (AI) application development by reducing the effort for builders to operationalize, manage, and integrate AI-generated assets. Bring your models, vectors, and metadata into OpenSearch to power vector, lexical, and hybrid search and analytics, with performance and scalability built in.

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

Simplify your search process by letting OpenSearch handle embedding generation. Follow this documentation sequence to begin using text-to-embedding search:

{% include list.html list_items=page.ml_steps%}