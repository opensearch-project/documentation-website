---
layout: default
title: Generative AI
has_children: true
has_toc: false
nav_order: 30
redirect_from:
  - /tutorials/gen-ai/
cards:
  - heading: "RAG"
    description: "Build retrieval-augmented generation and conversational search applications"
    link: "/tutorials/gen-ai/rag/"
  - heading: "Agentic AI"
    description: "Build your generative AI applications using agents"
    link: "/tutorials/gen-ai/agents/"
  - heading: "Chatbots"
    description: "Build your generative AI applications using chatbots"
    link: "/tutorials/gen-ai/chatbots/"
  - heading: "AI search workflows"
    link: "/tutorials/gen-ai/ai-search-flows/"
    description: "Build and configure AI search applications visually in OpenSearch Dashboards"   
  - heading: "Model guardrails"
    description: "Add safety boundaries to your models to ensure controlled responses"
    link: "/tutorials/gen-ai/model-controls/"
canonical_url: https://docs.opensearch.org/latest/tutorials/gen-ai/index/
---

# Generative AI tutorials

Explore the following tutorials to learn about implementing generative AI applications using the OpenSearch vector database. For more information about OpenSearch generative AI functionality, see [Vector search]({{site.url}}{{site.baseurl}}/vector-search/) and [Machine learning]({{site.url}}{{site.baseurl}}/ml-commons-plugin/).

{% include cards.html cards=page.cards %}
