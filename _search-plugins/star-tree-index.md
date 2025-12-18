---
layout: default
title: Star-tree index
parent: Improving search performance
nav_order: 54
canonical_url: https://docs.opensearch.org/latest/search-plugins/star-tree-index/
---

# Star-tree index

A _star-tree index_ is a specialized index structure designed to improve aggregation performance by precomputing and storing aggregated values at different levels of granularity. This indexing technique enables faster aggregation execution, especially for multi-field aggregations.

Once you enable star-tree indexes, OpenSearch automatically builds and uses star-tree indexes to optimize supported aggregations if the filter fields match the defined dimensions and the aggregation fields match the defined metrics in the star-tree mapping configuration. No changes to your query syntax or request parameters are required.

Use a star-tree index when you want to speed up aggregations:

- Star-tree indexes natively support multi-field aggregations.
- Star-tree indexes are created in real time as part of the indexing process, so the data in a star-tree is always current.
- A star-tree index aggregates data to improve paging efficiency and reduce disk I/O during search queries.

## Star-tree index structure

A star-tree index organizes and aggregates data across combinations of dimension fields and precomputes metric values for all the dimension combinations every time a segment is flushed or refreshed during ingestion. This structure enables OpenSearch to process aggregation queries quickly without scanning every document.

The following is an example star-tree configuration:

```json
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
```

This configuration defines the following:

* Two dimension fields: `status` and `port`. The `ordered_dimension` field specifies how data is sorted (first by `status`, then by `port`).
* Two metric fields: `size` and `latency` with their corresponding aggregations (`sum` and `avg`). For each unique dimension combination, metric values (`Sum(size)` and `Avg(latency)`) are pre-aggregated and stored in the star-tree structure.

OpenSearch creates a star-tree index structure based on this configuration. Each node in the tree corresponds to a value (or wildcard `*`) for a dimension. At query time, OpenSearch traverses the tree based on the dimension values provided in the query.

### Leaf nodes

Leaf nodes contain the precomputed metric aggregations for specific combinations of dimensions. These are stored as doc values and referenced by star-tree nodes.

The `max_leaf_docs` setting controls how many documents each leaf node can reference, which helps keep query latency predictable by limiting how many documents are scanned for any given node.

### Star nodes

A _star node_ (marked as `*` in the following diagram) aggregates all values for a particular dimension. If a query doesn't specify a filter for that dimension, OpenSearch retrieves the precomputed aggregation from the star node instead of iterating over multiple leaf nodes. For example, if a query filters on `port` but not `status`, OpenSearch can use a star node that aggregates data for all status values.

### How queries use the star-tree

The following diagram shows a star-tree index created for this example and three example query paths. In the diagram, notice that each branch corresponds to a dimension (`status` and `port`). Some nodes contain precomputed aggregation values (for example, `Sum(size)`), allowing OpenSearch to skip unnecessary calculations at query time.

<img src="{{site.url}}{{site.baseurl}}/images/star-tree-index.png" alt="A star-tree index containing two dimensions and two metrics">

The colored arrows show three query examples:

* **Blue arrow**: Multi-term query with metric aggregation
  The query filters on both `status = 200` and `port = 5600` and calculates the sum of request sizes.

  * OpenSearch follows this path: `Root → 200 → 5600`
  * It retrieves the metric from Doc ID 1, where `Sum(size) = 988`

* **Green arrow**: Single-term query with metric aggregation
  The query filters on `status = 200` only and computes the average request latency.

  * OpenSearch follows this path: `Root → 200 → *`
  * It retrieves the metric from Doc ID 5, where `Avg(latency) = 70`

* **Red arrow**: Single-term query with metric aggregation
  The query filters on `port = 8443` only and calculates the sum of request sizes.

  * OpenSearch follows this path: `Root → * → 8443`
  * It retrieves the metric from Doc ID 7, where `Sum(size) = 1111`

These examples show how OpenSearch selects the shortest path in the star-tree and uses pre-aggregated values to process queries efficiently.

## Limitations

Note the following limiations of star-tree indexes:

- Star-tree indexes do not support updates or deletions. To use a star-tree index, data should be append-only. See [Enabling a star-tree index](#enabling-a-star-tree-index).
- A star-tree index only works for aggregation queries that filter on dimension fields and aggregate metric fields defined in the index's star-tree configuration.
- Any changes to a star-tree configuration require reindexing.
- [Array values]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/index/#arrays) are not supported.
- Only [specific queries and aggregations](#supported-queries-and-aggregations) are supported. 
- Avoid using high-cardinality fields like `_id` as dimensions because they can significantly increase storage use and query latency.

## Enabling a star-tree index

Star-tree indexing behavior is controlled by the following cluster-level and index-level settings. Index-level settings take precedence over cluster settings.

| Setting                                     | Scope   | Default | Purpose                                                                                                                              |
| ------------------------------------------- | ------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `indices.composite_index.star_tree.enabled` | Cluster | `true`  | Enables or disables star-tree search optimization across the cluster.  |
| `index.composite_index`                     | Index   | None       | Enables star-tree indexing for a specific index. Must be set when creating the index.                                                |
| `index.append_only.enabled`                 | Index   | None      | Required for star-tree indexes. Prevents updates and deletions. Must be `true`.                                                      |
| `index.search.star_tree_index.enabled`      | Index   | `true`  | Enables or disables use of the star-tree index for search queries on the index.                                                 |

Setting `indices.composite_index.star_tree.enabled` to `false` prevents OpenSearch from using star-tree optimization during searches, but the star-tree index structures are still created. To completely remove star-tree structures, you must reindex your data without the star-tree mapping.
{: .note}


To create an index that uses a star-tree index, send the following request:

```json
PUT /logs
{
  "settings": {
    "index.composite_index": true,
    "index.append_only.enabled": true
  }
}
```
{% include copy-curl.html %}

Ensure that the `doc_values` parameter is enabled for the dimension and metric fields used in your star-tree mapping. This is enabled by default for most field types. For more information, see [Doc values]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/doc-values/).

### Disabling star-tree usage

By default, both the `indices.composite_index.star_tree.enabled` cluster setting and the `index.search.star_tree_index.enabled` index setting are set to `true`. To disable search using star-tree indexes, set both of these settings to `false`. Note that index settings take precedence over cluster settings. 

## Example mapping

The following example shows how to create a star-tree index that precomputes aggregations in the `logs` index. The `sum` and `average` aggregations are calculated on the `size` and `latency` fields , respectively, for all combinations of values in the dimension fields. The dimensions are ordered by `status`, then `port`, and finally `method`, which determines how the data is organized in the tree structure:

```json
PUT /logs
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

For more information about star-tree index mappings and parameters, see [Star-tree field type]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/star-tree/).

## Supported queries and aggregations

Star-tree indexes optimize aggregations. Every query must include at least one supported aggregation in order to use the star-tree optimization.

### Supported queries

Queries without aggregations cannot use star-tree optimization. The query's fields must be present in the `ordered_dimensions` section of the star-tree configuration. The following queries are supported:

- [Term query]({{site.url}}{{site.baseurl}}/query-dsl/term/term/)
- [Terms query]({{site.url}}{{site.baseurl}}/query-dsl/term/terms/)
- [Match all docs query]({{site.url}}{{site.baseurl}}/query-dsl/match-all/)
- [Range query]({{site.url}}{{site.baseurl}}/query-dsl/term/range/)
- [Boolean query]({{site.url}}{{site.baseurl}}/query-dsl/compound/bool/)

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
 
The following metric aggregations are supported:

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

You can combine multiple supported bucket aggregations (such as `terms` and `range`) in a nested structure, and the star-tree index will optimize these nested aggregations. For more information about nested aggregations, see [Nested aggregations]({{site.url}}{{site.baseurl}}/aggregations/#nested-aggregations).

#### Multi-terms aggregations

A star-tree index optimizes `multi_terms` aggregations when the aggregation fields are defined as dimensions in the star-tree configuration. For more information about multi-terms aggregations, see [Multi-terms aggregations]({{site.url}}{{site.baseurl}}/aggregations/bucket/multi-terms/).

## Next steps

- [Star-tree field type]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/star-tree/)
