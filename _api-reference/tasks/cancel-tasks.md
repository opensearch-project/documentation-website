---
layout: default
title: Cancel tasks
parent: Tasks API
nav_order: 30
---

# Cancel tasks
**Introduced 1.0**
{: .label .label-purple }

The Cancel Tasks API cancels a task, stopping it from running in the cluster. Not all tasks can be canceled. To determine whether a task is cancelable, check the `cancellable` field in the Cancel Tasks API response.


<!-- spec_insert_start
api: tasks.cancel
component: endpoints
-->
## Endpoints
```json
POST /_tasks/_cancel
POST /_tasks/{task_id}/_cancel
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: tasks.cancel
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `task_id` | String | The task ID. |

<!-- spec_insert_end -->

<!-- spec_insert_start
api: tasks.cancel
component: query_parameters
-->
## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `actions` | List or String | A comma-separated list of actions that should be returned. Keep empty to return all. |
| `nodes` | List | A comma-separated list of node IDs or names used to limit the returned information. Use `_local` to return information from the node you're connecting to, specify the node name to get information from a specific node, or keep the parameter empty to get information from all nodes. |
| `parent_task_id` | String | Returns tasks with a specified parent task ID (`node_id:task_number`). Keep empty or set to -1 to return all. |
| `wait_for_completion` | Boolean | Waits for the matching task to complete. When `true`, the request is blocked until the task has completed. _(Default: `false`)_ |

<!-- spec_insert_end -->

## Example request

The following request cancels any tasks currently running on `opensearch-node1` and `opensearch-node2`:

```
POST _tasks/_cancel?nodes=opensearch-node1,opensearch-node2
```
{% include copy-curl.html %}

## Example response

The following response shows that a bulk write and update task were canceled without a node failure and provides additional information about the canceled tasks:

```json
{
  "node_failures": [],
  "nodes": {
    "JzrCxdtFTCO_RaINw8ckNA": {
      "name": "opensearch-node1",
      "transport_address": "127.0.0.1:9300",
      "host": "127.0.0.1",
      "ip": "127.0.0.1:9300",
      "roles": [
        "data",
        "ingest",
        "cluster_manager",
        "remote_cluster_client"
      ],
      "attributes": {},
      "tasks": {
        "JzrCxdtFTCO_RaINw8ckNA:54": {
          "node": "JzrCxdtFTCO_RaINw8ckNA",
          "id": 54,
          "type": "transport",
          "action": "indices:data/write/bulk",
          "status": "cancelled",
          "description": "bulk request to [test_index]",
          "start_time_in_millis": 1625145678901,
          "running_time_in_nanos": 2345678,
          "cancellable": true,
          "cancelled": true
        }
      }
    },
    "K8iyDdtGQCO_SbJNw9dkMB": {
      "name": "opensearch-node2",
      "transport_address": "127.0.0.1:9301",
      "host": "127.0.0.1",
      "ip": "127.0.0.1:9301",
      "roles": [
        "data",
        "ingest",
        "master",
        "remote_cluster_client"
      ],
      "attributes": {},
      "tasks": {
        "K8iyDdtGQCO_SbJNw9dkMB:78": {
          "node": "K8iyDdtGQCO_SbJNw9dkMB",
          "id": 78,
          "type": "transport",
          "action": "indices:data/write/update",
          "status": "cancelled",
          "description": "updating document in [another_index]",
          "start_time_in_millis": 1625145679012,
          "running_time_in_nanos": 1234567,
          "cancellable": true,
          "cancelled": true
        }
      }
    }
  }
}
```

