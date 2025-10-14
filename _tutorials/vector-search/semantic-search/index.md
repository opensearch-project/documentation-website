---
layout: default
title: Semantic search
parent: Vector search
has_children: true
has_toc: false
nav_order: 50
redirect_from:
  - /vector-search/tutorials/semantic-search/
  - /tutorials/vector-search/semantic-search/
semantic_search:
  - heading: "Semantic search using the OpenAI embedding model"
    link: "/tutorials/vector-search/semantic-search/semantic-search-openai/"
    list:
      - "<b>Platform:</b> OpenSearch, Amazon OpenSearch Service"
      - "<b>Model:</b> OpenAI embedding"  
      - "<b>Deployment:</b> Provider API"  
  - heading: "Semantic search using Cohere Embed"
    link: "/tutorials/vector-search/semantic-search/semantic-search-cohere/"
    list:
      - "<b>Platform:</b> OpenSearch, Amazon OpenSearch Service"
      - "<b>Model:</b> Cohere Embed"  
      - "<b>Deployment:</b> Provider API"  
  - heading: "Semantic search using Cohere Embed on Amazon Bedrock"
    link: "/tutorials/vector-search/semantic-search/semantic-search-bedrock-cohere/"
    list:
      - "<b>Platform:</b> OpenSearch, Amazon OpenSearch Service"
      - "<b>Model:</b> Cohere Embed"  
      - "<b>Deployment:</b> Amazon Bedrock"  
  - heading: Semantic search using Amazon Bedrock Titan
    link: "/tutorials/vector-search/semantic-search/semantic-search-bedrock-titan/"
    list:
      - "<b>Platform:</b> OpenSearch, Amazon OpenSearch Service"
      - "<b>Model:</b> Amazon Titan"  
      - "<b>Deployment:</b> Amazon Bedrock"  
  - heading: "Semantic search using Amazon Bedrock Titan in another account"
    link: /tutorials/vector-search/semantic-search/semantic-search-bedrock-titan-other/
    list:
      - "<b>Platform:</b> OpenSearch, Amazon OpenSearch Service"
      - "<b>Model:</b> Amazon Titan"  
      - "<b>Deployment:</b> Amazon Bedrock (in a different account than your Amazon OpenSearch Service account)"
  - heading: Semantic search using a model in Amazon SageMaker
    link: /tutorials/vector-search/semantic-search/semantic-search-sagemaker/
    list: 
      - "<b>Platform:</b> OpenSearch, Amazon OpenSearch Service"
      - "<b>Model:</b> Custom"  
      - "<b>Deployment:</b> Amazon SageMaker"  
  - heading: Semantic search using AWS CloudFormation and Amazon SageMaker
    link: /tutorials/vector-search/semantic-search/semantic-search-cfn-sagemaker/
    list:
      - "<b>Platform:</b> OpenSearch, Amazon OpenSearch Service"
      - "<b>Model:</b> Custom"  
      - "<b>Deployment:</b> Amazon SageMaker + CloudFormation"
  - heading: Semantic search using AWS CloudFormation and Amazon Bedrock
    link: /tutorials/vector-search/semantic-search/semantic-search-cfn-bedrock/
    list:
      - "<b>Platform:</b> OpenSearch, Amazon OpenSearch Service"
      - "<b>Model:</b> Amazon Titan + Cohere"  
      - "<b>Deployment:</b> Amazon Bedrock + CloudFormation"
  - heading: Semantic search using an asymmetric model
    link: /tutorials/vector-search/semantic-search/semantic-search-asymmetric/
    list: 
      - "<b>Platform:</b> OpenSearch"
      - "<b>Model:</b> Hugging Face Multilingual-E5-small "  
      - "<b>Deployment:</b> Local cluster"  
  - heading: "Semantic search using text chunking"
    link: /tutorials/vector-search/semantic-search/long-document/
    list:
      - "<b>Platform:</b> OpenSearch, Amazon OpenSearch Service"
      - "<b>Model:</b> Amazon Titan Text Embeddings"  
      - "<b>Deployment:</b> Amazon Bedrock"
canonical_url: https://docs.opensearch.org/latest/tutorials/vector-search/semantic-search/index/
---

# Semantic search tutorials

The following tutorials show you how to implement semantic search.

{% include cards.html cards=page.semantic_search %}