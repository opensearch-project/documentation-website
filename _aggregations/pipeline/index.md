---
layout: default
title: Pipeline aggregations
nav_order: 5
has_children: true
redirect_from:
  - /opensearch/pipeline-agg/
  - /query-dsl/aggregations/pipeline-agg/
  - /query-dsl/aggregations/index/
  - /aggregations/pipeline/
  - /aggregations/pipeline-agg/
---

# Pipeline aggregations

Pipeline aggregations chain together multiple aggregations by using the output of one aggregation as the input for another. They compute complex statistical and mathematical measures like derivatives, moving averages, and cumulative sums. Some pipeline aggregations duplicate the functionality of metric and bucket aggregations, but in many cases are more intuitive to use.

Pipeline aggregations are executed after all other sibling aggregations. This has performance implications. For example, using the `bucket_selector` pipeline aggregation to narrow a list of buckets does not reduce the number of computations performed on omitted buckets.
{: .note}

Pipeline aggregations cannot be sub-aggregated, but can be chained with other pipeline aggregations. For example, you calculate a second derivative by chaining two consecutive `derivative` aggregations. Keep in mind that pipeline aggregations append to existing output. For example, computing a second derivative by chaining `derivative` aggregations outputs both the first and second derivatives.

## Pipeline aggregation types

Pipeline aggregations are of two types, [sibling](#sibling-aggregations) and [parent](#parent-aggregations).

### Sibling aggregations

A _sibling_ pipeline aggregation takes the output of a nested aggregation and produces new buckets or new aggregations at the same level as the nested buckets.

A sibling aggregation must be a multi-bucket aggregation (have multiple grouped values for a certain field), and the metric must be a numeric value.

`min_bucket`, `max_bucket`, `sum_bucket`, and `avg_bucket` are common sibling aggregations.

### Parent aggregations

A _parent_ aggregation takes the output of an outer aggregation and produces new buckets or new aggregations at the same level as the existing buckets.

The specified metric for a parent aggregation must be a numeric value.

We strongly recommend setting `min_doc_count` to `0` (the default for `histogram` aggregations) for parent aggregations. If `min_doc_count` is greater than `0`, then the aggregation omits buckets, which might lead to incorrect results.
{: .important}

`derivatives` and `cumulative_sum` are common parent aggregations.

## Buckets path property

A pipeline aggregation uses the `buckets_path` parameter to access the results of other aggregations.
The `buckets_path` parameter has the following syntax:

```
buckets_path = <AGG_NAME>[<AGG_SEPARATOR>,<AGG_NAME>]*[<METRIC_SEPARATOR>, <METRIC>];
```

where:

- `AGG_NAME` is the name of the aggregation.
- `AGG_SEPARATOR` separates aggregation names. It's represented as `>`.
- `METRIC_SEPARATOR` separates the final aggregation from its metrics. It's represented as `.`.
- `METRIC` is the name of the metric. It is required in the case of multi-value metric aggregations.

For example, `my_sum.sum` selects the `sum` metric of an aggregation called `my_sum`. `popular_tags>my_sum.sum` nests `my_sum.sum` into the `popular_tags` aggregation.

The following parameters are optional:

- `gap_policy`: Real-world data can contain gaps or null values. You can specify the policy to deal with such missing data with the `gap_policy` property. You can either set the `gap_policy` property to `skip` to skip the missing data and continue from the next available value, or `insert_zeros` to replace the missing values with zero and continue running.
- `format`: You can provide a format string for the output value; for example, `yyyy-MM-dd` for a date value.

### Buckets path example

The following example operates on the OpenSearch Dashboards logs sample data. It creates a histogram of values in the `bytes` field, sums the `phpmemory` fields in each histogram bucket, and finally sums the buckets using the `sum_bucket` pipeline aggregation:

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

### Buckets path example response

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

You can direct the `buckets_path` to use a count rather than a value as its input. To do so, use the special `_count` buckets path variable.

The following example computes basic stats on a histogram of the number of bytes from the OpenSearch Dashboards logs sample data. It creates a histogram of values in the `bytes` field, then computes the stats on the counts in the histogram buckets.

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

The results show stats on the *document counts* of the buckets:

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

Data can be missing from nested aggregations for a number of reasons, including:

- Missing values in documents
- Empty buckets anywhere in the chain of aggregations
- Data needed to calculate a bucket value is missing (for example, rolling functions such as `derivative` require one or more previous values to start).

You can specify a policy to deal with missing data using the `gap_policy` property. 

You can set the `gap_policy` property to skip the missing data or replace the missing data with zeros.

The `gap_policy` parameter is valid with all pipeline aggregations. The valid values for the parameter are:

| Value | Action |
| -- | -- |
| `skip` | Ignore buckets containing missing data. |
|`insert_zeros` | Replace missing values with zero (0) and continue as normal. |
