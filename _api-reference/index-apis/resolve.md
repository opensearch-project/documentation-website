---
layout: default
title: Resolve index
parent: Index APIs
nav_order: 63
---

# Resolve index

Introduced 1.0
{: .label .label-purple }

The Resolve Index API lists the indexes, aliases, and data streams based on the specified name. Multiple patterns and remote clusters are supported.

## Path and HTTP methods

The Resolve Index API supports the following API method:

```
GET /_resolve/index/<name>
```
{% include copy-curl.html %}

## Permissions

When OpenSearch Security is enabled, you must have the `view_index_metadata` or `manage` index permissions for the target data stream, index, or index alias. <!-----FOLLOW UP, Is there a distinction between index permissions and index privileges?>

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `<index>` | String | A comma-separated list of indexes, data streams, or index aliases to which the operation is applied. Supports wildcard expressions (`*`). Use `_all` or `*` to specify all indexes and data streams in a cluster. |

## Query parameters

The Resolve Index API supports the following optional query parameters:

Parameter | Type | Description
:--- | :--- | :---
`allow_no_indices` | Boolean | Whether to ignore wildcards that don’t match any indexes. Default is `true`.
allow_partial_search_results | Boolean | Whether to return partial results if the request runs into an error or times out. Default is `true`.
`expand_wildcards` | String | Specifies the type of index that wildcard expressions can match. Supports comma-separated values. Valid values are `all` (match any index), `open` (match open, non-hidden indexes), `closed` (match closed, non-hidden indexes), `hidden` (match hidden indexes), and `none` (deny wildcard expressions). Default is `open`.
`ignore_unavailable` |  Boolean | Specifies whether to include missing or closed indexes in the response and ignores unavailable shards during the search request. Default is `false`.
`ignore_throttled` | Boolean | Whether to ignore concrete, expanded, or indexes with aliases if indexes are frozen. Default is `true`.

## Example request

The following example lists all indexes that start with the letter `h`, from a remote cluster named `bar`, with all wildcards expanded:

```
GET /_resolve/index/h*,remoteCluster1:bar*?expand_wildcards=all
```

## Example response

The response lists each index, alias, and data stream matching the expression, as shown in the following example:

```
{
  "indices": [
    {
      "name": "hamlet",
      "attributes": [
        "open"
      ]
    }
  ],
  "aliases": [                                 
    {
      "name": "h-alias",
      "indices": [
        "freeze-index",
        "my-index-000001"
      ]
    }
  ],
  "data_streams": [                            
    {
      "name": "ham",
      "backing_indices": [
        ".ds-ham-2099.02.06-000001"
      ],
      "timestamp_field": "@timestamp"
    }
  ]
}
```

The response lists each index, alias, and data stream matching the expression.



