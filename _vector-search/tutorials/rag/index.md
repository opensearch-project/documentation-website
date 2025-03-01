---
layout: default
title: RAG
parent: Tutorials
has_children: true
has_toc: false
nav_order: 120
redirect_from:
  - /vector-search/tutorials/rag/
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
---

# RAG tutorials

The following machine learning (ML) tutorials show you how to implement retrieval-augmeted generation (RAG).

{% include cards.html cards=page.rag %}