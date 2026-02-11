---
layout: default
title: Pipeline aggregations
nav_order: 5
has_children: true
has_toc: false
redirect_from:
  - /opensearch/pipeline-agg/
  - /query-dsl/aggregations/pipeline-agg/
  - /aggregations/pipeline/
  - /aggregations/pipeline-agg/
canonical_url: https://docs.opensearch.org/latest/aggregations/pipeline/index/
---

# Pipeline aggregations

Pipeline aggregations chain together multiple aggregations by using the output of one aggregation as the input for another. They compute complex statistical and mathematical measures like derivatives, moving averages, and cumulative sums. Some pipeline aggregations duplicate the functionality of metric and bucket aggregations but, in many cases, are more intuitive to use.

Pipeline aggregations are executed after all other sibling aggregations. This has performance implications. For example, using the `bucket_selector` pipeline aggregation to narrow a list of buckets does not reduce the number of computations performed on omitted buckets.
{: .note}

Pipeline aggregations cannot be sub-aggregated but can be chained to other pipeline aggregations. For example, you can calculate a second derivative by chaining two consecutive `derivative` aggregations. Keep in mind that pipeline aggregations append to existing output. For example, computing a second derivative by chaining `derivative` aggregations outputs both the first and second derivatives.

## Pipeline aggregation types

Pipeline aggregations are of two types: [sibling](#sibling-aggregations) and [parent](#parent-aggregations).

### Sibling aggregations

A _sibling_ pipeline aggregation takes the output of a nested aggregation and produces new buckets or new aggregations at the same level as the nested buckets.

A sibling aggregation must be a multi-bucket aggregation (have multiple grouped values for a certain field), and the metric must be a numeric value.

### Parent aggregations

A _parent_ aggregation takes the output of an outer aggregation and produces new buckets or new aggregations at the same level as the existing buckets. Unlike sibling pipeline aggregations, which operate across all buckets and produce a single output, parent pipeline aggregations process each bucket individually and write the result back into each bucket.

The specified metric for a parent aggregation must be a numeric value.

We strongly recommend setting `min_doc_count` to `0` (the default for `histogram` aggregations) for parent aggregations. If `min_doc_count` is greater than `0`, then the aggregation omits buckets, which might lead to incorrect results.
{: .important}

## Supported pipeline aggregations

OpenSearch supports the following pipeline aggregations.

| Name | Type | Description |
|------|------|-------------|
| [`avg_bucket`]({{site.url}}{{site.baseurl}}/aggregations/pipeline/avg-bucket/) | Sibling | Calculates the average of a metric in each bucket of a previous aggregation. |
| [`bucket_script`]({{site.url}}{{site.baseurl}}/aggregations/pipeline/bucket-script/) | Parent | Executes a script to perform per-bucket numeric computations across a set of buckets. |
| [`bucket_selector`]({{site.url}}{{site.baseurl}}/aggregations/pipeline/bucket-selector/) | Parent | Evaluates a script to determine whether buckets returned by a `histogram` (or `date_histogram`) aggregation should be included in the final result. |
| [`bucket_sort`]({{site.url}}{{site.baseurl}}/aggregations/pipeline/bucket-selector/) | Parent | Sorts or truncates the buckets produced by its parent multi-bucket aggregation. |
| [`cumulative_sum`]({{site.url}}{{site.baseurl}}/aggregations/pipeline/cumulative-sum/) | Parent | Calculates the cumulative sum across the buckets of a previous aggregation. |
| [`derivative`]({{site.url}}{{site.baseurl}}/aggregations/pipeline/derivative/) | Parent | Calculates first-order and second-order derivatives of each bucket of an aggregation. |
| [`extended_stats`]({{site.url}}{{site.baseurl}}/aggregations/pipeline/extended-stats/) | Sibling | A more comprehensive version of the `stats_bucket` aggregation that provides additional metrics. |
| [`max_bucket`]({{site.url}}{{site.baseurl}}/aggregations/pipeline/max-bucket/) | Sibling | Calculates the maximum of a metric in each bucket of a previous aggregation. |
| [`min_bucket`]({{site.url}}{{site.baseurl}}/aggregations/pipeline/min-bucket/) | Sibling | Calculates the minimum of a metric in each bucket of a previous aggregation. |
| [`moving_avg`]({{site.url}}{{site.baseurl}}/aggregations/pipeline/moving-avg/) *(Deprecated)* | Parent | Calculates a sequence of averages of a metric contained in windows (adjacent subsets) of an ordered dataset. |
| [`moving_fn`]({{site.url}}{{site.baseurl}}/aggregations/pipeline/moving-function/) | Parent | Executes a script over a sliding window. |
| [`percentiles_bucket`]({{site.url}}{{site.baseurl}}/aggregations/pipeline/percentiles-bucket/) | Sibling | Calculates the percentile placement of bucketed metrics. |
| [`serial_diff`]({{site.url}}{{site.baseurl}}/aggregations/pipeline/serial-diff/) | Parent | Calculates the difference between metric values in the current bucket and a previous bucket. It stores the result in the current bucket. |
| [`stats_bucket`]({{site.url}}{{site.baseurl}}/aggregations/pipeline/stats-bucket/) | Sibling | Returns a variety of stats (`count`, `min`, `max`, `avg`, and `sum`) for the buckets of a previous aggregation. |
| [`sum_bucket`]({{site.url}}{{site.baseurl}}/aggregations/pipeline/sum-bucket/) | Sibling | Calculates the sum of a metric in each bucket of a previous aggregation. |


## Buckets path

A pipeline aggregation uses the `buckets_path` parameter to reference the output of other aggregations.
The `buckets_path` parameter has the following syntax:

```r
buckets_path = <agg_name>[ > <agg_name> ... ][ .<metric_name> ]
```

This syntax uses the following elements.

| Element | Description |
| :-- | :-- |
| `<agg_name>` | The name of the aggregation. |
| `>` |  A child selector used to navigate from one aggregation (parent) to another nested aggregation (child).  |
| `.<metric_name>` |  Specifies a metric to retrieve from a multi-value aggregation. Required only if the target aggregation produces multiple metrics. |

To visualize the buckets path, suppose you have the following aggregation structure:

```json
"aggs": {
  "parent_agg": {
    "terms": {
      "field": "category"
    },
    "aggs": {
      "child_agg": {
        "stats": {
          "field": "price"
        }
      }
    }
  }
}
```

To reference the average price from the `child_agg`, which is nested in the `parent_agg`, use `parent_agg>child_agg.avg`.

Examples:

- `my_sum.sum`: Refers to the sum metric from the `my_sum` aggregation.

- `popular_tags>my_sum.sum`: Refers to the `sum` metric from the `my_sum` aggregation, which is nested under the `popular_tags` aggregation.

For multi-value metric aggregations like `stats` or `percentiles`, you must include the metric name (for example, `.min`) in the path. For single-value metrics like `sum` or `avg`, the metric name is optional if unambiguous.
{: .tip}


### Buckets path example

The following example operates on the OpenSearch Dashboards logs sample data. It creates a histogram of values in the `bytes` field, sums the `phpmemory` fields in each histogram bucket, and finally sums the buckets using the `sum_bucket` pipeline aggregation. The `buckets_path` follows the `number_of_bytes>sum_total_memory ` path from the `number_of_bytes` parent aggregation to the `sum_total_memory` subaggregation:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "number_of_bytes": {
      "histogram": {
        "field": "bytes",
        "interval": 10000
      },
      "aggs": {
        "sum_total_memory": {
          "sum": {
            "field": "phpmemory"
          }
        }
      }
    },
    "sum_copies": {
      "sum_bucket": {
        "buckets_path": "number_of_bytes>sum_total_memory"
      }
    }
  }
}
```
{% include copy-curl.html %}

Note that the `buckets_path` contains the names of the component aggregations. Paths are directed, meaning that they cascade one way, downward from parents to children. 

The pipeline aggregation returns the total memory summed from all the buckets:

```json
{
  ...
  "aggregations": {
    "number_of_bytes": {
      "buckets": [
        {
          "key": 0,
          "doc_count": 13372,
          "sum_total_memory": {
            "value": 91266400
          }
        },
        {
          "key": 10000,
          "doc_count": 702,
          "sum_total_memory": {
            "value": 0
          }
        }
      ]
    },
    "sum_copies": {
      "value": 91266400
    }
  }
}
```

### Count paths

You can direct the `buckets_path` to use a count rather than a value as its input. To do so, use the `_count` buckets path variable.

The following example computes basic stats on a histogram of the number of bytes from the OpenSearch Dashboards logs sample data. It creates a histogram of values in the `bytes` field and then computes the stats on the counts in the histogram buckets.

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "number_of_bytes": {
      "histogram": {
        "field": "bytes",
        "interval": 10000
      }
    },
    "count_stats": {
      "stats_bucket": {
        "buckets_path": "number_of_bytes>_count"
      }
    }
  }
}
```
{% include copy-curl.html %}

The results show stats about the *document counts* of the buckets:

```json
{
...
  "aggregations": {
    "number_of_bytes": {
      "buckets": [
        {
          "key": 0,
          "doc_count": 13372
        },
        {
          "key": 10000,
          "doc_count": 702
        }
      ]
    },
    "count_stats": {
      "count": 2,
      "min": 702,
      "max": 13372,
      "avg": 7037,
      "sum": 14074
    }
  }
}
```

## Data gaps

Real-world data can be missing from nested aggregations for a number of reasons, including:

- Missing values in documents.
- Empty buckets anywhere in the chain of aggregations.
- Missing data needed to calculate a bucket value (for example, rolling functions such as `derivative` require one or more previous values to start).

You can specify a policy to handle missing data using the `gap_policy` property: either skip the missing data or replace the missing data with zeros.

The `gap_policy` parameter is valid for all pipeline aggregations.

| Parameter             | Required/Optional | Data type       | Description |
| :--                   | :--               |  :--            | :--         |
| `gap_policy`          | Optional          | String          | The policy to apply to missing data. Valid values are `skip` and `insert_zeros`. Default is `skip`. |
| `format`              | Optional          | String          | A [DecimalFormat](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/text/DecimalFormat.html) formatting string. Returns the formatted output in the aggregation's `value_as_string` property. |

