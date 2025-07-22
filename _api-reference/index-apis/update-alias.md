---
layout: default
title: Create or update alias
parent: Index APIs
nav_order: 160
---

# Create Or Update Alias API

**Introduced 1.0**
{: .label .label-purple }

The Create or Update Alias API adds one or more indexes to an alias or updates the settings for an existing alias. For more alias API operations, see [Index aliases]({{site.url}}{{site.baseurl}}/opensearch/index-alias/).

The Create or Update Alias API is distinct from the [Alias API]({{site.url}}{{site.baseurl}}/opensearch/rest-api/alias/), which supports the addition and removal of aliases and the removal of alias indexes. In contrast, the following API only supports adding or updating an alias without updating the index itself. Each API also uses different request body parameters.
{: .note}

## Endpoints

```json
POST /<target>/_alias/<alias-name>
PUT /<target>/_alias/<alias-name>
POST /_alias/<alias-name>
PUT /_alias/<alias-name>
POST /<target>/_aliases/<alias-name>
PUT /<target>/_aliases/<alias-name>
POST /_aliases/<alias-name>
PUT /_aliases/<alias-name>
PUT /<target>/_alias
PUT /<target>/_aliases
PUT /_alias
```

## Path parameters

| Parameter | Type | Description |
:--- | :--- | :---
| `target` | String | A comma-delimited list of indexes. Wildcard expressions (`*`) are supported. To target all indexes in a cluster, use `_all` or `*`. Optional. |
| `alias-name` | String | The alias name to be created or updated. Optional. |

## Query parameters

All query parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
`cluster_manager_timeout` | Time | The amount of time to wait for a response from the cluster manager node. Default is `30s`.
`timeout` | Time | The amount of time to wait for a response from the cluster. Default is `30s`.

## Request body

In the request body, you can specify the index name, the alias name, and the settings for the alias. All fields are optional.

Field | Type | Description
:--- | :--- | :--- | :---
`index` | String | A comma-delimited list of indexes that you want to associate with the alias. If this field is set, it will override the index name specified in the URL path.
`alias` | String | The name of the alias. If this field is set, it will override the alias name specified in the URL path.
`is_write_index` | Boolean | Specifies whether the index should be a write index. An alias can only have one write index at a time. If a write request is submitted to an alias that links to multiple indexes, then OpenSearch runs the request only on the write index.
`routing` | String | Assigns a custom value to a shard for specific operations. 
`index_routing` | String | Assigns a custom value to a shard only for index operations. 
`search_routing` | String | Assigns a custom value to a shard only for search operations. 
`filter` | Object | A filter to use with the alias so that the alias points to a filtered part of the index.

## Example request

The following example request adds a sample alias with a custom routing value:

```json
POST sample-index/_alias/sample-alias
{
  "routing":"test"
}
```
{% include copy-curl.html %}

## Example response

```json
{
    "acknowledged": true
}
```

For more alias API operations, see [Index aliases]({{site.url}}{{site.baseurl}}/opensearch/index-alias/).
