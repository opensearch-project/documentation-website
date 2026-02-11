---
layout: default
title: Indexing performance tuning
nav_order: 10
parent: Performance tuning
canonical_url: https://docs.opensearch.org/latest/vector-search/performance-tuning-indexing/
---

# Indexing performance tuning

Take any of the following steps to improve indexing performance, especially when you plan to index a large number of vectors at once.

## Disable the refresh interval

Either disable the refresh interval (default = 1 sec) or set a long duration for the refresh interval to avoid creating multiple small segments:

```json
PUT /<index_name>/_settings
{
    "index" : {
        "refresh_interval" : "-1"
    }
}
```
{% include copy-curl.html %}

Make sure to reenable `refresh_interval` after indexing is complete.

## Disable replicas (no OpenSearch replica shard)

   Set replicas to `0` to prevent duplicate construction of native library indexes in both primary and replica shards. When you enable replicas after indexing completes, the serialized native library indexes are copied directly. If you have no replicas, losing nodes might cause data loss, so it's important that the data be stored elsewhere so that this initial load can be retried in the event of an issue.

## Increase the number of indexing threads

If your hardware has multiple cores, you can allow multiple threads in native library index construction by speeding up the indexing process. Determine the number of threads to allot with the [knn.algo_param.index_thread_qty]({{site.url}}{{site.baseurl}}/search-plugins/knn/settings#cluster-settings) setting.

Monitor CPU utilization and choose the correct number of threads. Because native library index construction is costly, choosing more threads than you need can cause additional CPU load.


## Use the derived vector source feature to reduce storage requirements

Starting with OpenSearch 3.0, you can use the derived vector source feature to significantly reduce storage requirements for vector fields. It is an [index setting]({{site.url}}{{site.baseurl}}/vector-search/settings/#index-settings) that is enabled by default. This feature prevents vectors from being stored in the `_source` field while still maintaining all functionality, including the ability to use the `update`, `update_by_query`, and `reindex` APIs.

## (Expert level) Build vector data structures on demand

This approach is recommended only for workloads that involve a single initial bulk upload and will be used exclusively for search after force merging to a single segment.

During indexing, vector search builds a specialized data structure for a `knn_vector` field to enable efficient approximate k-nearest neighbors (k-NN) search. However, these structures are rebuilt during [force merge]({{site.url}}{{site.baseurl}}/api-reference/index-apis/force-merge/) on vector indexes. To optimize indexing speed, follow these steps:

1. **Disable vector data structure creation**: Disable vector data structure creation for new segments by setting [`index.knn.advanced.approximate_threshold`]({{site.url}}{{site.baseurl}}/vector-search/settings/#index-settings) to `-1`. 

    To specify the setting at index creation, send the following request:

    ```json
    PUT /test-index/
    {
      "settings": {
        "index.knn.advanced.approximate_threshold": "-1"
      }
    }
    ```
    {% include copy-curl.html %}

    To specify the setting after index creation, send the following request:

    ```json
    PUT /test-index/_settings
    {
      "index.knn.advanced.approximate_threshold": "-1"
    }
    ```
    {% include copy-curl.html %}

1. **Perform bulk indexing**: Index data in [bulk]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/) without performing any searches during ingestion:

    ```json
    POST _bulk
    { "index": { "_index": "test-index", "_id": "1" } }
    { "my_vector1": [1.5, 2.5], "price": 12.2 }
    { "index": { "_index": "test-index", "_id": "2" } }
    { "my_vector1": [2.5, 3.5], "price": 7.1 }
    ```
    {% include copy-curl.html %}

    If searches are performed while vector data structures are disabled, they will run using exact k-NN search.

1. **Reenable vector data structure creation**: Once indexing is complete, enable vector data structure creation by setting `index.knn.advanced.approximate_threshold` to `0`:

    ```json
    PUT /test-index/_settings
    {
      "index.knn.advanced.approximate_threshold": "0"
    }
    ```
    {% include copy-curl.html %}

    If you do not reset the setting to `0` before the force merge, you will need to reindex your data.
    {: .note}

1. **Force merge segments into one segment**: Perform a force merge and specify `max_num_segments=1` to create the vector data structures only once:

    ```json
    POST test-index/_forcemerge?max_num_segments=1
    ```
    {% include copy-curl.html %}

    After the force merge, new search requests will execute approximate k-NN search using the newly created data structures.