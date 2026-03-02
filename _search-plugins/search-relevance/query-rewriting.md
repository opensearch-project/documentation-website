---
layout: default
title: Query rewriting
parent: Optimizing search quality
has_children: true
nav_order: 30
has_toc: false
---

# Query rewriting

Query rewriting is the process of transforming or modifying a user query before it is executed. The goal of query rewriting is to improve search accuracy, relevance, or performance by addressing issues such as misspellings, synonyms, ambiguous terms, or inefficient query structure. Query rewriting is commonly used in search systems to enhance the quality of search results.

You can perform query rewriting in OpenSearch using the following features:

- [Template queries]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/template-query/): Create queries with dynamic placeholders that are resolved during query execution, useful for machine learning inference and runtime parameter generation.

- [Querqy]({{site.url}}{{site.baseurl}}/search-plugins/querqy/): A community plugin for advanced query rewriting with rules for boosting, burying, filtering, and redirecting search results.
