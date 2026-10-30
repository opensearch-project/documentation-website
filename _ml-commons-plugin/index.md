---
layout: default
title: AI and machine learning
nav_order: 1
has_children: false
has_toc: false
nav_exclude: true
permalink: /ml-commons-plugin/
redirect_from: 
  - /ml-commons-plugin/index/
demo_cards:
  - heading: "Explore AI search and RAG demos"
    description: "Try interactive Hugging Face demos showcasing AI search, multimodal RAG, and agentic RAG"
    link: "https://huggingface.co/spaces/opensearch-project/OpenSearch-AI"
models:
  - heading: "Deploy local models to your cluster"
    link: "/ml-commons-plugin/using-ml-models/"
    list:
      - "<b>Pretrained models</b>: Use OpenSearch-provided models for immediate implementation"
      - "<b>Custom models</b>: Upload and serve your own models"
  - heading: "Connect to externally hosted models"
    link: "/ml-commons-plugin/remote-models/"
    description: "Connect to models hosted on Amazon Bedrock, Amazon SageMaker, OpenAI, Cohere, DeepSeek, and other platforms"
more_cards:
  - heading: "Get started with AI search"
    description: "Build your first semantic search application using this hands-on tutorial"
    link: "/vector-search/tutorials/neural-search-tutorial/"
  - heading: "AI search"
    description: "Discover AI search, from <b>semantic</b>, <b>hybrid</b>, and <b>multimodal</b> search to <b>RAG</b>"
    link: "/vector-search/ai-search/"
  - heading: "Tutorials"
    description: "Follow step-by-step tutorials to integrate AI capabilities into your applications"
    link: "/vector-search/tutorials/"
  - heading: "ML API reference"
    description: "Explore comprehensive documentation for machine learning API operations"
    link: "/ml-commons-plugin/api/"
agents:
  - heading: "Agents"
    link: "/ml-commons-plugin/agents-tools/agents/"
    description: "Learn about the agent types and choose one for your use case"
  - heading: "Tools"
    link: "/ml-commons-plugin/agents-tools/tools/"
    description: "Give agents specific capabilities, such as running searches or listing indexes"
  - heading: "Agents and tools tutorial"
    link: "/ml-commons-plugin/agents-tools/agents-tools-tutorial/"
    description: "Build a retrieval-augmented generation (RAG) application using an agent and tools"
  - heading: "OpenSearch Assistant Toolkit"
    link: "/ml-commons-plugin/opensearch-assistant/"
    description: "Create AI-powered assistants for OpenSearch Dashboards"
mcp:
  - heading: "MCP connector"
    link: "/ml-commons-plugin/agents-tools/mcp/"
    description: "Let OpenSearch agents call tools hosted on external MCP servers"
  - heading: "In-cluster MCP server"
    link: "/ml-commons-plugin/mcp/in-cluster-mcp-server/"
    description: "Let external MCP clients call tools registered in your cluster"
  - heading: "Standalone MCP server"
    link: "/ai-agent-integrations/mcp-server/"
    description: "Run the OpenSearch MCP Server outside your cluster to let AI assistants query OpenSearch"
memory:
  - heading: "Agentic memory"
    link: "/ml-commons-plugin/agentic-memory/"
    description: "Store and retrieve information, such as user preferences, across agent conversations"
  - heading: "Context management"
    link: "/ml-commons-plugin/context-management/"
    description: "Truncate, summarize, or limit the context that agents send to LLMs"
algorithms:
  - heading: "Supported algorithms"
    link: "/ml-commons-plugin/algorithms/"
    description: "Learn about the natively supported clustering, pattern detection, and statistical analysis algorithms"
---

# AI and machine learning

OpenSearch provides machine learning (ML) algorithms, model integrations, model inference, agents, and related AI capabilities. Integrate ML models to generate embeddings or text, build agents that use models and tools to perform multi-step tasks, or run built-in algorithms to analyze your data.

## Interactive demos

{% include cards.html cards=page.demo_cards %}

## ML models

OpenSearch supports ML models that you can use to enhance search relevance through semantic understanding. You can either deploy models directly within your OpenSearch cluster or connect to models hosted on external platforms. These models can transform text into vector embeddings, enabling semantic search capabilities, or provide advanced features like text generation and question answering. For more information, see [Integrating ML models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/integrating-ml-models/).

{% include cards.html cards=page.models %}

## Agents and tools

An _agent_ uses a large language model (LLM) to plan and run multi-step tasks, such as answering questions about your data or generating queries from natural language. To perform these tasks, an agent calls _tools_, each of which runs a specific operation, such as running a search or listing indexes. For more information, see [Agents and tools]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/index/).

{% include cards.html cards=page.agents %}

## MCP servers and clients

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) is an open standard that defines how AI applications discover and call tools. OpenSearch can act as an MCP client, so that its agents can call external tools, or as an MCP server, so that external AI applications can call OpenSearch tools. For more information, see [MCP servers and clients]({{site.url}}{{site.baseurl}}/ml-commons-plugin/mcp/).

{% include cards.html cards=page.mcp %}

## Memory and context

Agents can retain information across conversations and control how much context they send to the LLM. For more information, see [Memory and context]({{site.url}}{{site.baseurl}}/ml-commons-plugin/memory-and-context/).

{% include cards.html cards=page.memory %}

## Built-in algorithms for data analysis

OpenSearch includes built-in algorithms that analyze your data directly within your cluster, enabling tasks like anomaly detection, data clustering, and predictive analytics without requiring external ML models.

{% include cards.html cards=page.algorithms %}

## Build your solution 

{% include cards.html cards=page.more_cards %}