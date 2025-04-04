---
layout: default
title: Meta
parent: Mapping parameters
grand_parent: Mapping and field types
nav_order: 100
has_children: false
has_toc: false
---

# Meta

The `meta` mapping parameter allows you to attach arbitrary metadata to your mapping definition. This metadata is stored alongside your mapping and is returned when the mapping is retrieved, serving solely as informational context without influencing indexing or search operations.

You can use `meta` mapping parameter to document important details such as version information, descriptions, or authorship. Metadata can also be updated by submitting a mapping update which will override the existing metadata.


## Enabling meta on a mapping

The following request creates an index named `products` with a `meta` mapping parameter containing version and description details:

```json
PUT /products
{
  "mappings": {
    "_meta": {
      "version": "1.0",
      "description": "Mapping for the products index."
    },
    "properties": {
      "name": {
        "type": "text"
      },
      "price": {
        "type": "float"
      }
    }
  }
}
```
{% include copy-curl.html %}

### Updating metadata on an index

You can use the following command to update the `meta` mapping parameter on an index:

```json
PUT /products/_mapping
{
  "_meta": {
    "version": "1.1",
    "description": "Updated mapping for the products index.",
    "author": "Team B"
  }
}
```
{% include copy-curl.html %}

### Indexing a document

After the index is created, you can index documents as usual. The `meta` information remains with the mapping and does not affect the document indexing process:

```json
PUT /products/_doc/1
{
  "name": "Widget",
  "price": 19.99
}
```
{% include copy-curl.html %}

### Retrieve the meta information

To verify that your meta information is stored, you can retrieve the mapping for the index using the following command:

```json
GET /products/_mapping
```
{% include copy-curl.html %}
