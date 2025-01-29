layout: default
title: Rank Based Combination Processor
nav_order: 70
has_children: false
parent: Search processors
grand_parent: Search pipelines
---

# Rank Based Combination Processor
Introduced 2.19
{: .label .label-purple }

The `score-ranker-processor` is a search phase results processor that runs between the query and fetch phases of search execution. It intercepts the query phase results and then uses the reciprocal rank fusion algorithm to combine different query clauses to produce the final ranked list of search results.
Reciprocal rank fusion (RRF) is a method for combining multiple queries by scoring each document based on the reciprocal of its rank for each query and then summing these scores to create a final, unified ranking.

## Request body fields

The following table lists all available request fields.

Field | Data type | Description
:--- | :--- | :---
`combination.technique` | String | The technique for combining scores. Valid value is `rrf`.
`combination.rank_constant` | int | A constant added to each document's rank before calculating the reciprocal score. Cannot be less than 1. Default is 60.

## Using RRF
You can use RRF by creating a search pipeline with RRF as the combination technique:
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
