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

# Cluster health
**Introduced 1.0**
{: .label .label-purple }

The most basic cluster health request returns a simple status of the health of your cluster. OpenSearch expresses cluster health in three colors: green, yellow, and red. A green status means all primary shards and their replicas are allocated to nodes. A yellow status means all primary shards are allocated to nodes, but some replicas aren't. A red status means at least one primary shard is not allocated to any node.

To get the status of a specific index, provide the index name.

<!-- spec_insert_start
api: cluster.health
component: endpoints
-->
## Endpoints
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
| `cluster_manager_timeout` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts "0" without a unit and "-1" to indicate an unspecified value. | N/A |
| `expand_wildcards` | List or String | Specifies the type of index that wildcard expressions can match. Supports comma-separated values. <br> Valid values are: <br> - `all`: Match any index, including hidden ones. <br> - `closed`: Match closed, non-hidden indexes. <br> - `hidden`: Match hidden indexes. Must be combined with open, closed, or both. <br> - `none`: Wildcard expressions are not accepted. <br> - `open`: Match open, non-hidden indexes. | N/A |
| `level` | String |  <br> Valid values are: `awareness_attributes`, `cluster`, `indices`, `shards` | `cluster` |
| `local` | Boolean | Whether to return information from the local node only instead of from the cluster manager node. | `false` |
| `timeout` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts "0" without a unit and "-1" to indicate an unspecified value. | N/A |
| `wait_for_active_shards` | Integer or String | Waits until the specified number of shards is active before returning a response. Use `all` for all shards. <br> Valid values are: `all`, `index-setting` | N/A |
| `wait_for_events` | String | Waits until all currently queued events with the given priority are processed. <br> Valid values are: `high`, `immediate`, `languid`, `low`, `normal`, `urgent` | N/A |
| `wait_for_no_initializing_shards` | Boolean | Whether to wait until there are no initializing shards in the cluster. | `false` |
| `wait_for_no_relocating_shards` | Boolean | Whether to wait until there are no relocating shards in the cluster. | N/A |
| `wait_for_nodes` | Float or String | Waits until the specified number of nodes (`N`) is available. Accepts `>=N`, `<=N`, `>N`, and `<N`. You can also use `ge(N)`, `le(N)`, `gt(N)`, and `lt(N)` notation. | N/A |
| `wait_for_status` | String | Waits until the cluster health reaches the specified status or better. <br> Valid values are: `green`, `GREEN`, `yellow`, `YELLOW`, `red`, `RED` | N/A |
| `master_timeout` <br> _DEPRECATED_ | String | _(Deprecated since 2.0: To promote inclusive language, use `cluster_manager_timeout` instead.)_ A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts "0" without a unit and "-1" to indicate an unspecified value. | N/A |

<!-- spec_insert_end -->


## Example requests

The following examples show how to use the cluster health API.

This request waits 50 seconds for the cluster to reach the yellow status or better:

```
GET _cluster/health?wait_for_status=yellow&timeout=50s
```
{% include copy-curl.html %}

If the cluster health becomes yellow or green before 50 seconds elapse, it returns a response immediately. Otherwise it returns a response as soon as it exceeds the timeout.

The following example request retrieves cluster health for all indexes in the cluster:

```json
GET _cluster/health
```
{% include copy-curl.html %}

## Example response

The response contains cluster health information:

```json
{
  "cluster_name" : "opensearch-cluster",
  "status" : "green",
  "timed_out" : false,
  "number_of_nodes" : 2,
  "number_of_data_nodes" : 2,
  "discovered_master" : true,
  "active_primary_shards" : 6,
  "active_shards" : 12,
  "relocating_shards" : 0,
  "initializing_shards" : 0,
  "unassigned_shards" : 0,
  "delayed_unassigned_shards" : 0,
  "number_of_pending_tasks" : 0,
  "number_of_in_flight_fetch" : 0,
  "task_max_waiting_in_queue_millis" : 0,
  "active_shards_percent_as_number" : 100.0
}
```

## Response body fields

The following table lists all response fields.

|Field |Data type |Description |
|:---	|:---	|:---	|
|cluster_name | String | The name of the cluster. |
|status	| String | The cluster health status, which represents the state of shard allocation in the cluster. May be `green`, `yellow`, or `red`. |
|number_of_nodes | Integer | The number of nodes in the cluster. |
|number_of_data_nodes | Integer | The number of data nodes in the cluster. |
|discovered_cluster_manager | Boolean | Specifies whether the cluster manager is discovered. |
|active_primary_shards | Integer |  The number of active primary shards. |
|active_shards | Integer | The total number of active shards, including primary and replica shards. |
|relocating_shards | Integer | The number of relocating shards. |
|initializing_shards | Integer | The number of initializing shards. |
|unassigned_shards | Integer | The number of unassigned shards. |
|delayed_unassigned_shards | Integer | The number of delayed unassigned shards. |
|number_of_pending_tasks | Integer | The number of pending tasks in the cluster. |
|number_of_in_flight_fetch | Integer | The number of unfinished fetches. |
|task_max_waiting_in_queue_millis | Integer | The maximum wait time for all tasks waiting to be performed, in milliseconds. |
|active_shards_percent_as_number | Double | The percentage of active shards in the cluster. |
|awareness_attributes | Object | Contains cluster health information for each awareness attribute. |

## Returning cluster health by awareness attribute

To check cluster health by awareness attribute (for example, zone or rack), specify `awareness_attributes` in the `level` query parameter:

```json
GET _cluster/health?level=awareness_attributes
```
{% include copy-curl.html %}

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

```json
GET _cluster/health?level=awareness_attributes&awareness_attribute=zone
```
{% include copy-curl.html %}

In response to the preceding request, OpenSearch returns cluster health information only for the `zone` awareness attribute.

The unassigned shard information will be accurate only if you [enable replica count enforcement]({{site.url}}{{site.baseurl}}/opensearch/cluster#replica-count-enforcement) and [configure forced awareness]({{site.url}}{{site.baseurl}}/opensearch/cluster#forced-awareness) for the awareness attribute either before cluster start or after cluster start but before any indexing requests. If you enable replica enforcement after the cluster receives indexing requests, the unassigned shard information may be inaccurate. If you don't configure replica count enforcement and forced awareness, the `unassigned_shards` field will contain -1.
{: .warning}

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions:
`cluster:monitor/health`.
