---
layout: default
title: Chatbots
parent: Generative AI
has_children: true
has_toc: false
nav_order: 30
redirect_from:
  - /vector-search/tutorials/chatbots/
  - /tutorials/gen-ai/chatbots/
chatbots:
  - heading: RAG chatbot
    link: /tutorials/gen-ai/chatbots/rag-chatbot/
    list:
      - "<b>Platform:</b> OpenSearch"
      - "<b>Model:</b> Anthropic Claude" 
      - "<b>Deployment:</b> Amazon Bedrock"  
  - heading: RAG with a conversational flow agent
    link: /tutorials/gen-ai/chatbots/rag-conversational-agent/
    list: 
      - "<b>Platform:</b> OpenSearch"
      - "<b>Model:</b> Anthropic Claude"  
      - "<b>Deployment:</b> Amazon Bedrock"  
  - heading: Build your own chatbot
    link: /tutorials/gen-ai/chatbots/build-chatbot/
    list: 
      - "<b>Platform:</b> OpenSearch"
      - "<b>Model:</b> Anthropic Claude"  
      - "<b>Deployment:</b> Amazon Bedrock"
---

# Tutorials: Building chatbots

The following machine learning (ML) tutorials show you how to implement chatbots using agents.

{% include cards.html cards=page.chatbots %}  
  