---
layout: default
title: Copy to
parent: Mapping parameters

nav_order: 20
has_children: false
has_toc: false
canonical_url: https://docs.opensearch.org/latest/field-types/mapping-parameters/copy-to/
---

# Copy to

The `copy_to` parameter allows you to copy the values of multiple fields into a single field. This parameter can be useful if you often search across multiple fields because it allows you to search the group field instead. 

Only the field value is copied and not the terms resulting from the analysis process. The original `_source` field remains unmodified, and the same value can be copied to multiple fields using the `copy_to` parameter. However, recursive copying through intermediary fields is not supported; instead, use `copy_to` directly from the originating field to multiple target fields.

---

## Examples

The following example uses the `copy_to` parameter to search for products by their name and description and copy those values into a single field:

```json
PUT my-products-index
{
  "mappings": {
    "properties": {
      "name": {
        "type": "text",
        "copy_to": "product_info"
      },
      "description": {
        "type": "text",
        "copy_to": "product_info" 
      },
      "product_info": {
        "type": "text"
      },
      "price": {
        "type": "float"
      }
    }
  }
}

PUT my-products-index/_doc/1
{
  "name": "Wireless Headphones",
  "description": "High-quality wireless headphones with noise cancellation",
  "price": 99.99
}

PUT my-products-index/_doc/2
{
  "name": "Bluetooth Speaker",
  "description": "Portable Bluetooth speaker with long battery life",
  "price": 49.99
}
```
{% include copy-curl.html %}

In this example, the values from the `name` and `description` fields are copied into the `product_info` field. You can now search for products by querying the `product_info` field, as follows:

```json
GET my-products-index/_search
{
  "query": {
    "match": {
      "product_info": "wireless headphones"
    }
  }
}
```
{% include copy-curl.html %}

## Response

```json
{
  "took": 20,
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
    "max_score": 1.9061546,
    "hits": [
      {
        "_index": "my-products-index",
        "_id": "1",
        "_score": 1.9061546,
        "_source": {
          "name": "Wireless Headphones",
          "description": "High-quality wireless headphones with noise cancellation",
          "price": 99.99
        }
      }
    ]
  }
}
```

