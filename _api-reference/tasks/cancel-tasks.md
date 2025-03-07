---
layout: default
title: Cancel tasks
parent: Tasks API
nav_order: 10
---

# Cancel tasks

The Cancel Tasks API cancels a task, stopping the task from running inside the cluster. Not all tasks are cancelable. To see if a task is cancelable, refer to the `cancellable` field in the response to your `tasks` API request.


<!-- spec_insert_start 
api: tasks.cancel
component: endpoints
-->

<!-- spec_insert_end -->

<!-- spec_insert_start 
api: tasks.cancel
component: path_parameters
-->

<!-- spec_insert_end -->

<!-- spec_insert_start 
api: tasks.cancel
component: query_parameters
-->

<!-- spec_insert_end -->

## Example request

The following request cancels any tasks found on two nodes in the cluster, `opensearch-node1` and `opensearch-node2`:

```
POST _tasks/_cancel?nodes=opensearch-node1,opensearch-node2
```
{% include copy-curl.html %}

## Example response

The following response shows that a bulk write and update task were cancelled without node failure, and provides additional information about the cancelled tasks:

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
```json

