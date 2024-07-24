---
layout: default
title: mapper-size plugin
parent: Additional Plugins
nav_order: 10
redirect_from:
  - /additional-plugins/mapper-size-plugin/
---

# mapper-size Plugin

The `mapper-size` plugin enables the use of the `_size` field in OpenSearch indices. This field stores the size in bytes of each document.

## Installation

You can install the `mapper-size` plugin using:

```sh
./bin/opensearch-plugin install mapper-size
```

## Usage

After starting up a cluster, create an index with size mapping enabled, index a document, and search for documents:

### Create an Index with Size Mapping Enabled

```sh
curl -XPUT example-index -H "Content-Type: application/json" -d '{
  "mappings": {
    "_size": {
      "enabled": true
    },
    "properties": {
      "name": {
        "type": "text"
      },
      "age": {
        "type": "integer"
      }
    }
  }
}'
```

### Index a Document

```sh
curl -XPOST example-index/_doc -H "Content-Type: application/json" -d '{
  "name": "John Doe",
  "age": 30
}'
```

### Query the Index

```sh
curl -XGET example-index/_search -H "Content-Type: application/json" -d '{
  "query": {
    "match_all": {}
  },
  "stored_fields": ["_size", "_source"]
}'
```

### Query Results

```json
{
  "took": 2,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1.0,
    "hits": [
      {
        "_index": "example_index",
        "_id": "Pctw0I8BLto8I5f_NLKK",
        "_score": 1.0,
        "_size": 37,
        "_source": {
          "name": "John Doe",
          "age": 30
        }
      }
    ]
  }
}
```

In this example, the `_size` field is included in the query results. The `_size` field shows the size in bytes of the indexed document.