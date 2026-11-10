---
layout: default
title: Conditionals with the pipeline processor
parent: Conditional execution
nav_order: 60
---

# Conditionals with the pipeline processor

The `pipeline` processor in ingest pipelines allows conditional execution of different sub-pipelines based on document contents. This provides powerful flexibility when different types of documents require separate processing logic. You can use the `if` parameter in the `pipeline` processor to direct documents to different pipelines based on field values, data types, or content structure. Each pipeline can then apply its own set of processors independently. This approach keeps your pipelines modular and maintainable by applying logic only where it's relevant.

## Example: Route logs by service

The following example demonstrates how to route logs to different sub-pipelines depending on the `service.name` field in the document.

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

Create the main routing pipeline named `service_router`, which routes the documents to the corresponding pipelines based on `service.name`:

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

### Rejecting unmatched documents

In the preceding example, documents that don't match any condition are indexed without processing. To reject these documents, add a [`fail` processor]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/fail/) whose condition matches when none of the other conditions do:

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
    },
    {
      "fail": {
        "if": "!['webapp', 'api'].contains(ctx.service?.name)",
        "message": "The service.name field must be webapp or api. Received: {% raw %}{{service.name}}{% endraw %}"
      }
    }
  ]
}
```
{% include copy-curl.html %}

When you simulate the pipeline using the same documents as in the preceding example, the first two documents are processed as before. The third document fails with the message `The service.name field must be webapp or api. Received: worker`, and OpenSearch doesn't index it. If a document has no `service.name` field, the message ends with an empty value.

### Applying the router to all indexing requests

To route every document indexed into an index without specifying the `pipeline` parameter in each request, set the routing pipeline as the index's default pipeline. To apply it to all indexes that match a pattern, set `index.default_pipeline` in an [index template]({{site.url}}{{site.baseurl}}/im-plugin/index-templates/):

```json
PUT _index_template/service_logs
{
  "index_patterns": ["service-logs-*"],
  "template": {
    "settings": {
      "index.default_pipeline": "service_router"
    }
  }
}
```
{% include copy-curl.html %}

For more information, see [Applying a pipeline to documents]({{site.url}}{{site.baseurl}}/ingest-pipelines/#applying-a-pipeline-to-documents).

## Example: Type-specific processing

You can also use the pipeline processor to apply type-specific pipelines. The following pipeline directs logs to a `numeric_handler` if the `code` field is a number and to a `string_handler` if it is of type `String`.

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

Create the main routing pipeline named `type_router`, which routes the documents to the corresponding pipelines based on the `code` field:

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

The returned documents have the new field `code_type` added by individual sub-pipelines:

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