---
layout: default
title: Reciprocal rank fusion
parent: Hybrid search
grand_parent: AI search
has_children: false
has_math: true
nav_order: 5
---

# Reciprocal rank fusion
**Introduced 2.19**
{: .label .label-purple }

Reciprocal rank fusion (RRF) combines the results of multiple query clauses using each document's position in each result list rather than its relevance score. A document that appears near the top of several result lists receives a higher combined score than a document that appears at the top of only one list.

Because RRF uses only ranks, the relevance scores produced by the individual query clauses never need to be comparable. A BM25 score of `12.4` and a vector similarity of `0.87` measure different quantities on different scales, but a rank of `1` identifies the top result in both lists. RRF is therefore a reasonable starting point for hybrid search when you have not yet determined how to weight keyword relevance against semantic relevance.

OpenSearch calculates the RRF score of a document $$d$$ as follows:

$$score(d) = \sum_{q \in Q} \frac{1}{k + rank_q(d)}$$

The formula uses the following variables:

- $$Q$$ is the set of query clauses in the `hybrid` query.
- $$rank_q(d)$$ is the position of $$d$$ in the results of query clause $$q$$, starting from `1`. Query clauses in which $$d$$ does not appear contribute nothing.
- $$k$$ is the rank constant, configured by the `rank_constant` parameter.

## Choosing a combination method

Hybrid search provides two search phase results processors that combine subquery results. Use the following table to determine which one to configure.

| | Score ranker processor (rank based) | Normalization processor (score based) |
| :--- | :--- | :--- |
| Combination input | Document ranks | Document relevance scores |
| Techniques | `rrf` | `arithmetic_mean`, `geometric_mean`, `harmonic_mean`, applied after `min_max`, `l2`, or `z_score` normalization |
| Score magnitudes | Discarded, so a document that outscores the next result by a small margin is treated the same as one that outscores it by a large margin | Preserved, so the margin between two documents affects the combined score |
| Tuning parameters | `rank_constant` and optional `weights` | Normalization technique, combination technique, `weights`, and optional score bounds |
| Available from | 2.19 | 2.10 |

Start with RRF when you want a configuration that works without measuring the score distributions of your query clauses first. RRF is usually the better choice in the following cases:

- The query clauses produce scores on scales that cannot be compared directly, such as a multimodal pipeline in which text relevance spans a wide range of values and visual similarity spans a narrow one.
- The data contains outliers or has high score variance, as scientific corpora and log data often do. Min-max and L2 normalization are sensitive to extreme values, whereas rank aggregation prevents a single outlier from skewing the combined ranking.
- Relevance signals are sparse, as with click and purchase data in ecommerce catalogs. Ranking by position preserves the position of niche items that have strong semantic or metadata relevance.
- The data changes continuously. Normalization depends on the score distribution of the current result set, so streaming data requires recalibration, which RRF does not require.
- You want to reward documents that rank well across several query clauses. L2 normalization has no mechanism for prioritizing documents that appear in more than one result list.

Use the normalization processor when the score margins contain information that must be preserved in the final ranking, such as when one query clause returns a single strong match followed by weak matches and the final ranking must reflect that difference. The three normalization techniques preserve those margins differently. For more information, see [Normalization techniques]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/normalization-processor/#normalization-techniques).

The trade-off for RRF is a small reduction in relevance. In benchmarks on six BEIR datasets, RRF averaged 3.86% lower NDCG@10 than the score-based hybrid pipeline, with comparable search latency and coordinator node CPU utilization. For the full results, see [Introducing reciprocal rank fusion for hybrid search](https://opensearch.org/blog/introducing-reciprocal-rank-fusion-hybrid-search/). To compare the two processors on your own data and judgment lists, use [Search Relevance Workbench]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/optimize-hybrid-search/), which evaluates both across a range of parameter values.

For the full list of `score-ranker-processor` request fields, see [Score ranker processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/score-ranker-processor/).

## Example: Fusing keyword and vector results

The following example builds a product index, runs a keyword query clause and a vector query clause separately to show their individual rankings, and then fuses them with RRF.

The example uses two-dimensional vectors and specifies them directly in each document so that you can verify the arithmetic manually. In a production index, generate embeddings with a machine learning model. For more information, see [Generating embeddings automatically]({{site.url}}{{site.baseurl}}/vector-search/getting-started/auto-generated-embeddings/).
{: .note}

The index uses a single shard so that the ranks are reproducible. For more information about how shard count affects RRF, see [The effect of shard count on RRF results](#the-effect-of-shard-count-on-rrf-results).
{: .note}

### Step 1: Create an index

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

### Step 2: Ingest documents

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

### Step 3: Run each query clause separately

Run the keyword query clause on its own:

```json
GET /products/_search
{
  "_source": ["item_name"],
  "query": {
    "match": {
      "item_name": "running shoes"
    }
  }
}
```
{% include copy-curl.html %}

Two documents contain both terms. Document `1` ranks first because its shorter `item_name` field produces a higher BM25 score:

| Rank | Document ID | `item_name` | Score |
| :--- | :--- | :--- | :--- |
| 1 | `1` | kids running shoes | 0.81676 |
| 2 | `2` | mens lightweight running shoes for road racing | 0.53566 |

Run the vector query clause on its own:

```json
GET /products/_search
{
  "_source": ["item_name"],
  "query": {
    "knn": {
      "item_vector": {
        "vector": [0.9, 0.1],
        "k": 3
      }
    }
  }
}
```
{% include copy-curl.html %}

Because `k` is `3`, the query clause returns three documents:

| Rank | Document ID | `item_name` | Score |
| :--- | :--- | :--- | :--- |
| 1 | `2` | mens lightweight running shoes for road racing | 1.0 |
| 2 | `3` | trail runners | 0.98039 |
| 3 | `4` | athletic socks | 0.75758 |

Document `2` is the only document that both query clauses return, and neither one ranks it first.

### Step 4: Create a search pipeline

Create a search pipeline containing a `score-ranker-processor` that uses the `rrf` combination technique. This example sets `rank_constant` to `1` so that the resulting scores are easier to read; the default is `60`:

```json
PUT /_search/pipeline/rrf-pipeline
{
  "description": "Post processor for hybrid RRF search",
  "phase_results_processors": [
    {
      "score-ranker-processor": {
        "combination": {
          "technique": "rrf",
          "rank_constant": 1
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Step 5: Run the hybrid query

Combine both query clauses in a [`hybrid` query]({{site.url}}{{site.baseurl}}/query-dsl/compound/hybrid/) and apply the search pipeline:

```json
GET /products/_search?search_pipeline=rrf-pipeline
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

The response contains the fused ranking:

```json
{
  "took": 5,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 4,
      "relation": "eq"
    },
    "max_score": 0.8333334,
    "hits": [
      {
        "_index": "products",
        "_id": "2",
        "_score": 0.8333334,
        "_source": {
          "item_name": "mens lightweight running shoes for road racing"
        }
      },
      {
        "_index": "products",
        "_id": "1",
        "_score": 0.5,
        "_source": {
          "item_name": "kids running shoes"
        }
      },
      {
        "_index": "products",
        "_id": "3",
        "_score": 0.33333334,
        "_source": {
          "item_name": "trail runners"
        }
      },
      {
        "_index": "products",
        "_id": "4",
        "_score": 0.25,
        "_source": {
          "item_name": "athletic socks"
        }
      }
    ]
  }
}
```

Each `_score` is the sum of the document's reciprocal ranks:

| Document ID | Keyword rank | Vector rank | RRF calculation | `_score` |
| :--- | :--- | :--- | :--- | :--- |
| `2` | 2 | 1 | 1 / (1 + 2) + 1 / (1 + 1) | 0.8333334 |
| `1` | 1 | -- | 1 / (1 + 1) | 0.5 |
| `3` | -- | 2 | 1 / (1 + 2) | 0.33333334 |
| `4` | -- | 3 | 1 / (1 + 3) | 0.25 |

Document `2` ranks first because it is the only document that both query clauses return, even though it ranks second by keyword relevance and its vector score margin over document `3` is small. Document `5` is absent from the response because neither query clause returned it; RRF ranks only the union of the subquery results.

## Controlling fusion depth

RRF can only reward a document for appearing in several result lists if the document is present in the portion of each list that reaches the fusion step. Two settings bound that portion:

- The `k` value in a `knn` query clause limits the number of documents that the clause returns per shard, so it also limits the number of documents that receive a vector rank. In the previous example, `k` is `3`, which is why documents `1` and `5` have no vector rank.
- `size` limits the number of results that each query clause contributes per shard. By default, every query clause is truncated to `size` results before fusion.

The `size` bound is the one that most often produces unexpected results. Rerunning the [previous query](#step-5-run-the-hybrid-query) with `size` set to `1` returns document `1` rather than document `2`:

```json
GET /products/_search?search_pipeline=rrf-pipeline
{
  "size": 1,
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

Each query clause contributes only its first result, so the keyword clause supplies document `1` and the vector clause supplies document `2`. Neither document appears in both truncated lists, both score 1 / (1 + 1) = 0.5, and the tie resolves in favor of document `1`. The agreement between the two clauses that ranked document `2` first at `size: 10` no longer reaches the fusion step.

To decouple fusion depth from page size, set `pagination_depth` in the `hybrid` query. It defines how many results each query clause contributes per shard, regardless of `size`. The following query returns one result but fuses the top 10 results of each clause, restoring document `2` as the top hit:

```json
GET /products/_search?search_pipeline=rrf-pipeline
{
  "size": 1,
  "_source": {
    "excludes": ["item_vector"]
  },
  "query": {
    "hybrid": {
      "pagination_depth": 10,
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

When your application requests a small number of results, set `pagination_depth` higher than the largest `size` value that the application uses. Larger values improve the quality of the fused ranking but require OpenSearch to retain and process more results per shard. For more information, see [Paginating hybrid query results]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/pagination/).

## Interpreting RRF scores

An RRF `_score` is a sum of reciprocal ranks, so it reflects only the positions a document occupied in the query clause results and has no relationship to the relevance scores of the underlying query clauses. The highest score a document can receive is the sum of the query clause weights divided by (`rank_constant` + 1), which a document earns by ranking first in every query clause. With the default `rank_constant` of `60`, the scores of the top results therefore fall into a narrow band near 1 / 61, as the [rank constant](#tuning-the-rank-constant) table shows. Two consequences follow:

- Avoid using a `min_score` threshold to exclude RRF results. OpenSearch applies `min_score` to the RRF score, but that value depends on the number of query clauses and the rank constant rather than on how closely a document matches the query.
- Avoid comparing RRF scores across queries. The same score can represent a strong match for one query and a weak match for another.

To see which rank each query clause contributed to a document, add the [`hybrid_score_explanation` response processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/explanation-processor/) to the search pipeline and run the query with `explain=true`:

```json
PUT /_search/pipeline/rrf-explain-pipeline
{
  "description": "RRF pipeline with score explanation",
  "phase_results_processors": [
    {
      "score-ranker-processor": {
        "combination": {
          "technique": "rrf",
          "rank_constant": 1
        }
      }
    }
  ],
  "response_processors": [
    {
      "hybrid_score_explanation": {}
    }
  ]
}
```
{% include copy-curl.html %}

The explanation for document `2` reports one contribution per query clause, along with the raw subquery score that determined its rank in that clause:

```json
{
  "_id": "2",
  "_score": 0.8333334,
  "_explanation": {
    "value": 0.8333334,
    "description": "rrf combination of:",
    "details": [
      {
        "value": 0.33333334,
        "description": "rrf, rank_constant [1] normalization of:",
        "details": [
          {
            "value": 0.5356597,
            "description": "sum of:"
          }
        ]
      },
      {
        "value": 0.5,
        "description": "rrf, rank_constant [1] normalization of:",
        "details": [
          {
            "value": 1.0,
            "description": "within top 3 docs"
          }
        ]
      }
    ]
  }
}
```

Without the `hybrid_score_explanation` response processor, the `_explanation` object reports raw Lucene scores that do not add up to `_score`. For more information, see [Hybrid search explain]({{site.url}}{{site.baseurl}}/vector-search/ai-search/hybrid-search/explain/).

## The effect of shard count on RRF results

OpenSearch assigns ranks after merging each query clause's shard-level results, but two inputs to that merge are per shard, so the same data and the same query can produce different RRF scores on indexes with different shard counts:

- BM25 statistics are calculated per shard, so a keyword query clause can order documents differently depending on which shard holds each document.
- The `k` value in a `knn` query clause applies per shard, so an index with three shards can return up to three times as many documents from a vector query clause as a single-shard index. Each additional document receives a rank and enters fusion.

Running the [previous example](#step-5-run-the-hybrid-query) on the same five documents in a three-shard index returns five results instead of four, and the keyword ranks of documents `1` and `2` are reversed:

| Document ID | Keyword rank | Vector rank | RRF calculation | `_score` |
| :--- | :--- | :--- | :--- | :--- |
| `2` | 1 | 1 | 1 / (1 + 1) + 1 / (1 + 1) | 1.0 |
| `1` | 2 | 4 | 1 / (1 + 2) + 1 / (1 + 4) | 0.53333336 |
| `3` | -- | 2 | 1 / (1 + 2) | 0.33333334 |
| `4` | -- | 3 | 1 / (1 + 3) | 0.25 |
| `5` | -- | 5 | 1 / (1 + 5) | 0.16666667 |

The BM25 effect diminishes as the number of documents per shard grows, because per-shard term statistics converge on the index-wide values. The `k` effect does not: a vector query clause always contributes up to `k` documents per shard. When you tune `rank_constant` or `weights`, run the experiment against an index with the same shard count as your production index.

## Tuning the rank constant

The `rank_constant` parameter controls how quickly a document's contribution decays as its rank falls. Valid values are in the [1, 10000] range. The default is `60`.

A small rank constant produces large gaps between consecutive ranks, concentrating influence in the first few results of each query clause. A large rank constant reduces those gaps, so that lower-ranked results carry nearly as much weight as top-ranked results. Running the previous example with the default `rank_constant` of `60` produces the same ordering with compressed scores, because 1 / 61, 1 / 62, and 1 / 63 differ far less than 1 / 2, 1 / 3, and 1 / 4 do:

| Document ID | RRF calculation | `_score` |
| :--- | :--- | :--- |
| `2` | 1 / (60 + 2) + 1 / (60 + 1) | 0.032522473 |
| `1` | 1 / (60 + 1) | 0.016393442 |
| `3` | 1 / (60 + 2) | 0.016129032 |
| `4` | 1 / (60 + 3) | 0.015873017 |

To choose a value for your own data, run a hybrid search experiment that evaluates several rank constants against a judgment list. For more information, see [Optimizing hybrid search]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/optimize-hybrid-search/).

## Weighting query clauses

By default, RRF weights all query clauses equally. To favor one clause over another, specify `combination.parameters.weights`. The number of weights must match the number of query clauses, and the weights must sum to `1.0`. Each weight multiplies the corresponding clause's reciprocal rank:

$$score(d) = \sum_{q \in Q} w_q \cdot \frac{1}{k + rank_q(d)}$$

The following pipeline assigns 30% of the weight to the keyword query clause and 70% to the vector query clause:

```json
PUT /_search/pipeline/rrf-pipeline
{
  "description": "Post processor for hybrid RRF search",
  "phase_results_processors": [
    {
      "score-ranker-processor": {
        "combination": {
          "technique": "rrf",
          "rank_constant": 1,
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

Rerunning the query from [Step 5](#step-5-run-the-hybrid-query) with these weights ranks document `1` last, because its only contribution comes from the keyword clause, which now carries less weight:

| Document ID | RRF calculation | `_score` |
| :--- | :--- | :--- |
| `2` | 0.3 &times; 1 / (1 + 2) + 0.7 &times; 1 / (1 + 1) | 0.45 |
| `3` | 0.7 &times; 1 / (1 + 2) | 0.23333333 |
| `4` | 0.7 &times; 1 / (1 + 3) | 0.175 |
| `1` | 0.3 &times; 1 / (1 + 1) | 0.15 |

Weighting reintroduces the tuning effort that unweighted RRF avoids, so change the weights only when you can measure the effect on relevance.

## Next steps

- [Score ranker processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/score-ranker-processor/)
- [Normalization processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/normalization-processor/)
- [Optimizing hybrid search]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/optimize-hybrid-search/)
