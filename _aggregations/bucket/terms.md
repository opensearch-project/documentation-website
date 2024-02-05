---
layout: default
title: Terms
parent: Bucket aggregations
grand_parent: Aggregations
nav_order: 200
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


## Size & Shard Size

The number of buckets returned by the `terms` aggregation is controlled by the `size` parameter, which is 10 by default.

Additionally, the coordinating node that’s responsible for the aggregation prompts each shard for its top unique terms. The number of buckets returned by each shard is controlled by the `shard_sized` parameter. This is distinct from the `size` parameter and exists as a mechanism to increase the accuracy of the bucket document counts.

For example, imagine a scenario where the `size` and `shard_size` parameters are both 3. The `terms` aggregation requests each shard for its top 3 unique terms. The coordinating node takes each of the results and aggregates them to compute the final result. If a shard has an object that’s not part of the top 3, then it won't show up in the response. However, increasing the `shard_size` value for this request would allow each shard to return a larger number of unique terms, increasing the likelihood that the coordinating node has the full picture of all results.

By default the `shard_size` parameter is set to `size * 1.5 + 10`.

When using concurrent segment search, the `shard_size` parameter is also applied to each segment slice. 

The `shard_size` parameter serves as a way to balance between performance and document count accuracy for terms aggregations. Higher `shard_size` values will ensure higher document count accuracy but with higher memory and compute usage, while lower `shard_size` values will be more performant but with lower document count accuracy.

## Document Count Error

The response also includes two keys named `doc_count_error_upper_bound` and `sum_other_doc_count`.

The `terms` aggregation returns the top unique terms. So, if the data has many unique terms, then some of them might not appear in the results. The `sum_other_doc_count` field is the sum of the documents that are left out of the response. In this case, the number is 0 because all the unique values appear in the response. 

The `doc_count_error_upper_bound` field represents the maximum possible count for a unique value that's left out of the final results. Use this field to estimate the error margin for the count. 

`doc_count_error_upper_bound` as well as the entire notion of accuracy is only applicable to aggregations using the default sort order -- by document count descending. This is because when we sort by descending document count we know that any terms that were not returned are guaranteed to have equal or fewer documents than those terms which were returned and from this we are able to compute the `doc_count_error_upper_bound`.

If the `show_term_doc_count_error` parameter is set to `true`, then the `terms` aggregation will show the `doc_count_error_upper_bound` computer for each unique bucket as well.

## `min_doc_count` and `shard_min_doc_count`

The `min_doc_count` parameter can be used to filter out any unique terms with less than `min_doc_count` results. The `min_doc_count` threshold is applied only after merging the results retrieved from all of the shards. Each shard does not know about the global document count for a given term, so means that you may get unexpected results when using the `min_doc_count` parameter if there is a big difference between the list of top `shard_size` globally frequent terms and shard-locally frequent terms.

Separately, the `shard_min_doc_count` parameter is used to filter out the unique terms a shard returns back to the coordinator with less than `shard_min_doc_count` results.

When using concurrent segment search, the `shard_min_doc_count` parameter is not applied to each segment slice.

## Collect mode

There are 2 collect modes available: `depth_first` and `breadth_first`. `depth_first` collection mode expands all branches of the aggregation tree in a depth-first manner and only does pruning after the expansion is done. 

However, when using nested terms aggregations, the cardinality of the number of buckets returned is multiplied by the cardinality of the field at each level of nesting, making it easy to see combinatorial explosion in the bucket count as we nest aggregations.

`breadth_first` collection mode can be used to address this issue, where pruning will be applied to the first level of the aggregation tree before expanding it into the next level, potentially greatly reducing the number of buckets computed.

There is memory overhead in doing breadth_first collect mode as well which is linearly related to the number of matching documents as `breadth_first` collection works by cacheing and replaying the pruned set of buckets from the parent level.


## Account for pre-aggregated data

While the `doc_count` field provides a representation of the number of individual documents aggregated in a bucket, `doc_count` by itself does not have a way to correctly increment documents that store pre-aggregated data. To account for pre-aggregated data and accurately calculate the number of documents in a bucket, you can use the `_doc_count` field to add the number of documents in a single summary field. When a document includes the `_doc_count` field, all bucket aggregations recognize its value and increase the bucket `doc_count` cumulatively. Keep these considerations in mind when using the `_doc_count` field:

* The field does not support nested arrays; only positive integers can be used.
* If a document does not contain the `_doc_count` field, aggregation uses the document to increase the count by 1.

OpenSearch features that rely on an accurate document count illustrate the importance of using the `_doc_count` field. To see how this field can be used to support other search tools, refer to [Index rollups](https://opensearch.org/docs/latest/im-plugin/index-rollups/index/), an OpenSearch feature for the Index Management (IM) plugin that stores documents with pre-aggregated data in rollup indexes.
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