---
layout: default
title: Concurrent segment search
parent: Improving search performance
nav_order: 53
---

# Concurrent segment search

Use concurrent segment search to search segments in parallel during the query phase. Cases in which concurrent segment search improves search latency include the following:

- When sending long-running requests, for example, requests that contain aggregations or large ranges
- As an alternative to force-merging segments into a single segment in order to improve performance

## Background

In OpenSearch, each search request follows the scatter-gather protocol. The coordinating node receives a search request, evaluates which shards are needed to serve this request, and sends a shard-level search request to each of those shards. Each shard that receives the request executes the request locally using Lucene and returns the results. The coordinating node merges the responses received from all shards and sends the search response back to the client. Optionally, the coordinating node can perform a fetch phase before returning the final results to the client if any document field or the entire document is requested by the client as part of the response.

## Searching segments concurrently

Without concurrent segment search, Lucene executes a request sequentially across all segments on each shard during the query phase. The query phase then collects the top hits for the search request. With concurrent segment search, each shard-level request will search the segments in parallel during the query phase. For each shard, the segments are divided into multiple _slices_. Each slice is the unit of work that can be executed in parallel on a separate thread, so the slice count determines the maximum degree of parallelism for a shard-level request. Once all the slices complete their work, Lucene performs a reduce operation on the slices, merging them and creating the final result for this shard-level request. Slices are executed using a new `index_searcher` thread pool, which is different from the `search` thread pool that handles shard-level requests.

## Enabling concurrent segment search at the index or cluster level

Starting with OpenSearch version 3.0, concurrent segment search is enabled at the cluster level by default. The default concurrent segment search mode is `auto`. After upgrading, aggregation workloads may experience increased CPU utilization. We recommend monitoring your cluster's resource usage and adjusting your infrastructure capacity as needed to maintain optimal performance.
{: .important}

To configure concurrent segment search on your cluster, use the `search.concurrent_segment_search.mode` setting. The older `search.concurrent_segment_search.enabled` setting will be deprecated in future version releases in favor of the new setting.

You can enable concurrent segment search at two levels:

- Cluster level
- Index level

The index-level setting takes priority over the cluster-level setting. Thus, if the cluster setting is enabled but the index setting is disabled, then concurrent segment search will be disabled for that index. Because of this, the index-level setting is not evaluated unless it is explicitly set, regardless of the default value configured for the setting. You can retrieve the current value of the index-level setting by calling the [Index Settings API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/get-settings/) and omitting the `?include_defaults` query parameter.
{: .note}

Both the cluster- and index-level `search.concurrent_segment_search.mode` settings accept the following values:

- `auto` (Default): In this mode, OpenSearch will use the pluggable _concurrent search decider_ to decide whether to use a concurrent or sequential path for the search request based on the query evaluation and the presence of aggregations in the request. By default, if there are no deciders configured by any plugin, then the decision to use concurrent search will be made based on the presence of aggregations in the request. For more information about the pluggable decider semantics, see [Pluggable concurrent search deciders](#pluggable-concurrent-search-deciders-concurrentsearchrequestdecider). 

- `all`: Enables concurrent segment search across all search requests. This is equivalent to setting `search.concurrent_segment_search.enabled` to `true`. 

- `none`: Disables concurrent segment search for all search requests, effectively turning off the feature. This is equivalent to setting `search.concurrent_segment_search.enabled` to `false`.

To enable concurrent segment search for all search requests across every index in the cluster, send the following request:

```json
PUT _cluster/settings
{
   "persistent":{
      "search.concurrent_segment_search.mode": "all"
   }
}
```
{% include copy-curl.html %}

To enable concurrent segment search for all search requests on a particular index, specify the index name in the endpoint:

```json
PUT <index-name>/_settings
{
    "index.search.concurrent_segment_search.mode": "all"
}
```
{% include copy-curl.html %}

You can continue to use the existing `search.concurrent_segment_search.enabled` setting to enable concurrent segment search for all indexes in the cluster as follows:
```json
PUT _cluster/settings
{
   "persistent":{
      "search.concurrent_segment_search.enabled": true
   }
}
```
{% include copy-curl.html %}

To enable concurrent segment search for a particular index, specify the index name in the endpoint:

```json
PUT <index-name>/_settings
{
    "index.search.concurrent_segment_search.enabled": true
}
```
{% include copy-curl.html %}


When evaluating whether concurrent segment search is enabled on a cluster, the `search.concurrent_segment_search.mode` setting takes precedence over the `search.concurrent_segment_search.enabled` setting.
If the `search.concurrent_segment_search.mode` setting is not explicitly set, then the `search.concurrent_segment_search.enabled` setting will be evaluated to determine whether to enable concurrent segment search.

When upgrading a cluster from an earlier version that specifies the older `search.concurrent_segment_search.enabled` setting, this setting will continue to be honored. However, once the `search.concurrent_segment_search.mode` is set, it will override the previous setting, enabling or disabling concurrent search based on the specified mode.
We recommend setting `search.concurrent_segment_search.enabled` to `null` on your cluster once you configure `search.concurrent_segment_search.mode`:

```json
PUT _cluster/settings
{
   "persistent":{
      "search.concurrent_segment_search.enabled": null
   }
}
```
{% include copy-curl.html %}

To disable the old setting for a particular index, specify the index name in the endpoint:
```json
PUT <index-name>/_settings
{
    "index.search.concurrent_segment_search.enabled": null
}
```
{% include copy-curl.html %}

## Slicing mechanisms

You can choose one of two available mechanisms for assigning segments to slices: the default [max slice count mechanism](#the-max-slice-count-mechanism) or the [Lucene mechanism](#the-lucene-mechanism).

### The max slice count mechanism

The _max slice count_ mechanism is a slicing mechanism that uses a dynamically configurable maximum number of slices and divides segments among the slices in a round-robin fashion. This is useful when there are already too many top-level shard requests and you want to limit the number of slices per request in order to reduce competition between the slices.

Starting with OpenSearch version 3.0, concurrent segment search uses the max slice count mechanism by default. The max slice count is calculated at the cluster startup time using the formula `Math.max(1, Math.min(Runtime.getRuntime().availableProcessors() / 2, 4))`. You can override this value by explicitly setting the `max_slice_count` parameter at either the cluster level or index level. For more information about updating `max_slice_count`, see [Setting the slicing mechanism](#setting-the-slicing-mechanism). To revert back to the default calculated value, set `max_slice_count` to `null`. 

### The Lucene mechanism

The Lucene mechanism is an alternative to the max slice count mechanism. By default, Lucene assigns a maximum of 250K documents or 5 segments (whichever is met first) to each slice in a shard. For example, consider a shard with 11 segments. The first 5 segments have 250K documents each, and the next 6 segments have 20K documents each. The first 5 segments will be assigned to 1 slice each because they each contain the maximum number of documents allowed for a slice. Then the next 5 segments will all be assigned to another single slice because of the maximum allowed segment count for a slice. The 11th slice will be assigned to a separate slice. 

### Setting the slicing mechanism

You can set the slicing mechanism at the cluster level or index level by updating the `search.concurrent.max_slice_count` setting.

Both the cluster- and index-level `search.concurrent.max_slice_count` settings can take the following valid values:

- Positive integer: Use the max target slice count mechanism. Usually, a value between 2 and 8 should be sufficient.
- `0`: Use the Lucene mechanism.

To configure the slice count for all indexes in a cluster, use the following dynamic cluster setting:

```json
PUT _cluster/settings
{
   "persistent":{
      "search.concurrent.max_slice_count": 2
   }
}
```
{% include copy-curl.html %}

To configure the slice count for a particular index, specify the index name in the endpoint: 

```json
PUT <index-name>/_settings
{
    "index.search.concurrent.max_slice_count": 2
}
```
{% include copy-curl.html %}

## General guidelines

Concurrent segment search helps to improve the performance of search requests at the cost of consuming more resources, such as CPU or JVM heap. It is important to test your workload in order to understand whether the cluster is sized correctly for concurrent segment search. We recommend adhering to the following concurrent segment search guidelines:

* Start with a slice count of 2 and measure the performance of your workload. If resource utilization exceeds the recommended values, then consider scaling your cluster. Based on our testing, we have observed that if your workload is already consuming more than 50% of your CPU resources, then you need to scale your cluster for concurrent segment search.
* If your slice count is 2 and you still have available resources in the cluster, then you can increase the slice count to a higher number, such as 4 or 6, while monitoring search latency and resource utilization in the cluster. 
* When many clients send search requests in parallel, a lower slice count usually works better. This is reflected in CPU utilization because a higher number of clients leads to more queries per second, which translates to higher resource usage.

When upgrading to OpenSearch 3.0, be aware that workloads with aggregations may experience higher CPU utilization because concurrent search is enabled by default in `auto` mode. If your OpenSearch 2.x cluster's CPU utilization exceeds 25% when running aggregation workloads, consider the following options before upgrading:

- Plan to scale your cluster's resources to accommodate the increased CPU demand.
- Prepare to disable concurrent search if scaling is not feasible for your use case.

## Limitations

The following aggregations do not support the concurrent search model. If a search request contains one of these aggregations, the request will be executed using the non-concurrent path even if concurrent segment search is enabled at the cluster level or index level.
- Parent aggregations on [join]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/join/) fields. See [this GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/9316) for more information.
- `sampler` and `diversified_sampler` aggregations. See [this GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/11075) for more information.

## Other considerations

The following sections provide additional considerations for concurrent segment search.

### The `terminate_after` search parameter

The [`terminate_after` search parameter]({{site.url}}{{site.baseurl}}/api-reference/search/#query-parameters) is used to terminate a search request once a specified number of matching documents has been collected. If you include the `terminate_after` parameter in a request, concurrent segment search is disabled and the request is run in a non-concurrent manner.

Typically, queries are used with smaller `terminate_after` values and thus complete quickly because the search is performed on a reduced dataset. Therefore, concurrent search may not further improve performance in this case. Moreover, when `terminate_after` is used with other search request parameters, such as `track_total_hits` or `size`, it adds complexity and changes the expected query behavior. Falling back to a non-concurrent path for search requests that include `terminate_after` ensures consistent results between concurrent and non-concurrent requests.

### Sorting

Depending on the data layout of the segments, the sort optimization feature can prune entire segments based on the min and max values as well as previously collected values. If the top values are present in the first few segments and all other segments are pruned, query latency may increase when sorting with concurrent segment search. Conversely, if the last few segments contain the top values, then latency may improve with concurrent segment search.

### Terms aggregations

Non-concurrent search calculates the document count error and returns it in the `doc_count_error_upper_bound` response parameter. During concurrent segment search, the `shard_size` parameter is applied at the segment slice level. Because of this, concurrent search may introduce an additional document count error.

For more information about how `shard_size` can affect both `doc_count_error_upper_bound` and collected buckets, see [this GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/11680#issuecomment-1885882985).


## Developer information

The following sections provide additional information for developers.

### AggregatorFactory changes

Because of implementation details, not all aggregator types can support concurrent segment search. To accommodate this, we have introduced a [`supportsConcurrentSegmentSearch()`](https://github.com/opensearch-project/OpenSearch/blob/2.x/server/src/main/java/org/opensearch/search/aggregations/AggregatorFactory.java#L123) method in the `AggregatorFactory` class to indicate whether a given aggregation type supports concurrent segment search. By default, this method returns `false`. Any aggregator that needs to support concurrent segment search must override this method in its own factory implementation. 

To ensure that a custom plugin-based `Aggregator` implementation functions with the concurrent search path, plugin developers can verify their implementation with concurrent search enabled and then update the plugin to override the [`supportsConcurrentSegmentSearch()`](https://github.com/opensearch-project/OpenSearch/blob/2.x/server/src/main/java/org/opensearch/search/aggregations/AggregatorFactory.java#L123) method to return `true`.

### Pluggable concurrent search deciders: ConcurrentSearchRequestDecider

Introduced 2.17
{: .label .label-purple }

Plugin developers can customize the concurrent search decision-making for `auto` mode by extending [`ConcurrentSearchRequestDecider`](https://github.com/opensearch-project/OpenSearch/blob/2.x/server/src/main/java/org/opensearch/search/deciders/ConcurrentSearchRequestDecider.java) and registering its factory through [`SearchPlugin#getConcurrentSearchRequestFactories()`](https://github.com/opensearch-project/OpenSearch/blob/2.x/server/src/main/java/org/opensearch/plugins/SearchPlugin.java#L148). The deciders are evaluated only if a request does not belong to any category listed in the [Limitations](#limitations) and [Other considerations](#other-considerations) sections. For more information about the decider implementation, see [the corresponding GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/15259).
The search request is parsed using a `QueryBuilderVisitor`, which calls the [`ConcurrentSearchRequestDecider#evaluateForQuery()`](https://github.com/opensearch-project/OpenSearch/blob/2.x/server/src/main/java/org/opensearch/search/deciders/ConcurrentSearchRequestDecider.java#L36) method of all the configured deciders for every node of the `QueryBuilder` tree in the search request. The final concurrent search decision is obtained by combining the decision from each decider returned by the [`ConcurrentSearchRequestDecider#getConcurrentSearchDecision()`](https://github.com/opensearch-project/OpenSearch/blob/2.x/server/src/main/java/org/opensearch/search/deciders/ConcurrentSearchRequestDecider.java#L44) method.
