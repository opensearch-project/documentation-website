---
layout: default
title: Summary reports
nav_order: 22
grand_parent: User guide
parent: Understanding results
redirect_from: 
  - /benchmark/user-guide/understanding-results/
---

# Understanding the summary report

At the end of each test run, OpenSearch Benchmark creates a summary of test result metrics like service time, throughput, latency, and more. These metrics provide insights into how the selected workload performed on a benchmarked OpenSearch cluster.

The following guide provides information about how to understand the results of the summary report.

## OpenSearch Benchmark runs

OpenSearch Benchmark runs a series of nightly tests targeting the OpenSearch development cluster. The results of these test runs can be found at https://opensearch.org/benchmarks. The results display metrics spanning different test runs and target both recent and future versions of OpenSearch.

## Summary report metrics

While an OpenSearch Benchmark summary report provides metrics related to the performance of your cluster, how you compare and use those metrics depends on your use case. For example, some users might be interested in the number of documents the workload can index, while another might be interested in the amount of latency or service time needed for a document to be queried. The following example summary report shows metrics for a typical workload run:

```bash
------------------------------------------------------
    _______             __   _____
   / ____(_)___  ____ _/ /  / ___/_________  ________
  / /_  / / __ \/ __ `/ /   \__ \/ ___/ __ \/ ___/ _ \
 / __/ / / / / / /_/ / /   ___/ / /__/ /_/ / /  /  __/
/_/   /_/_/ /_/\__,_/_/   /____/\___/\____/_/   \___/
------------------------------------------------------

|                                                         Metric |                                       Task |       Value |   Unit |
|---------------------------------------------------------------:|-------------------------------------------:|------------:|-------:|
|                     Cumulative indexing time of primary shards |                                            |     0.02655 |    min |
|             Min cumulative indexing time across primary shards |                                            |           0 |    min |
|          Median cumulative indexing time across primary shards |                                            |  0.00176667 |    min |
|             Max cumulative indexing time across primary shards |                                            |   0.0140333 |    min |
|            Cumulative indexing throttle time of primary shards |                                            |           0 |    min |
|    Min cumulative indexing throttle time across primary shards |                                            |           0 |    min |
| Median cumulative indexing throttle time across primary shards |                                            |           0 |    min |
|    Max cumulative indexing throttle time across primary shards |                                            |           0 |    min |
|                        Cumulative merge time of primary shards |                                            |   0.0102333 |    min |
|                       Cumulative merge count of primary shards |                                            |           3 |        |
|                Min cumulative merge time across primary shards |                                            |           0 |    min |
|             Median cumulative merge time across primary shards |                                            |           0 |    min |
|                Max cumulative merge time across primary shards |                                            |   0.0102333 |    min |
|               Cumulative merge throttle time of primary shards |                                            |           0 |    min |
|       Min cumulative merge throttle time across primary shards |                                            |           0 |    min |
|    Median cumulative merge throttle time across primary shards |                                            |           0 |    min |
|       Max cumulative merge throttle time across primary shards |                                            |           0 |    min |
|                      Cumulative refresh time of primary shards |                                            |   0.0709333 |    min |
|                     Cumulative refresh count of primary shards |                                            |         118 |        |
|              Min cumulative refresh time across primary shards |                                            |           0 |    min |
|           Median cumulative refresh time across primary shards |                                            |  0.00186667 |    min |
|              Max cumulative refresh time across primary shards |                                            |   0.0511667 |    min |
|                        Cumulative flush time of primary shards |                                            |  0.00963333 |    min |
|                       Cumulative flush count of primary shards |                                            |           4 |        |
|                Min cumulative flush time across primary shards |                                            |           0 |    min |
|             Median cumulative flush time across primary shards |                                            |           0 |    min |
|                Max cumulative flush time across primary shards |                                            |  0.00398333 |    min |
|                                        Total Young Gen GC time |                                            |           0 |      s |
|                                       Total Young Gen GC count |                                            |           0 |        |
|                                          Total Old Gen GC time |                                            |           0 |      s |
|                                         Total Old Gen GC count |                                            |           0 |        |
|                                                     Store size |                                            | 0.000485923 |     GB |
|                                                  Translog size |                                            | 2.01873e-05 |     GB |
|                                         Heap used for segments |                                            |           0 |     MB |
|                                       Heap used for doc values |                                            |           0 |     MB |
|                                            Heap used for terms |                                            |           0 |     MB |
|                                            Heap used for norms |                                            |           0 |     MB |
|                                           Heap used for points |                                            |           0 |     MB |
|                                    Heap used for stored fields |                                            |           0 |     MB |
|                                                  Segment count |                                            |          32 |        |
|                                                 Min Throughput |                                      index |     3008.97 | docs/s |
|                                                Mean Throughput |                                      index |     3008.97 | docs/s |
|                                              Median Throughput |                                      index |     3008.97 | docs/s |
|                                                 Max Throughput |                                      index |     3008.97 | docs/s |
|                                        50th percentile latency |                                      index |     351.059 |     ms |
|                                       100th percentile latency |                                      index |     365.058 |     ms |
|                                   50th percentile service time |                                      index |     351.059 |     ms |
|                                  100th percentile service time |                                      index |     365.058 |     ms |
|                                                     error rate |                                      index |           0 |      % |
|                                                 Min Throughput |                   wait-until-merges-finish |       28.41 |  ops/s |
|                                                Mean Throughput |                   wait-until-merges-finish |       28.41 |  ops/s |
|                                              Median Throughput |                   wait-until-merges-finish |       28.41 |  ops/s |
|                                                 Max Throughput |                   wait-until-merges-finish |       28.41 |  ops/s |
|                                       100th percentile latency |                   wait-until-merges-finish |     34.7088 |     ms |
|                                  100th percentile service time |                   wait-until-merges-finish |     34.7088 |     ms |
|                                                     error rate |                   wait-until-merges-finish |           0 |      % |
|                                                 Min Throughput |                                  match_all |       36.09 |  ops/s |
|                                                Mean Throughput |                                  match_all |       36.09 |  ops/s |
|                                              Median Throughput |                                  match_all |       36.09 |  ops/s |
|                                                 Max Throughput |                                  match_all |       36.09 |  ops/s |
|                                       100th percentile latency |                                  match_all |     35.9822 |     ms |
|                                  100th percentile service time |                                  match_all |     7.93048 |     ms |
|                                                     error rate |                                  match_all |           0 |      % |

[...]

|                                                 Min Throughput |                                       term |        16.1 |  ops/s |
|                                                Mean Throughput |                                       term |        16.1 |  ops/s |
|                                              Median Throughput |                                       term |        16.1 |  ops/s |
|                                                 Max Throughput |                                       term |        16.1 |  ops/s |
|                                       100th percentile latency |                                       term |     131.798 |     ms |
|                                  100th percentile service time |                                       term |     69.5237 |     ms |
|                                                     error rate |                                       term |           0 |      % |
```

Metrics that are unique to the cluster begin at the `index` task line. The following are examples of metrics that might be relevant to you:

- To assess how much load your cluster can handle, the `index` task metrics provide the number of documents ingested during the workload run as well as the ingestion error rate. 
- To assess the measurable latency and service time of the queries in the workload, the `match_all` and `term` tasks provide the number of query operations performed per second, the measurable query latency, and the query operation error rate.


## Storing results

OpenSearch Benchmark results are stored in-memory or in external storage. 

When stored in-memory, results can be found in the `/.benchmark/benchmarks/test_executions/<test_execution_id>` directory. Results are named in accordance with the `test_execution_id` of the most recent workload test. 

While [running a test]({{site.url}}{{site.baseurl}}/benchmark/reference/commands/execute-test/#general-settings), you can customize where the results are stored using any combination of the following command flags:

* `--results-file`: When provided a file path, writes the summary report to the file indicated in the path.
* `--results-format`: Defines the output format for the summary report results, either `markdown` or `csv`. Default is `markdown`.
* `--show-in-results`: Defines which values are shown in the published summary report, either `available`, `all-percentiles`, or `all`. Default is `available`.
* `--user-tag`: Defines user-specific key-value pairs used in the metrics record as meta information, for example, `intention:baseline-ticket-12345`. This is useful when storing metrics and results in external storage.

