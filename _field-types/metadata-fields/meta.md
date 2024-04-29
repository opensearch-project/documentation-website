---
layout: default
title: Meta
nav_order: 30
has_children: false
parent: Metadata fields
---

# Meta

The `_meta` field is a mapping property that allows you to associate custom metadata with your index mappings. This metadata is not used by OpenSearch itself, but can be used by your application to store information that is relevant to your use case. The `meta` field can be useful for a variety of scenarios, such as the following: 

- **Versioning**: Store the version of your application or index schema, making it easier to manage changes over time.
- **Ownership**: Identify the owner or author of an index, which can be helpful for maintenance and collaboration.
- **Categorization**: Classify indexes based on the application or domain they belong to, making it easier to organize and manage your data.
- **Auditing**: Track changes to the index metadata over time, providing a history of modifications.

## Usage

You can define the `_meta` field when creating a new index or updating an existing index's mapping: 

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

In this example, three custom metadata fields are added: application, version, and author. These fields can be used by your application to store any relevant information about the index, such as the application it belongs to, the version of the application, or the author of the index.

You can update the `_meta` field using the [put mapping API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/put-mapping/) operation:

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

## Retrieving meta information

You can retrieve the `_meta` information for an index using the [get mapping API]({{site.url}}{{site.baseurl}}/field-types/#get-a-mapping) operation:

```json
GET my-index/_mapping
```
{% include copy-curl.html %}

This returns the full mapping for the index, including the `_meta` field, as shown in the following example: 

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
