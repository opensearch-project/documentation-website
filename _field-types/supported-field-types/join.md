---
layout: default
title: Join
nav_order: 44
has_children: false
parent: Object field types
grand_parent: Supported field types
redirect_from:
  - /opensearch/supported-field-types/join/
  - /field-types/join/
---

# Join field type

A join field type establishes a parent/child relationship between documents in the same index. 

## Example

Create a mapping to establish a parent-child relationship between products and their brands:

```json
PUT testindex1
{
  "mappings": {
    "properties": {
      "product_to_brand": { 
        "type": "join",
        "relations": {
          "brand": "product" 
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Then, index a parent document with a join field type:

```json
PUT testindex1/_doc/1
{
  "name": "Brand 1",
  "product_to_brand": {
    "name": "brand" 
  }
}
```
{% include copy-curl.html %}

You can also use a shortcut without object notation to index a parent document:

```json
PUT testindex1/_doc/1
{
  "name": "Brand 1",
  "product_to_brand" : "brand" 
}
```
{% include copy-curl.html %}

When indexing child documents, you have to specify the `routing` query parameter because parent and child documents in the same relation have to be indexed on the same shard. Each child document refers to its parent's ID in the `parent` field.

Index two child documents, one for each parent:

```json
PUT testindex1/_doc/3?routing=1
{
  "name": "Product 1",
  "product_to_brand": {
    "name": "product", 
    "parent": "1" 
  }
}
```
{% include copy-curl.html %}

```json
PUT testindex1/_doc/4?routing=1
{
  "name": "Product 2",
  "product_to_brand": {
    "name": "product", 
    "parent": "1" 
  }
}
```
{% include copy-curl.html %}

## Querying a join field

When you query a join field, the response contains subfields that specify whether the returned document is a parent or a child. For child objects, the parent ID is also returned.

### Search for all documents

```json
GET testindex1/_search
{
  "query": {
    "match_all": {}
  }
}
```
{% include copy-curl.html %}

The response indicates whether a document is a parent or a child:

```json
{
  "took" : 4,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 3,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "testindex1",
        "_type" : "_doc",
        "_id" : "1",
        "_score" : 1.0,
        "_source" : {
          "name" : "Brand 1",
          "product_to_brand" : {
            "name" : "brand"
          }
        }
      },
      {
        "_index" : "testindex1",
        "_type" : "_doc",
        "_id" : "3",
        "_score" : 1.0,
        "_routing" : "1",
        "_source" : {
          "name" : "Product 1",
          "product_to_brand" : {
            "name" : "product",
            "parent" : "1"
          }
        }
      },
      {
        "_index" : "testindex1",
        "_type" : "_doc",
        "_id" : "4",
        "_score" : 1.0,
        "_routing" : "1",
        "_source" : {
          "name" : "Product 2",
          "product_to_brand" : {
            "name" : "product",
            "parent" : "1"
          }
        }
      }
    ]
  }
}
```

### Search for all children of a parent 

Find all products associated with Brand 1:

```json
GET testindex1/_search
{
  "query" : {
    "has_parent": {
      "parent_type":"brand",
      "query": {
        "match" : {
          "name": "Brand 1"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains Product 1 and Product 2, which are associated with Brand 1:

```json
{
  "took" : 7,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "testindex1",
        "_type" : "_doc",
        "_id" : "3",
        "_score" : 1.0,
        "_routing" : "1",
        "_source" : {
          "name" : "Product 1",
          "product_to_brand" : {
            "name" : "product",
            "parent" : "1"
          }
        }
      },
      {
        "_index" : "testindex1",
        "_type" : "_doc",
        "_id" : "4",
        "_score" : 1.0,
        "_routing" : "1",
        "_source" : {
          "name" : "Product 2",
          "product_to_brand" : {
            "name" : "product",
            "parent" : "1"
          }
        }
      }
    ]
  }
}
```

### Search for the parent of a child

Find the parent of Product 1:

```json
GET testindex1/_search
{
  "query" : {
    "has_child": {
      "type":"product",
      "query": {
        "match" : {
            "name": "Product 1"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response returns Brand 1 as Product 1's parent:

```json
{
  "took" : 4,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 1,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "testindex1",
        "_type" : "_doc",
        "_id" : "1",
        "_score" : 1.0,
        "_source" : {
          "name" : "Brand 1",
          "product_to_brand" : {
            "name" : "brand"
          }
        }
      }
    ]
  }
}
```

## Parent with many children

One parent can have many children. Create a mapping with multiple children:

```json
PUT testindex1
{
  "mappings": {
    "properties": {
      "parent_to_child": {
        "type": "join",
        "relations": {
          "parent": ["child 1", "child 2"]  
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Join field type notes 

- There can only be one join field mapping in an index.
- You need to provide the routing parameter when retrieving, updating, or deleting a child document. This is because parent and child documents in the same relation have to be indexed on the same shard.
- Multiple parents are not supported. 
- You can add a child document to an existing document only if the existing document is already marked as a parent.
- You can add a new relation to an existing join field.
