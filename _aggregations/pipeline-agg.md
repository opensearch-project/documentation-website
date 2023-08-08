---
layout: default
title: Pipeline aggregations
nav_order: 5
has_children: false
redirect_from:
  - /opensearch/pipeline-agg/
  - /query-dsl/aggregations/pipeline-agg/
---

# Pipeline aggregations

With pipeline aggregations, you can chain aggregations by piping the results of one aggregation as an input to another for a more nuanced output.

You can use pipeline aggregations to compute complex statistical and mathematical measures like derivatives, moving averages, cumulative sums, and so on.

## Pipeline aggregation syntax

A pipeline aggregation uses the `buckets_path` property to access the results of other aggregations.
The `buckets_path` property has a specific syntax:

```
buckets_path = <AGG_NAME>[<AGG_SEPARATOR>,<AGG_NAME>]*[<METRIC_SEPARATOR>, <METRIC>];
```

where:

- `AGG_NAME` is the name of the aggregation.
- `AGG_SEPARATOR` separates aggregations. It's represented as `>`.
- `METRIC_SEPARATOR` separates aggregations from its metrics. It's represented as `.`.
- `METRIC` is the name of the metric, in case of multi-value metric aggregations.

For example, `my_sum.sum` selects the `sum` metric of an aggregation called `my_sum`. `popular_tags>my_sum.sum` nests `my_sum.sum` into the `popular_tags` aggregation.

You can also specify the following additional parameters:

- `gap_policy`: Real-world data can contain gaps or null values. You can specify the policy to deal with such missing data with the `gap_policy` property. You can either set the `gap_policy` property to `skip` to skip the missing data and continue from the next available value, or `insert_zeros` to replace the missing values with zero and continue running.
- `format`: The type of format for the output value. For example, `yyyy-MM-dd` for a date value.

## Quick example

To sum all the buckets returned by the `sum_total_memory` aggregation:

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

#### Example response

```json
...
"aggregations" : {
  "number_of_bytes" : {
    "buckets" : [
      {
        "key" : 0.0,
        "doc_count" : 13372,
        "sum_total_memory" : {
          "value" : 9.12664E7
        }
      },
      {
        "key" : 10000.0,
        "doc_count" : 702,
        "sum_total_memory" : {
          "value" : 0.0
        }
      }
    ]
  },
  "sum_copies" : {
    "value" : 9.12664E7
  }
 }
}
```

## Types of pipeline aggregations

Pipeline aggregations are of two types:

### Sibling aggregations

Sibling aggregations take the output of a nested aggregation and produce new buckets or new aggregations at the same level as the nested buckets.

Sibling aggregations must be a multi-bucket aggregation (have multiple grouped values for a certain field) and the metric must be a numeric value.

`min_bucket`, `max_bucket`, `sum_bucket`, and `avg_bucket` are common sibling aggregations.

### Parent aggregations

Parent aggregations take the output of an outer aggregation and produce new buckets or new aggregations at the same level as the existing buckets.

Parent aggregations must have `min_doc_count` set to 0 (default for `histogram` aggregations) and the specified metric must be a numeric value. If `min_doc_count` is greater than `0`, some buckets are omitted, which might lead to incorrect results.

`derivatives` and `cumulative_sum` are common parent aggregations.

## avg_bucket, sum_bucket, min_bucket, max_bucket

The `avg_bucket`, `sum_bucket`, `min_bucket`, and `max_bucket` aggregations are sibling aggregations that calculate the average, sum, minimum, and maximum values of a metric in each bucket of a previous aggregation.

The following example creates a date histogram with a one-month interval. The `sum` sub-aggregation calculates the sum of all bytes for each month. Finally, the `avg_bucket` aggregation uses this sum to calculate the average number of bytes per month:

```json
POST opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "visits_per_month": {
      "date_histogram": {
        "field": "@timestamp",
        "interval": "month"
      },
      "aggs": {
        "sum_of_bytes": {
          "sum": {
            "field": "bytes"
          }
        }
      }
    },
    "avg_monthly_bytes": {
      "avg_bucket": {
        "buckets_path": "visits_per_month>sum_of_bytes"
      }
    }
  }
}
```

#### Example response

```json
...
"aggregations" : {
  "visits_per_month" : {
    "buckets" : [
      {
        "key_as_string" : "2020-10-01T00:00:00.000Z",
        "key" : 1601510400000,
        "doc_count" : 1635,
        "sum_of_bytes" : {
          "value" : 9400200.0
        }
      },
      {
        "key_as_string" : "2020-11-01T00:00:00.000Z",
        "key" : 1604188800000,
        "doc_count" : 6844,
        "sum_of_bytes" : {
          "value" : 3.8880434E7
        }
      },
      {
        "key_as_string" : "2020-12-01T00:00:00.000Z",
        "key" : 1606780800000,
        "doc_count" : 5595,
        "sum_of_bytes" : {
          "value" : 3.1445055E7
        }
      }
    ]
  },
  "avg_monthly_bytes" : {
    "value" : 2.6575229666666668E7
  }
 }
}
```

In a similar fashion, you can calculate the `sum_bucket`, `min_bucket`, and `max_bucket` values for the bytes per month.

## stats_bucket, extended_stats_bucket

The `stats_bucket` aggregation is a sibling aggregation that returns a variety of stats (`count`, `min`, `max`, `avg`, and `sum`) for the buckets of a previous aggregation.

The following example returns the basic stats for the buckets returned by the `sum_of_bytes` aggregation nested into the `visits_per_month` aggregation:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "visits_per_month": {
      "date_histogram": {
        "field": "@timestamp",
        "interval": "month"
      },
      "aggs": {
        "sum_of_bytes": {
          "sum": {
            "field": "bytes"
          }
        }
      }
    },
    "stats_monthly_bytes": {
      "stats_bucket": {
        "buckets_path": "visits_per_month>sum_of_bytes"
      }
    }
  }
}
```

#### Example response

```json
...
"stats_monthly_bytes" : {
  "count" : 3,
  "min" : 9400200.0,
  "max" : 3.8880434E7,
  "avg" : 2.6575229666666668E7,
  "sum" : 7.9725689E7
  }
 }
}
```

The `extended_stats` aggregation is an extended version of the `stats` aggregation. Apart from including basic stats, `extended_stats` also provides stats such as `sum_of_squares`, `variance`, and `std_deviation`.

#### Example response

```json
"stats_monthly_visits" : {
  "count" : 3,
  "min" : 9400200.0,
  "max" : 3.8880434E7,
  "avg" : 2.6575229666666668E7,
  "sum" : 7.9725689E7,
  "sum_of_squares" : 2.588843392021381E15,
  "variance" : 1.5670496550438025E14,
  "variance_population" : 1.5670496550438025E14,
  "variance_sampling" : 2.3505744825657038E14,
  "std_deviation" : 1.251818539183616E7,
  "std_deviation_population" : 1.251818539183616E7,
  "std_deviation_sampling" : 1.5331583357780447E7,
  "std_deviation_bounds" : {
    "upper" : 5.161160045033899E7,
    "lower" : 1538858.8829943463,
    "upper_population" : 5.161160045033899E7,
    "lower_population" : 1538858.8829943463,
    "upper_sampling" : 5.723839638222756E7,
    "lower_sampling" : -4087937.0488942266
   }
  }
 }
}
```

## bucket_script, bucket_selector

The `bucket_script` aggregation is a parent aggregation that executes a script to perform per-bucket calculations of a previous aggregation. Make sure the metrics are of numeric type and the returned values are also numeric.

Use the `script` parameter to add your script. The script can be inline, in a file, or in an index. To enable inline scripting, add the following line to your `opensearch.yml` file in the `config` folder:

```yaml
script.inline: on
```

The `buckets_path` property consists of multiple entries. Each entry is a key and a value. The key is the name of the value that you can use in the script.

The basic syntax is:

```json
{
  "bucket_script": {
    "buckets_path": {
    "my_var1": "the_sum",
    "my_var2": "the_value_count"
  },
 "script": "params.my_var1 / params.my_var2"
  }
}
```

The following example uses the `sum` aggregation on the buckets generated by a date histogram. From the resultant buckets values, the percentage of RAM is calculated in an interval of 10,000 bytes in the context of a zip extension:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "sales_per_month": {
      "histogram": {
        "field": "bytes",
        "interval": "10000"
      },
      "aggs": {
        "total_ram": {
          "sum": {
            "field": "machine.ram"
          }
        },
        "ext-type": {
          "filter": {
            "term": {
              "extension.keyword": "zip"
            }
          },
          "aggs": {
            "total_ram": {
              "sum": {
                "field": "machine.ram"
              }
            }
          }
        },
        "ram-percentage": {
          "bucket_script": {
            "buckets_path": {
              "machineRam": "ext-type>total_ram",
              "totalRam": "total_ram"
            },
            "script": "params.machineRam / params.totalRam"
          }
        }
      }
    }
  }
}
```

#### Example response

```json
"aggregations" : {
  "sales_per_month" : {
    "buckets" : [
      {
        "key" : 0.0,
        "doc_count" : 13372,
        "os-type" : {
          "doc_count" : 1558,
          "total_ram" : {
            "value" : 2.0090783268864E13
          }
        },
        "total_ram" : {
          "value" : 1.7214228922368E14
        },
        "ram-percentage" : {
          "value" : 0.11671032934131736
        }
      },
      {
        "key" : 10000.0,
        "doc_count" : 702,
        "os-type" : {
          "doc_count" : 116,
          "total_ram" : {
            "value" : 1.622423896064E12
          }
        },
        "total_ram" : {
          "value" : 9.015136354304E12
        },
        "ram-percentage" : {
          "value" : 0.17996665078608862
        }
      }
    ]
  }
 }
}
```

The RAM percentage is calculated and appended at the end of each bucket.

The `bucket_selector` aggregation is a script-based aggregation that selects buckets returned by a `histogram` (or `date_histogram`) aggregation. Use it in scenarios where you don’t want certain buckets in the output based on conditions supplied by you.

The `bucket_selector` aggregation executes a script to decide if a bucket stays in the parent multi-bucket aggregation.

The basic syntax is:

```json
{
  "bucket_selector": {
    "buckets_path": {
    "my_var1": "the_sum",
    "my_var2": "the_value_count"
  },
  "script": "params.my_var1 / params.my_var2"
  }
}
```

The following example calculates the sum of bytes and then evaluates if this sum is greater than 20,000. If true, then the bucket is retained in the bucket list. Otherwise, it’s deleted from the final output.

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "bytes_per_month": {
      "date_histogram": {
        "field": "@timestamp",
        "calendar_interval": "month"
      },
      "aggs": {
        "total_bytes": {
          "sum": {
            "field": "bytes"
          }
        },
        "bytes_bucket_filter": {
          "bucket_selector": {
            "buckets_path": {
              "totalBytes": "total_bytes"
            },
            "script": "params.totalBytes > 20000"
          }
        }
      }
    }
  }
}
```

#### Example response

```json
"aggregations" : {
  "bytes_per_month" : {
    "buckets" : [
      {
        "key_as_string" : "2020-10-01T00:00:00.000Z",
        "key" : 1601510400000,
        "doc_count" : 1635,
        "total_bytes" : {
          "value" : 9400200.0
        }
      },
      {
        "key_as_string" : "2020-11-01T00:00:00.000Z",
        "key" : 1604188800000,
        "doc_count" : 6844,
        "total_bytes" : {
          "value" : 3.8880434E7
        }
      },
      {
        "key_as_string" : "2020-12-01T00:00:00.000Z",
        "key" : 1606780800000,
        "doc_count" : 5595,
        "total_bytes" : {
          "value" : 3.1445055E7
        }
      }
    ]
  }
 }
}
```

## bucket_sort

The `bucket_sort` aggregation is a parent aggregation that sorts buckets of a previous aggregation.

You can specify several sort fields together with the corresponding sort order. Additionally, you can sort each bucket based on its key, count, or its sub-aggregations. You can also truncate the buckets by setting `from` and `size` parameters.

Syntax

```json
{
  "bucket_sort": {
    "sort": [
    {"sort_field_1": {"order": "asc"}},
    {"sort_field_2": {"order": "desc"}},
    "sort_field_3"
    ],
 "from":1,
 "size":3
 }
}
```

The following example sorts the buckets of a `date_histogram` aggregation based on the computed `total_sum` values. We sort the buckets in descending order so that the buckets with the highest number of bytes are returned first.

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "sales_per_month": {
      "date_histogram": {
        "field": "@timestamp",
        "calendar_interval": "month"
      },
      "aggs": {
        "total_bytes": {
          "sum": {
            "field": "bytes"
          }
        },
        "bytes_bucket_sort": {
          "bucket_sort": {
            "sort": [
              { "total_bytes": { "order": "desc" } }
            ],
            "size": 3                                
          }
        }
      }
    }
  }
}
```

#### Example response

```json
"aggregations" : {
  "sales_per_month" : {
    "buckets" : [
      {
        "key_as_string" : "2020-11-01T00:00:00.000Z",
        "key" : 1604188800000,
        "doc_count" : 6844,
        "total_bytes" : {
          "value" : 3.8880434E7
        }
      },
      {
        "key_as_string" : "2020-12-01T00:00:00.000Z",
        "key" : 1606780800000,
        "doc_count" : 5595,
        "total_bytes" : {
          "value" : 3.1445055E7
        }
      },
      {
        "key_as_string" : "2020-10-01T00:00:00.000Z",
        "key" : 1601510400000,
        "doc_count" : 1635,
        "total_bytes" : {
          "value" : 9400200.0
        }
      }
    ]
  }
 }
}
```

You can also use this aggregation to truncate the resulting buckets without sorting. For this, just use the `from` and/or `size` parameters without `sort`.

## cumulative_sum

The `cumulative_sum` aggregation is a parent aggregation that calculates the cumulative sum of each bucket of a previous aggregation.

A cumulative sum is a sequence of partial sums of a given sequence. For example, the cumulative sums of the sequence `{a,b,c,…}` are `a`, `a+b`, `a+b+c`, and so on. You can use the cumulative sum to visualize the rate of change of a field over time.

The following example calculates the cumulative number of bytes over a monthly basis:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "sales_per_month": {
      "date_histogram": {
        "field": "@timestamp",
        "calendar_interval": "month"
      },
      "aggs": {
        "no-of-bytes": {
          "sum": {
            "field": "bytes"
          }
        },
        "cumulative_bytes": {
          "cumulative_sum": {
            "buckets_path": "no-of-bytes"
          }
        }
      }
    }
  }
}
```

#### Example response

```json
...
"aggregations" : {
  "sales_per_month" : {
    "buckets" : [
      {
        "key_as_string" : "2020-10-01T00:00:00.000Z",
        "key" : 1601510400000,
        "doc_count" : 1635,
        "no-of-bytes" : {
          "value" : 9400200.0
        },
        "cumulative_bytes" : {
          "value" : 9400200.0
        }
      },
      {
        "key_as_string" : "2020-11-01T00:00:00.000Z",
        "key" : 1604188800000,
        "doc_count" : 6844,
        "no-of-bytes" : {
          "value" : 3.8880434E7
        },
        "cumulative_bytes" : {
          "value" : 4.8280634E7
        }
      },
      {
        "key_as_string" : "2020-12-01T00:00:00.000Z",
        "key" : 1606780800000,
        "doc_count" : 5595,
        "no-of-bytes" : {
          "value" : 3.1445055E7
        },
        "cumulative_bytes" : {
          "value" : 7.9725689E7
        }
      }
    ]
  }
 }
}
```

## derivative

The `derivative` aggregation is a parent aggregation that calculates 1st order and 2nd order derivatives of each bucket of a previous aggregation.

In mathematics, the derivative of a function measures its sensitivity to change. In other words, a derivative evaluates the rate of change in some function with respect to some variable. To learn more about derivatives, see [Wikipedia](https://en.wikipedia.org/wiki/Derivative).

You can use derivatives to calculate the rate of change of numeric values compared to its previous time periods.

The 1st order derivative indicates whether a metric is increasing or decreasing, and by how much it's increasing or decreasing.

The following example calculates the 1st order derivative for the sum of bytes per month. The 1st order derivative is the difference between the number of bytes in the current month and the previous month:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "sales_per_month": {
      "date_histogram": {
        "field": "@timestamp",
        "calendar_interval": "month"
      },
      "aggs": {
        "number_of_bytes": {
          "sum": {
            "field": "bytes"
          }
        },
        "bytes_deriv": {
          "derivative": {
            "buckets_path": "number_of_bytes"
          }
        }
      }
    }
  }
}
```

#### Example response

```json
...
"aggregations" : {
  "sales_per_month" : {
    "buckets" : [
      {
        "key_as_string" : "2020-10-01T00:00:00.000Z",
        "key" : 1601510400000,
        "doc_count" : 1635,
        "number_of_bytes" : {
          "value" : 9400200.0
        }
      },
      {
        "key_as_string" : "2020-11-01T00:00:00.000Z",
        "key" : 1604188800000,
        "doc_count" : 6844,
        "number_of_bytes" : {
          "value" : 3.8880434E7
        },
        "bytes_deriv" : {
          "value" : 2.9480234E7
        }
      },
      {
        "key_as_string" : "2020-12-01T00:00:00.000Z",
        "key" : 1606780800000,
        "doc_count" : 5595,
        "number_of_bytes" : {
          "value" : 3.1445055E7
        },
        "bytes_deriv" : {
          "value" : -7435379.0
        }
      }
    ]
  }
 }
}
```

The 2nd order derivative is a double derivative or a derivative of the derivative.
It indicates how the rate of change of a quantity is itself changing. It’s the difference between the 1st order derivatives of adjacent buckets.

To calculate a 2nd order derivative, chain one derivative aggregation to another:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "sales_per_month": {
      "date_histogram": {
        "field": "@timestamp",
        "calendar_interval": "month"
      },
      "aggs": {
        "number_of_bytes": {
          "sum": {
            "field": "bytes"
          }
        },
        "bytes_deriv": {
          "derivative": {
            "buckets_path": "number_of_bytes"
          }
        },
        "bytes_2nd_deriv": {
          "derivative": {
            "buckets_path": "bytes_deriv"
          }
        }
      }
    }
  }
}
```

#### Example response

```json
...
"aggregations" : {
  "sales_per_month" : {
    "buckets" : [
      {
        "key_as_string" : "2020-10-01T00:00:00.000Z",
        "key" : 1601510400000,
        "doc_count" : 1635,
        "number_of_bytes" : {
          "value" : 9400200.0
        }
      },
      {
        "key_as_string" : "2020-11-01T00:00:00.000Z",
        "key" : 1604188800000,
        "doc_count" : 6844,
        "number_of_bytes" : {
          "value" : 3.8880434E7
        },
        "bytes_deriv" : {
          "value" : 2.9480234E7
        }
      },
      {
        "key_as_string" : "2020-12-01T00:00:00.000Z",
        "key" : 1606780800000,
        "doc_count" : 5595,
        "number_of_bytes" : {
          "value" : 3.1445055E7
        },
        "bytes_deriv" : {
          "value" : -7435379.0
        },
        "bytes_2nd_deriv" : {
          "value" : -3.6915613E7
        }
      }
    ]
  }
 }
}
```

The first bucket doesn't have a 1st order derivate as a derivate needs at least two points for comparison. The first and second buckets don't have a 2nd order derivate because a 2nd order derivate needs at least two data points from the 1st order derivative.

The 1st order derivative for the "2020-11-01" bucket is 2.9480234E7 and the "2020-12-01" bucket is -7435379. So, the 2nd order derivative of the “2020-12-01” bucket is -3.6915613E7 (-7435379-2.9480234E7).

Theoretically, you could continue chaining derivate aggregations to calculate the third, the fourth, and even higher-order derivatives. That would, however, provide little to no value for most datasets.

## moving_avg

A `moving_avg` aggregation is a parent aggregation that calculates the moving average metric.

The `moving_avg` aggregation finds the series of averages of different windows (subsets) of a dataset. A window’s size represents the number of data points covered by the window on each iteration (specified by the `window` property and set to 5 by default). On each iteration, the algorithm calculates the average for all data points that fit into the window and then slides forward by excluding the first member of the previous window and including the first member from the next window.

For example, given the data `[1, 5, 8, 23, 34, 28, 7, 23, 20, 19]`, you can calculate a simple moving average with a window’s size of 5 as follows:

```
(1 + 5 + 8 + 23 + 34) / 5 = 14.2
(5 + 8 + 23 + 34+ 28) / 5 = 19.6
(8 + 23 + 34 + 28 + 7) / 5 = 20
so on...
```

For more information, see [Wikipedia](https://en.wikipedia.org/wiki/Moving_average).

You can use the `moving_avg` aggregation to either smoothen out short-term fluctuations or to highlight longer-term trends or cycles in your time-series data.

Specify a small window size (for example, `window`: 10) that closely follows the data to smoothen out small-scale fluctuations.
Alternatively, specify a larger window size (for example, `window`: 100) that lags behind the actual data by a substantial amount to smoothen out all higher-frequency fluctuations or random noise, making lower frequency trends more visible.

The following example nests a `moving_avg` aggregation into a `date_histogram` aggregation:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "my_date_histogram": {                                
      "date_histogram": {
        "field": "@timestamp",
        "calendar_interval": "month"
      },
      "aggs": {
        "sum_of_bytes": {
          "sum": { "field": "bytes" }                 
        },
        "moving_avg_of_sum_of_bytes": {
          "moving_avg": { "buckets_path": "sum_of_bytes" }
        }
      }
    }
  }
}
```

#### Example response

```json  
...
"aggregations" : {
  "my_date_histogram" : {
    "buckets" : [
      {
        "key_as_string" : "2020-10-01T00:00:00.000Z",
        "key" : 1601510400000,
        "doc_count" : 1635,
        "sum_of_bytes" : {
          "value" : 9400200.0
        }
      },
      {
        "key_as_string" : "2020-11-01T00:00:00.000Z",
        "key" : 1604188800000,
        "doc_count" : 6844,
        "sum_of_bytes" : {
          "value" : 3.8880434E7
        },
        "moving_avg_of_sum_of_bytes" : {
          "value" : 9400200.0
        }
      },
      {
        "key_as_string" : "2020-12-01T00:00:00.000Z",
        "key" : 1606780800000,
        "doc_count" : 5595,
        "sum_of_bytes" : {
          "value" : 3.1445055E7
        },
        "moving_avg_of_sum_of_bytes" : {
          "value" : 2.4140317E7
        }
      }
    ]
  }
 }
}
```

You can also use the `moving_avg` aggregation to predict future buckets.
To predict buckets, add the `predict` property and set it to the number of predictions that you want to see.

The following example adds five predictions to the preceding query:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "my_date_histogram": {
      "date_histogram": {
        "field": "@timestamp",
        "calendar_interval": "month"
      },
      "aggs": {
        "sum_of_bytes": {
          "sum": {
            "field": "bytes"
          }
        },
        "moving_avg_of_sum_of_bytes": {
          "moving_avg": {
            "buckets_path": "sum_of_bytes",
            "predict": 5
          }
        }
      }
    }
  }
}
```

#### Example response

```json
"aggregations" : {
  "my_date_histogram" : {
    "buckets" : [
      {
        "key_as_string" : "2020-10-01T00:00:00.000Z",
        "key" : 1601510400000,
        "doc_count" : 1635,
        "sum_of_bytes" : {
          "value" : 9400200.0
        }
      },
      {
        "key_as_string" : "2020-11-01T00:00:00.000Z",
        "key" : 1604188800000,
        "doc_count" : 6844,
        "sum_of_bytes" : {
          "value" : 3.8880434E7
        },
        "moving_avg_of_sum_of_bytes" : {
          "value" : 9400200.0
        }
      },
      {
        "key_as_string" : "2020-12-01T00:00:00.000Z",
        "key" : 1606780800000,
        "doc_count" : 5595,
        "sum_of_bytes" : {
          "value" : 3.1445055E7
        },
        "moving_avg_of_sum_of_bytes" : {
          "value" : 2.4140317E7
        }
      },
      {
        "key_as_string" : "2021-01-01T00:00:00.000Z",
        "key" : 1609459200000,
        "doc_count" : 0,
        "moving_avg_of_sum_of_bytes" : {
          "value" : 2.6575229666666668E7
        }
      },
      {
        "key_as_string" : "2021-02-01T00:00:00.000Z",
        "key" : 1612137600000,
        "doc_count" : 0,
        "moving_avg_of_sum_of_bytes" : {
          "value" : 2.6575229666666668E7
        }
      },
      {
        "key_as_string" : "2021-03-01T00:00:00.000Z",
        "key" : 1614556800000,
        "doc_count" : 0,
        "moving_avg_of_sum_of_bytes" : {
          "value" : 2.6575229666666668E7
        }
      },
      {
        "key_as_string" : "2021-04-01T00:00:00.000Z",
        "key" : 1617235200000,
        "doc_count" : 0,
        "moving_avg_of_sum_of_bytes" : {
          "value" : 2.6575229666666668E7
        }
      },
      {
        "key_as_string" : "2021-05-01T00:00:00.000Z",
        "key" : 1619827200000,
        "doc_count" : 0,
        "moving_avg_of_sum_of_bytes" : {
          "value" : 2.6575229666666668E7
        }
      }
    ]
  }
 }
}
```

The `moving_avg` aggregation supports five models — `simple`, `linear`, `exponentially weighted`, `holt-linear`, and `holt-winters`. These models differ in how the values of the window are weighted. As data points become "older" (i.e., the window slides away from them), they might be weighted differently. You can specify a model of your choice by setting the `model` property. The `model` property holds the name of the model and the `settings` object, which you can use to provide model properties. For more information on these models, see [Wikipedia](https://en.wikipedia.org/wiki/Moving_average).

A `simple` model first calculates the sum of all data points in the window, and then divides that sum by the size of the window. In other words, a `simple` model calculates a simple arithmetic mean for each window in your dataset.

The following example uses a simple model with a window size of 30:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "my_date_histogram": {
      "date_histogram": {
        "field": "@timestamp",
        "calendar_interval": "month"
      },
      "aggs": {
        "sum_of_bytes": {
          "sum": {
            "field": "bytes"
          }
        },
        "moving_avg_of_sum_of_bytes": {
          "moving_avg": {
            "buckets_path": "sum_of_bytes",
            "window": 30,
            "model": "simple"
          }
        }
      }
    }
  }
}
```


#### Example response

```json
...
"aggregations" : {
  "my_date_histogram" : {
    "buckets" : [
      {
        "key_as_string" : "2020-10-01T00:00:00.000Z",
        "key" : 1601510400000,
        "doc_count" : 1635,
        "sum_of_bytes" : {
          "value" : 9400200.0
        }
      },
      {
        "key_as_string" : "2020-11-01T00:00:00.000Z",
        "key" : 1604188800000,
        "doc_count" : 6844,
        "sum_of_bytes" : {
          "value" : 3.8880434E7
        },
        "moving_avg_of_sum_of_bytes" : {
          "value" : 9400200.0
        }
      },
      {
        "key_as_string" : "2020-12-01T00:00:00.000Z",
        "key" : 1606780800000,
        "doc_count" : 5595,
        "sum_of_bytes" : {
          "value" : 3.1445055E7
        },
        "moving_avg_of_sum_of_bytes" : {
          "value" : 2.4140317E7
        }
      }
    ]
  }
 }
}
```

The following example uses a `holt` model. You can set the speed at which the importance decays occurs with the `alpha` and `beta` setting. The default value of `alpha` is 0.3 and `beta` is 0.1. You can specify any float value between 0-1 inclusive.

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "my_date_histogram": {
      "date_histogram": {
        "field": "@timestamp",
        "calendar_interval": "month"
      },
      "aggs": {
        "sum_of_bytes": {
          "sum": {
            "field": "bytes"
          }
        },
        "moving_avg_of_sum_of_bytes": {
          "moving_avg": {
            "buckets_path": "sum_of_bytes",
            "model": "holt",
            "settings": {
              "alpha": 0.6,
              "beta": 0.4
            }
          }
        }
      }
    }
  }
}
```

#### Example response

```json
...
"aggregations" : {
  "my_date_histogram" : {
    "buckets" : [
      {
        "key_as_string" : "2020-10-01T00:00:00.000Z",
        "key" : 1601510400000,
        "doc_count" : 1635,
        "sum_of_bytes" : {
          "value" : 9400200.0
        }
      },
      {
        "key_as_string" : "2020-11-01T00:00:00.000Z",
        "key" : 1604188800000,
        "doc_count" : 6844,
        "sum_of_bytes" : {
          "value" : 3.8880434E7
        },
        "moving_avg_of_sum_of_bytes" : {
          "value" : 9400200.0
        }
      },
      {
        "key_as_string" : "2020-12-01T00:00:00.000Z",
        "key" : 1606780800000,
        "doc_count" : 5595,
        "sum_of_bytes" : {
          "value" : 3.1445055E7
        },
        "moving_avg_of_sum_of_bytes" : {
          "value" : 2.70883404E7
        }
      }
    ]
  }
 }
}
```



## serial_diff

The `serial_diff` aggregation is a parent pipeline aggregation that computes a series of value differences between a time lag of the buckets from previous aggregations.

You can use the `serial_diff` aggregation to find the data changes between time periods instead of finding the whole value.

With the `lag` parameter (a positive, non-zero integer value), you can tell which previous bucket to subtract from the current one. If you don't specify the `lag` parameter, OpenSearch sets it to 1.

Lets say that the population of a city grows with time. If you use the serial differencing aggregation with the period of one day, you can see the daily growth. For example, you can compute a series of differences of the weekly average changes of a total price.

```json
GET opensearch_dashboards_sample_data_logs/_search
{
   "size": 0,
   "aggs": {
      "my_date_histogram": {                  
         "date_histogram": {
            "field": "@timestamp",
            "calendar_interval": "month"
         },
         "aggs": {
            "the_sum": {
               "sum": {
                  "field": "bytes"     
               }
            },
            "thirtieth_difference": {
               "serial_diff": {                
                  "buckets_path": "the_sum",
                  "lag" : 30
               }
            }
         }
      }
   }
}
```

#### Example response

```json
...
"aggregations" : {
  "my_date_histogram" : {
    "buckets" : [
      {
        "key_as_string" : "2020-10-01T00:00:00.000Z",
        "key" : 1601510400000,
        "doc_count" : 1635,
        "the_sum" : {
          "value" : 9400200.0
        }
      },
      {
        "key_as_string" : "2020-11-01T00:00:00.000Z",
        "key" : 1604188800000,
        "doc_count" : 6844,
        "the_sum" : {
          "value" : 3.8880434E7
        }
      },
      {
        "key_as_string" : "2020-12-01T00:00:00.000Z",
        "key" : 1606780800000,
        "doc_count" : 5595,
        "the_sum" : {
          "value" : 3.1445055E7
        }
      }
    ]
  }
 }
}
```
