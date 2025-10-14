---
layout: default
title: Coerce
parent: Mapping parameters

nav_order: 15
has_children: false
has_toc: false
canonical_url: https://docs.opensearch.org/latest/field-types/mapping-parameters/coerce/
---

# Coerce

The `coerce` mapping parameter controls how values are converted to the expected field data type during indexing. This parameter lets you verify that your data is formatted and indexed properly, following the expected field types. This improves the accuracy of your search results.

---

## Examples

The following examples demonstrate how to use the `coerce` mapping parameter.

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

In this example, the `quantity` field is defined as an `integer` type with `coerce` set to `false`. When indexing the document, the string value `10` is not coerced, and the document is rejected because of the type mismatch. 

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

In this example, the index-level `index.mapping.coerce` setting is set to `false`, which disables coercion for the index. However, the `stock_count` field overrides this setting and enables coercion for this specific field.
