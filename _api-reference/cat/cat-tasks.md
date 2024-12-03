---
layout: default
title: CAT tasks
parent: CAT API

nav_order: 70
has_children: false
redirect_from:
- /opensearch/rest-api/cat/cat-tasks/
---

# CAT tasks
**Introduced 1.0**
{: .label .label-purple }

The CAT tasks operation lists the progress of all tasks currently running on your cluster.

## Path and HTTP methods

```json
GET _cat/tasks
```

## Query parameters

Parameter | Type | Description
:--- | :--- | :---
nodes | List | A comma-separated list of node IDs or names to limit the returned information. Use `_local` to return information from the node you're connecting to, specify the node name to get information from specific nodes, or keep the parameter empty to get information from all nodes.
detailed | Boolean | Returns detailed task information. (Default: false)
parent_task_id | String | Returns tasks with a specified parent task ID (node_id:task_number). Keep empty or set to -1 to return all.
time | Time | Specify the units for time. For example, `5d` or `7h`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/).

## Example request

The following example request lists all tasks in progress:

```
GET _cat/tasks?v
```
{% include copy-curl.html %}


## Example response

```json
action | task_id | parent_task_id | type | start_time | timestamp | running_time | ip | node
cluster:monitor/tasks/lists | 1vo54NuxSxOrbPEYdkSF0w:168062 | - | transport | 1624337809471 | 04:56:49 | 489.5ms | 172.18.0.4 | odfe-node1     
```
