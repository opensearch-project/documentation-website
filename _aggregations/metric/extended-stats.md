---
layout: default
title: Extended stats
parent: Metric aggregations
nav_order: 30
redirect_from:
  - /query-dsl/aggregations/metric/extended-stats/
---

# Extended stats aggregations

The `extended_stats` aggregation is a more comprehensive version of the [`stats`]({{site.url}}{{site.baseurl}}/query-dsl/aggregations/metric/stats/) aggregation. As well as the basic statistical measures provided by `stats`, `extended_stats` calculates the following:

- Sum of squares
- Variance
- Population variance
- Sampling variance
- Standard deviation
- Population standard deviation
- Sampling standard deviation
- Standard deviation bounds:
  - Upper
  - Lower
  - Population upper
  - Population lower
  - Sampling upper
  - Sampling lower

The standard deviation and variance are population statistics; they are always equal to the population standard deviation and variance, respectively.

The `std_deviation_bounds` object defines a range that spans the specified number of standard deviations above and below the mean (default is two standard deviations). This object is always included in the output but is meaningful only for normally distributed data. Before interpreting these values, verify that your dataset follows a normal distribution.

## Parameters

The `extended_stats` aggregation takes the following parameters.

| Parameter | Required/Optional | Data type             | Description |
| :--       | :--               | :--                   | :--         |
| `field`   | Required          | String                | The name of the field for which the extended stats are returned. |
| `sigma`   | Optional          | Double (non-negative) | The number of standard deviations above and below the mean used to calculate the `std_deviation_bounds` interval. Default is `2`. |
| `missing` | Optional          | Numeric        | The value assigned to missing instances of the field. If not provided, documents containing missing values are omitted from the extended stats. |

## Example

The following example request returns extended stats for `taxful_total_price` in the OpenSearch Dashboards sample e-commerce data:

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
{% include copy-curl.html %}

## Example response

The response contains extended stats for `taxful_total_price`:

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

## Defining bounds

You can define the number of standard deviations used to calculate the `std_deviation_bounds` interval by setting the `sigma` parameter to any non-negative value.

### Example: Defining bounds

Set the number of `std_deviation_bounds` standard deviations to `3`:

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
{% include copy-curl.html %}

This changes the standard deviation bounds:

```json
{
...
  "aggregations": {
...
      "std_deviation_bounds": {
        "upper": 233.44837084770438,
        "lower": -83.33751356160813,
        "upper_population": 233.44837084770438,
        "lower_population": -83.33751356160813,
        "upper_sampling": 233.46531398752978,
        "lower_sampling": -83.35445670143353
      }
    }
  }
}
```

## Missing values

You can assign a value to missing instances of the aggregated field. See [Missing aggregations]({{site.url}}{{site.baseurl}}/aggregations/bucket/missing/) for more information.

Prepare an example index by ingesting the following documents:

```json
POST _bulk
{ "create": { "_index": "students", "_id": "1" } }
{ "name": "John Doe", "gpa": 3.89, "grad_year": 2022}
{ "create": { "_index": "students", "_id": "2" } }
{ "name": "Jonathan Powers", "grad_year": 2025 }
{ "create": { "_index": "students", "_id": "3" } }
{ "name": "Jane Doe", "gpa": 3.52, "grad_year": 2024 }
```
{% include copy-curl.html %}

### Example: Replacing a missing value

Compute `extended_stats`, replacing the missing GPA field with `0`:

```json
GET students/_search
{
  "size": 0,
  "aggs": {
    "extended_stats_gpa": {
      "extended_stats": {
        "field": "gpa",
        "missing": 0
      }
    }
  }
}
```
{% include copy-curl.html %}

In the response, all missing values of `gpa` are replaced with `0`:

```json
...
  "aggregations": {
    "extended_stats_gpa": {
      "count": 3,
      "min": 0,
      "max": 3.890000104904175,
      "avg": 2.4700000286102295,
      "sum": 7.4100000858306885,
      "sum_of_squares": 27.522500681877148,
      "variance": 3.0732667526245145,
      "variance_population": 3.0732667526245145,
      "variance_sampling": 4.609900128936772,
      "std_deviation": 1.7530735160353415,
      "std_deviation_population": 1.7530735160353415,
      "std_deviation_sampling": 2.147067797936705,
      "std_deviation_bounds": {
        "upper": 5.976147060680912,
        "lower": -1.0361470034604534,
        "upper_population": 5.976147060680912,
        "lower_population": -1.0361470034604534,
        "upper_sampling": 6.7641356244836395,
        "lower_sampling": -1.8241355672631805
      }
    }
  }
}
```

### Example: Ignoring a missing value

Compute `extended_stats` but without assigning the `missing` parameter:

```json
GET students/_search
{
  "size": 0,
  "aggs": {
    "extended_stats_gpa": {
      "extended_stats": {
        "field": "gpa"
      }
    }
  }
}
```
{% include copy-curl.html %}

OpenSearch calculates the extended statistics, omitting documents containing missing field values (the default behavior):

```json
...
  "aggregations": {
    "extended_stats_gpa": {
      "count": 2,
      "min": 3.5199999809265137,
      "max": 3.890000104904175,
      "avg": 3.7050000429153442,
      "sum": 7.4100000858306885,
      "sum_of_squares": 27.522500681877148,
      "variance": 0.03422502293587115,
      "variance_population": 0.03422502293587115,
      "variance_sampling": 0.0684500458717423,
      "std_deviation": 0.18500006198883057,
      "std_deviation_population": 0.18500006198883057,
      "std_deviation_sampling": 0.2616295967044675,
      "std_deviation_bounds": {
        "upper": 4.075000166893005,
        "lower": 3.334999918937683,
        "upper_population": 4.075000166893005,
        "lower_population": 3.334999918937683,
        "upper_sampling": 4.228259236324279,
        "lower_sampling": 3.1817408495064092
      }
    }
  }
}
```

The document containing the missing GPA value is omitted from this calculation. Note the difference in `count`.
