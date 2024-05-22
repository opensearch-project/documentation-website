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

By default, concurrent segment search is disabled on the cluster. You can enable concurrent segment search at two levels:

- Cluster level
- Index level

The index-level setting takes priority over the cluster-level setting. Thus, if the cluster setting is enabled but the index setting is disabled, then concurrent segment search will be disabled for that index. Because of this, the index-level setting is not evaluated unless it is explicitly set, regardless of the default value configured for the setting. You can retrieve the current value of the index-level setting by calling the [Index Settings API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/get-settings/) and omitting the `?include_defaults` query parameter.
{: .note}

To enable concurrent segment search for all indexes in the cluster, set the following dynamic cluster setting:

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

## Slicing mechanisms

You can choose one of two available mechanisms for assigning segments to slices: the default [Lucene mechanism](#the-lucene-mechanism) or the [max slice count mechanism](#the-max-slice-count-mechanism).

### The Lucene mechanism

By default, Lucene assigns a maximum of 250K documents or 5 segments (whichever is met first) to each slice in a shard. For example, consider a shard with 11 segments. The first 5 segments have 250K documents each, and the next 6 segments have 20K documents each. The first 5 segments will be assigned to 1 slice each because they each contain the maximum number of documents allowed for a slice. Then the next 5 segments will all be assigned to another single slice because of the maximum allowed segment count for a slice. The 11th slice will be assigned to a separate slice. 

### The max slice count mechanism

The _max slice count_ mechanism is an alternative slicing mechanism that uses a dynamically configurable maximum number of slices and divides segments among the slices in a round-robin fashion. This is useful when there are already too many top-level shard requests and you want to limit the number of slices per request in order to reduce competition between the slices.

### Setting the slicing mechanism

By default, concurrent segment search uses the Lucene mechanism to calculate the number of slices for each shard-level request. To use the max slice count mechanism instead, configure the `search.concurrent.max_slice_count` cluster setting:

```json
PUT _cluster/settings
{
   "persistent":{
      "search.concurrent.max_slice_count": 2
   }
}
```
{% include copy-curl.html %}

The `search.concurrent.max_slice_count` setting can take the following valid values:
- `0`: Use the default Lucene mechanism.
- Positive integer: Use the max target slice count mechanism. Usually, a value between 2 and 8 should be sufficient.

## Limitations

The following aggregations do not support the concurrent search model. If a search request contains one of these aggregations, the request will be executed using the non-concurrent path even if concurrent segment search is enabled at the cluster level or index level.
- Parent aggregations on [join]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/join/) fields. See [this GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/9316) for more information.
- `sampler` and `diversified_sampler` aggregations. See [this GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/11075) for more information.
- Composite aggregations that use scripts. See [this GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/12947) for more information. Composite aggregations without scripts do support concurrent segment search.

## Other considerations

The following sections provide additional considerations for concurrent segment search.

### The `terminate_after` search parameter

The [`terminate_after` search parameter]({{site.url}}{{site.baseurl}}/api-reference/search/#url-parameters) is used to terminate a search request once a specified number of documents has been collected. If you include the `terminate_after` parameter in a request, concurrent segment search is disabled and the request is run in a non-concurrent manner.

Typically, queries are used with smaller `terminate_after` values and thus complete quickly because the search is performed on a reduced dataset. Therefore, concurrent search may not further improve performance in this case. Moreover, when `terminate_after` is used with other search request parameters, such as `track_total_hits` or `size`, it adds complexity and changes the expected query behavior. Falling back to a non-concurrent path for search requests that include `terminate_after` ensures consistent results between concurrent and non-concurrent requests.

### Sorting

Depending on the data layout of the segments, the sort optimization feature can prune entire segments based on the min and max values as well as previously collected values. If the top values are present in the first few segments and all other segments are pruned, query latency may increase when sorting with concurrent segment search. Conversely, if the last few segments contain the top values, then latency may improve with concurrent segment search.

### Terms aggregations

Non-concurrent search calculates the document count error and returns it in the `doc_count_error_upper_bound` response parameter. During concurrent segment search, the `shard_size` parameter is applied at the segment slice level. Because of this, concurrent search may introduce an additional document count error.

For more information about how `shard_size` can affect both `doc_count_error_upper_bound` and collected buckets, see [this GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/11680#issuecomment-1885882985).


## Developer information: AggregatorFactory changes

Because of implementation details, not all aggregator types can support concurrent segment search. To accommodate this, we have introduced a [`supportsConcurrentSegmentSearch()`](https://github.com/opensearch-project/OpenSearch/blob/bb38ed4836496ac70258c2472668325a012ea3ed/server/src/main/java/org/opensearch/search/aggregations/AggregatorFactory.java#L121) method in the `AggregatorFactory` class to indicate whether a given aggregation type supports concurrent segment search. By default, this method returns `false`. Any aggregator that needs to support concurrent segment search must override this method in its own factory implementation. 

To ensure that a custom plugin-based `Aggregator` implementation works with the concurrent search path, plugin developers can verify their implementation with concurrent search enabled and then update the plugin to override the [`supportsConcurrentSegmentSearch()`](https://github.com/opensearch-project/OpenSearch/blob/bb38ed4836496ac70258c2472668325a012ea3ed/server/src/main/java/org/opensearch/search/aggregations/AggregatorFactory.java#L121) method to return `true`.
