---
layout: default
title: Stats
parent: Metric aggregations
nav_order: 110
redirect_from:
  - /query-dsl/aggregations/metric/stats/
---

# Stats aggregations

The `stats` aggregation is a multi-value metric aggregation that computes a summary of numeric data. This aggregation is useful for quickly understanding the distribution of numeric fields. It can operate directly on a field, apply a script to derive the values, or handle documents with missing fields. The `stats` aggregation returns five values:

* `count`: The number of values collected
* `min`: The lowest value
* `max`: The highest value
* `sum`: The total of all values
* `avg`: The average of the values (sum divided by count)

## Parameters

The `stats` aggregation takes the following optional parameters.

| Parameter | Data type | Description                                                                                |
| --------- | --------- | ------------------------------------------------------------------------------------------ |
| `field`   | String    | The field to aggregate on. Must be a numeric field.                                            |
| `script`  | Object    | The script used to calculate custom values for aggregation. Can be used instead of or with `field`. |
| `missing` | Number    | The default value used for documents missing the target field. 

## Example

The following example computes a `stats` aggregation for electricity usage.

Create an index named `power_usage` and add documents containing the number of kilowatt-hours (kWh) consumed during a given hour:

```json
PUT /power_usage/_bulk?refresh=true
{"index": {}}
{"device_id": "A1", "kwh": 1.2}
{"index": {}}
{"device_id": "A2", "kwh": 0.7}
{"index": {}}
{"device_id": "A3", "kwh": 1.5}
```
{% include copy-curl.html %}

To compute statistics on the `kwh` field across all documents, use a `stats` aggregation named `consumption_stats` over the `kwh` field. Setting `size` to `0` specifies that document hits should not be returned:

```json
GET /power_usage/_search
{
  "size": 0,
  "aggs": {
    "consumption_stats": {
      "stats": {
        "field": "kwh"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response includes `count`, `min`, `max`, `avg`, and `sum` values for the three documents in the index:

```json
{
  ...
  "hits": {
    "total": {
      "value": 3,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "consumption_stats": {
      "count": 3,
      "min": 0.699999988079071,
      "max": 1.5,
      "avg": 1.1333333452542622,
      "sum": 3.400000035762787
    }
  }
}
```

### Running a stats aggregation per bucket

You can compute separate statistics for each device by nesting a `stats` aggregation inside a `terms` aggregation in the `device_id` field. The `terms` aggregation groups documents into buckets based on unique `device_id` values, and the `stats` aggregation computes summary statistics within each bucket:

```json
GET /power_usage/_search
{
  "size": 0,
  "aggs": {
    "per_device": {
      "terms": {
        "field": "device_id.keyword"
      },
      "aggs": {
        "device_usage_stats": {
          "stats": {
            "field": "kwh"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response returns one bucket per `device_id`, with computed `count`, `min`, `max`, `avg`, and `sum` fields within each bucket:

```json
{
  ...
  "hits": {
    "total": {
      "value": 3,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "per_device": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "A1",
          "doc_count": 1,
          "device_usage_stats": {
            "count": 1,
            "min": 1.2000000476837158,
            "max": 1.2000000476837158,
            "avg": 1.2000000476837158,
            "sum": 1.2000000476837158
          }
        },
        {
          "key": "A2",
          "doc_count": 1,
          "device_usage_stats": {
            "count": 1,
            "min": 0.699999988079071,
            "max": 0.699999988079071,
            "avg": 0.699999988079071,
            "sum": 0.699999988079071
          }
        },
        {
          "key": "A3",
          "doc_count": 1,
          "device_usage_stats": {
            "count": 1,
            "min": 1.5,
            "max": 1.5,
            "avg": 1.5,
            "sum": 1.5
          }
        }
      ]
    }
  }
}
```

This allows you to compare usage statistics across devices with a single query.

### Using a script to compute derived values

You can also use a script to compute the values used in the `stats` aggregation. This is useful when the metric is derived from document fields or requires transformation.

For example, to convert kilowatt-hours (kWh) to watt-hours (Wh) before running the `stats` aggregation, since `1 kWh` equals `1,000 Wh`, you can use a script that multiplies each value by `1,000`. The following script `doc['kwh'].value * 1000` is used to derive the input value for each document.

```json
GET /power_usage/_search
{
  "size": 0,
  "aggs": {
    "usage_wh_stats": {
      "stats": {
        "script": {
          "source": "doc['kwh'].value * 1000"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The `stats` aggregation returned in the response reflects values of `1200`, `700`, and `1500` Wh:

```json
{
  ...
  "hits": {
    "total": {
      "value": 3,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "usage_wh_stats": {
      "count": 3,
      "min": 699.999988079071,
      "max": 1500,
      "avg": 1133.3333452542622,
      "sum": 3400.000035762787
    }
  }
}
```

### Using a value script with a field

When combining a field with a transformation, you can specify both `field` and `script`. This allows using the `_value` variable to reference the field's value within the script.

The following example increases each energy reading by 5% before computing the `stats` aggregation:

```json
GET /power_usage/_search
{
  "size": 0,
  "aggs": {
    "adjusted_usage": {
      "stats": {
        "field": "kwh",
        "script": {
          "source": "_value * 1.05"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

### Missing values

If some documents do not contain the target field, they are excluded by default from the aggregation. To include them using a default value, you can specify the `missing` parameter.

The following request treats missing `kwh` values as `0.0`:

```json
GET /power_usage/_search
{
  "size": 0,
  "aggs": {
    "consumption_with_default": {
      "stats": {
        "field": "kwh",
        "missing": 0.0
      }
    }
  }
}
```
{% include copy-curl.html %}
