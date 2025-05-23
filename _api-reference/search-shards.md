---
layout: default
title: Search shards
nav_order: 85
---

# Search shards API

The `_search_shards` API provides information about which shards OpenSearch would query for a given search request. This API does not execute the search but allows you to inspect routing decisions, shard distribution, and the nodes that would handle the request.

## Endpoints

```json
GET /_search_shards
GET /<index>/_search_shards
POST /_search_shards
POST /<index>/_search_shards
```

## Path parameters

| Parameter | Type   | Description                                            |
| --------- | ------ | ------------------------------------------------------ |
| `<index>` | string | (Optional) Comma-separated list of target index names. |

## Query parameters

| Parameter    | Type   | Description                                                              |
| ------------ | ------ | ------------------------------------------------------------------------ |
| `routing`    | string | Custom routing value to control which shard(s) will handle the request.  |
| `preference` | string | Defines how to prefer shards during search (e.g., `_local`, `_primary`). |

## Request body

The body can include a full search query to simulate how the request would be routed.

```json
{
  "query": {
    "term": {
      "user": "alice"
    }
  }
}
```

## Example

Create index:

```json
PUT /logs-demo
{
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 0
  },
  "mappings": {
    "properties": {
      "user": { "type": "keyword" },
      "message": { "type": "text" },
      "@timestamp": { "type": "date" }
    }
  }
}
```
{% include copy-curl.html %}

Index first document with `routing=user1`:

```json
POST /logs-demo/_doc?routing=user1
{
  "@timestamp": "2025-05-23T10:00:00Z",
  "user": "user1",
  "message": "User login successful"
}
```
{% include copy-curl.html %}

Index second document with `routing=user2`:

```json
POST /logs-demo/_doc?routing=user2
{
  "@timestamp": "2025-05-23T10:01:00Z",
  "user": "user2",
  "message": "User login failed"
}
```
{% include copy-curl.html %}

Simulate routing with `_search_shards`

```json
POST /logs-demo/_search_shards?routing=user1
{
  "query": {
    "term": {
      "user": "user1"
    }
  }
}
```
{% include copy-curl.html %}

## Response body fields

| Field             | Type              | Description                                                                 |
|------------------|-------------------|-----------------------------------------------------------------------------|
| `nodes`          | object            | Map of node IDs to node metadata (name, transport address, etc.)           |
| `indices`        | object            | Map of index names included in the request                                 |
| `shards`         | array of arrays   | Nested arrays representing shard copies (primary/replica) for the request  |
| `shards.index` | string            | Name of the index                                                           |
| `shards.shard` | integer           | Shard number                                                               |
| `shards.node`  | string            | Node ID handling this shard                                                |
| `shards.primary` | boolean         | Whether this is a primary shard                                            |
| `shards.state` | string            | Current state of the shard (e.g., STARTED)                                 |
| `shards.allocation_id.id` | string | Unique ID for this shard allocation                                        |
