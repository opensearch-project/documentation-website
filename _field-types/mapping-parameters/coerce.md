---
layout: default
title: coerce
parent: Mapping parameters
grand_parent: Mapping and field types
nav_order: 15
has_children: false
has_toc: false
---

# `coerce`

The `coerce` mapping parameter controls how values are converted to the expected data type of a field during indexing. By using this parameter, you can ensure your data is properly formatted and indexed according to the expected field types, helping to maintain data integrity and improve the accuracy of your search results.

## Examples

Here are some examples for using the `coerce` mapping parameter.

#### Indexing a document with `coerce` enabled

```json
PUT products
{
  "mappings": {
    "properties": {
      "price": {
        "type": "integer",
        "coerce": true
      }
    }
  }
}

PUT products/_doc/1
{
  "name": "Product A",
  "price": "19.99"
}
```
{% include copy-curl.html %}

In this example, the `price` field is defined as an `integer` type with `coerce` set to `true`. When indexing the document, the string value `19.99` is coerced to the integer `19`.

#### Indexing a document with `coerce` disabled

```json
PUT orders
{
  "mappings": {
    "properties": {
      "quantity": {
        "type": "integer",
        "coerce": false
      }
    }
  }
}

PUT orders/_doc/1
{
  "item": "Widget",
  "quantity": "10"
}
```
{% include copy-curl.html %}

In this example, the `quantity` field is defined as an `integer` type with `coerce` set to `false`. When indexing the document, the string value `10` is not coerced, and the document is rejected due to the type mismatch. 

#### Setting the index-level coercion setting

```json
PUT inventory
{
  "settings": {
    "index.mapping.coerce": false
  },
  "mappings": {
    "properties": {
      "stock_count": {
        "type": "integer",
        "coerce": true
      },
      "sku": {
        "type": "keyword"
      }
    }
  }
}

PUT inventory/_doc/1
{
  "sku": "ABC123",
  "stock_count": "50"
}
```
{% include copy-curl.html %}

In this example, the index-level `index.mapping.coerce` setting is set to `false`, which disables coercion globally. However, the `stock_count` field overrides this setting and enables coercion for that specific field.
