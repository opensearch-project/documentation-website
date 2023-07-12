---
layout: default
title: Sampler
parent: Bucket aggregations
grand_parent: Aggregations
nav_order: 170
---

# Sampler aggregations

If you're aggregating over millions of documents, you can use a `sampler` aggregation to reduce its scope to a small sample of documents for a faster response. The `sampler` aggregation selects the samples by top-scoring documents.

The results are approximate but closely represent the distribution of the real data. The `sampler` aggregation significantly improves query performance, but the estimated responses are not entirely reliable.

The basic syntax is:

```json
“aggs”: {
  "SAMPLE": {
    "sampler": {
      "shard_size": 100
    },
    "aggs": {...}
  }
}
```

The `shard_size` property tells OpenSearch how many documents (at most) to collect from each shard.

The following example limits the number of documents collected on each shard to 1,000 and then buckets the documents by a `terms` aggregation:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "sample": {
      "sampler": {
        "shard_size": 1000
      },
      "aggs": {
        "terms": {
          "terms": {
            "field": "agent.keyword"
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
...
"aggregations" : {
  "sample" : {
    "doc_count" : 1000,
    "terms" : {
      "doc_count_error_upper_bound" : 0,
      "sum_other_doc_count" : 0,
      "buckets" : [
        {
          "key" : "Mozilla/5.0 (X11; Linux x86_64; rv:6.0a1) Gecko/20110421 Firefox/6.0a1",
          "doc_count" : 368
        },
        {
          "key" : "Mozilla/5.0 (X11; Linux i686) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.50 Safari/534.24",
          "doc_count" : 329
        },
        {
          "key" : "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322)",
          "doc_count" : 303
        }
      ]
    }
  }
 }
}
```