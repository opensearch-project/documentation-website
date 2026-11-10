---
layout: default
title: Index
parent: Metadata fields
nav_order: 40
redirect_from:
  - /field-types/metadata-fields/index-metadata/
---

# Index metadata field

The `_index` metadata field contains the name of the index that stores a document. When a search targets several indexes, for example, through a comma-separated list, a wildcard pattern, or an alias, use `_index` to apply query conditions to only some of those indexes, count results per index, sort results by index, or return the index name from a script.

OpenSearch does not store `_index` as a field in the index. Each shard knows the name of the index to which it belongs, so it evaluates a condition on `_index` by comparing the condition against that name. As a result, a query on `_index` matches either all documents in a shard or none of them.

## Supported queries

You can search the `_index` field using the following queries:

- `term` and `terms`
- `match`, `query_string`, and `simple_query_string`, which OpenSearch converts to `term` queries for this field
- `prefix` and `wildcard`
- `exists`, which matches every document

The `regexp`, `fuzzy`, and `range` queries are not supported. OpenSearch rejects a search that uses them on `_index`.

Matching is case sensitive, so a `term` query for `ORDERS-ONLINE` does not match the `orders-online` index. To ignore case, set `case_insensitive` to `true` in the query.

A query on `_index` accepts alias names as well as index names. For example, if the `web-orders` alias points to the `orders-online` index, a `term` query for `web-orders` matches every document in `orders-online`. The `prefix` and `wildcard` queries also compare their patterns against alias names.

## Remote indexes

In a [cross-cluster search]({{site.url}}{{site.baseurl}}/search-plugins/cross-cluster-search/), the `_index` value of a document from a remote cluster includes the remote cluster alias followed by a colon, for example, `east:orders-online`. This prefixed name is returned in search hits and used as the key in aggregation buckets.

To match a remote index in a `prefix` or `wildcard` query, the pattern must contain the `:` separator. For example, `*:orders-*` matches documents in the `orders-*` indexes of every remote cluster but not in local indexes. A pattern without a separator, such as `east*orders-online`, is compared only against local index names, so it does not match documents in `east:orders-online`.

## Example: Applying query conditions to specific indexes

In this example, a store keeps online orders and in-store orders in separate indexes. The goal is to find orders for trail running products, but include online orders only if their total is at least 100.

First, add two online orders to the `orders-online` index:

```json
PUT /orders-online/_doc/1
{
  "product": "Trail running shoes",
  "total": 129.99
}
```
{% include copy-curl.html %}

```json
PUT /orders-online/_doc/2
{
  "product": "Trail running socks",
  "total": 14.5
}
```
{% include copy-curl.html %}

Then add an in-store order to the `orders-in-store` index:

```json
PUT /orders-in-store/_doc/1
{
  "product": "Trail running shoes",
  "total": 119.99
}
```
{% include copy-curl.html %}

Search both indexes using the `orders-*` pattern:

```json
GET /orders-*/_search
{
  "query": {
    "bool": {
      "must": {
        "match": {
          "product": "trail running"
        }
      },
      "should": [
        {
          "bool": {
            "filter": [
              { "term": { "_index": "orders-online" } },
              { "range": { "total": { "gte": 100 } } }
            ]
          }
        },
        {
          "term": {
            "_index": "orders-in-store"
          }
        }
      ],
      "minimum_should_match": 1
    }
  },
  "aggs": {
    "orders_per_channel": {
      "terms": {
        "field": "_index"
      }
    }
  },
  "sort": [
    { "_index": "asc" }
  ],
  "_source": ["product", "total"],
  "script_fields": {
    "source_index": {
      "script": {
        "source": "doc[\"_index\"].value"
      }
    }
  }
}
```
{% include copy-curl.html %}

The request uses the `_index` field in the following ways:

- The `should` clauses apply a different condition to each index. A document in `orders-online` must also have a `total` of at least 100, while any matching document in `orders-in-store` is returned.
- The `orders_per_channel` aggregation counts the matching orders in each index.
- The `sort` parameter orders the results alphabetically by index name.
- The `source_index` script field reads the index name from `doc["_index"]` and returns it in the `fields` object of each hit.

The response contains both shoe orders. The socks order is excluded because it is in `orders-online` and its total is less than 100:

```json
{
  "took": 18,
  "timed_out": false,
  "_shards": {
    "total": 2,
    "successful": 2,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": null,
    "hits": [
      {
        "_index": "orders-in-store",
        "_id": "1",
        "_score": null,
        "_source": {
          "product": "Trail running shoes",
          "total": 119.99
        },
        "fields": {
          "source_index": [
            "orders-in-store"
          ]
        },
        "sort": [
          "orders-in-store"
        ]
      },
      {
        "_index": "orders-online",
        "_id": "1",
        "_score": null,
        "_source": {
          "product": "Trail running shoes",
          "total": 129.99
        },
        "fields": {
          "source_index": [
            "orders-online"
          ]
        },
        "sort": [
          "orders-online"
        ]
      }
    ]
  },
  "aggregations": {
    "orders_per_channel": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "orders-in-store",
          "doc_count": 1
        },
        {
          "key": "orders-online",
          "doc_count": 1
        }
      ]
    }
  }
}
```
