---
layout: default
title: Refresh index
parent: Index operations
grand_parent: Index APIs
nav_order: 60
---

# Refresh Index API
**Introduced 1.0**
{: .label .label-purple }

The Refresh Index API refreshes one or more indexes, making all operations performed on those indexes since the last refresh available for search. When you index a document, it is first written to a translog and added to in-memory buffers. The document is not searchable until a refresh operation converts these in-memory structures into searchable segments on disk. In the case of data streams, the Refresh Index API refreshes a stream's backing indexes.

For a conceptual overview of how refresh operations work in OpenSearch, see [Refresh]({{site.url}}{{site.baseurl}}/getting-started/concepts/#refresh).

## Automatic refresh behavior

OpenSearch's refresh behavior depends on whether or not `index.refresh_interval` is set:

- When set, indexes are refreshed based on the `index.refresh_interval` setting (in seconds). For more information about `index.refresh_interval` settings, see [Dynamic index-level index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/#dynamic-index-level-index-settings).
- When not set, refreshes occur every second until the shard receives no search requests for at least the amount of time specified by the `index.search.idle.after` setting (in seconds). Default is `30s`. 

After a shard becomes idle, the indexes will not refresh until either the next search request or a Refresh Index API request is sent. The first search request on an idle shard will wait for the refresh operation to complete. 

To use the Refresh Index API, you must have write access to the indexes you want to refresh.

## Refresh request behavior

The Refresh Index API call is synchronous. The response is returned only after all targeted shards have been refreshed.

## Best practices

Refresh operations are resource intensive and can impact cluster performance. To ensure optimal cluster performance, we recommend the following best practices:

- **Rely on automatic refreshes**: Wait for OpenSearch's periodic refresh (controlled by `index.refresh_interval`) rather than performing explicit refreshes when possible.
- **Use `refresh=wait_for` for indexing workflows**: If your application indexes documents and then immediately searches for them, use the `refresh=wait_for` query parameter on indexing operations instead of calling the Refresh API. This option ensures the indexing operation waits for a periodic refresh before returning, without forcing an immediate refresh. For more information, see [The `refresh` query parameter](#the-refresh-query-parameter).
- **Avoid `refresh=true` in production**: Using `refresh=true` on index, update, or delete operations forces an immediate refresh and creates inefficient index structures (small segments) that must later be merged, impacting both indexing and search performance.

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


<!-- spec_insert_start
component: example_code
rest: POST /my-index-A,my-index-B/_refresh
-->
{% capture step1_rest %}
POST /my-index-A,my-index-B/_refresh
{% endcapture %}

{% capture step1_python %}


response = client.indices.refresh(
  index = "my-index-A,my-index-B"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

### Refresh all data streams and indexes in a cluster

The following request refreshes all data streams and indexes in a cluster:

```json
POST /_refresh
```
{% include copy-curl.html %}

### Refresh using the GET method

You can also use the `GET` method to refresh indexes. The following example uses `GET` to refresh a specific index:

```json
GET /my-index/_refresh
```
{% include copy-curl.html %}

The `GET` method works identically to the `POST` method and is useful in environments where `POST` requests may be restricted or when you prefer to use `GET` for read-like operations.

## The refresh query parameter

The document APIs such as Index, Update, Delete, and Bulk APIs support a `refresh` query parameter that controls when changes made by the request are made visible to search. This parameter provides an alternative to calling the Refresh Index API explicitly. 

For more information about the `refresh` parameter, see the [Index Document API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/index-document/), [Update Document API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/update-document/), [Delete Document API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/delete-document/), and [Bulk API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/) documentation.

