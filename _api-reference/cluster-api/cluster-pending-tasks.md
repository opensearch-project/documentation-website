---
layout: default
title: Cluster pending tasks
nav_order: 42
parent: Cluster APIs
---

# Cluster pending tasks

**Introduced 1.0**
{: .label .label-purple }

The Cluster pending tasks API returns a list of pending cluster-level tasks, such as index creation, mapping updates,
or new allocations.

<!-- spec_insert_start
api: cluster.pending_tasks
component: endpoints
-->
## Endpoints
```json
GET /_cluster/pending_tasks
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: cluster.pending_tasks
component: query_parameters
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `cluster_manager_timeout` | String | A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts "0" without a unit and "-1" to indicate an unspecified value. |
| `local` | Boolean | When `true`, the request retrieves information from the local node only. When `false`, information is retrieved from the cluster manager node. _(Default: `false`)_ |
| `master_timeout` <br> _DEPRECATED_ | String | _(Deprecated since 2.0: To promote inclusive language, use `cluster_manager_timeout` instead.)_ A duration. Units can be `nanos`, `micros`, `ms` (milliseconds), `s` (seconds), `m` (minutes), `h` (hours) and `d` (days). Also accepts "0" without a unit and "-1" to indicate an unspecified value. |

<!-- spec_insert_end -->
