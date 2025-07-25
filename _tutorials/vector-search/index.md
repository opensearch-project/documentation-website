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
other:
  - heading: "Vector operations"
    description: "Learn how to generate embeddings and optimize vector storage"
    link: "/tutorials/vector-search/vector-operations/"
  - heading: "Semantic search"
    description: "Implement semantic search using various machine learning models"
    link: "/tutorials/vector-search/semantic-search/"
canonical_url: https://docs.opensearch.org/latest/tutorials/vector-search/index/
---

# Vector search tutorials

Explore the following tutorials to learn about implementing vector search applications using the OpenSearch vector database. For more information about using OpenSearch as a vector database, see [Vector search]({{site.url}}{{site.baseurl}}/vector-search/).

## Vector search 101

{% include cards.html cards=page.vector_search_101 %}

## Vector search applications

{% include cards.html cards=page.other %}