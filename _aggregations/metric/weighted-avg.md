---
layout: default
title: Weighted average
parent: Metric aggregations
nav_order: 150
has_math: true
---

# Weighted average aggregation

The `weighted_avg` aggregation computes a weighted average of numeric values extracted from documents. Unlike a regular average where each data point contributes equally, a weighted average assigns different importance to each data point based on a corresponding weight value.

The weighted average is calculated using the formula $$ \frac{\sum_{i=1}^n \text{value}_i \cdot \text{weight}_i}{\sum_{i=1}^n \text{weight}_i} $$.

In a regular average, every data point contributes equally, which is equivalent to assigning a weight of `1` to all values.

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
| `script`   | Optional | A script that provides the value or weight. Mutually exclusive with `field`. |


## Example

First, create an index and add some data. Product C is missing the `rating` and `num_reviews` fields:

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

The following request calculates a weighted average product rating, where each product's rating is weighted by its `num_reviews`. Products with more reviews have a greater influence on the final average:

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

The response contains the `weighted_rating`, calculated as `(4.5 * 100 + 3.8 * 50) / (100 + 50) = 4.27`. Only documents containing values for both `rating` and `num_reviews` are included in the calculation:

```json
{
  "took": 21,
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

## Multi-valued fields

The `value` field can contain multiple values per document, but the `weight` field must resolve to exactly one value. Documents with multiple weights cause an error. To handle multi-valued weight fields, use a `script` that reduces them to a single number.

When a document contains multiple values, the single weight is applied to each value independently. The following example indexes a document where `rating` is a multi-valued field and then runs the aggregation:

```json
POST /products/_doc?refresh=true
{
  "name": "Product D",
  "rating": [1, 2, 3],
  "num_reviews": 2
}
```
{% include copy-curl.html %}

```json
GET /products/_search
{
  "size": 0,
  "query": {
    "term": { "name.keyword": "Product D" }
  },
  "aggs": {
    "weighted_rating": {
      "weighted_avg": {
        "value": {
          "field": "rating"
        },
        "weight": {
          "field": "num_reviews"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The three values (`1`, `2`, and `3`) are each weighted by `2`, resulting in `((1*2) + (2*2) + (3*2)) / (2+2+2) = 2.0`:

```json
{
  ...
  "aggregations": {
    "weighted_rating": {
      "value": 2.0
    }
  }
}
```

## Using a script

You can supply scripts for the value, the weight, or both to compute derived quantities on the fly. The following example adds `1` to each rating and weight before computing the weighted average:

```json
GET /products/_search
{
  "size": 0,
  "aggs": {
    "weighted_rating": {
      "weighted_avg": {
        "value": {
          "script": "if (doc['rating'].size() == 0) return 0; return doc['rating'].value + 1"
        },
        "weight": {
          "script": "if (doc['num_reviews'].size() == 0) return 0; return doc['num_reviews'].value + 1"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Missing values

Documents missing the `value` field are excluded from the calculation by default. Documents missing the `weight` field are still included with an implicit weight of `1`.

The `missing` parameter overrides these defaults by specifying a substitute value for documents that lack the field. The following example assigns a default rating of `3.0` and a default review count of `1` to documents missing those fields:

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

With the missing values applied, the weighted average is calculated as `(4.5 * 100 + 3.8 * 50 + 3.0 * 1) / (100 + 50 + 1) = 4.26`:

```json
{
  ...
  "aggregations": {
    "weighted_rating": {
      "value": 4.258278129906055,
      "value_as_string": "4.26"
    }
  }
}
```
