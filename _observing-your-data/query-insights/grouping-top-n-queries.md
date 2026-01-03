---
layout: default
title: Grouping top N queries
parent: Query insights
nav_order: 20
---

# Grouping top N queries
**Introduced 2.17**
{: .label .label-purple }

Monitoring the [top N queries]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/top-n-queries/) can help you to identify the most resource-intensive queries based on latency, CPU, and memory usage in a specified time window. However, if a single computationally expensive query is executed multiple times, it can occupy all top N query slots, potentially preventing other expensive queries from appearing in the list. To address this issue, you can group similar queries, gaining insight into various high-impact query groups.

Starting with OpenSearch version 2.17, the top N queries can be grouped by `similarity`, with additional grouping options planned for future version releases. 

## Grouping queries by similarity

Grouping queries by `similarity` organizes them based on the query structure, removing everything except the core query operations.

For example, the following query:

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

Has the following corresponding query structure:

```c
bool
  must
    exists
  query_string
```

When queries share the same query structure, they are grouped together, ensuring that all similar queries belong to the same group.

## Configuring the query structure

The preceding example query shows a simplified query structure. By default, the query structure also includes field names and field data types. 

For example, consider an index `index1` with the following field mapping:

```json
"mappings": {
  "properties": {
    "field1": {
      "type": "keyword"
    },
    "field2": {
      "type": "text"
    },
    "field3": {
      "type": "text"
    },
    "field4": {
      "type": "long"
    }
  }
}
```

If you run the following query on this index:

```json
{
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "field1": "example_value"
          }
        }
      ],
      "filter": [
        {
          "match": {
            "field2": "search_text"
          }
        },
        {
          "range": {
            "field4": {
              "gte": 1,
              "lte": 100
            }
          }
        }
      ],
      "should": [
        {
          "regexp": {
            "field3": ".*"
          }
        }
      ]
    }
  }
}
```

Then the query has the following corresponding query structure:

```c
bool []
  must:
    term [field1, keyword]
  filter:
    match [field2, text]
    range [field4, long]
  should:
    regexp [field3, text]
```

To exclude field names and field data types from the query structure, configure the following settings:

```json
PUT _cluster/settings
{
  "persistent" : {
    "search.insights.top_queries.grouping.attributes.field_name" : false,
    "search.insights.top_queries.grouping.attributes.field_type" : false
  }
}
```
{% include copy-curl.html %}

## Aggregate metrics per group

In addition to retrieving latency, CPU, and memory metrics for individual top N queries, you can obtain aggregate statistics for the
top N query groups. For each query group, the response includes the following statistics:
- The total latency, CPU usage, or memory usage (depending on the configured metric type) 
- The total query count

Using these statistics, you can calculate the average latency, CPU usage, or memory usage for each query group. 
The response also includes one example query from the query group. 

## Configuring query grouping

To configure grouping for top N queries, use the following steps.

### Step 1: Enable top N query monitoring 

Ensure that top N query monitoring is enabled for at least one of the metrics: latency, CPU, or memory. For more information, see [Configuring top N query monitoring]({{site.url}}{{site.baseurl}}/observing-your-data/query-insights/top-n-queries/#configuring-top-n-query-monitoring).

For example, to enable top N query monitoring by latency with the default settings, send the following request:

```json
PUT _cluster/settings
{
  "persistent" : {
    "search.insights.top_queries.latency.enabled" : true
  }
}
```
{% include copy-curl.html %}

### Step 2: Configure query grouping

Set the desired grouping method by updating the following cluster setting:

```json
PUT _cluster/settings
{
  "persistent" : {
    "search.insights.top_queries.grouping.group_by" : "similarity"
  }
}
```
{% include copy-curl.html %}

The default value for the `group_by` setting is `none`, which disables grouping. As of OpenSearch 2.17, the supported values for `group_by` are `similarity` and `none`.

### Step 3 (Optional): Limit the number of monitored query groups

Optionally, you can limit the number of monitored query groups. Queries already included in the top N query list (the most resource-intensive queries) will not be considered in determining the limit. Essentially, the maximum applies only to other query groups, and the top N queries are tracked separately. This helps manage the tracking of query groups based on workload and query window size. 

To limit tracking to 100 query groups, send the following request:

```json
PUT _cluster/settings
{
  "persistent" : {
    "search.insights.top_queries.grouping.max_groups_excluding_topn" : 100
  }
}
```
{% include copy-curl.html %}

The default value for `max_groups_excluding_topn` is `100`, and you can set it to any value between `0` and `10,000`, inclusive.

## Monitoring query groups

To view the top N query groups, send the following request:

```json
GET /_insights/top_queries
```
{% include copy-curl.html %}

The response contains the top N query groups:

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "top_queries": [
    {
      "timestamp": 1725495127359,
      "wlm_group_id": "DEFAULT_WORKLOAD_GROUP",
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
      "username": "admin",
      "indices": [
        "my_index"
      ],
      "labels": {},
      "user_roles": [
        "all_access"
      ],
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
      "wlm_group_id": "DEFAULT_WORKLOAD_GROUP",
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
      "username": "admin",
      "indices": [
        "my_index"
      ],
      "labels": {},
      "user_roles": [
        "all_access"
      ],
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
      "wlm_group_id": "DEFAULT_WORKLOAD_GROUP",
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
      "username": "admin",
      "indices": [
        "my_index"
      ],
      "labels": {},
      "user_roles": [
        "all_access"
      ],
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

</details>

## Response body fields

The response includes the following fields.

Field | Data type        | Description
:--- |:-----------------| :---
`top_queries` | Array            | The list of top query groups.
`top_queries.timestamp` | Integer          | The execution timestamp for the first query in the query group.
`top_queries.id` | String           | The unique identifier for the query or query group.
`top_queries.phase_latency_map` | Object           | The phase latency map for the first query in the query group. The map includes the amount of time, in milliseconds, that the query spent in the `expand`, `query`, and `fetch` phases.
`top_queries.source` | Object           | The first query in the query group.
`top_queries.group_by` | String           | The `group_by` setting applied when the query was executed.
`top_queries.total_shards` | Integer          | The number of shards on which the first query was executed.
`top_queries.node_id` | String           | The node ID of the node that coordinated the execution of the first query in the query group.
`top_queries.search_type` | String           | The search request execution type (`query_then_fetch` or `dfs_query_then_fetch`). For more information, see the `search_type` parameter in the [Search API documentation]({{site.url}}{{site.baseurl}}/api-reference/search/#query-parameters).
`top_queries.indices` | Array            | The indexes to which the first query in the query group is applied.
`top_queries.task_resource_usages` | Array of objects | The resource usage breakdown for the various tasks belonging to the first query in the query group.
`top_queries.query_hashcode` | String           | The hash code that uniquely identifies the query group and is generated from the [query structure](#grouping-queries-by-similarity).
`top_queries.labels` | Object           | Used to label the top query.
`top_queries.measurements` | Object           | The aggregate measurements for the query group.
`top_queries.measurements.latency` | Object           | The aggregate latency measurements for the query group.
`top_queries.measurements.latency.number` | Integer          | The total latency for the query group.
`top_queries.measurements.latency.count` | Integer          | The number of queries in the query group.
`top_queries.measurements.latency.aggregationType` | String           | The aggregation type for the current entry. If grouping by similarity is enabled, then `aggregationType` is `AVERAGE`. If it is not enabled, then `aggregationType` is `NONE`. 