---
layout: default
title: Matrix stats
parent: Metric aggregations
grand_parent: Aggregations
nav_order: 50
redirect_from:
  - /query-dsl/aggregations/metric/matrix-stats/
---

# Matrix stats aggregations

The `matrix_stats` aggregation generates advanced stats for multiple fields in a matrix form.
The following example returns advanced stats in a matrix form for the `taxful_total_price` and `products.base_price` fields:

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

#### Example response

```json
...
"aggregations" : {
  "matrix_stats_taxful_total_price" : {
    "doc_count" : 4675,
    "fields" : [
      {
        "name" : "products.base_price",
        "count" : 4675,
        "mean" : 34.994239430147196,
        "variance" : 360.5035285833703,
        "skewness" : 5.530161335032702,
        "kurtosis" : 131.16306324042148,
        "covariance" : {
          "products.base_price" : 360.5035285833703,
          "taxful_total_price" : 846.6489362233166
        },
        "correlation" : {
          "products.base_price" : 1.0,
          "taxful_total_price" : 0.8444765264325268
        }
      },
      {
        "name" : "taxful_total_price",
        "count" : 4675,
        "mean" : 75.05542864304839,
        "variance" : 2788.1879749835402,
        "skewness" : 15.812149139924037,
        "kurtosis" : 619.1235507385902,
        "covariance" : {
          "products.base_price" : 846.6489362233166,
          "taxful_total_price" : 2788.1879749835402
        },
        "correlation" : {
          "products.base_price" : 0.8444765264325268,
          "taxful_total_price" : 1.0
        }
      }
    ]
  }
 }
}
```

The following table lists all response fields.

Statistic | Description
:--- | :---
`count` | The number of samples measured.
`mean` | The average value of the field measured from the sample.
`variance` | How far the values of the field measured are spread out from its mean value. The larger the variance, the more it's spread from its mean value.
`skewness` | An asymmetric measure of the distribution of the field's values around the mean.
`kurtosis` | A measure of the tail heaviness of a distribution. As the tail becomes lighter, kurtosis decreases. As the tail becomes heavier, kurtosis increases. To learn about kurtosis, see [Wikipedia](https://en.wikipedia.org/wiki/Kurtosis).
`covariance` | A measure of the joint variability between two fields. A positive value means their values move in the same direction and the other way around.
`correlation` | A measure of the strength of the relationship between two fields. The valid values are between [-1, 1]. A value of -1 means that the value is negatively correlated and a value of 1 means that it's positively correlated. A value of 0 means that there's no identifiable relationship between them.