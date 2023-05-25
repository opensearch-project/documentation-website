---
layout: default
title: Search pipelines
nav_order: 100
has_children: true
has_toc: false
redirect_from:
  - /search-plugins/search-relevance/
---

# Search pipelines

To integrate result rerankers, query rewriters, and other components that operate on queries or results, you can use _search pipelines_. Search pipelines make it easier for you to process search queries and search results right in OpenSearch, as opposed to building plugins or creating additional logic elsewhere in your application. Thus, you can customize search results without adding complexity to your application. Search pipelines also provide a mechanism for modularizing your processors so you can add and reorder them easily. 

## Terminology

The following is a list of search pipeline terminology:

* _Search request processor_: a component that takes a search request (the query and the metadata passed in the request), performs some operation with or on the search request, and returns a search request.
* _Search response processor_: a component that takes a search response and search request (the query, results, and metadata passed in the request), performs some operation with or on the search response, and returns a search response.
* _Processor_: either a search request processor or a search response processor.
* _Search pipeline_: an ordered list of processors that is integrated into OpenSearch. The pipeline intercepts a query, performs processing on the query, sends it to OpenSearch, intercepts the results, performs processing on the results, and returns them to the calling application, as shown in the following diagram. 

![Search processor diagram]({{site.url}}{{site.baseurl}}/images/search-pipelines.png)

## Search request processors

OpenSearch supports the following search request processors:

- `script`: Adds a script that is run on request fields.
- `filter_query`: Adds a filtering query that is used to filter requests.

## Search response processors

OpenSearch supports the following search response processors:

- `rename_field`: Renames an existing field.

## Creating a search pipeline

Search pipelines are stored in the cluster state. To create a search pipeline, you must configure an ordered list of processors in your OpenSearch cluster.