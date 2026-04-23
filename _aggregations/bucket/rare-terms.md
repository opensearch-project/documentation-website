---
layout: default
title: Rare terms
parent: Bucket aggregations
nav_order: 155
canonical_url: https://docs.opensearch.org/latest/aggregations/bucket/rare-terms/
---

# Rare terms aggregations

The `rare_terms` aggregation is a bucket aggregation that identifies infrequent terms in a dataset. In contrast to the `terms` aggregation, which finds the most common terms, the `rare_terms` aggregation finds terms that appear with the lowest frequency. The `rare_terms` aggregation is suitable for applications like anomaly detection, long-tail analysis, and exception reporting.

It is possible to use `terms` to search for infrequent values by ordering the returned values by ascending count (`"order": {"count": "asc"}`). However, we strongly discourage this practice because it can lead to inaccurate results when multiple shards are involved. A term that is globally infrequent might not appear as infrequent on every individual shard or might be entirely absent from the least frequent results returned by some shards. Conversely, a term that appears infrequently on one shard might be common on another. In both scenarios, rare terms can be missed during shard-level aggregation, resulting in incorrect overall results. Instead of the `terms` aggregation, we recommend using the `rare_terms` aggregation, which is specifically designed to handle these cases more accurately.
{: .warning}

## Approximated results

Computing exact results for the `rare_terms` aggregation necessitates compiling a complete map of the values on all shards, which requires excessive runtime memory. For this reason, the `rare_terms` aggregation results are approximated.

Most errors in `rare_terms` computations are _false negatives_ or "missed" values, which define the _sensitivity_ of the aggregation's detection test. The `rare_terms` aggregation uses a CuckooFilter algorithm to achieve a balance of appropriate sensitivity and acceptable memory use. For a description of the CuckooFilter algorithm, see [this paper](https://www.cs.cmu.edu/~dga/papers/cuckoo-conext2014.pdf).

## Controlling sensitivity

Sensitivity error in the `rare_terms` aggregation algorithm is measured as the fraction of rare values that are missed, or `false negatives/target values`. For example, if the aggregation misses 100 rare values in a dataset with 5,000 rare values, sensitivity error is `100/5000 = 0.02`, or 2%. 

You can adjust the `precision` parameter in `rare_terms` aggregations to control the trade-off between sensitivity and memory use.

These factors also affect the sensitivity-memory trade-off:

- The total number of unique values
- The fraction of rare items in the dataset

The following guidelines can help you decide which `precision` value to use.

### Calculating memory use

Runtime memory use is described in absolute terms, typically in MB of RAM.

Memory use increases linearly with the number of unique items. The linear scaling factor varies from roughly 1.0 to 2.5 MB per 1 million unique values, depending on the `precision` parameter. For the default `precision` of `0.001`, the memory cost is about 1.75 MB per 1 million unique values.

### Managing sensitivity error

Sensitivity error increases linearly with the total number of unique values. For information about estimating the number of unique values, see [Cardinality aggregation]({{site.url}}{{site.baseurl}}/aggregations/metric/cardinality/).

Sensitivity error rarely exceeds 2.5% at the default `precision`, even for datasets with 10--20 million unique values. For a `precision` of `0.00001`, sensitivity error is rarely above 0.6%. However, a very low absolute number of rare values can cause large variances in the error rate (if there are only two rare values, missing one of them results in a 50% error rate).


## Compatibility with other aggregations

The `rare_terms` aggregation uses breadth-first collection mode and is incompatible with aggregations that require depth-first collection mode in some subaggregations and nesting configurations. 

For more information about breadth-first search in OpenSearch, see [Collect mode]({{site.url}}{{site.baseurl}}/aggregations/bucket/terms#collect-mode).


## Parameters

The `rare_terms` aggregation takes the following parameters.

| Parameter             | Required/Optional | Data type       | Description |
| :--                   | :--               | :--             | :--         |
| `field`               | Required          | String          | The field to analyze for rare terms. Must be of a numeric type or a text type with a `keyword` mapping. |
| `max_doc_count`       | Optional          | Integer         | The maximum document count required in order for a term to be considered rare. Default is `1`. Maximum is `100`. |
| `precision`           | Optional          | Integer         | Controls the precision of the algorithm used to identify rare terms. Higher values provide more precise results but consume more memory. Default is `0.001`. Minimum (most precise allowable) is `0.00001`. |
| `include`             | Optional          | Array/regex     | Terms to include in the result. Can be a regular expression or an array of values. |
| `exclude`             | Optional          | Array/regex     | Terms to exclude from the result. Can be a regular expression or an array of values. |
| `missing`             | Optional          | String          | The value to use for documents that do not have a value for the field being aggregated. |


## Example

The following request returns all destination airport codes that appear only once in the OpenSearch Dashboards sample flight data:

```json
GET /opensearch_dashboards_sample_data_flights/_search
{
  "size": 0,
  "aggs": {
    "rare_destination": {
      "rare_terms": {
        "field": "DestAirportID",
        "max_doc_count": 1
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example response

The response shows that there are two airports that meet the criterion of appearing only once in the data:

```json
{
  "took": 12,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 10000,
      "relation": "gte"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "rare_destination": {
      "buckets": [
        {
          "key": "ADL",
          "doc_count": 1
        },
        {
          "key": "BUF",
          "doc_count": 1
        }
      ]
    }
  }
}
```


## Document count limit

Use the `max_doc_count` parameter to specify the largest document count that the `rare_terms` aggregation can return. There is no limit on the number of terms returned by `rare_terms`, so a large `max_doc_count` value can potentially return very large result sets. For this reason, `100` is the largest allowable `max_doc_count`.

The following request returns all destination airport codes that appear two times at most in the OpenSearch Dashboards sample flight data:

```json
GET /opensearch_dashboards_sample_data_flights/_search
{
  "size": 0,
  "aggs": {
    "rare_destination": {
      "rare_terms": {
        "field": "DestAirportID",
        "max_doc_count": 2
      }
    }
  }
}
```
{% include copy-curl.html %}

The response shows that seven destination airport codes meet the criterion of appearing in two or fewer documents, including the two from the previous example:

```json
{
  "took": 6,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 10000,
      "relation": "gte"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "rare_destination": {
      "buckets": [
        {
          "key": "ADL",
          "doc_count": 1
        },
        {
          "key": "BUF",
          "doc_count": 1
        },
        {
          "key": "ABQ",
          "doc_count": 2
        },
        {
          "key": "AUH",
          "doc_count": 2
        },
        {
          "key": "BIL",
          "doc_count": 2
        },
        {
          "key": "BWI",
          "doc_count": 2
        },
        {
          "key": "MAD",
          "doc_count": 2
        }
      ]
    }
  }
}
```


## Filtering (include and exclude)

Use the `include` and `exclude` parameters to filter values returned by the `rare_terms` aggregation. Both parameters can be included in the same aggregation. The `exclude` filter takes precedence; any excluded values are removed from the result, regardless of whether they were explicitly included.

The arguments to `include` and `exclude` can be regular expressions (regex), including string literals, or arrays. Mixing regex and array arguments results in an error. For example, the following combination is not allowed:

```json
"rare_terms": {
  "field": "DestAirportID",
  "max_doc_count": 2,
  "exclude": ["ABQ", "AUH"],
  "include": "A.*"
}
```


### Example: Filtering

The following example modifies the previous example to include all airport codes beginning with "A" but exclude the "ABQ" airport code:

```json
GET /opensearch_dashboards_sample_data_flights/_search
{
  "size": 0,
  "aggs": {
    "rare_destination": {
      "rare_terms": {
        "field": "DestAirportID",
        "max_doc_count": 2,
        "include": "A.*",
        "exclude": "ABQ"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response shows the two airport codes that meet the filtering requirements:

```json
{
  "took": 4,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 10000,
      "relation": "gte"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "rare_destination": {
      "buckets": [
        {
          "key": "ADL",
          "doc_count": 1
        },
        {
          "key": "AUH",
          "doc_count": 2
        }
      ]
    }
  }
}
```


### Example: Filtering with array input

The following example returns all destination airport codes that appear two times at most in the OpenSearch Dashboards sample flight data but specifies an array of airport codes to exclude:

```json
GET /opensearch_dashboards_sample_data_flights/_search
{
  "size": 0,
  "aggs": {
    "rare_destination": {
      "rare_terms": {
        "field": "DestAirportID",
        "max_doc_count": 2,
        "exclude": ["ABQ", "BIL", "MAD"]
      }
    }
  }
}
```
{% include copy-curl.html %}

The response omits the excluded airport codes:

```json
{
  "took": 6,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 10000,
      "relation": "gte"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "rare_destination": {
      "buckets": [
        {
          "key": "ADL",
          "doc_count": 1
        },
        {
          "key": "BUF",
          "doc_count": 1
        },
        {
          "key": "AUH",
          "doc_count": 2
        },
        {
          "key": "BWI",
          "doc_count": 2
        }
      ]
    }
  }
}
```