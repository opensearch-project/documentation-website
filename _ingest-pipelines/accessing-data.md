---
layout: default
title: Accessing data in pipeline
redirect_from:
  - /opensearch/rest-api/ingest-apis/accessing-data/
  - /api-reference/ingest-apis/accessing-data/
nav_order: 20
---

# Accessing data in pipelines

In ingest pipelines, you access the data of incoming documents using the `ctx` object. This object represents the document being processed and allows you to read, modify, or enrich its fields. Processors in a pipeline have read and write access to both the `_source` fields of a document and its metadata fields.

## Accessing fields in the source

To access a field in the document _source refer to fields by their name:

```json
{
  "set": {
    "field": "my_field",
    "value": 582.1
  }
}
```

You can also explicitly refer to the field using `_source`:

```json
{
  "set": {
    "field": "_source.my_field",
    "value": 582.1
  }
}
```

## Accessing metadata fields

Similarly to `_source` field, you can access metadata fields. These include:

- `_index`
- `_type`
- `_id`
- `_routing`

For example, the following command sets the `_id` metadata field:

```json
{
  "set": {
    "field": "_id",
    "value": "1"
  }
}
```

To read a metadata field in a template, use double curly braces:

```json
{
  "set": {
    "field": "index_used",
    "value": "{% raw %}{{_index}}{% endraw %}"
  }
}
```

You cannot use `{% raw %}{{_id}}{% endraw %}` in a processor if the document ID is auto-generated.
{: .note}

## Accessing ingest metadata fields

Ingest-specific metadata under the `_ingest.timestamp` field is added automatically and records when the document was received by the ingest node. 

Example:

```json
{
  "set": {
    "field": "received",
    "value": "{% raw %}{{_ingest.timestamp}}{% endraw %}"
  }
}
```

This value is transient and will not be indexed unless explicitly written into the document like above.

To access a field named `_ingest` in the source, use `_source._ingest` to avoid confusion with ingest metadata.

## Accessing fields using Mustache templates

Many processors support [Mustache templates](https://mustache.github.io/). Use triple curly braces `{% raw %}{{{field}}}{% endraw %}` to inject field values directly without escaping.

### Example: Greeting template

```json
{
  "set": {
    "field": "greeting",
    "value": "Hello, {% raw %}{{{user}}}{% endraw %}!"
  }
}
```

## Dynamic field names

You can dynamically name fields based on values of other fields.

```json
{
  "set": {
    "field": "{% raw %}{{service}}{% endraw %}",
    "value": "{% raw %}{{code}}{% endraw %}"
  }
}
```

## Example: Dynamic index name

Set the target index dynamically from the document:

```json
{
  "set": {
    "field": "_index",
    "value": "{% raw %}{{geoip.country_iso_code}}{% endraw %}"
  }
}
```

## Using `ctx` in script processors

To perform advanced logic, use the `script` processor with [Painless]({{site.url}}{{site.baseurl}}/api-reference/script-apis/exec-script/).

### Example: Copy a field

```json
{
  "script": {
    "lang": "painless",
    "source": "ctx.event_time = ctx.timestamp;"
  }
}
```

## Full pipeline example

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
    },
    {
      "set": {
        "field": "received",
        "value": "{% raw %}{{_ingest.timestamp}}{% endraw %}"
      }
    }
  ]
}
```
{% include copy-curl.html %}

---

## Testing the pipeline

You can use the [`_simulate`]({{site.url}}{{site.baseurl}}/ingest-pipelines/simulate-ingest/) API to test the pipeline:

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

### Simulated result

```json
{
  "docs": [
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "full_name": "Alice Smith",
          "year": "2025",
          "received": "2025-04-14T18:27:59.288665421Z",
          "user": {
            "last": "Smith",
            "first": "Alice"
          },
          "timestamp": "2025-04-14T10:00:00Z"
        },
        "_ingest": {
          "timestamp": "2025-04-14T18:27:59.288665421Z"
        }
      }
    }
  ]
}
```
