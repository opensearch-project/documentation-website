---
layout: default
title: Using Search Relevance Workbench
nav_order: 80
parent: Search relevance
has_children: false
has_toc: false
redirect_from:
  - /search-plugins/search-relevance/
---

# Using Search Relevance Workbench

The Search Relevance Workbench consists of a frontend and a backend component. 
[The frontend component](https://github.com/opensearch-project/dashboards-search-relevance) is implemented as a plugin for OpenSearch Dashboards. 
[The backend component](https://github.com/o19s/search-relevance/) is an OpenSearch plugin.

A feature of the Search Relevance Workbench is that users can perform experiments to quantify the quality of the search given the configuration. To configure the workbench, the users can choose or create a query set and a list of 2 search configurations to compare side-by-side. What happens is that all the queries in the query set are run under the search configurations, and after the search metrics are ready, users can look into the particular queries and compare the metrics.

## Creating a Query Set

The first step to get started with comparing search configurations is to create a set of queries to run the search. One way of doing this is by making a post request to the endpoint ==_plugins/search_relevance/query_sets/create==