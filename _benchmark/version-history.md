---
layout: default
title: Version history
nav_order: 101
canonical_url: https://docs.opensearch.org/latest/benchmark/version-history/
---

# Version history

This page details high-level changes across OpenSearch Benchmark versions.

## Updated terminology in OpenSearch Benchmark 2.0

OpenSearch Benchmark 2.0 introduces updated terminology to enhance the user experience and provide more intuitive benchmarking workflows.

1.X term | 2.X term |
:--- | :--- |
execute-test, test-execution-id, TestExecution | run, test-run, TestRun |
results_publishing, results_publisher | reporting, publisher |
provision-configs, provision-config-instances | cluster-configs, cluster-config-instances
load-worker-coordinator-hosts | worker-ips |

## Version history

OpenSearch Benchmark version | Release highlights | Release date
:--- | :--- | :---
[2.0.0](https://github.com/opensearch-project/opensearch-build/blob/main/release-notes/opensearch-release-notes-3.1.0.md) | Introduces new mechanisms to enhance user experience and intuitive benchmarking workflows. Adds new features such as synthetic data generation, data streaming, and visualizations. | 21 August 2025
[1.15.0](https://github.com/opensearch-project/opensearch-benchmark/releases/tag/1.15.0) |  Enables users to use session-based authentication that automatically handles temporary credential generation and refresh, which eliminates the need to manually export AWS credentials. Adds percent diff to compare command. Addresses bugs with execute-test | 7 August 2025
