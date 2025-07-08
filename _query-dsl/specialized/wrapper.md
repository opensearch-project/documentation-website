---

layout: default
title: Wrapper
parent: Specialized queries
nav_order: 80
---

# Wrapper

The `wrapper` query lets you submit a complete query in Base64-encoded JSON format. It is useful when the query must be embedded in contexts that only support string values.

Use this query only when you need to manage system constraints. For readability and maintainability, it's better to use standard JSON-based queries when possible.

## Example

Create an index named `products` with the following mappings:

```json
PUT /products
{
  "mappings": {
    "properties": {
      "title": { "type": "text" }
    }
  }
}
```
{% include copy-curl.html %}

Index sample documents:

```json
POST /products/_bulk
{ "index": { "_id": 1 } }
{ "title": "Wireless headphones with noise cancellation" }
{ "index": { "_id": 2 } }
{ "title": "Bluetooth speaker" }
{ "index": { "_id": 3 } }
{ "title": "Over-ear headphones with rich bass" }
```
{% include copy-curl.html %}

Encode the following query in Base64 format:

```bash
echo -n '{ "match": { "title": "headphones" } }' | base64
```
{% include copy.html %}

Execute the encoded query:

```json
POST /products/_search
{
  "query": {
    "wrapper": {
      "query": "eyAibWF0Y2giOiB7ICJ0aXRsZSI6ICJoZWFkcGhvbmVzIiB9IH0="
    }
  }
}
```
{% include copy-curl.html %}

The response contains the two matching documents:

```json
{
  ...
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 0.20098841,
    "hits": [
      {
        "_index": "products",
        "_id": "1",
        "_score": 0.20098841,
        "_source": {
          "title": "Wireless headphones with noise cancellation"
        }
      },
      {
        "_index": "products",
        "_id": "3",
        "_score": 0.18459359,
        "_source": {
          "title": "Over-ear headphones with rich bass"
        }
      }
    ]
  }
}
```
