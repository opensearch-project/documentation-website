---
layout: default
title: Finetuning custom workloads
nav_order: 12
parent: User guide
---

# Finetuning custom workload

While custom workloads can help make benchmarks more specific to your applications needs, they sometimes require additional work in order to refine your benchmarks.

OpenSearch Benchmark’s `create-workload` can extract documents from all indexes or specific indexes selected by the user. This helps for finetuning your custom workload because The `create-workload` feature understand that all workloads have unique characteristics. This allows users to finetune workload runs to their specific need.

## Characteristics to consider 

When beginning to use `create-workload` to finetune a custom workload, consider the following characteristics of the workload:

1. **Queries** - Consider what kinds of documents the queries are targeting, what fields the queries call, and which indexes they’re targeting.
2. **Shard Size** - Match the shard size of the workload with the shard size in your cluster, or else the benchmark will not simulate the behavior of your application. Lucene operates on shard sizes and does not have a concept of indexes. Calculate the shard size for any index that you want in the custom workload.
3. **Shard count** - Size the shard count according to how you want to size the workload and improve query performance. As each person’s use case is different, you can determine the shard count in two ways:
    1. Divide the ideal index size with the shard size found in step 2.
    2. Multiply the ideal number of shards with the shard size found in step 2.
4. **Decide how many docs to extract (Recommended)** - Now that the shard size is set and the number of shards needed in the final index decided, you can determine how many docs you want to extract. For some cases, users aren’t interested in retrieving the entire document corpus from an index since it might be too big. Instead, the might want to generate a smaller corpus. However, the corpus of the index generated should be *representative* of the index in the production workload. In other words, it should contain docs from across the index and not just from a certain area, for example, the first half of the index or the last third of the index. To decide how many docs to extracts:
    1. Multiply the number of shards with the shard size. Since every document is created unequally, add a buffer to the number, an arbitrary amount of additional documents. The buffer provides cover in situations when the number of docs extracted might come out under the expected amount, which does not help retain your shard size. The goal is for the shard size to be under the number of documents extracted. 
    2. Take the store size and divide it by the product of the previous step. The value of the multiple is used to set the number of sample docs from the reference index. 
5. **Target Cluster Configuration**-  Consider the configuration and characteristics the target cluster and factor those into how you generate the workload.


## Example

The following example contains an index named `stocks`. The `stocks` index includes documents with stats on all stocks being traded in the New York Stock Exchange (NYSE). Using OpenSearch Dashboards gives information about the `stocks` index, as shown in the following code example:

```
health status index  uuid              pri rep docs.count docs.deleted store.size pri.store.size
green  open   stocks asjdkfjacklajldf   12   1  997818020    232823733    720gb    360gb
```

Using the information, you can start tweaking the workload to your specifications

1. **Fetch queries that are associated with this index:**  Obtain the queries needed to make requests to the stocks index.
2. **Find shard size for index:** To get the shard size of the index, divide the store size with the number of shards in the index. From this, we get `720 / (12 + (12 * 1)) = 30`. In other words, 30GB is the shard size. You can  verify this by dividing the primary store size value by the primary shards and you will get the same value
3. **Decide how many shards you want for your index:** Determine the number of shards needed in the index to understand your application. For example, if you want your index to hold 300GB of documents, but 300GB is too much for the benchmark, determine a number that makes a shard amount that makes sense. For example, 300GB of documents divided by the 30GB shard size determined in the last step, or `300 / 30 = 10`, gives a shard of 10. These 10 shards can either be 10 primary shards and 0 replicas, 5 primary shards and 1 replica, or 2 primary shards and 4 replicas. The shard configuration depends on your clusters needs index needs.
4. **Decide how many docs you want to extract:** To retain 30gb and to have 10 shards, you need to extract at least 300GB worth of documents. To get how many docs this would approximately equal, take the store size value and divide it by the index size value you decide, for this example `720 / 300 = 2.4`. Since we want to make sure we reach a value of 30GB per shard, we want to round down and chose 2 as our multiple. With the multiple of 2, OpenSearch Benchmark extracts every other document. From a query perspective, this might be better than grabbing the first half of the corpus because it gets docs from all across the index.
5. **Think about the target cluster configuration:** This might be an iterative process where you’ll need to assess the cluster you’re planning to have this workload run on. Be sure to consider the use case, the size of the cluster and the number of nodes.


## Replicating metrics

In many cases, we will never be able to replicate the exact metrics that the customer sees. However, we can aim to get close to them. In addition the metrics the customer experiences, service team should aim to replicate the following metrics:

* CPU Utilization
* Search Request Rates
* Indexing Rates (if the issue is with indexing)


