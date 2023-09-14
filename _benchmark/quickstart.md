---
layout: default
title: Quickstart
nav_order: 2
---

# OpenSearch Benchmark quickstart

This tutorial outlines how to quickly install OpenSearch Benchmark (OSB) and run your first OpenSearch Benchmark workload. 

## Prerequisites

To perform the Quickstart steps, you'll need to fulfill the following prerequisites:

- A currently active OpenSearch cluster. For instructions on how to create an OpenSearch cluster, see [Creating a cluster]({{site.url}}{{site.baseurl}}//tuning-your-cluster/index/).
- Git 2.3 or greater.

Additional prerequisites are required depending on your installation method.

- If you plan to install OpenSearch Benchmark with [PyPi](https://pypi.org/), install Python 3.8 or greater.
- If you plan to install OpenSearch Benchmark using Docker, install Docker. 

## Installing OpenSearch Benchmark

You can install OpenSearch Benchmark either using PyPi or Docker. 

If you plan to run OpenSearch Benchmark with a cluster using Sigv4, see [Sigv4 support]({{site.url}}{{site.baseurl}}/benchmark/tutorials/sigv4)

### PyPi

To install OpenSearch Benchmark with PyPi, enter the following `pip` command:

```bash
pip3 install opensearch-benchmark
```
{% include copy.html %}

After the installation completes, verify that OSB is running by entering the following command:

```bash
opensearch-benchmark --help
```
{% include copy.html %}

If successful, OpenSearch returns the following response:

```bash
$ opensearch-benchmark % opensearch-benchmark --help
usage: opensearch-benchmark [-h] [--version] {execute-test,list,info,create-workload,generate,compare,download,install,start,stop} ...

   ____                  _____                      __       ____                  __                         __
  / __ \____  ___  ____ / ___/___  ____ ___________/ /_     / __ )___  ____  _____/ /_  ____ ___  ____ ______/ /__
 / / / / __ \/ _ \/ __ \\__ \/ _ \/ __ `/ ___/ ___/ __ \   / __  / _ \/ __ \/ ___/ __ \/ __ `__ \/ __ `/ ___/ //_/
/ /_/ / /_/ /  __/ / / /__/ /  __/ /_/ / /  / /__/ / / /  / /_/ /  __/ / / / /__/ / / / / / / / / /_/ / /  / ,<
\____/ .___/\___/_/ /_/____/\___/\__,_/_/   \___/_/ /_/  /_____/\___/_/ /_/\___/_/ /_/_/ /_/ /_/\__,_/_/  /_/|_|
    /_/

 A benchmarking tool for OpenSearch

optional arguments:
  -h, --help            show this help message and exit
  --version             show program's version number and exit

subcommands:
  {execute-test,list,info,create-workload,generate,compare,download,install,start,stop}
    execute-test        Run a benchmark
    list                List configuration options
    info                Show info about a workload
    create-workload     Create a Benchmark workload from existing data
    generate            Generate artifacts
    compare             Compare two test_executions
    download            Downloads an artifact
    install             Installs an OpenSearch node locally
    start               Starts an OpenSearch node locally
    stop                Stops an OpenSearch node locally

Find out more about Benchmark at https://opensearch.org/docs
```

### Docker

To pull the image from Docker Hub, run the following command:

```bash
docker pull opensearchproject/opensearch-benchmark:latest
```
{% include copy.html %}

Then, run the Docker image:

```bash
docker run opensearchproject/opensearch-benchmark -h
```
{% include copy.html %}


## Running your first Benchmark

You can now run your first benchmark. For your first benchmark, you'll use the [geonames](https://github.com/opensearch-project/opensearch-benchmark-workloads/tree/main/geonames) workload.


### Understanding workload command flags

Benchmarks are run using the [`execute-test`]({{site.url}}{{site.baseurl}}/benchmark/commands/execute-test/) with the following command flags:

For additional `execute_test` command flags, see the [execute-test]({{site.url}}{{site.baseurl}}/benchmark/commands/execute-test/) reference. Some commonly used options are `--workload-params`, `--exclude-tasks`, and `--include-tasks`
{: .tip}

* `--pipeline=benchmark-only` : Informs OSB that you wants to provide their own OpenSearch cluster.
- `workload=geoname`: The name of workload the benchmark uses.
* `--target-host="<OpenSearch Cluster Endpoint>"`: Indicates the target cluster or host that OSB will benchmark. Enter the endpoint to your OpenSearch cluster here.
* `--client-options="basic_auth_user:'<Basic Auth Username>',basic_auth_password:'<Basic Auth Password>'"`: The username and password for your OpenSearch cluster.
* `--test-mode`: Indicates that this Benchmark is a test. Test mode only runs the first thousand operations of each task indicated in the workload. 

The `--distribution-version`, which indicates what version of OpenSearch OSB will user when provisioning a cluster, is not required. When run, the `execute-test` command will parse the correct distribution version when it connects to the OpenSearch cluster.

### Running the workload

If you installed OSB with PyPi, customize and use the following command:

```bash
opensearch-benchmark execute-test --pipeline=benchmark-only --workload=geonames --target-host="<OpenSearch Cluster Endpoint>" --client-options="basic_auth_user:'<Basic Auth Username>',basic_auth_password:'<Basic Auth Password>'" --test-mode
```
{% include copy.html %}

If you installed OSB with Docker, customize and use the following command:

```bash
docker run opensearchproject/opensearch-benchmark execute-test --pipeline=benchmark-only --workload=geonames --target-host="<OpenSearch Cluster Endpoint>" --client-options="basic_auth_user:'<Basic Auth Username>',basic_auth_password:'<Basic Auth Password>'" --test-mode
```
{% include copy.html %}

When the `execute_test` command runs, all tasks and operations inside the `geonames` workload run sequentially.



### Understanding the results

OSB returns the following response once the Benchmark completes:

```bash
-----------------------------------------------------
    _______             __   _____
   / ____(_)___  ____ _/ /  / ___/_________  ________
  / /_  / / __ \/ __ `/ /   \__ \/ ___/ __ \/ ___/ _ \
 / __/ / / / / / /_/ / /   ___/ / /__/ /_/ / /  /  __/
/_/   /_/_/ /_/\__,_/_/   /____/\___/\____/_/   \___/
------------------------------------------------------

|                                                         Metric |                           Task |       Value |    Unit |
|---------------------------------------------------------------:|-------------------------------:|------------:|--------:|
|                     Cumulative indexing time of primary shards |                                |   0.0359333 |     min |
|             Min cumulative indexing time across primary shards |                                |  0.00453333 |     min |
|          Median cumulative indexing time across primary shards |                                |  0.00726667 |     min |
|             Max cumulative indexing time across primary shards |                                |  0.00878333 |     min |
|            Cumulative indexing throttle time of primary shards |                                |           0 |     min |
|    Min cumulative indexing throttle time across primary shards |                                |           0 |     min |
| Median cumulative indexing throttle time across primary shards |                                |           0 |     min |
|    Max cumulative indexing throttle time across primary shards |                                |           0 |     min |
|                        Cumulative merge time of primary shards |                                |           0 |     min |
|                       Cumulative merge count of primary shards |                                |           0 |         |
|                Min cumulative merge time across primary shards |                                |           0 |     min |
|             Median cumulative merge time across primary shards |                                |           0 |     min |
|                Max cumulative merge time across primary shards |                                |           0 |     min |
|               Cumulative merge throttle time of primary shards |                                |           0 |     min |
|       Min cumulative merge throttle time across primary shards |                                |           0 |     min |
|    Median cumulative merge throttle time across primary shards |                                |           0 |     min |
|       Max cumulative merge throttle time across primary shards |                                |           0 |     min |
|                      Cumulative refresh time of primary shards |                                |  0.00728333 |     min |
|                     Cumulative refresh count of primary shards |                                |          35 |         |
|              Min cumulative refresh time across primary shards |                                | 0.000966667 |     min |
|           Median cumulative refresh time across primary shards |                                |  0.00136667 |     min |
|              Max cumulative refresh time across primary shards |                                |  0.00236667 |     min |
|                        Cumulative flush time of primary shards |                                |           0 |     min |
|                       Cumulative flush count of primary shards |                                |           0 |         |
|                Min cumulative flush time across primary shards |                                |           0 |     min |
|             Median cumulative flush time across primary shards |                                |           0 |     min |
|                Max cumulative flush time across primary shards |                                |           0 |     min |
|                                        Total Young Gen GC time |                                |        0.01 |       s |
|                                       Total Young Gen GC count |                                |           1 |         |
|                                          Total Old Gen GC time |                                |           0 |       s |
|                                         Total Old Gen GC count |                                |           0 |         |
|                                                     Store size |                                |  0.00046468 |      GB |
|                                                  Translog size |                                | 2.56114e-07 |      GB |
|                                         Heap used for segments |                                |    0.113216 |      MB |
|                                       Heap used for doc values |                                |   0.0171394 |      MB |
|                                            Heap used for terms |                                |   0.0777283 |      MB |
|                                            Heap used for norms |                                |    0.010437 |      MB |
|                                           Heap used for points |                                |           0 |      MB |
|                                    Heap used for stored fields |                                |  0.00791168 |      MB |
|                                                  Segment count |                                |          17 |         |
|                                                 Min Throughput |                   index-append |      1879.5 |  docs/s |
|                                                Mean Throughput |                   index-append |      1879.5 |  docs/s |
|                                              Median Throughput |                   index-append |      1879.5 |  docs/s |
|                                                 Max Throughput |                   index-append |      1879.5 |  docs/s |
|                                        50th percentile latency |                   index-append |     505.028 |      ms |
|                                       100th percentile latency |                   index-append |     597.718 |      ms |
|                                   50th percentile service time |                   index-append |     505.028 |      ms |
|                                  100th percentile service time |                   index-append |     597.718 |      ms |
|                                                     error rate |                   index-append |           0 |       % |
|                                                 Min Throughput |       wait-until-merges-finish |       43.82 |   ops/s |
|                                                Mean Throughput |       wait-until-merges-finish |       43.82 |   ops/s |
|                                              Median Throughput |       wait-until-merges-finish |       43.82 |   ops/s |
|                                                 Max Throughput |       wait-until-merges-finish |       43.82 |   ops/s |
|                                       100th percentile latency |       wait-until-merges-finish |     22.2577 |      ms |
|                                  100th percentile service time |       wait-until-merges-finish |     22.2577 |      ms |
|                                                     error rate |       wait-until-merges-finish |           0 |       % |
|                                                 Min Throughput |                    index-stats |       58.04 |   ops/s |
|                                                Mean Throughput |                    index-stats |       58.04 |   ops/s |
|                                              Median Throughput |                    index-stats |       58.04 |   ops/s |
|                                                 Max Throughput |                    index-stats |       58.04 |   ops/s |
|                                       100th percentile latency |                    index-stats |      24.891 |      ms |
|                                  100th percentile service time |                    index-stats |     7.02568 |      ms |
|                                                     error rate |                    index-stats |           0 |       % |
|                                                 Min Throughput |                     node-stats |       51.21 |   ops/s |
|                                                Mean Throughput |                     node-stats |       51.21 |   ops/s |
|                                              Median Throughput |                     node-stats |       51.21 |   ops/s |
|                                                 Max Throughput |                     node-stats |       51.21 |   ops/s |
|                                       100th percentile latency |                     node-stats |     26.4279 |      ms |
|                                  100th percentile service time |                     node-stats |     6.38569 |      ms |
|                                                     error rate |                     node-stats |           0 |       % |
|                                                 Min Throughput |                        default |       14.03 |   ops/s |
|                                                Mean Throughput |                        default |       14.03 |   ops/s |
|                                              Median Throughput |                        default |       14.03 |   ops/s |
|                                                 Max Throughput |                        default |       14.03 |   ops/s |
|                                       100th percentile latency |                        default |     78.9157 |      ms |
|                                  100th percentile service time |                        default |     7.30501 |      ms |
|                                                     error rate |                        default |           0 |       % |
|                                                 Min Throughput |                           term |       59.96 |   ops/s |
|                                                Mean Throughput |                           term |       59.96 |   ops/s |
|                                              Median Throughput |                           term |       59.96 |   ops/s |
|                                                 Max Throughput |                           term |       59.96 |   ops/s |
|                                       100th percentile latency |                           term |     22.4626 |      ms |
|                                  100th percentile service time |                           term |     5.38508 |      ms |
|                                                     error rate |                           term |           0 |       % |
|                                                 Min Throughput |                         phrase |       44.66 |   ops/s |
|                                                Mean Throughput |                         phrase |       44.66 |   ops/s |
|                                              Median Throughput |                         phrase |       44.66 |   ops/s |
|                                                 Max Throughput |                         phrase |       44.66 |   ops/s |
|                                       100th percentile latency |                         phrase |     27.4984 |      ms |
|                                  100th percentile service time |                         phrase |     4.81552 |      ms |
|                                                     error rate |                         phrase |           0 |       % |
|                                                 Min Throughput |           country_agg_uncached |       16.16 |   ops/s |
|                                                Mean Throughput |           country_agg_uncached |       16.16 |   ops/s |
|                                              Median Throughput |           country_agg_uncached |       16.16 |   ops/s |
|                                                 Max Throughput |           country_agg_uncached |       16.16 |   ops/s |
|                                       100th percentile latency |           country_agg_uncached |     67.5527 |      ms |
|                                  100th percentile service time |           country_agg_uncached |     5.40069 |      ms |
|                                                     error rate |           country_agg_uncached |           0 |       % |
|                                                 Min Throughput |             country_agg_cached |       49.31 |   ops/s |
|                                                Mean Throughput |             country_agg_cached |       49.31 |   ops/s |
|                                              Median Throughput |             country_agg_cached |       49.31 |   ops/s |
|                                                 Max Throughput |             country_agg_cached |       49.31 |   ops/s |
|                                       100th percentile latency |             country_agg_cached |     38.2485 |      ms |
|                                  100th percentile service time |             country_agg_cached |     17.6579 |      ms |
|                                                     error rate |             country_agg_cached |           0 |       % |
|                                                 Min Throughput |                         scroll |       29.76 | pages/s |
|                                                Mean Throughput |                         scroll |       29.76 | pages/s |
|                                              Median Throughput |                         scroll |       29.76 | pages/s |
|                                                 Max Throughput |                         scroll |       29.76 | pages/s |
|                                       100th percentile latency |                         scroll |     93.1197 |      ms |
|                                  100th percentile service time |                         scroll |     25.3068 |      ms |
|                                                     error rate |                         scroll |           0 |       % |
|                                                 Min Throughput |                     expression |        8.32 |   ops/s |
|                                                Mean Throughput |                     expression |        8.32 |   ops/s |
|                                              Median Throughput |                     expression |        8.32 |   ops/s |
|                                                 Max Throughput |                     expression |        8.32 |   ops/s |
|                                       100th percentile latency |                     expression |     127.701 |      ms |
|                                  100th percentile service time |                     expression |     7.30691 |      ms |
|                                                     error rate |                     expression |           0 |       % |
|                                                 Min Throughput |                painless_static |         6.2 |   ops/s |
|                                                Mean Throughput |                painless_static |         6.2 |   ops/s |
|                                              Median Throughput |                painless_static |         6.2 |   ops/s |
|                                                 Max Throughput |                painless_static |         6.2 |   ops/s |
|                                       100th percentile latency |                painless_static |     167.239 |      ms |
|                                  100th percentile service time |                painless_static |     5.76951 |      ms |
|                                                     error rate |                painless_static |           0 |       % |
|                                                 Min Throughput |               painless_dynamic |       19.56 |   ops/s |
|                                                Mean Throughput |               painless_dynamic |       19.56 |   ops/s |
|                                              Median Throughput |               painless_dynamic |       19.56 |   ops/s |
|                                                 Max Throughput |               painless_dynamic |       19.56 |   ops/s |
|                                       100th percentile latency |               painless_dynamic |     56.9046 |      ms |
|                                  100th percentile service time |               painless_dynamic |     5.50498 |      ms |
|                                                     error rate |               painless_dynamic |           0 |       % |
|                                                 Min Throughput | decay_geo_gauss_function_score |       50.28 |   ops/s |
|                                                Mean Throughput | decay_geo_gauss_function_score |       50.28 |   ops/s |
|                                              Median Throughput | decay_geo_gauss_function_score |       50.28 |   ops/s |
|                                                 Max Throughput | decay_geo_gauss_function_score |       50.28 |   ops/s |
|                                       100th percentile latency | decay_geo_gauss_function_score |     25.9491 |      ms |
|                                  100th percentile service time | decay_geo_gauss_function_score |      5.7773 |      ms |
|                                                     error rate | decay_geo_gauss_function_score |           0 |       % |
|                                                 Min Throughput |   decay_geo_gauss_script_score |       28.96 |   ops/s |
|                                                Mean Throughput |   decay_geo_gauss_script_score |       28.96 |   ops/s |
|                                              Median Throughput |   decay_geo_gauss_script_score |       28.96 |   ops/s |
|                                                 Max Throughput |   decay_geo_gauss_script_score |       28.96 |   ops/s |
|                                       100th percentile latency |   decay_geo_gauss_script_score |      41.179 |      ms |
|                                  100th percentile service time |   decay_geo_gauss_script_score |     6.20007 |      ms |
|                                                     error rate |   decay_geo_gauss_script_score |           0 |       % |
|                                                 Min Throughput |     field_value_function_score |       52.97 |   ops/s |
|                                                Mean Throughput |     field_value_function_score |       52.97 |   ops/s |
|                                              Median Throughput |     field_value_function_score |       52.97 |   ops/s |
|                                                 Max Throughput |     field_value_function_score |       52.97 |   ops/s |
|                                       100th percentile latency |     field_value_function_score |     25.9004 |      ms |
|                                  100th percentile service time |     field_value_function_score |     6.68765 |      ms |
|                                                     error rate |     field_value_function_score |           0 |       % |
|                                                 Min Throughput |       field_value_script_score |       35.24 |   ops/s |
|                                                Mean Throughput |       field_value_script_score |       35.24 |   ops/s |
|                                              Median Throughput |       field_value_script_score |       35.24 |   ops/s |
|                                                 Max Throughput |       field_value_script_score |       35.24 |   ops/s |
|                                       100th percentile latency |       field_value_script_score |     34.2866 |      ms |
|                                  100th percentile service time |       field_value_script_score |     5.63202 |      ms |
|                                                     error rate |       field_value_script_score |           0 |       % |
|                                                 Min Throughput |                    large_terms |        1.05 |   ops/s |
|                                                Mean Throughput |                    large_terms |        1.05 |   ops/s |
|                                              Median Throughput |                    large_terms |        1.05 |   ops/s |
|                                                 Max Throughput |                    large_terms |        1.05 |   ops/s |
|                                       100th percentile latency |                    large_terms |     1220.12 |      ms |
|                                  100th percentile service time |                    large_terms |     256.856 |      ms |
|                                                     error rate |                    large_terms |           0 |       % |
|                                                 Min Throughput |           large_filtered_terms |        4.11 |   ops/s |
|                                                Mean Throughput |           large_filtered_terms |        4.11 |   ops/s |
|                                              Median Throughput |           large_filtered_terms |        4.11 |   ops/s |
|                                                 Max Throughput |           large_filtered_terms |        4.11 |   ops/s |
|                                       100th percentile latency |           large_filtered_terms |     389.415 |      ms |
|                                  100th percentile service time |           large_filtered_terms |     137.216 |      ms |
|                                                     error rate |           large_filtered_terms |           0 |       % |
|                                                 Min Throughput |         large_prohibited_terms |        5.68 |   ops/s |
|                                                Mean Throughput |         large_prohibited_terms |        5.68 |   ops/s |
|                                              Median Throughput |         large_prohibited_terms |        5.68 |   ops/s |
|                                                 Max Throughput |         large_prohibited_terms |        5.68 |   ops/s |
|                                       100th percentile latency |         large_prohibited_terms |     352.926 |      ms |
|                                  100th percentile service time |         large_prohibited_terms |     169.633 |      ms |
|                                                     error rate |         large_prohibited_terms |           0 |       % |
|                                                 Min Throughput |           desc_sort_population |       42.48 |   ops/s |
|                                                Mean Throughput |           desc_sort_population |       42.48 |   ops/s |
|                                              Median Throughput |           desc_sort_population |       42.48 |   ops/s |
|                                                 Max Throughput |           desc_sort_population |       42.48 |   ops/s |
|                                       100th percentile latency |           desc_sort_population |     28.6485 |      ms |
|                                  100th percentile service time |           desc_sort_population |     4.82649 |      ms |
|                                                     error rate |           desc_sort_population |           0 |       % |
|                                                 Min Throughput |            :_sort_population |       49.06 |   ops/s |
|                                                Mean Throughput |            asc_sort_population |       49.06 |   ops/s |
|                                              Median Throughput |            asc_sort_population |       49.06 |   ops/s |
|                                                 Max Throughput |            asc_sort_population |       49.06 |   ops/s |
|                                       100th percentile latency |            asc_sort_population |     30.7929 |      ms |
|                                  100th percentile service time |            asc_sort_population |     10.0023 |      ms |
|                                                     error rate |            asc_sort_population |           0 |       % |
|                                                 Min Throughput | asc_sort_with_after_population |        55.9 |   ops/s |
|                                                Mean Throughput | asc_sort_with_after_population |        55.9 |   ops/s |
|                                              Median Throughput | asc_sort_with_after_population |        55.9 |   ops/s |
|                                                 Max Throughput | asc_sort_with_after_population |        55.9 |   ops/s |
|                                       100th percentile latency | asc_sort_with_after_population |      25.413 |      ms |
|                                  100th percentile service time | asc_sort_with_after_population |     7.00911 |      ms |
|                                                     error rate | asc_sort_with_after_population |           0 |       % |
|                                                 Min Throughput |            desc_sort_geonameid |       63.86 |   ops/s |
|                                                Mean Throughput |            desc_sort_geonameid |       63.86 |   ops/s |
|                                              Median Throughput |            desc_sort_geonameid |       63.86 |   ops/s |
|                                                 Max Throughput |            desc_sort_geonameid |       63.86 |   ops/s |
|                                       100th percentile latency |            desc_sort_geonameid |     21.3566 |      ms |
|                                  100th percentile service time |            desc_sort_geonameid |     5.41555 |      ms |
|                                                     error rate |            desc_sort_geonameid |           0 |       % |
|                                                 Min Throughput | desc_sort_with_after_geonameid |       58.36 |   ops/s |
|                                                Mean Throughput | desc_sort_with_after_geonameid |       58.36 |   ops/s |
|                                              Median Throughput | desc_sort_with_after_geonameid |       58.36 |   ops/s |
|                                                 Max Throughput | desc_sort_with_after_geonameid |       58.36 |   ops/s |
|                                       100th percentile latency | desc_sort_with_after_geonameid |     24.3476 |      ms |
|                                  100th percentile service time | desc_sort_with_after_geonameid |     6.81395 |      ms |
|                                                     error rate | desc_sort_with_after_geonameid |           0 |       % |
|                                                 Min Throughput |             asc_sort_geonameid |       69.44 |   ops/s |
|                                                Mean Throughput |             asc_sort_geonameid |       69.44 |   ops/s |
|                                              Median Throughput |             asc_sort_geonameid |       69.44 |   ops/s |
|                                                 Max Throughput |             asc_sort_geonameid |       69.44 |   ops/s |
|                                       100th percentile latency |             asc_sort_geonameid |     19.4046 |      ms |
|                                  100th percentile service time |             asc_sort_geonameid |     4.72967 |      ms |
|                                                     error rate |             asc_sort_geonameid |           0 |       % |
|                                                 Min Throughput |  asc_sort_with_after_geonameid |       70.35 |   ops/s |
|                                                Mean Throughput |  asc_sort_with_after_geonameid |       70.35 |   ops/s |
|                                              Median Throughput |  asc_sort_with_after_geonameid |       70.35 |   ops/s |
|                                                 Max Throughput |  asc_sort_with_after_geonameid |       70.35 |   ops/s |
|                                       100th percentile latency |  asc_sort_with_after_geonameid |      18.664 |      ms |
|                                  100th percentile service time |  asc_sort_with_after_geonameid |     4.16119 |      ms |
|                                                     error rate |  asc_sort_with_after_geonameid |           0 |       % |


--------------------------------
[INFO] SUCCESS (took 98 seconds)
--------------------------------
```

Each task ran by the `geonames` workload represents a specific OpenSearch API operation, such as Bulk or Search, that was performed when the test was ran. Each task in the output summary contains the the following information: 

* **Throughput:** The number of successful OpenSearch operations per second. 
* **Latency:** The time, including wait time, it took for the request and the response to be sent out and received by OSB
* **Service Time:** The time, excluding wait time, it took for the request and the response to be sent out and received by OSB
* **Error Rate:** Percent of operations run during the task that were not successful or (200s)

### Provisioning an OpenSearch cluster with a test

OSB is compatiable with JDK versions 17, 16, 15, 14, 13, 12, 11, and 8
{: .note}

If you installed OpenSearch with PyPi, you can also provision a new OpenSearch cluster by specifying a `distribution-version` in the `execute-test` command.

If you plan on having OSB provision a cluster, you'll need to inform OSB where the `JAVA_HOME` path for the OSB cluster will be. To set the `JAVA_HOME` path and provision a cluster:

1. Find the `JAVA_HOME` path you're currently using. Open a terminal and enter `/usr/libexec/java_home`.

2. Set your corresponding JDK version environment variable by entering the path from the previous step. Enter `export JAVA17_HOME=<Java Path>`.

3. Run the `execute-test` command and indicate the distribution version of OpenSearch you want to use. 

  ```bash
  opensearch-benchmark execute-test --distribution-version=2.3.0 --workload=geonames --test-mode 
  ```

## Next steps

To learn more about OpenSearch Benchmark:

- [User guide]({{site.url}}{{site.baseurl}}/benchmark/user-guide/index/): Dive deep into how OpenSearch Benchmark can you help you track the performance of your cluster.
- [Tutorials]({{site.url}}{{site.baseurl}}/benchmark/tutorials/index/): Use step-by-step guides for more advanced Benchmarking configurations and functionality.