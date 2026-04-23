---
layout: default
parent: Search options
title: Search shard routing
nav_order: 90
canonical_url: https://docs.opensearch.org/latest/search-plugins/searching-data/search-shard-routing/
---

# Search shard routing

To ensure redundancy and improve search performance, OpenSearch distributes index data across multiple primary shards, with each primary shard having one or more replica shards. When a search query is executed, OpenSearch routes the request to a node containing either a primary or replica index shard. This technique is known as _search shard routing_.


## Adaptive replica selection

In order to improve latency, search requests are routed using _adaptive replica selection_, which chooses the nodes based on the following factors:

- The amount of time it took a particular node to run previous requests.
- The latency between the coordinating node and the selected node.
- The queue size of the node's search thread pool.

If you have permissions to call the OpenSearch REST APIs, you can turn off search shard routing. For more information about REST API user access, see [REST management API settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/security-settings/#rest-management-api-settings). To disable search shard routing, update the cluster settings as follows:

```json
PUT /_cluster/settings
{
  "persistent": {
    "cluster.routing.use_adaptive_replica_selection": false
  }
}
```
{% include copy-curl.html %}

If you turn off search shard routing, OpenSearch will use round-robin routing, which can negatively impact search latency.
{: .note}

## Node and shard selection during searches

OpenSearch uses all nodes to choose the best routing for search requests. However, in some cases you may want to manually select the nodes or shards to which the search request is sent, including the following:

- Using cached previous searches.
- Dedicating specific hardware to searches.
- Using only local nodes for searches.

You can use the `preference` parameter in the search query to indicate the search destination. The following is a complete list of available options:

1. `_primary`: Forces the search to execute only on primary shards.

    ```json
    GET /my-index/_search?preference=_primary
    ```
    {% include copy-curl.html %}

2. `_primary_first`: Prefers primary shards but will use replica shards if the primary shards are not available.

    ```json
    GET /my-index/_search?preference=_primary_first
    ```
    {% include copy-curl.html %}

3. `_replica`: Forces the search to execute only on replica shards.

    ```json
    GET /my-index/_search?preference=_replica
    ```
    {% include copy-curl.html %}

4. `_replica_first`: Prefers replica shards but will use primary shards if no replica shards are available.

    ```json
    GET /my-index/_search?preference=_replica_first
    ```
    {% include copy-curl.html %}

5. `_only_nodes:<node-id>,<node-id>`: Limits the search to execute only on specific nodes according to their IDs.

    ```json
    GET /my-index/_search?preference=_only_nodes:node-1,node-2
    ```
    {% include copy-curl.html %}

6. `_prefer_nodes:<node-id>,<node-id>`: Prefers to execute the search on specific nodes but will use other nodes if the preferred nodes are not available.

    ```json
    GET /my-index/_search?preference=_prefer_nodes:node-1,node-2
    ```
    {% include copy-curl.html %}

7. `_shards:<shard-id>,<shard-id>`: Limits the search to specific shards.

    ```json
    GET /my-index/_search?preference=_shards:0,1
    ```
    {% include copy-curl.html %}

8. `_local`: Executes the search on the local node if possible, which can reduce latency.

    ```json
    GET /my-index/_search?preference=_local
    ```
    {% include copy-curl.html %}

9. Custom string: You can use any custom string as the preference value. This custom string ensures that requests containing the same string are routed to the same shards consistently, which can be useful for caching.

    ```json
    GET /my-index/_search?preference=custom_string
    ```
    {% include copy-curl.html %}

## Custom routing during index and search

You can specify routing during both indexing and search operations.

### Routing during indexing
When you index a document, OpenSearch calculates a hash of the routing value and uses this hash to determine the shard on which the document will be stored. If you don't specify a routing value, OpenSearch uses the document ID to calculate the hash.

The following is an example index operation with a routing value:

```json
POST /index1/_doc/1?routing=user1
{
  "name": "John Doe",
  "age": 20
}
```
{% include copy-curl.html %}

In this example, the document with ID `1` is indexed with the routing value `user1`. All documents with the same routing value will be stored on the same shard.

### Routing during searches

When you search for documents, specifying the same routing value ensures that the search request is routed to the appropriate shard. This can significantly improve performance by reducing the number of shards that need to be queried.

The following example request searches with a specific routing value:

```json
GET /index1/_search?routing=user1
{
  "query": {
    "match": {
      "name": "John Doe"
    }
  }
}
```
{% include copy-curl.html %}

In this example, the search query is routed to the shard containing documents indexed with the routing value `user1`.

Caution needs to be exercised when using custom routing in order to prevent hot spots and data skew:

 - A _hot spot_ occurs when a disproportionate number of documents are routed to a single shard. This can lead to that shard becoming a bottleneck because it will have to handle more read and write operations compared to other shards. Consequently, this shard may experience higher CPU, memory, and I/O usage, leading to performance degradation.

 - _Data skew_ refers to an uneven distribution of data across shards. If routing values are not evenly distributed, some shards may end up storing significantly more data than others. This can result in imbalanced storage usage, where certain nodes have a much higher disk utilization compared to others.

## Concurrent shard request

Hitting a large number of shards simultaneously during a search can significantly impact CPU and memory consumption. By default, OpenSearch does not reject these requests. However, there are a number of methods that you can use to mitigate this risk. The following sections describe these methods.

### Limit the number of shards that can be queried concurrently

You can use the `max_concurrent_shard_requests` parameter in the search request to limit the number of shards that can be queried concurrently. For example, the following request limits the number of concurrent shard requests to `12`:

```json
GET /index1/_search?max_concurrent_shard_requests=12
{
  "query": {
    "match_all": {}
  }
}
```
{% include copy-curl.html %}


### Define a search shard count limit

You can define the dynamic `action.search.shard_count.limit` setting either in your `opensearch.yml` file or by using the REST API. Any search request that exceeds this limit will be rejected and throw an error. This helps to prevent a single search request from consuming too many resources, which can degrade the performance of the entire cluster. The following example request updates this cluster setting using the API:

```json
PUT /_cluster/settings
{
  "transient": {
    "action.search.shard_count.limit": 1000
  }
}
```
{% include copy-curl.html %}

### Search thread pool

OpenSearch uses thread pools to manage the execution of various tasks, including search operations. The search thread pool is specifically used for search requests. You can adjust the size and queue capacity of the search thread pool by adding the following settings to `opensearch.yml`:
```
thread_pool.search.size: 100
thread_pool.search.queue_size: 1000
```
This setting is static. For more information about how to configure dynamic and static settings, see [Configuring OpenSearch]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/).

#### Thread pool states

The following three states describe thread pool operations:

 - _Thread Assignment_: If there are available threads in the search thread pool, then the request is immediately assigned to a thread and begins processing.

 - _Queueing_: If all threads in the search thread pool are busy, then the request is placed in the queue.

 - _Rejection_: If the queue is full (for example, the number of queued requests reaches the queue size limit), then additional incoming search requests are rejected until there is space available in the queue.

You can check the current configuration of the search thread pool by running the following request:

```json
GET /_cat/thread_pool/search?v&h=id,name,active,rejected,completed,size,queue_size
```
{% include copy-curl.html %}
