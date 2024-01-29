---
layout: default
title: Running a workload
nav_order: 9
parent: User guide
---

# Running a workload

Once you understand all of the individual components of a OpenSearch Benchmark (OSB) [workload](add-link-to-understanding-workloads), its time to run your first workload. 

## Step 1: Find the workload name

To find the workload name, use the following command:

```
opensearch-benchmark list workloads 
```
{% include copy.html %}

A list of all workloads supported by OpenSearch Benchmark appears. Review the list and select the workload that's most similar to the [use case] of your cluster.

## Step 2: Running the test

After you've selected the workload, you can invoke the workload using the `opensearch-benchmark execute-test` command. Replace  `--target-host` with the `host:port` pairs for your cluster and `--client-options` with any authorization options required to access the cluster. The following example runs the `nyc_taxis` workload on a localhost for testing purposes. If you want to run a test on your own cluster, see [Running the workload on your own cluster](#running-a-workload-on-your-own-cluster).

```bash
opensearch-benchmark execute-test --pipeline=benchmark-only --workload=nyc_taxis --target-host=https://localhost:9200 --client-options=basic_auth_user:admin,basic_auth_password:admin,verify_certs:false
```
{% include copy.html %}


Results from the test appear in the directory set by `--output-path` option in `workloads.json`.

### Test mode

If you want run the test in test mode to make sure your workload operates as intended, add the `--test-mode` option to the `execute-test` command. Test mode ingests only the first 1000 documents from each index provided and runs query operations against them.

To use test mode, create a `<index>-documents-1k.json` file that contains the first 1000 documents from `<index>-documents.json` using the following command:

```
head -n 1000 <index>-documents.json > <index>-documents-1k.json
```
{% include copy.html %}

Then run the test with the `--test-mode` option.

## Step 3: Validate the test

After an OpenSearch Benchmark test runs, take the following steps to verify that it has run properly:

- Note the number of documents in the OpenSearch or OpenSearch Dashboards index that you plan to run the benchmark against.
- In the results returned by OpenSearch Benchmark, compare the `workload.json` file for your specific workload and verify that the document count matches the number of documents. For example, based on the [nyc_taxis](https://github.com/opensearch-project/opensearch-benchmark-workloads/blob/main/nyc_taxis/workload.json#L20) `workload.json` file, you should expect to see `165346692` documents in your cluster.

## Understanding the results

OpenSearch Benchmark returns the following response once the benchmark completes:

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
|                                                 Min Throughput |     percolator_with_content_president_bush |       36.09 |  ops/s |
|                                                Mean Throughput |     percolator_with_content_president_bush |       36.09 |  ops/s |
|                                              Median Throughput |     percolator_with_content_president_bush |       36.09 |  ops/s |
|                                                 Max Throughput |     percolator_with_content_president_bush |       36.09 |  ops/s |
|                                       100th percentile latency |     percolator_with_content_president_bush |     35.9822 |     ms |
|                                  100th percentile service time |     percolator_with_content_president_bush |     7.93048 |     ms |
|                                                     error rate |     percolator_with_content_president_bush |           0 |      % |

[...]

|                                                 Min Throughput |          percolator_with_content_ignore_me |        16.1 |  ops/s |
|                                                Mean Throughput |          percolator_with_content_ignore_me |        16.1 |  ops/s |
|                                              Median Throughput |          percolator_with_content_ignore_me |        16.1 |  ops/s |
|                                                 Max Throughput |          percolator_with_content_ignore_me |        16.1 |  ops/s |
|                                       100th percentile latency |          percolator_with_content_ignore_me |     131.798 |     ms |
|                                  100th percentile service time |          percolator_with_content_ignore_me |     69.5237 |     ms |
|                                                     error rate |          percolator_with_content_ignore_me |           0 |      % |
|                                                 Min Throughput | percolator_no_score_with_content_ignore_me |       29.37 |  ops/s |
|                                                Mean Throughput | percolator_no_score_with_content_ignore_me |       29.37 |  ops/s |
|                                              Median Throughput | percolator_no_score_with_content_ignore_me |       29.37 |  ops/s |
|                                                 Max Throughput | percolator_no_score_with_content_ignore_me |       29.37 |  ops/s |
|                                       100th percentile latency | percolator_no_score_with_content_ignore_me |     45.5703 |     ms |
|                                  100th percentile service time | percolator_no_score_with_content_ignore_me |      11.316 |     ms |
|                                                     error rate | percolator_no_score_with_content_ignore_me |           0 |      % |



--------------------------------
[INFO] SUCCESS (took 18 seconds)
--------------------------------
```



## Running a workload on your own cluster

Now that you're familiar with running OpenSearch Benchmark on a cluster, you can run OpenSearch Benchmark on your own cluster, using the same `execute-test` command, replacing the following settings.
 
  * Replace `https://localhost:9200` with your target cluster endpoint.  This could be a URI like `https://search.mydomain.com` or a `HOST:PORT` specification.
  * If the cluster is configured with basic authentication, replace the username and password in the command line with the appropriate credentials.
  * Remove the `verify_certs:false` directive if you are not specifying `localhost` as your target cluster.  This directive is needed only for clusters where SSL certificates are not set up.
  * If you are using a `HOST:PORT`specification and plan to use SSL/TLS, either specify `https://`, or add the `use_ssl:true` directive to the `--client-options` string option.
  * Remove the `--test-mode` flag to run the full workload, rather than an abbreviated test.

You can copy the following command template to use in your own terminal:

```bash
opensearch-benchmark execute-test --pipeline=benchmark-only --workload=nyc_taxis --target-host=<OpenSearch Cluster Endpoint> --client-options=basic_auth_user:admin,basic_auth_password:admin
```
{% include copy.html %}