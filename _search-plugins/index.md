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
---

# Search features

OpenSearch provides many features for customizing your search use cases and improving search relevance. 

## Search methods

OpenSearch supports the following search methods.

### Traditional lexical search

OpenSearch supports [keyword (BM25) search]({{site.url}}{{site.baseurl}}/search-plugins/keyword-search/), which searches the document corpus for words that appear in the query.

### Vector search

OpenSearch supports various machine learning (ML)-powered search methods using [vector search]({{site.url}}{{site.baseurl}}/vector-search/).

## Query languages

In OpenSearch, you can use the following query languages to search your data:

- [Query domain-specific language (DSL)]({{site.url}}{{site.baseurl}}/query-dsl/index/): The primary OpenSearch query language that supports creating complex, fully customizable queries.

- [Query string query language]({{site.url}}{{site.baseurl}}/query-dsl/full-text/query-string/): A scaled-down query language that you can use in a query parameter of a search request or in OpenSearch Dashboards.

- [SQL]({{site.url}}{{site.baseurl}}/search-plugins/sql/sql/index/): A traditional query language that bridges the gap between traditional relational database concepts and the flexibility of OpenSearch’s document-oriented data storage.

- [Piped Processing Language (PPL)]({{site.url}}{{site.baseurl}}/search-plugins/sql/ppl/index/): The primary language used with observability in OpenSearch. PPL uses a pipe syntax that chains commands into a query.

- [Dashboards Query Language (DQL)]({{site.url}}{{site.baseurl}}/dashboards/dql/): A simple text-based query language for filtering data in OpenSearch Dashboards. 

## Search performance

OpenSearch offers several ways to improve search performance:

- [Asynchronous search]({{site.url}}{{site.baseurl}}/search-plugins/async/): Runs resource-intensive queries asynchronously.

- [Concurrent segment search]({{site.url}}{{site.baseurl}}/search-plugins/concurrent-segment-search/): Searches segments concurrently.

## Search relevance

OpenSearch provides the following search relevance features:

- [Compare Search Results]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/compare-search-results/): A search comparison tool in OpenSearch Dashboards that you can use to compare results from two queries side by side. 

- [Querqy]({{site.url}}{{site.baseurl}}/search-plugins/querqy/): Offers query rewriting capability.

- [User Behavior Insights]({{site.url}}{{site.baseurl}}/search-plugins/ubi/): Links user behavior to user queries to improve search quality.
  
## Search results

OpenSearch supports the following commonly used operations on search results:

- [Paginate]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/paginate/)
- [Paginate with Point in Time]({{site.url}}{{site.baseurl}}/search-plugins/point-in-time/)
- [Sort]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/sort/)
- [Highlight search terms]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/highlight/) 
- [Autocomplete]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/autocomplete/)
- [Did-you-mean]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/did-you-mean/) 

## Search pipelines

You can process search queries and search results with [search pipelines]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/index/).
