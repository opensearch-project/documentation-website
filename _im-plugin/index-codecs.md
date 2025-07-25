---
layout: default
title: Index codecs
nav_order: 3
parent: Index settings
canonical_url: https://docs.opensearch.org/latest/im-plugin/index-codecs/
---

# Index codecs

Index codecs determine how the index’s stored fields are compressed and stored on disk. The index codec is controlled by the static `index.codec` setting that specifies the compression algorithm. The setting impacts the index shard size and index operation performance.  

## Supported codecs

OpenSearch provides support for four codecs that can be used for compressing the stored fields. Each codec offers different tradeoffs between compression ratio (storage size) and indexing performance (speed): 

* `default` -- This codec employs the [LZ4 algorithm](https://en.wikipedia.org/wiki/LZ4_(compression_algorithm)) with a preset dictionary, which prioritizes performance over compression ratio. It offers faster indexing and search operations when compared with `best_compression` but may result in larger index/shard sizes. If no codec is provided in the index settings, then LZ4 is used as the default algorithm for compression.
* `best_compression` -- This codec uses [zlib](https://en.wikipedia.org/wiki/Zlib) as an underlying algorithm for compression. It achieves high compression ratios that result in smaller index sizes. However, this may incur additional CPU usage during index operations and may subsequently result in high indexing and search latencies. 

As of OpenSearch 2.9, two new codecs based on the [Zstandard compression algorithm](https://github.com/facebook/zstd) are available. This algorithm provides a good balance between compression ratio and speed.

It may be challenging to change the codec setting of an existing index (see [Changing an index codec](#changing-an-index-codec)), so it is important to test a representative workload in a non-production environment before using a new codec setting.
{: .important}

* `zstd` (OpenSearch 2.9 and later) -- This codec provides significant compression comparable to the `best_compression` codec with reasonable CPU usage and improved indexing and search performance compared to the `default` codec.
* `zstd_no_dict` (OpenSearch 2.9 and later) -- This codec is similar to `zstd` but excludes the dictionary compression feature. It provides faster indexing and search operations compared to `zstd` at the expense of a slightly larger index size.

As of OpenSearch 2.10, the `zstd` and `zstd_no_dict` compression codecs cannot be used for [k-NN]({{site.url}}{{site.baseurl}}/search-plugins/knn/index/) or [Security Analytics]({{site.url}}{{site.baseurl}}/security-analytics/index/) indexes.
{: .warning}

For the `zstd` and `zstd_no_dict` codecs, you can optionally specify a compression level in the `index.codec.compression_level` setting. This setting takes integers in the [1, 6] range. A higher compression level results in a higher compression ratio (smaller storage size) with a tradeoff in speed (slower compression and decompression speeds lead to greater indexing and search latencies). 

When an index segment is created, it uses the current index codec for compression. If you update the index codec, any segment created after the update will use the new compression algorithm. For specific operation considerations, see [Index codec considerations for index operations](#index-codec-considerations-for-index-operations).
{: .note}

As of OpenSearch 2.15, hardware-accelerated compression codecs for the `DEFLATE` and `LZ4` compression algorithms are available. These hardware-accelerated codecs are available on the latest 4th and 5th Gen Intel®️ Xeon®️ processors running Linux kernel 3.10 and later. For all other systems and platforms, the codecs use that platform's corresponding software implementations. 

The new hardware-accelerated codecs can be used by setting one of the following `index.codec` values:
* `qat_lz4` (OpenSearch 2.15 and later): Hardware-accelerated `LZ4`
* `qat_deflate` (OpenSearch 2.15 and later): Hardware-accelerated `DEFLATE`

`qat_deflate` offers a much better compression ratio than `qat_lz4`, with a modest drop in compression and decompression speed.
{: .note}

The `index.codec.compression_level` setting can be used to specify the compression level for both `qat_lz4` and `qat_deflate`. 

The `index.codec.qatmode` setting controls the behavior of the hardware accelerator and uses one of the following values:

* `auto`: If hardware acceleration fails, then the algorithm switches to software acceleration.
* `hardware`: Guarantees hardware-only compression. If hardware is not available, then an exception occurs until hardware exists.

For information about the `index.codec.qatmode` setting's effects on snapshots, see the [Snapshots](#snapshots) section.

For more information about hardware acceleration on Intel, see the [Intel (R) QAT accelerator overview](https://www.intel.com/content/www/us/en/developer/topic-technology/open/quick-assist-technology/overview.html).

## Choosing a codec 

The choice of index codec impacts the amount of disk space required to store the index data. Codecs like `best_compression`, `zstd`, and `zstd_no_dict` can achieve higher compression ratios, resulting in smaller index sizes. Conversely, the `default` codec doesn’t prioritize compression ratio, resulting in larger index sizes but faster search operations than `best_compression`.

## Index codec considerations for index operations

The following index codec considerations apply to various index operations.

### Writes

Every index consists of shards, each of which is further divided into Lucene segments. During index writes, the new segments are created based on the codec specified in the index settings. If you update the codec for an index, the new segments will use the new codec algorithm. 

### Merges

During segment merges, OpenSearch combines smaller index segments into larger segments in order to provide optimal resource utilization and improve performance. The index codec setting influences the speed and efficiency of the merge operations. The number of merges that happen on an index is a factor of the segment size, and a smaller segment size directly translates into smaller merge sizes. If you update the `index.codec` setting, the new merge operations will use the new codec when creating merged segments. The merged segments will have the compression characteristics of the new codec.

### Splits and shrinks

The [Split API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/split/) splits an original index into a new index where each original primary shard is divided into two or more primary shards. The [Shrink API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/shrink-index/) shrinks an existing index to a new index with a smaller number of primary shards. As part of split or shrink operations, any newly created segments will use the latest codec settings.

### Snapshots

When creating a [snapshot]({{site.url}}{{site.baseurl}}/tuning-your-cluster/availability-and-recovery/snapshots/index/), the index codec setting influences the size of the snapshot and the time required for its creation. If the codec of an index is updated, newly created snapshots will use the latest codec setting. The resulting snapshot size will reflect the compression characteristics of the latest codec setting. Existing segments included in the snapshot will retain their original compression characteristics. 

When you restore the indexes from a snapshot of a cluster to another cluster, it is important to verify that the target cluster supports the codecs of the segments in the source snapshot. For example, if the source snapshot contains segments of the `zstd` or `zstd_no_dict` codecs (introduced in OpenSearch 2.9), you won't be able to restore the snapshot to a cluster that runs on an older OpenSearch version because it doesn't support these codecs. 

For hardware-accelerated compression codecs, available in OpenSearch 2.15 and later, the value of `index.codec.qatmode` affects how snapshots and restores are performed. If the value is `auto` (the default), then snapshots and restores work without issue. However, if the value is `hardware`, then it must be reset to `auto` in order for the restore process to succeed on systems lacking the hardware accelerator.

You can modify the value of `index.codec.qatmode` during the restore process by setting its value as follows: `"index_settings": {"index.codec.qatmode": "auto"}`.
{: .note}

### Reindexing

When you are performing a [reindex]({{site.url}}{{site.baseurl}}/im-plugin/reindex-data/) operation from a source index, the new segments created in the target index will have the properties of the codec settings of the target index. 

### Index rollups and transforms

When an index [rollup]({{site.url}}{{site.baseurl}}/im-plugin/index-rollups/) or [transform]({{site.url}}{{site.baseurl}}/im-plugin/index-transforms/) job is completed, the segments created in the target index will have the properties of the index codec specified during target index creation, irrespective of the source index codec. If the target index is created dynamically through a rollup job, the default codec is used for segments of the target index.

## Changing an index codec

It is not possible to change the codec setting of an open index. You can close the index, apply the new index codec setting, and reopen the index, at which point only new segments will be written with the new codec. This requires stopping all reads and writes to the index for a brief period to make the codec change and may result in inconsistent segment sizes and compression ratios. Alternatively, you can reindex all data from a source index into a new index with a different codec setting, though this is a very resource-intensive operation.

## Performance tuning and benchmarking

Depending on your specific use case, you might need to experiment with different index codec settings to fine-tune the performance of your OpenSearch cluster. Conducting benchmark tests with different codecs and measuring the impact on indexing speed, search performance, and resource utilization can help you identify the optimal index codec setting for your workload. With the `zstd` and `zstd_no_dict` codecs, you can also fine-tune the compression level in order to identify the optimal configuration for your cluster.

### Benchmarking

The following table provides a performance comparison of the `best_compression`, `zstd`, and `zstd_no_dict` codecs against the `default` codec. The tests were performed with the [`nyc_taxi`](https://github.com/topics/nyc-taxi-dataset) dataset. The results are listed in terms of percent change, and bold results indicate performance improvement.

| | `best_compression` | `zstd` | `zstd_no_dict` |
|:---	|:---	|:---	|:--- |
|**Write** | | | 
|Median Latency	|0%	|0%	|&minus;1%	|
|p90 Latency	|3%	|2%	|**&minus;5%**	|
|Throughput	|&minus;2%	|**7%**	|**14%**	|
|**Read**	| | | 
|Median Latency	|0%	|1%	|0%	|
|p90 Latency	|1%	|1%	|**&minus;2%**	|
|**Disk**	| | | 
| Compression ratio	|**&minus;34%**	|**&minus;35%**	|**&minus;30%**	|

