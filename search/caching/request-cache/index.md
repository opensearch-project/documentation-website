---
layout: default
title: Indices Request Cache
parent: Improving search performance
has_children: true
nav_order: 100
---

# Indices Request Cache

The Indices Request Cache in OpenSearch is a specialized caching mechanism designed to enhance search performance by storing the results of frequently executed search queries at the shard level. This reduces the load on the cluster and improves response times for repeated searches. This cache is enabled by default and is particularly useful for read-heavy workloads where certain queries are executed frequently.

It is important to note the cache is automatically invalidated on refresh intervals with corresponding document updates (including document deletions) and changes to index settings, thereby ensuring stale results are never returned from the cache. When the cache size exceeds its configured limit, the least recently used entries are evicted to make room for new entries.

## Search Requests Eligible for Indices Request Cache
Search requests with `size=0` are by default cached in request cache. Search requests with non-deterministic characteristics such as `Math.random()`, relative times like `now`, `new Date()` are **ineligible** for caching.

You can also cache search requests selectively by setting the `request_cache` parameter to `true` in the request parameters. For example:
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

## Configuration
Configuring the Indices Request Cache involves setting parameters in the opensearch.yml configuration file or using the OpenSearch REST API.

### Configuration Parameters:

The following table lists the settings for configuring the Indices Request Cache, configure the following settings in `opensearch.yml`:

Setting | Data type  | Default | Description
:--- |:-----------|:--------| :---
`indices.requests.cache.size` | Percentage | 1%      | The size of the cache. Optional.
`index.requests.cache.enable` | Boolean    | true    | Enables or disables the request cache. Optional.
`indices.cache.cleanup_interval` | Time unit  | 1 min   | Schedule of the Recurring background task that cleans up expired entries from the cache. Optional.

#### Using REST API

To disable the request cache for an index:
```json
PUT /my_index/_settings
{
  "index.requests.cache.enable": false
}
```
{% include copy-curl.html %}

To update the cache size dynamically:
```json
PUT /_cluster/settings
{
  "persistent": {
    "indices.requests.cache.size": "1%"
  }
}
```
{% include copy-curl.html %}

### Monitoring and Management
Monitoring the cache usage and performance is crucial for maintaining an efficient caching strategy. OpenSearch provides several APIs to help monitor the cache.

#### Retrieving Cache Statistics for All Nodes:
`GET /_nodes/stats/indices/request_cache` returns cache statistics for all nodes in the cluster.

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

#### Retrieving Cache Statistics for a Specific Index:

`GET /my_index/_stats/request_cache` returns cache statistics for a specific index.
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

### Best Practices

- **Appropriate Cache Size**: Configure the cache size based on query patterns. A larger cache can store more results but may consume significant resources.
- **Query Optimization**: Ensure that frequently executed queries are optimized to benefit from caching.
- **Monitoring**: Regularly monitor cache hits and cache miss rates to understand cache efficiency and make necessary adjustments.