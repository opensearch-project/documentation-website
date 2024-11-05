---
layout: default
title: Star-tree
nav_order: 61
parent: Supported field types
---

# Star-tree field type

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

A star-tree index precomputes aggregations, accelerating the performance of aggregation queries. 
If a star-tree index is configured as part of an index mapping, the star-tree index is created and maintained as data is ingested in real time.

OpenSearch will automatically use the star-tree index to optimize aggregations if the queried fields are part of star-tree index dimension fields and the aggregations are on star-tree index metric fields. No changes are required in the query syntax or the request parameters.

For more information, see [Star-tree index]({{site.url}}{{site.baseurl}}/search-plugins/star-tree-index/).

## Prerequisites

To use a star-tree index, follow the instructions in [Enabling a star-tree index]({{site.url}}{{site.baseurl}}/search-plugins/star-tree-index#enabling-a-star-tree-index).

## Examples

The following examples show how to use a star-tree index.

### Star-tree index mappings

Define star-tree index mappings in the `composite` section in `mappings`. 

The following example API request creates a corresponding star-tree index named`request_aggs`. To compute metric aggregations for `request_size` and `latency` fields with queries on `port` and `status` fields, configure the following mappings:

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
          "max_leaf_docs": 10000,
          "skip_star_node_creation_for_dimensions": [
            "port"
          ],
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
              ]
            },
            {
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

## Star-tree index configuration options

You can customize your star-tree implementation using the following `config` options in the `mappings` section. These options cannot be modified without reindexing.

| Parameter  | Description   | 
| :--- | :--- |
| `ordered_dimensions` | A [list of fields](#ordered-dimensions) based on which metrics will be aggregated in a star-tree index. Required. | 
| `metrics` | A [list of metric](#metrics) fields required in order to perform aggregations. Required. |
| `max_leaf_docs` | The maximum number of star-tree documents that a leaf node can point to. After the maximum number of documents is reached, child nodes will be created based on the unique value of the next field in the `ordered_dimension` (if any). Default is `10000`. A lower value will use more storage but result in faster query performance. Inversely, a higher value will use less storage but result in slower query performance. For more information, see [Star-tree indexing structure]({{site.url}}{{site.baseurl}}/search-plugins/star-tree-index/#star-tree-index-structure).  |
| `skip_star_node_creation_for_dimensions`  | A list of dimensions for which a star-tree index will skip star node creation. When `true`, this reduces storage size at the expense of query performance. Default is `false`. For more information about star nodes, see [Star-tree indexing structure]({{site.url}}{{site.baseurl}}/search-plugins/star-tree-index/#star-tree-index-structure). |


### Ordered dimensions

The `ordered_dimensions` parameter contains fields based on which metrics will be aggregated in a star-tree index. The star-tree index will be selected for querying only if all the fields in the query are part of the `ordered_dimensions`. 

When using the `ordered_dimesions` parameter, follow these best practices:

- The order of dimensions matters. You can define the dimensions ordered from the highest cardinality to the lowest cardinality for efficient storage and query pruning. 
- Avoid using high-cardinality fields as dimensions. High-cardinality fields adversely affect storage space, indexing throughput, and query performance.
- Currently, fields supported by the `ordered_dimensions` parameter are all [numeric field types](https://opensearch.org/docs/latest/field-types/supported-field-types/numeric/), with the exception of `unsigned_long`. For more information, see [GitHub issue #15231](https://github.com/opensearch-project/OpenSearch/issues/15231). 
- Support for other field types, such as `keyword` and `ip`, will be added in future versions. For more information, see [GitHub issue #16232](https://github.com/opensearch-project/OpenSearch/issues/16232).
- A minimum of `2` and a maximum of `10` dimensions are supported per star-tree index.

The `ordered_dimensions` parameter supports the following property.

| Parameter  | Required/Optional | Description  | 
| :--- | :--- | :--- |
| `name` | Required | The name of the field. The field name should be present in the `properties` section as part of the index `mapping`. Ensure that the `doc_values` setting is `enabled` for any associated fields. |


### Metrics

Configure any metric fields on which you need to perform aggregations. `Metrics` are required as part of a star-tree index configuration.

When using `metrics`, follow these best practices: 

- Currently, fields supported by `metrics` are all [numeric field types](https://opensearch.org/docs/latest/field-types/supported-field-types/numeric/), with the exception of `unsigned_long`. For more information, see [GitHub issue #15231](https://github.com/opensearch-project/OpenSearch/issues/15231). 
- Supported metric aggregations include `Min`, `Max`, `Sum`, `Avg`, and `Value_count`. 
    - `Avg` is a derived metric based on `Sum` and `Value_count` and is not indexed when a query is run. The remaining base metrics are indexed.
- A maximum of `100` base metrics are supported per star-tree index.

If `Min`, `Max`, `Sum`, and `Value_count` are defined as `metrics` for each field, then up to 25 such fields can be configured, as shown in the following example:

```json
{
  "metrics": [
    {
      "name": "field1",
      "stats": [
        "sum",
        "value_count",
        "min",
        "max"
      ],
      ...,
      ...,
      "name": "field25",
      "stats": [
        "sum",
        "value_count",
        "min",
        "max"
      ]
    }
  ]
}
```


#### Properties

The `metrics` parameter supports the following properties.

| Parameter   | Required/Optional | Description  | 
| :--- | :--- | :--- |
| `name` | Required | The name of the field. The field name should be present in the `properties` section as part of the index `mapping`. Ensure that the `doc_values` setting is `enabled` for any associated fields. |
| `stats` | Optional | A list of metric aggregations computed for each field. You can choose between `Min`, `Max`, `Sum`, `Avg`, and `Value Count`.<br/>Default is `Sum` and `Value_count`.<br/>`Avg` is a derived metric statistic that will automatically be supported in queries if `Sum` and `Value_Count` are present as part of metric `stats`.


## Supported queries and aggregations

For more information about supported queries and aggregations, see [Supported queries and aggregations for a star-tree index]({{site.url}}{{site.baseurl}}/search-plugins/star-tree-index/#supported-queries-and-aggregations).

