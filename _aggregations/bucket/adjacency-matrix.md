---
layout: default
title: Adjacency matrix
parent: Bucket aggregations
grand_parent: Aggregations
nav_order: 10
redirect_from:
  - /query-dsl/aggregations/bucket/adjacency-matrix/
---

# Adjacency matrix aggregations

The `adjacency_matrix` aggregation lets you define filter expressions and returns a matrix of the intersecting filters where each non-empty cell in the matrix represents a bucket. You can find how many documents fall within any combination of filters.

Use the `adjacency_matrix` aggregation to discover how concepts are related by visualizing the data as graphs.

For example, in the sample eCommerce dataset, to analyze how the different manufacturing companies are related:

```json
GET opensearch_dashboards_sample_data_ecommerce/_search
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

#### Example response

 ```json
 {
   ...
   "aggregations" : {
     "interactions" : {
       "buckets" : [
         {
           "key" : "grpA",
           "doc_count" : 1553
         },
         {
           "key" : "grpA&grpB",
           "doc_count" : 590
         },
         {
           "key" : "grpA&grpC",
           "doc_count" : 329
         },
         {
           "key" : "grpB",
           "doc_count" : 1370
         },
         {
           "key" : "grpB&grpC",
           "doc_count" : 299
         },
         {
           "key" : "grpC",
           "doc_count" : 1218
         }
       ]
     }
   }
 }
```

 Let’s take a closer look at the result:

 ```json
 {
    "key" : "grpA&grpB",
    "doc_count" : 590
 }
 ```

- `grpA`: Products manufactured by Low Tide Media.
- `grpB`: Products manufactured by Elitelligence.
- `590`: Number of products that are manufactured by both.

You can use OpenSearch Dashboards to represent this data with a network graph.