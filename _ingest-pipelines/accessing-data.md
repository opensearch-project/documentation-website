---
layout: default
title: Access data in a pipeline
nav_order: 20
---

# Access data in a pipeline

Pipeline processors have read and write access to both the `_source` field of a document and its metadata fields. How you refer to a field depends on where you refer to it:

- In processor parameters such as `field` and `target_field`, use the field name.
- In [`script` processors]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/script/) and `if` conditions, use the `ctx` object, which represents the document being processed, for example, `ctx.user`.

## Accessing document fields

In processor parameters, refer to a top-level field by its name. Refer to a nested field using dot notation.

### Example: Access a top-level field

Given the following example document:

```json
{
  "user": "alice"
}
```

You can access `user` as follows:

```json
"field": "user"
```

In a script or condition, use `ctx.user`.

### Example: Access a nested field

Given the following example document:

```json
{
  "user": {
    "name": "alice"
  }
}
```

You can access `user.name` as follows:

```json
"field": "user.name"
```

In a script or condition, use `ctx.user.name`. If the `user` object might be missing, use the null-safe operator: `ctx.user?.name`.

## Accessing a field in the source

To access a field in the document `_source`, refer to the field by its name:

```json
{
  "set": {
    "field": "environment",
    "value": "production"
  }
}
```

Alternatively, you can explicitly use `_source`:

```json
{
  "set": {
    "field": "_source.environment",
    "value": "production"
  }
}
```

## Accessing metadata fields

A document's `_source` can't contain fields whose names match metadata fields, so you can refer to metadata fields by name, in the same way as source fields. Processors can read and write the following metadata fields:

- `_index`
- `_id`
- `_routing`
- `_version`
- `_version_type`
- `_if_seq_no`
- `_if_primary_term`

### Example: Set `_routing` dynamically

```json
{
  "set": {
    "field": "_routing",
    "value": "{% raw %}{{region}}{% endraw %}"
  }
}
```


## Accessing ingest metadata fields

The `_ingest.timestamp` field represents the time at which the ingest node received the document. To persist this timestamp, use the `set` processor:

```json
{
  "set": {
    "field": "received_at",
    "value": "{% raw %}{{_ingest.timestamp}}{% endraw %}"
  }
}
```

Ingest metadata exists only while the pipeline processes the document. OpenSearch doesn't index the `_ingest` fields, so to keep a value, copy it into a document field, as shown in the preceding example.

A document's `_source` can contain a field named `_ingest`. To access this field, use the `_source._ingest` prefix. Without the prefix, `_ingest` refers to the ingest metadata. The following processor copies the value of the `_ingest` source field into the `ingest_source` field:

```json
{
  "set": {
    "field": "ingest_source",
    "value": "{% raw %}{{_source._ingest}}{% endraw %}"
  }
}
```

## Using field values in Mustache templates

Use Mustache templates to insert field values into processor settings. Only some processor parameters support templates; each processor's parameter table states which ones do. For more information, see [Template snippets]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#template-snippets). Templates refer to fields by name, without `ctx`.

Double curly braces ({% raw %}`{{` and `}}`{% endraw %}) escape special characters in the value, such as quotation marks and backslashes, by adding a backslash before them. Triple curly braces ({% raw %}`{{{` and `}}}`{% endraw %}) insert the value without escaping. For example, if the `title` field contains `say "hi"`, then {% raw %}`{{title}}`{% endraw %} produces `say \"hi\"` and {% raw %}`{{{title}}}`{% endraw %} produces `say "hi"`.

### Example: Combining source fields

The following processor configuration combines the `app` and `env` fields, separated by an underscore (_), and stores the result in the `log_label` field:

```json
{
  "set": {
    "field": "log_label",
    "value": "{% raw %}{{{app}}}_{{{env}}}{% endraw %}"
  }
}
```

### Example: Generating a dynamic greeting using the `set` processor

If a document's `user` field is set to `alice`, use the following syntax to produce the result `"greeting": "Hello, alice!"`:

```json
{
  "set": {
    "field": "greeting",
    "value": "Hello, {% raw %}{{{user}}}{% endraw %}!"
  }
}
```

## Dynamic field names

You can use a field's value as the name of a new field:

```json
{
  "set": {
    "field": "{% raw %}{{service}}{% endraw %}",
    "value": "{% raw %}{{code}}{% endraw %}"
  }
}
```

## Example: Routing to a dynamic index based on status

The following processor configuration sets the target index dynamically by appending `-events` to the value of the `status` field:

```json
{
  "set": {
    "field": "_index",
    "value": "{% raw %}{{status}}{% endraw %}-events"
  }
}
```

## Using `ctx` in the `script` processor

Use the `script` processor for advanced transformations.

### Example: Adding a field only if another is missing

The following processor adds the `error_message` field with the value "none" only if the field is missing from the document:

```json
{
  "script": {
    "lang": "painless",
    "source": "if (ctx.error_message == null) { ctx.error_message = 'none'; }"
  }
}
```

### Example: Copying a value from one field to another

The following processor copies the value from the `timestamp` field into a new field called `event_time`:

```json
{
  "script": {
    "lang": "painless",
    "source": "ctx.event_time = ctx.timestamp;"
  }
}
```

## Example of a complete pipeline

The following example defines a complete ingest pipeline that sets a tagline using the `user.first` and `department` fields, extracts the `year` from the `date` field, and records the document’s ingest timestamp in the `received_at` field:

```json
PUT _ingest/pipeline/example-pipeline
{
  "description": "Sets a tagline, extracts the year, and records the ingest time",
  "processors": [
    {
      "set": {
        "field": "tagline",
        "value": "{% raw %}{{{user.first}}} from {{{department}}}{% endraw %}"
      }
    },
    {
      "script": {
        "lang": "painless",
        "source": "ctx.year = ctx.date.substring(0, 4);"
      }
    },
    {
      "set": {
        "field": "received_at",
        "value": "{% raw %}{{_ingest.timestamp}}{% endraw %}"
      }
    }
  ]
}
```

To test the pipeline, use the following request:

```json
POST _ingest/pipeline/example-pipeline/_simulate
{
  "docs": [
    {
      "_source": {
        "user": {
          "first": "Liam"
        },
        "department": "Engineering",
        "date": "2024-12-03T14:05:00Z"
      }
    }
  ]
}
```

The response shows the enriched document after processing, including the newly added `tagline`, extracted `year`, and the `received_at` timestamp generated by the ingest pipeline:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "user": {
            "first": "Liam"
          },
          "department": "Engineering",
          "date": "2024-12-03T14:05:00Z",
          "tagline": "Liam from Engineering",
          "year": "2024",
          "received_at": "2025-04-14T18:40:00.000Z"
        },
        "_ingest": {
          "timestamp": "2025-04-14T18:40:00.000Z"
        }
      }
    }
  ]
}
```
