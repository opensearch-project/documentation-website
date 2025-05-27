---
layout: default
title: Conditional execution
nav_order: 40
---

# Conditional execution

In ingest pipelines, you can control whether a processor runs by using the optional `if` parameter. This allows for conditional execution of processors based on the incoming document contents. The condition is written as a Painless script and evaluated against the document context (`ctx`).

## Basic conditional execution

Each processor can include an `if` clause. If the condition evaluates to `true`, the processor runs; otherwise, it's skipped.

### Example: Drop debug-level logs

The following pipeline drops any document in which the `log_level` field is equal to `debug`:

```json
PUT _ingest/pipeline/drop_debug_logs
{
  "processors": [
    {
      "drop": {
        "if": "ctx.log_level == 'debug'"
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Example index request

```json
POST logs/_doc/1?pipeline=drop_debug_logs
{
  "message": "User logged in",
  "log_level": "debug"
}
```
{% include copy-curl.html %}

This document is dropped because the condition evaluates to `true`:

```json
{
  "_index": "logs",
  "_id": "1",
  "_version": -3,
  "result": "noop",
  "_shards": {
    "total": 0,
    "successful": 0,
    "failed": 0
  }
}
```

## Null-safe field checks when using nested fields

When working with nested fields, it's important to avoid null pointer exceptions. Use the null-safe `?.` operator in Painless scripts.

### Example: Drop documents based on a nested field

The following drop processor executes only if the nested `app.env` field exists and equals `debug`:

```json
PUT _ingest/pipeline/drop_debug_env
{
  "processors": [
    {
      "drop": {
        "if": "ctx.app?.env == 'debug'"
      }
    }
  ]
}
```
{% include copy-curl.html %}

If the null-safe `?.` operator is not configured, indexing any document that doesn't contain the `app.env` field will trigger the following null pointer exception:

```json
{
  "error": "IngestProcessorException[ScriptException[runtime error]; nested: NullPointerException[Cannot invoke \"Object.getClass()\" because \"callArgs[0]\" is null];]",
  "status": 400
}
```

## Handling flattened fields

If your document has a flattened field, for example, `"app.env": "debug"`, use the [`dot_expander`]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/dot-expander/) processor to convert it into a nested structure:

```json
PUT _ingest/pipeline/drop_debug_env
{
  "processors": [
    {
      "dot_expander": {
        "field": "app.env"
      }
    },
    {
      "drop": {
        "if": "ctx.app?.env == 'debug'"
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Safe method calls in conditions

Avoid calling methods on potential null values. Use constants or null checks instead:

```json
{
  "drop": {
    "if": "ctx.app?.env != null && ctx.app.env.contains('debug')"
  }
}
```

## Full example: Multi-step conditional pipeline

The following ingest pipeline uses three processors:

1. `set`: If no value is provided in the `user` field, sets the `user` field to `guest`.
2. `set`: If the `status_code` is provided and is higher than `400`, sets the `error` field to `true`.
3. `drop`: If the `app.env` field is equal to `debug`, drops the entire document.

```json
PUT _ingest/pipeline/logs_processing
{
  "processors": [
    {
      "set": {
        "field": "user",
        "value": "guest",
        "if": "ctx.user == null"
      }
    },
    {
      "set": {
        "field": "error",
        "value": true,
        "if": "ctx.status_code != null && ctx.status_code >= 400"
      }
    },
    {
      "drop": {
        "if": "ctx.app?.env == 'debug'"
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Simulate the pipeline

The following simulation request applies the conditional logic to three documents:

```json
POST _ingest/pipeline/logs_processing/_simulate
{
  "docs": [
    {
      "_source": {
        "message": "Successful login",
        "status_code": 200
      }
    },
    {
      "_source": {
        "message": "Database error",
        "status_code": 500,
        "user": "alice"
      }
    },
    {
      "_source": {
        "message": "Debug mode trace",
        "app": { "env": "debug" }
      }
    }
  ]
}
```
{% include copy-curl.html %}

The response demonstrates how the processors respond based on each condition:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "status_code": 200,
          "message": "Successful login",
          "user": "guest"
        },
        "_ingest": {
          "timestamp": "2025-04-16T14:04:35.923159885Z"
        }
      }
    },
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "status_code": 500,
          "message": "Database error",
          "error": true,
          "user": "alice"
        },
        "_ingest": {
          "timestamp": "2025-04-16T14:04:35.923198551Z"
        }
      }
    },
    null
  ]
}
```


