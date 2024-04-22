---
layout: default
title: Understanding results
nav_order: 22
parent: User guide
---


At the end of each test run, a summary table is produced which includes metrics like service time, throughput, latency and more. These metrics provide insights into how the workload selected performed on a benchmarked OpenSearch cluster.

The following guide gives information about to understand the results of the summary report and what steps to take before running another test on your cluster.

## Selecting metrics to compare

While an OpenSearch Benchmark summary report provides many metrics related to the performance of your cluster, how to compare and use those metrics depends on your use case. Some users might be interested in the number of documents their can index, while another might be interested in how much latency it takes to query a document. For example, during the OpenSearch Benchmark nightly runs, the OpenSearch teams pulls the following metrics from the summary report:

!---- Insert example summary report here -----

```
```


## OpenSearch Benchmark runs

OpenSearch Benchmark runs a series of nightly tests targeting the overall OpenSearch development cluster. These runs can be found on https://opensearch.org/benchmarks. It compares several metrics across different test runs targeting both recent and future versions of OpenSearch.

As as well as measuring performance stability and gathering data that informs the development of OpenSearch, you can use these nightly runs to illustrate how to make visualizations from the Summary Report.


## Important metrics

To understand the results produced by the Benchmark test, we recommend looking at the following metrics in the Summary report:


## Result storage

Results from OpenSearch Benchmark are stored in two ways, either in-memory or in an external metric store. 

When stored in-memory, results can be found in the `/.benchmark/benchmarks/test_executions/<test_execution_id>` directory. Results are named based off of the `test_execution_id` given to the workload test during its last run. 

While [running a test](https://opensearch.org/docs/latest/benchmark/reference/commands/execute-test/#general-settings), you can also customize where the results are stored, using any combination of the following command flags:

* `--results-file`: When provided a file path, writes the compare results to the file indicated in the path.
* `--results-format`: Defines the output format for the command line results, either markdown or csv. Default is `markdown`.
* `--show-in-results`: Determines whether or not to include a comparison to previous runs in the results file. 
* `--user-tag`: Defines user-specific key-value pairs to be used in metric record as meta information, for example, `intention:baseline-ticket-12345`.

