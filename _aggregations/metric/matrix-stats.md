---
layout: default
title: Matrix stats
parent: Metric aggregations
nav_order: 50
redirect_from:
  - /query-dsl/aggregations/metric/matrix-stats/
canonical_url: https://docs.opensearch.org/latest/aggregations/metric/matrix-stats/
---

# Matrix stats aggregations

The `matrix_stats` aggregation is a multi-value metric aggregation that generates covariance statistics for two or more fields in matrix form. 

The `matrix_stats` aggregation does not support scripting.
{: .note}

## Parameters

The `matrix_stats` aggregation takes the following parameters. 

| Parameter | Required/Optional | Data type      | Description |
| :--       | :--               | :--            | :--         |
| `fields`  | Required          | String         | An array of fields for which the matrix stats are computed. |
| `missing`    | Optional          | Object         | The value to use in place of missing values. By default, missing values are ignored. See [Missing values](#missing-values). |
| `mode`    | Optional          | String         | The value to use as a sample from a multi-valued or array field. Allowed values are `avg`, `min`, `max`, `sum`, and `median`. Default is `avg`. |

## Example

The following example returns statistics for the `taxful_total_price` and `products.base_price` fields in the OpenSearch Dashboards e-commerce sample data:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "matrix_stats_taxful_total_price": {
      "matrix_stats": {
        "fields": ["taxful_total_price", "products.base_price"]
      }
    }
  }
}
```
{% include copy-curl.html %}

The response containes the aggregated results:

```json
{
  "took": 250,
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
    "matrix_stats_taxful_total_price": {
      "doc_count": 4675,
      "fields": [
        {
          "name": "products.base_price",
          "count": 4675,
          "mean": 34.99423943014724,
          "variance": 360.5035285833702,
          "skewness": 5.530161335032689,
          "kurtosis": 131.1630632404217,
          "covariance": {
            "products.base_price": 360.5035285833702,
            "taxful_total_price": 846.6489362233169
          },
          "correlation": {
            "products.base_price": 1,
            "taxful_total_price": 0.8444765264325269
          }
        },
        {
          "name": "taxful_total_price",
          "count": 4675,
          "mean": 75.05542864304839,
          "variance": 2788.1879749835425,
          "skewness": 15.812149139923994,
          "kurtosis": 619.1235507385886,
          "covariance": {
            "products.base_price": 846.6489362233169,
            "taxful_total_price": 2788.1879749835425
          },
          "correlation": {
            "products.base_price": 0.8444765264325269,
            "taxful_total_price": 1
          }
        }
      ]
    }
  }
}
```

The following table describes the response fields.

| Statistic    | Description |
| :---         | :---        |
| `count`      | The number of documents sampled for the aggregation. |
| `mean`       | The average value of the field computed from the sample. |
| `variance`   | The square of deviation from the mean, a measure of data spread. |
| `skewness`   | A measure of the distribution's asymmetry relative to the mean. See [Skewness](https://en.wikipedia.org/wiki/Skewness). |
| `kurtosis` | A measure of the tail-heaviness of a distribution. As the tails become lighter, kurtosis decreases. Kurtosis and skewness are evaluated to determine whether a population is likely to be [normally distributed](https://en.wikipedia.org/wiki/Normal_distribution). See [Kurtosis](https://en.wikipedia.org/wiki/Kurtosis).|
| `covariance`  | A measure of the joint variability between two fields. A positive value means their values move in the same direction. |
| `correlation` | The normalized covariance, a measure of the strength of the relationship between two fields. Possible values are from -1 to 1, inclusive, indicating perfect negative to perfect positive linear correlation. A value of 0 indicates no discernible relationship between the variables. |

## Missing values

To define how missing values are treated, use the `missing` parameter. By default, missing values are ignored. 

For example, create an index in which document 1 is missing the `gpa` and `class_grades` fields:

```json
POST _bulk
{ "create": { "_index": "students", "_id": "1" } }
{ "name": "John Doe" } 
{ "create": { "_index": "students", "_id": "2" } }
{ "name": "Jonathan Powers", "gpa": 3.85, "class_grades": [3.0, 3.9, 4.0] } 
{ "create": { "_index": "students", "_id": "3" } }
{ "name": "Jane Doe", "gpa": 3.52, "class_grades": [3.2, 2.1, 3.8] }
```
{% include copy-curl.html %}

First, run a `matrix_stats` aggregation without providing a `missing` parameter:

```json
GET students/_search
{
  "size": 0,
  "aggs": {
    "matrix_stats_taxful_total_price": {
      "matrix_stats": {
        "fields": [
          "gpa",
          "class_grades"
        ],
        "mode": "avg"
      }
    }
  }
}
```
{% include copy-curl.html %}

OpenSearch ignores missing values when calculating the matrix statistics:

```json
{
  "took": 5,
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
      "value": 3,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "matrix_stats_taxful_total_price": {
      "doc_count": 2,
      "fields": [
        {
          "name": "gpa",
          "count": 2,
          "mean": 3.684999942779541,
          "variance": 0.05444997482300096,
          "skewness": 0,
          "kurtosis": 1,
          "covariance": {
            "gpa": 0.05444997482300096,
            "class_grades": 0.09899998760223136
          },
          "correlation": {
            "gpa": 1,
            "class_grades": 0.9999999999999991
          }
        },
        {
          "name": "class_grades",
          "count": 2,
          "mean": 3.333333333333333,
          "variance": 0.1800000381469746,
          "skewness": 0,
          "kurtosis": 1,
          "covariance": {
            "gpa": 0.09899998760223136,
            "class_grades": 0.1800000381469746
          },
          "correlation": {
            "gpa": 0.9999999999999991,
            "class_grades": 1
          }
        }
      ]
    }
  }
}
```

To set the missing fields to `0`, provide the `missing` parameter as a key-value map. Even though `class_grades` is an array field, the `matrix_stats` aggregation flattens multi-valued numeric fields into a per-document average, so you must supply a single number as the missing value:

```json
GET students/_search
{
  "size": 0,
  "aggs": {
    "matrix_stats_taxful_total_price": {
      "matrix_stats": {
        "fields": ["gpa", "class_grades"],
        "mode": "avg",
        "missing": {
          "gpa": 0,
          "class_grades": 0
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

OpenSearch substitutes `0` for any missing `gpa` or `class_grades` values when calculating the matrix statistics:

```json
{
  "took": 23,
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
      "value": 3,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "matrix_stats_taxful_total_price": {
      "doc_count": 3,
      "fields": [
        {
          "name": "gpa",
          "count": 3,
          "mean": 2.456666628519694,
          "variance": 4.55363318017324,
          "skewness": -0.688130006360758,
          "kurtosis": 1.5,
          "covariance": {
            "gpa": 4.55363318017324,
            "class_grades": 4.143944374667273
          },
          "correlation": {
            "gpa": 1,
            "class_grades": 0.9970184390038257
          }
        },
        {
          "name": "class_grades",
          "count": 3,
          "mean": 2.2222222222222223,
          "variance": 3.793703722777191,
          "skewness": -0.6323693521730989,
          "kurtosis": 1.5000000000000002,
          "covariance": {
            "gpa": 4.143944374667273,
            "class_grades": 3.793703722777191
          },
          "correlation": {
            "gpa": 0.9970184390038257,
            "class_grades": 1
          }
        }
      ]
    }
  }
}
```
