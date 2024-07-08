---
layout: default
title: Create or update alias
parent: Index APIs
nav_order: 5
---

# Create or update alias
**Introduced 1.0**
{: .label .label-purple }

You can use this API to add a data stream or index to an alias, or update the settings for an existing alias.


## Example

```json
POST sample-index/_alias/sample-alias
```

```json
POST sample-index/_alias/sample-alias
{
  "routing":"test"
}
```
{% include copy-curl.html %}

## Path and HTTP methods

```
POST /<target>/_alias/<alias-name>
PUT /<target>/_alias/<alias-name>
POST /_alias/<alias-name>
PUT /_alias/<alias-name>
POST /<target>/_aliases/<alias-name>
PUT /<target>/_aliases/<alias-name>
POST /_aliases/<alias-name>
PUT /_aliases/<alias-name>
POST /<target>/_aliases
PUT /<target>/_aliases
PUT /_alias
```

## Path parameters

| Parameter | Data type | Description |
:--- | :--- | :---
| target | String | Comma-delimited list of data streams, indexes. Wildcard expressions (`*`) are supported. To target all data streams and indexes in a cluster, use `_all` or `*`. Optional. |
| alias-name | String | The alias name to be created or updated. Optional. |

## Query parameters

All query parameters are optional.

Parameter | Data Type | Description
:--- | :--- | :---
cluster_manager_timeout | Time | The amount of time to wait for a response from the cluster manager node. Default is `30s`.
timeout | Time | The amount of time to wait for a response from the cluster. Default is `30s`.

## Request body

In the request body, you can specify the index name, the alias name, and the settings for the alias. All fields are optional.

Field | Data Type | Description
:--- | :--- | :--- | :---
index | String | Comma-delimited list of data streams orindexes you want to associate with the alias. If this field is set, it will override the index name specified in the URL path.
alias | String | The name of the alias. If this field is set, it will override the alias name specified in the URL path.
is_write_index | Boolean | Specifies whether the index should be a write index. An alias can only have one write index at a time. If a write request is submitted to a alias that links to multiple indexes, OpenSearch executes the request only on the write index.
routing | String | Used to assign a custom value to a shard for specific operations. 
index_routing | String | Assigns a custom value to a shard only for index operations. 
search_routing | String | Assigns a custom value to a shard only for search operations. 
filter | Object | A filter to use with the alias, so the alias points to a filtered part of the index.

## Response

```json
{
    "acknowledged": true
}
```

For more alias API operations, see [Index aliases]({{site.url}}{{site.baseurl}}/opensearch/index-alias/).
