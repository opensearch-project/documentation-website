---
layout: default
title: Scale
parent: Index APIs
nav_order: 50
---

# Scale
**Introduced 3.0**
{: .label .label-purple }

The Scale API allows you to enable or disable `search_only` mode on an index. In `search_only` mode, an index retains only its search replicas, scaling down primary and regular replica shards. This feature supports scenarios such as scale-to-zero and reader/writer separation, helping optimize resources during periods of reduced write traffic.

If you use the Security plugin, you must have the `manage index` privileges.
{: .note}

## Endpoints

```json
POST /<index>/_scale
```

## Path parameters

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| index | String | The name of the index to scale. Wildcards are not supported. |

## Request body fields

| Field | Data Type | Description | Required |
| :--- | :--- | :--- | :--- |
| search_only | Boolean | Enables (`true`) or disables (`false`) search-only mode on the index. | Yes |

## Example requests

### Enable search-only mode

```json
POST /my-index/_scale
{
  "search_only": true
}
```
{% include copy-curl.html %}

### Disable search-only mode

```json
POST /my-index/_scale
{
  "search_only": false
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "acknowledged": true
}
```