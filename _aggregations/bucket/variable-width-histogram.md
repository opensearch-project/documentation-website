---
layout: default
title: Variable width histogram
parent: Bucket aggregations
nav_order: 210
---

# Variable width histogram aggregation

The `variable_width_histogram` aggregation divides a numeric field's values into a target number of buckets whose widths adapt to the data. Bucket boundaries are derived by clustering the values, so dense parts of the value range are split into narrow buckets and sparse parts are covered by wide ones. Use this aggregation for unevenly distributed data, for which a fixed `interval` in a [`histogram`]({{site.url}}{{site.baseurl}}/aggregations/bucket/histogram/) aggregation produces either many nearly empty buckets or a few buckets holding almost every document.

Each shard buffers the first `initial_buffer` values it collects, sorts them, and divides them into a number of initial clusters equal to three-quarters of `shard_size`. It assigns each remaining value to the nearest cluster, unless the value lies more than twice the average distance between neighboring cluster centroids away from all of them and the shard holds fewer than `shard_size` clusters, in which case the shard starts a new cluster. The coordinating node collects the clusters from all shards and repeatedly merges the two clusters with the closest centroids until `buckets` remain.

## Parameters

The `variable_width_histogram` aggregation takes the following parameters.

| Parameter | Required/Optional | Data type | Description |
| :--- | :--- | :--- | :--- |
| `field` | Required | String | The numeric field to aggregate on. Provide either `field` or `script`. |
| `buckets` | Optional | Integer | The target number of buckets. Must be greater than `0` and cannot exceed the `search.max_buckets` setting. The response can contain fewer buckets than requested when the values do not separate into that many clusters. Default is `10`. |
| `shard_size` | Optional | Integer | The number of clusters each shard builds before its results are sent to the coordinating node. Must be greater than `1`. Larger values produce smaller clusters on each shard, which reduces overlap between the final buckets and places their boundaries more accurately, but increases both the memory used on the shards and the volume of data transferred to the coordinating node. Default is `buckets` multiplied by `50`. |
| `initial_buffer` | Optional | Integer | The number of values each shard buffers before it computes the initial cluster boundaries. Must be greater than or equal to `buckets`. A larger buffer derives the initial boundaries from a more representative sample of the data but uses more memory. Default is the smaller of `shard_size` multiplied by `10` and `50000`. |
| `script` | Optional | Object | A script that produces the numeric value to aggregate on. Provide either `field` or `script`. |
| `missing` | Optional | Number | The value to assign to documents missing the target field. By default, missing documents are ignored. |
| `format` | Optional | String | A [DecimalFormat](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/text/DecimalFormat.html) formatting string applied to `min`, `key`, and `max`. Returns the formatted output in the additional `min_as_string`, `key_as_string`, and `max_as_string` response fields. |

## Example

The following example groups ecommerce order totals into five variable-width buckets:

```json
GET /opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "price_buckets": {
      "variable_width_histogram": {
        "field": "taxful_total_price",
        "buckets": 5
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "took": 17,
  "timed_out": false,
  "terminated_early": true,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 4675,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "price_buckets": {
      "buckets": [
        {
          "min": 6.98828125,
          "key": 59.14907207464146,
          "max": 105.46875,
          "doc_count": 3835
        },
        {
          "min": 105.46875,
          "key": 139.096796875,
          "max": 229.5,
          "doc_count": 800
        },
        {
          "min": 229.5,
          "key": 247.11111111111111,
          "max": 304.0,
          "doc_count": 27
        },
        {
          "min": 304.0,
          "key": 318.4,
          "max": 308.0,
          "doc_count": 5
        },
        {
          "min": 308.0,
          "key": 563.25,
          "max": 2250.0,
          "doc_count": 8
        }
      ]
    }
  }
}
```

The buckets covering the crowded low end of the price range are a few tens of dollars wide, whereas the last bucket spans nearly $2,000 to cover the few highest orders.

## Example: Nesting a subaggregation

Like other bucket aggregations, `variable_width_histogram` accepts subaggregations. The following example computes the average number of items ordered in each price bucket:

```json
GET /opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "price_buckets": {
      "variable_width_histogram": {
        "field": "taxful_total_price",
        "buckets": 3
      },
      "aggs": {
        "avg_quantity": {
          "avg": {
            "field": "total_quantity"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the subaggregation result in each bucket:

```json
{
  "aggregations": {
    "price_buckets": {
      "buckets": [
        {
          "min": 6.98828125,
          "key": 73.45130757286513,
          "max": 246.0,
          "doc_count": 4649,
          "avg_quantity": {
            "value": 2.1559475155947516
          }
        },
        {
          "min": 246.0,
          "key": 281.9166666666667,
          "max": 370.0,
          "doc_count": 24,
          "avg_quantity": {
            "value": 2.7083333333333335
          }
        },
        {
          "min": 393.0,
          "key": 1321.5,
          "max": 2250.0,
          "doc_count": 2,
          "avg_quantity": {
            "value": 1.5
          }
        }
      ]
    }
  }
}
```

## Response body fields

The following table lists the response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `buckets` | Array | The variable-width buckets, sorted by `key` in ascending order. |
| `buckets.min` | Double | The lower bound of the bucket. |
| `buckets.key` | Double | The mean of the values in the bucket. |
| `buckets.max` | Double | The upper bound of the bucket. |
| `buckets.doc_count` | Integer | The number of documents in the bucket. |
| `buckets.min_as_string` | String | The lower bound of the bucket, formatted according to `format`. Returned only when `format` is set. |
| `buckets.key_as_string` | String | The mean of the values in the bucket, formatted according to `format`. Returned only when `format` is set. |
| `buckets.max_as_string` | String | The upper bound of the bucket, formatted according to `format`. Returned only when `format` is set. |

## Limitations

The `variable_width_histogram` aggregation has the following limitations:

- The aggregation cannot be nested inside a parent aggregation that collects more than one bucket. A [`terms`]({{site.url}}{{site.baseurl}}/aggregations/bucket/terms/), [`histogram`]({{site.url}}{{site.baseurl}}/aggregations/bucket/histogram/), [`range`]({{site.url}}{{site.baseurl}}/aggregations/bucket/range/), or [`filters`]({{site.url}}{{site.baseurl}}/aggregations/bucket/filters/) parent returns the following error:

  ```
  [variable_width_histogram] cannot be nested inside an aggregation that collects more than a single bucket.
  ```

  Single-bucket parents, such as [`filter`]({{site.url}}{{site.baseurl}}/aggregations/bucket/filter/), [`global`]({{site.url}}{{site.baseurl}}/aggregations/bucket/global/), and [`nested`]({{site.url}}{{site.baseurl}}/aggregations/bucket/nested/), are supported.
- The aggregation cannot run as a child of a [`nested`]({{site.url}}{{site.baseurl}}/aggregations/bucket/nested/) aggregation when it has a subaggregation that requires document scores, such as [`top_hits`]({{site.url}}{{site.baseurl}}/aggregations/metric/top-hits/). This combination returns an error.
- The `keyed` parameter is not supported, so buckets are always returned as an array.
- The `min` and `max` bounds are approximate. While merging clusters, OpenSearch can leave two clusters whose bounds overlap as separate buckets if their centroids are far apart. It then sets the boundary between the two buckets to the midpoint of the overlap, so a bound is not necessarily a value present in the data, and the lower bucket holds more values than its bounds indicate while the upper bucket holds fewer. Lowering a bucket's `max` in this way can place it below the bucket's own `key`, which is the mean of the values in the bucket. The fourth bucket in the first example response reports a `key` of `318.4` against a `max` of `308.0` for this reason. This merging step runs on a single-shard index as well as on a multi-shard one.
- Buckets are not contiguous. Each bucket's bounds are the smallest and largest values it holds, so a gap in the data appears as a gap between adjacent buckets. In the subaggregation example response, one bucket ends at `370.0` and the next begins at `393.0`.
- Bucket bounds are sensitive to outliers. A few extreme values stretch a bucket across a wide range of the data: the last bucket in the first example response spans `308.0` to `2250.0` to hold 8 orders.
- Bucket boundaries depend on the order in which each shard collects values, so they can change as segments merge or as documents are added, even when the value distribution stays the same.
