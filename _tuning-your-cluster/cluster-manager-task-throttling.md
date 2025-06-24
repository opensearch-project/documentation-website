---
layout: default
title: Cluster manager task throttling
nav_order: 10
has_children: false
canonical_url: https://docs.opensearch.org/docs/latest/tuning-your-cluster/cluster-manager-task-throttling/
---

# Cluster manager task throttling

For many cluster state updates, such as defining a mapping or creating an index, nodes submit tasks to the cluster manager. The cluster manager maintains a pending task queue for these tasks and runs them in a single-threaded environment. When nodes send tens of thousands of resource-intensive tasks, like `put-mapping` or snapshot tasks, these tasks can pile up in the queue and flood the cluster manager. This affects the cluster manager's performance and may in turn affect the availability of the whole cluster. 

The first line of defense is to implement mechanisms in the caller nodes to avoid task overload on the cluster manager. However, even with those mechanisms in place, the cluster manager needs a built-in way to protect itself: cluster manager task throttling.

By default, the cluster manager uses predefined throttling limits to determine whether to reject a task. You can modify these limits or disable throttling for specific task types.

The cluster manager rejects a task based on its type. For any incoming task, the cluster manager evaluates the total number of tasks of the same type in the pending task queue. If this number exceeds the threshold for this task type, the cluster manager rejects the incoming task. Rejecting a task does not affect tasks of a different type. For example, if the cluster manager rejects a `put-mapping` task, it can still accept a subsequent `create-index` task. 

When the cluster manager rejects a task, the node performs retries with exponential backoff to resubmit the task to the cluster manager. If retries are unsuccessful within the timeout period, OpenSearch returns a cluster timeout error.

## Setting throttling limits

You can set throttling limits by specifying them in the `cluster_manager.throttling.thresholds` object and updating the [OpenSearch cluster settings]({{site.url}}{{site.baseurl}}/api-reference/cluster-settings). The setting is dynamic, so you can change the behavior of this feature without restarting your cluster.

By default, throttling is enabled for all task types. To disable throttling for a specific task type, set its threshold value to `-1`.
{: .note}

The request has the following format:

```json
PUT _cluster/settings
{
  "persistent": {
    "cluster_manager.throttling.thresholds" : {
      "<task-type>" : {
          "value" : <threshold>
      }
    }
  }
}
```

The `cluster_manager.throttling.thresholds` object contains the following fields.

Field name | Description
:--- | :---
`<task-type>` | The task type. For a list of valid task types, see [supported task types and default thresholds](#supported-task-types-and-default-thresholds).
`<task-type>.value` | The maximum number of tasks of the `task-type` type in the cluster manager's pending task queue. <br> For default thresholds for each task type, see [Supported task types and default thresholds](#supported-task-types-and-default-thresholds).

## Supported task types and default thresholds

The following table lists all supported task types and their default throttling threshold values.

Task type | Threshold
:--- | :---
`create-index `| 50
`update-settings` | 50
`cluster-update-settings` | 50
`auto-create` | 200
`delete-index` | 50
`delete-dangling-index `| 50
`create-data-stream` | 50
`remove-data-stream` | 50
`rollover-index` | 200
`index-aliases` | 200
`put-mapping` | 10000
`create-index-template` | 50
`remove-index-template` | 50
`create-component-template` | 50
`remove-component-template` | 50
`create-index-template-v2` | 50
`remove-index-template-v2` | 50
`put-pipeline` | 50
`delete-pipeline` | 50
`put-search-pipeline` | 50
`delete-search-pipeline` | 50
`create-persistent-task` | 50
`finish-persistent-task` | 50
`remove-persistent-task` | 50
`update-task-state` | 50
`create-query-group` | 50
`delete-query-group` | 50
`update-query-group` | 50
`put-script` | 50
`delete-script` | 50
`put-repository` | 50
`delete-repository` | 50
`create-snapshot` | 50
`delete-snapshot` | 50
`update-snapshot-state` | 5000
`restore-snapshot` | 50
`cluster-reroute-api` | 50

## Example request

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
{% include copy-curl.html %}
