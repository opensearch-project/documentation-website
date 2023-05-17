---
layout: default
title: Metric aggregations
parent: Aggregations
nav_order: 2
permalink: /aggregations/metric-agg/
redirect_from:
  - /opensearch/metric-agg/
---

# Metric aggregations

Metric aggregations let you perform simple calculations such as finding the minimum, maximum, and average values of a field.

## Types of metric aggregations

Metric aggregations are of two types: single-value metric aggregations and multi-value metric aggregations.

### Single-value metric aggregations

Single-value metric aggregations return a single metric. For example, `sum`, `min`, `max`, `avg`, `cardinality`, and `value_count`.

### Multi-value metric aggregations

Multi-value metric aggregations return more than one metric. For example, `stats`, `extended_stats`, `matrix_stats`, `percentile`, `percentile_ranks`, `geo_bound`, `top_hits`, and `scripted_metric`.

## sum, min, max, avg

The `sum`, `min`, `max`, and `avg` metrics are single-value metric aggregations that return the sum, minimum, maximum, and average values of a field, respectively.

The following example calculates the total sum of the `taxful_total_price` field:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "sum_taxful_total_price": {
      "sum": {
        "field": "taxful_total_price"
      }
    }
  }
}
```

#### Example response

```json
...
  "aggregations" : {
    "sum_taxful_total_price" : {
      "value" : 350884.12890625
    }
  }
}
```

In a similar fashion, you can find the minimum, maximum, and average values of a field.

## cardinality

The `cardinality` metric is a single-value metric aggregation that counts the number of unique or distinct values of a field.

The following example finds the number of unique products in an eCommerce store:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "unique_products": {
      "cardinality": {
        "field": "products.product_id"
      }
    }
  }
}
```

#### Example response

```json
...
  "aggregations" : {
    "unique_products" : {
      "value" : 7033
    }
  }
}
```

Cardinality count is approximate.
If you have tens of thousands of products in your hypothetical store, an accurate cardinality calculation requires loading all the values into a hash set and returning its size. This approach doesn't scale well; it requires huge amounts of memory and can cause high latencies.

You can control the trade-off between memory and accuracy with the `precision_threshold` setting. This setting defines the threshold below which counts are expected to be close to accurate. Above this value, counts might become a bit less accurate. The default value of `precision_threshold` is 3,000. The maximum supported value is 40,000.

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "unique_products": {
      "cardinality": {
        "field": "products.product_id",
        "precision_threshold": 10000
      }
    }
  }
}
```

## value_count

The `value_count` metric is a single-value metric aggregation that calculates the number of values that an aggregation is based on.

For example, you can use the `value_count` metric with the `avg` metric to find how many numbers the aggregation uses to calculate an average value.

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
   "aggs": {
    "number_of_values": {
      "value_count": {
        "field": "taxful_total_price"
      }
    }
  }
}
```

#### Example response

```json
...
  "aggregations" : {
    "number_of_values" : {
      "value" : 4675
    }
  }
}
```

## stats, extended_stats, matrix_stats

The `stats` metric is a multi-value metric aggregation that returns all basic metrics such as `min`, `max`, `sum`, `avg`, and `value_count` in one aggregation query.

The following example returns the basic stats for the `taxful_total_price` field:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "stats_taxful_total_price": {
      "stats": {
        "field": "taxful_total_price"
      }
    }
  }
}
```

#### Example response

```json
...
"aggregations" : {
  "stats_taxful_total_price" : {
    "count" : 4675,
    "min" : 6.98828125,
    "max" : 2250.0,
    "avg" : 75.05542864304813,
    "sum" : 350884.12890625
  }
 }
}
```

The `extended_stats` aggregation is an extended version of the `stats` aggregation. Apart from including basic stats, `extended_stats` also returns stats such as `sum_of_squares`, `variance`, and `std_deviation`.

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "extended_stats_taxful_total_price": {
      "extended_stats": {
        "field": "taxful_total_price"
      }
    }
  }
}
```

#### Example response

```json
...
"aggregations" : {
  "extended_stats_taxful_total_price" : {
    "count" : 4675,
    "min" : 6.98828125,
    "max" : 2250.0,
    "avg" : 75.05542864304813,
    "sum" : 350884.12890625,
    "sum_of_squares" : 3.9367749294174194E7,
    "variance" : 2787.59157113862,
    "variance_population" : 2787.59157113862,
    "variance_sampling" : 2788.187974983536,
    "std_deviation" : 52.79764740155209,
    "std_deviation_population" : 52.79764740155209,
    "std_deviation_sampling" : 52.80329511482722,
    "std_deviation_bounds" : {
      "upper" : 180.6507234461523,
      "lower" : -30.53986616005605,
      "upper_population" : 180.6507234461523,
      "lower_population" : -30.53986616005605,
      "upper_sampling" : 180.66201887270256,
      "lower_sampling" : -30.551161586606312
    }
  }
 }
}
```

The `std_deviation_bounds` object provides a visual variance of the data with an interval of plus/minus two standard deviations from the mean.
To set the standard deviation to a different value, say 3, set `sigma` to 3:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "extended_stats_taxful_total_price": {
      "extended_stats": {
        "field": "taxful_total_price",
        "sigma": 3
      }
    }
  }
}
```

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

Statistic | Description
:--- | :---
`count` | The number of samples measured.
`mean` | The average value of the field measured from the sample.
`variance` | How far the values of the field measured are spread out from its mean value. The larger the variance, the more it's spread from its mean value.
`skewness` | An asymmetric measure of the distribution of the field's values around the mean.
`kurtosis` | A measure of the tail heaviness of a distribution. As the tail becomes lighter, kurtosis decreases. As the tail becomes heavier, kurtosis increases. To learn about kurtosis, see [Wikipedia](https://en.wikipedia.org/wiki/Kurtosis).
`covariance` | A measure of the joint variability between two fields. A positive value means their values move in the same direction and vice versa.
`correlation` | A measure of the strength of the relationship between two fields. The valid values are between [-1, 1]. A value of -1 means that the value is negatively correlated and a value of 1 means that it's positively correlated. A value of 0 means that there's no identifiable relationship between them.

## percentile, percentile_ranks

Percentile is the percentage of the data that's at or below a certain threshold value.

The `percentile` metric is a multi-value metric aggregation that lets you find outliers in your data or figure out the distribution of your data.

Like the `cardinality` metric, the `percentile` metric is also approximate.

The following example calculates the percentile in relation to the `taxful_total_price` field:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "percentile_taxful_total_price": {
      "percentiles": {
        "field": "taxful_total_price"
      }
    }
  }
}
```

#### Example response

```json
...
"aggregations" : {
  "percentile_taxful_total_price" : {
    "values" : {
      "1.0" : 21.984375,
      "5.0" : 27.984375,
      "25.0" : 44.96875,
      "50.0" : 64.22061688311689,
      "75.0" : 93.0,
      "95.0" : 156.0,
      "99.0" : 222.0
    }
  }
 }
}
```

Percentile rank is the percentile of values at or below a threshold grouped by a specified value. For example, if a value is greater than or equal to 80% of the values, it has a percentile rank of 80.

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "percentile_rank_taxful_total_price": {
      "percentile_ranks": {
        "field": "taxful_total_price",
        "values": [
          10,
          15
        ]
      }
    }
  }
}
```

#### Example response

```json
...
"aggregations" : {
  "percentile_rank_taxful_total_price" : {
    "values" : {
      "10.0" : 0.055096056411283456,
      "15.0" : 0.0830092961834656
    }
  }
 }
}
```

## geo_bound

The `geo_bound` metric is a multi-value metric aggregation that calculates the bounding box in terms of latitude and longitude around a `geo_point` field.

The following example returns the `geo_bound` metrics for the `geoip.location` field:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "geo": {
      "geo_bounds": {
        "field": "geoip.location"
      }
    }
  }
}
```

#### Example response

```json
"aggregations" : {
  "geo" : {
    "bounds" : {
      "top_left" : {
        "lat" : 52.49999997206032,
        "lon" : -118.20000001229346
      },
      "bottom_right" : {
        "lat" : 4.599999985657632,
        "lon" : 55.299999956041574
      }
    }
  }
 }
}
```

## top_hits

The `top_hits` metric is a multi-value metric aggregation that ranks the matching documents based on a relevance score for the field that's being aggregated.

You can specify the following options:

- `from`: The starting position of the hit.
- `size`: The maximum size of hits to return. The default value is 3.
- `sort`: How the matching hits are sorted. By default, the hits are sorted by the relevance score of the aggregation query.

The following example returns the top 5 products in your eCommerce data:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "top_hits_products": {
      "top_hits": {
        "size": 5
      }
    }
  }
}
```

#### Example response

```json
...
"aggregations" : {
  "top_hits_products" : {
    "hits" : {
      "total" : {
        "value" : 4675,
        "relation" : "eq"
      },
      "max_score" : 1.0,
      "hits" : [
        {
          "_index" : "opensearch_dashboards_sample_data_ecommerce",
          "_type" : "_doc",
          "_id" : "glMlwXcBQVLeQPrkHPtI",
          "_score" : 1.0,
          "_source" : {
            "category" : [
              "Women's Accessories",
              "Women's Clothing"
            ],
            "currency" : "EUR",
            "customer_first_name" : "rania",
            "customer_full_name" : "rania Evans",
            "customer_gender" : "FEMALE",
            "customer_id" : 24,
            "customer_last_name" : "Evans",
            "customer_phone" : "",
            "day_of_week" : "Sunday",
            "day_of_week_i" : 6,
            "email" : "rania@evans-family.zzz",
            "manufacturer" : [
              "Tigress Enterprises"
            ],
            "order_date" : "2021-02-28T14:16:48+00:00",
            "order_id" : 583581,
            "products" : [
              {
                "base_price" : 10.99,
                "discount_percentage" : 0,
                "quantity" : 1,
                "manufacturer" : "Tigress Enterprises",
                "tax_amount" : 0,
                "product_id" : 19024,
                "category" : "Women's Accessories",
                "sku" : "ZO0082400824",
                "taxless_price" : 10.99,
                "unit_discount_amount" : 0,
                "min_price" : 5.17,
                "_id" : "sold_product_583581_19024",
                "discount_amount" : 0,
                "created_on" : "2016-12-25T14:16:48+00:00",
                "product_name" : "Snood - white/grey/peach",
                "price" : 10.99,
                "taxful_price" : 10.99,
                "base_unit_price" : 10.99
              },
              {
                "base_price" : 32.99,
                "discount_percentage" : 0,
                "quantity" : 1,
                "manufacturer" : "Tigress Enterprises",
                "tax_amount" : 0,
                "product_id" : 19260,
                "category" : "Women's Clothing",
                "sku" : "ZO0071900719",
                "taxless_price" : 32.99,
                "unit_discount_amount" : 0,
                "min_price" : 17.15,
                "_id" : "sold_product_583581_19260",
                "discount_amount" : 0,
                "created_on" : "2016-12-25T14:16:48+00:00",
                "product_name" : "Cardigan - grey",
                "price" : 32.99,
                "taxful_price" : 32.99,
                "base_unit_price" : 32.99
              }
            ],
            "sku" : [
              "ZO0082400824",
              "ZO0071900719"
            ],
            "taxful_total_price" : 43.98,
            "taxless_total_price" : 43.98,
            "total_quantity" : 2,
            "total_unique_products" : 2,
            "type" : "order",
            "user" : "rani",
            "geoip" : {
              "country_iso_code" : "EG",
              "location" : {
                "lon" : 31.3,
                "lat" : 30.1
              },
              "region_name" : "Cairo Governorate",
              "continent_name" : "Africa",
              "city_name" : "Cairo"
            },
            "event" : {
              "dataset" : "sample_ecommerce"
            }
          }
          ...
        }
      ]
    }
  }
 }
}
```

## scripted_metric

The `scripted_metric` metric is a multi-value metric aggregation that returns metrics calculated from a specified script.

A script has four stages: the initial stage, the map stage, the combine stage, and the reduce stage.

* `init_script`: (OPTIONAL) Sets the initial state and executes before any collection of documents.
* `map_script`: Checks the value of the `type` field and executes the aggregation on the collected documents.
* `combine_script`: Aggregates the state returned from every shard. The aggregated value is returned to the coordinating node.
* `reduce_script`: Provides access to the variable states; this variable combines the results from the `combine_script` on each shard into an array.

The following example aggregates the different HTTP response types in web log data:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggregations": {
    "responses.counts": {
      "scripted_metric": {
        "init_script": "state.responses = ['error':0L,'success':0L,'other':0L]",
        "map_script": """
              def code = doc['response.keyword'].value;
                 if (code.startsWith('5') || code.startsWith('4')) {
                  state.responses.error += 1 ;
                  } else if(code.startsWith('2')) {
                   state.responses.success += 1;
                  } else {
                  state.responses.other += 1;
                }
             """,
        "combine_script": "state.responses",
        "reduce_script": """
            def counts = ['error': 0L, 'success': 0L, 'other': 0L];
                for (responses in states) {
                 counts.error += responses['error'];
                  counts.success += responses['success'];
                counts.other += responses['other'];
        }
        return counts;
        """
      }
    }
  }
}
```

#### Example response

```json
...
"aggregations" : {
  "responses.counts" : {
    "value" : {
      "other" : 0,
      "success" : 12832,
      "error" : 1242
    }
  }
 }
}
```
