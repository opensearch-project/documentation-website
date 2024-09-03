---
layout: default
title: Filter search results
nav_order: 36
---

# Filter search results

Filter search results by using a DSL Boolean query with a filter clause. Boolean query filtering applies filters to both search hits and aggregations. Alternatively, filter search results using the `post_filter` parameter in the Search API. This applies filters only to search hits, not aggregations.

## Using `post_filter` to filter search results

The `post_filter` parameter filters search results by calculating aggregations based on a broader result set before narrowing down the search hits. This also improves result relevance and reorders results by rescoring hits after applying the post filter.

---

#### Example: Filtering search results

1. Create an index:

```
PUT /electronics
{
  "mappings": {
    "properties": {
      "brand": { "type": "keyword" },
      "category": { "type": "keyword" },
      "price": { "type": "float" },
      "features": { "type": "keyword" }
    }
  }
}
```
{% include copy-curl.html %}

2. Index data:

```
PUT /electronics/_doc/1?refresh
{
  "brand": "BrandX",
  "category": "Smartphone",
  "price": 699.99,
  "features": ["5G", "Dual Camera"]
}

PUT /electronics/_doc/2?refresh
{
  "brand": "BrandX",
  "category": "Laptop",
  "price": 1199.99,
  "features": ["Touchscreen", "16GB RAM"]
}

PUT /electronics/_doc/3?refresh
{
  "brand": "BrandY",
  "category": "Smartphone",
  "price": 799.99,
  "features": ["5G", "Triple Camera"]
}
```
{% include copy-curl.html %}

3. Use a Boolean filter query to display only smartphones from BrandX:

```
GET /electronics/_search
{
  "query": {
    "bool": {
      "filter": [
        { "term": { "brand": "BrandX" }},
        { "term": { "category": "Smartphone" }}
      ]
    }
  }
}
```
{% include copy-curl.html %}

Alternatively, refine search results using a terms aggregation. For example, use a category field to limit search results to BrandX smartphones or tablets:

```
GET /electronics/_search
{
  "query": {
    "bool": {
      "filter": [
        { "term": { "brand": "BrandX" }},
        { "term": { "category": "Smartphone" }}
      ]
    }
  },
  "aggs": {
    "categories": {
      "terms": { "field": "category" }
    }
  }
}
```
{% include copy-curl.html %}

This query returns the most popular categories of BrandX smartphones.

Then, use the `post_filter` parameter to show how many BrandX products are available in different price ranges:

```
GET /electronics/_search
{
  "query": {
    "bool": {
      "filter": {
        "term": { "brand": "BrandX" }
      }
    }
  },
  "aggs": {
    "price_ranges": {
      "range": {
        "field": "price",
        "ranges": [
          { "to": 500 },
          { "from": 500, "to": 1000 },
          { "from": 1000 }
        ]
      }
    },
    "category_smartphone": {
      "filter": {
        "term": { "category": "Smartphone" }
      },
      "aggs": {
        "price_ranges": {
          "range": {
            "field": "price",
            "ranges": [
              { "to": 500 },
              { "from": 500, "to": 1000 },
              { "from": 1000 }
            ]
          }
        }
      }
    }
  },
  "post_filter": {
    "term": { "category": "Smartphone" }
  }
}
```
{% include copy-curl.html %}

This query finds all products from BrandX. The `category_smartphone` aggregation limits the price range. The `price_ranges` aggregation returns price ranges for all BrandX products. The `post_filter` narrows the search hits to `smartphones`.

---

## Rescoring filtered search results

Rescoring is a tool to improve the accuracy of the returned search results. Rescoring focuses on the top results rather than applying the complex algorithm to the entire dataset, optimizing efficiency. Each shard processes the rescore request before the final results are aggregated and sorted by the coordinating node.

---

#### Example: Using a rescore query

Use the following query with the `rescore` parameter to reorder the top 50 smartphones from BrandX that include 5G features:

```
GET /electronics/_search
{
  "query": {
    "bool": {
      "filter": [
        { "term": { "brand": "BrandX" }},
        { "term": { "category": "Smartphone" }}
      ]
    }
  },
  "post_filter": {
    "term": { "category": "Smartphone" }
  },
  "rescore": {
    "window_size": 50,
    "query": {
      "rescore_query": {
        "match": {
          "features": "5G"
        }
      },
      "query_weight": 1.0,
      "rescore_query_weight": 2.0
    }
  }
}
```
{% include copy-curl.html %}

Avoid changing `window_size` with each page step because it may cause shifting results and confuse users.

### Query rescorer

The query rescorer refines search results by applying an additional query to the top results obtained from the initial search. Instead of evaluating every document, the rescorer focuses on a subset defined by the `window_size` parameter, which defaults to `10`. This approach enhances the efficiency of relevance adjustments.

The influence of the rescore query is balanced with the original query through the `query_weight` and `rescore_query_weight` parameters. Default for both is `1`.

---

#### Example: Using the query rescorer

1. Create an index and add sample data:

```
PUT /articles
{
  "mappings": {
    "properties": {
      "title": { "type": "text" },
      "content": { "type": "text" },
      "views": { "type": "integer" }
    }
  }
}
```
{% include copy-curl.html %}

2. Add sample documents:

```
POST /articles/_doc/1
{
  "title": "OpenSearch Basics",
  "content": "Learn the basics of OpenSearch with this guide.",
  "views": 150
}

POST /articles/_doc/2
{
  "title": "Advanced OpenSearch Techniques",
  "content": "Explore advanced features and techniques in OpenSearch.",
  "views": 300
}

POST /articles/_doc/3
{
  "title": "OpenSearch Performance Tuning",
  "content": "Optimize the performance of your OpenSearch cluster.",
  "views": 450
}
```
{% include copy-curl.html %}

3. Perform a search using the query rescorer:

This example query uses the query rescorer to refines the results based on a phrase match for the content field. Documents that match "OpenSearch" in the content field are further rescored based on a phrase match, giving more weight to exact phrases.

```
POST /articles/_search
{
  "query": {
    "match": {
      "content": "OpenSearch"
    }
  },
  "rescore": {
    "window_size": 10,
    "query": {
      "rescore_query": {
        "match_phrase": {
          "content": {
            "query": "OpenSearch",
            "slop": 2
          }
        }
      },
      "query_weight": 1,
      "rescore_query_weight": 2
    }
  }
}
```
{% include copy-curl.html %}

4. Perform a search using multiple rescorers:

This example query first applies a phrase match rescorer and then a function score rescorer to adjust the final relevance based on the number of views.

```
POST /articles/_search
{
  "query": {
    "match": {
      "content": "OpenSearch"
    }
  },
  "rescore": [
    {
      "window_size": 10,
      "query": {
        "rescore_query": {
          "match_phrase": {
            "content": {
              "query": "OpenSearch",
              "slop": 2
            }
          }
        },
        "query_weight": 0.7,
        "rescore_query_weight": 1.5
      }
    },
    {
      "window_size": 5,
      "query": {
        "score_mode": "multiply",
        "rescore_query": {
          "function_score": {
            "field_value_factor": {
              "field": "views",
              "factor": 1.2,
              "missing": 1
            }
          }
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}
