---
layout: default
title: Tutorials
has_children: true
has_toc: false
nav_order: 140
parent: Getting started
redirect_from:
  - /vector-search/getting-started/tutorials/
  - /ml-commons-plugin/tutorials/
  - /ml-commons-plugin/tutorials/index/
vector_search_101:
  - heading: "Getting started with vector search"
    link: "/vector-search/getting-started/"
  - heading: "Getting started with semantic and hybrid search"
    link: "/vector-search/getting-started/tutorials/neural-search-tutorial/"
semantic_search:
  - heading: "Generating embeddings for arrays of objects"
    link: "/vector-search/getting-started/tutorials/generate-embeddings/"
  - heading: "Semantic search using byte-quantized vectors"
    link: "/vector-search/getting-started/tutorials/semantic-search-byte-vectors/"
conversational_search:
  - heading: "Conversational search using the Cohere Command model"
    link: "/vector-search/getting-started/tutorials/conversational-search-cohere/"
guardrails:
  - heading: "Using Amazon Bedrock guardrails"
    link: "/vector-search/getting-started/tutorials/bedrock-guardrails/"
reranking:
  - heading: "Reranking search results using the Cohere Rerank model"
    link: "/vector-search/getting-started/tutorials/reranking-cohere/"
  - heading: "Reranking search results using models hosted on Amazon Bedrock"
    link: "/vector-search/getting-started/tutorials/reranking-bedrock/"
  - heading: "Reranking search results using the MS MARCO cross-encoder model"
    link: "/vector-search/getting-started/tutorials/reranking-cross-encoder/"
agents:
  - heading: "Retrieval-augmented generation (RAG) chatbot"
    link: "/vector-search/getting-started/tutorials/rag-chatbot/"
  - heading: "RAG with a conversational flow agent"
    link: "/vector-search/getting-started/tutorials/rag-conversational-agent/"
  - heading: "Build your own chatbot"
    link: "/vector-search/getting-started/tutorials/build-chatbot/"
---

# Tutorials

Explore these tutorials to learn how to build machine learning (ML)-powered search applications, from semantic search applications to custom chatbots.

<details open markdown="block">
  <summary>
    Vector search 101
  </summary>
  {: .heading}

{% include cards.html cards=page.vector_search_101 %}

</details>

---

<details markdown="block">
  <summary>
    Semantic search
  </summary>
  {: .heading}

{% include cards.html cards=page.semantic_search %}

</details>

---
    
<details markdown="block">
  <summary>
    Conversational search
  </summary>
  {: .heading}

{% include cards.html cards=page.conversational_search %}

</details>

---

<details markdown="block">
  <summary>
    Using guardrails
  </summary>
  {: .heading}
  
{% include cards.html cards=page.guardrails %}

</details>

---

<details markdown="block">
  <summary>
    Reranking search results
  </summary>
  {: .heading}

{% include cards.html cards=page.reranking %}

</details>

---

<details markdown="block">
  <summary>
    Agents and tools
  </summary>
  {: .heading}
  
{% include cards.html cards=page.agents %}

</details>