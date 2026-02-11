---
layout: default
title: Vector search
has_children: true
has_toc: false
nav_order: 10
redirect_from:
  - /vector-search/tutorials/
  - /ml-commons-plugin/tutorials/
  - /ml-commons-plugin/tutorials/index/
  - /tutorials/vector-search/
vector_search_101:
  - heading: "Getting started with vector search"
    description: "Learn how to run a raw vector search"
    link: "/vector-search/getting-started/"
  - heading: "Getting started with semantic and hybrid search"
    description: "Build your first AI search application"
    link: "/tutorials/vector-search/neural-search-tutorial/"
ai_search_types:
  - heading: "Semantic search"
    description: "Understands the meaning and intent behind a query to deliver more relevant results"
    link: "/vector-search/ai-search/semantic-search/"
  - heading: "Hybrid search"
    description: "Improves relevance by combining keyword-based and semantic search techniques"
    link: "/vector-search/ai-search/hybrid-search/"
  - heading: "Multimodal search"
    description: "Enables searching across different types of data, such as text and images"
    link: "/vector-search/ai-search/multimodal-search/"
  - heading: "Neural sparse search"
    description: "Uses sparse vector representations and deep learning models for efficient retrieval"
    link: "/vector-search/ai-search/neural-sparse-search/"
  - heading: "Conversational search with RAG"
    description: "Combines natural dialogue with retrieval-augmented generation to provide contextual answers"
    link: "/vector-search/ai-search/conversational-search/"
other:
  - heading: "Vector operations"
    description: "Learn how to generate embeddings and optimize vector storage"
    link: "/tutorials/vector-search/vector-operations/"
  - heading: "Semantic search"
    description: "Implement semantic search using various machine learning models"
    link: "/tutorials/vector-search/semantic-search/"
  - heading: "Using semantic highlighting"
    description: "Learn how to highlight the most semantically relevant sentences in the results"
    link: "/tutorials/vector-search/semantic-highlighting-tutorial/"
canonical_url: https://docs.opensearch.org/latest/tutorials/vector-search/index/
---

# Vector search tutorials

Explore the following tutorials to learn about implementing vector search applications using the OpenSearch vector database. For more information about using OpenSearch as a vector database, see [Vector search]({{site.url}}{{site.baseurl}}/vector-search/).

## Vector search 101

{% include cards.html cards=page.vector_search_101 %}

## AI search types

{% include cards.html cards=page.ai_search_types %}

## Vector search applications

{% include cards.html cards=page.other %}