---
layout: default
title: Asynchronous search stats
parent: Asynchronous Search APIs
nav_order: 40
---

# Asynchronous search stats
**Introduced 1.0**
{: .label .label-purple }


The Asynchronous Search Stats API provides statistics about asynchronous search activity across the cluster. Use this API to monitor performance, track usage trends, and evaluate the resource impact of running and completed asynchronous searches.

The following list describes common use cases for this API:

- Monitoring and tuning performance.
- Troubleshooting search issues.
- Planning cluster capacity.
- Understanding how asynchronous search is used.

<!-- spec_insert_start
api: asynchronous_search.get
component: endpoints
-->
## Endpoints
```json
GET /_plugins/_asynchronous_search/{id}
```
<!-- spec_insert_end -->

## Example request

The following request retrieves statistics about asynchronous searches across all nodes in the cluster:

```json
GET /_plugins/_asynchronous_search/stats
```
{% include copy-curl.html %}

## Example response

```json
{
  "_nodes": {
    "total": 2,
    "successful": 2,
    "failed": 0
  },
  "cluster_name": "opensearch-cluster",
  "nodes": {
    "node1": {
      "running_current": 0,
      "running_count": 12,
      "persisted_current": 3,
      "persisted_count": 15,
      "completed_count": 25,
      "cancelled_count": 2,
      "rejected_count": 1,
      "failed_count": 3
    },
    "node2": {
      "running_current": 1,
      "running_count": 8,
      "persisted_current": 2,
      "persisted_count": 10,
      "completed_count": 18,
      "cancelled_count": 1,
      "rejected_count": 0,
      "failed_count": 2
    }
  }
}
```

## Response body fields

The response body is a JSON object with the following fields.

| Property | Data type | Description |
| :--- | :--- | :--- |
| `_nodes` | Object | Statistics about node operations and responses. |
| `cluster_name` | String | The name of the OpenSearch cluster. |
| `nodes` | Object | A map of node IDs to node-specific asynchronous search statistics. |

<details markdown="block">
  <summary>
    Response body fields: <code>_nodes</code>
  </summary>
  {: .text-delta}

The statistics about node operations.

`_nodes` is a JSON object with the following fields.

| Property | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `failed` | **Required** | Integer | The number of nodes that rejected the request or failed to respond. If this value is not 0, then a reason for the rejection or failure is included in the response. |
| `successful` | **Required** | Integer | The number of nodes that responded successfully to the request. |
| `total` | **Required** | Integer | The total number of nodes selected by the request. |
| `failures` | Optional | Array of Objects | Details about any failures that occurred during the request. Present only when there are failures. |

</details>

<details markdown="block">
  <summary>
    Response body fields: <code>nodes</code>
  </summary>
  {: .text-delta}

A map of node IDs to node-specific asynchronous search statistics.

Each entry in the `nodes` object contains the following fields:

| Property | Data type | Description |
| :--- | :--- | :--- |
| `running_current` | Integer | The number of asynchronous searches currently running on this node. |
| `running_count` | Integer | The total number of asynchronous searches that have been executed on this node since it was started. |
| `persisted_current` | Integer | The number of completed asynchronous searches that are currently persisted on this node. |
| `persisted_count` | Integer | The total number of asynchronous searches that have been persisted on this node since it was started. |
| `completed_count` | Integer | The total number of asynchronous searches that have completed successfully on this node since it was started. |
| `cancelled_count` | Integer | The total number of asynchronous searches that have been cancelled on this node since it was started. |
| `rejected_count` | Integer | The total number of asynchronous searches that have been rejected on this node since it was started. |
| `failed_count` | Integer | The total number of asynchronous searches that have failed on this node since it was started. |

</details>