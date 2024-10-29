---
layout: default
title: Star Tree index
parent: Improving search performance
nav_order: 54
---

# Star tree index

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

Star Tree Index (STIX) is a multi-field index that improves the performance of aggregations.

OpenSearch will automatically use the STIX to optimize aggregations if the fields queried are part of STIX dimension fields and the aggregations are on STIX metrics fields. No changes are required in the query syntax or the request parameters.

## Star tree index structure

<img src="{{site.url}}{{site.baseurl}}/images/star-tree-index.png" alt="A Star Tree index containing two dimensions and two metrics" width="700">

Star Tree index structure as portrayed in the above figure, consists of mainly two parts:
- Star Tree and 
- Sorted and aggregated Star Tree documents backed by doc-values indexes
    - The values are sorted based on the order of `ordered_dimension`, in the above example, first by `status` and then by `port` for each of the status.
    -  For each of the unique dimension value combinations, the aggregated values for all the metrics such as `avg(size)` and `count(requests)` are pre-computed during ingestion time.

Each node in the Star Tree points to a range of Star Tree documents.
A node is further split into child nodes based on [max_leaf_docs configuration]({{site.url}}{{site.baseurl}}/field-types/star-tree/#star-tree-configuration-parameters).
The number of documents a leaf node points to is less than or equal to `max_leaf_docs`. This ensures the maximum number of documents that gets traversed to get to the aggregated value is at most `max_leaf_docs`, thus providing predictable latency.

There are special nodes called `star nodes (*)` which helps in skipping non-competitive nodes and also in fetching aggregated document wherever applicable during query time.

The figure contains three examples explaining the Star Tree traversal during query: 
- Compute average request size aggregation with Terms query where port equals 8443 and status equals 200 (Support for Terms query will be added in upcoming release, see [GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/15257))
- Compute count of requests aggregation with Term query where status equals 200 (query traverses through * node of `port` dimension since `port` is not present as part of query) 
- Compute average request size aggregation with Term query where port equals 5600 (query traverses through * node of `status` dimension since `status` is not present as part of query). 
<br/>The second and third examples uses star nodes.


## When to use star tree index
Star Tree index can be used to perform faster aggregations with a constant upper bound on query latency.
- Star Tree natively supports multi field aggregations
- Star Tree index will be created in real time as part of indexing, so the data in Star Tree will always be up to date.
- Star Tree index consolidates the data and hence it is storage efficient. It helps in efficient paging and lesser IO utilization for search queries.

## Considerations
- STIX should only be used on indexes whose data is not updated or deleted, as updates and/or deletes are not accounted in STIX.
- Star Tree index will be used for aggregation queries only if the fields getting queried is a subset of the Star Tree's dimensions and fields getting aggregated is a subset of Start Tree's metrics
- Once Star Tree index is enabled for an index, it cannot be disabled. The data has to be re-indexed without the Star Tree mapping to remove Star Tree from the index.
    - Changing Star Tree configuration will also require a re-index operation.
- [Multi-values/array values]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/index/#arrays) are not supported
- Only [limited queries and aggregations](#supported-query-and-aggregations) are supported currently. Support for more features will be released in upcoming versions.
- The cardinality of the dimensions should not be very high (like `_id` fields), otherwise it leads to high storage usage and higher query latency.

## Enabling star tree index
- Set the feature flag `opensearch.experimental.feature.composite_index.star_tree.enabled"` to `true`. For more information about enabling and disabling feature flags, see [Enabling experimental features]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/experimental/).
- Set the `indices.composite_index.star_tree.enabled` setting to `true`. For instructions on how to configure OpenSearch, see [configuring settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/#static-settings).
- Set the `index.composite_index` index setting to `true` during index creation.

## Examples

The following examples show how to use Star Tree index.

### Defining star tree index in mappings

Define Star Tree configuration in index mappings when creating an index. <br/>
To create Star Tree index to pre-compute aggregations for `size` and `latency` fields for all the combinations of values in `port` and `status` fields indexed in the `logs` index, configure the following mapping:

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
      "request_aggs": {
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
              "name": "size",
              "stats": [
                "sum"
              ]
            },
            {
              "name": "latency",
              "stats": [
                "avg"
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
      "size": {
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

Star Tree index can be used to optimize aggregations. The list of supported queries is given below, support for more queries will be added in upcoming releases (see [GitHub issue](https://github.com/opensearch-project/OpenSearch/issues/15257)).

### Supported queries
The following queries are supported as of OpenSearch 2.18 [ when supported aggregations are specified ] <br/>

- [Term query](https://opensearch.org/docs/latest/query-dsl/term/term/)
- [Match all docs query](https://opensearch.org/docs/latest/query-dsl/match-all/)

Ensure the following in star tree index mapping,
- The fields present in the query must be present as part of `ordered_dimensions` as part of Star Tree configuration.

### Supported aggregations
 
Following metric aggregations are supported as of OpenSearch 2.18.
- [Sum](https://opensearch.org/docs/latest/aggregations/metric/sum/)
- [Minimum](https://opensearch.org/docs/latest/aggregations/metric/minimum/)
- [Maximum](https://opensearch.org/docs/latest/aggregations/metric/maximum/)
- [Value count](https://opensearch.org/docs/latest/aggregations/metric/value-count/)
- [Average](https://opensearch.org/docs/latest/aggregations/metric/average/)

Ensure the following in Star Tree index mapping,
- The fields present in the aggregation must be present as part of `metrics` as part of Star Tree configuration.
- The metric aggregation type must be part of `stats` parameter.

### Examples
To get sum of `size` for all error logs with `status=500` with the [example mapping](#defining-star-tree-index-in-mappings) :
```json
POST /logs/_search
{
  "query": {
    "term": {
      "status": "500"
    }
  },
  "aggs": {
    "sum_size": {
      "sum": {
        "field": "size"
      }
    }
  }
}
```

This query will get optimized automatically as Star Tree index will be used.
<br/>With Star Tree index, the result will be retrieved from a single aggregated document as it traverses to the `status=500` node as opposed to current query execution which scans through all the matching documents and perform summation.
<br/>This will result in lower query latency.

You can set the `indices.composite_index.star_tree.enabled` setting to `false` to run queries without using Star Tree index.