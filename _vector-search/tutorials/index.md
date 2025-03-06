---
layout: default
title: Tutorials
has_children: true
has_toc: false
nav_order: 47
redirect_from:
  - /vector-search/tutorials/
  - /ml-commons-plugin/tutorials/
  - /ml-commons-plugin/tutorials/index/
vector_search_101:
  - heading: "Getting started with vector search"
    link: "/vector-search/getting-started/"
  - heading: "Getting started with semantic and hybrid search"
    link: "/vector-search/tutorials/neural-search-tutorial/"
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
      - "<b>Model:</b> Cohere Embed v3"  
      - "<b>Deployment:</b> Provider API"  
    link: "/vector-search/tutorials/vector-operations/semantic-search-byte-vectors/"
  - heading: "Optimizing vector search using Cohere compressed embeddings"
    list:
      - "<b>Platform:</b> OpenSearch"
      - "<b>Model:</b> Cohere Embed Multilingual v3"  
      - "<b>Deployment:</b> Amazon Bedrock"  
    link: "/vector-search/tutorials/vector-operations/optimize-compression/"
semantic_search:
  - heading: "Semantic search using the OpenAI embedding model"
    link: "/vector-search/tutorials/semantic-search/semantic-search-openai/"
    list:
      - "<b>Platform:</b> OpenSearch, Amazon OpenSearch Service"
      - "<b>Model:</b> OpenAI embedding"  
      - "<b>Deployment:</b> Provider API"  
  - heading: "Semantic search using Cohere Embed"
    link: "/vector-search/tutorials/semantic-search/semantic-search-cohere/"
    list:
      - "<b>Platform:</b> OpenSearch, Amazon OpenSearch Service"
      - "<b>Model:</b> Cohere Embed"  
      - "<b>Deployment:</b> Provider API"  
  - heading: "Semantic search using Cohere Embed on Amazon Bedrock"
    link: "/vector-search/tutorials/semantic-search/semantic-search-bedrock-cohere/"
    list:
      - "<b>Platform:</b> OpenSearch, Amazon OpenSearch Service"
      - "<b>Model:</b> Cohere Embed"  
      - "<b>Deployment:</b> Amazon Bedrock"  
  - heading: Semantic search using Amazon Bedrock Titan
    link: "/vector-search/tutorials/semantic-search/semantic-search-bedrock-titan/"
    list:
      - "<b>Platform:</b> OpenSearch, Amazon OpenSearch Service"
      - "<b>Model:</b> Amazon Titan"  
      - "<b>Deployment:</b> Amazon Bedrock"  
  - heading: "Semantic search using Amazon Bedrock Titan in another account"
    link: /vector-search/tutorials/semantic-search/semantic-search-bedrock-titan-other/
    list:
      - "<b>Platform:</b> OpenSearch, Amazon OpenSearch Service"
      - "<b>Model:</b> Amazon Titan"  
      - "<b>Deployment:</b> Amazon Bedrock"
  - heading: Semantic search using a model in Amazon SageMaker
    link: /vector-search/tutorials/semantic-search/semantic-search-sagemaker/
    list: 
      - "<b>Platform:</b> OpenSearch, Amazon OpenSearch Service"
      - "<b>Model:</b> Custom"  
      - "<b>Deployment:</b> Amazon SageMaker"  
  - heading: Semantic search using AWS CloudFormation and Amazon SageMaker
    link: /vector-search/tutorials/semantic-search/semantic-search-cfn-sagemaker/
    list:
      - "<b>Platform:</b> OpenSearch, Amazon OpenSearch Service"
      - "<b>Model:</b> Custom"  
      - "<b>Deployment:</b> Amazon SageMaker + CloudFormation" 
  - heading: Semantic search using an asymmetric model
    link: /vector-search/tutorials/semantic-search/semantic-search-asymmetric/
    list: 
      - "<b>Platform:</b> OpenSearch"
      - "<b>Model:</b> Hugging Face Multilingual-E5-small "  
      - "<b>Deployment:</b> Local cluster"  
  - heading: "Semantic search using text chunking"
    link: /vector-search/tutorials/semantic-search/long-document/
    list:
      - "<b>Platform:</b> OpenSearch, Amazon OpenSearch Service"
      - "<b>Model:</b> Amazon Titan Text Embeddings"  
      - "<b>Deployment:</b> Amazon Bedrock"
conversational_search:
  - heading: Conversational search using Cohere Command
    link: /vector-search/tutorials/conversational-search/conversational-search-cohere/ 
    list:
    - "<b>Platform:</b> OpenSearch"
    - "<b>Model:</b> Cohere Command"  
    - "<b>Deployment:</b> Provider API"
  - heading: Conversational search using OpenAI
    link: /vector-search/tutorials/conversational-search/conversational-search-openai/ 
    list:
    - "<b>Platform:</b> OpenSearch"
    - "<b>Model:</b> OpenAI GPT-4o"  
    - "<b>Deployment:</b> Provider API" 
  - heading: Conversational search using Anthropic Claude on Amazon Bedrock
    link: /vector-search/tutorials/conversational-search/conversational-search-claude-bedrock/ 
    list:
    - "<b>Platform:</b> OpenSearch"
    - "<b>Model:</b> Anthropic Claude"  
    - "<b>Deployment:</b> Amazon Bedrock API"  
reranking:
  - heading: Reranking search results using Cohere Rerank
    link: /vector-search/tutorials/reranking/reranking-cohere/
    list:
      - "<b>Platform:</b> OpenSearch"
      - "<b>Model:</b> Cohere Rerank"  
      - "<b>Deployment:</b> Provider API"  
  - heading: Reranking search results using Cohere Rerank on Amazon Bedrock
    link: /vector-search/tutorials/reranking/reranking-cohere-bedrock/
    list:
      - "<b>Platform:</b> OpenSearch, Amazon OpenSearch Service"
      - "<b>Model:</b> Cohere Rerank"  
      - "<b>Deployment:</b> Amazon Bedrock" 
  - heading: Reranking search results using Amazon Bedrock models
    link: /vector-search/tutorials/reranking/reranking-bedrock/
    list:
      - "<b>Platform:</b> OpenSearch"
      - "<b>Model:</b> Amazon Bedrock reranker models"  
      - "<b>Deployment:</b> Amazon Bedrock"  
  - heading: Reranking search results using a cross-encoder in Amazon SageMaker
    link: /vector-search/tutorials/reranking/reranking-cross-encoder/
    list:
      - "<b>Platform:</b> OpenSearch"
      - "<b>Model:</b> Hugging Face MS MARCO"  
      - "<b>Deployment:</b> Amazon SageMaker"  
  - heading: Reranking search results using a reranker in Amazon SageMaker
    link: /vector-search/tutorials/reranking/reranking-sagemaker/
    list:
      - "<b>Platform:</b> OpenSearch, Amazon OpenSearch Service"
      - "<b>Model:</b> Hugging Face BAAI/bge-reranker"  
      - "<b>Deployment:</b> Amazon SageMaker" 
  - heading: Reranking search results by a field
    link: /vector-search/tutorials/reranking/reranking-by-field/
    list:
      - "<b>Platform:</b> OpenSearch, Amazon OpenSearch Service"
      - "<b>Model:</b> Cohere Rerank"  
      - "<b>Deployment:</b> Provider API" 
rag:
  - heading: Retrieval-augmented generation (RAG) using the DeepSeek Chat API
    link: /vector-search/tutorials/rag/rag-deepseek-chat/  
    list:
      - "<b>Platform:</b> OpenSearch, Amazon OpenSearch Service"
      - "<b>Model:</b> DeepSeek Chat" 
      - '<b>Deployment:</b> Provider API'  
  - heading: RAG using DeepSeek-R1 on Amazon Bedrock
    link: /vector-search/tutorials/rag/rag-deepseek-r1-bedrock/ 
    list:
      - '<b>Platform:</b> OpenSearch, Amazon OpenSearch Service'
      - '<b>Model:</b> DeepSeek-R1'  
      - "<b>Deployment:</b> Amazon Bedrock"  
  - heading: RAG using DeepSeek-R1 in Amazon SageMaker
    link: /vector-search/tutorials/rag/rag-deepseek-r1-sagemaker/
    list:
      - "<b>Platform:</b> OpenSearch, Amazon OpenSearch Service"  
      - "<b>Model:</b> DeepSeek-R1"  
      - "<b>Deployment:</b> Amazon SageMaker"  
chatbots:
  - heading: RAG chatbot
    link: vector-search/tutorials/chatbots/rag-chatbot/
    list:
      - "<b>Platform:</b> OpenSearch"
      - "<b>Model:</b> Anthropic Claude" 
      - "<b>Deployment:</b> Amazon Bedrock"  
  - heading: RAG with a conversational flow agent
    link: /vector-search/tutorials/chatbots/rag-conversational-agent/
    list: 
      - "<b>Platform:</b> OpenSearch"
      - "<b>Model:</b> Anthropic Claude"  
      - "<b>Deployment:</b> Amazon Bedrock"  
  - heading: Build your own chatbot
    link: /vector-search/tutorials/chatbots/build-chatbot/
    list: 
      - "<b>Platform:</b> OpenSearch"
      - "<b>Model:</b> Anthropic Claude"  
      - "<b>Deployment:</b> Amazon Bedrock" 
model_controls:
  - heading: "Amazon Bedrock guardrails"
    link: "/vector-search/tutorials/model-controls/bedrock-guardrails/"
    list: 
      - "<b>Platform:</b> OpenSearch"
      - "<b>Model:</b> Anthropic Claude"  
      - "<b>Deployment:</b> Amazon Bedrock" 
---

# Tutorials

Using the OpenSearch machine learning (ML) framework, you can build various applications, from implementing semantic search to building your own chatbot. To learn more, explore the following ML tutorials:

- [Vector search 101](#vector-search-101)
- [Vector operations](#vector-operations)
- [Semantic search](#semantic-search)
- [Conversational search with RAG](#conversational-search)
- [Search result reranking](#search-result-reranking)
- [RAG](#rag)
- [Chatbots and agents](#chatbots)
- [Model controls](#model-controls)

---

<p id="vector-search-101"></p>

<details open markdown="block">
  <summary>
    Vector Search 101
  </summary>
  {: .heading}

{% include cards.html cards=page.vector_search_101 %}

</details>

---

<p id="vector-operations"></p>

<details open markdown="block">
  <summary>
    Vector operations
  </summary>
  {: .heading}

{% include cards.html cards=page.vector_operations %}

</details>

---

<p id="semantic-search"></p>

<details open markdown="block">
  <summary>
    Semantic search
  </summary>
  {: .heading}

{% include cards.html cards=page.semantic_search %}

</details>

---

<p id="conversational-search"></p>

<details open markdown="block">
  <summary>
    Conversational search with RAG
  </summary>
  {: .heading}

{% include cards.html cards=page.conversational_search %}

</details>

---

<p id="search-result-reranking"></p>

<details open markdown="block">
  <summary>
    Search result reranking
  </summary>
  {: .heading}

{% include cards.html cards=page.reranking %}

</details>

---

<p id="rag"></p>

<details open markdown="block">
  <summary>
    RAG
  </summary>
  {: .heading}

{% include cards.html cards=page.rag %}

</details>

---

<p id="chatbots"></p>

<details open markdown="block">
  <summary>
    Chatbots and agents
  </summary>
  {: .heading}

{% include cards.html cards=page.chatbots %}

</details>

---

<p id="model-controls"></p>

<details open markdown="block">
  <summary>
    Model controls
  </summary>
  {: .heading}
  
{% include cards.html cards=page.model_controls %}

</details>
