---
layout: default
title: Alias
parent: Index APIs
nav_order: 5
redirect_from: 
 - /opensearch/rest-api/alias/
 - /api-reference/alias/
---

# Alias
**Introduced 1.0**
{: .label .label-purple }

An alias is a virtual pointer that you can use to reference one or more indexes. Creating and updating aliases are atomic operations, so you can reindex your data and point an alias at it without any downtime.


## Example

```json
POST _aliases
{
  "actions": [
    {
      "add": {
        "index": "movies",
        "alias": "movies-alias1"
      }
    },
    {
      "remove": {
        "index": "old-index",
        "alias": "old-index-alias"
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Path and HTTP methods

```
POST _aliases
```

## URL parameters

All alias parameters are optional.

Parameter | Data Type | Description
:--- | :--- | :---
cluster_manager_timeout | Time | The amount of time to wait for a response from the cluster manager node. Default is `30s`.
timeout | Time | The amount of time to wait for a response from the cluster. Default is `30s`.

## Request body

In your request body, you need to specify what action to take, the alias name, and the index you want to associate with the alias. Other fields are optional.

Field | Data Type | Description | Required
:--- | :--- | :--- | :---
actions | Array | Set of actions you want to perform on the index. Valid options are: `add`, `remove`, and `remove_index`. You must have at least one action in the array. | Yes
add | N/A | Adds an alias to the specified index. | No
remove | N/A | Removes an alias from the specified index. | No
remove_index | N/A | Deletes an index. | No
index | String | Name of the index you want to associate with the alias. Supports wildcard expressions. | Yes if you don't supply an `indices` field in the body.
indices | Array | Array of index names you want to associate with the alias. | Yes if you don't supply an `index` field in the body.
alias | String | The name of the alias. | Yes if you don't supply an `aliases` field in the body.
aliases | Array | Array of alias names. | Yes if you don't supply an `alias` field in the body.
filter | Object | A filter to use with the alias, so the alias points to a filtered part of the index. | No
is_hidden | Boolean | Specifies whether the alias should be hidden from results that include wildcard expressions | No
must_exist | Boolean | Specifies whether the alias to remove must exist. | No
is_write_index | Boolean | Specifies whether the index should be a write index. An alias can only have one write index at a time. If a write request is submitted to a alias that links to multiple indexes, OpenSearch executes the request only on the write index. | No
routing | String | Used to assign a custom value to a shard for specific operations. | No
index_routing | String | Assigns a custom value to a shard only for index operations. | No
search_routing | String | Assigns a custom value to a shard only for search operations. | No

## Response

```json
{
    "acknowledged": true
}
```

For more alias API operations, see [Index aliases]({{site.url}}{{site.baseurl}}/opensearch/index-alias/).