---
layout: default
title: CAT pending tasks
parent: CAT API

nav_order: 45
has_children: false
redirect_from:
- /opensearch/rest-api/cat/cat-pending-tasks/
canonical_url: https://docs.opensearch.org/latest/api-reference/cat/cat-pending-tasks/
---

# CAT pending tasks
**Introduced 1.0**
{: .label .label-purple }

The CAT pending tasks operation lists the progress of all pending tasks, including task priority and time in queue.


## Path and HTTP methods

```json
GET _cat/pending_tasks
```

## Query parameters

Parameter | Type | Description
:--- | :--- | :---
local | Boolean | Whether to return information from the local node only instead of from the cluster manager node. Default is `false`.
cluster_manager_timeout | Time | The amount of time to wait for a connection to the cluster manager node. Default is 30 seconds.
time | Time | Specify the units for time. For example, `5d` or `7h`. For more information, see [Supported units]({{site.url}}{{site.baseurl}}/opensearch/units/).

## Example request

The following example request lists the progress of all pending node tasks:

```json
GET _cat/pending_tasks?v
```
{% include copy-curl.html %}

## Example response

```json
insertOrder | timeInQueue | priority | source
  1786      |    1.8s     |  URGENT  | shard-started
```
