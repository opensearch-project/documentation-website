---
layout: default
title: Top N queries
parent: Query insights
nav_order: 10
canonical_url: https://docs.opensearch.org/docs/latest/observing-your-data/query-insights/top-n-queries/
---

# Top N queries

Monitoring the top N queries using query insights allows you to gain real-time visibility into the queries with the highest latency or resource consumption in a specified time period (for example, the last hour).

## Configuring top N query monitoring

You can configure top N query monitoring by the following metric types:

- `latency`
- `cpu`
- `memory`

Each metric has a set of corresponding settings:

- `search.insights.top_queries.<metric>.enabled`: Set to `true` to [enable top N query monitoring](#enabling-top-n-query-monitoring) by the metric.
- `search.insights.top_queries.<metric>.window_size`: [Configure the window size of the top N queries](#configuring-the-window-size) by the metric. 
- `search.insights.top_queries.<metric>.top_n_size`: [Specify the value of N for the top N queries by the metric](#configuring-the-value-of-n).

For example, to enable top N query monitoring by CPU usage, set `search.insights.top_queries.cpu.enabled` to `true`. For more information about ways to specify dynamic settings, see [Dynamic settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/#dynamic-settings).

It's important to exercise caution when enabling this feature because it can consume system resources.
{: .important}

## Enabling top N query monitoring 

When you install the `query-insights` plugin, top N query monitoring is enabled by default. To disable top N query monitoring, update the dynamic cluster settings for the desired metric types. For example, to disable monitoring of top N queries by latency, update the `search.insights.top_queries.latency.enabled` setting:

```json
PUT _cluster/settings
{
  "persistent" : {
    "search.insights.top_queries.latency.enabled" : false
  }
}
```
{% include copy-curl.html %}

## Configuring the window size

To configure the monitoring window size, update the `window_size` setting for the desired metric type. The default `window_size` is `5m`. For example, to collect the top N queries by latency in a 60-minute window, update the `search.insights.top_queries.latency.window_size` setting:

```json
PUT _cluster/settings
{
  "persistent" : {
    "search.insights.top_queries.latency.window_size" : "60m"
  }
}
```
{% include copy-curl.html %}

## Configuring the value of N 

To configure the value of N, update the `top_n_size` setting for the desired metric type. The default `top_n_size` is `10`. For example, to collect the top 20 queries by latency, update the `insights.top_queries.latency.top_n_size` setting:

```json
PUT _cluster/settings
{
  "persistent" : {
    "search.insights.top_queries.latency.top_n_size" : 20
  }
}
```
{% include copy-curl.html %}

## Monitoring current top N queries 

You can use the Insights API endpoint to retrieve the top N queries for the current time window. This API returns top N `latency` results by default.

```json
GET /_insights/top_queries
```
{% include copy-curl.html %}

### Query parameters

The following table lists the available query parameters. All query parameters are optional.

Parameter | Data type     | Description
:--- |:---------| :---
`type`    | String   | The metric type for which to retrieve top N query data. Results will be sorted in descending order based on this metric. Valid values are `latency`, `cpu`, and `memory`. Default is `latency`.
`from`    | String | The start of the time range for fetching historical top N queries. For more information, see [Monitoring historical top N queries](#monitoring-historical-top-N-queries).
`to`      | String | The end of the time range for fetching historical top N queries. For more information, see [Monitoring historical top N queries](#monitoring-historical-top-N-queries).
`id`      | String   | The ID of a specific top query record to retrieve.
`verbose` | Boolean  | Indicates whether to return verbose output. Default is `true`.

### Example response

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "top_queries" : [
    {
      "timestamp" : 1745021834451,
      "id" : "36506bd2-7bca-4a0a-a6b8-f3e7db2b0745",
      "group_by" : "NONE",
      "indices" : [
        "my-index-0"
      ],
      "source" : {
        "size" : 20,
        "query" : {
          "bool" : {
            "must" : [
              {
                "match_phrase" : {
                  "message" : {
                    "query" : "document",
                    "slop" : 0,
                    "zero_terms_query" : "NONE",
                    "boost" : 1.0
                  }
                }
              },
              {
                "match" : {
                  "user.id" : {
                    "query" : "userId",
                    "operator" : "OR",
                    "prefix_length" : 0,
                    "max_expansions" : 50,
                    "fuzzy_transpositions" : true,
                    "lenient" : false,
                    "zero_terms_query" : "NONE",
                    "auto_generate_synonyms_phrase_query" : true,
                    "boost" : 1.0
                  }
                }
              }
            ],
            "adjust_pure_negative" : true,
            "boost" : 1.0
          }
        }
      },
      "task_resource_usages" : [
        {
          "action" : "indices:data/read/search[phase/query]",
          "taskId" : 28,
          "parentTaskId" : 27,
          "nodeId" : "BBgWzu8QR0qDkR0G45aw8w",
          "taskResourceUsage" : {
            "cpu_time_in_nanos" : 22664000,
            "memory_in_bytes" : 6604536
          }
        },
        {
          "action" : "indices:data/read/search",
          "taskId" : 27,
          "parentTaskId" : -1,
          "nodeId" : "BBgWzu8QR0qDkR0G45aw8w",
          "taskResourceUsage" : {
            "cpu_time_in_nanos" : 119000,
            "memory_in_bytes" : 3920
          }
        }
      ],
      "node_id" : "BBgWzu8QR0qDkR0G45aw8w",
      "phase_latency_map" : {
        "expand" : 0,
        "query" : 23,
        "fetch" : 0
      },
      "labels" : {
        "X-Opaque-Id" : "query-label-1"
      },
      "search_type" : "query_then_fetch",
      "total_shards" : 1,
      "measurements" : {
        "memory" : {
          "number" : 6608456,
          "count" : 1,
          "aggregationType" : "NONE"
        },
        "latency" : {
          "number" : 24,
          "count" : 1,
          "aggregationType" : "NONE"
        },
        "cpu" : {
          "number" : 22783000,
          "count" : 1,
          "aggregationType" : "NONE"
        }
      }
    },
    {
      "timestamp" : 1745021826937,
      "id" : "86e161d0-e982-48c2-b8da-e3a3763f2e36",
      "group_by" : "NONE",
      "indices" : [
        "my-index-*"
      ],
      "source" : {
        "size" : 20,
        "query" : {
          "term" : {
            "user.id" : {
              "value" : "userId",
              "boost" : 1.0
            }
          }
        }
      },
      "task_resource_usages" : [
        {
          "action" : "indices:data/read/search[phase/query]",
          "taskId" : 26,
          "parentTaskId" : 25,
          "nodeId" : "BBgWzu8QR0qDkR0G45aw8w",
          "taskResourceUsage" : {
            "cpu_time_in_nanos" : 11020000,
            "memory_in_bytes" : 4292272
          }
        },
        {
          "action" : "indices:data/read/search",
          "taskId" : 25,
          "parentTaskId" : -1,
          "nodeId" : "BBgWzu8QR0qDkR0G45aw8w",
          "taskResourceUsage" : {
            "cpu_time_in_nanos" : 1032000,
            "memory_in_bytes" : 115816
          }
        }
      ],
      "node_id" : "BBgWzu8QR0qDkR0G45aw8w",
      "phase_latency_map" : {
        "expand" : 0,
        "query" : 15,
        "fetch" : 1
      },
      "labels" : { },
      "search_type" : "query_then_fetch",
      "total_shards" : 1,
      "measurements" : {
        "memory" : {
          "number" : 4408088,
          "count" : 1,
          "aggregationType" : "NONE"
        },
        "latency" : {
          "number" : 23,
          "count" : 1,
          "aggregationType" : "NONE"
        },
        "cpu" : {
          "number" : 12052000,
          "count" : 1,
          "aggregationType" : "NONE"
        }
      }
    }
  ]
}
```

</details>

If your query returns no results, ensure that top N query monitoring is enabled for the target metric type and that search requests were made within the current [time window](#configuring-the-window-size).
{: .important}

## Monitoring historical top N queries

To query historical top N results, specify a time range with the `from` and `to` parameters in ISO 8601 format: `YYYY-MM-DD'T'HH:mm:ss.SSSZ`.
For example, to retrieve the top N queries from August 25, 2024, at 15:00 UTC to August 30, 2024, at 17:00 UTC, send the following request: 

```json
GET /_insights/top_queries?from=2024-08-25T15:00:00.000Z&to=2024-08-30T17:00:00.000Z
```
{% include copy-curl.html %}

To view historical query data, the exporter type must be set to `local_index`. For more information, see [Configuring a local index exporter](#configuring-a-local-index-exporter).
{: .important}

## Exporting top N query data

You can configure your desired exporter to export top N query data to different sinks, allowing for better monitoring and analysis of your OpenSearch queries. Currently, the following exporters are supported:
- [Debug exporter](#configuring-a-debug-exporter)
- [Local index exporter](#configuring-a-local-index-exporter)

### Configuring a debug exporter

To use the debug exporter, set the exporter type to `debug`:

```json
PUT _cluster/settings
{
  "persistent" : {
      "search.insights.top_queries.exporter.type" : "debug"
  }
}
```
{% include copy-curl.html %}

### Configuring a local index exporter

The default exporter is `local_index`. A local index exporter allows you to save top N query data to indexes that are automatically created in your OpenSearch domain. Query Insights creates these indexes following the naming pattern `top_queries-YYYY.MM.dd-hashcode`, where `hashcode` is a 5-digit number generated based on the current UTC date. A new index is created daily. For historical top N lookups using the Top Queries API or the Query Insights dashboard, you must enable the local index exporter.

To use the local index exporter, set the exporter type to `local_index`:

```json
PUT _cluster/settings
{
  "persistent" : {
    "search.insights.top_queries.exporter.type" : "local_index"
  }
}
```
{% include copy-curl.html %}

Use the `delete_after_days` setting (integer) to specify the number of days after which local indexes are automatically deleted. Query Insights runs a job once per day at 00:05 UTC to delete top N local indexes older than the specified number of days. The default value for `delete_after_days` is 7, with valid values ranging from `1` to `180`.

For example, to delete local indexes older than 10 days, send the following request:

```json
PUT _cluster/settings
{
  "persistent" : {
    "search.insights.top_queries.exporter.delete_after_days" : "10"
  }
}
```
{% include copy-curl.html %}
