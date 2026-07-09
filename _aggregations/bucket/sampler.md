---
layout: default
title: Sampler
parent: Bucket aggregations
nav_order: 170
redirect_from:
  - /query-dsl/aggregations/bucket/sampler/
---

# Sampler aggregations

The `sampler` aggregation limits subaggregation processing to the top-scoring documents on each shard. This narrows the focus to the most relevant matches rather than processing the entire result set, which reduces computation time and can improve the quality of aggregation results by excluding low-relevance documents from the long tail.

Sampling is particularly valuable with subaggregations like `significant_terms`. Without a sampler, the full result set includes a long tail of marginally relevant documents whose generic terms dominate by volume, obscuring the truly distinctive terms found in top-scoring matches.

For diversity-based sampling that prevents any single field value from dominating the sample, see the [`diversified_sampler` aggregation]({{site.url}}{{site.baseurl}}/aggregations/bucket/diversified-sampler/).

## Parameters

The `sampler` aggregation takes the following parameters.

| Parameter | Required/Optional | Data type | Description |
| :--- | :--- | :--- | :--- |
| `shard_size` | Optional | Integer | The maximum number of top-scoring documents collected from each shard. Default is `100`. |

## Example

The following example limits the sample to 200 top-scoring documents per shard, then runs a `terms` subaggregation to find the distribution of product categories within that sample:

```json
GET /opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "sample": {
      "sampler": {
        "shard_size": 200
      },
      "aggs": {
        "top_categories": {
          "terms": {
            "field": "category.keyword"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response shows that the sample contains 200 documents, and the `terms` subaggregation operated only on those 200 documents rather than all 4,675:

```json
{
  ...
  "aggregations": {
    "sample": {
      "doc_count": 200,
      "top_categories": {
        "doc_count_error_upper_bound": 0,
        "sum_other_doc_count": 0,
        "buckets": [
          {
            "key": "Men's Clothing",
            "doc_count": 82
          },
          {
            "key": "Women's Clothing",
            "doc_count": 82
          },
          {
            "key": "Women's Shoes",
            "doc_count": 49
          },
          {
            "key": "Women's Accessories",
            "doc_count": 40
          },
          {
            "key": "Men's Shoes",
            "doc_count": 37
          },
          {
            "key": "Men's Accessories",
            "doc_count": 25
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
| `doc_count` | Integer | The total number of documents in the sample across all shards. |

## Limitations

The `sampler` aggregation cannot be nested under a `terms` aggregation that uses `breadth_first` collect mode because breadth-first collection discards relevance scores that the sampler requires.
