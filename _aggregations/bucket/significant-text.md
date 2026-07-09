---
layout: default
title: Significant text
parent: Bucket aggregations
nav_order: 190
redirect_from:
  - /query-dsl/aggregations/bucket/significant-text/
---

# Significant text aggregations

The `significant_text` aggregation identifies unusual or interesting terms in free-text fields by comparing term frequencies in a foreground set (your query results) against a background set (the full index). Unlike [`significant_terms`]({{site.url}}{{site.baseurl}}/aggregations/bucket/significant-terms/), which operates on indexed keyword fields, `significant_text` re-analyzes the source text on the fly and can filter duplicate content that would otherwise skew results.

Re-analyzing large result sets is CPU intensive. Use `significant_text` inside a [`sampler`]({{site.url}}{{site.baseurl}}/aggregations/bucket/sampler/) or [`diversified_sampler`]({{site.url}}{{site.baseurl}}/aggregations/bucket/diversified-sampler/) aggregation to limit analysis to a small selection of top-matching documents (for example, 100--200).
{: .note}

## Parameters

The `significant_text` aggregation takes the following parameters.

| Parameter | Required/Optional | Data type | Description |
| :--- | :--- | :--- | :--- |
| `field` | Required | String | The text field to analyze. |
| `size` | Optional | Integer | The number of term buckets to return. Default is `10`. |
| `shard_size` | Optional | Integer | The number of candidate terms collected from each shard. Higher values improve accuracy at the cost of performance. Default is `-1` (auto-estimated). |
| `min_doc_count` | Optional | Integer | The minimum number of documents a term must appear in to be included. Default is `3`. Setting to `1` tends to return typos and misspellings. |
| `shard_min_doc_count` | Optional | Integer | The minimum local shard frequency for a term to be considered as a candidate. Default is `1`. |
| `background_filter` | Optional | Object | A query that narrows the background set used for comparison. By default, the entire index is used as the background. |
| `filter_duplicate_text` | Optional | Boolean | When `true`, filters out sequences of 6 or more tokens that have already been seen, reducing noise from cut-and-paste content. Default is `false`. |
| `source_fields` | Optional | Array | A list of JSON source field names from which text is analyzed. Use when the indexed field name differs from the source field (for example, with `copy_to`). |
| `include` | Optional | String or Array | A regular expression pattern or list of exact terms to include. |
| `exclude` | Optional | String or Array | A regular expression pattern or list of exact terms to exclude from results. |

## Example

The following example assumes a `shakespeare` index containing the complete works of Shakespeare with a `text_entry` text field. The query searches for documents containing "breathe," then uses `significant_text` inside a `sampler` to discover the terms that are most strongly associated with those passages compared to the full corpus:

```json
GET /shakespeare/_search
{
  "size": 0,
  "query": {
    "match": {
      "text_entry": "breathe"
    }
  },
  "aggs": {
    "sample": {
      "sampler": {
        "shard_size": 100
      },
      "aggs": {
        "keywords": {
          "significant_text": {
            "field": "text_entry",
            "min_doc_count": 4
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response identifies terms like "air," "dead," and "life" as significantly associated with passages about breathing:

```json
{
  "took" : 44,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 59,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  },
  "aggregations" : {
    "sample" : {
      "doc_count" : 59,
      "keywords" : {
        "doc_count" : 59,
        "bg_count" : 111396,
        "buckets" : [
          {
            "key" : "breathe",
            "doc_count" : 59,
            "score" : 1887.0677966101694,
            "bg_count" : 59
          },
          {
            "key" : "air",
            "doc_count" : 4,
            "score" : 2.641295376716233,
            "bg_count" : 189
          },
          {
            "key" : "dead",
            "doc_count" : 4,
            "score" : 0.9665839666414213,
            "bg_count" : 495
          },
          {
            "key" : "life",
            "doc_count" : 5,
            "score" : 0.9090787433467572,
            "bg_count" : 805
          }
        ]
      }
    }
  }
}
```

## Example: Narrowing the background with a filter

By default, term frequencies are compared against the entire index. The `background_filter` parameter narrows the comparison set, which can reveal terms that are significant within a specific context. The following example compares "breathe" passages against only the lines from "Henry IV" rather than the full corpus:

```json
GET /shakespeare/_search
{
  "size": 0,
  "query": {
    "match": {
      "text_entry": "breathe"
    }
  },
  "aggs": {
    "sample": {
      "sampler": {
        "shard_size": 100
      },
      "aggs": {
        "keywords": {
          "significant_text": {
            "field": "text_entry",
            "min_doc_count": 3,
            "background_filter": {
              "term": {
                "play_name": "Henry IV"
              }
            }
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

With the background narrowed to 3,205 lines (just Henry IV), the `bg_count` values are smaller and the scores shift accordingly:

```json
{
  "took" : 83,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 59,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  },
  "aggregations" : {
    "sample" : {
      "doc_count" : 59,
      "keywords" : {
        "doc_count" : 59,
        "bg_count" : 3205,
        "buckets" : [
          {
            "key" : "breathe",
            "doc_count" : 59,
            "score" : 533.1666666666666,
            "bg_count" : 6
          },
          {
            "key" : "air",
            "doc_count" : 4,
            "score" : 4.842669730920234,
            "bg_count" : 3
          },
          {
            "key" : "dead",
            "doc_count" : 4,
            "score" : 1.0653879300819835,
            "bg_count" : 13
          }
        ]
      }
    }
  }
}
```

## Response body fields

The following table lists the response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `doc_count` | Integer | The number of documents in the sample (at the sampler level) or in the foreground set (at the significant_text level). |
| `bg_count` | Integer | The total number of documents in the background set used for comparison. |
| `buckets` | Array | The significant term buckets, sorted by `score` descending. |
| `buckets.key` | String | The significant term. |
| `buckets.doc_count` | Integer | The number of documents in the foreground set containing this term. |
| `buckets.score` | Double | The significance score representing how much more frequently this term appears in the foreground compared to the background. |
| `buckets.bg_count` | Integer | The number of documents in the background set containing this term. |

## Significance heuristics

By default, significance scores use the Johnson-Laird and Hinkley (JLH) heuristic. You can select an alternative scoring algorithm by adding its name as a parameter alongside the `field`. The following heuristics are supported.

| Heuristic | Parameter | Description |
| :--- | :--- | :--- |
| JLH | `jlh: {}` | The default. Measures the relative change in popularity between foreground and background. |
| Mutual information | `mutual_information: {}` | Measures how much information the presence of the term provides about belonging to the foreground set. Supports `include_negatives` and `background_is_superset` options. |
| Chi-square | `chi_square: {}` | A standard statistical test for independence between the term and the foreground set. Supports `include_negatives` and `background_is_superset` options. |
| GND | `gnd: {}` | Google Normalized Distance. Measures the statistical association using co-occurrence ratios. Supports `background_is_superset` option. |

The following example uses chi-square scoring instead of the default JLH:

```json
GET /shakespeare/_search
{
  "size": 0,
  "query": {
    "match": {
      "text_entry": "breathe"
    }
  },
  "aggs": {
    "sample": {
      "sampler": {
        "shard_size": 100
      },
      "aggs": {
        "keywords": {
          "significant_text": {
            "field": "text_entry",
            "min_doc_count": 4,
            "chi_square": {}
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response shows that the same terms are identified but the score scale is different:

```json
{
  "took" : 19,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 59,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  },
  "aggregations" : {
    "sample" : {
      "doc_count" : 59,
      "keywords" : {
        "doc_count" : 59,
        "bg_count" : 111396,
        "buckets" : [
          {
            "key" : "breathe",
            "doc_count" : 59,
            "score" : 111396.0,
            "bg_count" : 59
          },
          {
            "key" : "air",
            "doc_count" : 4,
            "score" : 152.27540220402065,
            "bg_count" : 189
          },
          {
            "key" : "dead",
            "doc_count" : 4,
            "score" : 53.556852313941825,
            "bg_count" : 495
          },
          {
            "key" : "life",
            "doc_count" : 5,
            "score" : 49.44532193700098,
            "bg_count" : 805
          }
        ]
      }
    }
  }
}
```

## Limitations

The `significant_text` aggregation has the following limitations:

- Does not support child aggregations because of high memory cost. To analyze specific terms further, run a separate query with a `terms` aggregation and an `include` clause containing the significant terms from the initial results.
- Does not support nested objects because it works with the document JSON source.
- Document counts may have minor inaccuracies because each shard reports independently and counts are combined at the coordinating node. Increase `shard_size` to improve precision at the cost of performance. By default, the `shard_size` is set to -1 to automatically estimate the number of shards and the `size` parameter.
