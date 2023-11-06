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

## Example

This request waits 50 seconds for the cluster to reach the yellow status or better:

```
GET _cluster/health?wait_for_status=yellow&timeout=50s
```
{% include copy-curl.html %}

If the cluster health becomes yellow or green before 50 seconds elapse, it returns a response immediately. Otherwise it returns a response as soon as it exceeds the timeout.

## Path and HTTP methods

```
GET _cluster/health
GET _cluster/health/<index>
```

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
expand_wildcards | Enum | Expands wildcard expressions to concrete indexes. Combine multiple values with commas. Supported values are `all`, `open`, `closed`, `hidden`, and `none`. Default is `open`.
level | Enum | The level of detail for returned health information. Supported values are `cluster`, `indices`, `shards`, and `awareness_attributes`. Default is `cluster`.
awareness_attribute | String | The name of the awareness attribute, for which to return cluster health (for example, `zone`). Applicable only if `level` is set to `awareness_attributes`.
local | Boolean | Whether to return information from the local node only instead of from the cluster manager node. Default is false.
cluster_manager_timeout | Time | The amount of time to wait for a connection to the cluster manager node. Default is 30 seconds.
timeout | Time | The amount of time to wait for a response. If the timeout expires, the request fails. Default is 30 seconds.
wait_for_active_shards | String | Wait until the specified number of shards is active before returning a response. `all` for all shards. Default is `0`.
wait_for_nodes | String | Wait for N number of nodes. Use `12` for exact match, `>12` and `<12` for range.
wait_for_events | Enum | Wait until all currently queued events with the given priority are processed. Supported values are `immediate`, `urgent`, `high`, `normal`, `low`, and `languid`.
wait_for_no_relocating_shards | Boolean | Whether to wait until there are no relocating shards in the cluster. Default is false.
wait_for_no_initializing_shards | Boolean | Whether to wait until there are no initializing shards in the cluster. Default is false.
wait_for_status | Enum | Wait until the cluster health reaches the specified status or better. Supported values are `green`, `yellow`, and `red`.
weights | JSON object | Assigns weights to attributes within the request body of the PUT request. Weights can be set in any ration, for example, 2:3:5. In a 2:3:5 ratio with three zones, for every 100 requests sent to the cluster, each zone would receive either 20, 30, or 50 search requests in a random order. When assigned a weight of `0`, the zone does not receive any search traffic. 

#### Example request

The following example request retrieves cluster health for all indexes in the cluster:

```json
GET _cluster/health
```
{% include copy-curl.html %}

#### Example response

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

## Response fields

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
