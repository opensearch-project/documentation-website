---
layout: default
title: Handling pipeline failures
nav_order: 30
redirect_from:
  - /api-reference/ingest-apis/pipeline-failures/
---

# Handling pipeline failures
**Introduced 1.0**
{: .label .label-purple }

Each ingest pipeline consists of a series of processors that are applied to the documents in sequence. By default, if a processor fails, the entire pipeline fails and the document isn't indexed. You can change this using the following options:

- Set `ignore_failure` on a processor to skip its failure and continue with the next processor.
- Specify `on_failure` on a processor to run other processors when it fails and then continue with the next processor.
- Specify `on_failure` at the pipeline level to run other processors when a processor that doesn't handle its own failure fails, and then stop the pipeline.

By default, an ingest pipeline stops if one of its processors fails. If you want the pipeline to continue running when a processor fails, you can set the `ignore_failure` parameter for that processor to `true` when creating the pipeline:

```json
PUT _ingest/pipeline/my-pipeline/
{
  "description": "Rename 'provider' field to 'cloud.provider'",
  "processors": [
    {
      "rename": {
        "field": "provider",
        "target_field": "cloud.provider",
        "ignore_failure": true
      }
    }
  ]
}
```
{% include copy-curl.html %}

You can specify the `on_failure` parameter to run immediately after a processor fails. If you specify `on_failure` for a processor, OpenSearch runs the `on_failure` processors and then continues running the remaining processors in the pipeline. The `on_failure` list must contain at least one processor. Processors in an `on_failure` list can define their own `on_failure`, so you can handle failures that occur during failure handling: 

```json
PUT _ingest/pipeline/my-pipeline/
{
  "description": "Add timestamp to the document",
  "processors": [
    {
      "date": {
        "field": "timestamp_field",
        "formats": ["yyyy-MM-dd HH:mm:ss"],
        "target_field": "@timestamp",
        "on_failure": [
          {
            "set": {
              "field": "ingest_error",
              "value": "failed"
            }
          }
        ]
      }
    }
  ]
}
```
{% include copy-curl.html %}

If the processor fails, OpenSearch runs the `on_failure` processors and then continues to run all remaining processors in the ingest pipeline. The failure is still counted in the processor statistics. To check whether there were any failures, use [ingest pipeline metrics](#ingest-pipeline-metrics).
{: .tip}

## Handling failures at the pipeline level

You can also specify `on_failure` at the pipeline level, alongside the `processors` array. OpenSearch runs the pipeline-level `on_failure` processors when a processor that doesn't define its own `on_failure` fails. After the pipeline-level `on_failure` processors run, the pipeline stops, and the remaining processors don't run. A processor-level `on_failure` takes precedence over the pipeline-level `on_failure`.

A common use of pipeline-level failure handling is to route documents that fail processing to a separate index so that you can inspect and reprocess them later. The following pipeline renames the `region` field and converts the `quantity` field to an integer. If either processor fails, the pipeline-level `on_failure` processor changes the document's target index to `failed-orders`:

```json
PUT _ingest/pipeline/orders-pipeline
{
  "description": "Parses order data and routes failed documents to a separate index",
  "processors": [
    {
      "rename": {
        "field": "region",
        "target_field": "location.region"
      }
    },
    {
      "convert": {
        "field": "quantity",
        "type": "integer"
      }
    }
  ],
  "on_failure": [
    {
      "set": {
        "field": "_index",
        "value": "failed-orders"
      }
    }
  ]
}
```
{% include copy-curl.html %}

Index a document that doesn't contain the `region` field:

```json
PUT orders/_doc/1?pipeline=orders-pipeline
{
  "order_id": "A-1001",
  "quantity": "3"
}
```
{% include copy-curl.html %}

The `rename` processor fails, so OpenSearch indexes the document into the `failed-orders` index:

```json
{
  "_index": "failed-orders",
  "_id": "1",
  "_version": 1,
  "result": "created",
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 0,
  "_primary_term": 1
}
```

Because the pipeline stopped after the `rename` processor failed, the `convert` processor didn't run, and the `quantity` field in the indexed document is still a string.

## Accessing error metadata

Processors in an `on_failure` block can read information about the failure from the following ingest metadata fields.

Field | Description
:--- | :---
`_ingest.on_failure_message` | The error message of the failure.
`_ingest.on_failure_processor_type` | The type of the processor that failed, for example, `rename`.
`_ingest.on_failure_processor_tag` | The `tag` of the processor that failed. Empty if the processor doesn't have a `tag`.
`_ingest.on_failure_pipeline` | The ID of the pipeline in which the processor failed. Populated only when the failure occurs in a pipeline run by a [`pipeline` processor]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/pipeline/). Empty when the failure occurs in the pipeline that contains the `on_failure` block.

These fields exist only while the `on_failure` processors run. To keep the failure information, copy it into the document using template snippets. The following pipeline records the error details in the `error` object:

```json
PUT _ingest/pipeline/orders-error-details
{
  "description": "Records error details for failed documents",
  "processors": [
    {
      "rename": {
        "tag": "rename-region",
        "field": "region",
        "target_field": "location.region"
      }
    }
  ],
  "on_failure": [
    {
      "set": {
        "field": "_index",
        "value": "orders-errors"
      }
    },
    {
      "set": {
        "field": "error.message",
        "value": "{% raw %}{{ _ingest.on_failure_message }}{% endraw %}"
      }
    },
    {
      "set": {
        "field": "error.processor_type",
        "value": "{% raw %}{{ _ingest.on_failure_processor_type }}{% endraw %}"
      }
    },
    {
      "set": {
        "field": "error.processor_tag",
        "value": "{% raw %}{{ _ingest.on_failure_processor_tag }}{% endraw %}"
      }
    }
  ]
}
```
{% include copy-curl.html %}

Index a document that doesn't contain the `region` field:

```json
PUT orders/_doc/1?pipeline=orders-error-details
{
  "order_id": "A-1001"
}
```
{% include copy-curl.html %}

Retrieve the document from the `orders-errors` index:

```json
GET orders-errors/_doc/1
```
{% include copy-curl.html %}

The document contains the error details:

```json
{
  "_index": "orders-errors",
  "_id": "1",
  "_version": 1,
  "_seq_no": 0,
  "_primary_term": 1,
  "found": true,
  "_source": {
    "order_id": "A-1001",
    "error": {
      "message": "field [region] doesn't exist",
      "processor_type": "rename",
      "processor_tag": "rename-region"
    }
  }
}
```

## Ingest pipeline metrics

To view ingest pipeline metrics, use the [Nodes Stats API]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-stats/):

```json
GET /_nodes/stats/ingest?filter_path=nodes.*.ingest
```
{% include copy-curl.html %}

The response contains statistics for all ingest pipelines, for example:

```json
 {
  "nodes": {
    "iFPgpdjPQ-uzTdyPLwQVnQ": {
      "ingest": {
        "total": {
          "count": 28,
          "time_in_millis": 82,
          "current": 0,
          "failed": 9
        },
        "pipelines": {
          "user-behavior": {
            "count": 5,
            "time_in_millis": 0,
            "current": 0,
            "failed": 0,
            "processors": [
              {
                "append": {
                  "type": "append",
                  "stats": {
                    "count": 5,
                    "time_in_millis": 0,
                    "current": 0,
                    "failed": 0
                  }
                }
              }
            ]
          },
           "remove_ip": {
            "count": 5,
            "time_in_millis": 9,
            "current": 0,
            "failed": 2,
            "processors": [
              {
                "remove": {
                  "type": "remove",
                  "stats": {
                    "count": 5,
                    "time_in_millis": 8,
                    "current": 0,
                    "failed": 2
                  }
                }
              }
            ]
          }
        }
      }
    }
  }
}
```

**Troubleshooting ingest pipeline failures:** When a document fails in a pipeline, the indexing response contains the error and the reason for the failure. OpenSearch also logs these failures at the `DEBUG` level. To include them in the OpenSearch logs, set the `logger.org.opensearch.ingest` log level to `DEBUG`. For more information, see [Logs]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/logs/).
{: .tip}
