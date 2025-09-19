---
layout: default
title: Copy to
parent: Mapping parameters

nav_order: 20
has_children: false
has_toc: false
---

# Copy to

The `copy_to` parameter allows you to copy the values of multiple fields into a group field, which can then be queried as a single field. This is useful when you frequently search across multiple fields and want to simplify your queries.

Note the following important considerations:

- During copying, the raw field value (not the tokens produced during analysis) is copied.

- The original `_source` field is not modified to reflect the copied values.

- The same value can be copied to multiple fields using `"copy_to": ["field_1", "field_2"]` syntax.

- You cannot copy recursively through intermediary fields. For example, if `field_1` is copied to `field_2` and `field_2` is copied to `field_3`, indexing into `field_1` does not result in values appearing in `field_3`. Instead, use `copy_to` directly from the originating field to multiple target fields.

## Examples

The following examples demonstrate using the `copy_to` parameter.

### Basic copy_to usage

Create an index that copies first and last names into a full name field:

```json
PUT /user_profiles
{
  "mappings": {
    "properties": {
      "first_name": {
        "type": "text",
        "copy_to": "full_name"
      },
      "last_name": {
        "type": "text",
        "copy_to": "full_name"
      },
      "full_name": {
        "type": "text"
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a document with separate name fields:

```json
PUT /user_profiles/_doc/1
{
  "first_name": "Jane",
  "last_name": "Doe"
}
```
{% include copy-curl.html %}

Search using the combined field (requires both terms to match):

```json
GET /user_profiles/_search
{
  "query": {
    "match": {
      "full_name": {
        "query": "Jane Doe",
        "operator": "and"
      }
    }
  }
}
```
{% include copy-curl.html %}

The `first_name` and `last_name` fields can still be queried individually, but the `full_name` field allows you to search for both names together.

### Copying to multiple target fields

Create an index that copies the `title` field into both `searchable_content` and `display_text` fields:

```json
PUT /content_library
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "copy_to": ["searchable_content", "display_text"]
      },
      "body": {
        "type": "text",
        "copy_to": "searchable_content"
      },
      "searchable_content": {
        "type": "text"
      },
      "display_text": {
        "type": "text"
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a document containing the `title` and `body` fields:

```json
PUT /content_library/_doc/1
{
  "title": "OpenSearch Documentation Guide",
  "body": "This comprehensive guide covers mapping parameters and their usage in OpenSearch."
}
```
{% include copy-curl.html %}

Search the combined `searchable_content` field:

```json
GET /content_library/_search
{
  "query": {
    "match": {
      "searchable_content": "OpenSearch mapping parameters"
    }
  }
}
```
{% include copy-curl.html %}

In this configuration:
- The `title` field is copied to both `searchable_content` and `display_text`
- The `body` field is copied only to `searchable_content`
- You can search both title and body content through the `searchable_content` field
- The original `_source` still contains only the `title` and `body` fields

