---
layout: default
title: Mapper-size plugin
parent: Installing plugins
nav_order: 20

canonical_url: https://docs.opensearch.org/latest/install-and-configure/additional-plugins/mapper-size-plugin/
---

# Mapper-size plugin

The `mapper-size` plugin enables the use of the `_size` field in OpenSearch indexes. The `_size` field stores the size, in bytes, of each document.

## Installing the plugin

You can install the `mapper-size` plugin using the following command:

```sh
./bin/opensearch-plugin install mapper-size
```

## Examples

After starting up a cluster, you can create an index with size mapping enabled, index a document, and search for documents, as shown in the following examples.

### Create an index with size mapping enabled

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

### Index a document

```sh
curl -XPOST example-index/_doc -H "Content-Type: application/json" -d '{
  "name": "John Doe",
  "age": 30
}'
```

### Query the index

```sh
curl -XGET example-index/_search -H "Content-Type: application/json" -d '{
  "query": {
    "match_all": {}
  },
  "stored_fields": ["_size", "_source"]
}'
```

### Query results

In the following example, the `_size` field is included in the query results and shows the size, in bytes, of the indexed document:

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

