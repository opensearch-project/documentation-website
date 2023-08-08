---
layout: default
title: Significant text
parent: Bucket aggregations
grand_parent: Aggregations
nav_order: 190
---

# Significant text aggregations

The `significant_text` aggregation is similar to the `significant_terms` aggregation but it's for raw text fields.
Significant text measures the change in popularity measured between the foreground and background sets using statistical analysis. For example, it might suggest Tesla when you look for its stock acronym TSLA.

The `significant_text` aggregation re-analyzes the source text on the fly, filtering noisy data like duplicate paragraphs, boilerplate headers and footers, and so on, which might otherwise skew the results.

Re-analyzing high-cardinality datasets can be a very CPU-intensive operation. We recommend using the `significant_text` aggregation inside a sampler aggregation to limit the analysis to a small selection of top-matching documents, for example 200.

You can set the following parameters:

- `min_doc_count` - Return results that match more than a configured number of top hits. We recommend not setting `min_doc_count` to 1 because it tends to return terms that are typos or misspellings. Finding more than one instance of a term helps reinforce that the significance is not the result of a one-off accident. The default value of 3 is used to provide a minimum weight-of-evidence.
- `shard_size` - Setting a high value increases stability (and accuracy) at the expense of computational performance.
- `shard_min_doc_count` - If your text contains many low frequency words and you're not interested in these (for example typos), then you can set the `shard_min_doc_count` parameter to filter out candidate terms at a shard level with a reasonable certainty to not reach the required `min_doc_count` even after merging the local significant text frequencies. The default value is 1, which has no impact until you explicitly set it. We recommend setting this value much lower than the `min_doc_count` value.

Assume that you have the complete works of Shakespeare indexed in an OpenSearch cluster. You can find significant texts in relation to the word "breathe" in the `text_entry` field:

```json
GET shakespeare/_search
{
  "query": {
    "match": {
      "text_entry": "breathe"
    }
  },
  "aggregations": {
    "my_sample": {
      "sampler": {
        "shard_size": 100
      },
      "aggregations": {
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

#### Example response

```json
"aggregations" : {
  "my_sample" : {
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

The most significant texts in relation to `breathe` are `air`, `dead`, and `life`.

The `significant_text` aggregation has the following limitations:

- Doesn't support child aggregations because child aggregations come at a high memory cost. As a workaround, you can add a follow-up query using a `terms` aggregation with an include clause and a child aggregation.
- Doesn't support nested objects because it works with the document JSON source.
- The counts of documents might have some (typically small) inaccuracies as it's based on summing the samples returned from each shard. You can use the `shard_size` parameter to fine-tune the trade-off between accuracy and performance. By default, the `shard_size` is set to -1 to automatically estimate the number of shards and the `size` parameter.

The default source of statistical information for background term frequencies is the entire index. You can narrow this scope with a background filter for more focus:

```json
GET shakespeare/_search
{
  "query": {
    "match": {
      "text_entry": "breathe"
    }
  },
  "aggregations": {
    "my_sample": {
      "sampler": {
        "shard_size": 100
      },
      "aggregations": {
        "keywords": {
          "significant_text": {
            "field": "text_entry",
            "background_filter": {
              "term": {
                "speaker": "JOHN OF GAUNT"
              }
            }
          }
        }
      }
    }
  }
}
```