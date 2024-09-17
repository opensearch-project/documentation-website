---
layout: default
title: Clone Snapshot
parent: Snapshot APIs
nav_order: 10
---

# Clone Snapshot 
Introduced 1.0
{: .label .label-purple }

Creates a clone of all or part of a snapshot, in the same repository as the original.

## Path and HTTP methods

```json
PUT /_snapshot/<repository>/<snapshot>/_clone/<target_snapshot>
{
	“indices” : “an_index,another_index”
}
```

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `repository` | String | Name of repository that contains snapshot. |
| `snapshot` | String | Name of original snapshot. |
| `target_snapshot` | String | Name of cloned snapshot to create. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter |  Data type | Description |
| :--- | :--- | :--- |
| `cluster_manager_timeout` | Time | The amount of time to wait for a response from the cluster manager node.  Optional, default is 30 seconds. (Formerly called `master_timeout`.)|

## Request fields

The following table lists the available request body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `indices` | String | A list of indices to clone from the original snapshot into the target snapshot, separated by commas. Do not put spaces between items. The wildcard symbol (`*`) can be used to specify index patterns, and `-` can be used to exclude indices. Required. |
| `ignore_unavailable` | Boolean | If an index from the indices list doesn’t exist, whether to ignore and proceed. Optional, default is `false`. |
| `include_global_state` | Boolean | Whether to include cluster state in the snapshot. Optional, default is `true`. |
| `partial` | Boolean | Whether to allow partial snapshots. Optional; default is `false`, which fails the entire snapshot if one or more shards fails to store. |

## Example request

The following request copies indices `index_a` and `index_b` from `my_snapshot`, a snapshot located in repository `my-opensearch-repo`, into a new snapshot in the same repository called `my_new_snapshot`:

```json
PUT /_snapshot/my-opensearch-repo/my_snapshot/_clone/my_new_snapshot
{
	“indices” : “index_a,index_b”
}
```
{% include copy-curl.html %}


## Example response

Upon success, the request returns the following json object:

```json
{ 
    "acknowledged" : true
}
```

