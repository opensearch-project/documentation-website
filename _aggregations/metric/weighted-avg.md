---
layout: default
title: Weighted average
parent: Metric aggregations
nav_order: 150
canonical_url: https://docs.opensearch.org/latest/aggregations/metric/weighted-avg/
---

# Weighted average

The `weighted_avg` aggregation calculates the weighted average of numeric values across documents. This is useful when you want to calculate an average but weight some data points more heavily than others.

## Weighted average calculation

The weighted average is calculated as `(sum of value * weight) / (sum of weights)`.

## Parameters

When using the `weighted_avg` aggregation, you must define the following parameters:

- `value`: The field or script used to obtain the average numeric values
- `weight`: The field or script used to obtain the weight for each value

Optionally, you can specify the following parameters:

- `format`: A numeric format to apply to the output value
- `value_type`: A type hint for the values when using scripts or unmapped fields

For the value or weight, you can specify the following parameters:

- `field`: The document field to use
- `missing`: A value or weight to use if the field is missing


## Using the aggregation

Follow these steps to use the `weighted_avg` aggregation:

**1. Create an index and index some documents**

```json
PUT /products

POST /products/_doc/1
{
  "name": "Product A",
  "rating": 4,
  "num_reviews": 100
}

POST /products/_doc/2
{
  "name": "Product B",
  "rating": 5,
  "num_reviews": 20
}

POST /products/_doc/3
{
  "name": "Product C",
  "rating": 3,
  "num_reviews": 50
}
```
{% include copy-curl.html %}

**2. Run the `weighted_avg` aggregation**

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
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Handling missing values

The `missing` parameter allows you to specify default values for documents missing the `value` field or the `weight` field instead of excluding them from the calculation.

The following is an example of this behavior. First, create an index and add sample documents. This example includes five documents with different combinations of missing values for the `rating` and `num_reviews` fields: 

```json
PUT /products
{
  "mappings": {
    "properties": {
      "name": {
        "type": "text"
      },
      "rating": {
        "type": "double"
      },
      "num_reviews": {
        "type": "integer"
      }
    }
  }
}

POST /_bulk
{ "index": { "_index": "products" } }
{ "name": "Product A", "rating": 4.5, "num_reviews": 100 }
{ "index": { "_index": "products" } }
{ "name": "Product B", "rating": 3.8, "num_reviews": 50 }
{ "index": { "_index": "products" } }
{ "name": "Product C", "rating": null, "num_reviews": 20 }
{ "index": { "_index": "products" } }
{ "name": "Product D", "rating": 4.2, "num_reviews": null }
{ "index": { "_index": "products" } }
{ "name": "Product E", "rating": null, "num_reviews": null }
```
{% include copy-curl.html %}

Next, run the following `weighted_avg` aggregation:

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
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

In the response, you can see that the missing values for `Product E` were completely ignored in the calculation. 
