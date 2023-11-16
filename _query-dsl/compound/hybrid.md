---
layout: default
title: Hybrid
parent: Compound queries
grand_parent: Query DSL
nav_order: 70
---

# Hybrid query

You can use a hybrid query to combine relevance scores from multiple queries into one score for a given document. A hybrid query contains a list of one or more queries and independently calculates document scores at the shard level for each subquery. The subquery rewriting is performed at the coordinating node level in order to avoid duplicate computations.

## Example

Before using a `hybrid` query, you must configure a search pipeline with a [`normalization-processor`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/normalization-processor/) (see [this example]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/normalization-processor#example)).

To try out the example, follow the [Semantic search tutorial]({{site.url}}{{site.baseurl}}/ml-commons-plugin/semantic-search#tutorial).

## Parameters

The following table lists all top-level parameters supported by `hybrid` queries.

Parameter | Description
:--- | :---
`queries` | An array of one or more query clauses that are used to match documents. A document must match at least one query clause in order to be returned in the results. The documents' relevance scores from all query clauses are combined into one score by applying a [search pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/index/). The maximum number of query clauses is 5. Required.

## Disabling hybrid queries

By default, hybrid queries are enabled. To disable hybrid queries in your cluster, set the `plugins.neural_search.hybrid_search_disabled` setting to `true` in `opensearch.yml`. 