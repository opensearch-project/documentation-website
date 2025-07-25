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


## (Expert level) Disable vector field storage in the source field

The `_source` field contains the original JSON document body that was passed at index time. This field is not indexed and is not searchable but is stored so that it can be returned when executing fetch requests such as `get` and `search`. When using vector fields within the source, you can remove the vector field to save disk space, as shown in the following example where the `location` vector is excluded:

```json
PUT /<index_name>/_mappings
{
    "_source": {
    "excludes": ["location"]
    },
    "properties": {
        "location": {
            "type": "knn_vector",
            "dimension": 2,
        "space_type": "l2"
        }
    }
}
```
{% include copy-curl.html %}

Disabling the `_source` field can cause certain features to become unavailable, such as the `update`, `update_by_query`, and `reindex` APIs and the ability to debug queries or aggregations by using the original document at index time.

In OpenSearch 2.15 or later, you can further improve indexing speed and reduce disk space by removing the vector field from the `_recovery_source`, as shown in the following example:

```json
PUT /<index_name>/_mappings
{
    "_source": {
    "excludes": ["location"],
    "recovery_source_excludes": ["location"]
    },
    "properties": {
        "location": {
            "type": "knn_vector",
            "dimension": 2,
        "space_type": "l2"
        }
    }
}
```
{% include copy-curl.html %}

This is an expert-level setting. Disabling the `_recovery_source` may lead to failures during peer-to-peer recovery. Before disabling the `_recovery_source`, check with your OpenSearch cluster admin to determine whether your cluster performs regular flushes before starting the peer-to-peer recovery of shards prior to disabling the `_recovery_source`.  
{: .warning}

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