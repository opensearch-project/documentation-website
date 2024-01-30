---
layout: default
title: Choosing a workload
nav_order: 20
grand_parent: User guide
parent: Understanding workloads
---

# Choosing a workload

The [opensearch-benchmark-workloads](https://github.com/opensearch-project/opensearch-benchmark-workloads) repository contains a list of workloads that you can use to run your benchmarks. Using a workload similar to your cluster's use cases can save you time and effort when assessing your cluster's performance. 

For example, say you're a system architect at a ride share company. As a ride share company you collect and store data based on trip times, locations, and other data related to each ride share. Instead of building a custom workload and using your own data, which takes additional time, effort, and cost, you can use the [nyc_taxis](https://github.com/opensearch-project/opensearch-benchmark-workloads/tree/main/nyc_taxis) workload to benchmark your cluster, because the data inside the workload is similar to the data you collect. 

## Criteria for choosing a workload

Consider the following criteria when deciding which workload would work best for benchmarking your cluster:

- The cluster's use case. 
- The data types your cluster uses compared to the data structure of the documents contained in the workload. Each workload contains an example document so that you can compare data types, or you can view the index mappings and data types in the `index.json` file.
- The query types most commonly used inside your cluster. The `operations/default.json` file has information about the query types and workload operations. 

## General search clusters

For benchmarking clusters built for general search use cases, start with the `[nyc_taxis]`(https://github.com/opensearch-project/opensearch-benchmark-workloads/tree/main/nyc_taxis) workload. The workload contains data about the rides with yellow taxis in New York in 2015. 

## Log data

For benchmarking clusters built for indexing and search with log data, use the [`http_logs`](https://github.com/opensearch-project/opensearch-benchmark-workloads/tree/main/http_logs) workload. The workload contains data from the 1998 World Cup.