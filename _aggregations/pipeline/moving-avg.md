---
layout: default
title: Moving average
parent: Pipeline aggregations
nav_order: 120
canonical_url: https://docs.opensearch.org/latest/aggregations/pipeline/moving-avg/
---

## Moving average aggregations
**Deprecated**
{: .label .label-red }

The `moving_avg` aggregation has been deprecated in favor of the `moving_fn` aggregation.
{: .important}

A `moving_avg` aggregation is a parent pipeline aggregation that calculates a sequence of averages of a metric contained in windows (adjacent subsets) of an ordered dataset. 

To create a `moving_avg` aggregation, you first create a `histogram` or `date_histogram` aggregation. Optionally, you then embed a metric aggregation in the histogram aggregation. Finally, you embed the `moving_avg` aggregation in the histogram and set the `buckets_path` parameter to the embedded metric that you want to track. 

A window's size is the number of sequential data values in the window. During each iteration, the algorithm calculates the average for all data points in the window and then slides forward one data value, excluding the first value of the previous window and including the first value of the next window.

For example, given the data `[1, 5, 8, 23, 34, 28, 7, 23, 20, 19]`, a moving average with a window size of 5 is as follows:

```
(1 + 5 + 8 + 23 + 34) / 5 = 14.2
(5 + 8 + 23 + 34 + 28) / 5 = 19.6
(8 + 23 + 34 + 28 + 7) / 5 = 20
and so on ...
```

The `moving_avg` aggregation is typically applied to time-series data to smooth out noise or short-term fluctuations and to identify trends.
Specify a small window size to smooth out small-scale fluctuations. Specify a larger window size to smooth out high-frequency fluctuations or random noise, making lower-frequency trends more visible.

For more information about moving averages, see [Wikipedia](https://en.wikipedia.org/wiki/Moving_average).

## Parameters

The `moving_avg` aggregation takes the following parameters.

| Parameter             | Required/Optional | Data type       | Description |
| :--                   | :--               |  :--            | :--         |
| `buckets_path`        | Required          | String          | The path of the buckets to be aggregated. See [Buckets path]({{site.url}}{{site.baseurl}}/aggregations/pipeline/index#buckets-path). |
| `gap_policy`          | Optional          | String          | The policy to apply to missing data. Valid values are `skip` and `insert_zeros`. Default is `skip`. See [Data gaps]({{site.url}}{{site.baseurl}}/aggregations/pipeline/#data-gaps). |
| `format`              | Optional          | String          | A [DecimalFormat](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/text/DecimalFormat.html) formatting string. Returns the formatted output in the aggregation's `value_as_string` property. |
| `window`              | Optional          | Numerical       | The number of data points contained in the window. Default is `5`. |
| `model`               | Optional          | String          | The weighted moving average model to use. Options are `ewma`, `holt`, `holt_winters`, `linear`, and `simple`. Default is `simple`. See [Models](#models). |
| `settings`            | Optional          | Object          |  The parameters for adjusting the window. See [Models](#models). |
| `predict`             | Optional          | Numerical        | The number of predicted values to append to the end of the result. Default is `0`. |


## Example

The following example creates a date histogram with a one-month interval from the OpenSearch Dashboards logs sample data. The `sum` subaggregation calculates the sum of all bytes for each month. Finally, the `moving_avg` aggregation calculates the moving average of bytes per month from these sums:

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
          "moving_avg": {
            "buckets_path": "sum_of_bytes" 
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example response

The aggregation returns the `moving_avg` value starting from the second bucket. The first bucket does not have a moving average value because there aren't enough previous data points to calculate it:

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
      "value": 10000,
      "relation": "gte"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "my_date_histogram": {
      "buckets": [
        {
          "key_as_string": "2025-03-01T00:00:00.000Z",
          "key": 1740787200000,
          "doc_count": 480,
          "sum_of_bytes": {
            "value": 2804103
          }
        },
        {
          "key_as_string": "2025-04-01T00:00:00.000Z",
          "key": 1743465600000,
          "doc_count": 6849,
          "sum_of_bytes": {
            "value": 39103067
          },
          "moving_avg_of_sum_of_bytes": {
            "value": 2804103
          }
        },
        {
          "key_as_string": "2025-05-01T00:00:00.000Z",
          "key": 1746057600000,
          "doc_count": 6745,
          "sum_of_bytes": {
            "value": 37818519
          },
          "moving_avg_of_sum_of_bytes": {
            "value": 20953585
          }
        }
      ]
    }
  }
}
```


## Example: Prediction

You can use the `moving_avg` aggregation to predict future buckets.

The following example reduces the interval of the previous example to one week and appends five predicted one-week buckets to the end of the response:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "my_date_histogram": {
      "date_histogram": {
        "field": "@timestamp",
        "calendar_interval": "week"
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
{% include copy-curl.html %}

The response includes the five predictions. Note that the `doc_count` for the predicted buckets is `0`:

<details open markdown="block">
  <summary>
    Response
  </summary>

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
      "value": 10000,
      "relation": "gte"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "my_date_histogram": {
      "buckets": [
        {
          "key_as_string": "2025-03-24T00:00:00.000Z",
          "key": 1742774400000,
          "doc_count": 249,
          "sum_of_bytes": {
            "value": 1531493
          }
        },
        {
          "key_as_string": "2025-03-31T00:00:00.000Z",
          "key": 1743379200000,
          "doc_count": 1617,
          "sum_of_bytes": {
            "value": 9213161
          },
          "moving_avg_of_sum_of_bytes": {
            "value": 1531493
          }
        },
        {
          "key_as_string": "2025-04-07T00:00:00.000Z",
          "key": 1743984000000,
          "doc_count": 1610,
          "sum_of_bytes": {
            "value": 9188671
          },
          "moving_avg_of_sum_of_bytes": {
            "value": 5372327
          }
        },
        {
          "key_as_string": "2025-04-14T00:00:00.000Z",
          "key": 1744588800000,
          "doc_count": 1610,
          "sum_of_bytes": {
            "value": 9244851
          },
          "moving_avg_of_sum_of_bytes": {
            "value": 6644441.666666667
          }
        },
        {
          "key_as_string": "2025-04-21T00:00:00.000Z",
          "key": 1745193600000,
          "doc_count": 1609,
          "sum_of_bytes": {
            "value": 9061045
          },
          "moving_avg_of_sum_of_bytes": {
            "value": 7294544
          }
        },
        {
          "key_as_string": "2025-04-28T00:00:00.000Z",
          "key": 1745798400000,
          "doc_count": 1554,
          "sum_of_bytes": {
            "value": 8713507
          },
          "moving_avg_of_sum_of_bytes": {
            "value": 7647844.2
          }
        },
        {
          "key_as_string": "2025-05-05T00:00:00.000Z",
          "key": 1746403200000,
          "doc_count": 1710,
          "sum_of_bytes": {
            "value": 9544718
          },
          "moving_avg_of_sum_of_bytes": {
            "value": 9084247
          }
        },
        {
          "key_as_string": "2025-05-12T00:00:00.000Z",
          "key": 1747008000000,
          "doc_count": 1610,
          "sum_of_bytes": {
            "value": 9155820
          },
          "moving_avg_of_sum_of_bytes": {
            "value": 9150558.4
          }
        },
        {
          "key_as_string": "2025-05-19T00:00:00.000Z",
          "key": 1747612800000,
          "doc_count": 1610,
          "sum_of_bytes": {
            "value": 9025078
          },
          "moving_avg_of_sum_of_bytes": {
            "value": 9143988.2
          }
        },
        {
          "key_as_string": "2025-05-26T00:00:00.000Z",
          "key": 1748217600000,
          "doc_count": 895,
          "sum_of_bytes": {
            "value": 5047345
          },
          "moving_avg_of_sum_of_bytes": {
            "value": 9100033.6
          }
        },
        {
          "key_as_string": "2025-06-02T00:00:00.000Z",
          "key": 1748822400000,
          "doc_count": 0,
          "moving_avg_of_sum_of_bytes": {
            "value": 8297293.6
          }
        },
        {
          "key_as_string": "2025-06-09T00:00:00.000Z",
          "key": 1749427200000,
          "doc_count": 0,
          "moving_avg_of_sum_of_bytes": {
            "value": 8297293.6
          }
        },
        {
          "key_as_string": "2025-06-16T00:00:00.000Z",
          "key": 1750032000000,
          "doc_count": 0,
          "moving_avg_of_sum_of_bytes": {
            "value": 8297293.6
          }
        },
        {
          "key_as_string": "2025-06-23T00:00:00.000Z",
          "key": 1750636800000,
          "doc_count": 0,
          "moving_avg_of_sum_of_bytes": {
            "value": 8297293.6
          }
        },
        {
          "key_as_string": "2025-06-30T00:00:00.000Z",
          "key": 1751241600000,
          "doc_count": 0,
          "moving_avg_of_sum_of_bytes": {
            "value": 8297293.6
          }
        }
      ]
    }
  }
}
```
</details>

## Models

The `moving_avg` aggregation supports five models that differ in how they weight values in the moving window. 

Use the `model` parameter to specify which model to use.

| Model | Model keyword | Weighting   |
|-------|---------------|-------------|
| Simple | `simple` | An unweighted mean of all values in the window. |
| Linear | `linear` | Uses a linear decay of weights, giving more importance to recent values. |
| Exponentially Weighted Moving Average | `ewma` | Uses exponentially decreasing weights, giving more importance to recent values. |
| Holt | `holt` | Uses a second exponential term to smooth long-term trends. |
| Holt-Winters | `holt_winters` | Uses a third exponential term to smooth periodic (seasonal) effects. |

Use the `settings` object to set the model's properties. The following table shows the available settings for each model.

| Model            | Parameter   | Allowed values  | Default | Description |
| :--              | :--         | :--             | :--     | :--         |
| `simple`     | None               |    Numeric array  |   None   | The arithmetic mean of all values in the window. |
| `linear` | None               |    Numeric array  |   None    | The weighted average of all values in the window, with more recent values weighted more heavily.|
| `ewma`              | `alpha`            | [0, 1] | 0.3     | The decay parameter. Higher values give more weight to recent data points. |
| `holt`              | `alpha`            | [0, 1] | 0.3     | The decay parameter for the level component. |
|              | `beta`             | [0, 1] | 0.1     | The decay parameter for the trend component.|
| `holt_winters`      | `alpha`            | [0, 1] | 0.3     | The decay parameter for the level component.  |
|       | `beta`             | [0, 1] | 0.3     | The decay parameter for the trend component. |
|       | `gamma`            | [0, 1] | 0.3     | The decay parameter for the seasonal component.  |
|       | `type`             | `add`, `mult`   | `add`   | Defines how seasonality is modeled: additive or multiplicative. |
|       | `period`           | Integer         | 1       | The number of buckets comprising the period. |
|      | `pad`              | Boolean         | `true`    | Whether to add a small offset to `0` values for `mult` type models to avoid a divide-by-zero error. |


For a discussion of these models and their parameters, see [Wikipedia](https://en.wikipedia.org/wiki/Moving_average). 


### Example: Holt model

The `holt` model computes weights with exponential decay controlled by the `alpha` and `beta` parameters.

The following request calculates a moving average of total weekly byte data using a Holt model with a `window` size of `6`, an `alpha` value of `0.4`, and a `beta` value of `0.2`:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "my_date_histogram": {
      "date_histogram": {
        "field": "@timestamp",
        "calendar_interval": "week"
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
            "window": 6,
            "model": "holt",
            "settings": { "alpha": 0.4, "beta": 0.2 }
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The moving average begins with the second bucket:

<details open markdown="block">
  <summary>
    Response
  </summary>

```json
{
  "took": 7,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 10000,
      "relation": "gte"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "my_date_histogram": {
      "buckets": [
        {
          "key_as_string": "2025-03-24T00:00:00.000Z",
          "key": 1742774400000,
          "doc_count": 249,
          "sum_of_bytes": {
            "value": 1531493
          }
        },
        {
          "key_as_string": "2025-03-31T00:00:00.000Z",
          "key": 1743379200000,
          "doc_count": 1617,
          "sum_of_bytes": {
            "value": 9213161
          },
          "moving_avg_of_sum_of_bytes": {
            "value": 1531493
          }
        },
        {
          "key_as_string": "2025-04-07T00:00:00.000Z",
          "key": 1743984000000,
          "doc_count": 1610,
          "sum_of_bytes": {
            "value": 9188671
          },
          "moving_avg_of_sum_of_bytes": {
            "value": 4604160.2
          }
        },
        {
          "key_as_string": "2025-04-14T00:00:00.000Z",
          "key": 1744588800000,
          "doc_count": 1610,
          "sum_of_bytes": {
            "value": 9244851
          },
          "moving_avg_of_sum_of_bytes": {
            "value": 6806684.584000001
          }
        },
        {
          "key_as_string": "2025-04-21T00:00:00.000Z",
          "key": 1745193600000,
          "doc_count": 1609,
          "sum_of_bytes": {
            "value": 9061045
          },
          "moving_avg_of_sum_of_bytes": {
            "value": 8341230.127680001
          }
        },
        {
          "key_as_string": "2025-04-28T00:00:00.000Z",
          "key": 1745798400000,
          "doc_count": 1554,
          "sum_of_bytes": {
            "value": 8713507
          },
          "moving_avg_of_sum_of_bytes": {
            "value": 9260724.7236736
          }
        },
        {
          "key_as_string": "2025-05-05T00:00:00.000Z",
          "key": 1746403200000,
          "doc_count": 1710,
          "sum_of_bytes": {
            "value": 9544718
          },
          "moving_avg_of_sum_of_bytes": {
            "value": 9657431.903375873
          }
        },
        {
          "key_as_string": "2025-05-12T00:00:00.000Z",
          "key": 1747008000000,
          "doc_count": 1610,
          "sum_of_bytes": {
            "value": 9155820
          },
          "moving_avg_of_sum_of_bytes": {
            "value": 9173999.55240704
          }
        },
        {
          "key_as_string": "2025-05-19T00:00:00.000Z",
          "key": 1747612800000,
          "doc_count": 1610,
          "sum_of_bytes": {
            "value": 9025078
          },
          "moving_avg_of_sum_of_bytes": {
            "value": 9172040.511275519
          }
        },
        {
          "key_as_string": "2025-05-26T00:00:00.000Z",
          "key": 1748217600000,
          "doc_count": 895,
          "sum_of_bytes": {
            "value": 5047345
          },
          "moving_avg_of_sum_of_bytes": {
            "value": 9108804.964619776
          }
        }
      ]
    }
  }
}
```
</details>
