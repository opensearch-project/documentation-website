---
layout: default
title: Using Search Relevance Workbench
nav_order: 80
parent: Search relevance
has_children: false
has_toc: false
---



# Using search relevance workbench 

In search applications, tuning relevance is a constant, iterative exercise to bring the right search results to your end users. The tooling in Search Relevance Workbench aims to help the search relevance engineer and business user create the best search experience possible for application users without hiding internals from engineers who want to go deep into the details.

The Search Relevance Workbench consists of a [frontend component](https://github.com/opensearch-project/dashboards-search-relevance) that simplifies the process of evaluating search quality.
Behind the scenes, the frontend uses the [Search Relevance OpenSearch plugin](https://opensearch.org/docs/latest/automating-configurations/index/) for resource management for each tool provided. For example, most use cases involve configuring and creating search configurations, query sets, and judgments. All of these resources are created, updated, deleted, and maintained by the Search Relevance plugin. When users are satisfied with the improvements to relevancy then they take the output and manually deploy the changes into their environment.

A feature of the Search Relevance Workbench is that you can perform experiments to quantify the quality of the search given the configuration. To configure the workbench, you can choose or create a query set and a list of 2 search configurations to compare side-by-side. What happens is that all of the queries in the query set are run under the search configurations, and after the search metrics are ready, you can look into the particular queries and compare the metrics.

## Creating a query set

The first step to get started with comparing search configurations is to create a set of queries to run the search. If you has access to search behavior data, adhering to the UBI standard, one way of doing this is by making a POST request to the endpoint ` _plugins/search_relevance/query_sets/create`. 

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

Sometimes, yoou might rather import their own external query set data. This can be done through a PUT request to the endpoint `_plugins/search_relevance/query_sets`. 

Example: 
```
PUT _plugins/search_relevance/query_sets  
  \-H "Content-Type: multipart/form-data" \\  
  \-F "file=@query_set.csv" \\  
  \-F 'params={"name": "Chorus Representative Query Set", "sampler": "manual", "description": "query set import for Chorus"}'
```

This would create query set which is sampled from `query_set.csv`. 

As a response of either one of those requests, you will gain a query_set_id which will be used later on when expermenting with this query set.

## Creating search configurations

Search configurations decide how each query of the query set is run. To create a search configuration, you can make a POST request to the endpoint `_plugins/search_relevance/search_configurations`. Some details which may be optionally specified in the search configuration are the query_body, [search_pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/index/), and [search_template]({{site.url}}{{site.baseurl}}/api-reference/search-template/). The query body is defined using the [OpenSearch Query DSL]({{site.url}}{{site.baseurl}}/query-dsl/). 

Example:
```
PUT _plugins/search_relevance/search_configurations  
{  
  "search_configuration_name": "hybrid_search_default",  
  "query_body":  "{\\"query\\": {\\"multi_match\\": {\\"query\\": \\"%SearchText%\\", \\"fields\\": \[\\"id\\", \\"title\\", \\"category\\", \\"bullets\\", \\"description\\", \\"attrs.Brand\\", \\"attrs.Color\\"\] }}}",  
  "search_pipeline": "hybrid_search"  
}
```

## Running the search result list comparison experiment

By comparing search results, you can gauge how modifying the search configurations can impact their search results. To run an experiment, you must have 2 search configurations names to use and a query set. By making a POST request to the endpoint `_plugins/search_relevance/experiments`, you create an experiment.

Example:
```
POST _plugins/search_relevance/experiments  
{  
 "query_set_id": "f0803ed1-6db5-456d-aeb8-1ea3804f5915",  
 "search_configurations": \["baseline", "hybrid_search"\],  
 "k": 10  
}
```

Now, the experiment is created, and the experiment may be run when you hit the evaluation button.
