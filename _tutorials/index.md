---
layout: default
title: Tutorials
has_children: true
has_toc: false
nav_order: 47
nav_exclude: true
permalink: /tutorials/
redirect_from:
  - /ml-commons-plugin/tutorials/
  - /ml-commons-plugin/tutorials/index/
getting_started_cards:
  - heading: "Searching data 101"
    description: "Learn the fundamentals of search and explore OpenSearch query languages and types" 
    link: "/getting-started/search-data/" 
  - heading: "OpenSearch Dashboards"
    description: "Start visualizing your data with interactive dashboards and powerful analytics tools"
    link: "/dashboards/getting-started/"
tutorial_cards:
  - heading: "Vector search"
    description: "Implement similarity search using vectors and enhance results with AI capabilities" 
    link: "/tutorials/vector-search/"
  - heading: "Reranking search results"
    description: "Enhance search relevance using machine learning models to intelligently reorder results" 
    link: "/tutorials/reranking/"
  - heading: "Generative AI applications"
    description: "Create AI-powered applications like RAG, chatbots, and advanced conversational systems" 
    link: "/tutorials/gen-ai/"
  - heading: "Faceted search"
    description: "Build filterable search experiences for applications like e-commerce or location search" 
    link: "/tutorials/faceted-search/"
  - heading: "LLM-as-a-Judge"
    description: "Automate search relevance evaluation using LLMs" 
    link: "/tutorials/llm-as-a-judge-tutorial/"    
---

# OpenSearch tutorials

Follow step-by-step tutorials to get started with OpenSearch and build search features, including semantic search, hybrid search, retrieval-augmented generation (RAG), and conversational search.

## Getting started

Learn the basics of searching and visualizing data in OpenSearch.

{% include cards.html cards=page.getting_started_cards %}

## Building search features using OpenSearch

Implement specific search features end to end.

{% include cards.html cards=page.tutorial_cards %}
