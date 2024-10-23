---
layout: default
title: Star Tree
nav_order: 61
has_children: false
parent: Supported field types
redirect_from:
  - /opensearch/supported-field-types/star-tree/
  - /field-types/star-tree/
---
# Star tree field type

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

Star Tree Index (STIX) pre-computes aggregations to accelerate the performance of aggregation queries.
Once you configure star-tree index as part of index mapping, it will be created and maintained in real-time within segments as data is ingested.

OpenSearch will automatically use the star-tree index to optimize aggregations based on the input query and star-tree configuration. No changes are required in the query syntax or requests.

For more information, see [Star Tree index]({{site.url}}{{site.baseurl}}/search-plugins/star-tree-index/)

## Prerequisites

Before using star-tree field, be sure to satisfy the following prerequisites:

- Set the feature flag `opensearch.experimental.feature.composite_index.star_tree.enabled"` to `true`. For more information about enabling and disabling feature flags, see [Enabling experimental features]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/experimental/).
- Set the `indices.composite_index.star_tree.enabled` setting to `true`. For instructions on how to configure OpenSearch, see [configuring settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/#static-settings).
-  Set the `index.composite_index` index setting to `true` during index creation.
- Enable `doc_values` : Ensure that the `doc_values` is enabled for the [dimensions](#ordered-dimensions) and [metrics](#metrics) fields used in your star-tree mapping.


## Examples

The following examples show how to use star-tree index.

### Star tree index mapping

Define star-tree mapping under new section `composite` in `mappings`. <br/>
To compute metric aggregations for `request_size` and `latency` fields with queries on `port` and `status` fields, configure the following mappings:

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
In the above example, for `startree1` , we will create an associated Star Tree index. Currently only `one` star-tree index can be created per index with support for multiple star-trees coming in future. <br/>

## Star tree mapping parameters
Specify star-tree configuration under `config` section. All parameters are final and cannot be modified without reindexing documents.

### Ordered dimensions
The `ordered_dimensions` are fields based on which the metrics will be aggregated in star-tree index. Star Tree index will be picked for query optimizations only if all the fields in the query are part of the `ordered_dimensions`. This is a required property as part of star-tree configuration.
- The order of dimensions matter and you can define the dimensions ordered from the highest cardinality to the lowest cardinality for efficient storage and query pruning. 
- Avoid high cardinality fields as dimensions , because it'll affect storage space, indexing throughput and query performance adversely.
- Currently, supported fields for `ordered_dimensions` are of [numeric field types](https://opensearch.org/docs/latest/field-types/supported-field-types/numeric/) with the exception of `unsigned_long`. 
  - Support for other field_types such as `keyword` , `ip` is coming as part of upcoming releases.
- Minimum of `2` and maximum of `10` dimensions are supported per Star Tree index.

#### Properties

| Parameter            | Required/Optional | Description                                                                                                                                                                                                                                                                                                                                                                                                                         | 
|:---------------------| :--- |:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `name` | Required | Name of the field which should also be present in `properties` as part of index `mapping` and ensure `doc_values` is `enabled` for associated fields.

### Metrics
Configure fields for which you need to perform aggregations. This is required property as part of star-tree configuration.
- Currently, supported fields for `metrics` are of [numeric field types](https://opensearch.org/docs/latest/field-types/supported-field-types/numeric/) with the exception of `unsigned_long`.
- Supported metric aggregations include `Min`, `Max`, `Sum`, `Avg` and `Value_count`. 
  - `Avg` is a derived metric based on `Sum` and `Value_count` and is not indexed and is derived on query time. Rest are base metrics which are indexed.
- Maximum of `100` base metrics are supported per Star Tree index.

For example, say you provide `Min`, `Max`, `Sum` and `Value_count` as part of all fields as part of `metrics` configuration, you can provide up to 25 fields as below
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
      

```


#### Properties

| Parameter            | Required/Optional | Description                                                                                                                                                                                                                                                                                                                                                                                                                         | 
|:---------------------|:------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `name` | Required          | Name of the field which should also be present in `properties` as part of index `mapping` and ensure `doc_values` is `enabled` for associated fields.
| `stats` | Optional          | List of metric aggregations computed for each field. You can choose between `Min`, `Max`, `Sum`, `Avg`, and `Value Count`.<br/>Defaults are `Sum` and `Value_count`.<br/>`Avg` is a derived metric stat which will automatically be supported in queries if `sum` and `value_count` are present as part of metric `stats`.

### Star tree configuration parameters
Following are additional optional parameters that can be configured alongside star-tree index. These are final and cannot be modified post index creation.

| Parameter       | Required/Optional | Description                                                                                                                                                                                                                                                                                                                                                                                                                         | 
|:----------------|:------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `max_leaf_docs` | Optional          | The maximum number of star-tree documents leaf node can point to post which the nodes will be split to next dimension.10000 is the default value. Lowering the value will result in high storage size but faster query performance and the other way around when increasing the value. For more, see [star tree indexing structure]({{site.url}}{{site.baseurl}}/search-plugins/star-tree-index/#star-tree-index-structure) 
| `skip_star_node_creation_for_dimensions`           | Optional          | List of dimensions for which star-tree will skip creating star node. Setting this to `true` can reduce storage size at the expense of query performance. Default is false. To know more on star nodes, see [star tree indexing structure]({{site.url}}{{site.baseurl}}/search-plugins/star-tree-index/#star-tree-index-structure) 

## Supported queries and aggregations
For more details on supported queries and aggregations, see [supported query and aggregations for Star Tree index]({{site.url}}{{site.baseurl}}/search-plugins/star-tree-index/#supported-query-and-aggregations)
