---
layout: default
title: Weighted average
parent: Metric aggregations
nav_order: 150
has_math: true
canonical_url: https://docs.opensearch.org/latest/aggregations/metric/weighted-avg/
---

# Weighted average aggregations

The `weighted_avg` aggregation calculates the weighted average of numeric values across documents. This is useful when you want to calculate an average but weight some data points more heavily than others.

The weighted average is calculated using the formula $$ \frac{\sum_{i=1}^n \text{value}_i \cdot \text{weight}_i}{\sum_{i=1}^n \text{weight}_i} $$.

## Parameters

The `weighted_avg` aggregation takes the following parameters.

| Parameter     | Required/Optional  | Description |
|---------------|----------|-------------|
| `value`       | Required      | Defines how to obtain the numeric values to average. Requires a `field` or `script`. |
| `weight`      | Required      | Defines how to obtain the weight for each value. Requires a `field` or `script`. |
| `format`      | Optional       | A [DecimalFormat](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/text/DecimalFormat.html) formatting string. Returns the formatted output in the aggregation's `value_as_string` property. |
| `value_type`  | Optional       | A type hint for the values when using scripts or unmapped fields. |

You can specify the following parameters within `value` or `weight`.

| Parameter  | Required/Optional |  Description |
|------------|----------|-------------|
| `field`    | Optional | The document field to use for the value or weight. |
| `missing`  | Optional | A default value or weight to use when the field is missing. See [Missing values](#missing-values).|


## Example

First, create an index and index some data. Notice that Product C is missing the `rating` and `num_reviews` fields:

```json
POST _bulk
{ "index": { "_index": "products" } }
{ "name": "Product A", "rating": 4.5, "num_reviews": 100 }
{ "index": { "_index": "products" } }
{ "name": "Product B", "rating": 3.8, "num_reviews": 50 }
{ "index": { "_index": "products" } }
{ "name": "Product C"}
```
{% include copy-curl.html %}

The following request uses the `weighted_avg` aggregation to calculate a weighted average product rating. In this context, each product's rating is weighted by its `num_reviews`. This means that products with more reviews will have a greater influence on the final average than those with fewer reviews:

```json
GET /products/_search
{
  "size": 0,
  "aggs": {
    "weighted_rating": {
      "weighted_avg": {
        "value": {
          "field": "rating"
        },
        "weight": {
          "field": "num_reviews"
        },
        "format": "#.##"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example response

The response contains the `weighted_rating`, calculated as `weighted_avg = (4.5 * 100 + 3.8 * 50) / (100 + 50) = 4.27`. Only documents 1 and 2, which contain values for both `rating` and `num_reviews`, are considered:

```json
{
  "took": 18,
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
    "weighted_rating": {
      "value": 4.266666650772095,
      "value_as_string": "4.27"
    }
  }
}
```

## Missing values

The `missing` parameter allows you to specify default values for documents missing the `value` field or the `weight` field instead of excluding them from the calculation.

For example, you can assign products without ratings an "average" rating of 3.0 and set the `num_reviews` to 1 to give them a small non-zero weight:

```json
GET /products/_search
{
  "size": 0,
  "aggs": {
    "weighted_rating": {
      "weighted_avg": {
        "value": {
          "field": "rating",
          "missing": 3.0
        },
        "weight": {
          "field": "num_reviews",
          "missing": 1
        },
        "format": "#.##"
      }
    }
  }
}
```
{% include copy-curl.html %}

The new weighted average is calculated as `weighted_avg = (4.5 * 100 + 3.8 * 50 + 3.0 * 1) / (100 + 50 + 1) = 4.26`:

```json
{
  "took": 27,
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
    "weighted_rating": {
      "value": 4.258278129906055,
      "value_as_string": "4.26"
    }
  }
}
```
