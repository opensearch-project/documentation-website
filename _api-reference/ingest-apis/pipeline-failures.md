---
layout: default
title: Handling pipeline failures
parent: Ingest pipelines
grand_parent: Ingest APIs
nav_order: 15
---

## Handling pipeline failures

Each ingest pipeline consists of a series of processors that are applied to the data in sequence. If a processor fails, the entire pipeline will fail. You have two options for handling failures:

- **Fail the entire pipeline:** If a processor fails, the entire pipeline will fail and the document will not be indexed.
- **Fail the current processor and continue with the next processor:** This can be useful if you want to continue processing the document even if one of the processors fails.

By default, an ingest pipeline stops if one of its processors fails. If you want the pipeline to continue running when a processor fails, you can set the `on_failure` parameter for that processor to `true` when creating the pipeline:

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

You can specify the `on_failure` parameter to run immediately after a processor fails. If you have specified `on_failure`, OpenSearch will run the other processors in the pipeline, even if the `on_failure` configuration is empty: 

```json
{
  "description": "Add timestamp to the document",
  "processors": [
    {
      "date": {
        "field": "timestamp_field",
        "target_field": "timestamp",
        "formats": ["yyyy-MM-dd HH:mm:ss"]
      }
    }
  ],
  "on_failure": [
    {
      "set": {
        "field": "ingest_error",
        "value": "failed"
      }
    }
  ]
}
```

If the processor fails, OpenSearch logs the failure and continues to run all remaining processors in the search pipeline. To check whether there were any failures, you can use [ingest pipeline metrics]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/pipeline-failures/#ingest-pipeline-metrics).

## Ingest pipeline metrics

To view ingest pipeline metrics, use the [Nodes Stats API]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-stats/):

```
GET /_nodes/stats/ingest
```
{% include copy-curl.html %}

The response contains statistics for all ingest pipelines:

```json
{
  "_nodes": {
    "total": 2,
    "successful": 2,
    "failed": 0
  },
  "cluster_name": "opensearch-cluster",
  "nodes": {
    "iFPgpdjPQ-uzTdyPLwQVnQ": {
      "timestamp": 1691011228995,
      "name": "opensearch-node1",
      "transport_address": "172.19.0.4:9300",
      "host": "172.19.0.4",
      "ip": "172.19.0.4:9300",
      "roles": [
        "cluster_manager",
        "data",
        "ingest",
        "remote_cluster_client"
      ],
      "attributes": {
        "shard_indexing_pressure_enabled": "true"
      },
      "ingest": {
        "total": {
          "count": 1,
          "time_in_millis": 2,
          "current": 0,
          "failed": 0
        },
        "pipelines": {
          "my-pipeline": {
            "count": 16,
            "time_in_millis": 23,
            "current": 0,
            "failed": 4,
            "processors": [
              {
                "set": {
                  "type": "set",
                  "stats": {
                    "count": 6,
                    "time_in_millis": 0,
                    "current": 0,
                    "failed": 0
                  }
                }
              },
              {
                "set": {
                  "type": "set",
                  "stats": {
                    "count": 6,
                    "time_in_millis": 3,
                    "current": 0,
                    "failed": 0
                  }
                }
              },
              {
                "uppercase": {
                  "type": "uppercase",
                  "stats": {
                    "count": 6,
                    "time_in_millis": 0,
                    "current": 0,
                    "failed": 4
                  }
                }
              }
            ]
          }
        }
      }
    },
    "dDOB3vS3TVmB5t6PHdCj4Q": {
      "timestamp": 1691011228997,
      "name": "opensearch-node2",
      "transport_address": "172.19.0.2:9300",
      "host": "172.19.0.2",
      "ip": "172.19.0.2:9300",
      "roles": [
        "cluster_manager",
        "data",
        "ingest",
        "remote_cluster_client"
      ],
      "attributes": {
        "shard_indexing_pressure_enabled": "true"
      },
      "ingest": {
        "total": {
          "count": 0,
          "time_in_millis": 0,
          "current": 0,
          "failed": 0
        },
        "pipelines": {
          "my-pipeline": {
            "count": 0,
            "time_in_millis": 0,
            "current": 0,
            "failed": 0,
            "processors": [
              {
                "set": {
                  "type": "set",
                  "stats": {
                    "count": 0,
                    "time_in_millis": 0,
                    "current": 0,
                    "failed": 0
                  }
                }
              },
              {
                "set": {
                  "type": "set",
                  "stats": {
                    "count": 0,
                    "time_in_millis": 0,
                    "current": 0,
                    "failed": 0
                  }
                }
              },
              {
                "uppercase": {
                  "type": "uppercase",
                  "stats": {
                    "count": 0,
                    "time_in_millis": 0,
                    "current": 0,
                    "failed": 0
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

## Troubleshooting failures

The following are tips on troubleshooting ingest pipeline failures:

1. Check the logs: OpenSeach logs contain information about the ingest pipeline that failed, including the processor that failed and the reason for the failure.
2. Inspect the document: If the ingest pipeline failed, then the document that was being processed will be in its respective index. 
3. Check the processor configuration: It is possible the processor configuration is incorrect. To check this you can look at the processor configuration in the JSON object.
4. Try a different processor: You can try using a different processor. Some processors are better at handling certain types of data than others.
