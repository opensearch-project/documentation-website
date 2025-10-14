---
layout: default
title: Comparing search results
nav_order: 11
parent: Search Relevance Workbench
grand_parent: Search relevance
has_children: true
canonical_url: https://docs.opensearch.org/latest/search-plugins/search-relevance/comparing-search-results/
---

# Comparing search results

Comparing search results, also called a _pairwise experiment_, in OpenSearch Dashboards allows you to compare results of multiple search configurations. Using this tool helps assess how results change when applying different search configurations to queries.

For example, you can see how results change when you apply one of the following query changes:

- Weighting fields differently
- Different stemming or lemmatization strategies
- Shingling

## Comparing search results of a single query

The UI for comparing the search results of a single query lets you define two different search configurations for an individual query in order to view and compare the results side by side. Specifically, you can determine how many shared and unique documents are contained in the result lists and how their positions changed, as shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/search-relevance-workbench/comparing_search_results.png" alt="Compare search results"/>{: .img-fluid }

For more information about using the search result comparison tool for a single query, see [Comparing single queries]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/compare-search-results/).

## Comparing search results of a query set

Typically, viewing search result changes for two configurations is the first step in the testing process. You can then scale from one query to many in Search Relevance Workbench. You can group queries into a query set, create [search configurations]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/search-configurations/), and compare search results on a larger scale by looking at aggregate metrics across all queries, as shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/search-relevance-workbench/comparing-search-results-query-sets.png" alt="Compare search results"/>{: .img-fluid }

For more information about using the search result comparison tool for a query set, see [Comparing single queries]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/compare-query-sets/).
