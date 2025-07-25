---
layout: default
title: Index request cache
parent: Caching
grand_parent: Improving search performance
nav_order: 5
canonical_url: https://docs.opensearch.org/latest/search-plugins/caching/request-cache/
---

# Index request cache

The OpenSearch index request cache is a specialized caching mechanism designed to enhance search performance by storing the results of frequently executed search queries at the shard level. This reduces cluster load and improves response times for repeated searches. This cache is enabled by default and is particularly useful for read-heavy workloads where certain queries are executed frequently.

The cache is automatically invalidated at the configured refresh interval. The invalidation includes document updates (including document deletions) and changes to index settings. This ensures that stale results are never returned from the cache. When the cache size exceeds its configured limit, the least recently used entries are evicted to make room for new entries.

Search requests with `size=0` are cached in the request cache by default. Search requests with non-deterministic characteristics (such as `Math.random()`) or relative times (such as `now` or `new Date()`) are ineligible for caching.
{: .note}

## Configuring request caching

You can configure the index request cache by setting the parameters in the `opensearch.yml` configuration file or using the REST API. For more information, see [Index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/).

### Settings

The following table lists the index request cache settings. For more information about dynamic settings, see [Index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/).

Setting | Data type  | Default | Level | Static/Dynamic | Description
:--- |:-----------|:--------| :--- | :--- | :---
`indices.cache.cleanup_interval` | Time unit  | `1m` (1 minute)  | Cluster | Static | Schedules a recurring background task that cleans up expired entries from the cache at the specified interval. 
`indices.requests.cache.size` | Percentage | `1%`      | Cluster | Static | The cache size as a percentage of the heap size (for example, to use 1% of the heap, specify `1%`). 
`index.requests.cache.enable` | Boolean    | `true`    | Index | Dynamic | Enables or disables the request cache. 

### Example

To disable the request cache for an index, send the following request:

```json
PUT /my_index/_settings
{
  "index.requests.cache.enable": false
}
```
{% include copy-curl.html %}

## Caching specific requests

In addition to providing index-level or cluster-level settings for the request cache, you can also cache specific search requests selectively by setting the `request_cache` query parameter to `true`:

```json
GET /students/_search?request_cache=true
{
  "query": {
    "match": {
      "name": "doe john"
    }
  }
}
```
{% include copy-curl.html %}

## Monitoring the request cache

Monitoring cache usage and performance is crucial to maintaining an efficient caching strategy. OpenSearch provides several APIs to help monitor the cache.

### Retrieving cache statistics for all nodes

The [Nodes Stats API]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-stats/) returns cache statistics for all nodes in a cluster:

```json
GET /_nodes/stats/indices/request_cache
```
{% include copy-curl.html %}

The response contains the request cache statistics:

```json
{
  "nodes": {
    "T7aqO6zaQX-lt8XBWBYLsA": {
      "indices": {
        "request_cache": {
          "memory_size_in_bytes": 10240,
          "evictions": 0,
          "hit_count": 50,
          "miss_count": 10
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

### Retrieving cache statistics for a specific index

The [Index Stats API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/stats/) returns cache statistics for a specific index:

```json
GET /my_index/_stats/request_cache
```
{% include copy-curl.html %}

The response contains the request cache statistics:

```json
{
  "_shards": {
    "total": 5,
    "successful": 5,
    "failed": 0
  },
  "_all": {
    "primaries": {
      "request_cache": {
        "memory_size_in_bytes": 2048,
        "evictions": 1,
        "hit_count": 30,
        "miss_count": 5
      }
    },
    "total": {
      "request_cache": {
        "memory_size_in_bytes": 4096,
        "evictions": 2,
        "hit_count": 60,
        "miss_count": 10
      }
    }
  },
  "indices": {
    "my_index": {
      "primaries": {
        "request_cache": {
          "memory_size_in_bytes": 2048,
          "evictions": 1,
          "hit_count": 30,
          "miss_count": 5
        }
      },
      "total":{
        "request_cache": {
          "memory_size_in_bytes": 4096,
          "evictions": 2,
          "hit_count": 60,
          "miss_count": 10
        }
      }
    }
  }
}
```

## Best practices

When using the index request cache, consider the following best practices:

- **Appropriate cache size**: Configure the cache size based on your query patterns. A larger cache can store more results but may consume significant resources.
- **Query optimization**: Ensure that frequently executed queries are optimized so that they can benefit from caching.
- **Monitoring**: Regularly monitor cache hit and cache miss rates to understand cache efficiency and make necessary adjustments.