---
layout: default
title: Moving function
parent: Pipeline aggregations
nav_order: 130
---

# Moving function aggregations

The `moving_fn` aggregation is a parent pipeline aggregation that executes a script over a sliding window. The sliding window moves over a sequence of values extracted from a parent `histogram` or `date histogram` aggregation. The window shifts left to right one bucket at a time; `moving_fn` runs the script each time the window shifts. 

Use the `moving_fn` aggregation to script any numeric calculation on data within the sliding window. You can use `moving_fn` for the following purposes:

- Trend analysis
- Outlier detection
- Custom time-series analysis
- Custom smoothing algorithms
- Digital signal processing (DSP)


## Parameters

The `moving_fn` aggregation takes the following parameters.

| Parameter             | Required/Optional | Data type       | Description |
| :--                   | :--               |  :--            | :--         |
| `buckets_path`        | Required          | String          | The path of the aggregation buckets containing the metric values to process. See [Buckets path]({{site.url}}{{site.baseurl}}/aggregations/pipeline/index#buckets-path). |
| `script`              | Required          | String or Object | The script that calculates a value for each window of data. Can be an inline script, stored script, or script file. The script has access to the variable names defined in the `buckets_path` parameter. |
| `window`              | Required          | Integer         | The number of buckets in the sliding window. Must be a positive integer. |
| `gap_policy`          | Optional          | String          | The policy to apply to missing data. Valid values are `skip` and `insert_zeros`. Default is `skip`. See [Data gaps]({{site.url}}{{site.baseurl}}/aggregations/pipeline/#data-gaps). |
| `format`              | Optional          | String          | A [DecimalFormat](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/text/DecimalFormat.html) formatting string. Returns the formatted output in the aggregation's `value_as_string` property. |
| `shift`               | Optional          | Integer         | The number of buckets by which to shift the window. Can be positive (shift right toward future buckets) or negative (toward past buckets). Default is `0`, which places the window immediately to the left of the current bucket. See [Shifting the window](#shifting-the-window). |


## How moving function works

The `moving_fn` aggregation operates on a sliding window over an ordered sequence of buckets. Starting at the first bucket in the parent aggregation, `moving_fn` does the following:

1. Collects the subsequence (window) of values from the buckets specified by the `window` and `shift` parameters.
2. Passes these values as an array to the function specified by `script`.
3. Uses `script` to compute a single value from the array.
4. Returns this value as the result for the current bucket.
5. Moves forward one bucket and repeats this process.

"Past" and "future" values imply time-series data, the most common use case for moving window functions. More generally, they refer to previous and upcoming values, respectively, in any ordered data sequence.
{: .note}

The script applied by `moving_fn` can be a [predefined function](#predefined-functions) or a [custom script](#custom-scripts). Bucket values are provided to the script in the `values` array. The script returns a double value as the result. The result values `NaN` and `+/- Inf` are allowed, but `null` is not.


### Window size

The `window` parameter specifies the number of buckets that define the size of the window.

The array passed to the `script` function is zero-indexed. Its values are accessed within the script as `values[0]` to `values[n]`, where `n = values.length - 1`.


### Shifting the window

The `shift` parameter controls where the moving window is located relative to the current bucket. Set `shift` based on whether your analysis requires historical context, current data, or future prediction. The default is `0`, which shows only past values (excluding the current bucket). 

Some commonly used values of `shift` are as follows:

| `shift` | Window description                            |                     |
| :--           | :--                                           | :--                 |
| `0`           | Only past values. Excludes the current value. | `--[-----]x----`    |
| `1`           | Past values, including the current value.     | `--[----x]-----`    |
| `window/2`    | Centers the window around the current value.  | `--[--x--]-----`    |
| `window`      | Future values, including the current value.   | `--[x----]-----`    |

When a window extends beyond available data at the beginning or end of a sequence, `window` shrinks automatically to use only the available points:

```
[x----]--
-[x----]-
--[x----]
---[x---]
----[x--]
-----[x-]
------[x]
```


## Predefined functions

The `moving_fn` aggregation supports a number of predefined functions that can be used instead of a custom script. The functions are accessible from the `MovingFunctions` context. For example, you can access the `max` function as `MovingFunctions.max(values)`. 

The following table describes the predefined functions.

| Function                              | Model keyword        | Description                      |
|:--                                    | :--                  |:--                               |
| Max                                   | `max`                | The maximum value in the window. |
| Min                                   | `min`                | The minimum value in the window. |
| Sum                                   | `sum`                | The sum of values in the window. |
| Unweighted average                    | `unweightedAvg`      | An unweighted mean of all values in the window, equal to `sum` / `window`. |
| Linear weighted average               | `linearWeightedAvg`  | A weighted average using a linear decay of weights, giving more importance to recent values. |
| Exponentially Weighted Moving Average | `ewma`               | A weighted average using exponentially decaying weights, giving more importance to recent values. |
| Holt                                  | `holt`               | A weighted average using a second exponential term to smooth long-term trends. |
| Holt-Winters                          | `holt_wimnters`      | A weighted average using a third exponential term to smooth periodic (seasonal) effects. |
| Standard deviation                    | `stdDev`             | The sum of values in the window. |

All of the predefined functions take the `values` array as their first parameter. For functions that take extra parameters, pass these parameters in order after `values`. For example, call the `stdDev` function by setting the `script` value to `MovingFunctions.stdDev(values, MovingFunctions.unweightedAvg(values))`.

The following table shows the settings required for each model.

| Function            | Extra parameters   | Allowed values  | Default | Description |
| :--                 | :--                | :--             | :--     | :--         |
| `max`               | None               |   Numeric array   |   None   |  The maximum value of the window. |
| `min`               | None               |    Numeric array   |   None   | The minimum value of the window. |
| `sum`               | None               |    Numeric array |   None    | The sum of all values in the window. |
| `unweightedAvg`     | None               |    Numeric array  |   None   | The arithmetic mean of all values in the window. |
| `linearWeightedAvg` | None               |    Numeric array  |   None    | The weighted average of all values in the window, with more recent values weighted more heavily.|
| `ewma`              | `alpha`            | [0, 1] | 0.3     | The decay parameter. Higher values give more weight to recent data points. |
| `holt`              | `alpha`            | [0, 1] | 0.3     | The decay parameter for the level component. |
|              | `beta`             | [0, 1] | 0.1     | The decay parameter for the trend component.|
| `holt_winters`      | `alpha`            | [0, 1] | 0.3     | The decay parameter for the level component.  |
|       | `beta`             | [0, 1] | 0.3     | The decay parameter for the trend component. |
|       | `gamma`            | [0, 1] | 0.3     | The decay parameter for the seasonal component.  |
|       | `type`             | `add`, `mult`   | `add`   | Defines how seasonality is modeled: additive or multiplicative. |
|       | `period`           | Integer         | 1       | The number of buckets comprising the period. |
|      | `pad`              | Boolean         | true    | Whether to add a small offset to `0` values for `mult` type models to avoid a divide-by-zero error. |
| `stdDev`            | `avg`              | Any double      | None    | The standard deviation of the window. To compute a meaningful standard deviation, use the mean of the sliding window array, typically, `MovingFunctions.unweightedAvg(values)`. |

The predefined functions do not support function signatures with missing parameters. You therefore must supply the extra parameters, even if using the default values.
{: .important}  


### Example: Predefined functions

The following example creates a date histogram with a one-week interval from the OpenSearch Dashboards logs sample data. The `sum` sub-aggregation calculates the sum of all bytes logged for each week. Finally, the `moving_fn` aggregation calculates the standard deviation of the byte sum using a `window` size of `5`, the default `shift` of `0`, and unweighted means:

```json
POST /opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "my_date_histo": {
      "date_histogram": {
        "field": "timestamp",
        "calendar_interval": "week"
      },
      "aggs": {
        "the_sum": {
          "sum": { "field": "bytes" }
        },
        "the_movavg": {
          "moving_fn": {
            "buckets_path": "the_sum",
            "window": 5,
            "script": "MovingFunctions.stdDev(values, MovingFunctions.unweightedAvg(values))"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example response

The response shows the standard deviation of the moving window starting with a zero value in the second bucket. The `stdDev` function returns `0` for windows that are empty or contain only invalid values (`null` or `NaN`):

<details open markdown="block">
  <summary>
    Response
  </summary>

```json
{
  "took": 15,
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
    "my_date_histo": {
      "buckets": [
        {
          "key_as_string": "2025-03-24T00:00:00.000Z",
          "key": 1742774400000,
          "doc_count": 249,
          "the_sum": {
            "value": 1531493
          },
          "the_movavg": {
            "value": null
          }
        },
        {
          "key_as_string": "2025-03-31T00:00:00.000Z",
          "key": 1743379200000,
          "doc_count": 1617,
          "the_sum": {
            "value": 9213161
          },
          "the_movavg": {
            "value": 0
          }
        },
        {
          "key_as_string": "2025-04-07T00:00:00.000Z",
          "key": 1743984000000,
          "doc_count": 1610,
          "the_sum": {
            "value": 9188671
          },
          "the_movavg": {
            "value": 3840834
          }
        },
        {
          "key_as_string": "2025-04-14T00:00:00.000Z",
          "key": 1744588800000,
          "doc_count": 1610,
          "the_sum": {
            "value": 9244851
          },
          "the_movavg": {
            "value": 3615414.498228507
          }
        },
        {
          "key_as_string": "2025-04-21T00:00:00.000Z",
          "key": 1745193600000,
          "doc_count": 1609,
          "the_sum": {
            "value": 9061045
          },
          "the_movavg": {
            "value": 3327358.65618917
          }
        },
        {
          "key_as_string": "2025-04-28T00:00:00.000Z",
          "key": 1745798400000,
          "doc_count": 1554,
          "the_sum": {
            "value": 8713507
          },
          "the_movavg": {
            "value": 3058812.9440705855
          }
        },
        {
          "key_as_string": "2025-05-05T00:00:00.000Z",
          "key": 1746403200000,
          "doc_count": 1710,
          "the_sum": {
            "value": 9544718
          },
          "the_movavg": {
            "value": 195603.33146038183
          }
        },
        {
          "key_as_string": "2025-05-12T00:00:00.000Z",
          "key": 1747008000000,
          "doc_count": 1610,
          "the_sum": {
            "value": 9155820
          },
          "the_movavg": {
            "value": 270085.92336040025
          }
        },
        {
          "key_as_string": "2025-05-19T00:00:00.000Z",
          "key": 1747612800000,
          "doc_count": 1610,
          "the_sum": {
            "value": 9025078
          },
          "the_movavg": {
            "value": 269477.75659701484
          }
        },
        {
          "key_as_string": "2025-05-26T00:00:00.000Z",
          "key": 1748217600000,
          "doc_count": 895,
          "the_sum": {
            "value": 5047345
          },
          "the_movavg": {
            "value": 267356.5422566652
          }
        }
      ]
    }
  }
}
```
</details>


## Custom scripts

You can supply an arbitrary custom script to calculate `moving_fn` results. Custom scripts use the Painless scripting language.

### Example: Custom scripts

The following example creates a date histogram with a one-week interval from the OpenSearch Dashboards e-commerce sample data. The `sum` sub-aggregation calculates the sum of all taxed revenue for each week. The `moving_fn` script then returns the greater of the two values previous to the current value or `NaN` if two values are not available:

```json
POST /opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "my_date_histo": {
      "date_histogram": {
        "field": "order_date",
        "calendar_interval": "week"
      },
      "aggs": {
        "the_sum": {
          "sum": { "field": "taxful_total_price" }
        },
        "the_movavg": {
          "moving_fn": {
            "buckets_path": "the_sum",
            "window": 2,
            "script": "return (values.length < 2 ? Double.NaN : (values[0]>values[1] ? values[0] : values[1]))"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The example returns the results of the calculation starting in bucket three, where enough previous data exists to perform the calculation:

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
      "value": 4675,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "my_date_histo": {
      "buckets": [
        {
          "key_as_string": "2025-03-24T00:00:00.000Z",
          "key": 1742774400000,
          "doc_count": 582,
          "the_sum": {
            "value": 41455.5390625
          },
          "the_movavg": {
            "value": null
          }
        },
        {
          "key_as_string": "2025-03-31T00:00:00.000Z",
          "key": 1743379200000,
          "doc_count": 1048,
          "the_sum": {
            "value": 79448.60546875
          },
          "the_movavg": {
            "value": null
          }
        },
        {
          "key_as_string": "2025-04-07T00:00:00.000Z",
          "key": 1743984000000,
          "doc_count": 1048,
          "the_sum": {
            "value": 78208.4296875
          },
          "the_movavg": {
            "value": 79448.60546875
          }
        },
        {
          "key_as_string": "2025-04-14T00:00:00.000Z",
          "key": 1744588800000,
          "doc_count": 1073,
          "the_sum": {
            "value": 81277.296875
          },
          "the_movavg": {
            "value": 79448.60546875
          }
        },
        {
          "key_as_string": "2025-04-21T00:00:00.000Z",
          "key": 1745193600000,
          "doc_count": 924,
          "the_sum": {
            "value": 70494.2578125
          },
          "the_movavg": {
            "value": 81277.296875
          }
        }
      ]
    }
  }
}
```
</details>


## Example: Moving average

The `moving_fn` aggregation replaces the deprecated `moving_avg` aggregation. The `moving_fn` aggregation is similar to the `moving_avg` aggregation but is more versatile since it computes arbitrary functions instead of only averages. All of the predefined `moving_avg` functions are implemented in `moving_fn` as well. 

The `holt` model is a moving average that uses exponentially decaying weights controlled by the `alpha` and `beta` parameters. The following example creates a date histogram with a one-week interval from the OpenSearch Dashboards logs sample data. The `sum` sub-aggregation calculates the sum of all bytes for each week. Finally, the `moving_fn` aggregation calculates a weighted average of the byte sum using a Holt model with a `window` size of `6`, the default `shift` of `0`, an `alpha` value of `0.3`, and a `beta` value of `0.1`:

```json
POST /opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "my_date_histogram": {
      "date_histogram": {
        "field": "timestamp",
        "calendar_interval": "week"
      },
      "aggs": {
        "the_sum": {
          "sum": { "field": "bytes" }
        },
        "the_movavg": {
          "moving_fn": {
            "buckets_path": "the_sum",
            "window": 6,
            "script": "MovingFunctions.holt(values, 0.3, 0.1)"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The aggregation returns the moving `holt` average starting with the second bucket:

<details open markdown="block">
  <summary>
    Response
  </summary>

```json
{
  "took": 16,
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
          "the_sum": {
            "value": 1531493
          },
          "the_movavg": {
            "value": null
          }
        },
        {
          "key_as_string": "2025-03-31T00:00:00.000Z",
          "key": 1743379200000,
          "doc_count": 1617,
          "the_sum": {
            "value": 9213161
          },
          "the_movavg": {
            "value": 1531493
          }
        },
        {
          "key_as_string": "2025-04-07T00:00:00.000Z",
          "key": 1743984000000,
          "doc_count": 1610,
          "the_sum": {
            "value": 9188671
          },
          "the_movavg": {
            "value": 3835993.3999999994
          }
        },
        {
          "key_as_string": "2025-04-14T00:00:00.000Z",
          "key": 1744588800000,
          "doc_count": 1610,
          "the_sum": {
            "value": 9244851
          },
          "the_movavg": {
            "value": 5603111.707999999
          }
        },
        {
          "key_as_string": "2025-04-21T00:00:00.000Z",
          "key": 1745193600000,
          "doc_count": 1609,
          "the_sum": {
            "value": 9061045
          },
          "the_movavg": {
            "value": 6964515.302359998
          }
        },
        {
          "key_as_string": "2025-04-28T00:00:00.000Z",
          "key": 1745798400000,
          "doc_count": 1554,
          "the_sum": {
            "value": 8713507
          },
          "the_movavg": {
            "value": 7930766.089341199
          }
        },
        {
          "key_as_string": "2025-05-05T00:00:00.000Z",
          "key": 1746403200000,
          "doc_count": 1710,
          "the_sum": {
            "value": 9544718
          },
          "the_movavg": {
            "value": 8536788.607547803
          }
        },
        {
          "key_as_string": "2025-05-12T00:00:00.000Z",
          "key": 1747008000000,
          "doc_count": 1610,
          "the_sum": {
            "value": 9155820
          },
          "the_movavg": {
            "value": 9172269.837272028
          }
        },
        {
          "key_as_string": "2025-05-19T00:00:00.000Z",
          "key": 1747612800000,
          "doc_count": 1610,
          "the_sum": {
            "value": 9025078
          },
          "the_movavg": {
            "value": 9166173.88436614
          }
        },
        {
          "key_as_string": "2025-05-26T00:00:00.000Z",
          "key": 1748217600000,
          "doc_count": 895,
          "the_sum": {
            "value": 5047345
          },
          "the_movavg": {
            "value": 9123157.830417283
          }
        }
      ]
    }
  }
}
```
</details>

