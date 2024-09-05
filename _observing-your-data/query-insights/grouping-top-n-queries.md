---
layout: default
title: Grouping Top N queries
parent: Query insights
nav_order: 10
---

# Grouping top N queries

The [Top n queries feature]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/top-n-queries/#configuring-top-n-query-monitoring) is a powerful 
tool for identifying the most resource-intensive queries based on latency, CPU, and memory usage over a specified time window. 
However, if a single expensive query is executed multiple times, it can dominate all the Top N query slots, potentially 
obscuring other costly queries. 
To address this issue, you can group Top N queries, which provides a clearer view of various high-impact query groups by consolidating similar ones.


## Introduction

To enable the grouping feature for Top N queries, you must first enable Top N for a metric type and configure the
`search.insights.top_queries.group_by` cluster setting. By default, this setting is set to none. 
Currently, Top N queries can be grouped by `similarity`, with additional grouping options planned for future releases.
For detailed instructions on configuring grouping for Top N queries, refer to the [configuring grouping top N queries](#configuring-grouping-top-n-queries) section.


## Group by similarity
Grouping by `similarity` organizes queries based on the `shape` of the query, stripping out everything except the core query operations.

For example, consider the following query:
```json
{
  "query": {
    "bool": {
      "must": [
        { "exists": { "field": "field1" } }
      ],
      "query_string": {
        "query": "search query"
      }
    }
  }
}
```
{% include copy-curl.html %}

The corresponding query shape is:
```json
bool
  must
    exists
  query_string
```

When queries share the same query shape, they are grouped together, ensuring that all similar queries belong to the same group.


## Aggregate metrics per group
For the [top n queries feature]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/top-n-queries/#configuring-top-n-query-monitoring),  
you can retrieve latency, CPU, and memory metrics for individual Top N queries. 
Additionally, for Top N query groups, aggregate statistics are now available. For each query group, the response will include:
1. If Top N by latency is enabled:
   - `Total latency`
   - `Count`
2. If Top N by cpu is enabled:
   - `Total cpu`
   - `Count`
3. If Top N by memory is enabled:
   - `Total memory`
   - `Count`

These metrics allow for the calculation of average latency, CPU, and memory usage per query group. 
The response will also include one example query from the query group. 
For more details, refer to the [examples](#examples) section.

## Configuring grouping top N queries
To configure grouping for Top N queries, follow these steps:

1. Enable Top N Metrics

Ensure that Top N is enabled for at least one of the metrics: latency, CPU, or memory. For details on configuring Top N query monitoring, see [configuring Top N query monitoring]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/top-n-queries/#configuring-top-n-query-monitoring).
Example configuration for enabling latency with default settings:
```json
PUT _cluster/settings
{
  "persistent" : {
    "search.insights.top_queries.latency.enabled" : true
  }
}
```
{% include copy-curl.html %}

2. Configure Grouping for Top N Queries

Set the desired grouping method using the following cluster setting:
```json
PUT _cluster/settings
{
  "persistent" : {
    "search.insights.top_queries.group_by" : "similarity"
  }
}
```
{% include copy-curl.html %}

The default value for the `group_by` setting is `none`, which disables grouping. 
Currently, the supported values for group_by are `similarity` and `none`.

3. (Optional) Set the Maximum Number of Groups Excluding Top N

You can define a maximum number of query groups to track, excluding those that are part of the Top N. 
This helps manage the tracking of query groups based on workload and query window size. For example:
```json
PUT _cluster/settings
{
  "persistent" : {
    "search.insights.top_queries.max_groups_excluding_topn" : 100
  }
}
```
{% include copy-curl.html %}

The default value for `max_groups_excluding_topn` is `100`, and it can be set between 0 and 10,000.

This setting limits the number of query groups tracked, excluding those that are part of the [Top N]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/top-n-queries/#configuring-the-value-of-n). 
This is important for managing the query groups within the [window]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/top-n-queries/#configuring-the-window-size) and maintaining performance.

## Examples

To enable grouping for Top N queries by similarity, use the following command:
```json
curl -X PUT "localhost:9200/_cluster/settings" -H 'Content-Type: application/json' -d'
{
  "persistent": {
    "search.insights.top_queries.group_by": "similarity"
  }
}
'
```
{% include copy-curl.html %}


The response will be:
```json
{"acknowledged":true,"persistent":{"search":{"insights":{"top_queries":{"group_by":"similarity"}}}},"transient":{}}%
```
{% include copy-curl.html %}

To get the Top N query groups, execute the following request:
```json
curl -XGET "http://localhost:9200/_insights/top_queries"
```
{% include copy-curl.html %}

Example response:
```json
{
  "top_queries": [
    {
      "timestamp": 1725495127359,
      "source": {
        "query": {
          "match_all": {
            "boost": 1.0
          }
        }
      },
      "phase_latency_map": {
        "expand": 0,
        "query": 55,
        "fetch": 3
      },
      "total_shards": 1,
      "node_id": "ZbINz1KFS1OPeFmN-n5rdg",
      "query_hashcode": "b4c4f69290df756021ca6276be5cbb75",
      "task_resource_usages": [
        {
          "action": "indices:data/read/search[phase/query]",
          "taskId": 30,
          "parentTaskId": 29,
          "nodeId": "ZbINz1KFS1OPeFmN-n5rdg",
          "taskResourceUsage": {
            "cpu_time_in_nanos": 33249000,
            "memory_in_bytes": 2896848
          }
        },
        {
          "action": "indices:data/read/search",
          "taskId": 29,
          "parentTaskId": -1,
          "nodeId": "ZbINz1KFS1OPeFmN-n5rdg",
          "taskResourceUsage": {
            "cpu_time_in_nanos": 3151000,
            "memory_in_bytes": 133936
          }
        }
      ],
      "indices": [
        "my_index"
      ],
      "labels": {},
      "search_type": "query_then_fetch",
      "measurements": {
        "latency": {
          "number": 160,
          "count": 10,
          "aggregationType": "AVERAGE"
        }
      }
    },
    {
      "timestamp": 1725495135160,
      "source": {
        "query": {
          "term": {
            "content": {
              "value": "first",
              "boost": 1.0
            }
          }
        }
      },
      "phase_latency_map": {
        "expand": 0,
        "query": 18,
        "fetch": 0
      },
      "total_shards": 1,
      "node_id": "ZbINz1KFS1OPeFmN-n5rdg",
      "query_hashcode": "c3620cc3d4df30fb3f95aeb2167289a4",
      "task_resource_usages": [
        {
          "action": "indices:data/read/search[phase/query]",
          "taskId": 50,
          "parentTaskId": 49,
          "nodeId": "ZbINz1KFS1OPeFmN-n5rdg",
          "taskResourceUsage": {
            "cpu_time_in_nanos": 10188000,
            "memory_in_bytes": 288136
          }
        },
        {
          "action": "indices:data/read/search",
          "taskId": 49,
          "parentTaskId": -1,
          "nodeId": "ZbINz1KFS1OPeFmN-n5rdg",
          "taskResourceUsage": {
            "cpu_time_in_nanos": 262000,
            "memory_in_bytes": 3216
          }
        }
      ],
      "indices": [
        "my_index"
      ],
      "labels": {},
      "search_type": "query_then_fetch",
      "measurements": {
        "latency": {
          "number": 109,
          "count": 7,
          "aggregationType": "AVERAGE"
        }
      }
    },
    {
      "timestamp": 1725495139766,
      "source": {
        "query": {
          "match": {
            "content": {
              "query": "first",
              "operator": "OR",
              "prefix_length": 0,
              "max_expansions": 50,
              "fuzzy_transpositions": true,
              "lenient": false,
              "zero_terms_query": "NONE",
              "auto_generate_synonyms_phrase_query": true,
              "boost": 1.0
            }
          }
        }
      },
      "phase_latency_map": {
        "expand": 0,
        "query": 15,
        "fetch": 0
      },
      "total_shards": 1,
      "node_id": "ZbINz1KFS1OPeFmN-n5rdg",
      "query_hashcode": "484eaabecd13db65216b9e2ff5eee999",
      "task_resource_usages": [
        {
          "action": "indices:data/read/search[phase/query]",
          "taskId": 64,
          "parentTaskId": 63,
          "nodeId": "ZbINz1KFS1OPeFmN-n5rdg",
          "taskResourceUsage": {
            "cpu_time_in_nanos": 12161000,
            "memory_in_bytes": 473456
          }
        },
        {
          "action": "indices:data/read/search",
          "taskId": 63,
          "parentTaskId": -1,
          "nodeId": "ZbINz1KFS1OPeFmN-n5rdg",
          "taskResourceUsage": {
            "cpu_time_in_nanos": 293000,
            "memory_in_bytes": 3216
          }
        }
      ],
      "indices": [
        "my_index"
      ],
      "labels": {},
      "search_type": "query_then_fetch",
      "measurements": {
        "latency": {
          "number": 43,
          "count": 3,
          "aggregationType": "AVERAGE"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}