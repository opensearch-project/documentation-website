---
layout: default
title: Rare terms
parent: Bucket aggregations
nav_order: 155
---

# Rare terms aggregations

The `rare_terms` aggregation is a bucket aggregation that identifies infrequent terms in a dataset. In contrast to the `terms` aggregation that finds the most common terms, the `rare_terms` aggregation finds terms that appear with the lowest frequency. The `rare_terms` aggregation is suitable for applications like anomaly detection, long-tail analysis, and exception reporting.

It is possible to use `terms` to search for infrequent values by ordering returned values by ascending count ( `"order": {"count": "asc")` ). We strongly discourage this practice since doing so can cause large unknown errors if multiple shards are involved. We recommend using `rare_terms` instead. 
{: .warning}

## Results are approximate

Computing exact results for the `rare_terms` aggregation would require compiling a complete map of the values on all shards, which would require excessive runtime memory. For this reason the `rare_terms` aggregation results are approximated.

Most errors in `rare_terms` computations are _false negatives_ or "missed" values, which define the _sensitivity_ of the aggregation's detection test. The `rare_terms` aggregation uses a CuckooFilter algorithm to achieve a balance of good sensitivity and acceptable memory use. For a description of the CuckooFilter algorithm, see [this paper](https://www.cs.cmu.edu/~dga/papers/cuckoo-conext2014.pdf).

## Controlling sensitivity

Error in the `rare_terms` aggregation algorithm is measured as the fraction of rare values that are missed, or (false negatives)/(target values). For example, if the aggregation misses 100 rare values in a dataset with 5000 rare values, the sensitivity error is (100/5000) = 0.02, or 2%. 

You can adjust the `precision` parameter in `rare_terms` aggregations to adjust the tradeoff between sensitivity and memory use.

These factors also affect the sensitivity-memory tradeoff:

- The total number of unique values
- The fraction of rare items in the dataset

The following guidelines can help you decide what value of `precision` to use.

### Calculating memory use

Runtime memory use is described in absolute terms, typically in Mb of RAM.

Memory use increases linearly with the number of unique items. The linear scaling factor varies from roughly 1.0 to 2.5 Mb per million unique values, depending on the `precision` parameter. For the default `precision` of `0.001`, the memory cost is about 1.75 Mb per million unique values.

### Managing error

Sensitivity error increases linearly with the total number of unique values. For information about estimating the number of unique values, see the [Cardinality]({{site.url}}{{site.baseurl}}/aggregations/metric/cardinality) aggregation.

Sensitivity error rarely exceeds 2.5% at the default `precision`, even for datasets with 10 - 20 million unique values. For a `precision` of `0.00001`, the sensitivity error is rarely above 0.6%. However, a very low absolute number of rare values can cause large variances in the error rate. (If there are only two rare values, missing one of them is a 50% error rate.)


## Compatibility with other aggregations

The `rare_terms` aggregation uses breadth-first collect mode, and is incompatible with aggregations that require depth-first collection mode in some sub-aggregation and nesting configurations. 

For more information about breadth-first search in OpenSearch, see [Collect mode]({{site.url}}{{site.baseurl}}/aggregations/bucket/terms#collect-mode).


## Parameters

The `rare_terms` aggregation takes the following parameters:

| Parameter             | Required/Optional | Data type       | Description |
| :--                   | :--               | :--             | :--         |
| `field`               | Required          | String          | The field to analyze for rare terms. Must be of type `text` with a `keyword` mapping, or `numeric`. |
| `max_doc_count`       | Optional          | Integer         | The maximum document count for a term to be considered rare. Default value is `1`. Maximum value is `100`. |
| `precision`           | Optional          | Integer         | Controls the precision of the algorithm used to identify rare terms. Higher values provide more precise results but consume more memory. Default is `0.001`. Minimum (most precise allowable) is `0.00001`. |
| `include`             | Optional          | Array/regex     | Terms to include in the result. Can be a regular expression or an array of values. |
| `exclude`             | Optional          | Array/regex     | Terms to exclude from the result. Can be a regular expression or an array of values. |
| `missing`             | Optional          | String          | The value to use for documents that do not have a value for the field being aggregated. |


## Example

The following example returns all destination airport codes that appear only once in the OpenSearch dashboard sample flight data:

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

## Example result

The result shows that there are two airports that meet the criterion of appearing only once in the data:

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

Use the `max_doc_count` parameter to specify the largest document count that the `rare_terms` aggregation can return. There is no limit on the number of terms returned by `rare_terms`, so a large value of of `max_doc_count` can potentially return very large result sets. For this reason, `100` is the largest allowable `max_doc_count`.


### Example: Document count limit

The following example returns all destination airport codes that appear two times at most in the OpenSearch dashboard sample flight data:

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

### Example result: Document count limit

The following result shows that seven destination airport codes meet the criterion of appearing in two or fewer documents, including the two from the previous example:

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

Use the `include` and `exclude` parameters to filter values returned by the `rare_terms` aggregation. Both `include` and `exclude` parameters can be included in the same aggregation. The `exclude` filter takes precedence; any excluded values are removed from the result regardless of whether they were explicitly included.

The arguments to `include` and `exclude` can be regular expressions (regex), including String literals, or arrays. Mixing regex and array arguments results in an error. For example, the following combination is not allowed:

```json
      "rare_terms": {
        "field": "DestAirportID",
        "max_doc_count": 2,
        "exclude": ["ABQ", "AUH"],
        "include": "A.*"
      }
```


### Example: Filtering

The following example modifies the previous example to include all airport codes beginning with "A" but excluding the "ABQ" airport code:


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


### Example result: Filtering

The following result shows the two airports that meet the filtering requirements:

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

The following example returns all destination airport codes that appear at most twice in the OpenSearch dashboard sample flight data, but specifies an array of airport codes to exclude:

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


### Example result: Filtering with array input

The results omit the excluded airport codes:

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