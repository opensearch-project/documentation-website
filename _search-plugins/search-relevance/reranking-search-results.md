---
layout: default
title: Reranking search results
parent: Search relevance
has_children: true
nav_order: 65
canonical_url: https://docs.opensearch.org/latest/search-plugins/search-relevance/reranking-search-results/
---

# Reranking search results
Introduced 2.12
{: .label .label-purple }

You can rerank search results using a [`rerank` processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/rerank-processor/) in order to improve search relevance. To implement reranking, you need to configure a [search pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/index/) that runs at search time. The search pipeline intercepts search results and applies the `rerank` processor to them. The `rerank` processor evaluates the search results and sorts them based on the new scores.

You can rerank results in the following ways:

- [Using a cross-encoder model]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/rerank-cross-encoder/)
- [By a document field]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/rerank-by-field/)
- [By a field using a cross-encoder]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/rerank-by-field-cross-encoder/)
- [By a field using a late interaction model]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/rerank-by-field-late-interaction/)

## Using rerank and normalization processors together

When you use a rerank processor in conjunction with a [normalization processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/normalization-processor/) and a hybrid query, the rerank processor alters the final document scores. This is because the rerank processor operates after the normalization processor in the search pipeline.
{: .note}

The processing order is as follows:

- Normalization processor: This processor normalizes the document scores based on the configured normalization method. For more information, see [Normalization processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/normalization-processor/).
- Rerank processor: Following normalization, the rerank processor further adjusts the document scores. This adjustment can significantly impact the final ordering of search results.

This processing order has the following implications:

- Score modification: The rerank processor modifies the scores that were initially adjusted by the normalization processor, potentially leading to different ranking results than initially expected.
- Hybrid queries: In the context of hybrid queries, where multiple types of queries and scoring mechanisms are combined, this behavior is particularly noteworthy. The combined scores from the initial query are normalized first and then reranked, resulting in a two-phase scoring modification.

