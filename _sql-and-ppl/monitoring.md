---
layout: default
title: Monitoring
nav_order: 95
redirect_from:
  - /search-plugins/sql/monitoring/
---

# SQL and PPL monitoring

OpenSearch provides a stats endpoint that collects metrics for SQL and PPL query processing within a set interval. Statistics are collected at the node level, so you receive metrics only for the node you're accessing.

## Node statistics

The response contains the following fields.

|                 Field name|                                                    Description|
| ------------------------- | ------------------------------------------------------------- |
|              `request_total`|                                         Total count of request.|
|              `request_count`|                     Total count of request within the interval.|
|`failed_request_count_syserr`|Count of failed request due to system error within the interval.|
|`failed_request_count_cuserr`| Count of failed request due to bad request within the interval.|
|    `failed_request_count_cb`| Indicate if plugin is being circuit broken within the interval.|


### Example

SQL query:

```console
>> curl -H 'Content-Type: application/json' -X GET localhost:9200/_plugins/_sql/stats
```
{% include copy.html %}


The query returns the following results:

```json
{
  "failed_request_count_cb": 0,
  "failed_request_count_cuserr": 0,
  "circuit_breaker": 0,
  "request_total": 0,
  "request_count": 0,
  "failed_request_count_syserr": 0
}
```
