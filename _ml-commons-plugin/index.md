---
layout: default
title: Machine learning
nav_order: 1
has_children: false
has_toc: false
nav_exclude: true
permalink: /ml-commons-plugin/
redirect_from: 
  - /ml-commons-plugin/index/
demo_cards:
  - heading: "Explore AI search and RAG demos"
    description: "Try interactive Hugging Face demos showcasing AI Search, multimodal RAG, and agentic RAG"
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
oa-toolkit:
  - heading: "OpenSearch Assistant Toolkit"
    link: "/ml-commons-plugin/opensearch-assistant/"
    list:
      - Agents for task orchestration
      - Tools for specific operations
      - Configuration automation
algorithms:
  - heading: "Supported algorithms"
    link: "/ml-commons-plugin/algorithms/"
    description: "Learn about the natively supported clustering, pattern detection, and statistical analysis algorithms"
---

# Machine learning

OpenSearch offers two distinct approaches to machine learning (ML): using ML models for tasks like semantic search and text generation, and running statistical algorithms for data analysis. Choose the approach that best fits your use case.

## Interactive demos

{% include cards.html cards=page.demo_cards %}

## ML models for search and AI/ML-powered applications

OpenSearch supports ML models that you can use to enhance search relevance through semantic understanding. You can either deploy models directly within your OpenSearch cluster or connect to models hosted on external platforms. These models can transform text into vector embeddings, enabling semantic search capabilities, or provide advanced features like text generation and question answering. For more information, see [Integrating ML models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/integrating-ml-models/).

{% include cards.html cards=page.models %}

## OpenSearch Assistant and automation

OpenSearch Assistant Toolkit helps you create AI-powered assistants for OpenSearch Dashboards.

{% include cards.html cards=page.oa-toolkit %}

## Built-in algorithms for data analysis

OpenSearch includes built-in algorithms that analyze your data directly within your cluster, enabling tasks like anomaly detection, data clustering, and predictive analytics without requiring external ML models.

{% include cards.html cards=page.algorithms %}

## Build your solution 

{% include cards.html cards=page.more_cards %}