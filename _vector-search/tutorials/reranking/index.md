---
layout: default
title: Reranking search results
parent: Tutorials
has_children: true
has_toc: false
nav_order: 100
redirect_from:
  - /vector-search/tutorials/reranking/
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
---

# Reranking search results tutorials

The following machine learning (ML) tutorials show you how to implement search result reranking.

{% include cards.html cards=page.reranking %}