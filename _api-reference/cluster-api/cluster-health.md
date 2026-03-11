---
layout: default
title: Cluster health
nav_order: 40
parent: Cluster APIs
has_children: false
redirect_from: 
 - /api-reference/cluster-health/
 - /opensearch/rest-api/cluster-health/
---

# Cluster Health API
**Introduced 1.0**
{: .label .label-purple }

The cluster health API provides a quick overview of your cluster's operational status. OpenSearch expresses cluster health in three colors that represent the allocation state of shards:

- **Green**: All primary shards and their replicas are allocated to nodes. The cluster is fully operational.
- **Yellow**: All primary shards are allocated, but some replica shards are unassigned. The cluster is operational, but not fully redundant.
- **Red**: At least one primary shard is unassigned. Some data is unavailable, and search requests may return incomplete results.

The health status follows a hierarchy where `green` > `yellow` > `red`. If you request health for multiple indexes, the overall status is determined by the worst index status. Similarly, an index's status is determined by its worst shard status.

## When to use this API

Use the cluster health API in the following scenarios:

- **Monitoring cluster stability**: Check whether all shards are properly allocated before performing maintenance operations.
- **Troubleshooting availability issues**: Identify which indexes or shards are causing cluster health degradation.
- **Waiting for specific conditions**: Use wait parameters to hold operations until the cluster reaches a desired state, such as waiting for yellow status before running queries.
- **Automated health checks**: Integrate into monitoring systems to track cluster health metrics over time and trigger alerts when health degrades.
- **Validating replica allocation**: Confirm that replicas are properly distributed across nodes for data redundancy.


## Endpoints

<!-- spec_insert_start
api: cluster.health
component: endpoints
-->
```json
GET /_cluster/health
GET /_cluster/health/{index}
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: cluster.health
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `index` | List or String | A comma-separated list of data streams, indexes, and aliases used to limit the request. Supports wildcards (`*`). To target all data streams and indexes, omit this parameter or use `*` or `_all`. |

<!-- spec_insert_end -->

<!-- spec_insert_start
api: cluster.health
component: query_parameters
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| :--- | :--- | :--- | :--- |
| `awareness_attribute` | String | The name of the awareness attribute for which to return the cluster health status (for example, `zone`). Applicable only if `level` is set to `awareness_attributes`. | N/A |
| `cluster_manager_timeout` | String | The amount of time to wait for a response from the cluster manager node. For more information about supported time units, see [Common parameters]({{site.url}}{{site.baseurl}}/api-reference/common-parameters/#time-units). | N/A |
| `expand_wildcards` | List or String | Specifies the type of index that wildcard expressions can match. Supports comma-separated values. <br> Valid values are: <br> - `all`: Match any index, including hidden ones. <br> - `closed`: Match closed, non-hidden indexes. <br> - `hidden`: Match hidden indexes. Must be combined with `open`, `closed`, or both. <br> - `none`: Wildcard expressions are not accepted. <br> - `open`: Match open, non-hidden indexes. | `open` |
| `level` | String | Controls the amount of detail included in the cluster health response. <br> Valid values are: `awareness_attributes`, `cluster`, `indices`, and `shards`. | `cluster` |
| `local` | Boolean | Whether to return information from the local node only instead of from the cluster manager node. | `false` |
| `timeout` | String | The amount of time to wait for a response from the cluster manager node. For more information about supported time units, see [Common parameters]({{site.url}}{{site.baseurl}}/api-reference/common-parameters/#time-units). | N/A |
| `wait_for_active_shards` | Integer or String or NULL or String | Waits until the specified number of shards is active before returning a response. Use `all` for all shards. <br> Valid values are: <br> - `all`: Wait for all shards to be active. | `0` |
| `wait_for_events` | String | Waits until all currently queued events with the given priority are processed. <br> Valid values are: <br> - `immediate`: Highest priority, processed as soon as possible. <br> - `urgent`: Very high priority, processed after immediate events. <br> - `high`: High priority, processed after urgent events. <br> - `normal`: Default priority, processed after high priority events. <br> - `low`: Low priority, processed after normal events. <br> - `languid`: Lowest priority, processed after all other events. | N/A |
| `wait_for_no_initializing_shards` | Boolean | Whether to wait until there are no initializing shards in the cluster. | `false` |
| `wait_for_no_relocating_shards` | Boolean | Whether to wait until there are no relocating shards in the cluster. | `false` |
| `wait_for_nodes` | Integer or String | Waits until the specified number of nodes (`N`) is available. Accepts `>=N`, `<=N`, `>N`, and `<N`. You can also use `ge(N)`, `le(N)`, `gt(N)`, and `lt(N)` notation. | N/A |
| `wait_for_status` | String | Waits until the cluster health reaches the specified status or better. <br> Valid values are: `green`, `GREEN`, `yellow`, `YELLOW`, `red`, and `RED`. | N/A |
| `master_timeout` <br> _DEPRECATED_ | String | _(Deprecated since 2.0: To promote inclusive language, use `cluster_manager_timeout` instead.)_ A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts `0` without a unit and `-1` to indicate an unspecified value. | N/A |

<!-- spec_insert_end -->

## Example: Getting basic cluster health

The following request retrieves cluster health for all indexes in the cluster:

<!-- spec_insert_start
component: example_code
rest: GET /_cluster/health
-->
{% capture step1_rest %}
GET /_cluster/health
{% endcapture %}

{% capture step1_python %}

response = client.cluster.health()
{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

#### Example response

The response contains cluster health information:

```json
{
  "cluster_name" : "opensearch-cluster",
  "status" : "yellow",
  "timed_out" : false,
  "number_of_nodes" : 1,
  "number_of_data_nodes" : 1,
  "discovered_master" : true,
  "discovered_cluster_manager" : true,
  "active_primary_shards" : 138,
  "active_shards" : 138,
  "relocating_shards" : 0,
  "initializing_shards" : 0,
  "unassigned_shards" : 110,
  "delayed_unassigned_shards" : 0,
  "number_of_pending_tasks" : 0,
  "number_of_in_flight_fetch" : 0,
  "task_max_waiting_in_queue_millis" : 0,
  "active_shards_percent_as_number" : 55.64516129032258
}
```

The response shows a `yellow` status because this is a single-node cluster with replica shards that cannot be allocated. The `timed_out` field is `false`, indicating the response was returned within the default timeout period.

## Example: Waiting for a specific health status

The following request waits 50 seconds for the cluster to reach the yellow status or better:

<!-- spec_insert_start
component: example_code
rest: GET /_cluster/health?wait_for_status=yellow&timeout=50s
-->
{% capture step1_rest %}
GET /_cluster/health?wait_for_status=yellow&timeout=50s
{% endcapture %}

{% capture step1_python %}


response = client.cluster.health(
  params = { "wait_for_status": "yellow", "timeout": "50s" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

If the cluster health becomes yellow or green before 50 seconds elapse, the request returns a response immediately. If the timeout expires before reaching the desired status, the request returns with `timed_out: true` and the current status. This approach is useful for ensuring your cluster is in a healthy state before performing operations like reindexing or taking snapshots.

## Example: Getting health for a specific index

The following request retrieves cluster health information for a specific index:

<!-- spec_insert_start
component: example_code
rest: GET /_cluster/health/books
-->
{% capture step1_rest %}
GET /_cluster/health/books
{% endcapture %}

{% capture step1_python %}


response = client.cluster.health(
  index = "books"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

#### Example response

```json
{
  "cluster_name" : "opensearch-cluster",
  "status" : "yellow",
  "timed_out" : false,
  "number_of_nodes" : 1,
  "number_of_data_nodes" : 1,
  "discovered_master" : true,
  "discovered_cluster_manager" : true,
  "active_primary_shards" : 1,
  "active_shards" : 1,
  "relocating_shards" : 0,
  "initializing_shards" : 0,
  "unassigned_shards" : 1,
  "delayed_unassigned_shards" : 0,
  "number_of_pending_tasks" : 0,
  "number_of_in_flight_fetch" : 0,
  "task_max_waiting_in_queue_millis" : 0,
  "active_shards_percent_as_number" : 55.64516129032258
}
```

The response shows health metrics scoped to only the `books` index. The shard counts reflect only the shards belonging to this index.

## Example: Getting health at the indices level

The following request retrieves cluster health with per-index breakdown using the `level=indices` parameter:

<!-- spec_insert_start
component: example_code
rest: GET /_cluster/health/products-*?level=indices
-->
{% capture step1_rest %}
GET /_cluster/health/products-*?level=indices
{% endcapture %}

{% capture step1_python %}


response = client.cluster.health(
  index = "products-*",
  params = { "level": "indices" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

#### Example response

```json
{
  "cluster_name" : "opensearch-cluster",
  "status" : "yellow",
  "timed_out" : false,
  "number_of_nodes" : 1,
  "number_of_data_nodes" : 1,
  "discovered_master" : true,
  "discovered_cluster_manager" : true,
  "active_primary_shards" : 8,
  "active_shards" : 8,
  "relocating_shards" : 0,
  "initializing_shards" : 0,
  "unassigned_shards" : 8,
  "delayed_unassigned_shards" : 0,
  "number_of_pending_tasks" : 0,
  "number_of_in_flight_fetch" : 0,
  "task_max_waiting_in_queue_millis" : 0,
  "active_shards_percent_as_number" : 55.64516129032258,
  "indices" : {
    "products-2023" : {
      "status" : "yellow",
      "number_of_shards" : 1,
      "number_of_replicas" : 1,
      "active_primary_shards" : 1,
      "active_shards" : 1,
      "relocating_shards" : 0,
      "initializing_shards" : 0,
      "unassigned_shards" : 1
    },
    "products-2024" : {
      "status" : "yellow",
      "number_of_shards" : 1,
      "number_of_replicas" : 1,
      "active_primary_shards" : 1,
      "active_shards" : 1,
      "relocating_shards" : 0,
      "initializing_shards" : 0,
      "unassigned_shards" : 1
    }
  }
}
```

The response includes an `indices` object with health information for each matching index. This is useful for identifying which specific indexes are causing cluster health issues.

## Example: Getting health at the shards level

The following request retrieves cluster health with shard-level detail for a specific index:

<!-- spec_insert_start
component: example_code
rest: GET /_cluster/health/books?level=shards
-->
{% capture step1_rest %}
GET /_cluster/health/books?level=shards
{% endcapture %}

{% capture step1_python %}


response = client.cluster.health(
  index = "books",
  params = { "level": "shards" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

#### Example response

```json
{
  "cluster_name" : "opensearch-cluster",
  "status" : "yellow",
  "timed_out" : false,
  "number_of_nodes" : 1,
  "number_of_data_nodes" : 1,
  "discovered_master" : true,
  "discovered_cluster_manager" : true,
  "active_primary_shards" : 1,
  "active_shards" : 1,
  "relocating_shards" : 0,
  "initializing_shards" : 0,
  "unassigned_shards" : 1,
  "delayed_unassigned_shards" : 0,
  "number_of_pending_tasks" : 0,
  "number_of_in_flight_fetch" : 0,
  "task_max_waiting_in_queue_millis" : 0,
  "active_shards_percent_as_number" : 55.64516129032258,
  "indices" : {
    "books" : {
      "status" : "yellow",
      "number_of_shards" : 1,
      "number_of_replicas" : 1,
      "active_primary_shards" : 1,
      "active_shards" : 1,
      "relocating_shards" : 0,
      "initializing_shards" : 0,
      "unassigned_shards" : 1,
      "shards" : {
        "0" : {
          "status" : "yellow",
          "primary_active" : true,
          "active_shards" : 1,
          "relocating_shards" : 0,
          "initializing_shards" : 0,
          "unassigned_shards" : 1
        }
      }
    }
  }
}
```

The response includes a `shards` object showing the health status of each individual shard. This level of detail is most useful for troubleshooting specific shard allocation problems.

## Example: Getting health for multiple indexes

The following request retrieves cluster health for multiple specific indexes:

<!-- spec_insert_start
component: example_code
rest: GET /_cluster/health/books,movies
-->
{% capture step1_rest %}
GET /_cluster/health/books,movies
{% endcapture %}

{% capture step1_python %}


response = client.cluster.health(
  index = "books,movies"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

#### Example response

```json
{
  "cluster_name" : "opensearch-cluster",
  "status" : "yellow",
  "timed_out" : false,
  "number_of_nodes" : 1,
  "number_of_data_nodes" : 1,
  "discovered_master" : true,
  "discovered_cluster_manager" : true,
  "active_primary_shards" : 2,
  "active_shards" : 2,
  "relocating_shards" : 0,
  "initializing_shards" : 0,
  "unassigned_shards" : 2,
  "delayed_unassigned_shards" : 0,
  "number_of_pending_tasks" : 0,
  "number_of_in_flight_fetch" : 0,
  "task_max_waiting_in_queue_millis" : 0,
  "active_shards_percent_as_number" : 55.64516129032258
}
```

The aggregated health metrics cover only the specified indexes.

## Example: Using the local parameter

The following request retrieves cluster health information from the local node only, without querying the cluster manager:

<!-- spec_insert_start
component: example_code
rest: GET /_cluster/health?local=true
-->
{% capture step1_rest %}
GET /_cluster/health?local=true
{% endcapture %}

{% capture step1_python %}


response = client.cluster.health(
  params = { "local": "true" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

Using `local=true` can reduce the load on the cluster manager node when you need health information frequently for monitoring purposes. However, the information may be slightly out of date if the local node's view of the cluster is not fully synchronized.

## Response body fields

The following table lists all response fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `cluster_name` | String | The name of the cluster. |
| `status` | String | The overall cluster health status based on the state of shard allocation. <br> - `green`: All primary and replica shards are allocated. <br> - `yellow`: All primary shards are allocated, but some replicas are not. <br> - `red`: At least one primary shard is unassigned. <br><br> The overall status is determined by the worst shard status across all indexes. |
| `timed_out` | Boolean | Indicates whether the request exceeded the timeout period before the desired health status was reached. `false` means the response was returned within the timeout period. `true` means the timeout expired before the desired status was achieved. |
| `number_of_nodes` | Integer | The total number of nodes in the cluster, including all node types (data, cluster manager, ingest, and so on). |
| `number_of_data_nodes` | Integer | The number of nodes designated as data nodes in the cluster. Data nodes store shards and handle data-related operations. |
| `discovered_cluster_manager` | Boolean | Indicates whether the cluster manager node has been discovered and is reachable. If `false`, the cluster may be in an unstable state. |
| `discovered_master` | Boolean | Legacy field. Use `discovered_cluster_manager` instead. Retained for backward compatibility. |
| `active_primary_shards` | Integer | The number of primary shards that are currently allocated and active in the cluster. Each document is stored in exactly one primary shard. |
| `active_shards` | Integer | The total number of active shards, including both primary and replica shards. A higher number indicates better data redundancy. |
| `relocating_shards` | Integer | The number of shards currently being moved from one node to another. Shard relocation occurs during rebalancing or when nodes join or leave the cluster. |
| `initializing_shards` | Integer | The number of shards currently being initialized. This occurs when an index is first created or when a node rejoins the cluster and needs to recover shard data. |
| `unassigned_shards` | Integer | The number of shards that exist in the cluster state but are not allocated to any node. Unassigned shards typically occur when replicas cannot be allocated (in a single-node cluster) or when a node fails and shards need to be reallocated. |
| `delayed_unassigned_shards` | Integer | The number of unassigned shards whose allocation has been intentionally delayed. OpenSearch can delay allocation to avoid unnecessary shard movements when a node briefly disconnects and is expected to return. |
| `number_of_pending_tasks` | Integer | The number of cluster-level changes (such as index creation, mapping updates, or shard allocation decisions) that are queued and awaiting execution by the cluster manager. |
| `number_of_in_flight_fetch` | Integer | The number of ongoing shard-level fetch operations currently being executed across the cluster. |
| `task_max_waiting_in_queue_millis` | Integer | The time in milliseconds that the longest-waiting task has been in the queue. High values may indicate that the cluster manager is overloaded. |
| `active_shards_percent_as_number` | Double | The percentage of shards that are active out of the total number of shards (primary and replicas) that should exist. A value of 100.0 indicates all shards are allocated. |
| `indices` | Object | Returned when `level=indices` or `level=shards`. Contains per-index health information with the same structure as the cluster-level fields. |
| `shards` | Object | Returned when `level=shards`. Contains per-shard health information, nested within the `indices` object. |
| `awareness_attributes` | Object | Returned when `level=awareness_attributes`. Contains cluster health information partitioned by awareness attributes (such as zone or rack). |

## Example: Getting health by awareness attribute

To check cluster health by awareness attribute (for example, zone or rack), specify `awareness_attributes` in the `level` query parameter:

<!-- spec_insert_start
component: example_code
rest: GET /_cluster/health?level=awareness_attributes
-->
{% capture step1_rest %}
GET /_cluster/health?level=awareness_attributes
{% endcapture %}

{% capture step1_python %}


response = client.cluster.health(
  params = { "level": "awareness_attributes" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

The response contains cluster health metrics partitioned by awareness attribute:

```json
{
  "cluster_name": "runTask",
  "status": "green",
  "timed_out": false,
  "number_of_nodes": 3,
  "number_of_data_nodes": 3,
  "discovered_master": true,
  "discovered_cluster_manager": true,
  "active_primary_shards": 0,
  "active_shards": 0,
  "relocating_shards": 0,
  "initializing_shards": 0,
  "unassigned_shards": 0,
  "delayed_unassigned_shards": 0,
  "number_of_pending_tasks": 0,
  "number_of_in_flight_fetch": 0,
  "task_max_waiting_in_queue_millis": 0,
  "active_shards_percent_as_number": 100,
  "awareness_attributes": {
    "zone": {
      "zone-3": {
        "active_shards": 0,
        "initializing_shards": 0,
        "relocating_shards": 0,
        "unassigned_shards": 0,
        "data_nodes": 1,
        "weight": 1
      },
      "zone-1": {
        "active_shards": 0,
        "initializing_shards": 0,
        "relocating_shards": 0,
        "unassigned_shards": 0,
        "data_nodes": 1,
        "weight": 1
      },
      "zone-2": {
        "active_shards": 0,
        "initializing_shards": 0,
        "relocating_shards": 0,
        "unassigned_shards": 0,
        "data_nodes": 1,
        "weight": 1
      }
    },
    "rack": {
      "rack-3": {
        "active_shards": 0,
        "initializing_shards": 0,
        "relocating_shards": 0,
        "unassigned_shards": 0,
        "data_nodes": 1,
        "weight": 1
      },
      "rack-1": {
        "active_shards": 0,
        "initializing_shards": 0,
        "relocating_shards": 0,
        "unassigned_shards": 0,
        "data_nodes": 1,
        "weight": 1
      },
      "rack-2": {
        "active_shards": 0,
        "initializing_shards": 0,
        "relocating_shards": 0,
        "unassigned_shards": 0,
        "data_nodes": 1,
        "weight": 1
      }
    }
  }
}
```

If you're interested in a particular awareness attribute, you can include the name of the awareness attribute as a query parameter:

<!-- spec_insert_start
component: example_code
rest: GET /_cluster/health?level=awareness_attributes&awareness_attribute=zone
-->
{% capture step1_rest %}
GET /_cluster/health?level=awareness_attributes&awareness_attribute=zone
{% endcapture %}

{% capture step1_python %}


response = client.cluster.health(
  params = { "level": "awareness_attributes", "awareness_attribute": "zone" }
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

In response to the preceding request, OpenSearch returns cluster health information only for the `zone` awareness attribute.

The unassigned shard information will be accurate only if you [enable replica count enforcement]({{site.url}}{{site.baseurl}}/opensearch/cluster#replica-count-enforcement) and [configure forced awareness]({{site.url}}{{site.baseurl}}/opensearch/cluster#forced-awareness) for the awareness attribute either before cluster start or after cluster start but before any indexing requests. If you enable replica enforcement after the cluster receives indexing requests, the unassigned shard information may be inaccurate. If you don't configure replica count enforcement and forced awareness, the `unassigned_shards` field will contain -1.
{: .warning}

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions:
`cluster:monitor/health`.
