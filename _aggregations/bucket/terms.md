---
layout: default
title: Terms
parent: Bucket aggregations
nav_order: 200
redirect_from:
  - /query-dsl/aggregations/bucket/terms/
---

# Terms aggregations

The `terms` aggregation dynamically creates a bucket for each unique term of a field.

## Parameters

The `terms` aggregation takes the following parameters.

| Parameter | Required/Optional | Data type | Description |
| :--- | :--- | :--- | :--- |
| `field` | Optional | String | The field to aggregate on. Must be a `keyword`, `numeric`, `ip`, `boolean`, or `date` field. Either `field` or `script` is required. |
| `script` | Optional | Object | A script that generates values to aggregate on. Either `field` or `script` is required. When used with `field`, the script acts as a value script and receives the field value as `_value`. |
| `size` | Optional | Integer | The number of buckets to return. Default is `10`. |
| `shard_size` | Optional | Integer | The number of candidate terms collected from each shard. Higher values improve accuracy. Default is `size * 1.5 + 10`. |
| `min_doc_count` | Optional | Integer | The minimum document count for a bucket to be included in the response. Default is `1`. |
| `shard_min_doc_count` | Optional | Integer | The minimum document count on a shard level for a term to be a candidate. Default is `0`. |
| `show_term_doc_count_error` | Optional | Boolean | When `true`, includes a per-bucket error estimate. Default is `false`. |
| `order` | Optional | Object | Controls the sort order of buckets. Accepts `_count`, `_key`, or the name of a subaggregation metric, each with `asc` or `desc`. Default is `{"_count": "desc"}`. |
| `include` | Optional | String, Array, or Object | Filters which term values can create buckets. Accepts a regex string, an array of exact values, or a `partition` object. |
| `exclude` | Optional | String or Array | Filters which term values cannot create buckets. Accepts a regex string or an array of exact values. |
| `missing` | Optional | String or Number | The value to use for documents missing the target field, placing them in the corresponding bucket. By default, missing documents are ignored. |
| `execution_hint` | Optional | String | Controls how terms are collected. Valid values are `map` (holds values directly in memory) and `global_ordinals` (uses ordinal mappings, more memory efficient for high-cardinality fields). OpenSearch selects the best option automatically. |
| `collect_mode` | Optional | String | Controls how nested aggregations are computed. Valid values are:<br> - `depth_first`: Expands all branches before pruning. <br> - `breadth_first`: Prunes at each level before expanding, reducing memory for deeply nested aggregations. <br><br>Default is `depth_first`. |

## Example

The following example uses the `terms` aggregation to find the number of documents per response code in web log data:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "response_codes": {
      "terms": {
        "field": "response.keyword",
        "size": 10
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
  "response_codes" : {
    "doc_count_error_upper_bound" : 0,
    "sum_other_doc_count" : 0,
    "buckets" : [
      {
        "key" : "200",
        "doc_count" : 12832
      },
      {
        "key" : "404",
        "doc_count" : 801
      },
      {
        "key" : "503",
        "doc_count" : 441
      }
    ]
  }
 }
}
```

The values are returned with the key `key`.
`doc_count` specifies the number of documents in each bucket. By default, the buckets are sorted in descending order of `doc-count`.

It is possible to use `terms` to search for infrequent values by ordering the returned values by ascending count (`"order": {"count": "asc"}`). However, we strongly discourage this practice because it can lead to inaccurate results when multiple shards are involved. A term that is globally infrequent might not appear as infrequent on every individual shard or might be entirely absent from the least frequent results returned by some shards. Conversely, a term that appears infrequently on one shard might be common on another. In both scenarios, rare terms can be missed during shard-level aggregation, resulting in incorrect overall results. Instead of the `terms` aggregation, we recommend using the `rare_terms` aggregation, which is specifically designed to handle these cases more accurately.
{: .warning}


## The size and shard_size parameters

The number of buckets returned by the `terms` aggregation is controlled by the `size` parameter, which is 10 by default.

Additionally, the coordinating node responsible for the aggregation will prompt each shard for its top unique terms. The number of buckets returned by each shard is controlled by the `shard_size` parameter. This parameter is distinct from the `size` parameter and exists as a mechanism to increase the accuracy of the bucket document counts.

For example, imagine a scenario in which the `size` and `shard_size` parameters both have a value of 3. The `terms` aggregation prompts each shard for its top three unique terms. The coordinating node aggregates the results to compute the final result. If a shard contains an object that is not included in the top three, then it won't show up in the response. However, increasing the `shard_size` value for this request will allow each shard to return a larger number of unique terms, increasing the likelihood that the coordinating node will receive all relevant results.

By default, the `shard_size` parameter is set to `size * 1.5 + 10`.

When using concurrent segment search, the `shard_size` parameter is also applied to each segment slice. 

The `shard_size` parameter serves as a way to balance the performance and document count accuracy of the `terms` aggregation. Higher `shard_size` values will ensure higher document count accuracy but will result in higher memory and compute usage. Lower `shard_size` values will be more performant but will result in lower document count accuracy.

## Document count error

The response also includes two keys named `doc_count_error_upper_bound` and `sum_other_doc_count`.

The `terms` aggregation returns the top unique terms. Therefore, if the data contains many unique terms, then some of them might not appear in the results. The `sum_other_doc_count` field represents the sum of the documents that are excluded from the response. In this case, the number is 0 because all of the unique values appear in the response. 

The `doc_count_error_upper_bound` field represents the maximum possible count for a unique value that is excluded from the final results. Use this field to estimate the margin of error for the count. 

The `doc_count_error_upper_bound` value and the concept of accuracy are only applicable to aggregations using the default sort order---by document count, descending. This is because when you sort by descending document count, any terms that were not returned are guaranteed to include equal or fewer documents than those terms that were returned. Based on this, you can compute the `doc_count_error_upper_bound`.

If the `show_term_doc_count_error` parameter is set to `true`, then the `terms` aggregation will show the `doc_count_error_upper_bound` computed for each unique bucket in addition to the overall value.

## The `min_doc_count` and `shard_min_doc_count` parameters

You can use the `min_doc_count` parameter to filter out any unique terms with fewer than `min_doc_count` results. The `min_doc_count` threshold is applied only after merging the results retrieved from all of the shards. Each shard is unaware of the global document count for a given term. If there is a significant difference between the top `shard_size` globally frequent terms and the top terms local to a shard, you may receive unexpected results when using the `min_doc_count` parameter.

Separately, the `shard_min_doc_count` parameter is used to filter out the unique terms that a shard returns back to the coordinator with fewer than `shard_min_doc_count` results.

When using concurrent segment search, the `shard_min_doc_count` parameter is not applied to each segment slice. For more information, see the [related GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/11847).

## Filtering values to a subset

You can use the `include` and `exclude` parameters to filter the term values that appear in the aggregation buckets. When both parameters are specified, `include` is evaluated first and then `exclude` is applied to the result.

### Regular expression filtering

Both `include` and `exclude` parameters accept a regular expression string in Lucene's [regular expression syntax]({{site.url}}{{site.baseurl}}/query-dsl/regex-syntax/):

```json
GET /opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "success_codes": {
      "terms": {
        "field": "response.keyword",
        "include": "2.*",
        "exclude": "204"
      }
    }
  }
}
```
{% include copy-curl.html %}

By default, the maximum regex string length is 1000 characters. You can change this limit using the `index.max_regex_length` index setting. For more information, see [Index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/).

### Exact value filtering

Both `include` and `exclude` parameters accept arrays of exact values:

```json
GET /opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "specific_codes": {
      "terms": {
        "field": "response.keyword",
        "include": ["200", "404", "503"]
      }
    }
  }
}
```
{% include copy-curl.html %}

The `include` and `exclude` parameters must use the same format: either regex strings or arrays of exact values.

## Paginating through all terms

When a field contains too many unique terms to retrieve in a single request, you can use partition-based filtering to retrieve all terms by sending multiple requests. Terms are assigned to partitions using a hash function, so the distribution is approximately even. 

To retrieve all unique terms, send a number of requests equal to `num_partitions`. Specify `partition` and `num_partitions` in the `include` parameter. For each request, keep `num_partitions` the same and increment `partition` from `0` to `num_partitions - 1`:

```json
GET /opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "partitioned_terms": {
      "terms": {
        "field": "response.keyword",
        "size": 10000,
        "include": {
          "partition": 0,
          "num_partitions": 5
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The `include` parameter can use only one format per request: a regex string, an array of values, or a `partition` object. Thus, you cannot combine filtering (regex- or array-based) with partition-based retrieval. When using partition-based retrieval, the `exclude` parameter is not supported.
{: .note}


## Collect mode

There are two collect modes available: `depth_first` and `breadth_first`. The `depth_first` collection mode expands all branches of the aggregation tree in a depth-first manner and only performs pruning after the expansion is complete. 

However, when using nested `terms` aggregations, the cardinality of the number of buckets returned is multiplied by the cardinality of the field at each level of nesting, making it easy to see combinatorial explosion in the bucket count as you nest aggregations.

You can use the `breadth_first` collection mode to address this issue. In this case, pruning will be applied to the first level of the aggregation tree before it is expanded to the next level, potentially greatly reducing the number of buckets computed.

Additionally, there is memory overhead associated with performing `breadth_first` collection, which is linearly related to the number of matching documents. This is because `breadth_first` collection works by caching and replaying the pruned set of buckets from the parent level.


## Sort order

By default, buckets are sorted by `_count` descending (most documents first). You can change the sort order using the `order` parameter. The following example sorts response codes alphabetically:

```json
GET /opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "response_codes": {
      "terms": {
        "field": "response.keyword",
        "order": { "_key": "asc" }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response returns buckets sorted by key in ascending order:

```json
{
  ...
  "aggregations" : {
    "response_codes" : {
      "doc_count_error_upper_bound" : 0,
      "sum_other_doc_count" : 0,
      "buckets" : [
        {
          "key" : "200",
          "doc_count" : 12832
        },
        {
          "key" : "404",
          "doc_count" : 801
        },
        {
          "key" : "503",
          "doc_count" : 441
        }
      ]
    }
  }
}
```

You can also sort by a subaggregation metric. The following example sorts response codes by average bytes descending:

```json
GET /opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "response_codes": {
      "terms": {
        "field": "response.keyword",
        "order": { "avg_bytes": "desc" }
      },
      "aggs": {
        "avg_bytes": {
          "avg": { "field": "bytes" }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

To order by a metric nested deeper in the aggregation tree, use the `>` separator to specify the path. The following example sorts operating systems by average bytes of only their successful (200) responses:

```json
GET /opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "os": {
      "terms": {
        "field": "machine.os.keyword",
        "size": 3,
        "order": { "successful>avg_bytes": "desc" }
      },
      "aggs": {
        "successful": {
          "filter": { "term": { "response.keyword": "200" } },
          "aggs": {
            "avg_bytes": {
              "avg": { "field": "bytes" }
            }
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response sorts OS buckets by the nested `avg_bytes` metric:

```json
{
  ...
  "aggregations" : {
    "os" : {
      "doc_count_error_upper_bound" : 0,
      "sum_other_doc_count" : 5639,
      "buckets" : [
        {
          "key" : "win xp",
          "doc_count" : 2885,
          "successful" : {
            "doc_count" : 2549,
            "avg_bytes" : {
              "value" : 6083.602196939976
            }
          }
        },
        {
          "key" : "ios",
          "doc_count" : 2737,
          "successful" : {
            "doc_count" : 2512,
            "avg_bytes" : {
              "value" : 5954.860270700637
            }
          }
        },
        {
          "key" : "win 8",
          "doc_count" : 2813,
          "successful" : {
            "doc_count" : 2585,
            "avg_bytes" : {
              "value" : 5910.602321083172
            }
          }
        }
      ]
    }
  }
}
```

Pipeline aggregations cannot be used for sorting.
{: .note}

## Multi-field terms aggregation

The `terms` aggregation does not natively support multiple fields. To group by a combination of fields, use the [`multi_terms` aggregation]({{site.url}}{{site.baseurl}}/aggregations/bucket/multi-terms/) or a `script` that combines field values:

```json
GET /opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "os_and_response": {
      "terms": {
        "script": {
          "source": "doc['machine.os.keyword'].value + ' - ' + doc['response.keyword'].value"
        },
        "size": 5
      }
    }
  }
}
```
{% include copy-curl.html %}

For better performance, consider using a [`multi_terms` aggregation]({{site.url}}{{site.baseurl}}/aggregations/bucket/multi-terms/) or creating a combined field at index time using [`copy_to`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/text/#copy-to).

## Mixing field types across indexes

When the same field name has different numeric types across indexes (for example, `long` in one index and `double` in another), the `terms` aggregation promotes values to the broader type. Non-decimal values are cast to `double`, which can result in a loss of precision for values exceeding 2^53.
{: .warning}

## Missing values

The `missing` parameter assigns a value to documents that do not have the target field, placing them in the corresponding bucket. By default, documents without the field are excluded from the aggregation. The following example assigns `"unknown"` to any documents missing the `machine.os.keyword` field:

```json
GET /opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "os": {
      "terms": {
        "field": "machine.os.keyword",
        "missing": "unknown"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Script

You can use a `script` instead of a `field` to compute term values dynamically. The following example classifies log entries into size categories based on the `bytes` field:

```json
GET /opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "byte_ranges": {
      "terms": {
        "script": {
          "source": "if (doc['bytes'].value < 5000) return 'small'; if (doc['bytes'].value < 10000) return 'medium'; return 'large';"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response groups documents into computed categories:

```json
{
  ...
  "aggregations" : {
    "byte_ranges" : {
      "doc_count_error_upper_bound" : 0,
      "sum_other_doc_count" : 0,
      "buckets" : [
        {
          "key" : "medium",
          "doc_count" : 6995
        },
        {
          "key" : "small",
          "doc_count" : 6377
        },
        {
          "key" : "large",
          "doc_count" : 702
        }
      ]
    }
  }
}
```

### Value script

When both `field` and `script` are specified, the script acts as a value script and receives the field value as `_value`. The following example prefixes each response code with "HTTP ":

```json
GET /opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "responses_prefixed": {
      "terms": {
        "field": "response.keyword",
        "script": {
          "source": "'HTTP ' + _value"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response shows the transformed keys:

```json
{
  ...
  "aggregations" : {
    "responses_prefixed" : {
      "doc_count_error_upper_bound" : 0,
      "sum_other_doc_count" : 0,
      "buckets" : [
        {
          "key" : "HTTP 200",
          "doc_count" : 12832
        },
        {
          "key" : "HTTP 404",
          "doc_count" : 801
        },
        {
          "key" : "HTTP 503",
          "doc_count" : 441
        }
      ]
    }
  }
}
```

## Accounting for pre-aggregated data

While the `doc_count` field provides a representation of the number of individual documents aggregated in a bucket, `doc_count` by itself does not have a way to correctly increment documents that store pre-aggregated data. To account for pre-aggregated data and accurately calculate the number of documents in a bucket, you can use the `_doc_count` field to add the number of documents in a single summary field. When a document includes the `_doc_count` field, all bucket aggregations recognize its value and increase the bucket `doc_count` cumulatively. Keep these considerations in mind when using the `_doc_count` field:

* The field does not support nested arrays; only positive integers can be used.
* If a document does not contain the `_doc_count` field, aggregation uses the document to increase the count by 1.

OpenSearch features that rely on an accurate document count illustrate the importance of using the `_doc_count` field. To see how this field can be used to support other search tools, refer to [Index rollups]({{site.url}}{{site.baseurl}}/im-plugin/index-rollups/index/), an OpenSearch feature for the Index Management (IM) plugin that stores documents with pre-aggregated data in rollup indexes.
{: .tip}

#### Example request

```json
PUT /my_index/_doc/1
{
  "response_code": 404,
  "date":"2022-08-05",
  "_doc_count": 20
}

PUT /my_index/_doc/2
{
  "response_code": 404,
  "date":"2022-08-06",
  "_doc_count": 10
}

PUT /my_index/_doc/3
{
  "response_code": 200,
  "date":"2022-08-06",
  "_doc_count": 300
}

GET /my_index/_search
{
  "size": 0,
  "aggs": {
    "response_codes": {
      "terms": {
        "field" : "response_code"
      }
    }
  }
}
```

#### Example response

```json
{
  "took" : 20,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 3,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  },
  "aggregations" : {
    "response_codes" : {
      "doc_count_error_upper_bound" : 0,
      "sum_other_doc_count" : 0,
      "buckets" : [
        {
          "key" : 200,
          "doc_count" : 300
        },
        {
          "key" : 404,
          "doc_count" : 30
        }
      ]
    }
  }
}
```