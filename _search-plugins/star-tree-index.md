---
layout: default
title: Star-tree index
parent: Improving search performance
nav_order: 54
---

# Star-tree index

A star-tree index is a multi-field index that improves the performance of aggregations.

OpenSearch will automatically use a star-tree index to optimize aggregations if the queried fields are part of dimension fields and the aggregations are on star-tree metric fields. No changes are required in the query syntax or the request parameters.

## When to use a star-tree index

A star-tree index can be used to perform faster aggregations. Consider the following criteria and features when deciding to use a star-tree index:

- Star-tree indexes natively support multi-field aggregations.
- Star-tree indexes are created in real time as part of the indexing process, so the data in a star-tree will always be up to date.
- A star-tree index consolidates data, increasing index paging efficiency and using less IO for search queries.

## Limitations

Star-tree indexes have the following limitations:

- A star-tree index should only be enabled on indexes whose data is not updated or deleted because updates and deletions are not accounted for in a star-tree index. To enforce this policy and use star-tree indexes, set the `index.append_only.enabled` setting to `true`.
- A star-tree index can be used for aggregation queries only if the queried fields are a subset of the star-tree's dimensions and the aggregated fields are a subset of the star-tree's metrics.
- After a star-tree index is enabled, it cannot be disabled. In order to disable a star-tree index, the data in the index must be reindexed without the star-tree mapping. Furthermore, changing a star-tree configuration will also require a reindex operation.
- [Multi-values/array values]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/index/#arrays) are not supported.
- Only [limited queries and aggregations](#supported-queries-and-aggregations) are supported. Support for more features will be added in future versions.
- The cardinality of the dimensions should not be very high (as with `_id` fields). Higher cardinality leads to increased storage usage and query latency.

## Star-tree index structure

The following image illustrates a standard star-tree index structure.

<img src="{{site.url}}{{site.baseurl}}/images/star-tree-index.png" alt="A star-tree index containing two dimensions and two metrics" width="700">

Sorted and aggregated star-tree documents are backed by `doc_values` in an index. The columnar data found in `doc_values` is stored using the following properties:

- The values are sorted based on the fields set in the `ordered_dimension` setting. In the preceding image, the dimensions are determined by the `status` setting and then by the `port` for each status.
- For each unique dimension/value combination, the aggregated values for all the metrics, such as `avg(size)` and `count(requests)`, are precomputed during ingestion.

### Leaf nodes

Each node in a star-tree index points to a range of star-tree documents. Nodes can be further split into child nodes based on the [max_leaf_docs configuration]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/star-tree/#star-tree-index-configuration-options). The number of documents that a leaf node points to is less than or equal to the value set in `max_leaf_docs`. This ensures that the maximum number of documents that need to traverse nodes to derive an aggregated value is at most the number of `max_leaf_docs`, which provides predictable latency.

### Star nodes

A star node contains the aggregated data of all the other nodes for a particular dimension, acting as a "catch-all" node. When a star node is found in a dimension, that dimension is skipped during aggregation. This groups together all values of that dimension and allows a query to skip non-competitive nodes when fetching the aggregated value of a particular field. 

The star-tree index structure diagram contains the following three examples demonstrating how a query behaves when retrieving aggregations from nodes in the star-tree:

- **Blue**: In a `terms` query that searches for the average request size aggregation, the `port` equals `8443` and the status equals `200`. Because the query contains values in both the `status` and `port` dimensions, the query traverses status node `200` and returns the aggregations from child node `8443`.
- **Green**: In a `term` query that searches for the number of aggregation requests, the `status` equals `200`. Because the query only contains a value from the `status` dimension, the query traverses the `200` node's child star node, which contains the aggregated value of all the `port` child nodes.
- **Red**: In a `term` query that searches for the average request size aggregation, the port equals `5600`. Because the query does not contain a value from the `status` dimension, the query traverses a star node and returns the aggregated result from the `5600` child node.

Support for the `Terms` query will be added in a future version. For more information, see [GitHub issue #15257](https://github.com/opensearch-project/OpenSearch/issues/15257).
{: .note}

## Enabling a star-tree index

To use a star-tree index, modify the following settings:

- Set the `indices.composite_index.star_tree.enabled` setting to `true`. For instructions on how to configure OpenSearch, see [Configuring settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index/#static-settings).
- Set the `index.composite_index` index setting to `true` during index creation.
- Set the `index.append_only.enabled` index setting to `true` during index creation.
- Ensure that the `doc_values` parameter is enabled for the `dimensions` and `metrics` fields used in your star-tree mapping.


## Example mapping

In the following example, index mappings define the star-tree configuration. The star-tree index precomputes aggregations in the `logs` index. The aggregations are calculated on the `size` and `latency` fields for all the combinations of values indexed in the `port` and `status` fields:

```json
PUT logs
{
  "settings": {
    "index.number_of_shards": 1,
    "index.number_of_replicas": 0,
    "index.composite_index": true,
    "index.append_only.enabled": true
  },
  "mappings": {
    "composite": {
      "request_aggs": {
        "type": "star_tree",
        "config": {
          "date_dimension" : {
            "name": "@timestamp",
            "calendar_intervals": [
              "month",
              "day"
            ]
          },
          "ordered_dimensions": [
            {
              "name": "status"
            },
            {
              "name": "port"
            },
            {
              "name": "method"
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
      "method" : {
        "type": "keyword"
      },
      "latency": {
        "type": "scaled_float",
        "scaling_factor": 10
      }
    }
  }
}
```
{% include copy.html %}

For detailed information about star-tree index mappings and parameters, see [Star-tree field type]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/star-tree/).

## Supported queries and aggregations

Star-tree indexes can be used to optimize queries and aggregations. 

### Supported queries

The following queries are supported as of OpenSearch 2.19:

- [Term query]({{site.url}}{{site.baseurl}}/query-dsl/term/term/)
- [Terms query]({{site.url}}{{site.baseurl}}/query-dsl/term/terms/)
- [Match all docs query]({{site.url}}{{site.baseurl}}/query-dsl/match-all/)
- [Range query]({{site.url}}{{site.baseurl}}/query-dsl/term/range/)
- [Boolean query]({{site.url}}{{site.baseurl}}/query-dsl/compound/bool/)

To use a query with a star-tree index, the query's fields must be present in the `ordered_dimensions` section of the star-tree configuration. Queries must also be paired with a supported aggregation. Queries without aggregations cannot be used with a star-tree index. Currently, queries on `date` fields are not supported and will be added in later versions.

#### Boolean query restrictions

Boolean queries in star-tree indexes follow specific rules for each clause type:

* `must` and `filter` clauses:
  - Are both supported and treated the same way because `filter` does not affect scoring.
  - Can operate across different dimensions.
  - Allow only one condition per dimension across all `must`/`filter` clauses, including nested ones.
  - Support term, terms, and range queries.

* `should` clauses:
  - Must operate on the same dimension and cannot operate across different dimensions
  - Can only use term, terms, and range queries.

* `should` clauses inside `must` clauses:
  - Act as a required condition.
  - When operating on the same dimension as outer `must`: The union of `should` conditions is intersected with the outer `must` conditions.
  - When operating on a different dimension: Processed normally as a required condition.

* `must_not` clauses are not supported.
* Queries with the `minimum_should_match` parameter are not supported.

The following Boolean query is **supported** because it follows these restrictions:

```json
{
  "bool": {
    "must": [
      {"term": {"method": "GET"}}
    ],
    "filter": [
      {"range": {"status": {"gte": 200, "lt": 300}}}
    ],
    "should": [
      {"term": {"port": 443}},
      {"term": {"port": 8443}}
    ]
  }
}
```
{% include copy.html %}

The following Boolean queries are **not** supported because they violate these restrictions:

```json
{
  "bool": {
    "should": [
      {"term": {"status": 200}},
      {"term": {"method": "GET"}}  // SHOULD across different dimensions
    ]
  }
}
```

```json
{
  "bool": {
    "must": [
      {"term": {"status": 200}}
    ],
    "must_not": [  // MUST_NOT not supported
      {"term": {"method": "DELETE"}}
    ]
  }
}
```

### Supported aggregations

The following aggregations are supported by star-tree indexes.

#### Metric aggregations
 
The following metric aggregations are supported as of OpenSearch 2.18:

- [Sum]({{site.url}}{{site.baseurl}}/aggregations/metric/sum/)
- [Minimum]({{site.url}}{{site.baseurl}}/aggregations/metric/minimum/)
- [Maximum]({{site.url}}{{site.baseurl}}/aggregations/metric/maximum/)
- [Value count]({{site.url}}{{site.baseurl}}/aggregations/metric/value-count/)
- [Average]({{site.url}}{{site.baseurl}}/aggregations/metric/average/)

To use searchable aggregations with a star-tree index, make sure you fulfill the following prerequisites:

- The fields must be present in the `metrics` section of the star-tree configuration.
- The metric aggregation type must be part of the `stats` parameter.

The following example gets the sum of all the values in the `size` field for all error logs with `status=500`, using the [example mapping](#example-mapping):

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
{% include copy.html %}

Using a star-tree index, the result will be retrieved from a single aggregated document as it traverses the `status=500` node, as opposed to scanning through all of the matching documents. This results in lower query latency.

#### Date histograms with metric aggregations

You can use [date histograms]({{site.url}}{{site.baseurl}}/aggregations/bucket/date-histogram/) on calendar intervals with metric sub-aggregations.

To use date histogram aggregations and make them searchable in a star-tree index, remember the following requirements:

- The calendar intervals in a star-tree mapping configuration can use either the request's calendar field or a field of lower granularity than the request field. For example, if an aggregation uses the `month` field, the star-tree search can still use lower-granularity fields such as `day`.
- A metric sub-aggregation must be part of the aggregation request.

The following example filters logs to include only those with status codes between `200` and `400` and sets the `size` of the response to `0`, so that only aggregated results are returned. It then aggregates the filtered logs by calendar month and calculates the total `size` of the requests for each month:

```json
POST /logs/_search
{
    "size": 0,
    "query": {
        "range": {
            "status": {
                "gte": "200",
                "lte": "400"
            }
        }
    },
    "aggs": {
        "by_month": {
            "date_histogram": {
                "field": "@timestamp",
                "calendar_interval": "month"
            },
            "aggs": {
                "sum_size": {
                    "sum": {
                        "field": "size"
                    }
                }
            }
        }
    }
}
```
{% include copy-curl.html %}

#### Keyword and numeric terms aggregations

You can use [terms aggregations]({{site.url}}{{site.baseurl}}/aggregations/bucket/terms/) on both keyword and numeric fields with star-tree index search.

For star-tree search compatibility with terms aggregations, remember the following behaviors:

- The fields used in the terms aggregation should be part of the dimensions defined in the star-tree index.
- Metric sub-aggregations are optional as long as the relevant metrics are part of the star-tree configuration.

The following example aggregates logs by the `user_id` field and returns the counts for each unique user:

```json
POST /logs/_search
{
    "size": 0,
    "aggs": {
        "users": {
            "terms": {
                "field": "user_id"
            }
        }
    }
}
```
{% include copy-curl.html %}

The following example aggregates orders by the `order_quantity` and calculates the average `total_price` for each quantity:

```json
POST /orders/_search
{
    "size": 0,
    "aggs": {
        "quantities": {
            "terms": {
                "field": "order_quantity"
            },
            "aggs": {
                "avg_total_price": {
                    "avg": {
                        "field": "total_price"
                    }
                }
            }
        }
    }
}
```
{% include copy-curl.html %}

#### Range aggregations

You can use [range aggregations]({{site.url}}{{site.baseurl}}/aggregations/bucket/range/) on numeric fields with star-tree index search.

For range aggregations to work effectively with a star-tree index, remember the following behaviors:

- The field used in the range aggregation should be part of the dimensions defined in the star-tree index.
- You can include metric sub-aggregations to compute metrics within each defined range, as long as the relevant metrics are part of the star-tree configuration.

The following example aggregates documents based on predefined ranges of the `temperature` field:

```json
POST /sensors/_search
{
    "size": 0,
    "aggs": {
        "temperature_ranges": {
            "range": {
                "field": "temperature",
                "ranges": [
                    { "to": 20 },
                    { "from": 20, "to": 30 },
                    { "from": 30 }
                ]
            }
        }
    }
}
```
{% include copy-curl.html %}

The following example aggregates sales data by price ranges and calculates the total `quantity` sold within each range:

```json
POST /sales/_search
{
    "size": 0,
    "aggs": {
        "price_ranges": {
            "range": {
                "field": "price",
                "ranges": [
                    { "to": 100 },
                    { "from": 100, "to": 500 },
                    { "from": 500 }
                ]
            },
            "aggs": {
                "total_quantity": {
                    "sum": {
                        "field": "quantity"
                    }
                }
            }
        }
    }
}
```
{% include copy-curl.html %}

#### Nested aggregations

Bucket aggregations supported with star-tree index search can be nested and resolved using star-tree. [See more]({{site.url}}{{site.baseurl}}/aggregations/#nested-aggregations).

## Using queries without a star-tree index

Set the `indices.composite_index.star_tree.enabled` setting to `false` to run queries without using a star-tree index.
