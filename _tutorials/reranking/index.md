---
layout: default
title: Reranking search results
has_children: true
has_toc: false
nav_order: 20
redirect_from:
  - /vector-search/tutorials/reranking/
  - /tutorials/reranking/
reranking:
  - heading: Reranking search results using Cohere Rerank
    link: /tutorials/reranking/reranking-cohere/
    list:
      - "<b>Platform:</b> OpenSearch"
      - "<b>Model:</b> Cohere Rerank"  
      - "<b>Deployment:</b> Provider API"  
  - heading: Reranking search results using Cohere Rerank on Amazon Bedrock
    link: /tutorials/reranking/reranking-cohere-bedrock/
    list:
      - "<b>Platform:</b> OpenSearch, Amazon OpenSearch Service"
      - "<b>Model:</b> Cohere Rerank"  
      - "<b>Deployment:</b> Amazon Bedrock" 
  - heading: Reranking search results using Amazon Bedrock models
    link: /tutorials/reranking/reranking-bedrock/
    list:
      - "<b>Platform:</b> OpenSearch"
      - "<b>Model:</b> Amazon Bedrock reranker models"  
      - "<b>Deployment:</b> Amazon Bedrock"  
  - heading: Reranking search results using a cross-encoder in Amazon SageMaker
    link: /tutorials/reranking/reranking-cross-encoder/
    list:
      - "<b>Platform:</b> OpenSearch"
      - "<b>Model:</b> Hugging Face MS MARCO"  
      - "<b>Deployment:</b> Amazon SageMaker" 
  - heading: Reranking search results using a reranker in Amazon SageMaker
    link: /tutorials/reranking/reranking-sagemaker/
    list:
      - "<b>Platform:</b> OpenSearch, Amazon OpenSearch Service"
      - "<b>Model:</b> Hugging Face BAAI/bge-reranker"  
      - "<b>Deployment:</b> Amazon SageMaker" 
  - heading: Reranking search results by a field
    link: /tutorials/reranking/reranking-by-field/
    list:
      - "<b>Platform:</b> OpenSearch, Amazon OpenSearch Service"
      - "<b>Model:</b> Cohere Rerank"  
      - "<b>Deployment:</b> Provider API" 
canonical_url: https://docs.opensearch.org/latest/tutorials/reranking/index/
---

# Reranking search results tutorials

The following machine learning (ML) tutorials show you how to implement search result reranking. For more information about reranking, see [Reranking search results]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/reranking-search-results/).

{% include cards.html cards=page.reranking %}