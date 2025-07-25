---
layout: default
title: Terms
parent: Bucket aggregations
grand_parent: Aggregations
nav_order: 200
redirect_from:
  - /query-dsl/aggregations/bucket/terms/
canonical_url: https://docs.opensearch.org/latest/aggregations/bucket/terms/
---

# Terms aggregations

The `terms` aggregation dynamically creates a bucket for each unique term of a field.

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


## Size and shard size parameters

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

## Collect mode

There are two collect modes available: `depth_first` and `breadth_first`. The `depth_first` collection mode expands all branches of the aggregation tree in a depth-first manner and only performs pruning after the expansion is complete. 

However, when using nested `terms` aggregations, the cardinality of the number of buckets returned is multiplied by the cardinality of the field at each level of nesting, making it easy to see combinatorial explosion in the bucket count as you nest aggregations.

You can use the `breadth_first` collection mode to address this issue. In this case, pruning will be applied to the first level of the aggregation tree before it is expanded to the next level, potentially greatly reducing the number of buckets computed.

Additionally, there is memory overhead associated with performing `breadth_first` collection, which is linearly related to the number of matching documents. This is because `breadth_first` collection works by caching and replaying the pruned set of buckets from the parent level.


## Account for pre-aggregated data

While the `doc_count` field provides a representation of the number of individual documents aggregated in a bucket, `doc_count` by itself does not have a way to correctly increment documents that store pre-aggregated data. To account for pre-aggregated data and accurately calculate the number of documents in a bucket, you can use the `_doc_count` field to add the number of documents in a single summary field. When a document includes the `_doc_count` field, all bucket aggregations recognize its value and increase the bucket `doc_count` cumulatively. Keep these considerations in mind when using the `_doc_count` field:

* The field does not support nested arrays; only positive integers can be used.
* If a document does not contain the `_doc_count` field, aggregation uses the document to increase the count by 1.

OpenSearch features that rely on an accurate document count illustrate the importance of using the `_doc_count` field. To see how this field can be used to support other search tools, refer to [Index rollups](https://docs.opensearch.org/latest/im-plugin/index-rollups/index/), an OpenSearch feature for the Index Management (IM) plugin that stores documents with pre-aggregated data in rollup indexes.
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