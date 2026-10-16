---
layout: default
title: API
parent: Root Cause Analysis
grand_parent: Performance Analyzer
nav_order: 1
redirect_from:
  - /monitoring-plugins/pa/rca/api/
---

# RCA API

The Performance Analyzer root cause analysis (RCA) agent has been removed. The agent served the Performance Analyzer API on port 9600, so the metrics, batch metrics, and RCA APIs and PerfTop dashboards described in this section are not available. To collect cluster performance metrics, use the [metrics framework]({{site.url}}{{site.baseurl}}/monitoring-your-cluster/metrics/getting-started/). For more information, see [Breaking changes]({{site.url}}{{site.baseurl}}/breaking-changes/#performance-analyzer-plugin).
{: .warning}

Use the following API to retrieve root cause analysis (RCA) results.

## Example request

```
# Request all available RCAs
GET localhost:9600/_plugins/_performanceanalyzer/rca

# Request a specific RCA
GET localhost:9600/_plugins/_performanceanalyzer/rca?name=HighHeapUsageClusterRca
```


## Example response

```json
{
  "HighHeapUsageClusterRca": [{
    "rca_name": "HighHeapUsageClusterRca",
    "state": "unhealthy",
    "timestamp": 1587426650942,
    "HotClusterSummary": [{
      "number_of_nodes": 2,
      "number_of_unhealthy_nodes": 1,
      "HotNodeSummary": [{
        "host_address": "192.168.144.2",
        "node_id": "JtlEoRowSI6iNpzpjlbp_Q",
        "HotResourceSummary": [{
          "resource_type": "old gen",
          "threshold": 0.65,
          "value": 0.81827232588145373,
          "avg": NaN,
          "max": NaN,
          "min": NaN,
          "unit_type": "heap usage in percentage",
          "time_period_seconds": 600,
          "TopConsumerSummary": [{
              "name": "CACHE_FIELDDATA_SIZE",
              "value": 590702564
            },
            {
              "name": "CACHE_REQUEST_SIZE",
              "value": 28375
            },
            {
              "name": "CACHE_QUERY_SIZE",
              "value": 12687
            }
          ],
        }]
      }]
    }]
  }]
}
```
