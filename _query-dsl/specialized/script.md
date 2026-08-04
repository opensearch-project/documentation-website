---
layout: default
title: Script query
parent: Specialized queries
nav_order: 58
canonical_url: https://docs.opensearch.org/latest/query-dsl/specialized/script/
---

# Script query

Use the `script` query to filter documents based on a custom condition written in the Painless scripting language. This query returns documents for which the script evaluates to `true`, enabling advanced filtering logic that can't be expressed using standard queries.

The `script` query is computationally expensive and should be used sparingly. Only use it when necessary and ensure `search.allow_expensive_queries` is enabled (default is `true`). For more information, see [Expensive queries]({{site.url}}{{site.baseurl}}/query-dsl/#expensive-queries).
{: .important }

## Example

Create an index named `products` with the following mappings:

```json
PUT /products
{
  "mappings": {
    "properties": {
      "title": { "type": "text" },
      "price": { "type": "float" },
      "rating": { "type": "float" }
    }
  }
}
```
{% include copy-curl.html %}

Index example documents using the following request:

```json
POST /products/_bulk
{ "index": { "_id": 1 } }
{ "title": "Wireless Earbuds", "price": 99.99, "rating": 4.5 }
{ "index": { "_id": 2 } }
{ "title": "Bluetooth Speaker", "price": 79.99, "rating": 4.8 }
{ "index": { "_id": 3 } }
{ "title": "Noise Cancelling Headphones", "price": 199.99, "rating": 4.7 }
```
{% include copy-curl.html %}

## Basic script query

Return products with a rating higher than `4.6`:

```json
POST /products/_search
{
  "query": {
    "script": {
      "script": {
        "source": "doc['rating'].value > 4.6"
      }
    }
  }
}
```
{% include copy-curl.html %}

The returned hits only include documents with a `rating` higher than `4.6`:

```json
{
  ...
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
          "title": "Bluetooth Speaker",
          "price": 79.99,
          "rating": 4.8
        }
      },
      {
        "_index": "products",
        "_id": "3",
        "_score": 1,
        "_source": {
          "title": "Noise Cancelling Headphones",
          "price": 199.99,
          "rating": 4.7
        }
      }
    ]
  }
}
```

## Parameters

The `script` query takes the following top-level parameters.

| Parameter       | Required/Optional | Description                                           |
| --------------- | ----------------- | ----------------------------------------------------- |
| `script.source` | Required          | The script code that evaluates to `true` or `false`.  |
| `script.params` | Optional          | User-defined parameters referenced inside the script. |

## Using script parameters

You can use `params` to safely inject values, taking advantage of script compilation caching:

```json
POST /products/_search
{
  "query": {
    "script": {
      "script": {
        "source": "doc['price'].value < params.max_price",
        "params": {
          "max_price": 100
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The returned hits only include documents with a `price` of less than `100`:

```json
{
  ...
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "products",
        "_id": "1",
        "_score": 1,
        "_source": {
          "title": "Wireless Earbuds",
          "price": 99.99,
          "rating": 4.5
        }
      },
      {
        "_index": "products",
        "_id": "2",
        "_score": 1,
        "_source": {
          "title": "Bluetooth Speaker",
          "price": 79.99,
          "rating": 4.8
        }
      }
    ]
  }
}
```

## Combining multiple conditions

Use the following query to search for products with a `rating` higher than `4.5` and a `price` lower than `100`:

```json
POST /products/_search
{
  "query": {
    "script": {
      "script": {
        "source": "doc['rating'].value > 4.5 && doc['price'].value < 100"
      }
    }
  }
}
```
{% include copy-curl.html %}

Only the documents that match the requirements are returned:

```json
{
  "took": 12,
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
    "max_score": 1,
    "hits": [
      {
        "_index": "products",
        "_id": "2",
        "_score": 1,
        "_source": {
          "title": "Bluetooth Speaker",
          "price": 79.99,
          "rating": 4.8
        }
      }
    ]
  }
}
```
