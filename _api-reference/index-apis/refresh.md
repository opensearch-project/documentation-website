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

OpenSearch, by default, will refresh indexes every second on indexes that have received one search request or more in the last 30 seconds. To change the default interval, use the `index.refresh_interval` setting in `opensearch.yml`.

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

