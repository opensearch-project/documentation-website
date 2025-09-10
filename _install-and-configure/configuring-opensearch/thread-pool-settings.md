---
layout: default
title: Thread pool settings
parent: Configuring OpenSearch
nav_order: 90
---

# Thread pool settings

OpenSearch uses several thread pools to manage memory consumption and handle different types of operations efficiently. Thread pools can be configured to optimize performance based on your cluster's workload patterns.

To learn more about static and dynamic settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

## Node processor settings

OpenSearch automatically detects the number of available processors and configures thread pools accordingly. You can override this detection:

- `node.processors` (Static, integer): Explicitly sets the number of processors that OpenSearch should use for thread pool sizing calculations. This is useful when running multiple OpenSearch instances on the same host or when the automatic processor detection is incorrect. When set, thread pool sizes are calculated based on this value instead of the detected processor count. Default is the number of automatically detected processors.

## Thread pool types

OpenSearch supports the following thread pool types. Each type supports different parameters.

### Fixed thread pools

Fixed thread pools maintain a constant number of threads and use a queue for pending requests. 

OpenSearch supports the following fixed thread pools:

- `get`: For document retrieval operations (fixed type)
- `analyze`: For analyze API requests (fixed type)
- `write`: For indexing, deletion, update, and bulk operations (fixed type)
- `force_merge`: For force merge operations (fixed type)

Fixed thread pools support the following settings:

- `thread_pool.<pool_name>.size` (Static, integer): Sets the number of threads in the thread pool. The thread count remains constant regardless of workload.

- `thread_pool.<pool_name>.queue_size` (Static, integer): Controls the size of the queue for pending requests when all threads are busy. Set to `-1` for unbounded queues. When the queue is full, new requests are rejected. Default varies by thread pool type.

### Scaling thread pools

Scaling thread pools dynamically adjust the number of threads based on workload.

OpenSearch supports the following scaling thread pools:

- `generic`: For general background operations like node discovery (scaling type)
- `snapshot`: For snapshot and restore operations (scaling type)
- `warmer`: For index warming operations (scaling type)  
- `refresh`: For index refresh operations (scaling type)
- `flush`: For flush and fsync operations (scaling type)
- `management`: For cluster management operations (scaling type)
- `fetch_shard_started`: For shard state operations (scaling type)
- `fetch_shard_store`: For shard store operations (scaling type)

Scaling thread pools support the following settings:

- `thread_pool.<pool_name>.core` (Static, integer): Sets the minimum number of threads to keep in the pool, even when idle.

- `thread_pool.<pool_name>.max` (Static, integer): Sets the maximum number of threads that can be created in the pool.

- `thread_pool.<pool_name>.keep_alive` (Static, time unit): Determines how long idle threads are kept in the pool before being terminated. Threads above the core size are terminated after this period of inactivity.

## Example configurations

To configure a fixed thread pool, update the configuration file as follows:

```yaml
thread_pool:
  write:
    size: 30
    queue_size: 1000
```
{% include copy.html %}

To configure a scaling thread pool, update the configuration file as follows:

```yaml
thread_pool:
  warmer:
    core: 1
    max: 8
    keep_alive: 2m
```
{% include copy.html %}

To set a custom processor count, update the configuration file as follows:

```yaml
node.processors: 8
```
{% include copy.html %}

## Best practices

- Monitor thread pool usage: Use the [Nodes Stats API]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-stats/) to monitor thread pool metrics.
- Avoid over-provisioning: Setting thread pool sizes too high can lead to memory pressure and context switching overhead.
- Consider workload patterns: Adjust thread pool sizes based on your cluster's specific read/write patterns.
- Test configuration changes: Always test thread pool modifications in a non-production environment first.