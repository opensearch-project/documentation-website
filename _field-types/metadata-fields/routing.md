---
layout: default
title: Routing
nav_order: 35
has_children: false
parent: Metadata fields
---

# Routing

Documents are routed to specific shards within an index using a hashing algorithm. By default, the document's `_id` field is used as the routing value, but you can also specify a custom routing value for each document.

## Default routing

The following formula is the default routing formula used in OpenSearch. The `_routing` value is the document's `_id`. 

```json
shard_num = hash(_routing) % num_primary_shards
```

## Custom routing

You can specify a custom routing value when indexing a document, as shown in the following example: 

```json
PUT sample-index1/_doc/1?routing=JohnDoe1
{
  "title": "This is a document"
}
```
{% include copy-curl.html %}

In this example, the document is routed using the value `JohnDoe1` instead of the default `_id`.

You must provide the same routing value when retrieving, deleting, or updating the document, as shown in the following example:

```json
GET sample-index1/_doc/1?routing=JohnDoe1
```
{% include copy-curl.html %}

## Querying by routing

You can query documents based in their routing value using the `_routing` field, as shown in the following example. This query only searches the shard(s) associated with the `JohnDoe1` routing value.

```json
GET sample-index1/_search
{
  "query": {
    "terms": {
      "_routing": [ "JohnDoe1" ]
    }
  }
}
```
{% include copy-curl.html %}

## Required routing

You can make custom routing a required field for all CRUD operations on an index, as shown in the following example. If you try to index a document without providing a routing value, OpenSearch throws an exception.
.

```json
PUT sample-index2
{
  "mappings": {
    "_routing": {
      "required": true
    }
  }
}
```
{% include copy-curl.html %}

## Routing to index partitions

You can configure an index to route documents to a subset of shards, rather than a single shard. This is done using the `index.routing_partition_size` setting, as shown in the following example: 

```json
PUT sample-index3
{
  "settings": {
    "index.routing_partition_size": 4
  },
  "mappings": {
    "_routing": {
      "required": true
    }
  }
}
```
{% include copy-curl.html %}

In this example, the documents are routed to one of four partitions within the index, based on a combination of the `_routing` and `_id` fields.

Partitioned indexes have some limitations, such as not supporting `join` field relationships in the mappings.
