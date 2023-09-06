---
layout: default
title: Metric records
nav_order: 30
parent: Metrics
---

# Metric records

OpenSearch Benchmark stores metrics in the `benchmark-metrics-*` indices, which creates a new index each month. The following is in example metric record stored in the `benchmark-metrics-2023-08` index.

```json
{
  "_index": "benchmark-metrics-2023-08",
  "_id": "UiNY4YkBpMtdJ7uj2rUe",
  "_version": 1,
  "_score": null,
  "_source": {
    "@timestamp": 1691702842821,
    "relative-time-ms": 65.90720731765032,
    "test-execution-id": "8c43ee4c-cb34-494b-81b2-181be244f832",
    "test-execution-timestamp": "20230810T212711Z",
    "environment": "local",
    "workload": "geonames",
    "test_procedure": "append-no-conflicts",
    "provision-config-instance": "external",
    "name": "service_time",
    "value": 607.8001195564866,
    "unit": "ms",
    "sample-type": "normal",
    "meta": {
      "source_revision": "unknown",
      "distribution_version": "1.1.0",
      "distribution_flavor": "oss",
      "index": "geonames",
      "took": 13,
      "success": true,
      "success-count": 125,
      "error-count": 0
    },
    "task": "index-append",
    "operation": "index-append",
    "operation-type": "bulk"
  },
  "fields": {
    "@timestamp": [
      "2023-08-10T21:27:22.821Z"
    ],
    "test-execution-timestamp": [
      "2023-08-10T21:27:11.000Z"
    ]
  },
  "highlight": {
    "workload": [
      "@opensearch-dashboards-highlighted-field@geonames@/opensearch-dashboards-highlighted-field@"
    ],
    "meta.index": [
      "@opensearch-dashboards-highlighted-field@geonames@/opensearch-dashboards-highlighted-field@"
    ]
  },
  "sort": [
    1691702831000
  ]
}
```

The following fields are configurable in the `opensearch-benchmarks-metrics-*` file:

