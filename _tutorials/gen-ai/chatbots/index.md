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

Learn how to build conversational chatbots that use OpenSearch agents to retrieve relevant documents and generate context-aware responses.

{% include cards.html cards=page.chatbots %}  
  