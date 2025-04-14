---
layout: default
title: Accessing data in pipeline
redirect_from:
  - /opensearch/rest-api/ingest-apis/accessing-data/
  - /api-reference/ingest-apis/accessing-data/
nav_order: 20
---

# Accessing data in pipelines

In ingest pipelines, you access the data of incoming documents using the `ctx` object. This object represents the document being processed and allows you to read, modify, or enrich its fields.

## Accessing document fields

The `ctx` object exposes all document fields. You can access them directly using dot notation.

### Example: Access a top-level field

Given the following example document:

```json
{
  "user": "alice"
}
```

You can access `user` using:

```json
"field": "ctx.user"
```

### Example: Access nested fields

Given the following example document:

```json
{
  "user": {
    "name": "alice"
  }
}
```

You can access `user.name` using:

```json
"field": "ctx.user.name"
```

## Using `ctx` in Mustache templates

Some processors support Mustache templates for dynamic field values. Use triple curly braces `{% raw %}{{{}}}{% endraw %}` to access the value of a field.

### Example: Dynamic greeting using `set` processor

If the document has `"user": "alice"`, Use the following syntax to produce the result `"greeting": "Hello, alice!"`.

```json
{
  "set": {
    "field": "greeting",
    "value": "Hello, {% raw %}{{{user}}}{% endraw %}!"
  }
}
```

## Using `ctx` in script processors

The `script` processor allows you to write logic using [Painless]({{site.url}}{{site.baseurl}}/api-reference/script-apis/exec-script/) scripting language.

### Example: Copy a value from one field to another

Use the following syntax to copy `timestamp` field to `event_time` field:

```json
{
  "script": {
    "lang": "painless",
    "source": "ctx.event_time = ctx.timestamp;"
  }
}
```

## Full example: Accessing and modifying fields

This following pipeline:
- Sets `full_name` using Mustache templates from nested fields
- Extracts the year from `timestamp` and sets it to `year`

```json
PUT _ingest/pipeline/ctx-access-pipeline
{
  "description": "Demonstrates accessing and modifying fields using ctx",
  "processors": [
    {
      "set": {
        "field": "full_name",
        "value": "{% raw %}{{{user.first}}} {{{user.last}}}{% endraw %}"
      }
    },
    {
      "script": {
        "lang": "painless",
        "source": "ctx.year = ctx.timestamp.substring(0, 4);"
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Testing the pipeline

You can use [_simulate]({{site.url}}{{site.baseurl}}/ingest-pipelines/simulate-ingest/) operation to test the created pipeline:

```json
POST _ingest/pipeline/ctx-access-pipeline/_simulate
{
  "docs": [
    {
      "_source": {
        "user": {
          "first": "Alice",
          "last": "Smith"
        },
        "timestamp": "2025-04-14T10:00:00Z"
      }
    }
  ]
}
```
{% include copy-curl.html %}

The returned result demonstrates the effect of the processors in the pipeline:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "full_name": "Alice Smith",
          "user": {
            "last": "Smith",
            "first": "Alice"
          },
          "year": "2025",
          "timestamp": "2025-04-14T10:00:00Z"
        },
        "_ingest": {
          "timestamp": "2025-04-14T16:26:21.286147633Z"
        }
      }
    }
  ]
}
```
