---
layout: default
title: Handling pipeline failures
nav_order: 15
redirect_from:
  - /api-reference/ingest-apis/pipeline-failures/
---

# Handling pipeline failures
**Introduced 1.0**
{: .label .label-purple }

Each ingest pipeline consists of a series of processors that are applied to the documents in sequence. If a processor fails, the entire pipeline will fail. You have two options for handling failures:

- **Fail the entire pipeline:** If a processor fails, the entire pipeline will fail and the document will not be indexed.
- **Fail the current processor and continue with the next processor:** This can be useful if you want to continue processing the document even if one of the processors fails.

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

You can specify the `on_failure` parameter to run immediately after a processor fails. If you have specified `on_failure`, OpenSearch will run the other processors in the pipeline even if the `on_failure` configuration is empty: 

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

If the processor fails, OpenSearch logs the failure and continues to run all remaining processors in the search pipeline. To check whether there were any failures, you can use [ingest pipeline metrics]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/pipeline-failures/#ingest-pipeline-metrics).
{: tip}

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

**Troubleshooting ingest pipeline failures:** The first thing you should do is check the logs to see whether there are any errors or warnings that can help you identify the cause of the failure. OpenSearch logs contain information about the ingest pipeline that failed, including the processor that failed and the reason for the failure.
{: .tip}
