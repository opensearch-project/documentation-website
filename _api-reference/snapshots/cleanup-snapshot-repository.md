---
layout: default
title: Cleanup Snapshot
parent: Snapshot APIs
nav_order: 11
---

# Example API 
Introduced 1.0
{: .label .label-purple }

Clears repository of stale data (data no longer referenced by any existing snapshot).

## Path and HTTP methods

```json
POST /_snapshot/<repository>/_cleanup
```

## Path parameters

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `repository` | String | Name of repository to cleanup. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter |  Data type | Description |
| :--- | :--- | :--- |
| `cluster_manager_timeout` | Time | The amount of time to wait for a response from the cluster manager node. Formerly called `master_timeout`. Default is 30 seconds. |
| `timeout` | Time | The amount of time to wait for the operation to complete. |

## Example request

The following request removes all unreferenced data from the repository `my_backup`:

```json
POST /_snapshot/my_backup/_cleanup
```
{% include copy-curl.html %}


## Example response

Upon success, the request will return a JSON object of the following form:

```json
{
	"results":{
		"deleted_bytes":0,
			"deleted_blobs":0
			}
}
```

## Response body fields


| Field | Data type | Description |
| :--- | :--- | :--- |
| `deleted_bytes` | Integer | The amount of bytes freed by the request. |
| `deleted_blobs` | Integer | The amount of binary large objects (BLOBS) cleared from the repository during the request. |

