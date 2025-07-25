---
layout: default
title: Fine-tuning custom workloads
nav_order: 12
parent: User guide
canonical_url: https://docs.opensearch.org/latest/benchmark/user-guide/finetine-workloads/
redirect_to: https://docs.opensearch.org/latest/benchmark/user-guide/finetine-workloads/
---

# Fine-tuning custom workloads

While custom workloads can help make benchmarks more specific to your application's needs, they sometimes require additional adjustments to make sure they closely resemble a production cluster.

You can fine-tune your custom workloads to more closely match your benchmarking needs by using the `create-workload` feature. `create-workload` can extract documents from all indexes or specific indexes selected by the user.

## Characteristics to consider 

When beginning to use `create-workload` to fine-tune a custom workload, consider the following characteristics of the workload:

1. **Queries** -- Consider the kinds of documents and as well as indexes targeted by the queries and the fields the queries call.
2. **Shard Size** -- Match the shard size of the workload with the shard size of your cluster, or the benchmark will not simulate the behavior of your application. Lucene operates based on shard sizes and does not have indexes. Calculate the shard size for any index that you want to include in the custom workload.
3. **Shard count** -- Choose the number of shards according to how you want to size the workload and improve query performance. Because each use case is different, you can determine the shard count in two ways:
    1. Divide the ideal index size by the shard size found in step 2.
    2. Multiply the ideal number of shards by the shard size found in step 2.
4. **Decide how many documents to extract (Recommended)** -- Now that the shard size is set and the number of shards needed in the final index decided, you can determine how many documents you want to extract. In some cases, users aren’t interested in retrieving the entire document corpus from an index because the corpus might be too big. Instead, you might want to generate a smaller corpus. However, the corpus of the generated index should be *representative* of the index in the production workload. In other words, it should contain documents from across the index and not only from a certain area, for example, the first half of the index or the last third of the index. To decide how many documents to extract:
    1. Multiply the number of shards by the shard size. Because every document is created unequally, add a buffer to the number---an arbitrary number of additional documents. The buffer provides assistance when the number of documents extracted is lower than the expected number, which will not help to retain your shard size. The shard size should be lower than the number of documents extracted. 
    2. Divide the store size by the product of the previous step. The value of the multiple is used to set the number of sample documents from the reference index. 
5. **Target cluster configuration** -- Factor the configuration and characteristics of the target cluster into how you generate the workload.


## Example

The following example contains an index named `stocks`. The `stocks` index includes documents containing statistics on all stocks being traded on the New York Stock Exchange (NYSE). OpenSearch Dashboards provides information about the `stocks` index, as shown in the following code example:

```
health status index  uuid              pri rep docs.count docs.deleted store.size pri.store.size
green  open   stocks asjdkfjacklajldf   12   1  997818020    232823733    720gb    360gb
```

Using this information, you can start adjusting the workload to your specifications, as shown in the following steps:

1. **Fetch queries associated with this index** -- Obtain the queries needed to make requests to the `stocks` index.
2. **Find the shard size for the index** -- To get the shard size of the index, divide the store size by the number of shards in the index: `720 / (12 + (12 * 1)) = 30`. 30 GB is the shard size. You can verify this by dividing the primary store size value by the number of primary shards.
3. **Determine the number of index shards** -- Determine the number of shards needed in the index to represent your application under a production load. For example, if you want your index to hold 300 GB of documents, but 300 GB is too much for the benchmark, determine a number that makes sense. For example, 300 GB of documents divided by the 30 GB shard size determined in the last step, or `300 / 30 = 10`, produces 10 shards. These 10 shards can either be 10 primary shards and 0 replicas, 5 primary shards and 1 replica, or 2 primary shards and 4 replicas. The shard configuration depends on your cluster's index needs.
4. **Decide how many documents to extract** -- To retain 30 GB and have 10 shards, you need to extract at least 300 GB of documents. To determine the number of documents to extract, divide the store size value by the index size value, in this example, `720 / 300 = 2.4`. Because you want to make sure you reach a value of 30 GB per shard, it is best to round down and choose 2 as the extraction multiple, which means that OpenSearch Benchmark will extract every other document.
5. **Think about the target cluster configuration** -- Assess the cluster you're planning to work on. Consider the use case, the size of the cluster, and the number of nodes. While fine-tuning the workload, this could be an iterative process where small adjustments to the cluster are made according to the results of the workload runs.


## Replicating metrics

In many cases, a workload will not be able to exactly replicate the exact metrics of a production cluster. However, you can aim to get as close as possible to your ideal cluster metrics by replicating the following metrics:

* CPU utilization
* Search request rates
* Indexing rates 


