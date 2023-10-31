---
layout: default
title: Popular APIs
nav_order: 96
redirect_from:
  - /opensearch/popular-api/
---

# Popular APIs
**Introduced 1.0**
{: .label .label-purple }

This page contains example requests for popular OpenSearch operations.


---

#### Table of contents
1. TOC
{:toc}


---

## Create index with non-default settings

```json
PUT my-logs
{
  "settings": {
    "number_of_shards": 4,
    "number_of_replicas": 2
  },
  "mappings": {
    "properties": {
      "title": {
        "type": "text"
      },
      "year": {
        "type": "integer"
      }
    }
  }
}
```


## Index a document with a random ID

```json
POST my-logs/_doc
{
  "title": "Your Name",
  "year": "2016"
}
```


## Index a document with a specific ID

```json
PUT my-logs/_doc/1
{
  "title": "Weathering with You",
  "year": "2019"
}
```


## Index several documents at once

The blank line at the end of the request body is required. If you omit the `_id` field, OpenSearch generates a random ID.

```json
POST _bulk
{ "index": { "_index": "my-logs", "_id": "2" } }
{ "title": "The Garden of Words", "year": 2013 }
{ "index" : { "_index": "my-logs", "_id" : "3" } }
{ "title": "5 Centimeters Per Second", "year": 2007 }

```


## List all indexes

```
GET _cat/indices?v&expand_wildcards=all
```


## Open or close all indexes that match a pattern

```
POST my-logs*/_open
POST my-logs*/_close
```


## Delete all indexes that match a pattern

```
DELETE my-logs*
```


## Create an index alias

This request creates the alias `my-logs-today` for the index `my-logs-2019-11-13`.

```
PUT my-logs-2019-11-13/_alias/my-logs-today
```


## List all aliases

```
GET _cat/aliases?v
```


## Search an index or all indexes that match a pattern

```
GET my-logs/_search?q=test
GET my-logs*/_search?q=test
```


## Get cluster settings, including defaults

```
GET _cluster/settings?include_defaults=true
```


## Change disk watermarks (or other cluster settings)

```json
PUT _cluster/settings
{
  "transient": {
    "cluster.routing.allocation.disk.watermark.low": "80%",
    "cluster.routing.allocation.disk.watermark.high": "85%"
  }
}
```


## Get cluster health

```
GET _cluster/health
```


## List nodes in the cluster

```
GET _cat/nodes?v
```


## Get node statistics

```
GET _nodes/stats
```


## Get snapshots in a repository

```
GET _snapshot/my-repository/_all
```


## Take a snapshot

```
PUT _snapshot/my-repository/my-snapshot
```


## Restore a snapshot

```json
POST _snapshot/my-repository/my-snapshot/_restore
{
  "indices": "-.opendistro_security",
  "include_global_state": false
}
```
