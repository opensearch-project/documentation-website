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
tutorial_cards:
  - heading: "Get started with vector search"
    description: "Build powerful similarity search applications using your existing vectors or embeddings"
    link: "/vector-search/getting-started/"
  - heading: "Generate embeddings automatically"
    description: "Streamline your vector search using OpenSearch's built-in embedding generation"
    link: "/vector-search/getting-started/auto-generated-embeddings/"
more_cards:
  - heading: "AI search"
    description: "Discover AI search, from <b>semantic</b>, <b>hybrid</b>, and <b>multimodal</b> search to <b>RAG</b>"
    link: "/vector-search/ai-search/"
  - heading: "Tutorials"
    description: "Follow step-by-step tutorials to build AI-powered search for your applications"
    link: "/vector-search/tutorials/"
  - heading: "Advanced filtering"
    description: "Refine search results while maintaining semantic relevance"
    link: "/vector-search/filter-search-knn/"
  - heading: "Memory-efficient search"
    description: "Reduce memory footprint using vector compression methods"
    link: "/vector-search/optimizing-storage/"
  - heading: "Sparse vector support"
    description: "Combine semantic understanding with traditional search efficiency using <b>neural sparse search</b>"
    link: "/vector-search/ai-search/neural-sparse-search/"
  - heading: "Multi-vector support"
    description: "Store and search multiple vectors per document using nested fields"
    link: "/vector-search/specialized-operations/nested-search-knn/"
items:
  - heading: "Create an index"
    description: "Create a vector index for storing your embeddings."
    link: "/vector-search/creating-vector-index/"
  - heading: "Ingest data"
    description: "Ingest your data into the index."
    link: "/vector-search/ingesting-data/"
  - heading: "Search data"
    description: "Use raw vector search or AI-powered methods like semantic, hybrid, multimodal, or neural sparse search. Add RAG to build conversational search."
    link: "/vector-search/searching-data/"
---

# Vector search

OpenSearch [vector search]({{site.url}}{{site.baseurl}}/vector-search/getting-started/vector-search-basics/) provides a complete vector database solution for building efficient AI applications. Store and search vector embeddings alongside your existing data, making it easy to implement semantic search, retrieval-augmented generation (RAG), recommendation systems, and other AI-powered applications.

{% include cards.html cards=page.tutorial_cards %}

## Overview

You can bring your own vectors or let OpenSearch generate embeddings automatically from your data. See [Preparing vectors]({{site.url}}{{site.baseurl}}/vector-search/getting-started/vector-search-options/).
{: .info }

{% include list.html list_items=page.items%}

<span class="centering-container">
[Get started]({{site.url}}{{site.baseurl}}/vector-search/getting-started/){: .btn-dark-blue}
</span>

## Build your solution 

{% include cards.html cards=page.more_cards %}