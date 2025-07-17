---
layout: default
title: Sum
parent: Metric aggregations
nav_order: 120
redirect_from:
  - /query-dsl/aggregations/metric/sum/
---

# Sum aggregations

The `sum` aggregation is a single-value metric aggregation that calculates the total sum of numeric values extracted from a field across all matching documents. This aggregation is commonly used to compute totals for metrics such as revenue, quantity, or duration.

## Parameters

The `sum` aggregation takes the following parameters.

| Parameter | Data type | Description                                                                                |
| --------- | --------- | ------------------------------------------------------------------------------------------ |
| `field`   | String    | The field to aggregate on. Must be a numeric field.                                            |
| `script`  | Object    | The script to calculate custom values for aggregation. Can be used instead of or with `field`. |
| `missing` | Number    | The default value used for documents missing the target field. |

## Example

The following example demonstrates how to calculate the total weight of deliveries recorded in a logistics index. 

Create an index:

```json
PUT /deliveries
{
  "mappings": {
    "properties": {
      "shipment_id": { "type": "keyword" },
      "weight_kg": { "type": "double" }
    }
  }
}
```
{% include copy-curl.html %}

Add sample documents:

```json
POST /deliveries/_bulk?refresh=true
{"index": {}}
{"shipment_id": "S001", "weight_kg": 12.5}
{"index": {}}
{"shipment_id": "S002", "weight_kg": 7.8}
{"index": {}}
{"shipment_id": "S003", "weight_kg": 15.0}
{"index": {}}
{"shipment_id": "S004", "weight_kg": 10.3}
```
{% include copy-curl.html %}


The following request computes the total weight across all documents in the `deliveries` index, omits document hits by setting `size` to `0`, and returns the total sum of `weight_kg`:

```json
GET /deliveries/_search
{
  "size": 0,
  "aggs": {
    "total_weight": {
      "sum": {
        "field": "weight_kg"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains value of `45.6` corresponding to the sum of `12.5` + `7.8` + `15.0` + `10.3`:

```json
{
  ...
  "hits": {
    "total": {
      "value": 4,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "total_weight": {
      "value": 45.6
    }
  }
}
```

### Using a script to compute values

Instead of specifying a field directly, you can provide a script to calculate values for the aggregation. This is useful when the value must be derived or adjusted.

In the following example, each weight is converted from kilograms to grams before summing using a script:

```json
GET /deliveries/_search
{
  "size": 0,
  "aggs": {
    "total_weight_grams": {
      "sum": {
        "script": {
          "source": "doc['weight_kg'].value * 1000"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response includes `total_weight_grams` of `45600`:

```json
{
  ...
  "hits": {
    "total": {
      "value": 4,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "total_weight_grams": {
      "value": 45600
    }
  }
}
```

### Combining a field with a value script

You can also specify both a `field` and a `script`, using the special variable `_value` to reference the field’s value. This is useful when applying transformations to existing field values.

The following example increases all weights by 10% before summing:

```json
GET /deliveries/_search
{
  "size": 0,
  "aggs": {
    "adjusted_weight": {
      "sum": {
        "field": "weight_kg",
        "script": {
          "source": "Math.round(_value * 110) / 100.0"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response reflects a 10% increase applied to the original total weight:

```json
{
  ...
  "hits": {
    "total": {
      "value": 4,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "adjusted_weight": {
      "value": 50.16
    }
  }
}
```

### Missing values

Documents missing the target field are ignored by default. To include them using a default value, use the `missing` parameter. 

The following example assigns a default value of `0` to missing `weight_kg` fields, this ensures that the documents without this field are treated as having `weight_kg` set as `0` and included in the aggregation.

```json
GET /deliveries/_search
{
  "size": 0,
  "aggs": {
    "total_weight_with_missing": {
      "sum": {
        "field": "weight_kg",
        "missing": 0
      }
    }
  }
}
```
{% include copy-curl.html %}
