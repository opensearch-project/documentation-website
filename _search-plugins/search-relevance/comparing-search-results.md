---
layout: default
title: Comparing search results
nav_order: 10
parent: Using Search Relevance Workbench
grand_parent: Search relevance
has_children: true
has_toc: false
---

# Comparing search results

Comparing search results, also called a pairwise experiment, in OpenSearch Dashboards allows you to compare results of multiple search configurations executed on queries. Using this tool helps assess how results change when applying different search configurations.

For example, you can see how results change when you apply one of the following query changes:

- Weighting fields differently
- Different stemming or lemmatization strategies
- Shingling

## Comparing search results of a single query

The user interface for comparing the search results of a single query lets you define two different search configurations for an individual query to see and compare the results side by side and view the changes visually. Specifically, user can explore how many shared and unique documents are in the result lists and how the positions changed:

<img src="{{site.url}}{{site.baseurl}}/images/search-relevance-workbench/comparing_search_results.png" alt="Compare search results"/>{: .img-fluid }

For more information on how to use the search result comparison tool for a single query, see [Comparing search results - single query]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/compare-search-results/).

## Comparing search results of a query set

Typically, viewing the changes of a search result for two configuration is merely a first step towards testing. Scaling from one query to many is easy in the Search Relevance Workbench. By grouping queries to a query set and creating [Search Configurations]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/search-configurations/), users can create a search result comparison experiment that shows change on a larger scale by looking at aggregate metrics across all queries. The user interface allows inspecting individual queries in the same way the single query result comparison allows:

<img src="{{site.url}}{{site.baseurl}}/images/search-relevance-workbench/comparing-search-results-query-sets.png" alt="Compare search results"/>{: .img-fluid }

For more information about how to use the search result comparison tool for a query set, see [Comparing search results - query sets]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/compare-query-sets/).
