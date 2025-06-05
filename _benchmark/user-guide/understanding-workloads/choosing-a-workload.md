---
layout: default
title: Choosing a workload
nav_order: 20
grand_parent: User guide
parent: Understanding workloads
---

# Choosing a workload

The [opensearch-benchmark-workloads](https://github.com/opensearch-project/opensearch-benchmark-workloads) repository contains a list of workloads that you can use to run your benchmarks. Using a workload similar to your cluster's use cases can save you time and effort when assessing your cluster's performance. 

For example, say you're a system architect at a rideshare company. As a rideshare company, you collect and store data based on trip times, locations, and other data related to each rideshare. Instead of building a custom workload and using your own data, which requires additional time, effort, and cost, you can use the [nyc_taxis](https://github.com/opensearch-project/opensearch-benchmark-workloads/tree/main/nyc_taxis) workload to benchmark your cluster because the data inside the workload is similar to the data that you collect. 

## Criteria for choosing a workload

Consider the following criteria when deciding which workload would work best for benchmarking your cluster:

- The cluster's use case and the size of the cluster. Small clusters usually contain 1--10 nodes and are suitable for development environments. Medium clusters usually contain 11--50 nodes and are used for testing environments that more closely resemble a production cluster. 
- The data types that your cluster uses compared to the data structure of the documents contained in the workload. Each workload contains an example document so that you can compare data types, or you can view the index mappings and data types in the `index.json` file.
- The query types most commonly used inside your cluster. The `operations/default.json` file contains information about the query types and workload operations. For a list of common operations, see [Common operations]({{site.url}}{{site.baseurl}}/benchmark/user-guide/understanding-workloads/common-operations/).

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
- **Cluster requirements**: Suitable for clusters that make heavy use of the [percolator]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/percolator/) feature.

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

## Creating a custom workload

If you can't find an official workload that suits your needs, you can create a custom workload. For more information, see [Creating custom workloads]({{site.url}}{{site.baseurl}}/benchmark/user-guide/working-with-workloads/creating-custom-workloads/).
