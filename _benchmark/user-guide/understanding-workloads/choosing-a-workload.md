---
layout: default
title: Choosing a workload
nav_order: 20
grand_parent: User guide
parent: Understanding workloads
---

# Choosing a workload

The [opensearch-benchmark-workloads](https://github.com/opensearch-project/opensearch-benchmark-workloads) repository contains a list of workloads that you can use to run your benchmarks. Using a workload similar to you cluster's use cases can save you time and effort when assessing the performance of your cluster. 

For example, say you're a system architect at a ride share company. As a ride share company you collect and store data based off of trip times, locations, and other data related to each ride share. As opposed to building a custom workload and using your own data, which takes additional time, effort, and cost, you can use the [nyc_taxis](https://github.com/opensearch-project/opensearch-benchmark-workloads/tree/main/nyc_taxis) workload to benchmark your cluster, because the data inside the workload is similar to the data you collect. 

## Criteria for choosing a workload

Consider the following when deciding which workload would work best for benchmarking your cluster:

- Consider the use case of your cluster. 
- Consider what data types your cluster uses by comparing it the data structure of the documents contained in the workload. Each workload contains an example document so you can compare data types. Also, you can go to `index.json` file in the workload to see the data type.
- Consider the types of queries most commonly used inside your cluster. You can find information about the types of queries or operations the workload runs inside of the `operations/default.json` file.

## General search clusters

For benchmarking clusters built for general search use cases, start with [nyc_taxis](https://github.com/opensearch-project/opensearch-benchmark-workloads/tree/main/nyc_taxis). The `nyc_taxis` workload data about the rides performed by yellow taxis in New York in 2015. 

## Log data

For benchmarking clusters built for indexing and search with log data, use [http_logs](https://github.com/opensearch-project/opensearch-benchmark-workloads/tree/main/http_logs). The [http_logs] workload contains data from the 1998 Football world cup.