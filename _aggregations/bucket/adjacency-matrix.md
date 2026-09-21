---
layout: default
title: Adjacency matrix
parent: Bucket aggregations
nav_order: 10
redirect_from:
  - /query-dsl/aggregations/bucket/adjacency-matrix/
---

# Adjacency matrix aggregation

The `adjacency_matrix` aggregation accepts a set of named filter expressions and returns buckets representing every pair of intersecting filters. Each bucket's document count indicates how many documents matched both filters simultaneously, making it possible to analyze relationships between different document groups.

Given three filters named `A`, `B`, and `C`, the response produces the following bucket structure:

|   | `A` | `B` | `C` |
| :--- | :--- | :--- | :--- |
| `A` | `A` | `A&B` | `A&C` |
| `B` |  | `B` | `B&C` |
| `C` |  |  | `C` |

The matrix is symmetric---the bucket `A&C` contains the same documents as `C&A`---so only the upper triangle is returned. Filter names are sorted alphabetically, and the name that comes first always appears on the left side of the `&` separator.

## Parameters

The `adjacency_matrix` aggregation takes the following parameters.

| Parameter | Required/Optional | Data type | Description |
| :--- | :--- | :--- | :--- |
| `filters` | Required | Object | A set of named filters expressed as key-value pairs. Each key is the filter name and each value is a query object. |
| `separator` | Optional | String | The character used to join filter names in intersection bucket keys. Default is `&`. |

## Example

The following example analyzes the e-commerce dataset to determine how often products from three manufacturers appear together in the same orders:

```json
GET /opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "interactions": {
      "adjacency_matrix": {
        "filters": {
          "grpA": {
            "match": {
              "manufacturer.keyword": "Low Tide Media"
            }
          },
          "grpB": {
            "match": {
              "manufacturer.keyword": "Elitelligence"
            }
          },
          "grpC": {
            "match": {
              "manufacturer.keyword": "Oceanavigations"
            }
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "took": 32,
  "timed_out": false,
  "terminated_early": true,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 4675,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "interactions": {
      "buckets": [
        {
          "key": "grpA",
          "doc_count": 1553
        },
        {
          "key": "grpA&grpB",
          "doc_count": 590
        },
        {
          "key": "grpA&grpC",
          "doc_count": 329
        },
        {
          "key": "grpB",
          "doc_count": 1370
        },
        {
          "key": "grpB&grpC",
          "doc_count": 299
        },
        {
          "key": "grpC",
          "doc_count": 1218
        }
      ]
    }
  }
}
```

The intersection bucket `grpA&grpB` with `doc_count` of `590` indicates that 590 orders contain products from both Low Tide Media and Elitelligence.

## Usage with child aggregations

Nesting a child aggregation such as `date_histogram` inside `adjacency_matrix` adds a time dimension to the relationship data, enabling dynamic network analysis where you can observe how interactions between groups evolve over time.

Intersection buckets with zero matching documents are omitted from the response.
{: .note}

## Response body fields

The following table lists the response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `buckets` | Array | A list of buckets representing individual filters and their pairwise intersections. |
| `buckets.key` | String | The filter name for individual filter buckets, or two filter names joined by the separator for intersection buckets. |
| `buckets.doc_count` | Integer | The number of documents matching the filter or filter pair. |

## Limitations

The number of buckets grows quadratically with the number of filters. For `N` filters, up to `N(N+1)/2` buckets are produced (`N` individual buckets plus `N*(N-1)/2` intersection buckets). To prevent excessive memory use, the maximum number of filters defaults to `100`. You can adjust this limit per index using the `index.max_adjacency_matrix_filters` setting.

## Related documentation

- For a complete example of rendering adjacency matrix results as a network graph in OpenSearch Dashboards, see [Creating a Vega visualization]({{site.url}}{{site.baseurl}}/dashboards/visualize/vega/#creating-a-vega-visualization).