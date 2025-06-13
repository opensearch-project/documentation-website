---
layout: default
title: Get Replication Status API
parent: Replication APIs
nav_order: 15
---

# Get Replication Status API
Introduced 1.0
{: .label .label-purple }

The Get Replication Status API retrieves detailed information about the current state of replication for a specified index. This API helps you monitor the progress and health of the replication process between leader and follower indices.

<!-- spec_insert_start
api: replication.status
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_replication/{index}/_status
```
<!-- spec_insert_end -->

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `index` | String | The name of the data stream, index, or index alias to get replication status for. Required. |

## Example request

The following example gets the replication status for the `customer-data` index:

```json
GET /_plugins/_replication/customer-data/_status
```
{% include copy-curl.html %}

## Example response

The following example shows a successful API response:

```json
{
  "status": "RUNNING",
  "reason": "Replication is active",
  "leader_index": "leader-customer-data",
  "follower_index": "follower-customer-data",
  "leader_alias": "customer-data",
  "syncing_details": {
    "leader_checkpoint": 42,
    "follower_checkpoint": 40,
    "seq_no": 1023
  }
}
```

## Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `follower_index` | String | The name of the follower index in the replication process. |
| `leader_alias` | String | The name of an index alias used for the leader index. |
| `leader_index` | String | The name of the leader index in the replication process. |
| `reason` | String | The reason for the current replication status. |
| `status` | String | The current status of the replication process. Valid values are: `BOOTSTRAPPING`, `PAUSED`, `REPLICATION NOT IN PROGRESS`, `RUNNING`, and `SYNCING`. |
| `syncing_details` | Object | Details about the synchronization process. |
| `syncing_details.follower_checkpoint` | Integer | The checkpoint of the follower index in the replication process. |
| `syncing_details.leader_checkpoint` | Integer | The checkpoint of the leader index in the replication process. |
| `syncing_details.seq_no` | Integer | The sequence number of the document. |