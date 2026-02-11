---
layout: default
title: Percentile ranks
parent: Metric aggregations
nav_order: 80
redirect_from:
  - /query-dsl/aggregations/metric/percentile-ranks/
canonical_url: https://docs.opensearch.org/latest/aggregations/metric/percentile-ranks/
---

# Percentile rank aggregations

The `percentile_ranks` aggregation estimates the percentage of observed values that fall below or at given thresholds. This is useful for understanding the relative standing of a particular value within a distribution of values.

For example, you can use a percentile rank aggregation to learn how a transaction amount of `45` compares to other transaction values in a dataset. The percentile rank aggregation returns a value like `82.3`, which means 82.3% of transactions are less than or equal to `45`.

## Parameters

The `percentile_ranks` aggregation takes the following parameters.

| Parameter                                | Data type        | Required/Optional | Description                                                                                                                         |
| ---------------------------------------- | ---------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `field`                                  | String           | Required          | The numeric field used to compute percentile ranks.                                                                                   |
| `values`                                 | Array of doubles | Required          | The values used to calculate percentile ranks.                                                                                 |
| `keyed`                                  | Boolean          | Optional          | If set to `false`, returns results as an array. Otherwise returns results as a JSON object. Default is `true`.                      |
| `tdigest.compression`                    | Double           | Optional          | Controls accuracy and memory usage of the `tdigest` algorithm. See [Precision tuning with tdigest](#precision-tuning-with-tdigest). |
| `hdr.number_of_significant_value_digits` | Integer          | Optional          | The precision setting for the HDR histogram. See [HDR histogram](#hdr-histogram).                                                       |
| `missing`                                | Number           | Optional          | The default value used when the target field is missing in a document.                                                                |
| `script`                                 | Object           | Optional          | The script used to compute custom values instead of using a field. Supports inline and stored scripts.                                        |


## Example



First, create a sample index:

```json
PUT /transaction_data
{
  "mappings": {
    "properties": {
      "amount": {
        "type": "double"
      }
    }
  }
}
```
{% include copy-curl.html %}

Add sample numeric values to illustrate percentile rank calculations:

```json
POST /transaction_data/_bulk
{ "index": {} }
{ "amount": 10 }
{ "index": {} }
{ "amount": 20 }
{ "index": {} }
{ "amount": 30 }
{ "index": {} }
{ "amount": 40 }
{ "index": {} }
{ "amount": 50 }
{ "index": {} }
{ "amount": 60 }
{ "index": {} }
{ "amount": 70 }
```
{% include copy-curl.html %}


Run a `percentile_ranks` aggregation to calculate how certain values compare to the overall distribution:

```json
GET /transaction_data/_search
{
  "size": 0,
  "aggs": {
    "rank_check": {
      "percentile_ranks": {
        "field": "amount",
        "values": [25, 55]
      }
    }
  }
}
```
{% include copy-curl.html %}

The response demonstrates that 28.6% of the values are less than or equal to `25` and 71.4% are less than or equal to `55`:

```json
{
  ...
  "hits": {
    "total": {
      "value": 7,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "rank_check": {
      "values": {
        "25.0": 28.57142857142857,
        "55.0": 71.42857142857143
      }
    }
  }
}
```

## Keyed response

You can change the format of the returned aggregation from a JSON object to a list of key-value pairs by setting the `keyed` parameter to `false`:

```json
GET /transaction_data/_search
{
  "size": 0,
  "aggs": {
    "rank_check": {
      "percentile_ranks": {
        "field": "amount",
        "values": [25, 55],
        "keyed": false
      }
    }
  }
}
```
{% include copy-curl.html %}

The response includes an array instead of an object:

```json
{
  ...
  "hits": {
    "total": {
      "value": 7,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "rank_check": {
      "values": [
        {
          "key": 25,
          "value": 28.57142857142857
        },
        {
          "key": 55,
          "value": 71.42857142857143
        }
      ]
    }
  }
}
```

## Precision tuning with tdigest

By default, percentile ranks are calculated using the `tdigest` algorithm. You can control the trade-off between accuracy and memory usage by specifying the `tdigest.compression` parameter. Higher values provide better accuracy but require more memory. For more information about how tdigest works, see [Precision tuning with tdigest]({{site.url}}{{site.baseurl}}/aggregations/metric/percentile/#precision-tuning-with-tdigest).

The following example is configured with `tdigest.compression` set to `200`:

```json
GET /transaction_data/_search
{
  "size": 0,
  "aggs": {
    "rank_check": {
      "percentile_ranks": {
        "field": "amount",
        "values": [25, 55],
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

As an alternative to `tdigest`, you can use the High Dynamic Range (HDR) histogram algorithm, which is better suited for large numbers of buckets and fast processing. For more information about how the HDR histogram works, see [HDR histogram]({{site.url}}{{site.baseurl}}/aggregations/metric/percentile/#hdr-histogram).

You should use HDR if you:

* Are aggregating across many buckets.
* Don't require extreme precision in the tail percentiles.
* Have sufficient memory available.

You should avoid HDR if:

* Tail accuracy is important.
* You're analyzing skewed or sparse data distributions.

The following example is configured with `hdr.number_of_significant_value_digits` set to `3`:

```json
GET /transaction_data/_search
{
  "size": 0,
  "aggs": {
    "rank_check": {
      "percentile_ranks": {
        "field": "amount",
        "values": [25, 55],
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

If some documents are missing the target field, you can instruct the query to use a fallback value by setting the `missing` parameter. The following example ensures that documents without an `amount` field are treated as if their values are `0` and are included in the percentile ranks computation:

```json
GET /transaction_data/_search
{
  "size": 0,
  "aggs": {
    "rank_check": {
      "percentile_ranks": {
        "field": "amount",
        "values": [25, 55],
        "missing": 0
      }
    }
  }
}
```
{% include copy-curl.html %}

### Script

Instead of specifying a field, you can dynamically compute the value using a script. This is useful when you need to apply transformations, such as converting currencies or applying weights. 

#### Inline script

The following example uses an inline script to calculate the percentile ranks of the transformed values `30` and `60` against values from the `amount` field, increased by 10%:

```json
GET /transaction_data/_search
{
  "size": 0,
  "aggs": {
    "rank_check": {
      "percentile_ranks": {
        "values": [30, 60],
        "script": {
          "source": "doc['amount'].value * 1.1"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Stored script


To use a stored script, first create it using the following request:

```json
POST _scripts/percentile_script
{
  "script": {
    "lang": "painless",
    "source": "doc[params.field].value * params.multiplier"
  }
}
```
{% include copy-curl.html %}

Then use the stored script in the `percentile_ranks` aggregation:

```json
GET /transaction_data/_search
{
  "size": 0,
  "aggs": {
    "rank_check": {
      "percentile_ranks": {
        "values": [30, 60],
        "script": {
          "id": "percentile_script",
          "params": {
            "field": "amount",
            "multiplier": 1.1
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}
