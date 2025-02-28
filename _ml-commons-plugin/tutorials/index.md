---
layout: default
title: Tutorials
has_children: true
has_toc: false
nav_order: 140
---

# Tutorials

Using the OpenSearch machine learning (ML) framework, you can build various applications, from implementing conversational search to building your own chatbot. To learn more, explore the following ML tutorials.

---

## Vector operations  
- [**Generating embeddings from arrays of objects**]({{site.url}}{{site.baseurl}}/ml-commons-plugin/tutorials/vector-operations/generate-embeddings/)
  - Platform: OpenSearch
  - Model: Amazon Titan  
  - Deployment: Amazon Bedrock  

- [**Semantic search using byte-quantized vectors**]({{site.url}}{{site.baseurl}}/ml-commons-plugin/tutorials/vector-operations/semantic-search-byte-vectors/) 
  - Platform: OpenSearch
  - Model: Cohere  
  - Deployment: Provider API  

---

## Semantic search  
- [**Semantic search using the OpenAI embedding model**]({{site.url}}{{site.baseurl}}/ml-commons-plugin/tutorials/semantic-search/semantic-search-openai/)
  - Platform: OpenSearch, Amazon OpenSearch Service
  - Model: OpenAI  
  - Deployment: Provider API  

- [**Semantic search using Cohere Embed**]({{site.url}}{{site.baseurl}}/ml-commons-plugin/tutorials/semantic-search/semantic-search-cohere/)  
  - Platform: OpenSearch, Amazon OpenSearch Service
  - Model: Cohere  
  - Deployment: Provider API  

- [**Semantic search using Cohere Embed on Amazon Bedrock**]({{site.url}}{{site.baseurl}}/ml-commons-plugin/tutorials/semantic-search/semantic-search-bedrock-cohere/)  
  - Platform: OpenSearch, Amazon OpenSearch Service
  - Model: Cohere  
  - Deployment: Amazon Bedrock  

- [**Semantic search using Amazon Bedrock Titan**]({{site.url}}{{site.baseurl}}/ml-commons-plugin/tutorials/semantic-search/semantic-search-bedrock-titan/)  
  - Platform: OpenSearch, Amazon OpenSearch Service
  - Model: Amazon Titan  
  - Deployment: Amazon Bedrock  

- [**Semantic search using Amazon Bedrock Titan in another account**]({{site.url}}{{site.baseurl}}/ml-commons-plugin/tutorials/semantic-search/semantic-search-bedrock-titan-other/)  
  - Platform: OpenSearch, Amazon OpenSearch Service
  - Model: Amazon Titan  
  - Deployment: Amazon Bedrock (in a different account than your Amazon OpenSearch Service account)  

- [**Semantic search using a model on Amazon SageMaker**]({{site.url}}{{site.baseurl}}/ml-commons-plugin/tutorials/semantic-search/semantic-search-sagemaker/)  
  - Platform: OpenSearch, Amazon OpenSearch Service
  - Model: Custom  
  - Deployment: Amazon SageMaker  

- [**Semantic search using AWS CloudFormation and Amazon SageMaker**]({{site.url}}{{site.baseurl}}/ml-commons-plugin/tutorials/semantic-search/semantic-search-cfn-sagemaker/)  
  - Platform: OpenSearch, Amazon OpenSearch Service
  - Model: Custom  
  - Deployment: Amazon SageMaker + CloudFormation  

- [**Semantic search using an asymmetric model**]({{site.url}}{{site.baseurl}}/ml-commons-plugin/tutorials/vector-operations/semantic-search-byte-vectors/) 
  - Platform: OpenSearch
  - Model: Hugging Face Multilingual-E5-small  
  - Deployment: Local cluster 

- [**Semantic search using text chunking**]({{site.url}}{{site.baseurl}}/ml-commons-plugin/tutorials/semantic-search/long-document/) 
  - Platform: OpenSearch, Amazon OpenSearch Service
  - Model: Amazon Titan Text Embeddings  
  - Deployment: Amazon Bedrock

---

## Conversational search with RAG  
- [**Conversational search using Cohere Command**]({{site.url}}{{site.baseurl}}/ml-commons-plugin/tutorials/conversational-search/conversational-search-cohere/)  
  - Platform: OpenSearch
  - Model: Cohere  
  - Deployment: Provider API  

---

## Search result reranking  
- [**Reranking search results using Cohere Rerank**]({{site.url}}{{site.baseurl}}/ml-commons-plugin/tutorials/reranking/reranking-cohere/)  
  - Platform: OpenSearch
  - Model: Cohere Rerank 
  - Deployment: Provider API  

- [**Reranking search results using Cohere Rerank on Amazon Bedrock**]({{site.url}}{{site.baseurl}}/ml-commons-plugin/tutorials/reranking/reranking-cohere-bedrock/)  
  - Platform: OpenSearch, Amazon OpenSearch Service
  - Model: Cohere Rerank
  - Deployment: Amazon Bedrock 

- [**Reranking search results using Amazon Bedrock models**]({{site.url}}{{site.baseurl}}/ml-commons-plugin/tutorials/reranking/reranking-bedrock/)  
  - Platform: OpenSearch
  - Model: Amazon Bedrock reranker models  
  - Deployment: Amazon Bedrock  

- [**Reranking search results using a cross-encoder in Amazon SageMaker**]({{site.url}}{{site.baseurl}}/ml-commons-plugin/tutorials/reranking/reranking-cross-encoder/)  
  - Platform: OpenSearch, Amazon OpenSearch Service
  - Model: Hugging Face MS MARCO  
  - Deployment: Amazon SageMaker 

- [**Reranking search results using a reranker in Amazon SageMaker**]({{site.url}}{{site.baseurl}}/ml-commons-plugin/tutorials/reranking/reranking-sagemaker/)  
  - Platform: OpenSearch, Amazon OpenSearch Service
  - Model: Hugging Face BAAI/bge-reranker 
  - Deployment: Amazon SageMaker 

- [**Reranking search results by a field**]({{site.url}}{{site.baseurl}}/ml-commons-plugin/tutorials/reranking/reranking-by-field/)  
  - Platform: OpenSearch, Amazon OpenSearch Service
  - Model: Cohere Rerank 
  - Deployment: Provider API  

---

## RAG
- [**Retrieval-augmented generation (RAG) using the DeepSeek Chat API**]({{site.url}}{{site.baseurl}}/ml-commons-plugin/tutorials/rag/rag-deepseek-chat/)  
  - Platform: OpenSearch, Amazon OpenSearch Service
  - Model: DeepSeek  
  - Deployment: Provider API  

- [**RAG using DeepSeek-R1 on Amazon Bedrock**]({{site.url}}{{site.baseurl}}/ml-commons-plugin/tutorials/rag/rag-deepseek-r1-bedrock/)  
  - Platform: OpenSearch, Amazon OpenSearch Service
  - Model: DeepSeek  
  - Deployment: Amazon Bedrock  

- [**RAG using DeepSeek-R1 in Amazon SageMaker**]({{site.url}}{{site.baseurl}}/ml-commons-plugin/tutorials/rag/rag-deepseek-r1-sagemaker/)
  - Platform: OpenSearch, Amazon OpenSearch Service  
  - Model: DeepSeek  
  - Deployment: Amazon SageMaker  

---

## Chatbots and agents  
- [**RAG chatbot**]({{site.url}}{{site.baseurl}}/ml-commons-plugin/tutorials/chatbots/rag-chatbot/)  
  - Platform: OpenSearch
  - Model: Anthropic Claude  
  - Deployment: Amazon Bedrock  

- [**RAG with a conversational flow agent**]({{site.url}}{{site.baseurl}}/ml-commons-plugin/tutorials/chatbots/rag-conversational-agent/)  
  - Platform: OpenSearch
  - Model: Anthropic Claude  
  - Deployment: Amazon Bedrock  

- [**Build your own chatbot**]({{site.url}}{{site.baseurl}}/ml-commons-plugin/tutorials/chatbots/build-chatbot/)  
  - Platform: OpenSearch
  - Model: Anthropic Claude  
  - Deployment: Amazon Bedrock  

---

## Model controls  
- [**Amazon Bedrock guardrails**]({{site.url}}{{site.baseurl}}/ml-commons-plugin/tutorials/model-controls/bedrock-guardrails/)  
  - Platform: OpenSearch
  - Model: Anthropic Claude  
  - Deployment: Amazon Bedrock  
