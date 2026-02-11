---
layout: default
title: Meta
parent: Mapping parameters
redirect_from:
  - /field-types/mapping-parameters/meta/
nav_order: 180
has_children: false
has_toc: false
canonical_url: https://docs.opensearch.org/latest/mappings/mapping-parameters/meta/
---

# Meta

The `_meta` mapping parameter allows you to attach metadata to your mapping definition. This metadata is stored alongside your mapping and is returned when the mapping is retrieved, serving solely as informational context without influencing indexing or search operations.

You can use the `_meta` mapping parameter to provide important details, such as version information, descriptions, or authorship. Metadata can also be updated by submitting a mapping update that overrides the existing metadata.


## Enabling meta on a mapping

The following request creates an index named `products` with a `_meta` mapping parameter containing version and description information:

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

Use the following request to update the `_meta` mapping parameter on an index:

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

After the index is created, you can index documents as usual. The `_meta` information remains with the mapping and does not affect the document indexing process:

```json
PUT /products/_doc/1
{
  "name": "Widget",
  "price": 19.99
}
```
{% include copy-curl.html %}

### Retrieve the meta information

To verify that your `_meta` information is stored, you can retrieve the mapping for the index:

```json
GET /products/_mapping
```
{% include copy-curl.html %}
