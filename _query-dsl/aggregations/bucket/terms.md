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

The response also includes two keys named `doc_count_error_upper_bound` and `sum_other_doc_count`.

The `terms` aggregation returns the top unique terms. So, if the data has many unique terms, then some of them might not appear in the results. The `sum_other_doc_count` field is the sum of the documents that are left out of the response. In this case, the number is 0 because all the unique values appear in the response.

The `doc_count_error_upper_bound` field represents the maximum possible count for a unique value that's left out of the final results. Use this field to estimate the error margin for the count.

The count might not be accurate. A coordinating node that’s responsible for the aggregation prompts each shard for its top unique terms. Imagine a scenario where the `size` parameter is 3.
The `terms` aggregation requests each shard for its top 3 unique terms. The coordinating node takes each of the results and aggregates them to compute the final result. If a shard has an object that’s not part of the top 3, then it won't show up in the response.

This is especially true if `size` is set to a low number. Because the default size is 10, an error is unlikely to happen. If you don’t need high accuracy and want to increase the performance, you can reduce the size.

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