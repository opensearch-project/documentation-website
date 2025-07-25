---
layout: default
title: Meta
nav_order: 30
parent: Metadata fields
canonical_url: https://docs.opensearch.org/latest/field-types/metadata-fields/meta/
---

# Meta

The `_meta` field is a mapping property that allows you to attach custom metadata to your index mappings. This metadata can be used by your application to store information relevant to your use case, such as versioning, ownership, categorization, or auditing.

## Usage

You can define the `_meta` field when creating a new index or updating an existing index's mapping, as shown in the following example request: 

```json
PUT my-index
{
  "mappings": {
    "_meta": {
      "application": "MyApp",
      "version": "1.2.3",
      "author": "John Doe"
    },
    "properties": {
      "title": {
        "type": "text"
      },
      "description": {
        "type": "text"
      }
    }
  }
}

```
{% include copy-curl.html %}

In this example, three custom metadata fields are added: `application`, `version`, and `author`. These fields can be used by your application to store any relevant information about the index, such as the application it belongs to, the application version, or the author of the index.

You can update the `_meta` field using the [Put Mapping API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/put-mapping/) operation, as shown in the following example request:

```json
PUT my-index/_mapping
{
  "_meta": {
    "application": "MyApp",
    "version": "1.3.0",
    "author": "Jane Smith"
  }
}
```
{% include copy-curl.html %}

## Retrieving `meta` information

You can retrieve the `_meta` information for an index using the [Get Mapping API]({{site.url}}{{site.baseurl}}/field-types/#get-a-mapping) operation, as shown in the following example request:

```json
GET my-index/_mapping
```
{% include copy-curl.html %}

The response returns the full index mapping, including the `_meta` field: 

```json
{
  "my-index": {
    "mappings": {
      "_meta": {
        "application": "MyApp",
        "version": "1.3.0",
        "author": "Jane Smith"
      },
      "properties": {
        "description": {
          "type": "text"
        },
        "title": {
          "type": "text"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}
