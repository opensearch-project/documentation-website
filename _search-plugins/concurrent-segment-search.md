---
layout: default
title: Concurrent segment search
nav_order: 53
---

# Concurrent segment search

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/2587) or the [project board](https://github.com/orgs/opensearch-project/projects/117/views/1).    
{: .warning}

Use concurrent segment search to search the segments in parallel during query phase. Some cases in which concurrent segment search improves search latency include the following:

- When sending long-running requests, for example, requests that contain aggregations or large ranges.
- As an alternative to force-merging segments into a single segment in order to improve performance.

## Background

In OpenSearch, each search request follows the scatter-gather protocol. The coordinating node receives a search request, evaluates which shards are needed to serve this request, and sends a shard-level search request to each of those shards. Each shard that receives the request executes the request locally using Lucene and returns the results. The coordinating node merges the responses received from all shards and sends the search response back to the client. Optionally, the coordinating node can perform a fetch phase before returning the final results to the client if any document field or the entire document is requested by the client as part of response.

## Searching segments concurrently

Without concurrent segment search, Lucene executes a request sequentially across all segments on each shard during query phase. The query phase then collects the top hits for the search request. With concurrent segment search, each shard-level request will search the segments in parallel during query phase. For each shard, the segments are divided into multiple _slices_. Each _slice_ is the unit of work which can be executed in parallel on a separate thread, thus the slice count determines the maximum degree of parallelism for a shard-level request. Once all the slices complete their work, Lucene performs a reduce operation on the slices, merging them and creating the final result for this shard-level request. Slices are executed using a new `index_searcher` thread pool, which is different from the `search` thread pool that handles shard-level requests.

## Enabling the feature flag

There are several methods for enabling concurrent segment search, depending on the install type. 

### Enable in opensearch.yml

If you are running an OpenSearch cluster and want to enable concurrent segment search in the config file, add the following line to `opensearch.yml`:

```yaml
opensearch.experimental.feature.concurrent_segment_search.enabled=true
```
{% include copy.html %}

### Enable with Docker containers

If you’re running Docker, add the following line to `docker-compose.yml` under the `opensearch-node` > `environment` section:

```bash
OPENSEARCH_JAVA_OPTS="-Dopensearch.experimental.feature.concurrent_segment_search.enabled=true"
```
{% include copy.html %}

### Enable on a node using a tarball install

To enable concurrent segment search on a tarball install, provide the new JVM parameter either in `config/jvm.options` or `OPENSEARCH_JAVA_OPTS`.

#### OPTION 1: Modify jvm.options

Add the following lines to `config/jvm.options` before starting the OpenSearch process to enable the feature and its dependency:

```bash
-Dopensearch.experimental.feature.concurrent_segment_search.enabled=true
```
{% include copy.html %}

Then run OpenSearch:

```bash
./bin/opensearch
```
{% include copy.html %}

#### OPTION 2: Enable with an environment variable

As an alternative to directly modifying `config/jvm.options`, you can define the properties by using an environment variable. This can be done in a single command when you start OpenSearch or by defining the variable with `export`.

To add these flags in-line when starting OpenSearch, run the following command:


```bash
OPENSEARCH_JAVA_OPTS="-Dopensearch.experimental.feature.concurrent_segment_search.enabled=true" ./opensearch-{{site.opensearch_version}}/bin/opensearch
```
{% include copy.html %}

If you want to define the environment variable separately, prior to running OpenSearch, run the following commands:

```bash
export OPENSEARCH_JAVA_OPTS="-Dopensearch.experimental.feature.concurrent_segment_search.enabled=true"
```
{% include copy.html %}

```bash
./bin/opensearch
```
{% include copy.html %}

## Disabling concurrent search at index or cluster level

After you enable the experimental feature flag, all search requests will use concurrent segment search during query phase. To disable concurrent segment search for all indexes, set following dynamic cluster setting:


```json
PUT _cluster/settings
{
   "persistent":{
      "search.concurrent_segment_search.enabled": false
   }
}
```
{% include copy-curl.html %}

To disable concurrent segment search for a particular index, specify the index name in the endpoint:

```json
PUT <index-name>/_settings
{
    "index.search.concurrent_segment_search.enabled": false
}
```
{% include copy-curl.html %}

## Slicing mechanisms

You can choose one of the two available mechanisms of assigning segments to slices: the default [Lucene mechanism](#the-lucene-mechanism) or the [max slice count mechanism](#the-max-slice-count-mechanism).

### The Lucene mechanism

By default, Lucene assigns a maximum of 250 K documents or 5 segments (whichever is met first) to each slice in a shard. For example, consider a shard with 11 segments. The first 5 segments have 250 K documents each and the next 6 segments have 20 K documents each. The first 5 segments will be assigned to one slice each because they each contain the maximum allowed document count for a slice. Then the next 5 segments will all be assigned to another single slice because of the maximum allowed segment count for a slice. The 11th slice will be assigned to a separate slice. 

### The max slice count mechanism

The _max slice count_ mechanism is an alternative slicing mechanism that uses a statically configured maximum number of slices and divides segments among the slices in a round-robin fashion. This is useful when there are already too many top-level shard requests and you want to limit the number of slices per request in order to reduce competition between the slices.

### Setting the slicing mechanism

By default, concurrent segment search uses the Lucene mechanism to calculate the number of slices for each shard-level request. To use the max slice count mechanism instead, configure the `search.concurrent.max_slice_count` static setting in the `opensearch.yml` config file:

```yaml
search.concurrent.max_slice_count: 2
```
{% include copy.html %}

The `search.concurrent.max_slice_count` setting can take the following valid values:
- `0`: Use the default Lucene mechanism.
- Positive integer: Use the max target slice count mechanism. Usually, a value 2--8 should be sufficient.

## The `terminate_after` search parameter

The [`terminate_after` search parameter]({{site.url}}{{site.baseurl}}/api-reference/search/#url-parameters) is used to terminate a search request once a specified number of docs has been collected. In the non-concurrent search workflow, this count is evaluated at each shard. However, for the concurrent search workflow, it is evaluated at each leaf slice instead in order to avoid synchronizing document counts between threads. In the concurrent search case, the request performs more work than expected because each segment slice on the shard collects up to the specified number of docs. The intent to terminate collection after the threshold is reached is evaluated at slice level. Thus, the hit count in the results will be greater than the `terminate_after` threshold but less than `slice_count * terminate_after`. The actual number of returned hits will be controlled by the `size` parameter.

## API changes

If you enable the concurrent segment search feature flag, the following stats API responses will contain several additional fields with statistics about slices:

- [Index Stats]({{site.url}}{{site.baseurl}}/api-reference/index-apis/stats/)
- [Nodes Stats]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-stats/)

For the descriptions of the added fields, see [Index Stats API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/stats#concurrent-segment-search).

Additionally, for the [Profile API], some response fields will be modified and others added. For more information, see the [concurrent segment search section of the Profile API]({{site.url}}{{site.baseurl}}/api-reference/profile/).

## Limitations

Parent aggregations on [join]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/join/) fields do not support the concurrent search model. Thus, if a search request contains a parent aggregation, the aggregation will be executed using the non-concurrent path even if concurrent segment search is enabled at cluster level.

## Developer information: AggregatorFactory changes

Because of implementation details, not all aggregator types can support concurrent segment search. To accommodate this, we have introduced a new [`supportsConcurrentSegmentSearch()`](https://github.com/opensearch-project/OpenSearch/blob/bb38ed4836496ac70258c2472668325a012ea3ed/server/src/main/java/org/opensearch/search/aggregations/AggregatorFactory.java#L121) method in the `AggregatorFactory` class to indicate whether a given aggregation type supports concurrent segment search. By default, this method returns `false`. Any aggregator that needs to support concurrent segment search must override this method in its own factory implementation. 

To ensure that a custom plugin-based `Aggregator` implementation works with the concurrent search path, plugin developers can verify their implementation with concurrent search enabled and then update the plugin to override the [`supportsConcurrentSegmentSearch()`](https://github.com/opensearch-project/OpenSearch/blob/bb38ed4836496ac70258c2472668325a012ea3ed/server/src/main/java/org/opensearch/search/aggregations/AggregatorFactory.java#L121) method to return `true`.
