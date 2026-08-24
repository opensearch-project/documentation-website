---
layout: default
title: AI and vector search queries
has_children: true
nav_order: 55
has_toc: false
redirect_from:
  - /query-dsl/ai-vector-search/
---

# AI and vector search queries

AI and vector search queries use machine learning models to transform or enhance search operations. These queries convert text or other input into vector representations for similarity search, or use AI services to generate query parameters at runtime.

| Query type | Description |
| :--- | :--- |
| [Agentic]({{site.url}}{{site.baseurl}}/query-dsl/specialized/agentic/) | Uses AI agents to dynamically plan and execute search strategies. |
| [k-NN]({{site.url}}{{site.baseurl}}/query-dsl/specialized/k-nn/) | Performs approximate or exact nearest-neighbor search using vector embeddings. |
| [Neural]({{site.url}}{{site.baseurl}}/query-dsl/specialized/neural/) | Converts text to dense vector embeddings at query time for semantic search. |
| [Neural sparse]({{site.url}}{{site.baseurl}}/query-dsl/specialized/neural-sparse/) | Converts text to sparse vector embeddings at query time for semantic search. |
| [Template]({{site.url}}{{site.baseurl}}/query-dsl/specialized/template/) | Contains placeholder variables resolved by ML inference processors at query time. |
