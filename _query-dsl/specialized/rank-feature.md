---
layout: default
title: Rank feature
parent: Specialized queries
nav_order: 75
---

# Rank feature

Use the `rank_feature` query to boost document scores based on numeric values in the document, such as relevance scores, popularity, or freshness. This query is ideal if you want to fine-tune relevance ranking using numerical features. Unlike [full-text queries]({{site.url}}{{site.baseurl}}/query-dsl/full-text/index/), `rank_feature` focuses solely on a numeric signal; it is most effective when combined with other queries in a compound query like `bool`.

The `rank_feature` query expects the target field to be mapped as a [`rank_feature` field type]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/rank/). This enables internally optimized scoring for fast and efficient boosting.

The score impact depends on the field value and the optional `saturation`, `log` or `sigmoid` function used. These functions are applied dynamically at query time to compute the final document score, they do not alter or store any values in the document itself.

## Parameters

The `rank_feature` query supports the following parameters.

| Parameter               | Data type | Required/Optional | Description                                                                                                                                                      |
| ----------------------- | --------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `field`                 | String    | Required          | A `rank_feature` or `rank_features` field that contributes to document scoring.                                                                                  |
| `boost`                 | Float     | Optional          | A multiplier applied to the score. Default is `1.0`. Values between 0 and 1 reduce the score, values above 1 amplify it.                                         |
| `saturation`            | Object    | Optional          | Applies a saturation function to the feature value. Boost grows with value but levels off beyond the `pivot`. Default function if no other function is provided. Only one function out of `saturation`, `log`, or `sigmoid` may be used at a time.|
| `log`                   | Object    | Optional          | Uses a logarithmic scoring function based on the field value. Best for large ranges of values. Only one function out of `saturation`, `log`, or `sigmoid` may be used at a time.                                                                  |
| `sigmoid`               | Object    | Optional          | Applies a sigmoid (S-shaped) curve to score impact, controlled by `pivot` and `exponent`. Only one function out of `saturation`, `log`, or `sigmoid` may be used at a time.                                                                        |
| `positive_score_impact` | Boolean   | Optional          | When `false`, lower values score higher. Useful for features like price, for which smaller is better. Defined as part of the mapping. Default is `true`.         |

## Example

The following examples demonstrate how to define and use a `rank_feature` field to influence document scoring.

### Create an index with rank feature field

Define an index with a `rank_feature` field to represent a signal like `popularity`:

```json
PUT /products
{
  "mappings": {
    "properties": {
      "title": { "type": "text" },
      "popularity": { "type": "rank_feature" }
    }
  }
}
```
{% include copy-curl.html %}

### Index example documents

Add sample products with varying popularity values:

```json
POST /products/_bulk
{ "index": { "_id": 1 } }
{ "title": "Wireless Earbuds", "popularity": 1 }
{ "index": { "_id": 2 } }
{ "title": "Bluetooth Speaker", "popularity": 10 }
{ "index": { "_id": 3 } }
{ "title": "Portable Charger", "popularity": 25 }
{ "index": { "_id": 4 } }
{ "title": "Smartwatch", "popularity": 50 }
{ "index": { "_id": 5 } }
{ "title": "Noise Cancelling Headphones", "popularity": 100 }
{ "index": { "_id": 6 } }
{ "title": "Gaming Laptop", "popularity": 250 }
{ "index": { "_id": 7 } }
{ "title": "4K Monitor", "popularity": 500 }
```
{% include copy-curl.html %}

### Basic rank feature query

You can boost results based on the `popularity` score using `rank_feature`:

```json
POST /products/_search
{
  "query": {
    "rank_feature": {
      "field": "popularity"
    }
  }
}
```
{% include copy-curl.html %}

This query alone does not perform filtering. Rather, it scores all documents based on the value of `popularity`. Higher values yield higher scores:

```json
{
  ...
  "hits": {
    "total": {
      "value": 7,
      "relation": "eq"
    },
    "max_score": 0.9252834,
    "hits": [
      {
        "_index": "products",
        "_id": "7",
        "_score": 0.9252834,
        "_source": {
          "title": "4K Monitor",
          "popularity": 500
        }
      },
      {
        "_index": "products",
        "_id": "6",
        "_score": 0.86095566,
        "_source": {
          "title": "Gaming Laptop",
          "popularity": 250
        }
      },
      {
        "_index": "products",
        "_id": "5",
        "_score": 0.71237755,
        "_source": {
          "title": "Noise Cancelling Headphones",
          "popularity": 100
        }
      },
      {
        "_index": "products",
        "_id": "4",
        "_score": 0.5532503,
        "_source": {
          "title": "Smartwatch",
          "popularity": 50
        }
      },
      {
        "_index": "products",
        "_id": "3",
        "_score": 0.38240916,
        "_source": {
          "title": "Portable Charger",
          "popularity": 25
        }
      },
      {
        "_index": "products",
        "_id": "2",
        "_score": 0.19851118,
        "_source": {
          "title": "Bluetooth Speaker",
          "popularity": 10
        }
      },
      {
        "_index": "products",
        "_id": "1",
        "_score": 0.024169207,
        "_source": {
          "title": "Wireless Earbuds",
          "popularity": 1
        }
      }
    ]
  }
}
```

### Combine with full-text search

To filter relevant results and boost them based on popularity, use the following request. This query ranks all documents matching "headphones" and boosts those with higher popularity:

```json
POST /products/_search
{
  "query": {
    "bool": {
      "must": {
        "match": {
          "title": "headphones"
        }
      },
      "should": {
        "rank_feature": {
          "field": "popularity"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}


### Boost parameter

The `boost` parameter allows you to scale the score contribution of the rank_feature clause. It’s especially useful in compound queries such as `bool`, where you want to control how much influence a numeric field (such as popularity, freshness, or relevance score) has on the final document ranking.

In the following example, the `bool` query matches documents with the term "headphones" in the `title` and boosts more popular results using a `rank_feature` clause with a `boost` of `2.0`. This doubles the contribution of the `rank_feature` score in the overall document score:

```json
POST /products/_search
{
  "query": {
    "bool": {
      "must": {
        "match": {
          "title": "headphones"
        }
      },
      "should": {
        "rank_feature": {
          "field": "popularity",
          "boost": 2.0
        }
      }
    }
  }
}
```
{% include copy-curl.html %}


### Configure score function

By default, the `rank_feature` query uses a `saturation` function with a `pivot` value derived from the field. You can explicitly set the function to `saturation`, `log` or `sigmoid`.

#### Saturation function

The `saturation` function is the default scoring method used in `rank_feature` queries. It assigns higher scores to documents with larger feature values, but the increase in score becomes more gradual as the value exceeds a specified pivot. This is useful when you want to give diminishing returns to very large values, for example, boosting `popularity` while avoiding over-rewarding extremely high numbers. The formula for calculating score is: `value of the rank_feature field / (value of the rank_feature field + pivot)`. The produced score is always between `0` and `1`. If the pivot is not provided, approximate geometric mean of all `rank_feature` values in the index is used. 

The following example uses `saturation` with a `pivot` of `50`:

```json
POST /products/_search
{
  "query": {
    "rank_feature": {
      "field": "popularity",
      "saturation": {
        "pivot": 50
      }
    }
  }
}
```
{% include copy-curl.html %}

The `pivot` defines the point at which the scoring growth slows down. Values higher than `pivot` still increase the score, but with diminishing returns, as can be seen in the returned hits:

```json
{
  ...
  "hits": {
    "total": {
      "value": 7,
      "relation": "eq"
    },
    "max_score": 0.9090909,
    "hits": [
      {
        "_index": "products",
        "_id": "7",
        "_score": 0.9090909,
        "_source": {
          "title": "4K Monitor",
          "popularity": 500
        }
      },
      {
        "_index": "products",
        "_id": "6",
        "_score": 0.8333333,
        "_source": {
          "title": "Gaming Laptop",
          "popularity": 250
        }
      },
      {
        "_index": "products",
        "_id": "5",
        "_score": 0.6666666,
        "_source": {
          "title": "Noise Cancelling Headphones",
          "popularity": 100
        }
      },
      {
        "_index": "products",
        "_id": "4",
        "_score": 0.5,
        "_source": {
          "title": "Smartwatch",
          "popularity": 50
        }
      },
      {
        "_index": "products",
        "_id": "3",
        "_score": 0.3333333,
        "_source": {
          "title": "Portable Charger",
          "popularity": 25
        }
      },
      {
        "_index": "products",
        "_id": "2",
        "_score": 0.16666669,
        "_source": {
          "title": "Bluetooth Speaker",
          "popularity": 10
        }
      },
      {
        "_index": "products",
        "_id": "1",
        "_score": 0.019607842,
        "_source": {
          "title": "Wireless Earbuds",
          "popularity": 1
        }
      }
    ]
  }
}
```

#### Log function

The log function is helpful when the range of values in your `rank_feature` field varies significantly. It applies a logarithmic scale to the `score`, which reduces the effect of extremely high values and helps normalize scoring across wide value distributions. This is especially useful when a small difference between low values should be more impactful than a large difference between high values. The score is calculated using the formula `log(scaling_factor + rank_feature field)`. The following example uses a `scaling_factor` of 2:

```json
POST /products/_search
{
  "query": {
    "rank_feature": {
      "field": "popularity",
      "log": {
        "scaling_factor": 2
      }
    }
  }
}
```
{% include copy-curl.html %}

In the example dataset, the `popularity` field ranges from `1` to `500`. The `log` function compresses the `score` contribution from large values like `250` and `500`, while still allowing documents with `10` or `25` to have meaningful scores. In contrast, if you applied the `saturation` function, documents above the pivot would rapidly approach the same maximum score:

```json
{
  ...
  "hits": {
    "total": {
      "value": 7,
      "relation": "eq"
    },
    "max_score": 6.2186003,
    "hits": [
      {
        "_index": "products",
        "_id": "7",
        "_score": 6.2186003,
        "_source": {
          "title": "4K Monitor",
          "popularity": 500
        }
      },
      {
        "_index": "products",
        "_id": "6",
        "_score": 5.529429,
        "_source": {
          "title": "Gaming Laptop",
          "popularity": 250
        }
      },
      {
        "_index": "products",
        "_id": "5",
        "_score": 4.624973,
        "_source": {
          "title": "Noise Cancelling Headphones",
          "popularity": 100
        }
      },
      {
        "_index": "products",
        "_id": "4",
        "_score": 3.9512436,
        "_source": {
          "title": "Smartwatch",
          "popularity": 50
        }
      },
      {
        "_index": "products",
        "_id": "3",
        "_score": 3.295837,
        "_source": {
          "title": "Portable Charger",
          "popularity": 25
        }
      },
      {
        "_index": "products",
        "_id": "2",
        "_score": 2.4849067,
        "_source": {
          "title": "Bluetooth Speaker",
          "popularity": 10
        }
      },
      {
        "_index": "products",
        "_id": "1",
        "_score": 1.0986123,
        "_source": {
          "title": "Wireless Earbuds",
          "popularity": 1
        }
      }
    ]
  }
}
```

#### Sigmoid function

The `sigmoid` function provides a smooth, S-shaped scoring curve, which is especially useful when you want to control the steepness and midpoint of the scoring impact. The score is derived using the formula `rank feature field value^exp / (rank feature field value^exp + pivot^exp)`. The following example uses a `sigmoid` function with a configured `pivot` and `exponent`. The `pivot` defines the value at which the score is 0.5. The `exponent` controls how steep the curve is. Lower values result in a sharper transition around the pivot:

```json
POST /products/_search
{
  "query": {
    "rank_feature": {
      "field": "popularity",
      "sigmoid": {
        "pivot": 50,
        "exponent": 0.5
      }
    }
  }
}
```
{% include copy-curl.html %}


The sigmoid function smoothly boosts scores around the `pivot` (in this example,`50`), giving moderate preference to values near the pivot while flattening out both high and low extremes:

```json
{
  ...
  "hits": {
    "total": {
      "value": 7,
      "relation": "eq"
    },
    "max_score": 0.7597469,
    "hits": [
      {
        "_index": "products",
        "_id": "7",
        "_score": 0.7597469,
        "_source": {
          "title": "4K Monitor",
          "popularity": 500
        }
      },
      {
        "_index": "products",
        "_id": "6",
        "_score": 0.690983,
        "_source": {
          "title": "Gaming Laptop",
          "popularity": 250
        }
      },
      {
        "_index": "products",
        "_id": "5",
        "_score": 0.58578646,
        "_source": {
          "title": "Noise Cancelling Headphones",
          "popularity": 100
        }
      },
      {
        "_index": "products",
        "_id": "4",
        "_score": 0.5,
        "_source": {
          "title": "Smartwatch",
          "popularity": 50
        }
      },
      {
        "_index": "products",
        "_id": "3",
        "_score": 0.41421357,
        "_source": {
          "title": "Portable Charger",
          "popularity": 25
        }
      },
      {
        "_index": "products",
        "_id": "2",
        "_score": 0.309017,
        "_source": {
          "title": "Bluetooth Speaker",
          "popularity": 10
        }
      },
      {
        "_index": "products",
        "_id": "1",
        "_score": 0.12389934,
        "_source": {
          "title": "Wireless Earbuds",
          "popularity": 1
        }
      }
    ]
  }
}
```

#### Invert score impact

By default, higher values lead to higher scores. If you want lower values to yield higher scores (for example, lower prices are more relevant), set `positive_score_impact` to `false` during index creation:

```json
PUT /products_new
{
  "mappings": {
    "properties": {
      "popularity": {
        "type": "rank_feature",
        "positive_score_impact": false
      }
    }
  }
}
```
{% include copy-curl.html %}
