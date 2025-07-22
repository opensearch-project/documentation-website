---
layout: default
title: Resolve index
parent: Index APIs
nav_order: 120
---

# Resolve Index API

The Resolve Index API helps you understand how OpenSearch resolves aliases, data streams, and concrete indexes that match a specified name or wildcard expression.

## Endpoints

```json
GET /_resolve/index/<name>
```

## Path parameters

The following table lists the available path parameters. All path parameters are required.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `name` | String | The name, alias, data stream, or wildcard expression to resolve. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `expand_wildcards` | String | Controls how wildcard expressions expand to matching indexes. Multiple values can be combined using commas. Valid values are:<br>• `all` – Expand to open and closed indexes, including hidden ones.<br>• `open` – Expand only to open indexes.<br>• `closed` – Expand only to closed indexes.<br>• `hidden` – Include hidden indexes (must be used with `open`, `closed`, or both).<br>• `none` – Wildcard expressions are not accepted.<br>**Default**: `open`. |

## Example requests

The following sections provide example Resolve API requests.


### Resolve a concrete index


```json
GET _resolve/index/my-index-001
```
{% include copy-curl.html %}

### Resolve indexes using a wildcard


```json
GET _resolve/index/my-index-*
```
{% include copy-curl.html %}

### Resolve a data stream or alias

If an alias or data stream named `logs-app` exists, use the following request to resolve it:

```json
GET _resolve/index/logs-app
```
{% include copy-curl.html %}

### Resolve hidden indexes using a wildcard in a remote cluster

The following example shows an API request using a wildcard, a remote cluster, and `expand_wildcards` configured to `hidden`:

```json
GET _resolve/index/my-index-*,remote-cluster:my-index-*?expand_wildcards=hidden
```
{% include copy-curl.html %}

## Example response

```json
{
  "indices": [
    {
      "name": "my-index-001",
      "attributes": [
        "open"
      ]
    }
  ],
  "aliases": [],
  "data_streams": []
}
```

## Response body fields

| Field | Data type | Description |
| :--- | :--- | :--- |
| `indices` | Array | A list of resolved concrete indexes. |
| `aliases` | Array | A list of resolved index aliases. |
| `data_streams` | Array | A list of matched data streams. |

## Required permissions

If you are using the Security plugin, the user running these queries needs to have at least `read` permissions for the resolved index. 
