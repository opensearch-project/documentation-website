---
layout: default
title: Conversational search with RAG
parent: Tutorials
has_children: true
has_toc: false
nav_order: 80
redirect_from:
  - /vector-search/tutorials/conversational-search/
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
---

# Conversational search with RAG tutorials

The following tutorials show you how to implement conversational search with retrieval-augmented generation (RAG).

{% include cards.html cards=page.conversational_search %}