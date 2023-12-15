---
layout: default
title: Cardinality
parent: Metric aggregations
grand_parent: Aggregations
nav_order: 20
redirect_from:
  - /query-dsl/aggregations/metric/cardinality/
---

# Cardinality aggregations

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
{% include copy-curl.html %}

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