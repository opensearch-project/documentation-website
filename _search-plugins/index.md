---
layout: default
title: Search
nav_order: 1
has_children: false
has_toc: false
nav_exclude: true
---

# Search

OpenSearch provides many features for customizing your search use cases and improving search relevance. 

## Search methods

OpenSearch supports the following search methods:

- **Traditional lexical search**

    - [Keyword (BM25) search]({{site.url}}{{site.baseurl}}/search-plugins/keyword-search/): Searches the document corpus for words that appear in the query.

- **Machine learning (ML)-powered search**

    - **Vector search**

        - [k-NN search]({{site.url}}{{site.baseurl}}/search-plugins/knn/): Searches for k-nearest neighbors to a search term across an index of vectors.

    - **Neural search**: [Neural search]({{site.url}}{{site.baseurl}}/search-plugins/neural-search/) facilitates generating vector embeddings at ingestion time and searching them at search time. Neural search lets you integrate ML models into your search and serves as a framework for implementing other search methods. The following search methods are built on top of neural search:

        - [Semantic search]({{site.url}}{{site.baseurl}}/search-plugins/semantic-search/): Considers the meaning of the words in the search context. Uses dense retrieval based on text embedding models to search text data. 

        - [Multimodal search]({{site.url}}{{site.baseurl}}/search-plugins/multimodal-search/): Uses multimodal embedding models to search text and image data. 

        - [Sparse search]({{site.url}}{{site.baseurl}}/search-plugins/sparse-search/): Uses sparse retrieval based on sparse embedding models to search text data.

        - [Hybrid search]({{site.url}}{{site.baseurl}}/search-plugins/hybrid-search/): Combines traditional search and vector search to improve search relevance.

        - [Conversational search]({{site.url}}{{site.baseurl}}/search-plugins/conversational-search/): Implements a retrieval-augmented generative search. 

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
