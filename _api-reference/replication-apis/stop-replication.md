---
layout: default
title: Stop Replication API
parent: Replication APIs
nav_order: 30
---

# Stop Replication API
Introduced 1.0
{: .label .label-purple }

The Stop Replication API halts the ongoing replication process for the specified index. This API lets you discontinue replication between the leader and follower indices when it's no longer needed.

<!-- spec_insert_start
api: replication.stop
component: endpoints
-->
## Endpoints
```json
POST /_plugins/_replication/{index}/_stop
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: replication.stop
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `index` | **Required** | String | The name of the data stream, index, or index alias to perform bulk actions on. |

<!-- spec_insert_end -->

## Example request

The following example stops replication on the `customer-data` index:

```json
POST /_plugins/_replication/customer-data/_stop
```
{% include copy-curl.html %}

## Example response

The following example shows a successful API response:

```json
{
  "acknowledged": true,
  "shards_stopped": 5
}
```
