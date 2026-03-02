---
layout: default
title: Optimizing search quality
nav_order: 75
has_children: true
has_toc: false
redirect_from:
  - /search-plugins/search-relevance/
---

# Optimizing search quality

_Search quality_ refers to how well search results match user intent and expectations. OpenSearch provides several features and tools to help you measure, analyze, and improve the quality of your search results.

OpenSearch offers the following features to help you optimize search quality:

- **[User Behavior Insights (UBI)]({{site.url}}{{site.baseurl}}/search-plugins/ubi/)**: Capture and analyze user behavior data to understand how users interact with search results and identify areas for improvement.

- **[Search Relevance Workbench]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/using-search-relevance-workbench/)**: A comprehensive suite of tools for experimenting with and improving search relevance through query comparison, result evaluation, and A/B testing.

- **[Query rewriting]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/query-rewriting/)**: Transform user queries to improve search accuracy and handle synonyms, misspellings, and other query variations.

- **[Learning to Rank (LTR)]({{site.url}}{{site.baseurl}}/search-plugins/ltr/)**: Use machine learning models trained on behavioral data to improve the ranking of search results.

- **[Reranking search results]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/reranking-search-results/)**: Apply machine learning models to reorder search results for improved relevance.

## Search quality workflow

A typical search quality improvement workflow involves:

1. **Data collection**: Use UBI to capture user behavior and interaction data.
2. **Analysis**: Analyze user behavior patterns to identify search quality issues.
3. **Experimentation**: Use the Search Relevance Workbench to test different approaches.
4. **Model training**: Train LTR models using behavioral data to improve ranking.
5. **Query enhancement**: Apply query rewriting rules to improve query understanding.
6. **Reranking**: Apply ML-based reranking to further optimize results.
7. **Evaluation**: Continuously monitor and evaluate search performance.

## Related documentation

- [Reranking search results tutorials]({{site.url}}{{site.baseurl}}/tutorials/reranking/): Learn how to implement search result reranking using various machine learning models and platforms.