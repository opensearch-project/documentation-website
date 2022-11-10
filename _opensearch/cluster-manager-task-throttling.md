---
layout: default
title: Cluster manager task throttling
nav_order: 70
has_children: false
---

# Cluster manager task throttling

For many cluster state updates, such as defining a mapping or creating an index, nodes submit tasks to the cluster manager. The cluster manager maintains a pending task queue for these tasks and runs them in a single-threaded environment. When nodes send tens of thousands of resource-intensive tasks, like put-mappings or snapshot tasks, these tasks pile up in the queue, and the cluster manager is flooded. This affects the cluster manager performance, and may in turn affect the availability of the whole cluster. 

The first line of defense is to implement mechanisms in the caller nodes to avoid task overload on the cluster manager. However, even with those mechanisms in place, the cluster manager needs a built-in way to protect itself---cluster manager task throttling.

To use cluster manager task throttling, you need to specify to throttle tasks by setting throttling limits. The cluster manager uses the throttling limits to determine whether to reject tasks from the nodes. It rejects a task if the total number of tasks of the same type in the pending task queue exceeds the threshold. Since the cluster manager throttles tasks based on the task type, rejecting one task does not affect any other tasks of a different type. For example, if the cluster manager rejects a `put-mapping` task, it can still accept a subsequent `create-index` task. If the cluster manager rejects a task, the node performs retries with exponential backoff to resubmit the task to the cluster manager. If retries are unsuccessful within the timeout period, OpenSearch returns a cluster timeout error.

## Setting throttling limits

You can set the throttling limits by specifying them in the `cluster_manager.throttling.thresholds` object and updating the [OpenSearch cluster settings]({{site.url}}{{site.baseurl}}/api-reference/cluster-settings). The setting is dynamic, so you can change the behavior of this feature without restarting your cluster.

By default, throttling is disabled for all task types.
{: .note}

The request has the following format:

```json
PUT _cluster/settings
{
  "persistent": {
    "cluster_manager.throttling.thresholds" : {
      "<task-type-name>" : {
          "value" : <threshold limit>
      }
    }
  }
}
```

The following table describes the `cluster_manager.throttling.thresholds` object.

Field name | Description
:--- | :---
task-type-name | The name of the task type. See [supported task types](#supported-task-types) for a list of valid values.
value | The maximum number of tasks of the type `task-type-name` in the cluster manager's pending task queue. Default is `-1` (no task throttling).  

## Supported task types

The following task types are supported:

- `create-index` 
- `update-settings` 
- `cluster-update-settings` 
- `auto-create` 
- `delete-index` 
- `delete-dangling-index` 
- `create-data-stream` 
- `remove-data-stream` 
- `rollover-index` 
- `index-aliases` 
- `put-mapping` 
- `create-index-template` 
- `remove-index-template` 
- `create-component-template` 
- `remove-component-template` 
- `create-index-template-v2` 
- `remove-index-template-v2` 
- `put-pipeline` 
- `delete-pipeline` 
- `create-persistent-task` 
- `finish-persistent-task` 
- `remove-persistent-task` 
- `update-task-state` 
- `put-script` 
- `delete-script` 
- `put-repository` 
- `delete-repository` 
- `create-snapshot` 
- `delete-snapshot` 
- `update-snapshot-state` 
- `restore-snapshot` 
- `cluster-reroute-api`

#### Sample request

The following request sets the throttling threshold for the `put-mapping` task type to 100:

```json
PUT _cluster/settings
{
  "persistent": {
    "cluster_manager.throttling.thresholds": {
      "put-mapping": {
        "value": 100
      }
    }
  }
}
```

Set the threshold to `-1` to disable throttling for a task type. 
{: .note}
