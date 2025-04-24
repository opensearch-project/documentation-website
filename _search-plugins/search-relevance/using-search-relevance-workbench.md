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

The first step to get started with comparing search configurations is to create a set of queries to run the search. If the users has access to search behavior data, adhering to the UBI standard, one way of doing this is by making a POST request to the endpoint `_plugins/search_relevance/query_sets/create`. 

Example:
```json
POST _plugins/search_relevance/query_sets/create
{
  "parameters": {
    "sampler": "pptss",  
    "name": "Chorus Representative Query Set",  
    "description": "Representative query set of Chorus Electronics",  
    "querySetSize": 50  
  }
}
```

This request would create a query set which has 50 queries and sampled from the behavior data using a Probability-Proportional-to-Size-Sampling technique. 

Sometimes, the user might not have rather import their own external query set data. This can be done through a PUT request to the endpoint `_plugins/search_relevance/query_sets`. 

Example: 
```
PUT _plugins/search_relevance/query_sets  
  \-H "Content-Type: multipart/form-data" \\  
  \-F "file=@query_set.csv" \\  
  \-F 'params={"name": "Chorus Representative Query Set", "sampler": "manual", "description": "query set import for Chorus"}'
```

This would create query set which is sampled from `query_set.csv`. 

As a response of either one of those requests, the user will gain a query_set_id which will be used later on when expermenting with this query set.

## Creating Search Configurations

Search configurations decide how each query of the query set is run. To create a search configuration, a POST request can be made to the endpoint `_plugins/search_relevance/search_configurations`. Some details which may be optionally specified in the search configuration are the query_body, [search_pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/index/), and [search_template]({{site.url}}{{site.baseurl}}/api-reference/search-template/). The query body is defined using the [OpenSearch Query DSL]({{site.url}}{{site.baseurl}}/query-dsl/). 

Example:
```json
PUT _plugins/search_relevance/search_configurations  
{  
  "search_configuration_name": "hybrid_search_default",  
  "query_body":  "{\\"query\\": {\\"multi_match\\": {\\"query\\": \\"%SearchText%\\", \\"fields\\": \[\\"id\\", \\"title\\", \\"category\\", \\"bullets\\", \\"description\\", \\"attrs.Brand\\", \\"attrs.Color\\"\] }}}",  
  "search_pipeline": "hybrid_search"  
}
```