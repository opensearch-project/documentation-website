---
layout: default
title: Scale
parent: Index APIs
nav_order: 50
---

# Scale
**Introduced 3.0**
{: .label .label-purple }

The Scale API allows you to enable or disable the `search_only` mode on an index. When an index is in `search_only` mode, it retains only its search replicas and scales down primary and regular replica shards. This optimization helps reduce resource consumption during periods of low write activity while maintaining search capabilities.

This feature supports scenarios such as scale-to-zero deployments and reader/writer separation patterns, which can significantly improve resource utilization and reduce costs in production environments.

If you are using the Security plugin, you must have the `manage index` privileges.
{: .note}

## Endpoints

```json
POST /<index>/_scale
```

## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `index` | **Required** | String | The name of the index to scale. Wildcards are not supported. |

## Request body fields

The following table lists the available request body fields.

| Field | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `search_only` | **Required** | Boolean | When `true`, enables search-only mode on the index. When `false`, disables search-only mode and restores the index to normal operations. |

## Example requests

### Enable search-only mode

The following request enables search-only mode for an index named `my-index`:

```json
POST /my-index/_scale
{
  "search_only": true
}
```
{% include copy-curl.html %}

### Disable search-only mode

The following request disables search-only mode and returns the index to normal operations:

```json
POST /my-index/_scale
{
  "search_only": false
}
```
{% include copy-curl.html %}

## Example response

The API returns the following response:

```json
{
  "acknowledged": true
}
```
