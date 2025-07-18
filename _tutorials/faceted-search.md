---
layout: default
title: Faceted search
nav_order: 60
---

# Implementing faceted search in OpenSearch

A _facet_ is a filterable field that users can select to narrow their search results. In an e-commerce context, you might see facets like brand, color, size, and price range on the left side of search results. For example, a query like "winter jacket" may return many products. Facets let users filter products by a particular color or price range.

Faceted search displays value or range counts for each facet, helping users understand the distribution of results and quickly apply filters. This approach is especially useful in e-commerce and location-based search. You can implement facets using `terms` aggregations for exact values (like colors or sizes) and `range` aggregations for continuous values (like prices, dates, or distances).

This tutorial shows you how to implement faceted search in OpenSearch using a product catalog for an e-commerce website as an example.

## Step 1: Define your index mapping

Start by defining the fields you'll use for faceting. The [mapping]({{site.url}}{{site.baseurl}}/field-types/) configuration is crucial for effective faceted search. For faceting on string fields, map the fields to `keyword` instead of `text` because `text` fields are not optimized for aggregations.

While you can enable aggregations on text fields by setting `"fielddata": true`, this approach should be avoided in production because it loads all field values into heap memory, significantly increasing memory usage and potentially causing performance issues and out-of-memory errors.
{: .tip}

A common challenge with faceted search is handling inconsistent capitalization in your data. For example, colors might be stored as "red", "RED", or "Red", which creates separate facet buckets and fragments your results.

To solve this, create an ingest pipeline that normalizes values to lowercase during indexing:

```json
PUT _ingest/pipeline/normalize-color-pipeline
{
  "description": "Normalize color field to lowercase",
  "processors": [
    {
      "lowercase": {
        "field": "color"
      }
    }
  ]
}
```
{% include copy-curl.html %}

Then map all fields to `keyword` for aggregation and apply the pipeline to the index:

```json
PUT /products
{
  "mappings": {
    "properties": {
      "name": {
        "type": "text"
      },
      "description": {
        "type": "text"
      },
      "color": {
        "type": "keyword"
      },
      "size": {
        "type": "keyword"
      },
      "price": {
        "type": "float"
      }
    }
  },
  "settings": {
    "default_pipeline": "normalize-color-pipeline"
  }
}
```
{% include copy-curl.html %}

## Step 2: Index product data

Next, index sample data into your index:

```json
POST /products/_bulk
{ "index": {"_id": 1} }
{ "name": "Cotton T-shirt", "description": "Comfortable t-shirt for everyday wear", "color": "red", "size": "M", "price": 19.99 }
{ "index": {"_id": 2} }
{ "name": "T-shirt", "description": "Soft cotton t-shirt perfect for casual outings", "color": "Blue", "size": "L", "price": 19.99 }
{ "index": {"_id": 3} }
{ "name": "Jeans", "description": "Classic denim jeans with a modern fit", "color": "blue", "size": "M", "price": 49.99 }
{ "index": {"_id": 4} }
{ "name": "Sweater", "description": "Warm wool sweater for cold weather", "color": "RED", "size": "L", "price": 39.99 }
```
{% include copy-curl.html %}

## Step 3: Run a faceted search

Use the `terms` aggregation to return facet buckets for the desired fields (in this example, `color` and `size`):

```json
POST /products/_search
{
  "query": {
    "match": {
      "name": "T-shirt"
    }
  },
  "aggs": {
    "colors": {
      "terms": {
        "field": "color"
      }
    },
    "sizes": {
      "terms": {
        "field": "size"
      }
    }
  }
}
```
{% include copy-curl.html %}

This response contains all t-shirt aggregated by color and size:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 68,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 0.59534115,
    "hits": [
      {
        "_index": "products",
        "_id": "2",
        "_score": 0.59534115,
        "_source": {
          "color": "blue",
          "size": "L",
          "price": 19.99,
          "name": "T-shirt",
          "description": "Soft cotton t-shirt perfect for casual outings"
        }
      },
      {
        "_index": "products",
        "_id": "1",
        "_score": 0.48764127,
        "_source": {
          "color": "red",
          "size": "M",
          "price": 19.99,
          "name": "Cotton T-shirt",
          "description": "Comfortable t-shirt for everyday wear"
        }
      }
    ]
  },
  "aggregations": {
    "sizes": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "L",
          "doc_count": 1
        },
        {
          "key": "M",
          "doc_count": 1
        }
      ]
    },
    "colors": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "blue",
          "doc_count": 1
        },
        {
          "key": "red",
          "doc_count": 1
        }
      ]
    }
  }
}
```

</details>

### Searching multiple fields

To search in both the `name` and `description` fields, use a `multi_match` query. Note that while the query searches across multiple text fields (`name` and `description`), the aggregations use the keyword fields (`color`, `size`) to ensure consistent facet values:

```json
POST /products/_search
{
  "query": {
    "multi_match": {
      "query": "cotton t-shirt",
      "fields": ["name", "description"],
      "operator": "and",
      "type": "best_fields"
    }
  },
  "aggs": {
    "colors": {
      "terms": {
        "field": "color"
      }
    },
    "sizes": {
      "terms": {
        "field": "size"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains both t-shirts:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 33,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 1.0944791,
    "hits": [
      {
        "_index": "products",
        "_id": "2",
        "_score": 1.0944791,
        "_source": {
          "color": "blue",
          "size": "L",
          "price": 19.99,
          "name": "T-shirt",
          "description": "Soft cotton t-shirt perfect for casual outings"
        }
      },
      {
        "_index": "products",
        "_id": "1",
        "_score": 0.9111493,
        "_source": {
          "color": "red",
          "size": "M",
          "price": 19.99,
          "name": "Cotton T-shirt",
          "description": "Comfortable t-shirt for everyday wear"
        }
      }
    ]
  },
  "aggregations": {
    "sizes": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "L",
          "doc_count": 1
        },
        {
          "key": "M",
          "doc_count": 1
        }
      ]
    },
    "colors": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "blue",
          "doc_count": 1
        },
        {
          "key": "red",
          "doc_count": 1
        }
      ]
    }
  }
}
```

</details>

For more information about `multi_match` query parameters, see [Multi-match query]({{site.url}}{{site.baseurl}}/query-dsl/full-text/multi-match/).

### Returning only facet data

If you only need the facet counts without the actual search results, set `"size": 0` to improve performance:

```json
POST /products/_search
{
  "size": 0,
  "aggs": {
    "colors": {
      "terms": {
        "field": "color"
      }
    }
  }
}
```
{% include copy-curl.html %}

### Specifying the number of results

By default, `terms` aggregations return the top 10 most frequent terms. If you need more or fewer results, you can set the `size` parameter:

```json
POST /products/_search
{
  "aggs": {
    "colors": {
      "terms": {
        "field": "color",
        "size": 20
      }
    }
  }
}
```
{% include copy-curl.html %}


## Step 4: Filter by facet values

To narrow results (for example, to search for t-shirts that are blue and size L), add `filter` clauses:

```json
POST /products/_search
{
  "query": {
    "bool": {
      "must": [
        { "match": { "name": "T-shirt" } }
      ],
      "filter": [
        { "term": { "color": "blue" } },
        { "term": { "size": "L" } }
      ]
    }
  },
  "aggs": {
    "colors": {
      "terms": {
        "field": "color"
      }
    },
    "sizes": {
      "terms": {
        "field": "size"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the matching product:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 38,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 0.59534115,
    "hits": [
      {
        "_index": "products",
        "_id": "2",
        "_score": 0.59534115,
        "_source": {
          "color": "blue",
          "size": "L",
          "price": 19.99,
          "name": "T-shirt",
          "description": "Soft cotton t-shirt perfect for casual outings"
        }
      }
    ]
  },
  "aggregations": {
    "sizes": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "L",
          "doc_count": 1
        }
      ]
    },
    "colors": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "blue",
          "doc_count": 1
        }
      ]
    }
  }
}
```

</details>

## Step 5: Range facets

You can create range facets for numeric fields like price, ratings, or dates.

### Numeric ranges

To create price ranges for the products, use a `range` aggregation:

```json
POST /products/_search
{
  "aggs": {
    "price_ranges": {
      "range": {
        "field": "price",
        "ranges": [
          { "to": 20, "key": "Under $20" },
          { "from": 20, "to": 40, "key": "$20 - $40" },
          { "from": 40, "key": "Over $40" }
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}

The response buckets products by price:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 19,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 4,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "products",
        "_id": "1",
        "_score": 1,
        "_source": {
          "name": "Cotton T-shirt",
          "description": "Comfortable t-shirt for everyday wear",
          "color": "red",
          "size": "M",
          "price": 19.99
        }
      },
      {
        "_index": "products",
        "_id": "2",
        "_score": 1,
        "_source": {
          "name": "T-shirt",
          "description": "Soft cotton t-shirt perfect for casual outings",
          "color": "blue",
          "size": "L",
          "price": 19.99
        }
      },
      {
        "_index": "products",
        "_id": "3",
        "_score": 1,
        "_source": {
          "name": "Jeans",
          "description": "Classic denim jeans with a modern fit",
          "color": "blue",
          "size": "M",
          "price": 49.99
        }
      },
      {
        "_index": "products",
        "_id": "4",
        "_score": 1,
        "_source": {
          "name": "Sweater",
          "description": "Warm wool sweater for cold weather",
          "color": "red",
          "size": "L",
          "price": 39.99
        }
      }
    ]
  },
  "aggregations": {
    "price_ranges": {
      "buckets": [
        {
          "key": "Under $20",
          "to": 20,
          "doc_count": 2
        },
        {
          "key": "$20 - $40",
          "from": 20,
          "to": 40,
          "doc_count": 1
        },
        {
          "key": "Over $40",
          "from": 40,
          "doc_count": 1
        }
      ]
    }
  }
}
```

</details>

### Geographic ranges

Geographic ranges are useful for location-based faceting, such as finding stores within certain distances from a user's location. First, create a mapping that contains a `store_location` field of the `geo_point` type:

```json
PUT /stores
{
  "mappings": {
    "properties": {
      "name": {
        "type": "text"
      },
      "store_location": {
        "type": "geo_point"
      }
    }
  }
}
```
{% include copy-curl.html %}

Index some documents containing different stores into the index:

```json
POST /stores/_bulk
{ "index": { "_id": "1" } }
{ "name": "Downtown Store", "store_location": { "lat": 40.7510, "lon": -73.9900 } }
{ "index": { "_id": "2" } }
{ "name": "Suburban Store", "store_location": { "lat": 40.8300, "lon": -74.2000 } }
{ "index": { "_id": "3" } }
{ "name": "Outskirts Store", "store_location": { "lat": 41.2000, "lon": -74.8000 } }
```
{% include copy-curl.html %}

For location-based faceting (like finding products available at nearby stores), use the `geo_distance` aggregation:

```json
POST /stores/_search
{
  "aggs": {
    "store_distance": {
      "geo_distance": {
        "field": "store_location",
        "origin": "40.7507, -73.9895",
        "unit": "mi",
        "ranges": [
          { "to": 5, "key": "Within 5 miles" },
          { "from": 5, "to": 25, "key": "5-25 miles away" },
          { "from": 25, "key": "Over 25 miles away" }
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains all three stores bucketed by distance:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 16,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 3,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "stores",
        "_id": "1",
        "_score": 1,
        "_source": {
          "name": "Downtown Store",
          "store_location": {
            "lat": 40.751,
            "lon": -73.99
          }
        }
      },
      {
        "_index": "stores",
        "_id": "2",
        "_score": 1,
        "_source": {
          "name": "Suburban Store",
          "store_location": {
            "lat": 40.83,
            "lon": -74.2
          }
        }
      },
      {
        "_index": "stores",
        "_id": "3",
        "_score": 1,
        "_source": {
          "name": "Outskirts Store",
          "store_location": {
            "lat": 41.2,
            "lon": -74.8
          }
        }
      }
    ]
  },
  "aggregations": {
    "store_distance": {
      "buckets": [
        {
          "key": "Within 5 miles",
          "from": 0,
          "to": 5,
          "doc_count": 1
        },
        {
          "key": "5-25 miles away",
          "from": 5,
          "to": 25,
          "doc_count": 1
        },
        {
          "key": "Over 25 miles away",
          "from": 25,
          "doc_count": 1
        }
      ]
    }
  }
}
```

</details>

## Advanced faceting scenarios

The following sections provide examples of advanced faceted search functionality.

### Post-filter faceting

When a user selects the `red` color, you want to show all available colors for the base query (t-shirts) while also showing other facets (like sizes) filtered to only show options available for red products. Use `post_filter` to achieve this:

```json
POST /products/_search
{
  "query": {
    "match": {
      "name": "t-shirt"
    }
  },
  "post_filter": {
    "term": { "color": "red" }
  },
  "aggs": {
    "all_colors": {
      "terms": {
        "field": "color"
      }
    },
    "sizes_for_red": {
      "filter": {
        "term": { "color": "red" }
      },
      "aggs": {
        "sizes": {
          "terms": {
            "field": "size"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the matching t-shirt and the color buckets for all t-shirts:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 57,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 0.48764127,
    "hits": [
      {
        "_index": "products",
        "_id": "1",
        "_score": 0.48764127,
        "_source": {
          "name": "Cotton T-shirt",
          "description": "Comfortable t-shirt for everyday wear",
          "color": "red",
          "size": "M",
          "price": 19.99
        }
      }
    ]
  },
  "aggregations": {
    "sizes_for_red": {
      "doc_count": 1,
      "sizes": {
        "doc_count_error_upper_bound": 0,
        "sum_other_doc_count": 0,
        "buckets": [
          {
            "key": "M",
            "doc_count": 1
          }
        ]
      }
    },
    "all_colors": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "blue",
          "doc_count": 1
        },
        {
          "key": "red",
          "doc_count": 1
        }
      ]
    }
  }
}
```

</details>

### Exclude filtering

To exclude specific facet values (for example, show all products except red ones), use the `must_not` clause:

```json
POST /products/_search
{
  "query": {
    "bool": {
      "must": [
        { "match_all": {} }
      ],
      "must_not": [
        { "term": { "color": "red" } }
      ]
    }
  },
  "aggs": {
    "colors": {
      "terms": {
        "field": "color"
      }
    },
    "sizes": {
      "terms": {
        "field": "size"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains non-red products with the color and size buckets:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 58,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "products",
        "_id": "2",
        "_score": 1,
        "_source": {
          "name": "T-shirt",
          "description": "Soft cotton t-shirt perfect for casual outings",
          "color": "blue",
          "size": "L",
          "price": 19.99
        }
      },
      {
        "_index": "products",
        "_id": "3",
        "_score": 1,
        "_source": {
          "name": "Jeans",
          "description": "Classic denim jeans with a modern fit",
          "color": "blue",
          "size": "M",
          "price": 49.99
        }
      }
    ]
  },
  "aggregations": {
    "sizes": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "L",
          "doc_count": 1
        },
        {
          "key": "M",
          "doc_count": 1
        }
      ]
    },
    "colors": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "blue",
          "doc_count": 2
        }
      ]
    }
  }
}
```

</details>

### Multi-select faceting

Multi-select faceting allows users to select multiple values within the same facet (for example, color: red AND blue). 

When multiple values are selected, the search returns products matching any of the selected values, and all facet counts reflect this filtered result set. This approach is useful when you want facet counts to update based on the user's current selections:

```json
POST /products/_search
{
  "query": {
    "bool": {
      "must": [
        { "match": { "name": "shirt" } }
      ],
      "filter": [
        {
          "terms": {
            "color": ["red", "blue"]
          }
        }
      ]
    }
  },
  "aggs": {
    "all_colors": {
      "terms": {
        "field": "color"
      }
    },
    "sizes_for_selected_colors": {
      "terms": {
        "field": "size"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains red and blue shirts:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 93,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 0.29767057,
    "hits": [
      {
        "_index": "products",
        "_id": "2",
        "_score": 0.29767057,
        "_source": {
          "name": "T-shirt",
          "description": "Soft cotton t-shirt perfect for casual outings",
          "color": "blue",
          "size": "L",
          "price": 19.99
        }
      },
      {
        "_index": "products",
        "_id": "1",
        "_score": 0.24382064,
        "_source": {
          "name": "Cotton T-shirt",
          "description": "Comfortable t-shirt for everyday wear",
          "color": "red",
          "size": "M",
          "price": 19.99
        }
      }
    ]
  },
  "aggregations": {
    "sizes_for_selected_colors": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "L",
          "doc_count": 1
        },
        {
          "key": "M",
          "doc_count": 1
        }
      ]
    },
    "all_colors": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "blue",
          "doc_count": 1
        },
        {
          "key": "red",
          "doc_count": 1
        }
      ]
    }
  }
}
```

</details>

### Multi-select faceting with global aggregations

Sometimes you want to filter search results by a facet value while still showing users all available options in that facet category. Global aggregations bypass query filters to show unfiltered facet counts, allowing users to see what other choices are available. This pattern is common in e-commerce where selecting a color should still display all color options, even if some have zero results in the current filtered set.

This example filters search results to red products only. The `all_colors` is a global aggregation in order to bypass the color filter and show counts for all available colors in the index. Other aggregations like `sizes_for_red` and `price_ranges_for_red` only aggregate values from the filtered result set:

```json
POST /products/_search
{
  "query": {
    "bool": {
      "filter": [
        {
          "term": {
            "color": "red"
          }
        }
      ]
    }
  },
  "aggs": {
    "all_colors": {
      "global": {},
      "aggs": {
        "color_counts": {
          "terms": {
            "field": "color"
          }
        }
      }
    },
    "sizes_for_red": {
      "terms": {
        "field": "size"
      }
    },
    "price_ranges_for_red": {
      "histogram": {
        "field": "price",
        "interval": 10
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the aggregations for all colors and filtered color:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 157,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 0,
    "hits": [
      {
        "_index": "products",
        "_id": "lRifHpgBpL-irzQEgGgo",
        "_score": 0,
        "_source": {
          "name": "Cotton T-shirt",
          "description": "Comfortable t-shirt for everyday wear",
          "color": "red",
          "size": "M",
          "price": 19.99
        }
      },
      {
        "_index": "products",
        "_id": "mBifHpgBpL-irzQEgGgo",
        "_score": 0,
        "_source": {
          "name": "Sweater",
          "description": "Warm wool sweater for cold weather",
          "color": "red",
          "size": "L",
          "price": 39.99
        }
      }
    ]
  },
  "aggregations": {
    "price_ranges_for_red": {
      "buckets": [
        {
          "key": 10,
          "doc_count": 1
        },
        {
          "key": 20,
          "doc_count": 0
        },
        {
          "key": 30,
          "doc_count": 1
        }
      ]
    },
    "sizes_for_red": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "L",
          "doc_count": 1
        },
        {
          "key": "M",
          "doc_count": 1
        }
      ]
    },
    "all_colors": {
      "doc_count": 4,
      "color_counts": {
        "doc_count_error_upper_bound": 0,
        "sum_other_doc_count": 0,
        "buckets": [
          {
            "key": "blue",
            "doc_count": 2
          },
          {
            "key": "red",
            "doc_count": 2
          }
        ]
      }
    }
  }
}
```

</details>

### Multi-select faceting with complex filtering

When you have multiple facet fields with selections (for example, red and blue colors and M and L sizes), you need separate aggregations for each facet in order to maintain proper facet counts. Notice how each aggregation excludes its own filter to show accurate counts. The `colors` aggregation filters by size but not color, while the `sizes` aggregation filters by color but not size:

```json
POST /products/_search
{
  "query": {
    "bool": {
      "must": [
        { "match": { "name": "shirt" } }
      ],
      "filter": [
        { "terms": { "color": ["red", "blue"] } },
        { "terms": { "size": ["M", "L"] } }
      ]
    }
  },
  "aggs": {
    "colors": {
      "filter": {
        "bool": {
          "must": [
            { "match": { "name": "shirt" } },
            { "terms": { "size": ["M", "L"] } }
          ]
        }
      },
      "aggs": {
        "colors": {
          "terms": {
            "field": "color"
          }
        }
      }
    },
    "sizes": {
      "filter": {
        "bool": {
          "must": [
            { "match": { "name": "shirt" } },
            { "terms": { "color": ["red", "blue"] } }
          ]
        }
      },
      "aggs": {
        "sizes": {
          "terms": {
            "field": "size"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}


### Hierarchical faceting

Hierarchical faceting enables drill-down through a hierarchy of attributes like Category > Subcategory > Product type. This can be implemented using fields that encode the hierarchy with delimiters.

First, create an ingest pipeline that uses the `path_hierarchy` tokenizer to automatically generate all hierarchy levels:

```json
PUT _ingest/pipeline/category-hierarchy-pipeline
{
  "description": "Split category path into multiple hierarchy fields",
  "processors": [
    {
      "script": {
        "lang": "painless",
        "source": """
          // Split the category_path on '>'
          def parts = ctx.category_path.splitOnToken('>');
          
          // Create individual-level fields
          if (parts.length >= 1) {
            ctx.category_level1 = parts[0].trim();
          }
          if (parts.length >= 2) {
            ctx.category_level2 = parts[1].trim();
          }
          if (parts.length >= 3) {
            ctx.category_level3 = parts[2].trim();
          }
          
          // Create hierarchy array with cumulative paths
          def hierarchy = [];
          def currentPath = '';
          for (int i = 0; i < parts.length; i++) {
            if (i == 0) {
              currentPath = parts[i].trim();
            } else {
              currentPath = currentPath + '>' + parts[i].trim();
            }
            hierarchy.add(currentPath);
          }
          ctx.category_hierarchy = hierarchy;
        """
      }
    }
  ]
}
```
{% include copy.html %}

If you're running commands in a terminal, use the corresponding cURL request:

```bash
curl -XPUT "http://localhost:9200/_ingest/pipeline/category-hierarchy-pipeline" -H 'Content-Type: application/json' -d'
{
  "description": "Split category path into multiple hierarchy fields",
  "processors": [
    {
      "script": {
        "lang": "painless",
        "source": "\n          // Split the category_path on '\''>'\''\n          def parts = ctx.category_path.splitOnToken('\''>'\'');\n          \n          // Create individual level fields\n          if (parts.length >= 1) {\n            ctx.category_level1 = parts[0].trim();\n          }\n          if (parts.length >= 2) {\n            ctx.category_level2 = parts[1].trim();\n          }\n          if (parts.length >= 3) {\n            ctx.category_level3 = parts[2].trim();\n          }\n          \n          // Create hierarchy array with cumulative paths\n          def hierarchy = [];\n          def currentPath = '\'''\'';\n          for (int i = 0; i < parts.length; i++) {\n            if (i == 0) {\n              currentPath = parts[i].trim();\n            } else {\n              currentPath = currentPath + '\''>'\'' + parts[i].trim();\n            }\n            hierarchy.add(currentPath);\n          }\n          ctx.category_hierarchy = hierarchy;\n        "
      }
    }
  ]
}'
```
{% include copy.html %}

This approach avoids using `fielddata` on text fields by explicitly storing each hierarchy level as separate keyword fields. While this requires more storage space, it provides better query performance and is more memory-efficient for aggregations. In production systems, you can automate the hierarchy level extraction during indexing using ingest pipelines or application logic.

Next, define your index mapping with hierarchical fields and set the pipeline as a default pipeline on the index:

```json
PUT /products-advanced
{
  "mappings": {
    "properties": {
      "name": { "type": "text" },
      "color": { "type": "keyword" },
      "category_path": { "type": "keyword" },
      "category_level1": { "type": "keyword" },
      "category_level2": { "type": "keyword" },
      "category_level3": { "type": "keyword" },
      "category_hierarchy": { "type": "keyword" }
    }
  },
  "settings": {
    "default_pipeline": "category-hierarchy-pipeline"
  }
}
```
{% include copy-curl.html %}

Index products with hierarchical data using the ingest pipeline to automatically generate hierarchy levels:

```json
POST /products-advanced/_bulk
{ "index": {"_id": 1} }
{ "name": "Cotton T-Shirt", "color": "red", "category_path": "Clothing>Shirts>T-Shirts" }
{ "index": {"_id": 2} }
{ "name": "Wool Sweater", "color": "red", "category_path": "Clothing>Sweaters>Wool" }
{ "index": {"_id": 3} }
{ "name": "Running Shoes", "color": "red", "category_path": "Footwear>Athletic>Running" }
{ "index": {"_id": 4} }
{ "name": "Dress Shirt", "color": "blue", "category_path": "Clothing>Shirts>Dress" }
{ "index": {"_id": 5} }
{ "name": "Hiking Boots", "color": "blue", "category_path": "Footwear>Outdoor>Hiking" }
{ "index": {"_id": 6} }
{ "name": "Casual Sneakers", "color": "blue", "category_path": "Footwear>Casual>Sneakers" }
```
{% include copy-curl.html %}

Query hierarchical facets using multiple aggregations to obtain different views of your category data. You can aggregate on individual hierarchy levels or view the complete hierarchy paths in a single result:

```json
POST /products-advanced/_search
{
  "aggs": {
    "top_categories": {
      "terms": {
        "field": "category_level1"
      }
    },
    "subcategories": {
      "terms": {
        "field": "category_level2"
      }
    },
    "full_hierarchy": {
      "terms": {
        "field": "category_hierarchy"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains a flat structure with separate aggregations results. The categories show counts with cross-category totals. For example, the `Athletic` subcategory shows combined count from both `Clothing` (1) and `Footwear` (1):

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 116,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 6,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "products-advanced",
        "_id": "1",
        "_score": 1,
        "_source": {
          "category_level1": "Clothing",
          "category_hierarchy": [
            "Clothing",
            "Clothing>Shirts",
            "Clothing>Shirts>T-Shirts"
          ],
          "category_level2": "Shirts",
          "color": "red",
          "category_path": "Clothing>Shirts>T-Shirts",
          "name": "Cotton T-Shirt",
          "category_level3": "T-Shirts"
        }
      },
      {
        "_index": "products-advanced",
        "_id": "2",
        "_score": 1,
        "_source": {
          "category_level1": "Clothing",
          "category_hierarchy": [
            "Clothing",
            "Clothing>Athletic",
            "Clothing>Athletic>Shirts"
          ],
          "category_level2": "Athletic",
          "color": "red",
          "category_path": "Clothing>Athletic>Shirts",
          "name": "Athletic shirt",
          "category_level3": "Shirts"
        }
      },
      {
        "_index": "products-advanced",
        "_id": "3",
        "_score": 1,
        "_source": {
          "category_level1": "Footwear",
          "category_hierarchy": [
            "Footwear",
            "Footwear>Athletic",
            "Footwear>Athletic>Running"
          ],
          "category_level2": "Athletic",
          "color": "red",
          "category_path": "Footwear>Athletic>Running",
          "name": "Running Shoes",
          "category_level3": "Running"
        }
      },
      {
        "_index": "products-advanced",
        "_id": "4",
        "_score": 1,
        "_source": {
          "category_level1": "Clothing",
          "category_hierarchy": [
            "Clothing",
            "Clothing>Shirts",
            "Clothing>Shirts>Dress"
          ],
          "category_level2": "Shirts",
          "color": "blue",
          "category_path": "Clothing>Shirts>Dress",
          "name": "Dress Shirt",
          "category_level3": "Dress"
        }
      },
      {
        "_index": "products-advanced",
        "_id": "5",
        "_score": 1,
        "_source": {
          "category_level1": "Clothing",
          "category_hierarchy": [
            "Clothing",
            "Clothing>Shirts",
            "Clothing>Shirts>Dress"
          ],
          "category_level2": "Shirts",
          "color": "white",
          "category_path": "Clothing>Shirts>Dress",
          "name": "Dress Shirt",
          "category_level3": "Dress"
        }
      },
      {
        "_index": "products-advanced",
        "_id": "6",
        "_score": 1,
        "_source": {
          "category_level1": "Footwear",
          "category_hierarchy": [
            "Footwear",
            "Footwear>Casual",
            "Footwear>Casual>Sneakers"
          ],
          "category_level2": "Casual",
          "color": "blue",
          "category_path": "Footwear>Casual>Sneakers",
          "name": "Casual Sneakers",
          "category_level3": "Sneakers"
        }
      }
    ]
  },
  "aggregations": {
    "full_hierarchy": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "Clothing",
          "doc_count": 4
        },
        {
          "key": "Clothing>Shirts",
          "doc_count": 3
        },
        {
          "key": "Clothing>Shirts>Dress",
          "doc_count": 2
        },
        {
          "key": "Footwear",
          "doc_count": 2
        },
        {
          "key": "Clothing>Athletic",
          "doc_count": 1
        },
        {
          "key": "Clothing>Athletic>Shirts",
          "doc_count": 1
        },
        {
          "key": "Clothing>Shirts>T-Shirts",
          "doc_count": 1
        },
        {
          "key": "Footwear>Athletic",
          "doc_count": 1
        },
        {
          "key": "Footwear>Athletic>Running",
          "doc_count": 1
        },
        {
          "key": "Footwear>Casual",
          "doc_count": 1
        },
        {
          "key": "Footwear>Casual>Sneakers",
          "doc_count": 1
        }
      ]
    },
    "top_categories": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "Clothing",
          "doc_count": 4
        },
        {
          "key": "Footwear",
          "doc_count": 2
        }
      ]
    },
    "subcategories": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "Shirts",
          "doc_count": 3
        },
        {
          "key": "Athletic",
          "doc_count": 2
        },
        {
          "key": "Casual",
          "doc_count": 1
        }
      ]
    }
  }
}
```

</details>

For hierarchical navigation, use nested aggregations:

```json
POST /products-advanced/_search
{
  "aggs": {
    "top_categories": {
      "terms": {
        "field": "category_level1"
      },
      "aggs": {
        "subcategories": {
          "terms": {
            "field": "category_level2"
          }
        }
      }
    },
    "full_hierarchy": {
      "terms": {
        "field": "category_hierarchy"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response has a hierarchical structure with subcategories nested under their parent categories. For example, `Athletic` appears under both `Clothing` (1) and `Footwear` (1). Subcategory counts are scoped to their parent category:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 79,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 6,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "products-advanced",
        "_id": "1",
        "_score": 1,
        "_source": {
          "category_level1": "Clothing",
          "category_hierarchy": [
            "Clothing",
            "Clothing>Shirts",
            "Clothing>Shirts>T-Shirts"
          ],
          "category_level2": "Shirts",
          "color": "red",
          "category_path": "Clothing>Shirts>T-Shirts",
          "name": "Cotton T-Shirt",
          "category_level3": "T-Shirts"
        }
      },
      {
        "_index": "products-advanced",
        "_id": "2",
        "_score": 1,
        "_source": {
          "category_level1": "Clothing",
          "category_hierarchy": [
            "Clothing",
            "Clothing>Athletic",
            "Clothing>Athletic>Shirts"
          ],
          "category_level2": "Athletic",
          "color": "red",
          "category_path": "Clothing>Athletic>Shirts",
          "name": "Athletic shirt",
          "category_level3": "Shirts"
        }
      },
      {
        "_index": "products-advanced",
        "_id": "3",
        "_score": 1,
        "_source": {
          "category_level1": "Footwear",
          "category_hierarchy": [
            "Footwear",
            "Footwear>Athletic",
            "Footwear>Athletic>Running"
          ],
          "category_level2": "Athletic",
          "color": "red",
          "category_path": "Footwear>Athletic>Running",
          "name": "Running Shoes",
          "category_level3": "Running"
        }
      },
      {
        "_index": "products-advanced",
        "_id": "4",
        "_score": 1,
        "_source": {
          "category_level1": "Clothing",
          "category_hierarchy": [
            "Clothing",
            "Clothing>Shirts",
            "Clothing>Shirts>Dress"
          ],
          "category_level2": "Shirts",
          "color": "blue",
          "category_path": "Clothing>Shirts>Dress",
          "name": "Dress Shirt",
          "category_level3": "Dress"
        }
      },
      {
        "_index": "products-advanced",
        "_id": "5",
        "_score": 1,
        "_source": {
          "category_level1": "Clothing",
          "category_hierarchy": [
            "Clothing",
            "Clothing>Shirts",
            "Clothing>Shirts>Dress"
          ],
          "category_level2": "Shirts",
          "color": "white",
          "category_path": "Clothing>Shirts>Dress",
          "name": "Dress Shirt",
          "category_level3": "Dress"
        }
      },
      {
        "_index": "products-advanced",
        "_id": "6",
        "_score": 1,
        "_source": {
          "category_level1": "Footwear",
          "category_hierarchy": [
            "Footwear",
            "Footwear>Casual",
            "Footwear>Casual>Sneakers"
          ],
          "category_level2": "Casual",
          "color": "blue",
          "category_path": "Footwear>Casual>Sneakers",
          "name": "Casual Sneakers",
          "category_level3": "Sneakers"
        }
      }
    ]
  },
  "aggregations": {
    "full_hierarchy": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "Clothing",
          "doc_count": 4
        },
        {
          "key": "Clothing>Shirts",
          "doc_count": 3
        },
        {
          "key": "Clothing>Shirts>Dress",
          "doc_count": 2
        },
        {
          "key": "Footwear",
          "doc_count": 2
        },
        {
          "key": "Clothing>Athletic",
          "doc_count": 1
        },
        {
          "key": "Clothing>Athletic>Shirts",
          "doc_count": 1
        },
        {
          "key": "Clothing>Shirts>T-Shirts",
          "doc_count": 1
        },
        {
          "key": "Footwear>Athletic",
          "doc_count": 1
        },
        {
          "key": "Footwear>Athletic>Running",
          "doc_count": 1
        },
        {
          "key": "Footwear>Casual",
          "doc_count": 1
        },
        {
          "key": "Footwear>Casual>Sneakers",
          "doc_count": 1
        }
      ]
    },
    "top_categories": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "Clothing",
          "doc_count": 4,
          "subcategories": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 0,
            "buckets": [
              {
                "key": "Shirts",
                "doc_count": 3
              },
              {
                "key": "Athletic",
                "doc_count": 1
              }
            ]
          }
        },
        {
          "key": "Footwear",
          "doc_count": 2,
          "subcategories": {
            "doc_count_error_upper_bound": 0,
            "sum_other_doc_count": 0,
            "buckets": [
              {
                "key": "Athletic",
                "doc_count": 1
              },
              {
                "key": "Casual",
                "doc_count": 1
              }
            ]
          }
        }
      ]
    }
  }
}
```

</details>

Prefix queries enable filtering on specific branches of a category hierarchy, allowing you to scope results to a particular category level and all its subcategories. To show products only in the `Clothing>Shirts` category and its subcategories, use the `keyword` field for exact prefix matching:

```json
POST /products-advanced/_search
{
  "query": {
    "prefix": {
      "category_path": "Clothing>Shirts"
    }
  }
}
```
{% include copy-curl.html %}

The response contains the matching documents. Note that the athletic shirt is not returned:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 44,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 3,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "products-advanced",
        "_id": "1",
        "_score": 1,
        "_source": {
          "category_level1": "Clothing",
          "category_hierarchy": [
            "Clothing",
            "Clothing>Shirts",
            "Clothing>Shirts>T-Shirts"
          ],
          "category_level2": "Shirts",
          "color": "red",
          "category_path": "Clothing>Shirts>T-Shirts",
          "name": "Cotton T-Shirt",
          "category_level3": "T-Shirts"
        }
      },
      {
        "_index": "products-advanced",
        "_id": "4",
        "_score": 1,
        "_source": {
          "category_level1": "Clothing",
          "category_hierarchy": [
            "Clothing",
            "Clothing>Shirts",
            "Clothing>Shirts>Dress"
          ],
          "category_level2": "Shirts",
          "color": "blue",
          "category_path": "Clothing>Shirts>Dress",
          "name": "Dress Shirt",
          "category_level3": "Dress"
        }
      },
      {
        "_index": "products-advanced",
        "_id": "5",
        "_score": 1,
        "_source": {
          "category_level1": "Clothing",
          "category_hierarchy": [
            "Clothing",
            "Clothing>Shirts",
            "Clothing>Shirts>Dress"
          ],
          "category_level2": "Shirts",
          "color": "white",
          "category_path": "Clothing>Shirts>Dress",
          "name": "Dress Shirt",
          "category_level3": "Dress"
        }
      }
    ]
  }
}
```

</details>

To aggregate by color on the `Clothing` category only, use the following request: 

```json
POST /products-advanced/_search
{
  "query": {
    "prefix": {
      "category_path": "Clothing>"
    }
  },
  "aggs": {
    "colors": {
      "terms": {
        "field": "color"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains only `Clothing` products:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 30,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 4,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "products-advanced",
        "_id": "1",
        "_score": 1,
        "_source": {
          "category_level1": "Clothing",
          "category_hierarchy": [
            "Clothing",
            "Clothing>Shirts",
            "Clothing>Shirts>T-Shirts"
          ],
          "category_level2": "Shirts",
          "color": "red",
          "category_path": "Clothing>Shirts>T-Shirts",
          "name": "Cotton T-Shirt",
          "category_level3": "T-Shirts"
        }
      },
      {
        "_index": "products-advanced",
        "_id": "2",
        "_score": 1,
        "_source": {
          "category_level1": "Clothing",
          "category_hierarchy": [
            "Clothing",
            "Clothing>Athletic",
            "Clothing>Athletic>Shirts"
          ],
          "category_level2": "Athletic",
          "color": "red",
          "category_path": "Clothing>Athletic>Shirts",
          "name": "Athletic shirt",
          "category_level3": "Shirts"
        }
      },
      {
        "_index": "products-advanced",
        "_id": "4",
        "_score": 1,
        "_source": {
          "category_level1": "Clothing",
          "category_hierarchy": [
            "Clothing",
            "Clothing>Shirts",
            "Clothing>Shirts>Dress"
          ],
          "category_level2": "Shirts",
          "color": "blue",
          "category_path": "Clothing>Shirts>Dress",
          "name": "Dress Shirt",
          "category_level3": "Dress"
        }
      },
      {
        "_index": "products-advanced",
        "_id": "5",
        "_score": 1,
        "_source": {
          "category_level1": "Clothing",
          "category_hierarchy": [
            "Clothing",
            "Clothing>Shirts",
            "Clothing>Shirts>Dress"
          ],
          "category_level2": "Shirts",
          "color": "white",
          "category_path": "Clothing>Shirts>Dress",
          "name": "Dress Shirt",
          "category_level3": "Dress"
        }
      }
    ]
  },
  "aggregations": {
    "colors": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "red",
          "doc_count": 2
        },
        {
          "key": "blue",
          "doc_count": 1
        },
        {
          "key": "white",
          "doc_count": 1
        }
      ]
    }
  }
}
```

</details>

Similarly, you can aggregate the Clothing > Shirts category by specifying `"category_path": "Clothing>Shirts"` in the `prefix` query. Your application code can then strip prefixes for cleaner display (for example, changing `Clothing>Shirts` to `Shirts`) if necessary. OpenSearch does the heavy lifting (tokenizing and aggregating), while your application code handles the display formatting by stripping prefixes based on hierarchy level.


## Related articles

- [Mappings and field types]({{site.url}}{{site.baseurl}}/field-types/)
- [Supported field types]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/)
- [Query DSL]({{site.url}}{{site.baseurl}}/query-dsl/)
- [Query and filter context]({{site.url}}{{site.baseurl}}/query-dsl/query-filter-context/)
- [Aggregations]({{site.url}}{{site.baseurl}}/aggregations/)