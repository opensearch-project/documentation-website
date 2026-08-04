---
layout: default
title: Scoring script filter
parent: Filtering data
nav_order: 30
canonical_url: https://docs.opensearch.org/latest/vector-search/filter-search-knn/scoring-script-filter/
---

# Scoring script filter

A scoring script filter first filters the documents and then uses a brute-force exact k-NN search on the results. For example, the following query searches for hotels with a rating between 8 and 10, inclusive, that provide parking and then performs a k-NN search to return the 3 hotels that are closest to the specified `location`:

```json
POST /hotels-index/_search
{
  "size": 3,
  "query": {
    "script_score": {
      "query": {
        "bool": {
          "filter": {
            "bool": {
              "must": [
                {
                  "range": {
                    "rating": {
                      "gte": 8,
                      "lte": 10
                    }
                  }
                },
                {
                  "term": {
                    "parking": "true"
                  }
                }
              ]
            }
          }
        }
      },
      "script": {
        "source": "knn_score",
        "lang": "knn",
        "params": {
          "field": "location",
          "query_value": [
            5.0,
            4.0
          ],
          "space_type": "l2"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}
