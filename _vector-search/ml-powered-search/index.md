---
layout: default
title: ML-powered search
nav_order: 50
has_children: true
has_toc: false
redirect_from: 
  - /neural-search-plugin/index/
  - /search-plugins/neural-search/
  - /vector-search/ml-powered-search/
model_cards:
  - heading: "Use a pretrained model provided by OpenSearch"
    link: "/ml-commons-plugin/pretrained-models/"
  - heading: "Upload your own model to OpenSearch"
    link: "/ml-commons-plugin/custom-local-models/"
  - heading: "Connect to a model hosted on an external platform"
    link: "/ml-commons-plugin/remote-models/index/"
tutorial_cards:
  - heading: "Semantic and hybrid search tutorial"
    description: "Learn how to implement semantic and hybrid search"
    link: "/vector-search/getting-started/neural-search-tutorial/"
search_method_cards:
  - heading: "Semantic search"
    description: "Uses dense retrieval based on text embedding models to search text data."
    link: "/vector-search/ml-powered-search/semantic-search/"
  - heading: "Hybrid search"
    description: "Combines keyword and neural search to improve search relevance."
    link: "/vector-search/ml-powered-search/hybrid-search/"
  - heading: "Multimodal search"
    description: "Uses multimodal embedding models to search text and image data."
    link: "/vector-search/ml-powered-search/multimodal-search/"
  - heading: "Neural sparse search"
    description: "Uses sparse retrieval based on sparse embedding models to search text data."
    link: "/vector-search/ml-powered-search/neural-sparse-search/"
  - heading: "Conversational search"
    description: "Uses retrieval-augmented generation and conversational memory to provide context-aware responses."
    link: "/vector-search/ml-powered-search/conversational-search/"
chunking_cards:
  - heading: "Text chunking"
    description: "Use text chunking to ensure adherence to token limit for embedding models."
    link: "/vector-search/ml-powered-search/text-chunking/"
---

# ML-powered search

ML-powered search streamlines your workflow by generating embeddings automatically. OpenSearch converts text into vectors during indexing and querying. It creates and indexes vector embeddings for documents, then processes query text into embeddings to find and return the most relevant results.

## Prerequisite

Before using text-to-embedding search, you must set up an ML model for embedding generation. When selecting a model, you have the following options:

{% include cards.html cards=page.model_cards %}

---

## Tutorial

{% include cards.html cards=page.tutorial_cards %}

---

## ML-powered search methods

Once you set up an ML model, choose one of the following search methods.

{% include cards.html cards=page.search_method_cards %}

---

{% include cards.html cards=page.chunking_cards %}