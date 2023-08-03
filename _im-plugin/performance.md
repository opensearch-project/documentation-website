---
layout: default
title: Tuning for indexing speed
nav_order: 41
has_children: false
---

# Performance considerations while tuning Opensearch for indexing speed

The following configurations have demonstrated around 60% improvements in throughput when
running an indexing only workload compared to the out-of-the-box experience. The workload did not
incorporate search or other scenarios. Only the OpenSearch server process was run on the machines,
with the benchmark clients hosted on a different node.

The execution environment was comprises of Intel EC2 instances (r7iz.2xlarge) on the AWS cloud, and the
workload was the StackOverflow dataset available as part of OpenSearch Benchmark.

## Java heap size

A larger Java heap size is useful for indexing. Setting the Java min and max heap sizes to 50% of RAM
size shows better indexing performance on EC2 instances.

## Flush translog threshold

Default value for `flush_threshold_size` is 512 MB. This means that the translog is flushed when it reaches 512 MB. The weight of the indexing load determines the frequency of the translog. When you increase `index.translog.flush_threshold_size`, the node performs the translog operation less frequently. Because flushes are resource-intensive operations, reducing the frequency of translogs improves indexing performance. By increasing the flush threshold size, the OpenSearch cluster also creates fewer large segments instead of multiple small segments. Large segments merge less often, and more threads are used for indexing instead of merging.

For pure indexing workloads, consider increasing the `flush_threshold_size`, for example, to 25% of the Java heap size, to improve indexing performance.

An increased `index.translog.flush_threshold_size` can also increase the time that it takes for a translog to complete. If a shard fails, then recovery takes more time because the translog is larger.
{: .note}

Before increasing `index.translog.flush_threshold_size`, call the following API operation to get current flush operation statistics:

```json
curl -XPOST "os-endpoint/index-name/_stats/flush?pretty"
```
{% include copy.html %}


Replace the `os-endpoint` and `index-name` with your endpoint and index name.

In the output, note the number of flushes and the total time. The following example output shows that there are 124 flushes, which took 17,690 milliseconds:

```json
{
     "flush": {
          "total": 124,
          "total_time_in_millis": 17690
     }
}
```

To increase the flush threshold size, call the following API operation:

```json
curl -XPUT "os-endpoint/index-name/_settings?pretty" -d "{"index":{"translog.flush_threshold_size" : "1024MB"}}"
```
{% include copy.html %}

In this example, the flush threshold size is set to 1024 MB, which is ideal for instances that have more than 32 GB of memory.

Choose the appropriate threshold size for your cluster.
{: .note}

Run the stats API operation again to see whether the flush activity changed:

```json
curl _XGET "os-endpoint/index-name/_stats/flush?pretty"
```
{% include copy.html %}

It's a best practice to increase the `index.translog.flush_threshold_size` only for the current index. After you confirm the outcome, apply the changes to the index template.
{: .note}

## Index refresh interval

By default, Opensearch periodically refreshes indexes every second. OpenSearch only refreshes indexes that have
received one search request in the last 30 seconds.

When you increase the refresh interval, the data node makes fewer API calls. The refresh interval can be shorter or faster, depending on the length of the refresh interval. To prevent [429 errors](https://repost.aws/knowledge-center/opensearch-resolve-429-error), it's a best practice to increase the refresh interval.

If your application can tolerate increasing the amount of time between when a document gets indexed and when it
becomes visible, you can increase the `index.refresh_interval` to a larger value, for example 30s, or even disable it in a
pure indexing scenario, in order to improve indexing speed.

## Index buffer size

If the node is doing heavy indexing, ensure the index buffer size is large enough. You can set the index buffer size as a percentage of the
java heap size or as the number of bytes. In most cases, the default value of 10% of JVM memory is sufficient. You can try
increasing it up to 25% for further improvement.

## Concurrent merges

The maximum number of concurrent merges is specified as `max_merge_count`. The concurrentMergeScheduler controls the execution of
merge operations when they are needed. Merges run in separate threads, and when the maximum number of
threads is reached, further merges will wait until a merge thread becomes available.
In cases where index throttling is an issue, consider increasing the number of merge threads beyond the
default value.

## Shard distribution

To ensure that the shards are distributed evenly across the data nodes for the index that you're ingesting into, use the following formula to confirm that the shards are evenly distributed:

Number of shards for index = k * (Number of data nodes), where k is the number of shards per node

For example, if there are 24 shards in the index, and there are eight data nodes, then OpenSearch assigns three shards to each node. 

## Setting replica count to zero

If you anticipate heavy indexing, consider setting the `index.number_of_replicas` value to `0`. Each replica duplicates the indexing process. As a result, disabling the replicas improves your cluster performance. After the heavy indexing is complete, reactivate the replicated indices.

If a node fails while replicas are disabled, you might lose data. Disable the replicas only if you can tolerate data loss for a short duration.
{: .important }

## Experiment to find the optimal bulk request size

Start with the bulk request size of 5 MiB to 15 MiB. Then slowly increase the request size until the indexing performance stops improving. 

Note: Some instance types limit bulk requests to 10 MiB. For more information, see [Network limits](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/limits.html#network-limits).

## Use an instance type that has SSD instance store volumes (such as I3)

I3 instances provide fast and local memory express (NVMe) storage. I3 instances deliver better ingestion performance than instances that use General Purpose SSD (gp2) Amazon Elastic Block Store (Amazon EBS) volumes. For more information, see [Petabyte scale for Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/petabyte-scale.html).

## Reduce response size

To reduce the size of OpenSearch's response, use the filter_path parameter to exclude unnecessary fields. Be sure that you don't filter out any fields that are required to identify or retry failed requests. Those fields can vary by client.

In the following example, the `index-name`, `type-name`, and `took` fields are excluded from the response:

```json
curl -XPOST "es-endpoint/index-name/type-name/_bulk?pretty&filter_path=-took,-items.index._index,-items.index._type" -H 'Content-Type: application/json' -d'
{ "index" : { "_index" : "test2", "_id" : "1" } }
{ "user" : "testuser" }
{ "update" : {"_id" : "1", "_index" : "test2"} }
{ "doc" : {"user" : "example"} }
```
{% include copy.html %}

For more information, see [Reducing response size](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/indexing.html#indexing-size).

1 https://www.elastic.co/guide/en/elasticsearch/reference/current/tune-for-indexingspeed.html#_unset_or_increase_the_refresh_interval

2 https://www.elastic.co/guide/en/elasticsearch/reference/current/tune-for-indexingspeed.html#_indexing_buffer_size

3 https://www.elastic.co/guide/en/elasticsearch/reference/current/index-modules-merge.html#merge-scheduling