---
layout: default
title: Index settings
parent: Configuring OpenSearch
nav_order: 50
---

# Index settings

OpenSearch supports the following index settings:

- `action.auto_create_index` (Boolean): Automatically creates an index if the index doesn't already exist. Also applies any index templates that are configured. Default is `true`. 

- `action.destructive_requires_name` (Boolean): When set to `true`, you must specify the index name to delete an index. You cannot delete all indexes or use wildcards. Default is `true`. 

- `indices.recovery.max_bytes_per_sec` (String): Limits the total inbound and outbound recovery traffic for each node. This applies to peer recoveries and snapshot recoveries. Default is `40mb`. If you set the recovery traffic value to less than or equal to `0mb`, rate limiting will be disabled, which causes recovery data to be transferred at the highest possible rate. 

- `indices.recovery.max_concurrent_file_chunks` (Integer): The number of file chunks sent in parallel for each recovery operation. Default is `2`. 

- `indices.recovery.max_concurrent_operations` (Integer): The number of operations sent in parallel for each recovery. Default is `1`. 

- `indices.recovery.max_concurrent_remote_store_streams` (Integer): The number of streams to the remote repository that can be opened in parallel when recovering a remote store index. Default is `20`. 

- `indices.time_series_index.default_index_merge_policy` (String): This setting allows you to specify the default merge policy for time-series indexes, particularly for those with an `@timestamp` field, such as data streams. The two available options are `tiered` (default) and `log_byte_size`. We recommend using `log_byte_size` for time-series indexes to enhance the performance of range queries with the `@timestamp` field. To override the merge policy on a per-index basis, you can use the `index.merge.policy` index setting. 

- `indices.fielddata.cache.size` (String): The maximum size of the field data cache. May be specified as an absolute value (for example, `8GB`) or a percentage of the node heap (for example, `50%`). This value is static so you must specify it in the `opensearch.yml` file. If you don't specify this setting, the maximum size is unlimited. This value should be smaller than the `indices.breaker.fielddata.limit`. For more information, see [Field data circuit breaker]({{site.url}}{{site.baseurl}}/install-and-configure/configuration/circuit-breaker/#field-data-circuit-breaker).