---
layout: default
title: Refresh index
parent: Index APIs
nav_order: 115
canonical_url: https://docs.opensearch.org/latest/api-reference/index-apis/refresh/
---

# Refresh Index API
Introduced 1.0
{: .label .label-purple }

The Refresh Index API refreshes one or more indexes in an OpenSearch cluster. In the case of data streams, the Refresh Index API refreshes a stream's backing indexes. 

OpenSearch's refresh behavior depends on whether or not `index.refresh_interval` is set:

- When set, indexes are refreshed based on the `index.refresh_interval` setting (in seconds). For more information about `index.refresh_interval` settings, see [Dynamic index-level index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/#dynamic-index-level-index-settings).
- When not set, refreshes occur every second until the shard receives no search requests for at least the amount of time specified by the `index.search.idle.after` setting (in seconds). Default is `30s`. 

After a shard becomes idle, the indexes will not refresh until either the next search request or a Refresh Index API request is sent. The first search request on an idle shard will wait for the refresh operation to complete. 

To use the Refresh Index API, you must have write access to the indexes you want to refresh.

## Refresh request behavior

The Refresh Index API call is synchronous. The response is returned only after all targeted shards have been refreshed.
Because refresh operations are resource intensive, we recommend relying on automatic periodic refreshes using `index.refresh_interval`.

## Endpoints

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
| `index` | String | A comma-separated list of index names to be refreshed. Wildcards are accepted.|

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `ignore_unavailable` | Boolean | When `false`, the request returns an error when it targets a missing or closed index. Default is `false`.
| `allow_no_indices` | Boolean | When `false`, the Refresh Index API returns an error when a wildcard expression, index alias, or `_all` targets only closed or missing indexes, even when the request is made against open indexes. Default is `true`. |
| `expand_wildcards` | String | The type of index that the wildcard patterns can match. If the request targets data streams, this argument determines whether the wildcard expressions match any hidden data streams. Supports comma-separated values, such as `open,hidden`. Valid values are `all`, `open`, `closed`, `hidden`, and `none`.


## Example requests

### Refresh several data streams or indexes

The following example request refreshes two indexes named `my-index-A` and `my-index-B`:


```json
POST /my-index-A,my-index-B/_refresh
```
{% include copy-curl.html %}

### Refresh all data streams and indexes in a cluster

The following request refreshes all data streams and indexes in a cluster:

```json
POST /_refresh
```
{% include copy-curl.html %}

