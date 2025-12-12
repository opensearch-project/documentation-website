---
layout: default
title: Cardinality
parent: Metric aggregations
nav_order: 20
redirect_from:
  - /query-dsl/aggregations/metric/cardinality/
---

# Cardinality aggregations

The `cardinality` aggregation is a single-value metric aggregation that counts the number of unique or distinct values of a field.


Cardinality count is approximate. See [Controlling precision](#controlling-precision) for more information.

## Parameters

The `cardinality` aggregation takes the following parameters.

| Parameter             | Required/Optional | Data type       | Description |
| :--                   | :--               |  :--            | :--         |
| `field`               | Required          | String          | The field for which the cardinality is estimated. |
| `precision_threshold` | Optional          | Numeric         | The threshold below which counts are expected to be close to accurate. See [Controlling precision](#controlling-precision) for more information.     |
| `execution_hint`      | Optional          | String          | How to run the aggregation. Valid values are `ordinals` and `direct`. |
| `missing`             | Optional          | Same as `field`'s type | The bucket used to store missing instances of the field. If not provided, missing values are ignored. |

## Example

The following example request finds the number of unique product IDs in the OpenSearch Dashboards sample e-commerce data:

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

## Example response

As shown in the following example response, the aggregation returns the cardinality count in the `unique_products` variable:

```json
{
  "took": 176,
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
    "unique_products": {
      "value": 7033
    }
  }
}
```

## Controlling precision

An accurate cardinality calculation requires loading all the values into a hash set and returning its size. This approach doesn't scale well; it can require huge amounts of memory and cause high latencies.

You can control the trade-off between memory and accuracy by using the `precision_threshold` setting. This parameter sets the threshold below which counts are expected to be close to accurate. Counts higher than this value may be less accurate.

The default value of `precision_threshold` is 3,000. The maximum supported value is 40,000.

The cardinality aggregation uses the [HyperLogLog++ algorithm](https://static.googleusercontent.com/media/research.google.com/fr//pubs/archive/40671.pdf). Cardinality counts are typically very accurate up to the precision threshold and are within 6% of the true count in most other cases, even with a threshold of as low as 100.

### Precomputing hashes

For high-cardinality string fields, storing hash values for the index field and computing the cardinality of the hash can save compute and memory resources. Use this approach with caution; it is more efficient only for sets with long strings and/or high cardinality. Numeric fields and less memory-consuming string sets are better processed directly.

### Example: Controlling precision

Set the precision threshold to `10000` unique values:

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

The response is similar to the result with the default threshold, but the returned value is slightly different. Vary the `precision_threshold` parameter to see how it affects the cardinality estimate.

## Configuring aggregation execution  

You can control how an aggregation runs using the `execution_hint` setting. This setting supports two options:  

- `direct` – Uses field values directly.  
- `ordinals` – Uses ordinals of the field. 

If you don't specify `execution_hint`, OpenSearch automatically chooses the best option for the field using the hybrid collector (enabled by default).

Setting `ordinals` on a non-ordinal field has no effect. Similarly, `direct` has no effect on ordinal fields.  
{: .note}

This is an expert-level setting. Ordinals use byte arrays, where the array size depends on the field's cardinality. High-cardinality fields can consume significant heap memory, increasing the risk of out-of-memory errors.  
{: .warning}

### Example: Controlling execution

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

## Hybrid collector
**Introduced 3.4**
{: .label .label-purple }

By default, OpenSearch uses a _hybrid collector_ for cardinality aggregations to improve speed and manage memory. The hybrid collector begins with the faster ordinals collector and monitors memory use during execution. If usage exceeds a configurable threshold, it automatically switches to the direct collector, continuing from the data already computed.

This approach provides faster performance when memory is available while maintaining safety for high-cardinality fields. It adapts dynamically to real memory conditions and avoids the overhead of restarting the aggregation when switching collectors.

To configure the hybrid collector, use the following cluster settings:
- `search.aggregations.cardinality.hybrid_collector.enabled` (Dynamic, Boolean): Enables the hybrid collector. When disabled, OpenSearch uses the traditional logic to select between ordinals and direct collectors. Default is `true`.
- `search.aggregations.cardinality.hybrid_collector.memory_threshold` (Dynamic, percentage or byte size): Sets the memory threshold for switching from ordinals to direct collectors. You can specify this setting as a percentage of JVM heap (for example, `1%`) or as an absolute value (for example, `10mb` or `1gb`). Default is `1%`.

## Missing values

You can assign a value to missing instances of the aggregated field. See [Missing aggregations]({{site.url}}{{site.baseurl}}/aggregations/bucket/missing/) for more information.

Replacing missing values in a cardinality aggregation adds the replacement value to the list of unique values, increasing the actual cardinality by one.
