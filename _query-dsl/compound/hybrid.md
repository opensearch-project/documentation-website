---
layout: default
title: Hybrid
parent: Compound queries
grand_parent: Query DSL
nav_order: 70
---

# Hybrid query

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/neural-search/issues/244).    
{: .warning}

Use a hybrid query to combine relevance scores from multiple queries into one score for a given document. A hybrid query contains a list of one or more queries, which are run in parallel at the data node level. It calculates document scores at the shard level independently for each subquery. The subquery rewriting is done at the coordinating node level to avoid duplicate computations.

## Example

The following example request combines a score from a regular `match` query clause with a score from a `neural` query clause. It uses a [search pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/index/) with a [normalization processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/script-processor/), which specifies the techniques to normalize and combine query clause relevance scores:

```json
POST flicker-index/_search?search_pipeline=normalizationPipeline
{
  "query": {
    "hybrid": {
      "queries": [
        {
          "neural": {
            "passage_embedding": {
              "query_text": "Girl with Brown Hair",
              "model_id": "ABCBMODELID",
              "k": 20
            }
          }
        },
        {
          "match": {
            "passage_text": "Girl Brown hair"
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

To learn more about the normalization processor, see [Normalization processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/normalization-processor/).

## Parameters

The following table lists all top-level parameters supported by `hybrid` queries.

Parameter | Description
:--- | :---
`queries` | An array of one or more query clauses that are used to match documents. A document must match at least one query clause to be returned in the results. The documents' relevance scores from all query clauses are combined into one score by applying a [search pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/index/). The maximum number of query clauses is 5. Required.