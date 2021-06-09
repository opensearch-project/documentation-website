---
layout: default
title: Create indices
parent: REST API reference
grand_parent: OpenSearch
nav_order: 5
---

# Create indices

While you can create an index by using a document as a base, you can also just create an empty index for use later.

## Example

**Sample Request**
```json
PUT /sample-index1
```

**Sample Response**
```json
{
    "acknowledged": true,
    "shards_acknowledged": true,
    "index": "sample-index1"
}
```

## Path and HTTP methods
```
PUT /<index-name>
```

## Index naming restrictions

OpenSearch Indices have the following naming restrictions:

- All letters must be lowercase.
- Index names can't begin with underscores (`_`) or hyphens (`-`).
- Index names can't contain spaces, commas, or the following characters:

  `:`, `"`, `*`, `+`, `/`, `\`, `|`, `?`, `#`, `>`, or `<`

## URL parameters

You can include the following URL parameters in your request. All parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
include_type_name | Boolean | If `true`, the request expects a type in the body of mappings. Default is `false`.
wait_for_active_shards | String | Specifies the number of active shards that must be available before OpenSearch processes the request. Default is 1 (only the primary shard). Set to `all` or a positive integer. Values greater than 1 require replicas. For example, if you specify a value of 3, the index must have two replicas distributed across two additional nodes for the request to succeed.
master_timeout | Time | How long to wait for a connection to the master node. Default `30s`.
timeout | Time | How long to wait for the request to return. Default `30s`.

## Request body

You can also supply the following optional parameters in your HTTP request body.

Parameter | Description
:--- | :---
settings | Configuration settings for the index. Available options include `number_of_shards`, `number_of_replicas`, `refresh_interval`, and others.
mappings | Definitions of how a document and its fields are stored and indexed.
alias    | A virtual index name that references one or more indices. Because changing an alias's reference index is an atomic operation, aliases offer the benefit of reindexing data without any downtime. See [Index Aliases] (../index-alias) to learn more.

The following example demonstrates how to create an index with specifies numbers of shards and replicas, specifies that `age` is of type `integer`, and assigns a `sample-alias1` alias to the index.

**Sample Request**
```json
PUT /sample-index1

{
  "settings": {
    "index": {
      "number_of_shards": 2,
      "number_of_replicas": 1
    }
  },
  "mappings": {
    "properties": {
      "age": {
        "type": "integer"
      }
    }
  },
  "aliases": {
    "sample-alias1": {}
  }
}
```

**Sample Response**
```json
{
    "acknowledged": true,
    "shards_acknowledged": true,
    "index": "sample-index1"
}
```
