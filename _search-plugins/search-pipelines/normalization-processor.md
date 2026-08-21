---
layout: default
title: Normalization
nav_order: 70
has_children: false
has_math: true
parent: User-defined search processors
grand_parent: Search pipelines
---

# Normalization processor
Introduced 2.10
{: .label .label-purple }

The `normalization-processor` is a search phase results processor that runs between the query and fetch phases of search execution. It intercepts the query phase results and then normalizes and combines the document scores from different query clauses before passing the documents to the fetch phase.

## Score normalization and combination

Many applications require both keyword matching and semantic understanding. For example, BM25 accurately provides relevant search results for a query containing keywords, and neural networks perform well when a query requires natural language understanding. Thus, you might want to combine BM25 search results with the results of a k-NN or neural search. However, BM25 and k-NN search use different scales to calculate relevance scores for the matching documents. Before combining the scores from multiple queries, it is beneficial to normalize them so that they are on the same scale, as shown by experimental data. For further reading about score normalization and combination, including benchmarks and various techniques, see [this semantic search blog post](https://opensearch.org/blog/semantic-science-benchmarks/).

## Normalization techniques

OpenSearch normalizes each query clause independently. For a given clause, it calculates the statistics that the technique requires from that clause's own results only, and then rescales every score in the clause. Documents that the clause did not return contribute nothing to its statistics.

Because the statistics are derived from the returned results rather than from the whole index, the normalized scores depend on how many results each clause returns. For more information, see [Search tuning recommendations](#search-tuning-recommendations).

### Min-max normalization

Min-max normalization rescales the scores of a query clause to the [0.0, 1.0] range by subtracting the clause's minimum score and dividing by the clause's score range:

$$\text{n_score} = \frac {\text{score} - \text{min_score}} {\text{max_score} - \text{min_score}}$$

The highest-scoring document in the clause receives a score of `1.0`. OpenSearch replaces a normalized score of exactly `0.0` with `0.001` because a score of `0.0` has the special meaning of `match_none`, so the lowest-scoring document in the clause receives `0.001`. If every document in a clause has the same score, including a clause that returns only one document, then the clause's minimum and maximum scores are equal and every document in the clause receives `1.0`.

To normalize against fixed thresholds instead of the minimum and maximum scores of the returned results, set the `lower_bounds` and `upper_bounds` parameters. For more information, see [Request body fields](#request-body-fields).

### L2 normalization

L2 normalization divides each score in a query clause by the Euclidean norm of all scores in that clause:

$$\text{n_score}_i = \frac {\text{score}_i} {\sqrt{\text{score}_1^2 + \text{score}_2^2 + \dots + \text{score}_n^2}}$$

The normalized scores preserve the ratios of the original scores, so a document that scored twice as high as another document in the same clause still scores twice as high after normalization. Because every score is divided by the same norm, and no single score can exceed the norm, the normalized scores fall in the [0.0, 1.0] range. Unlike min-max normalization, L2 normalization does not assign `1.0` to the highest-scoring document. Each additional result that a clause returns increases the norm and therefore reduces the normalized score of every other document in the clause. Only when a clause returns a single document does the norm equal that document's score, and the document receives `1.0`.

### Z-score normalization

Z-score normalization subtracts the mean of the query clause's scores from each score and divides the result by the sample standard deviation of those scores:

$$\text{n_score} = \frac {\text{score} - \text{mean}} {\text{sd}}$$

A document that scores below the mean of its clause produces a negative z-score. Because a negative value is not a valid relevance score, OpenSearch replaces every normalized score less than or equal to `0.0` with `0.001`. All documents that score below the mean of a query clause therefore receive the same normalized score, and their relative order within that clause is lost. Documents that score above the mean are not confined to a fixed range and can receive normalized scores greater than `1.0`.

A document whose score is exactly equal to the mean of its clause is a special case: it receives the highest raw score in the clause rather than a z-score. If every document in a clause has the same score, including a clause that returns only one document, then every document matches the mean, so the clause's scores are not rescaled at all.

The `z_score` technique supports only the `arithmetic_mean` combination technique.

### Choosing a normalization technique

Use the following table to compare the three techniques.

| | `min_max` | `l2` | `z_score` |
| :--- | :--- | :--- | :--- |
| Output range | [0.0, 1.0], with `0.0` replaced by `0.001` | [0.0, 1.0] | Not a fixed range, with all values less than or equal to `0.0` replaced by `0.001` |
| Score of the highest-scoring document in a clause | Always `1.0` | Less than `1.0`, unless the clause returns a single document | Varies, and can exceed `1.0` |
| Score ratios within a clause | Not preserved | Preserved | Not preserved |
| Statistics used | Lowest and highest scores | All scores | All scores |
| Influence of a single extreme score | High, because the score defines an endpoint of the range | Lower, because the score is one term of the norm | Lower, because the score shifts the mean and standard deviation |
| Ordering below the clause mean | Preserved | Preserved | Discarded |
| Supported combination techniques | All | All | `arithmetic_mean` |

The following guidance applies to each technique:

- Use `min_max`, the default, when you want normalized scores on a predictable scale that you can reason about directly, or when you want to normalize against fixed thresholds through the `lower_bounds` and `upper_bounds` parameters.
- Use `l2` when the ratios between the scores within a query clause carry information that the final ranking should reflect, or when a clause returns occasional extreme scores that would compress the rest of the range under `min_max`.
- Use `z_score` when the query clauses produce score distributions that differ mainly in spread. Avoid it when a clause returns few results, because the documents that score below the clause mean become indistinguishable.

### Example: Comparing normalization techniques

The following example applies all three techniques to the same data so that you can compare their output. It uses two-dimensional vectors specified directly in each document so that you can verify the arithmetic manually, and a single shard so that the scores are reproducible.

The example uses the same index and query as [Reciprocal rank fusion]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/rrf/), so you can also compare these results to those of rank-based combination.
{: .note}

Create an index with a text field for keyword matching and a vector field for semantic matching:

```json
PUT /products
{
  "settings": {
    "index.knn": true,
    "number_of_shards": 1
  },
  "mappings": {
    "properties": {
      "item_name": {
        "type": "text"
      },
      "item_vector": {
        "type": "knn_vector",
        "dimension": 2,
        "space_type": "l2",
        "method": {
          "name": "hnsw",
          "engine": "lucene"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Index five products:

```json
POST /_bulk?refresh=true
{ "index": { "_index": "products", "_id": "1" } }
{ "item_name": "kids running shoes", "item_vector": [0.2, 0.8] }
{ "index": { "_index": "products", "_id": "2" } }
{ "item_name": "mens lightweight running shoes for road racing", "item_vector": [0.9, 0.1] }
{ "index": { "_index": "products", "_id": "3" } }
{ "item_name": "trail runners", "item_vector": [0.8, 0.2] }
{ "index": { "_index": "products", "_id": "4" } }
{ "item_name": "athletic socks", "item_vector": [0.5, 0.5] }
{ "index": { "_index": "products", "_id": "5" } }
{ "item_name": "winter parka", "item_vector": [0.0, 1.0] }
```
{% include copy-curl.html %}

Run separately, the two query clauses produce scores on different scales. The `match` clause on `running shoes` returns two documents, and a `knn` clause on `[0.9, 0.1]` with `k` set to `3` returns three documents:

| Document ID | `item_name` | Keyword score | Vector score |
| :--- | :--- | :--- | :--- |
| `1` | kids running shoes | 0.8167638 | -- |
| `2` | mens lightweight running shoes for road racing | 0.5356597 | 1.0 |
| `3` | trail runners | -- | 0.98039216 |
| `4` | athletic socks | -- | 0.7575758 |

Create one search pipeline for each normalization technique, replacing `min_max` with `l2` and `z_score` to create the other two:

```json
PUT /_search/pipeline/min-max-pipeline
{
  "description": "Normalize with min_max and combine with arithmetic_mean",
  "phase_results_processors": [
    {
      "normalization-processor": {
        "normalization": {
          "technique": "min_max"
        },
        "combination": {
          "technique": "arithmetic_mean"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

Combine both query clauses in a [`hybrid` query]({{site.url}}{{site.baseurl}}/query-dsl/compound/hybrid/) and apply one of the pipelines:

```json
GET /products/_search?search_pipeline=min-max-pipeline
{
  "_source": {
    "excludes": ["item_vector"]
  },
  "query": {
    "hybrid": {
      "queries": [
        {
          "match": {
            "item_name": "running shoes"
          }
        },
        {
          "knn": {
            "item_vector": {
              "vector": [0.9, 0.1],
              "k": 3
            }
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

Because the `weights` parameter is omitted, `arithmetic_mean` weights both clauses equally. A document that one clause did not return contributes `0` to the numerator but still counts in the denominator, so a document matching only one of the two clauses has its normalized score halved.

With `min_max`, document `1` normalizes to `1.0` because it is the highest-scoring document of the keyword clause, and document `2` normalizes to `0.001` because it is the lowest-scoring document of that clause. Document `2` still ranks first overall, but only narrowly:

| Document ID | Keyword normalized | Vector normalized | `_score` |
| :--- | :--- | :--- | :--- |
| `2` | 0.001 | 1.0 | 0.5005 |
| `1` | 1.0 | -- | 0.5 |
| `3` | -- | 0.9191176 | 0.4595588 |
| `4` | -- | 0.001 | 0.0005 |

With `l2`, each clause is divided by its own norm: 0.97674686 for the keyword clause and 1.5921966 for the vector clause. No score is forced to an endpoint, so document `2` retains a larger share of its keyword contribution and its lead over document `1` widens:

| Document ID | Keyword normalized | Vector normalized | `_score` |
| :--- | :--- | :--- | :--- |
| `2` | 0.54841197 | 0.62806314 | 0.5882375 |
| `1` | 0.8362083 | -- | 0.41810414 |
| `3` | -- | 0.61574817 | 0.30787408 |
| `4` | -- | 0.47580546 | 0.23790273 |

With `z_score`, documents `2` and `4` fall at or below the mean of their respective clauses, so both receive `0.001` in that clause. Document `2` loses most of its keyword contribution as a result, and document `1` ranks first:

| Document ID | Keyword normalized | Vector normalized | `_score` |
| :--- | :--- | :--- | :--- |
| `1` | 0.70710695 | -- | 0.35355347 |
| `2` | 0.001 | 0.6486226 | 0.32481128 |
| `3` | -- | 0.5030134 | 0.2515067 |
| `4` | -- | 0.001 | 0.0005 |

The three techniques produce three different rankings from identical input, and `z_score` promotes a different document to the top. Evaluate the techniques against your own data and judgment lists rather than choosing one from these results. For more information, see [Optimizing hybrid search]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/optimize-hybrid-search/).

## Query then fetch

OpenSearch supports two search types: `query_then_fetch` and `dfs_query_then_fetch`. The following diagram outlines the query-then-fetch process, which includes a normalization processor.

![Normalization processor flow diagram]({{site.url}}{{site.baseurl}}/images/normalization-processor.png)

When you send a search request to a node, the node becomes a _coordinating node_. During the first phase of search, the _query phase_, the coordinating node routes the search request to all shards in the index, including primary and replica shards. Each shard then runs the search query locally and returns metadata about the matching documents, which includes their document IDs and relevance scores. The `normalization-processor` then normalizes and combines scores from different query clauses. The coordinating node merges and sorts the local lists of results, compiling a global list of top documents that match the query. After that, search execution enters a _fetch phase_, in which the coordinating node requests the documents in the global list from the shards where they reside. Each shard returns the documents' `_source` to the coordinating node. Finally, the coordinating node sends a search response containing the results back to you.

## Request body fields

The following table lists all available request fields.

Field | Data type | Description
:--- | :--- | :---
`normalization.technique` | String | The technique for normalizing scores. Valid values are [`min_max`](https://en.wikipedia.org/wiki/Feature_scaling#Rescaling_(min-max_normalization)), [`l2`](https://en.wikipedia.org/wiki/Cosine_similarity#L2-normalized_Euclidean_distance), and [`z_score`](https://en.wikipedia.org/wiki/Standard_score). Optional. Default is `min_max`.
 `normalization.parameters.lower_bounds` | Array of objects | Defines the lower bound values (the minimum threshold scores) for each query. The array must contain the same number of objects as the number of queries. Optional. Applies only when the normalization technique is [`min_max`](https://en.wikipedia.org/wiki/Feature_scaling#Rescaling_(min-max_normalization)). If not provided, OpenSearch does not apply a lower bound to any subquery and uses the actual minimum score from the retrieved results for normalization.
`normalization.parameters.lower_bounds.mode` | String | Specifies how the lower bound is applied to a query. Valid values are: <br> - `apply`: Uses `min_score` for normalization without modifying the original scores. Formula: `min_max_score = if (score < lowerBoundScore) then (score - minScore) / (maxScore - minScore) else (score - lowerBoundScore) / (maxScore - lowerBoundScore)`. <br> - `clip`: Replaces scores below the lower bound with `min_score`. Formula: `min_max_score = if (score < lowerBoundScore) then 0.0 else (score - lowerBoundScore) / (maxScore - lowerBoundScore)`. <br> - `ignore`: Does not apply a lower bound to this query and uses the standard `min_max` formula instead. <br> Optional. Default is `apply`. 
`normalization.parameters.lower_bounds.min_score` | Float | The lower bound threshold. Valid values are in the [-10000.0, 10000.0] range. If `mode` is set to `ignore`, then this value has no effect. Optional. Default is `0.0`.
`normalization.parameters.upper_bounds` | Array of objects | Defines the upper bound values (the maximum threshold scores) for each query. The array must contain the same number of objects as the number of queries. Optional. Applies only when the `normalization.technique` is set to `min_max`. If not provided, OpenSearch does not apply an upper bound to any subquery and uses the actual maximum score from the retrieved results for normalization.
`normalization.parameters.upper_bounds.mode` | String | Specifies how the upper bound is applied to a query. Valid values are: <br> - `apply`: Uses `max_score` for normalization without modifying the original scores. Formula: `min_max_score = if (score > upperBoundScore) then (score - minScore) / (maxScore - minScore) else (score - minScore) / (upperBoundScore - minScore)`. <br> - `clip`: Replaces scores above the upper bound with `max_score`. Formula: `min_max_score = if (score > upperBoundScore) then 1.0 else (score - minScore) / (upperBoundScore - minScore)`. <br> - `ignore`: Does not apply an upper bound to this query and uses the standard `min_max` formula instead. <br> Optional. Default is `apply`. 
`normalization.parameters.upper_bounds.max_score` | Float | The upper bound threshold. Valid values are in the [-10000.0, 10000.0] range. If `mode` is set to `ignore`, then this value has no effect. Optional. Default is `1.0`. 
`combination.technique` | String | The technique for combining scores. Valid values are [`arithmetic_mean`](https://en.wikipedia.org/wiki/Arithmetic_mean), [`geometric_mean`](https://en.wikipedia.org/wiki/Geometric_mean), and [`harmonic_mean`](https://en.wikipedia.org/wiki/Harmonic_mean). Optional. Default is `arithmetic_mean`. `z_score` supports only `arithmetic_mean`.
`combination.parameters.weights` | Array of floating-point values | Specifies the weights to use for each query. Valid values are in the [0.0, 1.0] range and signify decimal percentages. The closer the weight is to 1.0, the more weight is given to a query. The number of values in the `weights` array must equal the number of queries. The sum of the values in the array must equal 1.0. Optional. If not provided, all queries are given equal weight.
`tag` | String | The processor's identifier. Optional.
`description` | String | A description of the processor. Optional.
`ignore_failure` | Boolean | For this processor, this value is ignored. If the processor fails, the pipeline always fails and returns an error. 

## Example 

The following example demonstrates using a search pipeline with a `normalization-processor`. 

For a comprehensive example, follow the [Getting started with semantic and hybrid search]({{site.url}}{{site.baseurl}}/ml-commons-plugin/semantic-search#tutorial).

### Creating a search pipeline 

The following request creates a search pipeline containing a `normalization-processor` that uses the `min_max` normalization technique and the `arithmetic_mean` combination technique. The combination technique assigns a weight of 30% to the first query and 70% to the second query:

```json
PUT /_search/pipeline/nlp-search-pipeline
{
  "description": "Post processor for hybrid search",
  "phase_results_processors": [
    {
      "normalization-processor": {
        "normalization": {
          "technique": "min_max"
        },
        "combination": {
          "technique": "arithmetic_mean",
          "parameters": {
            "weights": [
              0.3,
              0.7
            ]
          }
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

The following example demonstrates using the `lower_bounds` and `upper_bounds` parameters with the `min_max` normalization technique. It omits the `weights` parameter in the combination technique, causing the queries to be weighted equally by default. In this example, the `lower_bounds` parameter is used to set different lower bounds for each query in a hybrid search, and the `upper_bounds` parameter is used to set different upper bounds. For the first query, a lower bound of 0.5 is applied and an upper bound of 0.8 is clipped. For the second query, both the lower bound and the upper bound are ignored. This allows for fine-tuning of the normalization process for each individual query in a hybrid search:

```json
PUT /_search/pipeline/nlp-search-pipeline
{
  "description": "Post processor for hybrid search",
  "phase_results_processors": [
    {
      "normalization-processor": {
        "normalization": {
          "technique": "min_max",
          "parameters": {
            "lower_bounds": [
                {
                  "mode": "apply",
                  "min_score": 0.5
                },
                {
                  "mode": "ignore"
                }
              ],
            "upper_bounds": [
              {
                "mode": "clip",
                "max_score": 0.8
              },
              {
                "mode": "ignore"
              }
            ]
          }
        },
        "combination": {
          "technique": "arithmetic_mean"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Using a search pipeline

Provide the query clauses that you want to combine in a `hybrid` query and apply the search pipeline created in the previous section so that the scores are combined using the chosen techniques:

```json
GET /my-nlp-index/_search?search_pipeline=nlp-search-pipeline
{
  "_source": {
    "exclude": [
      "passage_embedding"
    ]
  },
  "query": {
    "hybrid": {
      "queries": [
        {
          "match": {
            "text": {
              "query": "horse"
            }
          }
        },
        {
          "neural": {
            "passage_embedding": {
              "query_text": "wild west",
              "model_id": "aVeif4oB5Vm0Tdw8zYO2",
              "k": 5
            }
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

For more information about setting up hybrid search, see [Hybrid search]({{site.url}}{{site.baseurl}}/search-plugins/hybrid-search/).

## Search tuning recommendations

To improve search relevance, we recommend increasing the sample size.

If the hybrid query does not return some expected results, it may be because the subqueries return too few documents. The `normalization-processor` only transforms the results returned by each subquery; it does not perform any additional sampling. During our experiments, we used [nDCG@10](https://en.wikipedia.org/wiki/Discounted_cumulative_gain) to measure quality of information retrieval depending on the number of documents returned (the size). We have found that a size in the [100, 200] range works best for datasets of up to 10M documents. We do not recommend increasing the size beyond the recommended values because higher size values do not improve search relevance but increase search latency.
