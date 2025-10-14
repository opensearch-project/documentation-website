---
layout: default
title: Vector search
nav_order: 35
canonical_url: https://docs.opensearch.org/latest/benchmark/workloads/vectorsearch/
---

# Vector search workload

The vector search workload benchmarks OpenSearch's vector engine capabilities for both indexing and search operations. It tests various vector search algorithms, quantization methods, and index configurations to measure performance metrics like throughput, latency, and recall accuracy. The workload supports different datasets and can evaluate both trained and untrained vector search methods.

This workload currently supports datasets in either the `HDF5` or `BIG-ANN` formats. To download the datasets, use [this link](http://corpus-texmex.irisa.fr/).

## Supported workload parameters

The following workload parameters are supported by the vector search workload.

| Name                                      | Description                                                                                                                                     |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `target_index_name`                       | The name of index to which to add vectors.                                                                                                           |
| `target_field_name`                       | The name of the field to which to add vectors. Use "." to indicate a nested field.                                                                     |
| `target_index_body`                       | The path to the target index definition.                                                                                                        |
| `target_index_primary_shards`             | The target index's primary shards.                                                                                                              |
| `target_index_replica_shards`             | The target index's replica shards.                                                                                                              |
| `target_index_dimension`                  | The dimension of the target index.                                                                                                              |
| `target_index_space_type`                 | The target index space type.                                                                                                                    |
| `target_index_bulk_size`                  | The target index bulk size.                                                                                                                     |
| `target_index_bulk_index_data_set_format` | The format of the vector dataset.                                                                                                               |
| `target_index_bulk_index_data_set_path`   | The path to the vector dataset in the index.                                                                                                   |
| `target_index_bulk_index_data_set_corpus` | The corpus name of the vector dataset.                                                                                                         |
| `target_index_bulk_index_clients`         | The clients to be used for bulk ingestion. Must be a divisor of dataset size.                                                                  |
| `target_index_max_num_segments`           | The number of segments to merge into the target index before beginning to search.                                                              |
| `target_index_force_merge_timeout`        | The amount of time (in seconds) to wait before force merging requests.                                                                          |
| `hnsw_ef_search `                         | THE `HNSW ef` search parameter.                                                                                                                 |
| `hnsw_ef_construction`                      | The `HNSW ef` construction parameter.                                                                                                           |
| `id_field_name`                           | The name of the field that will be used to identify documents in an index.                                                                      |
| `hnsw_m `                                 | The `HNSW m` parameter.                                                                                                                         |
| `query_k`                                 | The number of neighbors to return for the search. Only one of `query_k`, `query_max_distance`, or `query_min_score` can be provided.          |
| `query_max_distance `                     | The maximum distance to be returned for the vector search. Only one of `query_k`, `query_max_distance`, or `query_min_score` can be provided. |
| `query_min_score`                         | The minimum score to be returned for the vector search. Only one of `query_k`, `query_max_distance`, or `query_min_score` can be provided.    |
| `query_data_set_format`                   | The format of the vector dataset used for queries. Only one of `query_k`, `query_max_distance`, or `query_min_score` can be provided.        |
| `query_data_set_path`                     | The path to the vector dataset used for queries.                                                                                               |
| `query_count`                             | The number of queries used for the search operation.                                                                                                 |
| `query_body`                              | The JSON properties that will be merged with the search body.                                                                                        |
| `search_clients`                          | The number of clients used to run queries.                                                                                               |
| `repetitions`                             | The number of repetitions completed until the dataset is exhausted. Default is `1`.                                                                      |
| `target_throughput`                       | The target throughput for each query operation, in requests per second. Default is `10`.                                                         |
| `time_period`                             | The period of time dedicated to running the benchmark test, in seconds. Default is `900`.                                                       |



## Test procedures

The vector search workload supports the following test procedures.

### No-train test procedure

The no-train test procedure tests vector search indexes that require no training. You can define the underlying configuration of the vector search algorithm (such as specifying a specific engine or space type) as method definitions. 

### No-train test (index only) procedure

The no-train test (index only) procedure is used to index vector search indexes that require no training. This can be particularly useful when you want to benchmark only the indexing operation.

### No-train test (Amazon OpenSearch Serverless)

The no-train test procedure for Amazon OpenSearch Serverless is used specifically for OpenSearch Serverless vector search collections. This procedure doesn't include operations like **refresh** and **warmup** because they aren't supported by vector search collections.

### Force merge index procedure

The force merge index procedure optimizes vector search indexes by performing force merge operations up to a given maximum number of segments. For large datasets, force merging is a costly operation. Therefore, we recommend using a separate procedure to occasionally trigger force merge operations based on user requirements.

### Train test procedure

The train test procedure benchmarks approximate k-NN search algorithms that require a training step. For example, the Faiss Inverted File Indexing (IVF) technique requires a training step in order to retrieve cluster vectors. After the step is performed, the benchmark can search a smaller number of cluster centroids instead of the entire dataset.

### Search procedure

The search procedure benchmarks previously indexed vector search indexes. This can be useful when you want to benchmark large vector search indexes without reindexing each time because load time can be substantial for large datasets. This procedure includes warmup operations intended to avoid cold start problems during vector search.

## Custom runners

Only one custom runner, `warmup-knn-indices`, is supported by the vector search workload. This runner will warm up k-NN indexes and retry the warmup until it succeeds.

## Running the workload

To run the vector search workload, use the following command:

```bash
export ENDPOINT=<cluster-endpoint>
export PARAMS_FILE=<params-file-path>

opensearch-benchmark execute-test \
    --target-hosts $ENDPOINT \
    --workload vectorsearch \
    --workload-params ${PARAMS_FILE} \
    --pipeline benchmark-only \
    --kill-running-processes
```
{% include copy.html %}

## Sample results

When using the vector search workload, you can expect results similar to the following.

### Train test procedure

The following example provides results from the train test procedure:


```
------------------------------------------------------
    _______             __   _____
   / ____(_)___  ____ _/ /  / ___/_________  ________
  / /_  / / __ \/ __ `/ /   \__ \/ ___/ __ \/ ___/ _ \
 / __/ / / / / / /_/ / /   ___/ / /__/ /_/ / /  /  __/
/_/   /_/_/ /_/\__,_/_/   /____/\___/\____/_/   \___/
------------------------------------------------------
            
|                                                         Metric |               Task |       Value |   Unit |
|---------------------------------------------------------------:|-------------------:|------------:|-------:|
|                     Cumulative indexing time of primary shards |                    |  0.00946667 |    min |
|             Min cumulative indexing time across primary shards |                    |           0 |    min |
|          Median cumulative indexing time across primary shards |                    |  0.00298333 |    min |
|             Max cumulative indexing time across primary shards |                    |  0.00336667 |    min |
|            Cumulative indexing throttle time of primary shards |                    |           0 |    min |
|    Min cumulative indexing throttle time across primary shards |                    |           0 |    min |
| Median cumulative indexing throttle time across primary shards |                    |           0 |    min |
|    Max cumulative indexing throttle time across primary shards |                    |           0 |    min |
|                        Cumulative merge time of primary shards |                    |           0 |    min |
|                       Cumulative merge count of primary shards |                    |           0 |        |
|                Min cumulative merge time across primary shards |                    |           0 |    min |
|             Median cumulative merge time across primary shards |                    |           0 |    min |
|                Max cumulative merge time across primary shards |                    |           0 |    min |
|               Cumulative merge throttle time of primary shards |                    |           0 |    min |
|       Min cumulative merge throttle time across primary shards |                    |           0 |    min |
|    Median cumulative merge throttle time across primary shards |                    |           0 |    min |
|       Max cumulative merge throttle time across primary shards |                    |           0 |    min |
|                      Cumulative refresh time of primary shards |                    |  0.00861667 |    min |
|                     Cumulative refresh count of primary shards |                    |          33 |        |
|              Min cumulative refresh time across primary shards |                    |           0 |    min |
|           Median cumulative refresh time across primary shards |                    |  0.00268333 |    min |
|              Max cumulative refresh time across primary shards |                    |  0.00291667 |    min |
|                        Cumulative flush time of primary shards |                    | 0.000183333 |    min |
|                       Cumulative flush count of primary shards |                    |           2 |        |
|                Min cumulative flush time across primary shards |                    |           0 |    min |
|             Median cumulative flush time across primary shards |                    |           0 |    min |
|                Max cumulative flush time across primary shards |                    | 0.000183333 |    min |
|                                        Total Young Gen GC time |                    |       0.075 |      s |
|                                       Total Young Gen GC count |                    |          17 |        |
|                                          Total Old Gen GC time |                    |           0 |      s |
|                                         Total Old Gen GC count |                    |           0 |        |
|                                                     Store size |                    |  0.00869293 |     GB |
|                                                  Translog size |                    | 2.56114e-07 |     GB |
|                                         Heap used for segments |                    |           0 |     MB |
|                                       Heap used for doc values |                    |           0 |     MB |
|                                            Heap used for terms |                    |           0 |     MB |
|                                            Heap used for norms |                    |           0 |     MB |
|                                           Heap used for points |                    |           0 |     MB |
|                                    Heap used for stored fields |                    |           0 |     MB |
|                                                  Segment count |                    |           9 |        |
|                                                 Min Throughput | custom-vector-bulk |       25527 | docs/s |
|                                                Mean Throughput | custom-vector-bulk |       25527 | docs/s |
|                                              Median Throughput | custom-vector-bulk |       25527 | docs/s |
|                                                 Max Throughput | custom-vector-bulk |       25527 | docs/s |
|                                        50th percentile latency | custom-vector-bulk |     36.3095 |     ms |
|                                        90th percentile latency | custom-vector-bulk |     52.2662 |     ms |
|                                       100th percentile latency | custom-vector-bulk |     68.6513 |     ms |
|                                   50th percentile service time | custom-vector-bulk |     36.3095 |     ms |
|                                   90th percentile service time | custom-vector-bulk |     52.2662 |     ms |
|                                  100th percentile service time | custom-vector-bulk |     68.6513 |     ms |
|                                                     error rate | custom-vector-bulk |           0 |      % |
|                                                 Min Throughput |       prod-queries |      211.26 |  ops/s |
|                                                Mean Throughput |       prod-queries |      213.85 |  ops/s |
|                                              Median Throughput |       prod-queries |      213.48 |  ops/s |
|                                                 Max Throughput |       prod-queries |      216.49 |  ops/s |
|                                        50th percentile latency |       prod-queries |     3.43393 |     ms |
|                                        90th percentile latency |       prod-queries |     4.01881 |     ms |
|                                        99th percentile latency |       prod-queries |     5.56238 |     ms |
|                                      99.9th percentile latency |       prod-queries |     9.95666 |     ms |
|                                     99.99th percentile latency |       prod-queries |     39.7922 |     ms |
|                                       100th percentile latency |       prod-queries |      62.415 |     ms |
|                                   50th percentile service time |       prod-queries |     3.43405 |     ms |
|                                   90th percentile service time |       prod-queries |      4.0191 |     ms |
|                                   99th percentile service time |       prod-queries |     5.56316 |     ms |
|                                 99.9th percentile service time |       prod-queries |     9.95666 |     ms |
|                                99.99th percentile service time |       prod-queries |     39.7922 |     ms |
|                                  100th percentile service time |       prod-queries |      62.415 |     ms |
|                                                     error rate |       prod-queries |           0 |      % |


---------------------------------
[INFO] SUCCESS (took 119 seconds)
---------------------------------
```

### Faiss results

The following sample outputs were generated using the Faiss IVF benchmarking procedure. For brevity, the test used 100 search queries instead of the 10,000 specified in the parameter files. All other parameters remain the same as those in the `params/train` folder. The first run demonstrates results without quantization, the second run demonstrates scalar quantization, and the third run demonstrates product quantization. Note that quantization may cause search recall to drop.

#### Faiss IVF with no quantization/flat encoding


```
|                                                         Metric |                     Task |       Value |   Unit |
|---------------------------------------------------------------:|-------------------------:|------------:|-------:|
|                     Cumulative indexing time of primary shards |                          |     11.7662 |    min |
|             Min cumulative indexing time across primary shards |                          | 0.000266667 |    min |
|          Median cumulative indexing time across primary shards |                          |      0.1423 |    min |
|             Max cumulative indexing time across primary shards |                          |     11.6236 |    min |
|            Cumulative indexing throttle time of primary shards |                          |           0 |    min |
|    Min cumulative indexing throttle time across primary shards |                          |           0 |    min |
| Median cumulative indexing throttle time across primary shards |                          |           0 |    min |
|    Max cumulative indexing throttle time across primary shards |                          |           0 |    min |
|                        Cumulative merge time of primary shards |                          |     1.09872 |    min |
|                       Cumulative merge count of primary shards |                          |          21 |        |
|                Min cumulative merge time across primary shards |                          |           0 |    min |
|             Median cumulative merge time across primary shards |                          |     0.00045 |    min |
|                Max cumulative merge time across primary shards |                          |     1.09827 |    min |
|               Cumulative merge throttle time of primary shards |                          |    0.872417 |    min |
|       Min cumulative merge throttle time across primary shards |                          |           0 |    min |
|    Median cumulative merge throttle time across primary shards |                          |           0 |    min |
|       Max cumulative merge throttle time across primary shards |                          |    0.872417 |    min |
|                      Cumulative refresh time of primary shards |                          |    0.113733 |    min |
|                     Cumulative refresh count of primary shards |                          |          59 |        |
|              Min cumulative refresh time across primary shards |                          |     0.00235 |    min |
|           Median cumulative refresh time across primary shards |                          |  0.00516667 |    min |
|              Max cumulative refresh time across primary shards |                          |    0.106217 |    min |
|                        Cumulative flush time of primary shards |                          |     0.01685 |    min |
|                       Cumulative flush count of primary shards |                          |           8 |        |
|                Min cumulative flush time across primary shards |                          |           0 |    min |
|             Median cumulative flush time across primary shards |                          |  0.00791667 |    min |
|                Max cumulative flush time across primary shards |                          |  0.00893333 |    min |
|                                        Total Young Gen GC time |                          |       5.442 |      s |
|                                       Total Young Gen GC count |                          |        3739 |        |
|                                          Total Old Gen GC time |                          |           0 |      s |
|                                         Total Old Gen GC count |                          |           0 |        |
|                                                     Store size |                          |      1.3545 |     GB |
|                                                  Translog size |                          |   0.0304573 |     GB |
|                                         Heap used for segments |                          |           0 |     MB |
|                                       Heap used for doc values |                          |           0 |     MB |
|                                            Heap used for terms |                          |           0 |     MB |
|                                            Heap used for norms |                          |           0 |     MB |
|                                           Heap used for points |                          |           0 |     MB |
|                                    Heap used for stored fields |                          |           0 |     MB |
|                                                  Segment count |                          |          14 |        |
|                                                 Min Throughput | custom-vector-bulk-train |     32222.6 | docs/s |
|                                                Mean Throughput | custom-vector-bulk-train |     32222.6 | docs/s |
|                                              Median Throughput | custom-vector-bulk-train |     32222.6 | docs/s |
|                                                 Max Throughput | custom-vector-bulk-train |     32222.6 | docs/s |
|                                        50th percentile latency | custom-vector-bulk-train |     26.5199 |     ms |
|                                        90th percentile latency | custom-vector-bulk-train |     34.9823 |     ms |
|                                        99th percentile latency | custom-vector-bulk-train |     196.712 |     ms |
|                                       100th percentile latency | custom-vector-bulk-train |     230.342 |     ms |
|                                   50th percentile service time | custom-vector-bulk-train |     26.5158 |     ms |
|                                   90th percentile service time | custom-vector-bulk-train |     34.9823 |     ms |
|                                   99th percentile service time | custom-vector-bulk-train |     196.712 |     ms |
|                                  100th percentile service time | custom-vector-bulk-train |     230.342 |     ms |
|                                                     error rate | custom-vector-bulk-train |           0 |      % |
|                                                 Min Throughput |             delete-model |       10.58 |  ops/s |
|                                                Mean Throughput |             delete-model |       10.58 |  ops/s |
|                                              Median Throughput |             delete-model |       10.58 |  ops/s |
|                                                 Max Throughput |             delete-model |       10.58 |  ops/s |
|                                       100th percentile latency |             delete-model |     93.6958 |     ms |
|                                  100th percentile service time |             delete-model |     93.6958 |     ms |
|                                                     error rate |             delete-model |           0 |      % |
|                                                 Min Throughput |          train-knn-model |        0.63 |  ops/s |
|                                                Mean Throughput |          train-knn-model |        0.63 |  ops/s |
|                                              Median Throughput |          train-knn-model |        0.63 |  ops/s |
|                                                 Max Throughput |          train-knn-model |        0.63 |  ops/s |
|                                       100th percentile latency |          train-knn-model |     1577.49 |     ms |
|                                  100th percentile service time |          train-knn-model |     1577.49 |     ms |
|                                                     error rate |          train-knn-model |           0 |      % |
|                                                 Min Throughput |       custom-vector-bulk |       11055 | docs/s |
|                                                Mean Throughput |       custom-vector-bulk |     14163.8 | docs/s |
|                                              Median Throughput |       custom-vector-bulk |     12878.9 | docs/s |
|                                                 Max Throughput |       custom-vector-bulk |     33841.3 | docs/s |
|                                        50th percentile latency |       custom-vector-bulk |     81.6677 |     ms |
|                                        90th percentile latency |       custom-vector-bulk |     117.848 |     ms |
|                                        99th percentile latency |       custom-vector-bulk |     202.484 |     ms |
|                                      99.9th percentile latency |       custom-vector-bulk |     406.209 |     ms |
|                                     99.99th percentile latency |       custom-vector-bulk |     458.823 |     ms |
|                                       100th percentile latency |       custom-vector-bulk |     459.417 |     ms |
|                                   50th percentile service time |       custom-vector-bulk |     81.6621 |     ms |
|                                   90th percentile service time |       custom-vector-bulk |     117.843 |     ms |
|                                   99th percentile service time |       custom-vector-bulk |     202.294 |     ms |
|                                 99.9th percentile service time |       custom-vector-bulk |     406.209 |     ms |
|                                99.99th percentile service time |       custom-vector-bulk |     458.823 |     ms |
|                                  100th percentile service time |       custom-vector-bulk |     459.417 |     ms |
|                                                     error rate |       custom-vector-bulk |           0 |      % |
|                                                 Min Throughput |     force-merge-segments |         0.1 |  ops/s |
|                                                Mean Throughput |     force-merge-segments |         0.1 |  ops/s |
|                                              Median Throughput |     force-merge-segments |         0.1 |  ops/s |
|                                                 Max Throughput |     force-merge-segments |         0.1 |  ops/s |
|                                       100th percentile latency |     force-merge-segments |     10017.4 |     ms |
|                                  100th percentile service time |     force-merge-segments |     10017.4 |     ms |
|                                                     error rate |     force-merge-segments |           0 |      % |
|                                                 Min Throughput |           warmup-indices |        9.63 |  ops/s |
|                                                Mean Throughput |           warmup-indices |        9.63 |  ops/s |
|                                              Median Throughput |           warmup-indices |        9.63 |  ops/s |
|                                                 Max Throughput |           warmup-indices |        9.63 |  ops/s |
|                                       100th percentile latency |           warmup-indices |     103.228 |     ms |
|                                  100th percentile service time |           warmup-indices |     103.228 |     ms |
|                                                     error rate |           warmup-indices |           0 |      % |
|                                                 Min Throughput |             prod-queries |      120.06 |  ops/s |
|                                                Mean Throughput |             prod-queries |      120.06 |  ops/s |
|                                              Median Throughput |             prod-queries |      120.06 |  ops/s |
|                                                 Max Throughput |             prod-queries |      120.06 |  ops/s |
|                                        50th percentile latency |             prod-queries |     1.75219 |     ms |
|                                        90th percentile latency |             prod-queries |     2.29527 |     ms |
|                                        99th percentile latency |             prod-queries |     50.4419 |     ms |
|                                       100th percentile latency |             prod-queries |     97.9905 |     ms |
|                                   50th percentile service time |             prod-queries |     1.75219 |     ms |
|                                   90th percentile service time |             prod-queries |     2.29527 |     ms |
|                                   99th percentile service time |             prod-queries |     50.4419 |     ms |
|                                  100th percentile service time |             prod-queries |     97.9905 |     ms |
|                                                     error rate |             prod-queries |           0 |      % |
|                                                  Mean recall@k |             prod-queries |        0.96 |        |
|                                                  Mean recall@1 |             prod-queries |        0.99 |        |


---------------------------------
[INFO] SUCCESS (took 218 seconds)
---------------------------------
```

#### Faiss IVF with scalar quantization (100 search queries)

```         
|                                                         Metric |                     Task |       Value |   Unit |
|---------------------------------------------------------------:|-------------------------:|------------:|-------:|
|                     Cumulative indexing time of primary shards |                          |        11.5 |    min |
|             Min cumulative indexing time across primary shards |                          | 0.000283333 |    min |
|          Median cumulative indexing time across primary shards |                          |     0.10915 |    min |
|             Max cumulative indexing time across primary shards |                          |     11.3905 |    min |
|            Cumulative indexing throttle time of primary shards |                          |           0 |    min |
|    Min cumulative indexing throttle time across primary shards |                          |           0 |    min |
| Median cumulative indexing throttle time across primary shards |                          |           0 |    min |
|    Max cumulative indexing throttle time across primary shards |                          |           0 |    min |
|                        Cumulative merge time of primary shards |                          |     1.03638 |    min |
|                       Cumulative merge count of primary shards |                          |          22 |        |
|                Min cumulative merge time across primary shards |                          |           0 |    min |
|             Median cumulative merge time across primary shards |                          | 0.000266667 |    min |
|                Max cumulative merge time across primary shards |                          |     1.03612 |    min |
|               Cumulative merge throttle time of primary shards |                          |    0.798767 |    min |
|       Min cumulative merge throttle time across primary shards |                          |           0 |    min |
|    Median cumulative merge throttle time across primary shards |                          |           0 |    min |
|       Max cumulative merge throttle time across primary shards |                          |    0.798767 |    min |
|                      Cumulative refresh time of primary shards |                          |    0.107117 |    min |
|                     Cumulative refresh count of primary shards |                          |          61 |        |
|              Min cumulative refresh time across primary shards |                          |  0.00236667 |    min |
|           Median cumulative refresh time across primary shards |                          |  0.00543333 |    min |
|              Max cumulative refresh time across primary shards |                          |   0.0993167 |    min |
|                        Cumulative flush time of primary shards |                          |   0.0193167 |    min |
|                       Cumulative flush count of primary shards |                          |           9 |        |
|                Min cumulative flush time across primary shards |                          |           0 |    min |
|             Median cumulative flush time across primary shards |                          |  0.00871667 |    min |
|                Max cumulative flush time across primary shards |                          |      0.0106 |    min |
|                                        Total Young Gen GC time |                          |       5.267 |      s |
|                                       Total Young Gen GC count |                          |        3688 |        |
|                                          Total Old Gen GC time |                          |           0 |      s |
|                                         Total Old Gen GC count |                          |           0 |        |
|                                                     Store size |                          |     1.11609 |     GB |
|                                                  Translog size |                          |   0.0304573 |     GB |
|                                         Heap used for segments |                          |           0 |     MB |
|                                       Heap used for doc values |                          |           0 |     MB |
|                                            Heap used for terms |                          |           0 |     MB |
|                                            Heap used for norms |                          |           0 |     MB |
|                                           Heap used for points |                          |           0 |     MB |
|                                    Heap used for stored fields |                          |           0 |     MB |
|                                                  Segment count |                          |          18 |        |
|                                                 Min Throughput | custom-vector-bulk-train |     35950.5 | docs/s |
|                                                Mean Throughput | custom-vector-bulk-train |     35950.5 | docs/s |
|                                              Median Throughput | custom-vector-bulk-train |     35950.5 | docs/s |
|                                                 Max Throughput | custom-vector-bulk-train |     35950.5 | docs/s |
|                                        50th percentile latency | custom-vector-bulk-train |     22.8328 |     ms |
|                                        90th percentile latency | custom-vector-bulk-train |      34.864 |     ms |
|                                        99th percentile latency | custom-vector-bulk-train |      99.471 |     ms |
|                                       100th percentile latency | custom-vector-bulk-train |     210.424 |     ms |
|                                   50th percentile service time | custom-vector-bulk-train |      22.823 |     ms |
|                                   90th percentile service time | custom-vector-bulk-train |      34.864 |     ms |
|                                   99th percentile service time | custom-vector-bulk-train |      99.471 |     ms |
|                                  100th percentile service time | custom-vector-bulk-train |     210.424 |     ms |
|                                                     error rate | custom-vector-bulk-train |           0 |      % |
|                                                 Min Throughput |             delete-model |        8.39 |  ops/s |
|                                                Mean Throughput |             delete-model |        8.39 |  ops/s |
|                                              Median Throughput |             delete-model |        8.39 |  ops/s |
|                                                 Max Throughput |             delete-model |        8.39 |  ops/s |
|                                       100th percentile latency |             delete-model |     118.241 |     ms |
|                                  100th percentile service time |             delete-model |     118.241 |     ms |
|                                                     error rate |             delete-model |           0 |      % |
|                                                 Min Throughput |          train-knn-model |        0.64 |  ops/s |
|                                                Mean Throughput |          train-knn-model |        0.64 |  ops/s |
|                                              Median Throughput |          train-knn-model |        0.64 |  ops/s |
|                                                 Max Throughput |          train-knn-model |        0.64 |  ops/s |
|                                       100th percentile latency |          train-knn-model |     1564.44 |     ms |
|                                  100th percentile service time |          train-knn-model |     1564.44 |     ms |
|                                                     error rate |          train-knn-model |           0 |      % |
|                                                 Min Throughput |       custom-vector-bulk |     11313.1 | docs/s |
|                                                Mean Throughput |       custom-vector-bulk |     14065.7 | docs/s |
|                                              Median Throughput |       custom-vector-bulk |     12894.8 | docs/s |
|                                                 Max Throughput |       custom-vector-bulk |     30050.8 | docs/s |
|                                        50th percentile latency |       custom-vector-bulk |     81.4293 |     ms |
|                                        90th percentile latency |       custom-vector-bulk |     111.812 |     ms |
|                                        99th percentile latency |       custom-vector-bulk |      196.45 |     ms |
|                                      99.9th percentile latency |       custom-vector-bulk |     370.543 |     ms |
|                                     99.99th percentile latency |       custom-vector-bulk |     474.156 |     ms |
|                                       100th percentile latency |       custom-vector-bulk |     499.048 |     ms |
|                                   50th percentile service time |       custom-vector-bulk |     81.4235 |     ms |
|                                   90th percentile service time |       custom-vector-bulk |     111.833 |     ms |
|                                   99th percentile service time |       custom-vector-bulk |     197.125 |     ms |
|                                 99.9th percentile service time |       custom-vector-bulk |     370.543 |     ms |
|                                99.99th percentile service time |       custom-vector-bulk |     474.156 |     ms |
|                                  100th percentile service time |       custom-vector-bulk |     499.048 |     ms |
|                                                     error rate |       custom-vector-bulk |           0 |      % |
|                                                 Min Throughput |     force-merge-segments |         0.1 |  ops/s |
|                                                Mean Throughput |     force-merge-segments |         0.1 |  ops/s |
|                                              Median Throughput |     force-merge-segments |         0.1 |  ops/s |
|                                                 Max Throughput |     force-merge-segments |         0.1 |  ops/s |
|                                       100th percentile latency |     force-merge-segments |     10015.2 |     ms |
|                                  100th percentile service time |     force-merge-segments |     10015.2 |     ms |
|                                                     error rate |     force-merge-segments |           0 |      % |
|                                                 Min Throughput |           warmup-indices |          19 |  ops/s |
|                                                Mean Throughput |           warmup-indices |          19 |  ops/s |
|                                              Median Throughput |           warmup-indices |          19 |  ops/s |
|                                                 Max Throughput |           warmup-indices |          19 |  ops/s |
|                                       100th percentile latency |           warmup-indices |     52.1685 |     ms |
|                                  100th percentile service time |           warmup-indices |     52.1685 |     ms |
|                                                     error rate |           warmup-indices |           0 |      % |
|                                                 Min Throughput |             prod-queries |      159.49 |  ops/s |
|                                                Mean Throughput |             prod-queries |      159.49 |  ops/s |
|                                              Median Throughput |             prod-queries |      159.49 |  ops/s |
|                                                 Max Throughput |             prod-queries |      159.49 |  ops/s |
|                                        50th percentile latency |             prod-queries |     1.92377 |     ms |
|                                        90th percentile latency |             prod-queries |     2.63867 |     ms |
|                                        99th percentile latency |             prod-queries |      48.513 |     ms |
|                                       100th percentile latency |             prod-queries |      90.543 |     ms |
|                                   50th percentile service time |             prod-queries |     1.92377 |     ms |
|                                   90th percentile service time |             prod-queries |     2.63867 |     ms |
|                                   99th percentile service time |             prod-queries |      48.513 |     ms |
|                                  100th percentile service time |             prod-queries |      90.543 |     ms |
|                                                     error rate |             prod-queries |           0 |      % |
|                                                  Mean recall@k |             prod-queries |        0.96 |        |
|                                                  Mean recall@1 |             prod-queries |        0.98 |        |


---------------------------------
[INFO] SUCCESS (took 218 seconds)
---------------------------------
```

#### Faiss IVF with product quantization (100 search queries)

```            
|                                                         Metric |                     Task |       Value |   Unit |
|---------------------------------------------------------------:|-------------------------:|------------:|-------:|
|                     Cumulative indexing time of primary shards |                          |     11.3862 |    min |
|             Min cumulative indexing time across primary shards |                          |      0.0003 |    min |
|          Median cumulative indexing time across primary shards |                          |     0.12735 |    min |
|             Max cumulative indexing time across primary shards |                          |     11.2586 |    min |
|            Cumulative indexing throttle time of primary shards |                          |           0 |    min |
|    Min cumulative indexing throttle time across primary shards |                          |           0 |    min |
| Median cumulative indexing throttle time across primary shards |                          |           0 |    min |
|    Max cumulative indexing throttle time across primary shards |                          |           0 |    min |
|                        Cumulative merge time of primary shards |                          |     1.50842 |    min |
|                       Cumulative merge count of primary shards |                          |          19 |        |
|                Min cumulative merge time across primary shards |                          |           0 |    min |
|             Median cumulative merge time across primary shards |                          | 0.000233333 |    min |
|                Max cumulative merge time across primary shards |                          |     1.50818 |    min |
|               Cumulative merge throttle time of primary shards |                          |     0.58095 |    min |
|       Min cumulative merge throttle time across primary shards |                          |           0 |    min |
|    Median cumulative merge throttle time across primary shards |                          |           0 |    min |
|       Max cumulative merge throttle time across primary shards |                          |     0.58095 |    min |
|                      Cumulative refresh time of primary shards |                          |      0.2059 |    min |
|                     Cumulative refresh count of primary shards |                          |          61 |        |
|              Min cumulative refresh time across primary shards |                          |  0.00238333 |    min |
|           Median cumulative refresh time across primary shards |                          |  0.00526667 |    min |
|              Max cumulative refresh time across primary shards |                          |     0.19825 |    min |
|                        Cumulative flush time of primary shards |                          |   0.0254667 |    min |
|                       Cumulative flush count of primary shards |                          |          10 |        |
|                Min cumulative flush time across primary shards |                          |           0 |    min |
|             Median cumulative flush time across primary shards |                          |   0.0118333 |    min |
|                Max cumulative flush time across primary shards |                          |   0.0136333 |    min |
|                                        Total Young Gen GC time |                          |       6.477 |      s |
|                                       Total Young Gen GC count |                          |        3565 |        |
|                                          Total Old Gen GC time |                          |           0 |      s |
|                                         Total Old Gen GC count |                          |           0 |        |
|                                                     Store size |                          |    0.892541 |     GB |
|                                                  Translog size |                          |   0.0304573 |     GB |
|                                         Heap used for segments |                          |           0 |     MB |
|                                       Heap used for doc values |                          |           0 |     MB |
|                                            Heap used for terms |                          |           0 |     MB |
|                                            Heap used for norms |                          |           0 |     MB |
|                                           Heap used for points |                          |           0 |     MB |
|                                    Heap used for stored fields |                          |           0 |     MB |
|                                                  Segment count |                          |          21 |        |
|                                                 Min Throughput | custom-vector-bulk-train |       31931 | docs/s |
|                                                Mean Throughput | custom-vector-bulk-train |       31931 | docs/s |
|                                              Median Throughput | custom-vector-bulk-train |       31931 | docs/s |
|                                                 Max Throughput | custom-vector-bulk-train |       31931 | docs/s |
|                                        50th percentile latency | custom-vector-bulk-train |     25.3297 |     ms |
|                                        90th percentile latency | custom-vector-bulk-train |     35.3864 |     ms |
|                                        99th percentile latency | custom-vector-bulk-train |     144.372 |     ms |
|                                       100th percentile latency | custom-vector-bulk-train |      209.37 |     ms |
|                                   50th percentile service time | custom-vector-bulk-train |     25.3226 |     ms |
|                                   90th percentile service time | custom-vector-bulk-train |     35.3864 |     ms |
|                                   99th percentile service time | custom-vector-bulk-train |     144.372 |     ms |
|                                  100th percentile service time | custom-vector-bulk-train |      209.37 |     ms |
|                                                     error rate | custom-vector-bulk-train |           0 |      % |
|                                                 Min Throughput |             delete-model |        8.65 |  ops/s |
|                                                Mean Throughput |             delete-model |        8.65 |  ops/s |
|                                              Median Throughput |             delete-model |        8.65 |  ops/s |
|                                                 Max Throughput |             delete-model |        8.65 |  ops/s |
|                                       100th percentile latency |             delete-model |     114.725 |     ms |
|                                  100th percentile service time |             delete-model |     114.725 |     ms |
|                                                     error rate |             delete-model |           0 |      % |
|                                                 Min Throughput |          train-knn-model |        0.03 |  ops/s |
|                                                Mean Throughput |          train-knn-model |        0.03 |  ops/s |
|                                              Median Throughput |          train-knn-model |        0.03 |  ops/s |
|                                                 Max Throughput |          train-knn-model |        0.03 |  ops/s |
|                                       100th percentile latency |          train-knn-model |     37222.2 |     ms |
|                                  100th percentile service time |          train-knn-model |     37222.2 |     ms |
|                                                     error rate |          train-knn-model |           0 |      % |
|                                                 Min Throughput |       custom-vector-bulk |     10669.3 | docs/s |
|                                                Mean Throughput |       custom-vector-bulk |     14468.6 | docs/s |
|                                              Median Throughput |       custom-vector-bulk |     12496.1 | docs/s |
|                                                 Max Throughput |       custom-vector-bulk |     35027.8 | docs/s |
|                                        50th percentile latency |       custom-vector-bulk |     74.2584 |     ms |
|                                        90th percentile latency |       custom-vector-bulk |     113.426 |     ms |
|                                        99th percentile latency |       custom-vector-bulk |     293.075 |     ms |
|                                      99.9th percentile latency |       custom-vector-bulk |     1774.41 |     ms |
|                                     99.99th percentile latency |       custom-vector-bulk |     1969.99 |     ms |
|                                       100th percentile latency |       custom-vector-bulk |     1971.29 |     ms |
|                                   50th percentile service time |       custom-vector-bulk |     74.2577 |     ms |
|                                   90th percentile service time |       custom-vector-bulk |     113.477 |     ms |
|                                   99th percentile service time |       custom-vector-bulk |     292.481 |     ms |
|                                 99.9th percentile service time |       custom-vector-bulk |     1774.41 |     ms |
|                                99.99th percentile service time |       custom-vector-bulk |     1969.99 |     ms |
|                                  100th percentile service time |       custom-vector-bulk |     1971.29 |     ms |
|                                                     error rate |       custom-vector-bulk |           0 |      % |
|                                                 Min Throughput |     force-merge-segments |        0.05 |  ops/s |
|                                                Mean Throughput |     force-merge-segments |        0.05 |  ops/s |
|                                              Median Throughput |     force-merge-segments |        0.05 |  ops/s |
|                                                 Max Throughput |     force-merge-segments |        0.05 |  ops/s |
|                                       100th percentile latency |     force-merge-segments |     20015.2 |     ms |
|                                  100th percentile service time |     force-merge-segments |     20015.2 |     ms |
|                                                     error rate |     force-merge-segments |           0 |      % |
|                                                 Min Throughput |           warmup-indices |       47.06 |  ops/s |
|                                                Mean Throughput |           warmup-indices |       47.06 |  ops/s |
|                                              Median Throughput |           warmup-indices |       47.06 |  ops/s |
|                                                 Max Throughput |           warmup-indices |       47.06 |  ops/s |
|                                       100th percentile latency |           warmup-indices |     20.6798 |     ms |
|                                  100th percentile service time |           warmup-indices |     20.6798 |     ms |
|                                                     error rate |           warmup-indices |           0 |      % |
|                                                 Min Throughput |             prod-queries |       87.76 |  ops/s |
|                                                Mean Throughput |             prod-queries |       87.76 |  ops/s |
|                                              Median Throughput |             prod-queries |       87.76 |  ops/s |
|                                                 Max Throughput |             prod-queries |       87.76 |  ops/s |
|                                        50th percentile latency |             prod-queries |     1.81677 |     ms |
|                                        90th percentile latency |             prod-queries |     2.80454 |     ms |
|                                        99th percentile latency |             prod-queries |     51.2039 |     ms |
|                                       100th percentile latency |             prod-queries |     98.2032 |     ms |
|                                   50th percentile service time |             prod-queries |     1.81677 |     ms |
|                                   90th percentile service time |             prod-queries |     2.80454 |     ms |
|                                   99th percentile service time |             prod-queries |     51.2039 |     ms |
|                                  100th percentile service time |             prod-queries |     98.2032 |     ms |
|                                                     error rate |             prod-queries |           0 |      % |
|                                                  Mean recall@k |             prod-queries |        0.62 |        |
|                                                  Mean recall@1 |             prod-queries |        0.52 |        |

---------------------------------
[INFO] SUCCESS (took 413 seconds)
---------------------------------
```
