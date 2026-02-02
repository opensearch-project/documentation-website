---
layout: default
title: Percentile
parent: Metric aggregations
nav_order: 90
redirect_from:
  - /query-dsl/aggregations/metric/percentile/
---

# Percentile aggregations

The `percentiles` aggregation estimates the value at a given percentile of a numeric field. This is useful for understanding distribution boundaries.

For example, a 95th percentile of `load_time` = `120ms` means that 95% of values are less than or equal to 120 ms.

Similarly to the [`cardinality`]({{site.url}}{{site.baseurl}}/aggregations/metric/cardinality/) metric, the `percentile` metric is approximate.

## Parameters

The `percentiles` aggregation takes the following parameters.

| Parameter                                | Data type        | Required/Optional | Description                                                                                                                 |
| ---------------------------------------- | ---------------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| `field`                                  | String           | Required      | The numeric field used to compute percentiles.                                                                                    |
| `percents`                               | Array of doubles | Optional       | The list of percentiles returned in the response. Default is `[1, 5, 25, 50, 75, 95, 99]`.                                                 |
| `keyed`                                  | Boolean          | Optional       | If set to `false`, returns results as an array. Otherwise, returns results as a JSON object. Default is `true`. |
| `tdigest.compression`                    | Double           | Optional       | Controls accuracy and memory usage of the `tdigest` algorithm. See [Precision tuning with tdigest](#precision-tuning-with-tdigest).                                      |
| `hdr.number_of_significant_value_digits` | Integer          | Optional       | The precision setting for the HDR histogram. See [HDR histogram](#hdr-histogram).                                   |
| `missing`                                | Number           | Optional       | The default value used when the target field is missing in a document.                                                                              |
| `script`                                 | Object           | Optional       | The script used to compute custom values instead of using a field. Supports inline and stored scripts.                                |

## Example



First, create an index:

```json
PUT /latency_data
{
  "mappings": {
    "properties": {
      "load_time": {
        "type": "double"
      }
    }
  }
}
```
{% include copy-curl.html %}

Add sample numeric values to illustrate percentile calculations:

```json
POST /latency_data/_bulk
{ "index": {} }
{ "load_time": 20 }
{ "index": {} }
{ "load_time": 40 }
{ "index": {} }
{ "load_time": 60 }
{ "index": {} }
{ "load_time": 80 }
{ "index": {} }
{ "load_time": 100 }
{ "index": {} }
{ "load_time": 120 }
{ "index": {} }
{ "load_time": 140 }
```

{% include copy-curl.html %}

### Percentiles aggregation

The following example calculates the default set of percentiles for the `load_time` field:

```json
GET /latency_data/_search
{
  "size": 0,
  "aggs": {
    "load_time_percentiles": {
      "percentiles": {
        "field": "load_time"
      }
    }
  }
}
```
{% include copy-curl.html %}

By default, the 1st, 5th, 25th, 50th, 75th, 95th, and 99th percentiles are returned:

```json
{
  ...
  "aggregations": {
    "load_time_percentiles": {
      "values": {
        "1.0": 20,
        "5.0": 20,
        "25.0": 40,
        "50.0": 80,
        "75.0": 120,
        "95.0": 140,
        "99.0": 140
      }
    }
  }
}
```

## Custom percentiles

You can specify the exact percentiles using the `percents` array:

```json
GET /latency_data/_search
{
  "size": 0,
  "aggs": {
    "load_time_percentiles": {
      "percentiles": {
        "field": "load_time",
        "percents": [50, 90, 99]
      }
    }
  }
}
```
{% include copy-curl.html %}

The response includes only the three requested percentile aggregations:

```json
{
  ...
  "aggregations": {
    "load_time_percentiles": {
      "values": {
        "50.0": 80,
        "90.0": 140,
        "99.0": 140
      }
    }
  }
}
```

### Keyed response

You can change the format of the returned aggregation from a JSON object to a list of key-value pairs by setting the `keyed` parameter to `false`:

```json
GET /latency_data/_search
{
  "size": 0,
  "aggs": {
    "load_time_percentiles": {
      "percentiles": {
        "field": "load_time",
        "keyed": false
      }
    }
  }
}
```
{% include copy-curl.html %}

The response provides percentiles as an array of values:

```json
{
  ...
  "aggregations": {
    "load_time_percentiles": {
      "values": [
        {
          "key": 1,
          "value": 20
        },
        {
          "key": 5,
          "value": 20
        },
        {
          "key": 25,
          "value": 40
        },
        {
          "key": 50,
          "value": 80
        },
        {
          "key": 75,
          "value": 120
        },
        {
          "key": 95,
          "value": 140
        },
        {
          "key": 99,
          "value": 140
        }
      ]
    }
  }
}
```

### Precision tuning with tdigest

The `tdigest` algorithm is the default method used to calculate percentiles. It provides a memory-efficient way to estimate percentile ranks, especially when working with floating-point data such as response times or latencies.

Unlike exact percentile calculations, `tdigest` uses a probabilistic approach that groups values into _centroids_---small clusters that summarize the distribution. This method enables accurate estimates for most percentiles without needing to store all the raw data in memory.

The algorithm is designed to be highly accurate near the tails of the distribution---the low percentiles (such as 1st) and high percentiles (such as 99th)---which are often the most important for performance analysis. You can control the precision of the results using the `compression` parameter.

A higher `compression` value means that more centroids are used, which increases accuracy (especially in the tails) but requires more memory and CPU. A lower `compression` value reduces memory usage and speeds up execution, but the results may be less accurate.


Use `tdigest` when:

* Your data includes floating-point values, such as response times, latency, or duration.
* You need accurate results in the extreme percentiles, for example, the 1st or 99th.

Avoid `tdigest` when:

* You are working only with integer data and want maximum speed.
* You care less about accuracy in the distribution tails and prefer faster aggregation (consider using [`hdr`](#hdr-histogram) instead).

 The following example sets `tdigest.compression` to `200`:

```json
GET /latency_data/_search
{
  "size": 0,
  "aggs": {
    "load_time_percentiles": {
      "percentiles": {
        "field": "load_time",
        "tdigest": {
          "compression": 200
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

### HDR histogram

The High Dynamic Range (HDR) histogram is an alternative to [`tdigest`](#precision-tuning-with-tdigest) for calculating percentiles. It is especially useful when dealing with large datasets and latency measurements. It is designed for speed and supports a wide dynamic range of values while maintaining a fixed, configurable level of precision.

Unlike [`tdigest`](#precision-tuning-with-tdigest), which offers more accuracy in the tails of a distribution (extreme percentiles), HDR prioritizes speed and uniform accuracy across the range. It works best when the number of buckets is large and extreme precision in rare values is not required.

For example, if you're measuring response times ranging from 1 microsecond to 1 hour and configure HDR with 3 significant digits, it will record values with a precision of ±1 microsecond for values up to 1 millisecond and ±3.6 seconds for values near 1 hour.

This trade-off makes HDR much faster and more memory-intensive than [`tdigest`](#precision-tuning-with-tdigest).

The following table presents the breakdown of HDR significant digits.

| Significant digits | Relative precision (max error) |
| ------------------ | ------------------------------ |
| 1                  | 1 part in 10       = 10%       |
| 2                  | 1 part in 100      = 1%        |
| 3                  | 1 part in 1,000    = 0.1%      |
| 4                  | 1 part in 10,000   = 0.01%     |
| 5                  | 1 part in 100,000  = 0.001%    |

You should use HDR if you:

* Are aggregating across many buckets.
* Don't require extreme precision in the tail percentiles.
* Have sufficient memory available.

You should avoid HDR if:

* Tail accuracy is important.
* You are analyzing skewed or sparse data distributions.

The following example is configured with `hdr.number_of_significant_value_digits` set to `3`:

```json
GET /latency_data/_search
{
  "size": 0,
  "aggs": {
    "load_time_percentiles": {
      "percentiles": {
        "field": "load_time",
        "hdr": {
          "number_of_significant_value_digits": 3
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

### Missing values

Use the `missing` setting to configure a fallback value for documents that do not contain the target field:

```json
GET /latency_data/_search
{
  "size": 0,
  "aggs": {
    "load_time_percentiles": {
      "percentiles": {
        "field": "load_time",
        "missing": 0
      }
    }
  }
}
```
{% include copy-curl.html %}

## Script

Instead of specifying a field, you can dynamically compute the value using a script. This is useful when you need to apply transformations, such as converting currencies or applying weights. 

### Inline script

Use a script to compute derived values:

```json
GET /latency_data/_search
{
  "size": 0,
  "aggs": {
    "adjusted_percentiles": {
      "percentiles": {
        "script": {
          "source": "doc['load_time'].value * 1.2"
        },
        "percents": [50, 95]
      }
    }
  }
}
```
{% include copy-curl.html %}

### Stored script


First, create a sample script using the following request:

```json
POST _scripts/load_script
{
  "script": {
    "lang": "painless",
    "source": "doc[params.field].value * params.multiplier"
  }
}
```
{% include copy-curl.html %}
{% include copy-curl.html %}

Then use the stored script in the `percentiles` aggregation, providing the `params` required by the stored script:

```json
GET /latency_data/_search
{
  "size": 0,
  "aggs": {
    "adjusted_percentiles": {
      "percentiles": {
        "script": {
          "id": "load_script",
          "params": {
            "field": "load_time",
            "multiplier": 1.2
          }
        },
        "percents": [50, 95]
      }
    }
  }
}
```
{% include copy-curl.html %}
{% include copy-curl.html %}
