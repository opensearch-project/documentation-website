---
layout: default
title: Score ranker
has_children: false
parent: Search processors
grand_parent: Search pipelines
nav_order: 117
canonical_url: https://docs.opensearch.org/latest/search-plugins/search-pipelines/score-ranker-processor/
---

# Score ranker processor
Introduced 2.19
{: .label .label-purple }

The `score-ranker-processor` is a rank-based search phase results processor that runs between the query and fetch phases of search execution. It intercepts the query phase results and then uses the reciprocal rank fusion (RRF) algorithm to combine different query clauses to produce the final ranked list of search results. RRF is a method for combining multiple queries by scoring each document based on the reciprocal of its rank for each query and then adding these scores to create a final, unified ranking.

## Request body fields

The following table lists all available request fields.

Field | Data type | Description
:--- | :--- | :---
`combination.technique` | String | The technique used for combining scores. Required. Valid value is `rrf`.
`combination.rank_constant` | Integer | A constant added to each document's rank before calculating the reciprocal score. Must be `1` or greater. A larger rank constant makes the scores more uniform, reducing the influence of top-ranked results. A smaller rank constant creates a greater score difference between ranks, giving more weight to top-ranked items. Optional. Default is `60`.

## Example

The following example demonstrates using a search pipeline with a `score-ranker-processor`.

### Creating a search pipeline

The following request creates a search pipeline containing a `score-ranker-processor` that uses the `rrf` combination technique:

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

### Using a search pipeline

Apply the search pipeline created in the previous section so that the scores are combined using the chosen technique. In this example, you'll specify a `rank_constant` as part of the pipeline:

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

For more information about setting up hybrid search, see [Hybrid search]({{site.url}}{{site.baseurl}}/search-plugins/hybrid-search/).

## Next steps

- For a detailed exploration of the `score-ranker-processor` and RRF, including experimental data and practical use cases, see [this blog post](https://opensearch.org/blog/introducing-reciprocal-rank-fusion-hybrid-search/). The blog post provides examples, performance comparisons, and insights into how RRF can improve search relevance in various scenarios.
