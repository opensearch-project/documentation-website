---
layout: default
title: Minimum
parent: Metric aggregations
nav_order: 70
redirect_from:
  - /query-dsl/aggregations/metric/minimum/
canonical_url: https://docs.opensearch.org/docs/latest/aggregations/metric/minimum/
---

# Minimum aggregations

The `min` metric is a single-value metric that returns the minimum value of a field.

The `min` aggregation compares numeric fields using a `double` (double-precision) representation. Results should be considered approximate for fields containing `long` or `unsigned_long` integers with absolute values greater than 2<sup>53</sup> because the number of significant bits in a `double` mantissa is 53.
{: .note}

## Parameters

The `min` aggregation takes the following parameters.

| Parameter | Required/Optional | Data type      | Description |
| :--       | :--               | :--            | :--         |
| `field`   | Required          | String         | The name of the field for which the minimum is computed.    |
| `missing` | Optional          | Numeric        | The value to assign to missing instances of the field. If not provided, documents containing missing values are omitted from the aggregation. |

## Example

This following example request finds the least expensive item---the item with the minimum value of the `base_unit_price`---in the OpenSearch Dashboards e-commerce sample data:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "min_base_unit_price": {
      "min": {
        "field": "products.base_unit_price"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example response

As shown in the following example response, the aggregation returns the minimum value of `products.base_unit_price`:

```json
{
  "took": 15,
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
    "min_base_unit_price": {
      "value": 5.98828125
    }
  }
}
```

You can use the aggregation name (`min_base_unit_price`) as a key to retrieve the aggregation from the response.

## Missing values

You can assign a value to missing instances of the aggregated field. See [Missing aggregations]({{site.url}}{{site.baseurl}}/aggregations/bucket/missing/) for more information.

Missing values are normally ignored by `min`. If you use `missing` to assign a value lower than any existing value, `min` returns this replacement value as the minimum value.
