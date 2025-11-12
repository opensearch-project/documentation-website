---
layout: default
title: Join
nav_order: 44
has_children: false
parent: Object field types
grand_parent: Supported field types
redirect_from:
  - /field-types/supported-field-types/join/
  - /opensearch/supported-field-types/join/
  - /field-types/join/
---

# Join field type
**Introduced 1.0**
{: .label .label-purple }

A `join` field type defines a parent/child relationship between documents within the same index. It is a field that records how documents are related so that queries can connect related documents:

- Defines the relationship names: Specifies the names for the parent and child types (for example, `brand` and `product`).
- Stores relationship metadata: Identifies which documents are parents, which are children, and how they are connected.
- Enables parent/child queries: Supports `join` queries that find parents by children or children by parents.

## Example

The following example creates an index in which brands are parents and products are children. 

### Step 1: Create the mapping

Create a mapping to establish a parent/child relationship between products and their brands. The `name` field stores product or brand names. The `product_to_brand` field is a `join` field that defines a `"brand": "product"` relation, indicating that `brand` documents can have `product` children:

```json
PUT testindex1
{
  "mappings": {
    "properties": {
      "name": {
        "type": "text"
      },
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

### Step 2: Index parent documents (brands)

Index a parent document representing a brand and define its role in a parent/child relationship (`"brand"`) in the `product_to_brand`  field:

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

### Step 3: Index child documents (products)

When indexing child documents, you must specify the `routing` query parameter because parent and child documents in the same parent/child hierarchy must be indexed on the same shard. For more information, see [Routing]({{site.url}}{{site.baseurl}}/mappings/metadata-fields/routing/).

Each child document refers to its parent's ID in the `parent` field of the `join` field.

Index two child documents representing products. For each document, define its role in the parent/child relationship (`"product"`) in the `product_to_brand` field, specifying that they belong to brand with ID `1`:

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

After this step, the index contains three documents with this structure.

| Document ID | Document Type | `name` field | `product_to_brand` field |
|-------------|---------------|--------------|--------------------------|
| 1 | Parent (brand) | "Brand 1" | `{"name": "brand"}` |
| 3 | Child (product) | "Product 1" | `{"name": "product", "parent": "1"}` |
| 4 | Child (product) | "Product 2" | `{"name": "product", "parent": "1"}` |


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

## Next steps

- Learn about [joining queries]({{site.url}}{{site.baseurl}}/query-dsl/joining/) on join fields.
- Learn more about [retrieving inner hits]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/inner-hits/).