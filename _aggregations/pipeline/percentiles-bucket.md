---
layout: default
title: Percentiles bucket
parent: Pipeline aggregations
nav_order: 160
---

# Percentiles bucket aggregations

The `percentiles_bucket` aggregation is a sibling aggregation that calculates the percentile placement of bucketed metrics.

The `percentiles_bucket` aggregation computes percentiles exactly, without approximation or interpolation. Each percentile is returned as the closest value less than or equal to the target percentile.

The `percentiles_bucket` aggregation requires that the entire list of values be kept temporarily in memory, even for large datasets. In contrast, [the `percentiles` metric aggregation]({{site.url}}{{site.baseurl}}/aggregations/metric/percentile/) uses less memory but approximates the percentages.

The specified metric must be numeric, and the sibling aggregation must be a multi-bucket aggregation.

## Parameters

The `avg_bucket` aggregation takes the following parameters.

| Parameter             | Required/Optional | Data type       | Description |
| :--                   | :--               |  :--            | :--         |
| `buckets_path`        | Required          | String          | The path of the aggregation buckets to aggregate. See [Buckets path]({{site.url}}{{site.baseurl}}/aggregations/pipeline/index#buckets-path). |
| `gap_policy`          | Optional          | String          | The policy to apply to missing data. Valid values are `skip` and `insert_zeros`. Default is `skip`. See [Data gaps]({{site.url}}{{site.baseurl}}/aggregations/pipeline/#data-gaps). |
| `format`              | Optional          | String          | A [DecimalFormat](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/text/DecimalFormat.html) formatting string. Returns the formatted output in the aggregation's `value_as_string` property. |
| `percents`            | Optional          | List            | A list containing any number of numeric percentage values to be included in the output. Valid values are between 0.0 and 100.0, inclusive. Default is `[1.0, 5.0, 25.0, 50.0, 75.0, 95.0, 99.0]`. |
| `keyed`               | Optional          | Boolean         | Whether to format the output as a dictionary rather than as an array of key-value pair objects. Default is `true` (format the output as key-value pairs). |


## Example

The following example creates a date histogram with a one-week interval from the OpenSearch Dashboards e-commerce sample data. The `sum` sub-aggregation adds up the `taxful_total_price` for each week. Finally, the `percentiles_bucket` aggregation calculates the percentile values for each week from these sums:

```json
POST /opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "weekly_sales": {
      "date_histogram": {
        "field": "order_date",
        "calendar_interval": "week"
      },
      "aggs": {
        "total_price": {
          "sum": {
            "field": "taxful_total_price"
          }
        }
      }
    },
    "percentiles_monthly_sales": {
      "percentiles_bucket": {
        "buckets_path": "weekly_sales>total_price"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example response

The aggregation returns the default percentile values for the weekly price totals:

<details open markdown="block">
  <summary>
    Response
  </summary>

```json
{
  "took": 4,
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
    "weekly_sales": {
      "buckets": [
        {
          "key_as_string": "2025-03-24T00:00:00.000Z",
          "key": 1742774400000,
          "doc_count": 582,
          "total_price": {
            "value": 41455.5390625
          }
        },
        {
          "key_as_string": "2025-03-31T00:00:00.000Z",
          "key": 1743379200000,
          "doc_count": 1048,
          "total_price": {
            "value": 79448.60546875
          }
        },
        {
          "key_as_string": "2025-04-07T00:00:00.000Z",
          "key": 1743984000000,
          "doc_count": 1048,
          "total_price": {
            "value": 78208.4296875
          }
        },
        {
          "key_as_string": "2025-04-14T00:00:00.000Z",
          "key": 1744588800000,
          "doc_count": 1073,
          "total_price": {
            "value": 81277.296875
          }
        },
        {
          "key_as_string": "2025-04-21T00:00:00.000Z",
          "key": 1745193600000,
          "doc_count": 924,
          "total_price": {
            "value": 70494.2578125
          }
        }
      ]
    },
    "percentiles_monthly_sales": {
      "values": {
        "1.0": 41455.5390625,
        "5.0": 41455.5390625,
        "25.0": 70494.2578125,
        "50.0": 78208.4296875,
        "75.0": 79448.60546875,
        "95.0": 81277.296875,
        "99.0": 81277.296875
      }
    }
  }
}
```
</details>

## Example: Options

The next example computes percentiles using the same data as in the previous example but with the following differences:

- The `percents` parameter specifies that only the 25th, 50th, and 75th percentiles be calculated.
- String-formatted outputs are appended using the `format` parameter.
- Results are displayed as key-value pair objects (with string values appended) by setting the `keyed` parameter to `false`.

The example is as follows:

```json
POST /opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "weekly_sales": {
      "date_histogram": {
        "field": "order_date",
        "calendar_interval": "week"
      },
      "aggs": {
        "total_price": {
          "sum": {
            "field": "taxful_total_price"
          }
        }
      }
    },
    "percentiles_monthly_sales": {
      "percentiles_bucket": {
        "buckets_path": "weekly_sales>total_price",
        "percents": [25.0, 50.0, 75.0],
        "format": "$#,###.00",
        "keyed": false
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example response: Options

The options modify the output of the aggregation:


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
      "value": 4675,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "weekly_sales": {
      "buckets": [
        {
          "key_as_string": "2025-03-24T00:00:00.000Z",
          "key": 1742774400000,
          "doc_count": 582,
          "total_price": {
            "value": 41455.5390625
          }
        },
        {
          "key_as_string": "2025-03-31T00:00:00.000Z",
          "key": 1743379200000,
          "doc_count": 1048,
          "total_price": {
            "value": 79448.60546875
          }
        },
        {
          "key_as_string": "2025-04-07T00:00:00.000Z",
          "key": 1743984000000,
          "doc_count": 1048,
          "total_price": {
            "value": 78208.4296875
          }
        },
        {
          "key_as_string": "2025-04-14T00:00:00.000Z",
          "key": 1744588800000,
          "doc_count": 1073,
          "total_price": {
            "value": 81277.296875
          }
        },
        {
          "key_as_string": "2025-04-21T00:00:00.000Z",
          "key": 1745193600000,
          "doc_count": 924,
          "total_price": {
            "value": 70494.2578125
          }
        }
      ]
    },
    "percentiles_monthly_sales": {
      "values": [
        {
          "key": 25,
          "value": 70494.2578125,
          "25.0_as_string": "$70,494.26"
        },
        {
          "key": 50,
          "value": 78208.4296875,
          "50.0_as_string": "$78,208.43"
        },
        {
          "key": 75,
          "value": 79448.60546875,
          "75.0_as_string": "$79,448.61"
        }
      ]
    }
  }
}
```
</details>

