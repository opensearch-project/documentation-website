---
layout: default
title: Star-tree index
parent: Improving search performance
nav_order: 54
---

# Star-tree index

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

A star-tree index is a multi-field index that improves the performance of aggregations.

OpenSearch will automatically use a star-tree index to optimize aggregations if the queried fields are part of star-tree index dimension fields and the aggregations are on star-tree index metric fields. No changes are required in the query syntax or the request parameters.

## When to use a star-tree index

A star-tree index can be used to perform faster aggregations. Consider the following criteria and features when deciding to use a star-tree index:

- Star-tree indexes natively support multi-field aggregations.
- Star-tree indexes are created in real time as part of the indexing process, so the data in a star-tree will always be up to date.
- A star-tree index consolidates data, increasing index paging efficiency and using less IO for search queries.

## Limitations

Star-tree indexes have the following limitations:

- A star-tree index should only be enabled on indexes whose data is not updated or deleted because updates and deletions are not accounted for in a star-tree index.
- A star-tree index can be used for aggregation queries only if the queried fields are a subset of the star-tree's dimensions and the aggregated fields are a subset of the star-tree's metrics.
- After a star-tree index is enabled, it cannot be disabled. In order to disable a star-tree index, the data in the index must be reindexed without the star-tree mapping. Furthermore, changing a star-tree configuration will also require a reindex operation.
- [Multi-values/array values]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/index/#arrays) are not supported.
- Only [limited queries and aggregations](#supported-queries-and-aggregations) are supported. Support for more features will be added in future versions.
- The cardinality of the dimensions should not be very high (as with `_id` fields). Higher cardinality leads to increased storage usage and query latency.

## Star-tree index structure

The following image illustrates a standard star-tree index structure.

<img src="{{site.url}}{{site.baseurl}}/images/star-tree-index.png" alt="A star-tree index containing two dimensions and two metrics" width="700">

Sorted and aggregated star-tree documents are backed by `doc_values` in an index. `doc_values` use the following pattern:

- The values are sorted based on the order of their `ordered_dimension`. In the preceding image, the dimensions are determined by the `status` setting and then by the `port` for each status.
- For each unique dimension/value combination, the aggregated values for all the metrics, such as `avg(size)` and `count(requests)`, are precomputed during ingestion.

### Leaf nodes

Each node in a star-tree index points to a range of star-tree documents. Nodes can be further split into child nodes based on the [max_leaf_docs configuration]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/star-tree/#star-tree-configuration-parameters). The number of documents that a leaf node points to is less than or equal to the number set by `max_leaf_docs`. This ensures that the maximum number of documents that need to traverse nodes to derive an aggregated value is at most the number of `max_leaf_docs`, which provides predictable latency.

### Star nodes

Star nodes are children of non-leaf nodes that contain preaggregated records for data split after dimension removal, aggregating metrics for rows containing dimensions with identical values. These aggregated documents are then appended to the end of star-tree documents. If a document does contain a dimension with identical values, it traverses through the star node.

The star-tree index structure diagram contains the following three examples demonstrating how a document does or does not traverse star-tree nodes (indicated by the `*` symbol in the diagram) during a `Term` query, based on the average request size of the query and whether the document contains matching dimensions:

- When the port equals `8443` and the status equals `200`. Because the status equals `200`, the query does not traverse through a star node, and the aggregated metric is stored at the end of a star-tree document.
- When the status equals `200`. The query traverses through a star node in the `port` dimension because `port` is not present as part of the query.
- When the port equals `5600`. The query traverses through a star node in the `status` dimension because `status` is not present as part of the query.

Support for the `Term` query will be added in a future version. For more information, see [GitHub issue #15257](https://github.com/opensearch-project/OpenSearch/issues/15257).
{: .note}

## Enabling a star-tree index

To use a star-tree index, modify the following settings:

- Set the feature flag `opensearch.experimental.feature.composite_index.star_tree.enabled` to `true`. For more information about enabling and disabling feature flags, see [Enabling experimental features]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/experimental/).
- Set the `indices.composite_index.star_tree.enabled` setting to `true`. For instructions on how to configure OpenSearch, see [Configuring settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/#static-settings).
- Set the `index.composite_index` index setting to `true` during index creation.
- Ensure that the `doc_values` parameter is enabled for the `dimensions` and `metrics` fields used in your star-tree mapping.


## Example mapping

In the following example, index mappings define the star-tree configuration. This star-tree index precomputes aggregations in the `log` index. The aggregations are calculated using the `size` and `latency` fields for all the combinations of values indexed in the `port` and `status` fields:

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

For detailed information about star-tree index mappings and parameters, see [Star-tree field type]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/star-tree/).

## Supported queries and aggregations

Star-tree indexes can be used to optimize queries and aggregations. 

### Supported queries

The following queries are supported as of OpenSearch 2.18:

- [Term query](https://opensearch.org/docs/latest/query-dsl/term/term/)
- [Match all docs query](https://opensearch.org/docs/latest/query-dsl/match-all/)

To use queries with a star-tree index, the query's fields must be present in the `ordered_dimensions` section of the star-tree configuration.

### Supported aggregations
 
The following metric aggregations are supported as of OpenSearch 2.18:
- [Sum](https://opensearch.org/docs/latest/aggregations/metric/sum/)
- [Minimum](https://opensearch.org/docs/latest/aggregations/metric/minimum/)
- [Maximum](https://opensearch.org/docs/latest/aggregations/metric/maximum/)
- [Value count](https://opensearch.org/docs/latest/aggregations/metric/value-count/)
- [Average](https://opensearch.org/docs/latest/aggregations/metric/average/)

To use aggregations:

- The fields must be present in the `metrics` section of the star-tree configuration.
- The metric aggregation type must be part of the `stats` parameter.

### Aggregation example

The following example gets the sum of the `size` field for all error logs with `status=500`, using the [example mapping](#example-mapping):

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

With the star-tree index, the result will be retrieved from a single aggregated document as it traverses to the `status=500` node, as opposed to scanning through all of the matching documents. This results in lower query latency.

## Using queries with a star-tree index

Set the `indices.composite_index.star_tree.enabled` setting to `false` to run queries without using a star-tree index.
