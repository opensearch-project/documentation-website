---
layout: default
title: Search
nav_order: 1
has_children: false
has_toc: false
nav_exclude: true
permalink: /search-plugins/
redirect_from:
  - /search-plugins/index/
search_methods:
  - heading: "Keyword (BM25) search"
    description: "Lexical text search using the BM25 algorithm to match and rank documents based on term frequency and document length. Find exact and close matches using traditional text search."
    link: "/search-plugins/keyword-search/"
  - heading: "Vector search"
    description: "Similarity (k-nearest neighbor) search using dense and sparse vector embeddings to power semantic search, retrieval-augmented generation, and multimodal image search."
    link: "/vector-search/"
  - heading: "AI search"
    description: "AI-powered search capabilities beyond vector embeddings. Enrich search and ingestion flows with any AI service to power the full range of AI-enhanced search use cases."
    link: "/vector-search/ai-search/"
---

# Search

OpenSearch provides many features for customizing your search use cases and improving search relevance. 

## Search methods

OpenSearch supports multiple search methods to meet different use cases and requirements.

{% include cards.html cards=page.search_methods %}

## Query languages

In OpenSearch, you can use the following query languages to search your data.

Language | Description
:--- | :---
[Query domain-specific language (DSL)]({{site.url}}{{site.baseurl}}/query-dsl/index/) | The primary OpenSearch query language that supports creating complex, fully customizable queries.
[Query string query language]({{site.url}}{{site.baseurl}}/query-dsl/full-text/query-string/) | A scaled-down query language that you can use in a query parameter of a search request or in OpenSearch Dashboards.
[SQL]({{site.url}}{{site.baseurl}}/search-plugins/sql/sql/index/) | A traditional query language that bridges the gap between traditional relational database concepts and the flexibility of OpenSearch's document-oriented data storage.
[Piped Processing Language (PPL)]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/index/) | The primary language used with observability in OpenSearch. PPL uses a pipe syntax that chains commands into a query.
[Dashboards Query Language (DQL)]({{site.url}}{{site.baseurl}}/dashboards/dql/) | A simple text-based query language for filtering data in OpenSearch Dashboards.

## Customizing search results

OpenSearch provides fundamental result handling capabilities that work with all search types.  You can customize result navigation (pagination, sorting), result formatting (highlighting, field selection), query enhancement (autocomplete, did-you-mean), and result filtering. For more information, see [Customizing search results]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/).

## Optimizing search quality

OpenSearch provides comprehensive tools and features to help you measure, analyze, and improve the quality of your search results. These integrated features work together to optimize search relevance based on user behavior and machine learning. For more information, see [Optimizing search quality]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/).

## Search pipelines

Search pipelines are the foundational infrastructure that enables OpenSearch's AI and vector search capabilities. They provide modular processors that can transform queries (text-to-vector conversion, ML inference, query rewriting), enhance results (reranking, RAG, field manipulation), and orchestrate complex AI workflows. For more information, see [Search pipelines]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/).

## Improving search performance

OpenSearch provides various features to optimize search performance from foundational caching techniques to specialized optimizations. For more information, see [Improving search performance]({{site.url}}{{site.baseurl}}/search-plugins/improving-search-performance/).

## Cross-cluster search

OpenSearch supports searching across multiple clusters to scale your search infrastructure for large deployments. For more information, see [Cross-cluster search]({{site.url}}{{site.baseurl}}/search-plugins/cross-cluster-search/).
