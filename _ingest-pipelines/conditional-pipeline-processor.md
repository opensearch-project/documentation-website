---
layout: default
title: Conditionals with the pipeline processor
nav_order: 60
---

# Conditionals with the pipeline processor

The pipeline processor in ingest pipelines allows conditional execution of different sub-pipelines based on document contents. This provides powerful flexibility when different types of documents require separate processing logic. You can use the `if` parameter in the `pipeline` processor to direct documents to different pipelines based on field values, data types, or content structure. Each pipeline can then apply its own set of processors independently. This approach keeps your pipelines modular and maintainable by applying logic only where it's relevant.

## Example: Route logs by service

The following example shows how to route logs to different sub-pipelines depending on the `service.name` field in the document.

Create the first pipeline named `webapp_logs`:

```json
PUT _ingest/pipeline/webapp_logs
{
  "processors": [
    { "set": { "field": "log_type", "value": "webapp" } }
  ]
}
```
{% include copy-curl.html %}

Create the second pipeline named `api_logs`:

```json
PUT _ingest/pipeline/api_logs
{
  "processors": [
    { "set": { "field": "log_type", "value": "api" } }
  ]
}
```
{% include copy-curl.html %}

Create the main routing pipeline named `service_router` that routes the documents to the corresponding pipelines based on `service.name`:

```json
PUT _ingest/pipeline/service_router
{
  "processors": [
    {
      "pipeline": {
        "name": "webapp_logs",
        "if": "ctx.service?.name == 'webapp'"
      }
    },
    {
      "pipeline": {
        "name": "api_logs",
        "if": "ctx.service?.name == 'api'"
      }
    }
  ]
}
```
{% include copy-curl.html %}

Use the following request to simulate the pipelines:

```json
POST _ingest/pipeline/service_router/_simulate
{
  "docs": [
    { "_source": { "service": { "name": "webapp" }, "message": "Homepage loaded" } },
    { "_source": { "service": { "name": "api" }, "message": "GET /v1/users" } },
    { "_source": { "service": { "name": "worker" }, "message": "Task started" } }
  ]
}
```
{% include copy-curl.html %}

The response confirms that the first document was processed by the `webapp_logs` pipeline and the second document was processed by the `api_logs` pipeline. The third document remains unchanged because it doesn't match any conditions:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "log_type": "webapp",
          "message": "Homepage loaded",
          "service": {
            "name": "webapp"
          }
        },
        "_ingest": {
          "timestamp": "2025-04-24T10:54:12.555447087Z"
        }
      }
    },
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "log_type": "api",
          "message": "GET /v1/users",
          "service": {
            "name": "api"
          }
        },
        "_ingest": {
          "timestamp": "2025-04-24T10:54:12.55548442Z"
        }
      }
    },
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "message": "Task started",
          "service": {
            "name": "worker"
          }
        },
        "_ingest": {
          "timestamp": "2025-04-24T10:54:12.555490754Z"
        }
      }
    }
  ]
}
```

## Example: Type-specific processing

You can also use the pipeline processor to apply type-specific pipelines. The following pipeline directs logs to a `numeric_handler` if the `code` field is a number, and to a `string_handler` if it is of type `String`.

Create the first pipeline named `numeric_handler`:

```json
PUT _ingest/pipeline/numeric_handler
{
  "processors": [
    { "set": { "field": "code_type", "value": "numeric" } }
  ]
}
```
{% include copy-curl.html %}

Create the second pipeline named `string_handler`:

```json
PUT _ingest/pipeline/string_handler
{
  "processors": [
    { "set": { "field": "code_type", "value": "string" } }
  ]
}
```
{% include copy-curl.html %}

Create the main routing pipeline named `type_router` that routes the documents to the corresponding pipelines based on the `code` field:

```json
PUT _ingest/pipeline/type_router
{
  "processors": [
    {
      "pipeline": {
        "name": "numeric_handler",
        "if": "ctx.code instanceof Integer || ctx.code instanceof Long || ctx.code instanceof Double"
      }
    },
    {
      "pipeline": {
        "name": "string_handler",
        "if": "ctx.code instanceof String"
      }
    }
  ]
}
```
{% include copy-curl.html %}

Use the following request to simulate the pipelines:

```json
POST _ingest/pipeline/type_router/_simulate
{
  "docs": [
    { "_source": { "code": 404 } },
    { "_source": { "code": "ERR_NOT_FOUND" } }
  ]
}
```
{% include copy-curl.html %}

The returned documents have a new field `code_type` added by individual sub-pipelines:

```json
{
  "docs": [
    {
      "doc": {
        "_source": {
          "code": 404,
          "code_type": "numeric"
        }
      }
    },
    {
      "doc": {
        "_source": {
          "code": "ERR_NOT_FOUND",
          "code_type": "string"
        }
      }
    }
  ]
}
```
