---
layout: default
title: Percentile
parent: Metric aggregations
nav_order: 90
redirect_from:
  - /query-dsl/aggregations/metric/percentile/
---

# Percentile aggregation

The `percentiles` aggregation estimates the value at a given percentile of a numeric field. This is useful for understanding distribution boundaries.

For example, a 95th percentile of `load_time` = `120ms` means that 95% of values are less than or equal to 120 ms.

Use the `percentiles` aggregation in the following scenarios:

- Finding outliers, such as the slowest 1% of requests.
- Determining whether data is skewed or has more than one peak by comparing several percentiles.
- Describing typical values more reliably than an average or maximum. For example, a single very slow request can raise the maximum load time far above what most users experience.

Similarly to the [`cardinality`]({{site.url}}{{site.baseurl}}/aggregations/metric/cardinality/) metric, the `percentiles` aggregation is approximate. For more information, see [Percentile accuracy](#percentile-accuracy).

## Parameters

The `percentiles` aggregation takes the following parameters.

| Parameter                                | Required/Optional | Data type        | Description                                                                                                                 |
| ---------------------------------------- | -------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `field`                                  | Required      | String           | The numeric field used to compute percentiles.                                                                                    |
| `percents`                               | Optional       | Array of doubles | The list of percentiles returned in the response. Each value must be between `0` and `100`, inclusive. Default is `[1, 5, 25, 50, 75, 95, 99]`.                                                 |
| `keyed`                                  | Optional       | Boolean          | If set to `false`, returns results as an array. Otherwise, returns results as a JSON object. Default is `true`. |
| `tdigest.compression`                    | Optional       | Double           | Controls accuracy and memory usage of the `tdigest` algorithm. Default is `100`. See [Precision tuning with `tdigest`](#precision-tuning-with-tdigest).                                      |
| `hdr.number_of_significant_value_digits` | Optional       | Integer          | The precision setting for the HDR histogram. Valid values are 0--5. Default is `3`. See [HDR histogram](#hdr-histogram).                                   |
| `missing`                                | Optional       | Number           | The default value used when the target field is missing in a document.                                                                              |
| `script`                                 | Optional       | Object           | The script used to compute custom values instead of using a field. Supports inline and stored scripts.                                |

You can specify either `tdigest` or `hdr` in a request, but not both.
{: .note}

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
POST /latency_data/_bulk?refresh
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

The response includes only the three requested percentiles:

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

## Keyed response

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

## Choosing an algorithm

OpenSearch provides two algorithms for calculating percentiles: `tdigest` (the default) and HDR histogram. The `tdigest` algorithm uses less memory, while HDR histogram is faster but uses more memory.

<!-- vale off -->

### Precision tuning with tdigest

<!-- vale on -->

The `tdigest` algorithm is the default method used to calculate percentiles. It provides a memory-efficient way to estimate percentiles, especially when working with floating-point data such as response times or latencies.

Unlike exact percentile calculations, `tdigest` uses a probabilistic approach that groups values into _centroids_---small clusters that summarize the distribution. This method enables accurate estimates for most percentiles without needing to store all the raw data in memory.

The algorithm is designed to be highly accurate near the tails of the distribution---the low percentiles (such as 1st) and high percentiles (such as 99th)---which are often the most important for performance analysis. You can control the precision of the results using the `compression` parameter.

A higher `compression` value means that more centroids are used, which increases accuracy (especially in the tails) but requires more memory and CPU. A lower `compression` value reduces memory usage and speeds up execution, but the results may be less accurate. The memory used by the digest grows with the `compression` value and does not depend on the number of values being aggregated.

Use `tdigest` when:

* Your data includes floating-point values, such as response times, latency, or duration.
* You need accurate results in the extreme percentiles, for example, the 1st or 99th.

Avoid `tdigest` when:

* Speed is more important than memory usage (consider using [`hdr`](#hdr-histogram) instead).

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
* Have sufficient memory available.

You should avoid HDR if your data contains negative values or if the range of values is unknown. For more information, see the note following this example.

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

Unlike `tdigest`, which returns exact values for this small dataset, HDR rounds each value to the configured precision:

```json
{
  ...
  "aggregations": {
    "load_time_percentiles": {
      "values": {
        "1.0": 20.0,
        "5.0": 20.0,
        "25.0": 40.015625,
        "50.0": 80.046875,
        "75.0": 120.046875,
        "95.0": 140.109375,
        "99.0": 140.109375
      }
    }
  }
}
```

The HDR histogram supports only non-negative values. Avoid HDR when the range of values is unknown, because a wide range can require a large amount of memory.
{: .note}

## Percentile accuracy

Calculating exact percentiles requires sorting all values, which uses memory in proportion to the size of the data. To calculate percentiles across large datasets, OpenSearch uses approximation algorithms. Keep the following considerations in mind:

- Accuracy is proportional to q(1 − q), where q is the requested percentile expressed as a fraction (for example, 0.99 for the 99th percentile). Thus, accuracy is highest for extreme percentiles, such as the 1st or 99th, and lowest for percentiles near the median.
- For small datasets, the results are exact or very close to exact. For example, the percentiles for the seven `load_time` values on this page are exact.
- As the number of values grows, the algorithm approximates the percentiles to limit memory usage. The size of the error depends on the distribution and volume of the data.
- For large datasets with a uniform distribution, the error tends to decrease as the number of values grows because the digest can summarize the distribution more evenly. Skewed distributions do not benefit in the same way.
- The results can differ slightly between requests on the same data.

The `tdigest` algorithm is described in the paper [Computing Extremely Accurate Quantiles Using t-Digests](https://arxiv.org/abs/1902.04023).

To balance accuracy and memory usage, use the `tdigest.compression` or `hdr.number_of_significant_value_digits` parameter.

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

To pass values to a script, use `params`. The following example adds an estimated network overhead of 15 milliseconds to each load time:

```json
GET /latency_data/_search
{
  "size": 0,
  "aggs": {
    "load_time_with_overhead": {
      "percentiles": {
        "script": {
          "lang": "painless",
          "source": "doc['load_time'].value + params.network_overhead_ms",
          "params": {
            "network_overhead_ms": 15
          }
        },
        "percents": [
          50,
          95
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}

Each percentile increases by 15 milliseconds:

```json
{
  ...
  "aggregations": {
    "load_time_with_overhead": {
      "values": {
        "50.0": 95.0,
        "95.0": 155.0
      }
    }
  }
}
```

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

## Missing values

By default, documents that do not contain the target field are ignored. Use the `missing` setting to configure a fallback value for these documents.

To try the `missing` setting, index a document that does not contain a `load_time` value:

```json
PUT /latency_data/_doc/health-check?refresh
{
  "endpoint": "/health"
}
```
{% include copy-curl.html %}

The following request counts documents without a `load_time` value as `0`:

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

The document without a `load_time` value is counted as `0`, so the 1st and 5th percentiles decrease from `20` to `0`:

```json
{
  ...
  "aggregations": {
    "load_time_percentiles": {
      "values": {
        "1.0": 0.0,
        "5.0": 0.0,
        "25.0": 40.0,
        "50.0": 80.0,
        "75.0": 120.0,
        "95.0": 140.0,
        "99.0": 140.0
      }
    }
  }
}
```

Scripts that read `doc['load_time'].value`, such as the ones in the [Script](#script) section, fail on documents without a `load_time` value. To handle these documents in a script, check `doc['load_time'].size() == 0` first.
{: .note}
