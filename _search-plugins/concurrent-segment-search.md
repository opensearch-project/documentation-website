---
layout: default
title: Concurrent segment search
nav_order: 53
---

# Concurrent segment search

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/2587).    
{: .warning}

## Background

In OpenSearch, each search request follows the scatter-gather protocol. The coordinating node receives a search request, evaluates which shards are needed to serve this request, and sends a shard-level search request to each of those shards. Each shard that receives the request executes the request locally using Lucene and returns the results. The coordinating node merges the responses received from all shards and sends the search response back to the client. Optionally, the coordinating node can perform a fetch phase before returning the final results to the client if any document field or the entire document is requested by the client as part of response.

## Running requests concurrently

By default, during query phase, Lucene executes the request _sequentially_ across all segments on each shard. The query phase then collects the top hits for the search request. With concurrent segment search, each shard-level request will search the segments in parallel during query phase. For each shard, the segments are divided into multiple work units called _slices._ Each _slice_ is the unit of work which can be executed in parallel on a separate thread, thus slice count determines the maximum degree of parallelism for a shard-level request. Once all the slices complete their work, Lucene performs a reduce operation on the slices to merge them and create the final result for this shard-level request. Slices are executed using a new thread pool _index_searcher_, which is different from the _search_ thread pool that handles shard-level requests. 

By default, Lucene assigns a maximum of 250 K documents or 5 segments (whichever is met first) to each slice in a shard. For example, consider a shard with 11 segments. The first 5 segments have 250 K documents each and the next 6 segments have 20 K documents each. The first 5 segments will be assigned to one slice each because they each contain the maximum allowed document count for a slice. Then the next 5 segments will all be assigned to another slice because of the maximum allowed segment count for a slice. The 11th slice will be assigned to a separate slice. In OpenSearch, there is an additional slicing mechanism (_max target slice count_) that uses a statically configured max slice limit and divides segments among them in a round-robin fashion . This is useful for cases where there are already too many top-level shard requests and you want to limit the number of slices per request in order to reduce the contention and higher percentile latencies.

## Enabling the feature flag

There are several methods for enabling concurrent segment search, depending on the install type. 

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

### Enable with Docker containers

If you’re running Docker, add the following line to `docker-compose.yml` under the `opensearch-node` > `environment` section:

```bash
OPENSEARCH_JAVA_OPTS="-Dopensearch.experimental.feature.concurrent_segment_search.enabled=true"
```
{% include copy.html %}

### Enable in opensearch.yml

If you are running an OpenSearch cluster and want to enable concurrent segment search using the `opensearch.yml` config file, add the following line:

```yaml
opensearch.experimental.feature.concurrent_segment_search.enabled=true
```
{% include copy.html %}


By default, concurrent segment search will use the Lucene mechanism described in the previous section to calculate the number of slices for each shard-level request. To use the max target slice count mechanism instead, configure the `search.concurrent.max_slice_count` static setting in the `opensearch.yml` config file:

```yaml
search.concurrent.max_slice_count=<target slice count>
```
{% include copy.html %}

The `search.concurrent.max_slice_count` setting can take the following valid values:
- `0`: Fall back to the default Lucene mechanism.
- Positive integer: Use the max target slice count mechanism. Usually, a value 2--8 should be sufficient.

## Disabling concurrent search for an index or all indexes

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


## API changes

With concurrent segment search, if you send a search request, OpenSearch adds a slice-level breakdown in the search response if the `profile` option is set to `true`. 

#### Example search response with profile = true

The following is an example response for a concurrent search with 3 segment slices:

<details closed markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 76,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 5,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "idx",
        "_id": "R0P4cIoBw-T1eu53lQDS",
        "_score": 1,
        "_source": {
          "string_field": "rwRYhBoBvF",
          "number": 4,
          "tag": "less"
        }
      },
      {
        "_index": "idx",
        "_id": "S0P4cIoBw-T1eu53lQDf",
        "_score": 1,
        "_source": {
          "string_field": "LETllfnHeK",
          "number": 7,
          "tag": "less"
        }
      },
      {
        "_index": "idx",
        "_id": "SUP4cIoBw-T1eu53lQDe",
        "_score": 1,
        "_source": {
          "string_field": "rwRYhBoBvF",
          "number": 5,
          "tag": "more"
        }
      },
      {
        "_index": "idx",
        "_id": "SEP4cIoBw-T1eu53lQDd",
        "_score": 1,
        "_source": {
          "string_field": "rwRYhBoBvF",
          "number": 7,
          "tag": "more"
        }
      },
      {
        "_index": "idx",
        "_id": "SkP4cIoBw-T1eu53lQDf",
        "_score": 1,
        "_source": {
          "string_field": "RkeSDVrerp",
          "number": 5,
          "tag": "more"
        }
      }
    ]
  },
  "aggregations": {
    "histo": {
      "buckets": [
        {
          "key": 4,
          "doc_count": 1
        },
        {
          "key": 5,
          "doc_count": 2
        },
        {
          "key": 6,
          "doc_count": 0
        },
        {
          "key": 7,
          "doc_count": 2
        }
      ]
    }
  },
  "profile": {
    "shards": [
      {
        "id": "[Sn2zHhcMTRetEjXvppU8bA][idx][0]",
        "inbound_network_time_in_millis": 0,
        "outbound_network_time_in_millis": 0,
        "searches": [
          {
            "query": [
              {
                "type": "MatchAllDocsQuery",
                "description": "*:*",
                "time_in_nanos": 429246,
                "breakdown": {
                  "set_min_competitive_score_count": 0,
                  "match_count": 0,
                  "shallow_advance_count": 0,
                  "set_min_competitive_score": 0,
                  "next_doc": 5485,
                  "match": 0,
                  "next_doc_count": 5,
                  "score_count": 5,
                  "compute_max_score_count": 0,
                  "compute_max_score": 0,
                  "advance": 3350,
                  "advance_count": 3,
                  "score": 5920,
                  "build_scorer_count": 6,
                  "create_weight": 429246,
                  "shallow_advance": 0,
                  "create_weight_count": 1,
                  "build_scorer": 2221054
                }
              }
            ],
            "rewrite_time": 12442,
            "collector": [
              {
                "name": "QueryCollectorManager",
                "reason": "search_multi",
                "time_in_nanos": 6786930,
                "reduce_time_in_nanos": 5892759,
                "max_slice_time_in_nanos": 5951808,
                "min_slice_time_in_nanos": 5798174,
                "avg_slice_time_in_nanos": 5876588,
                "slice_count": 3,
                "children": [
                  {
                    "name": "SimpleTopDocsCollectorManager",
                    "reason": "search_top_hits",
                    "time_in_nanos": 1340186,
                    "reduce_time_in_nanos": 1084060,
                    "max_slice_time_in_nanos": 457165,
                    "min_slice_time_in_nanos": 433706,
                    "avg_slice_time_in_nanos": 443332,
                    "slice_count": 3
                  },
                  {
                    "name": "NonGlobalAggCollectorManager: [histo]",
                    "reason": "aggregation",
                    "time_in_nanos": 5366791,
                    "reduce_time_in_nanos": 4637260,
                    "max_slice_time_in_nanos": 4526680,
                    "min_slice_time_in_nanos": 4414049,
                    "avg_slice_time_in_nanos": 4487122,
                    "slice_count": 3
                  }
                ]
              }
            ]
          }
        ],
        "aggregations": [
          {
            "type": "NumericHistogramAggregator",
            "description": "histo",
            "time_in_nanos": 16454372,
            "max_slice_time_in_nanos": 7342096,
            "min_slice_time_in_nanos": 4413728,
            "avg_slice_time_in_nanos": 5430066,
            "breakdown": {
              "min_build_leaf_collector": 4320259,
              "build_aggregation_count": 3,
              "post_collection": 9942,
              "max_collect_count": 2,
              "initialize_count": 3,
              "reduce_count": 0,
              "avg_collect": 146319,
              "max_build_aggregation": 2826399,
              "avg_collect_count": 1,
              "max_build_leaf_collector": 4322299,
              "min_build_leaf_collector_count": 1,
              "build_aggregation": 3038635,
              "min_initialize": 1057,
              "max_reduce": 0,
              "build_leaf_collector_count": 3,
              "avg_reduce": 0,
              "min_collect_count": 1,
              "avg_build_leaf_collector_count": 1,
              "avg_build_leaf_collector": 4321197,
              "max_collect": 181266,
              "reduce": 0,
              "avg_build_aggregation": 954896,
              "min_post_collection": 1236,
              "max_initialize": 11603,
              "max_post_collection": 5350,
              "collect_count": 5,
              "avg_post_collection": 2793,
              "avg_initialize": 4860,
              "post_collection_count": 3,
              "build_leaf_collector": 4322299,
              "min_collect": 78519,
              "min_build_aggregation": 8543,
              "initialize": 11971068,
              "max_build_leaf_collector_count": 1,
              "min_reduce": 0,
              "collect": 181838
            },
            "debug": {
              "total_buckets": 1
            }
          }
        ]
      }
    ]
  }
}
```
</details>
