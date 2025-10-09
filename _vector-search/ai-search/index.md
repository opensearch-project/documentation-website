---
layout: default
title: AI search
nav_order: 45
has_children: true
has_toc: false
redirect_from: 
  - /neural-search-plugin/index/
  - /search-plugins/neural-search/
  - /vector-search/ai-search/
model_cards:
  - heading: "Use a pretrained model provided by OpenSearch"
    link: "/ml-commons-plugin/pretrained-models/"
  - heading: "Upload your own model to OpenSearch"
    link: "/ml-commons-plugin/custom-local-models/"
  - heading: "Connect to a model hosted on an external platform"
    link: "/ml-commons-plugin/remote-models/index/"
tutorial_cards:
  - heading: "Getting started with semantic and hybrid search"
    description: "Learn how to implement semantic and hybrid search"
    link: "/vector-search/tutorials/neural-search-tutorial/"
search_method_cards:
  - heading: "Semantic search"
    description: "Uses dense retrieval based on text embedding models to search text data."
    link: "/vector-search/ai-search/semantic-search/"
  - heading: "Hybrid search"
    description: "Combines keyword and semantic search to improve search relevance."
    link: "/vector-search/ai-search/hybrid-search/"
  - heading: "Multimodal search"
    description: "Uses multimodal embedding models to search text and image data."
    link: "/vector-search/ai-search/multimodal-search/"
  - heading: "Neural sparse search"
    description: "Uses sparse retrieval based on sparse embedding models to search text data."
    link: "/vector-search/ai-search/neural-sparse-search/"
  - heading: "Neural sparse ANN search"
    description: "Uses approximate nearest neighbor techniques on sparse vectors for improved performance at scale."
    link: "/vector-search/ai-search/neural-sparse-ann/"
  - heading: "Conversational search with RAG"
    description: "Uses retrieval-augmented generation (RAG) and conversational memory to provide context-aware responses."
    link: "/vector-search/ai-search/conversational-search/"
---

# AI search

AI search streamlines your workflow by generating embeddings automatically. OpenSearch converts text to vectors during indexing and querying. It creates and indexes vector embeddings for documents and then processes query text into embeddings to find and return the most relevant results.

## Prerequisite

Before using AI search, you must set up an ML model for embedding generation. When selecting a model, you have the following options:

- Use a pretrained model provided by OpenSearch. For more information, see [OpenSearch-provided pretrained models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/).

- Upload your own model to OpenSearch. For more information, see [Custom local models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/custom-local-models/).

- Connect to a foundation model hosted on an external platform. For more information, see [Connecting to externally hosted models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/).

---

## Tutorial

{% include cards.html cards=page.tutorial_cards %}

---

## AI search methods

Once you set up an ML model, choose one of the following search methods.

{% include cards.html cards=page.search_method_cards %}
