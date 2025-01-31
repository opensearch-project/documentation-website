---
layout: default
title: Cluster reroute
nav_order: 45
parent: Cluster APIs
---

# Cluster reroute 
**Introduced 1.0**
{: .label .label-purple }

The Cluster reroute API changes the allocation of individual shards in the cluster.

<!-- spec_insert_start
api: cluster.reroute
component: endpoints
-->
## Endpoints
```json
POST /_cluster/reroute
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: cluster.reroute
component: query_parameters
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `cluster_manager_timeout` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts "0" without a unit and "-1" to indicate an unspecified value. |
| `dry_run` | Boolean | When `true`, the request simulates the operation and returns the resulting state. |
| `explain` | Boolean | When `true`, the response contains an explanation of why certain commands can or cannot be executed. |
| `metric` | List or String | Limits the information returned to the specified metrics. <br> Valid values are: `_all`, `blocks`, `cluster_manager_node`, `master_node`, `metadata`, `nodes`, `routing_nodes`, `routing_table`, `version` |
| `retry_failed` | Boolean | When `true`, retries shard allocation if it was blocked because of too many subsequent failures. |
| `timeout` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts "0" without a unit and "-1" to indicate an unspecified value. |
| `master_timeout` <br> _DEPRECATED_ | String | _(Deprecated since 2.0: To promote inclusive language, use `cluster_manager_timeout` instead.)_ A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts "0" without a unit and "-1" to indicate an unspecified value. |

<!-- spec_insert_end -->
