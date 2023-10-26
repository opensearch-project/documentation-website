---
layout: default
title: Metric records
nav_order: 30
parent: Metrics reference
grand_parent: OpenSearch Benchmark Reference
redirect_from: /benchmark/metrics/metric-records/
---

# Metric records

OpenSearch Benchmark stores metrics in the `benchmark-metrics-*` indexes. A new index is created each month. The following is an example metric record stored in the `benchmark-metrics-2023-08` index:

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

The following fields found in the `_source` section of the metric's record are configurable in the `opensearch-benchmarks-metrics-*` file.

## @timestamp

The timestamp of when the sample was taken since the epoch, in milliseconds. For request-related metrics, such as `latency` or `service_time`, this is the timestamp of when OpenSearch Benchmark issued the request.

## relative-time-ms

The relative time since the start of the benchmark, in milliseconds. This is useful for comparing time-series graphs across multiple tests. For example, you can compare the indexing throughput over time across multiple tests. 

## test-execution-id

A UUID that changes on every invocation of the workload. It is intended to group all samples of a benchmarking run.

## test-execution-timestamp

The timestamp of when the workload was invoked (always in UTC).

## environment

The `environment` describes the origin of a metric record. This is defined when initially [configuring]({{site.url}}{{site.baseurl}}/benchmark/configuring-benchmark/) OpenSearch Benchmark. You can use separate environments for different benchmarks but store the metric records in the same index.

## workload, test_procedure, provision-config-instance

The workload, test procedures, and configuration instances for which the metrics are produced.

## name, value, unit

The actual metric name and value, with an optional unit. Depending on the nature of a metric, it is either sampled periodically by OpenSearch Benchmark, for example, CPU utilization or query latency, or measured once, for example, the final size of the index.

## sample-type

Determines whether to configure a benchmark to run in warmup mode by setting it to `warmup` or `normal`. Only `normal` samples are considered for the results that are reported.

## meta

The meta information for each metric record, including the following:

- CPU info: The number of physical and logical cores and the model name.
- OS info: The name and version of the operating system.
- Hostname.
- Node name: A unique name given to each node when OpenSearch Benchmark provisions the cluster.
- Source revision: The Git hash of the version of OpenSearch that is benchmarked. 
- Distribution version: The distribution version of OpenSearch that is benchmarked. 
- Custom tags: You can define custom tags by using the command line flag `--user-tags`. The tags are prefixed by `tag_` in order to avoid accidental clashes with OpenSearch Benchmark internal tags.
- Operation specific: An optional substructure of the operation. For bulk requests, this may be the number of documents; for searches, the number of hits.

Depending on the metric record, some meta information might be missing.

## Next steps

- For more information about how to access OpenSearch Benchmark metrics, see [Metrics]({{site.url}}{{site.baseurl}}/benchmark/metrics/index/).
- For more information about the metrics stored in OpenSearch Benchmark, see [Metric keys]({{site.url}}{{site.baseurl}}/benchmark/metrics/metric-keys/).
