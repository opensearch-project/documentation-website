---
layout: default
title: RAG
parent: Generative AI
has_children: true
has_toc: false
nav_order: 10
redirect_from:
  - /vector-search/tutorials/rag/
  - /vector-search/tutorials/conversational-search/
  - /tutorials/vector-search/rag/
  - /tutorials/gen-ai/rag/
rag:
  - heading: Retrieval-augmented generation (RAG) using the DeepSeek Chat API
    link: /tutorials/gen-ai/rag/rag-deepseek-chat/  
    list:
      - "<b>Platform:</b> OpenSearch, Amazon OpenSearch Service"
      - "<b>Model:</b> DeepSeek Chat" 
      - '<b>Deployment:</b> Provider API'  
  - heading: RAG using DeepSeek-R1 on Amazon Bedrock
    link: /tutorials/gen-ai/rag/rag-deepseek-r1-bedrock/ 
    list:
      - '<b>Platform:</b> OpenSearch, Amazon OpenSearch Service'
      - '<b>Model:</b> DeepSeek-R1'  
      - "<b>Deployment:</b> Amazon Bedrock"  
  - heading: RAG using DeepSeek-R1 in Amazon SageMaker
    link: /tutorials/gen-ai/rag/rag-deepseek-r1-sagemaker/
    list:
      - "<b>Platform:</b> OpenSearch, Amazon OpenSearch Service"  
      - "<b>Model:</b> DeepSeek-R1"  
      - "<b>Deployment:</b> Amazon SageMaker"  
conversational_search:
  - heading: Conversational search using Cohere Command
    link: /tutorials/gen-ai/rag/conversational-search-cohere/ 
    list:
    - "<b>Platform:</b> OpenSearch"
    - "<b>Model:</b> Cohere Command"  
    - "<b>Deployment:</b> Provider API" 
  - heading: Conversational search using OpenAI
    link: /tutorials/gen-ai/rag/conversational-search-openai/ 
    list:
    - "<b>Platform:</b> OpenSearch"
    - "<b>Model:</b> OpenAI GPT-4o"  
    - "<b>Deployment:</b> Provider API" 
  - heading: Conversational search using Anthropic Claude on Amazon Bedrock
    link: /tutorials/gen-ai/rag/conversational-search-claude-bedrock/ 
    list:
    - "<b>Platform:</b> OpenSearch"
    - "<b>Model:</b> Anthropic Claude"  
    - "<b>Deployment:</b> Amazon Bedrock API"  
---

# RAG tutorials

The following machine learning (ML) tutorials show you how to implement retrieval-augmeted generation (RAG).

{% include cards.html cards=page.rag %}

## Conversational search with RAG tutorials

The following tutorials show you how to implement conversational search with RAG.

{% include cards.html cards=page.conversational_search %}