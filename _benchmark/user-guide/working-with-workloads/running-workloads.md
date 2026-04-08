---
layout: default
title: Running a workload
nav_order: 9
grand_parent: User guide
parent: Working with workloads
redirect_from:
  - /benchmark/user-guide/running-workloads/
canonical_url: https://docs.opensearch.org/latest/benchmark/user-guide/working-with-workloads/running-workloads/
---

# Running a workload

Once you have a complete understanding of the various components of an OpenSearch Benchmark [workload]({{site.url}}{{site.baseurl}}/benchmark/user-guide/understanding-workloads/anatomy-of-a-workload/), you can run your first workload.

## Step 1: Find the workload name

To learn more about the standard workloads included with OpenSearch Benchmark, use the following command:

```
opensearch-benchmark list workloads
```
{% include copy.html %}

A list of all workloads supported by OpenSearch Benchmark appears. Review the list and select the workload that's most similar to your cluster's use case.

## Step 2: Running the test

After you've selected the workload, you can invoke the workload using the `opensearch-benchmark run` command. Replace  `--target-host` with the `host:port` pairs for your cluster and `--client-options` with any authorization options required to access the cluster. The following example runs the `nyc_taxis` workload on a localhost for testing purposes.

If you want to run a test on an external cluster, see [Running the workload on your own cluster](#running-a-workload-on-an-external-cluster).

```bash
opensearch-benchmark run --pipeline=benchmark-only --workload=nyc_taxis --target-host=https://localhost:9200 --client-options=basic_auth_user:admin,basic_auth_password:admin,verify_certs:false
```
{% include copy.html %}


Results from the test appear in the directory set by the `--output-path` option in the `run` command.

### Test mode

If you want to run the test in test mode to make sure that your workload operates as intended, add the `--test-mode` option to the `run` command. Test mode ingests only the first 1,000 documents from each index provided and runs query operations against them.

### Working with `--workload-params`

You can customize the behavior of a workload by passing workload-specific parameters using the `--workload-params` option. This flag accepts a comma-separated list of key-value pairs that override default values defined in the workload's `workload.json` file.

For example, some workloads let you configure the number of documents indexed, the number of clients used for query execution, or the index name. These parameters can be critical for tailoring benchmarks to your specific use case or infrastructure constraints.

To pass workload parameters, use the following syntax:

```bash
--workload-params="number_of_documents:100000,index_name:custom-index"
```

Add this option to your `run` command, as shown in the following example:

```bash
opensearch-benchmark run \
--pipeline=benchmark-only \
--workload=nyc_taxis \
--target-host=https://localhost:9200 \
--client-options=basic_auth_user:admin,basic_auth_password:admin,verify_certs:false \
--workload-params="bulk_size:500,index_name:nyc_custom"
```

Available workload parameters can be found in the `README` of each workload in the [OpenSearch Benchmark Workloads GitHub repository](https://github.com/opensearch-project/opensearch-benchmark-workloads).
{: .tip}




## Step 3: Validate the test

After running an OpenSearch Benchmark test, take the following steps to verify that it has run properly:

1. Note the number of documents in the OpenSearch or OpenSearch Dashboards index that you plan to run the benchmark against.
2. In the results returned by OpenSearch Benchmark, compare the `workload.json` file for your specific workload and verify that the document count matches the number of documents. For example, based on the [nyc_taxis](https://github.com/opensearch-project/opensearch-benchmark-workloads/blob/main/nyc_taxis/workload.json#L20) `workload.json` file, you should expect to see `165346692` documents in your cluster.

## Expected results

OSB returns the following response once the benchmark completes:

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



-----------------------------------
[INFO] ✅ SUCCESS (took 18 seconds)
-----------------------------------
```



## Running a workload on an external cluster

Now that you're familiar with running OpenSearch Benchmark on a local cluster, you can run it on your external cluster, as described in the following steps:

1. Replace `https://localhost:9200` with your target cluster endpoint. This could be a Uniform Resource Identifier (URI), such as `https://search.mydomain.com`, or a `HOST:PORT` specification.
2. If the cluster is configured with basic authentication, replace the username and password in the command line with the appropriate credentials.
3. Remove the `verify_certs:false` directive if you are not specifying `localhost` as your target cluster. This directive is necessary solely for clusters without SSL certificates.
4. If you are using a `HOST:PORT`specification and plan to use SSL or TLS, either specify `https://` or add the `use_ssl:true` directive to the `--client-options` string option.
5. Remove the `--test-mode` flag to run the full workload rather than an abbreviated test.

You can copy the following command template to use it in your own terminal:

```bash
opensearch-benchmark run --pipeline=benchmark-only --workload=nyc_taxis --target-host=<OpenSearch Cluster Endpoint> --client-options=basic_auth_user:admin,basic_auth_password:admin
```
{% include copy.html %}
