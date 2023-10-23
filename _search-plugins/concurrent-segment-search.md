---
layout: default
title: Concurrent segment search
nav_order: 53
---

# Concurrent segment search

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/2587) or the [project board](https://github.com/orgs/opensearch-project/projects/117/views/1).    
{: .warning}

Use concurrent segment search to search segments in parallel during the query phase. Cases in which concurrent segment search improves search latency include the following:

- When sending long-running requests, for example, requests that contain aggregations or large ranges
- As an alternative to force-merging segments into a single segment in order to improve performance

## Background

In OpenSearch, each search request follows the scatter-gather protocol. The coordinating node receives a search request, evaluates which shards are needed to serve this request, and sends a shard-level search request to each of those shards. Each shard that receives the request executes the request locally using Lucene and returns the results. The coordinating node merges the responses received from all shards and sends the search response back to the client. Optionally, the coordinating node can perform a fetch phase before returning the final results to the client if any document field or the entire document is requested by the client as part of the response.

## Searching segments concurrently

Without concurrent segment search, Lucene executes a request sequentially across all segments on each shard during the query phase. The query phase then collects the top hits for the search request. With concurrent segment search, each shard-level request will search the segments in parallel during the query phase. For each shard, the segments are divided into multiple _slices_. Each slice is the unit of work that can be executed in parallel on a separate thread, so the slice count determines the maximum degree of parallelism for a shard-level request. Once all the slices complete their work, Lucene performs a reduce operation on the slices, merging them and creating the final result for this shard-level request. Slices are executed using a new `index_searcher` thread pool, which is different from the `search` thread pool that handles shard-level requests.

## Enabling the feature flag

There are several methods for enabling concurrent segment search, depending on the installation type. 

### Enable in opensearch.yml

If you are running an OpenSearch cluster and want to enable concurrent segment search in the config file, add the following line to `opensearch.yml`:

```yaml
opensearch.experimental.feature.concurrent_segment_search.enabled: true
```
{% include copy.html %}

### Enable with Docker containers

If you’re running Docker, add the following line to `docker-compose.yml` under the `opensearch-node` > `environment` section:

```bash
OPENSEARCH_JAVA_OPTS="-Dopensearch.experimental.feature.concurrent_segment_search.enabled=true"
```
{% include copy.html %}

### Enable on a node using a tarball installation

To enable concurrent segment search on a tarball installation, provide the new JVM parameter either in `config/jvm.options` or `OPENSEARCH_JAVA_OPTS`.

#### OPTION 1: Modify jvm.options

Add the following lines to `config/jvm.options` before starting the `opensearch` process to enable the feature and its dependency:

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

As an alternative to directly modifying `config/jvm.options`, you can define the properties by using an environment variable. This can be done using a single command when you start OpenSearch or by defining the variable with `export`.

To add these flags inline when starting OpenSearch, run the following command:

```bash
OPENSEARCH_JAVA_OPTS="-Dopensearch.experimental.feature.concurrent_segment_search.enabled=true" ./opensearch-{{site.opensearch_version}}/bin/opensearch
```
{% include copy.html %}

If you want to define the environment variable separately prior to running OpenSearch, run the following commands:

```bash
export OPENSEARCH_JAVA_OPTS="-Dopensearch.experimental.feature.concurrent_segment_search.enabled=true"
```
{% include copy.html %}

```bash
./bin/opensearch
```
{% include copy.html %}

## Disabling concurrent search at the index or cluster level

After you enable the experimental feature flag, all search requests will use concurrent segment search during the query phase. To disable concurrent segment search for all indexes, set the following dynamic cluster setting:

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

You can choose one of two available mechanisms for assigning segments to slices: the default [Lucene mechanism](#the-lucene-mechanism) or the [max slice count mechanism](#the-max-slice-count-mechanism).

### The Lucene mechanism

By default, Lucene assigns a maximum of 250K documents or 5 segments (whichever is met first) to each slice in a shard. For example, consider a shard with 11 segments. The first 5 segments have 250K documents each, and the next 6 segments have 20K documents each. The first 5 segments will be assigned to 1 slice each because they each contain the maximum number of documents allowed for a slice. Then the next 5 segments will all be assigned to another single slice because of the maximum allowed segment count for a slice. The 11th slice will be assigned to a separate slice. 

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
- Positive integer: Use the max target slice count mechanism. Usually, a value between 2 and 8 should be sufficient.

## The `terminate_after` search parameter

The [`terminate_after` search parameter]({{site.url}}{{site.baseurl}}/api-reference/search/#url-parameters) is used to terminate a search request once a specified number of documents has been collected. If you include the `terminate_after` parameter in a request, concurrent segment search is disabled and the request is run in a non-concurrent manner.

Typically, queries are used with smaller `terminate_after` values and thus complete quickly because the search is performed on a reduced dataset. Therefore, concurrent search may not further improve performance in this case. Moreover, when `terminate_after` is used with other search request parameters, such as `track_total_hits` or `size`, it adds complexity and changes the expected query behavior. Falling back to a non-concurrent path for search requests that include `terminate_after` ensures consistent results between concurrent and non-concurrent requests.

## API changes

If you enable the concurrent segment search feature flag, the following Stats API responses will contain several additional fields with statistics about slices:

- [Index Stats]({{site.url}}{{site.baseurl}}/api-reference/index-apis/stats/)
- [Nodes Stats]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-stats/)

For descriptions of the added fields, see [Index Stats API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/stats#concurrent-segment-search).

Additionally, some [Profile API]({{site.url}}{{site.baseurl}}/api-reference/profile/) response fields will be modified and others added. For more information, see the [concurrent segment search section of the Profile API]({{site.url}}{{site.baseurl}}/api-reference/profile#concurrent-segment-search).

## Limitations

Parent aggregations on [join]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/join/) fields do not support the concurrent search model. Thus, if a search request contains a parent aggregation, the aggregation will be executed using the non-concurrent path even if concurrent segment search is enabled at the cluster level.

## Developer information: AggregatorFactory changes

Because of implementation details, not all aggregator types can support concurrent segment search. To accommodate this, we have introduced a [`supportsConcurrentSegmentSearch()`](https://github.com/opensearch-project/OpenSearch/blob/bb38ed4836496ac70258c2472668325a012ea3ed/server/src/main/java/org/opensearch/search/aggregations/AggregatorFactory.java#L121) method in the `AggregatorFactory` class to indicate whether a given aggregation type supports concurrent segment search. By default, this method returns `false`. Any aggregator that needs to support concurrent segment search must override this method in its own factory implementation. 

To ensure that a custom plugin-based `Aggregator` implementation works with the concurrent search path, plugin developers can verify their implementation with concurrent search enabled and then update the plugin to override the [`supportsConcurrentSegmentSearch()`](https://github.com/opensearch-project/OpenSearch/blob/bb38ed4836496ac70258c2472668325a012ea3ed/server/src/main/java/org/opensearch/search/aggregations/AggregatorFactory.java#L121) method to return `true`.
