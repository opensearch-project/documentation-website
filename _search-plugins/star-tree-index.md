---
layout: default
title: Star Tree index
parent: Improving search performance
nav_order: 54
---

# Star tree index

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

Star Tree Index is a multi-field index that improves the performance of aggregations.

OpenSearch will use the star-tree index to optimize aggregations based on the input query and star-tree configuration. No changes are required in the query syntax or requests.

## Star tree index structure

<img src="{{site.url}}{{site.baseurl}}/images/star-tree-index.png" alt="A Star Tree index containing two dimensions and two metrics" width="700">

Star Tree index structure as portrayed in the above figure, consists of mainly two parts: Star Tree and sorted and aggregated star-tree documents backed by doc-values indexes.

Each node in the Star Tree points to a range of star-tree documents.
A node is further split into child nodes based on [max_leaf_docs configuration]({{site.url}}{{site.baseurl}}/field-types/star-tree/#star-tree-configuration-parameters).
The number of documents a leaf node points to is than or equal to `max_leaf_docs`. This ensures the maximum number of documents that gets traversed to get to the aggregated value is at most `max_leaf_docs`, thus providing predictable latencies.

There are special nodes called `star nodes (*)` which helps in skipping non-competitive nodes and also in fetching aggregated document wherever applicable during query time.

The figure contains three examples explaining the Star Tree traversal during query: 
- Compute average request size aggregation with Terms query where port equals 8443 and status equals 200 (Support for Terms query will be added in upcoming release)
- Compute count of requests aggregation with Term query where status equals 200 (query traverses through * node of `port` dimension since `port` is not present as part of query) 
- Compute average request size aggregation with Term query where port equals 5600 (query traverses through * node of `status` dimension since `status` is not present as part of query). 
<br/>The second and third examples uses star nodes.


## When to use star tree index
You can be use Star Tree index to perform faster aggregations with a constant upper bound on query latency.
- Star Tree natively supports multi field aggregations
- Star Tree index will be created in real time as part of regular indexing, so the data in Star Tree will always be up to date with the live data.
- Star Tree index consolidates the data and hence is a storage efficient index which results in efficient paging and fraction of IO utilization for search queries. 

## Considerations
- Star Tree index ideally should be used with append-only indices, as updates or deletes are not accounted in Star Tree index.
- Star Tree index will be used for aggregation queries only if the query input is a subset of the Star Tree configuration of dimensions and metrics
- Once star-tree index is enabled for an index, you currently cannot disable it. You have to reindex without the star-tree mapping to remove star-tree from the index.
    - Changing Star Tree configuration will also require a re-index operation.
- [Multi-values/array values]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/index/#arrays) are not supported
- Only [limited queries and aggregations](#supported-query-and-aggregations) are supported with support for more coming in future
- The cardinality of the dimensions should not be very high (like "_id" fields), otherwise it leads to storage explosion and higher query latencies.

## Enabling star tree index
- Set the feature flag `opensearch.experimental.feature.composite_index.star_tree.enabled"` to `true`. For more information about enabling and disabling feature flags, see [Enabling experimental features]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/experimental/).
- Set the `indices.composite_index.star_tree.enabled` setting to `true`. For instructions on how to configure OpenSearch, see [configuring settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/#static-settings).
- Set the `index.composite_index` index setting to `true` during index creation.

## Examples

The following examples show how to use star-tree index.

### Defining star tree index in mappings

Define star-tree configuration in index mappings when creating an index. <br/>
To create star-tree index to pre-compute aggregations for `request_size` and `latency` fields for all the combinations of values in `port` and `status` fields indexed in the `logs` index, configure the following mapping:

```json
PUT logs
{
  "settings": {
    "index.number_of_shards": 1,
    "index.number_of_replicas": 0,
    "index.composite_index": true
  },
  "mappings": {
    "composite": {
      "startree1": {
        "type": "star_tree",
        "config": {
          "ordered_dimensions": [
            {
              "name": "status"
            },
            {
              "name": "port"
            }
          ],
          "metrics": [
            {
              "name": "request_size",
              "stats": [
                "sum",
                "value_count",
                "min",
                "max"
              ],
              "name": "latency",
              "stats": [
                "sum",
                "value_count",
                "min",
                "max"
              ]
            }
          ]
        }
      }
    },
    "properties": {
      "status": {
        "type": "integer"
      },
      "port": {
        "type": "integer"
      },
      "request_size": {
        "type": "integer"
      },
      "latency": {
        "type": "scaled_float",
        "scaling_factor": 10
      }
    }
  }
}
```

For detailed information about Star Tree index mapping and parameters see [Star Tree field type]({{site.url}}{{site.baseurl}}/field-types/star-tree/).

## Supported query and aggregations

Star Tree index can be used to optimize aggregations for selected set of queries with support for more coming in upcoming releases.

### Supported queries
Ensure the following in star tree index mapping,
- The fields present in the query must be present as part of `ordered_dimensions` as part of star-tree configuration.

The following queries are supported [ when supported aggregations are specified ] <br/>

- [Term query](https://opensearch.org/docs/latest/query-dsl/term/term/)
- [Match all docs query](https://opensearch.org/docs/latest/query-dsl/match-all/)

### Supported aggregations
Ensure the following in star tree index mapping,
- The fields present in the aggregation must be present as part of `metrics` as part of star-tree configuration.
- The metric aggregation type must be part of `stats` parameter.
 
Following metric aggregations are supported.
- [Sum](https://opensearch.org/docs/latest/aggregations/metric/sum/)
- [Minimum](https://opensearch.org/docs/latest/aggregations/metric/minimum/)
- [Maximum](https://opensearch.org/docs/latest/aggregations/metric/maximum/)
- [Value count](https://opensearch.org/docs/latest/aggregations/metric/value-count/)
- [Average](https://opensearch.org/docs/latest/aggregations/metric/average/)

### Examples
To get sum of `request_size` for all error logs with `status=500` with the [example mapping](#defining-star-tree-index-in-mappings) :
```json
POST /logs/_search
{
  "query": {
    "term": {
      "status": "500"
    }
  },
  "aggs": {
    "sum_request_size": {
      "sum": {
        "field": "request_size"
      }
    }
  }
}
```

This query will get optimized automatically as star-tree index will be used.

You can set the `indices.composite_index.star_tree.enabled` setting to `false` to run queries without using star-tree index.