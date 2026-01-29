---
layout: default
title: Hybrid
parent: Compound queries
nav_order: 70
---

# Hybrid query

You can use a hybrid query to combine relevance scores from multiple queries into one score for a given document. A hybrid query contains a list of one or more queries and independently calculates document scores at the shard level for each subquery. The subquery rewriting is performed at the coordinating node level in order to avoid duplicate computations.

## Example

Learn how to use the `hybrid` query by following the steps in [Hybrid search]({{site.url}}{{site.baseurl}}/search-plugins/hybrid-search/).

For a comprehensive example, follow the [Getting started with semantic and hybrid search]({{site.url}}{{site.baseurl}}/ml-commons-plugin/semantic-search#tutorial).

## Parameters

The following table lists all top-level parameters supported by `hybrid` queries.

Parameter | Description
:--- | :---
`queries` | An array of one or more query clauses that are used to match documents. A document must match at least one query clause in order to be returned in the results. The documents' relevance scores from all query clauses are combined into one score by applying a [search pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/index/). The maximum number of query clauses is 5. Required.
`filter` | A filter to apply to all the subqueries of the hybrid query. 

### Behavior with min_score

when using hybrid query with [`min_score`]({{site.url}}{{site.baseurl}}/api-reference/search-apis/search/#request-body) parameter in search request body:  
> * Before 3.5: **Any** sorting criteria is allowed. The `min_score` parameter is applied to individual sub-queries and before normalization and combination. You may get results with scores **below** the `min_score` value.
> 
> * After 3.5: **Only if** sorting criteria is `_score` or no sorting is specified. The `min_score` parameter is applied after normalization and combination. You can get results with scores **all above** `min_score` value.
{: .note}

## Disabling hybrid queries

By default, hybrid queries are enabled. To disable hybrid queries in your cluster, set the `plugins.neural_search.hybrid_search_disabled` setting to `true` in `opensearch.yml`. 