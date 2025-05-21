---
layout: default
title: Matrix stats
parent: Metric aggregations
nav_order: 50
redirect_from:
  - /query-dsl/aggregations/metric/matrix-stats/
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
| `mode`    | Optional          | String         | The value to use as a sample from a multi-valued or array field. Allowed values are `avg`, `min`, `max`, `sum`, and `median`. Default is `avg`. |

## Example

This example returns statistics for the `taxful_total_price` and `products.base_price` fields in the ecommerce sample data:

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
| [`skewness`](https://en.wikipedia.org/wiki/Skewness)   | A measure of the distribution's assymetry about the mean. |
| [ `kurtosis`](https://en.wikipedia.org/wiki/Kurtosis)   | A measure of the tail-heaviness of a distribution. As the tails become lighter, kurtosis decreases. Kurtosis and skewness are evaluated to determine whether a population is likely to be [normally distributed](https://en.wikipedia.org/wiki/Normal_distribution). |
| `covariance`  | A measure of the joint variability between two fields. A positive value means their values move in the same direction. |
| `correlation` | The normalized covariance, a measure of the strength of the relationship between two fields. Possible values are from -1 to 1, inclusive, indicating perfect negative to perfect positive linear correlation. A value of 0 indicates no discernible relationship between the variables. |
