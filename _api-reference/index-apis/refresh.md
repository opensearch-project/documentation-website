---
layout: default
title: Refresh indexes
parent: Index APIs
nav_order: 61
---

# Refresh API 
Introduced 1.0
{: .label .label-purple }

The Refresh API refreshes one or more indexes in an OpenSearch cluster. In the case of data streams, the Refresh API refreshes a stream's backing indexes. 

OpenSearch's refresh behavior depends on whether or not the `index.refresh_interval` is set:

- When set, refreshes occur based on the `index.refresh_interval` setting (in seconds).
- When not set, refreshes occur every second until the shard receives no search requests for at least the number set in the `index.search.idle.after` setting (in seconds). Default is 30s. 

After a shard goes idle, it will not refresh until the next search request or until a Refresh API request. The first search request on an idle shard will wait for the refresh operation to complete.

To use the Refresh API, you must have write access to the indexes you want to refresh.

## Path and HTTP methods

```json
POST /_refresh
GET /_refresh
POST /<index>/_refresh
GET /<index>/_refresh
```

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `index` | String | A comma-separated list of wildcard expression of index names you want to refresh. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `ignore_unavailable` | Boolean | When `false`, the request returns an error when it targets a missing or closed index. Default is `false`.
| `allow_no_indices` | Boolean | When `false`, the Refresh API returns an error when a wildcard expression, index alias, or `_all` targets only closed or missing indexes, even when the request is made against open indexes. Default is `true`. |
| `expand_wildcard` | String | The type of index that the wildcard patterns can match. If the request targets data streams, this argument determines whether the wildcard expressions match any hidden data streams. Supports comma-separated values, such as `open,hidden`. Valid values are: `all`, `open`, `closed`, `hidden`, and `none`.



## Example: Refresh several data streams or indexes

The following example request refreshes two indexes named `my-index-A` and `my-index-B`.


```
POST /my-index-A,my-index-B/_refresh
```
{% include copy-curl.html %}

## Example: Refresh all data streams or indexes in a cluster

The following request refreshes all data streams and indexes in the cluster.

```
POST /_refresh
```

