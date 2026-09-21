---
layout: default
title: Workload types
nav_order: 20
has_children: true
has_toc: false
---

# Workload types

The [`opensearch-benchmark-workloads`](https://github.com/opensearch-project/opensearch-benchmark-workloads) repository contains prepackaged workloads that you can run against your cluster. This page describes the data, cluster requirements, and query types for each workload. To determine which one fits your cluster, see [Choosing a workload]({{site.url}}{{site.baseurl}}/benchmark/choosing-a-workload/).

## General search use cases: `nyc_taxis`

For benchmarking clusters built for general search use cases, start with the [nyc_taxis](https://github.com/opensearch-project/opensearch-benchmark-workloads/tree/main/nyc_taxis) workload. It contains the following:

- **Data type**: Ride data from yellow taxis in New York City in 2015.
- **Cluster requirements**: Suitable for small- to medium-sized clusters.

This workload tests the following queries and search functions:

- Range queries
- Term queries on various fields
- Geodistance queries
- Aggregations

## Vector data: `vectorsearch`

The [`vectorsearch`](https://github.com/opensearch-project/opensearch-benchmark-workloads/tree/main/vectorsearch) workload is designed to benchmark vector search capabilities, including performance and accuracy. It contains the following:

- **Data type**: High-dimensional vector data, often representing embeddings of text or images.
- **Cluster requirements**: Requires a cluster with [vector search capabilities]({{site.url}}{{site.baseurl}}/vector-search/) enabled.

This workload tests the following queries and search functions:

- k-NN vector searches
- Hybrid searches combining vector similarity with metadata filtering
- Indexing performance for high-dimensional vector data

For the supported parameters, test procedures, and sample results, see [Vector search workload]({{site.url}}{{site.baseurl}}/benchmark/workloads/vectorsearch/).

## Comprehensive search solutions: `big5`

The [big5](https://github.com/opensearch-project/opensearch-benchmark-workloads/tree/main/big5) workload is a comprehensive benchmark suite for testing various aspects of search engine performance, including overall search engine performance across multiple use cases. It contains the following:

- **Data type**: A mix of different data types, including text, numeric, and structured data.
- **Cluster requirements**: Suitable for medium to large clusters because it's designed to stress test various components.

This workload tests the following queries and search functions:

- Full-text search performance
- Aggregation performance
- Complex Boolean queries
- Sorting and pagination
- Indexing performance for various data types

## Percolator queries: `percolator`

The [percolator](https://github.com/opensearch-project/opensearch-benchmark-workloads/tree/main/percolator) workload is designed to test the performance of the `percolator` query type. It contains the following:

- **Data type**: A set of stored queries and documents to be matched against those queries.
- **Cluster requirements**: Suitable for clusters that make heavy use of the [percolator]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/percolator/) feature.

This workload tests the following queries and search functions:

- Indexing performance for storing queries
- Matching performance for percolator queries
- Scalability with increasing numbers of stored queries

## Log data: `http_logs`

For benchmarking clusters built for indexing and search using log data, use the [http_logs](https://github.com/opensearch-project/opensearch-benchmark-workloads/tree/main/http_logs) workload. It contains the following:

- **Data type**: HTTP access logs from the 1998 World Cup website.
- **Cluster requirements**: Suitable for clusters optimized for time-series data and log analytics.

This workload tests the following queries and search functions:

- Time range queries
- Term queries on fields like `status-code` or `user-agent`
- Aggregations for metrics like request count and average response size
- Cardinality aggregations on fields like `ip-address`.

## Next steps

- To compare these workloads against your cluster's use case, see [Choosing a workload]({{site.url}}{{site.baseurl}}/benchmark/choosing-a-workload/).
- To build a workload for data that no prepackaged workload matches, see [Creating custom workloads]({{site.url}}{{site.baseurl}}/benchmark/creating-custom-workloads/).
