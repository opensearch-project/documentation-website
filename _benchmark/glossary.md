---
layout: default
title: Glossary
nav_order: 100
---

# OpenSearch Benchmark glossary

The following terms are commonly used in OpenSearch Benchmark:

- **Corpora**: A collection of documents.
- **Latency**: If `target-throughput` is disabled (has no value or a value of `0)`, then latency is equal to service time. If `target-throughput` is enabled (has a value of 1 or greater), then latency is equal to the service time plus the amount of time the request waits in the queue before being sent.
- **Metric keys**: The metrics stored by OpenSearch Benchmark, based on the configuration in the [metrics record]({{site.url}}{{site.baseurl}}/benchmark/metrics/metric-records/).
- **Operations**: In workloads, a list of API operations performed by a workload.
- **Pipeline**: A series of steps occurring both before and after running a workload that determines benchmark results.
- **Schedule**: A list of two or more operations performed in the order they appear when a workload is run.
- **Service time**: The amount of time taken for `opensearch-py`, the primary client for OpenSearch Benchmark, to send a request and receive a response from the OpenSearch cluster. It includes the amount of time taken for the server to process a request as well as for network latency, load balancer overhead, and deserialization/serialization.
- **Summary report**: A report generated at the end of a test based on the metric keys defined in the workload.
- **Test**: A single invocation of the OpenSearch Benchmark binary.
- **Throughput**: The number of operations completed in a given period of time.
- **Workload**: A collection of one or more benchmarking tests that use a specific document corpus to perform a benchmark against a cluster. The document corpus contains any indexes, data files, or operations invoked when the workload runs.