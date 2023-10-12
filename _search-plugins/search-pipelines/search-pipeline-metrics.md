---
layout: default
title: Search pipeline metrics
nav_order: 50
has_children: false
parent: Search pipelines
grand_parent: Search
---

# Search pipeline metrics

To view search pipeline metrics, use the [Nodes Stats API]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-stats/):

```json
GET /_nodes/stats/search_pipeline
```
{% include copy-curl.html %}

The response contains statistics for all search pipelines:

```json
{
  "_nodes" : {
    "total" : 1,
    "successful" : 1,
    "failed" : 0
  },
  "cluster_name" : "runTask",
  "nodes" : {
    "CpvTK7KuRD6Oww8TTp8g2Q" : {
      "timestamp" : 1689007282929,
      "name" : "runTask-0",
      "transport_address" : "127.0.0.1:9300",
      "host" : "127.0.0.1",
      "ip" : "127.0.0.1:9300",
      "roles" : [
        "cluster_manager",
        "data",
        "ingest",
        "remote_cluster_client"
      ],
      "attributes" : {
        "testattr" : "test",
        "shard_indexing_pressure_enabled" : "true"
      },
      "search_pipeline" : {
        "total_request" : {
          "count" : 5,
          "time_in_millis" : 158,
          "current" : 0,
          "failed" : 0
        },
        "total_response" : {
          "count" : 2,
          "time_in_millis" : 1,
          "current" : 0,
          "failed" : 0
        },
        "pipelines" : {
          "public_info" : {
            "request" : {
              "count" : 3,
              "time_in_millis" : 71,
              "current" : 0,
              "failed" : 0
            },
            "response" : {
              "count" : 0,
              "time_in_millis" : 0,
              "current" : 0,
              "failed" : 0
            },
            "request_processors" : [
              {
                "filter_query:abc" : {
                  "type" : "filter_query",
                  "stats" : {
                    "count" : 1,
                    "time_in_millis" : 0,
                    "current" : 0,
                    "failed" : 0
                  }
                }
              },
              {
                "filter_query" : {
                  "type" : "filter_query",
                  "stats" : {
                    "count" : 4,
                    "time_in_millis" : 2,
                    "current" : 0,
                    "failed" : 0
                  }
                }
              }
            ],
            "response_processors" : [ ]
          },
          "guest_pipeline" : {
            "request" : {
              "count" : 2,
              "time_in_millis" : 87,
              "current" : 0,
              "failed" : 0
            },
            "response" : {
              "count" : 2,
              "time_in_millis" : 1,
              "current" : 0,
              "failed" : 0
            },
            "request_processors" : [
              {
                "script" : {
                  "type" : "script",
                  "stats" : {
                    "count" : 2,
                    "time_in_millis" : 86,
                    "current" : 0,
                    "failed" : 0
                  }
                }
              },
              {
                "filter_query:abc" : {
                  "type" : "filter_query",
                  "stats" : {
                    "count" : 1,
                    "time_in_millis" : 0,
                    "current" : 0,
                    "failed" : 0
                  }
                }
              },
              {
                "filter_query" : {
                  "type" : "filter_query",
                  "stats" : {
                    "count" : 3,
                    "time_in_millis" : 0,
                    "current" : 0,
                    "failed" : 0
                  }
                }
              }
            ],
            "response_processors" : [
              {
                "rename_field" : {
                  "type" : "rename_field",
                  "stats" : {
                    "count" : 2,
                    "time_in_millis" : 1,
                    "current" : 0,
                    "failed" : 0
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

For descriptions of each field in the response, see the [Nodes Stats search pipeline section]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-stats/#search_pipeline). 