---
layout: default
title: Agentic AI
parent: Generative AI
has_children: true
has_toc: false
nav_order: 20
redirect_from:
  - /tutorials/gen-ai/agents/
flows:
  - heading: "Building a flow agent"
    link: /ml-commons-plugin/agents-tools/agents-tools-tutorial/
    description: "Learn how to build a flow agent for RAG"
    list: 
      - "<b>Platform:</b> OpenSearch"
      - "<b>Model:</b> Anthropic Claude"  
      - "<b>Deployment:</b> Amazon Bedrock"  
  - heading: "Building a plan-execute-reflect agent"
    link: /tutorials/gen-ai/agents/build-plan-execute-reflect-agent/
    description: "Learn how to build a powerful <i>plan-execute-reflect</i> agent for solving complex problems"
    list: 
      - "<b>Platform:</b> OpenSearch"
      - "<b>Model:</b> Anthropic Claude 3.7 Sonnet"  
      - "<b>Deployment:</b> Amazon Bedrock"
canonical_url: https://docs.opensearch.org/latest/tutorials/gen-ai/agents/index/
---

# Agentic AI tutorials

The following tutorials show you how to build agents and chatbots using OpenSearch.

{% include cards.html cards=page.flows %}