---
layout: default
title: Cardinality
parent: Metric aggregations
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
{% include copy-curl.html %}

## Configuring aggregation execution  

You can control how an aggregation runs using the `execution_hint` setting. This setting supports two options:  

- `direct` – Uses field values directly.  
- `ordinals` – Uses ordinals of the field.  

If you don’t specify `execution_hint`, OpenSearch automatically chooses the best option for the field.  

Setting `ordinals` on a non-ordinal field has no effect. Similarly, `direct` has no effect on ordinal fields.  
{: .note}

This is an expert-level setting. Ordinals use byte arrays, where the array size depends on the field's cardinality. High-cardinality fields can consume significant heap memory, increasing the risk of out-of-memory errors.  
{: .warning}

### Example  

The following request runs a cardinality aggregation using ordinals:  

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "unique_products": {
      "cardinality": {
        "field": "products.product_id",
        "execution_hint": "ordinals"
      }
    }
  }
}
```  
{% include copy-curl.html %}