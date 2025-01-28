layout: default
title: Reciprocal Rank Fusion
nav_order: 70
has_children: false
parent: Search processors
grand_parent: Search pipelines
---

# Reciprocal Rank Fusion processor
Introduced 2.19
{: .label .label-purple }

Reciprocal rank fusion (RRF) is a method for combining multiple queries by scoring each document based on the reciprocal of its rank for each query and then summing these scores to create a final, unified ranking.
The `rrf-processor` is a search phase results processor that runs between the query and fetch phases of search execution. It intercepts the query phase results and then uses the reciprocal rank fusion algorithm to combine different query clauses before passing the documents to the fetch phase.

## Using RRF
You can use RRF by creating a search pipeline with RRF as the specified technique:
```json
PUT /_search/pipeline/<rrf-pipeline>
{
  "description": "Post processor for hybrid RRF search",
  "phase_results_processors": [
    {
      "score-ranker-processor": {
        "combination": {
          "technique": "rrf"
        }
      }
    }
  ]
}
```

The rank constant can be specified as part of the pipeline but cannot be less than 1.  Larger rank constants make the scores more uniform, reducing the impact of top ranks. Smaller rank constants create steeper differences between ranks, giving much more weight to top-ranked items. By default, rank constant is set to 60 if not specified.
```json
PUT /_search/pipeline/<rrf-pipeline>
{
  "description": "Post processor for hybrid RRF search",
  "phase_results_processors": [
    {
      "score-ranker-processor": {
        "combination": {
          "technique": "rrf",
          "rank_constant": 40
        }
      }
    }
  ]
}
```

For more information about setting up hybrid search, see [Using hybrid search]({{site.url}}{{site.baseurl}}/search-plugins/hybrid-search/#using-hybrid-search).
