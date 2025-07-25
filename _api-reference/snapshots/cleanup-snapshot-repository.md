---
layout: default
title: Cleanup Snapshot Repository
parent: Snapshot APIs
nav_order: 11
canonical_url: https://docs.opensearch.org/latest/api-reference/snapshots/cleanup-snapshot-repository/
---

# Cleanup Snapshot Repository 
Introduced 1.0
{: .label .label-purple }

The Cleanup Snapshot Repository API clears a snapshot repository of data no longer referenced by any existing snapshot.

## Endpoints

```json
POST /_snapshot/<repository>/_cleanup
```


## Path parameters

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `repository` | String | The name of the snapshot repository. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter |  Data type | Description |
| :--- | :--- | :--- |
| `cluster_manager_timeout` | Time | The amount of time to wait for a response from the cluster manager node. Formerly called `master_timeout`. Optional. Default is 30 seconds. |
| `timeout` | Time | The amount of time to wait for the operation to complete. Optional.|

## Example request

The following request removes all stale data from the repository `my_backup`:

```json
POST /_snapshot/my_backup/_cleanup
```
{% include copy-curl.html %}


## Example response

```json
{
	"results":{
		"deleted_bytes":40,
		"deleted_blobs":8
	}
}
```

## Response body fields

| Field | Data type | Description |
| :--- | :--- | :--- |
| `deleted_bytes` | Integer | The number of bytes made available in the snapshot after data deletion. |
| `deleted_blobs` | Integer | The number of binary large objects (BLOBs) cleared from the repository by the request. |

