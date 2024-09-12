---
layout: default
title: Glossary
nav_order: 10
---

# OpenSearch Benchmark glossary

The following terms are commonly used in OpenSearch Benchmark:

- **Corpora**: A collection of documents.
- **Latency**: If `target-throughput` is disabled (has no value or a value of `0)`, latency is equivalent to service time. If `target-throughput` is enabled (has a value of 1 or greater), latency is the service time plus the time the request waits in the queue before being sent.
- **Metric keys**: The metrics that OpenSearch Benchmark stores, based on the configuration in the [metrics record]({{site.url}}{{site.baseurl}}/benchmark/metrics/metric-records/).
- **Operations**: In workloads, a list of API requests performed by a workload.
- **Pipeline**: A series of steps occurring before and after a workload is run that determines benchmark results.
- **Schedule**: In workloads, a list of operations in a specific order.
- **Service time**: The amount of time that it takes for `opensearch-py`, the primary client for OpenSearch Benchmark, to send a request and receive a response from the OpenSearch cluster. It includes the amount of time that it takes for the server to process a request and also _includes_ network latency, load balancer overhead, and deserialization/serialization.
- **Summary report**: A report output at the end a test based on the metric keys defined in the workload.
- **Test**: A single invocation of the OpenSearch Benchmark binary.
- **Throughput**: The number of operations completed in a given period of time.
- **Workload**: A collection of one or more benchmarking scenarios that use a specific document corpus to perform a benchmark against your cluster. The document corpus contains any indexes, data files, and operations invoked when the workload runs.