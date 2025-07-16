---
layout: default 
title: Shard stores 
parent: Cluster APIs 
nav_order: 70
---

# Shard stores

The `_shard_stores` API provides information about the shard copies for one or more indexes. This API helps to diagnose issues with unallocated shards by indicating why shards are unassigned and providing their current states.

## Endpoints
```json
GET /_shard_stores
GET /{index}/_shard_stores
```

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `index` | List or String | List of data streams, indexes, and aliases used to limit the request. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description | Default |
| `allow_no_indices` | Boolean | If `false`, the request returns an error if any wildcard expression, index alias, or `_all` value targets only missing or closed indexes. This behavior applies even if the request targets other open indexes. | `false` |
| `expand_wildcards` | List or String | Type of index that wildcard patterns can match. If the request can target data streams, this argument determines whether wildcard expressions match hidden data streams. <br> Valid values are: <br> - `all`: Match any index, including hidden ones. <br> - `closed`: Match closed, non-hidden indexes. <br> - `hidden`: Match hidden indexes. Must be combined with open, closed, or both. <br> - `none`: Wildcard expressions are not accepted. <br> - `open`: Match open, non-hidden indexes. | `open`  |
| `ignore_unavailable` | Boolean | If `true`, missing or closed indexes are not included in the response. | `false` |
| `status` | List or String | List of shard health statuses used to limit the request. <br> Valid values are: <br> - `all`: Return all shards, regardless of health status. <br> - `green`: The primary shard and all replica shards are assigned. <br> - `red`: The primary shard is unassigned. <br> - `yellow`: One or more replica shards are unassigned. | `yellow,red` |

## Example

Create an index with multiple primary shards on a single-node cluster:

```json
PUT /logs-shardstore
{
  "settings": {
    "number_of_shards": 2,
    "number_of_replicas": 0
  },
  "mappings": {
    "properties": {
      "timestamp": { "type": "date" },
      "message": { "type": "text" }
    }
  }
}
```
{% include copy-curl.html %}

Index a document:

```json
POST /logs-shardstore/_doc
{
  "timestamp": "2025-06-20T12:00:00Z",
  "message": "Log message 1"
}
```
{% include copy-curl.html %}

Get shard store status for the `logs-shardstore` index:

```json
GET /logs-shardstore/_shard_stores?status=all
```
{% include copy-curl.html %}

## Example response

The response lists the stores that were assigned to each shard. If a shard has no assigned stores, it is marked `unassigned`:

```json
{
  "indices": {
    "logs-shardstore": {
      "shards": {
        "0": {
          "stores": [
            {
              "UFyVYVMCSDOObiRwPxSW5w": {
                "name": "opensearch-node1",
                "ephemeral_id": "vkSB_-M7QVyFXvgda6oRZg",
                "transport_address": "172.19.0.2:9300",
                "attributes": {
                  "shard_indexing_pressure_enabled": "true"
                }
              },
              "allocation_id": "PEM5YjEWSz-jJEj-Not6Aw",
              "allocation": "primary"
            }
          ]
        },
        "1": {
          "stores": []
        }
      }
    }
  }
}
```

## Response body fields

The following table lists all response body fields.

| Field | Data type | Description|
| `indices` | Object| Contains shard store information for each index. |
| `indices.<index>.shards`| Object| Contains store data for each shard in the index. |
| `shards.<shard_id>.stores`| Array |  A list of store entries for the shard.|
| `stores[n].<node_id>` | Object| Node metadata, including name, transport address, and attributes. |
| `stores[n].allocation`| String| The shard role on this node (`primary` or `replica`). |
| `stores[n].allocation_id` | String| The unique allocation ID for this shard copy.|
| `stores[n].store_exception` | Object (optional) | Stores exceptions encountered when reading the shard store. |
| `stores[n].store_exception.type`| String| The type of exception.|
| `stores[n].store_exception.reason`| String| The reason message for the exception.|
