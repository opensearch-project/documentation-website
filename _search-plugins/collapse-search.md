---
layout: default
title: Collapse search results
nav_order: 3
canonical_url: https://docs.opensearch.org/latest/search-plugins/collapse-search/
---

# Collapse search results

The `collapse` parameter groups search results by a particular field value. This returns only the top document within each group, which helps reduce redundancy by eliminating duplicates.

The `collapse` parameter requires the field being collapsed to be of either a `keyword` or a `numeric` type.

---

## Collapsing search results

To populate an index with data, define the index mappings and an `item` field indexed as a `keyword`. The following example request shows you how to define index mappings, populate an index, and then search it.

#### Define index mappings

```json
PUT /bakery-items
{
  "mappings": {
    "properties": {
      "item": {
        "type": "keyword"
      },
      "category": {
        "type": "keyword"
      },
      "price": {
        "type": "float"
      },
      "baked_date": {
        "type": "date"
      }
    }
  }
}
```

#### Populate an index

```json
POST /bakery-items/_bulk
{ "index": {} }
{ "item": "Chocolate Cake", "category": "cakes", "price": 15, "baked_date": "2023-07-01T00:00:00Z" }
{ "index": {} }
{ "item": "Chocolate Cake", "category": "cakes", "price": 18, "baked_date": "2023-07-04T00:00:00Z" }
{ "index": {} }
{ "item": "Vanilla Cake", "category": "cakes", "price": 12, "baked_date": "2023-07-02T00:00:00Z" }
```

#### Search the index, returning all results

```json
GET /bakery-items/_search
{
  "query": {
    "match": {
      "category": "cakes"
    }
  },
  "sort": ["price"]
}
```

This query returns the uncollapsed search results, showing all documents, including both entries for "Chocolate Cake".

#### Search the index and collapse the results

To group search results by the `item` field and sort them by `price`, you can use the following query:

**Collapsed `item` field search results**

```json
GET /bakery-items/_search
{
  "query": {
    "match": {
      "category": "cakes"
    }
  },
  "collapse": {
    "field": "item"
  },
  "sort": ["price"]
}
```

**Response**

```json
{
  "took": 3,
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
    "max_score": null,
    "hits": [
      {
        "_index": "bakery-items",
        "_id": "mISga5EB2HLDXHkv9kAr",
        "_score": null,
        "_source": {
          "item": "Vanilla Cake",
          "category": "cakes",
          "price": 12,
          "baked_date": "2023-07-02T00:00:00Z",
          "baker": "Baker A"
        },
        "fields": {
          "item": [
            "Vanilla Cake"
          ]
        },
        "sort": [
          12
        ]
      },
      {
        "_index": "bakery-items",
        "_id": "loSga5EB2HLDXHkv9kAr",
        "_score": null,
        "_source": {
          "item": "Chocolate Cake",
          "category": "cakes",
          "price": 15,
          "baked_date": "2023-07-01T00:00:00Z",
          "baker": "Baker A"
        },
        "fields": {
          "item": [
            "Chocolate Cake"
          ]
        },
        "sort": [
          15
        ]
      }
    ]
  }
}
```

The collapsed search results will show only one "Chocolate Cake" entry, demonstrating how the `collapse` parameter reduces redundancy.

The `collapse` parameter affects only the top search results and does not change any aggregation results. The total number of hits shown in the response reflects all matching documents before the parameter is applied, including duplicates. However, the response doesn't indicate the exact number of unique groups formed by the operation.

---

## Expanding collapsed results

You can expand each collapsed top hit with the `inner_hits` property. 

The following example request applies `inner_hits` to retrieve the lowest-priced and most recent item, for each type of cake:

```json
GET /bakery-items/_search
{
  "query": {
    "match": {
      "category": "cakes"
    }
  },
  "collapse": {
    "field": "item",
    "inner_hits": [
      {
        "name": "cheapest_items",
        "size": 1,
        "sort": ["price"]
      },
      {
        "name": "newest_items",
        "size": 1,
        "sort": [{ "baked_date": "desc" }]
      }
    ]
  },
  "sort": ["price"]
}

```

### Multiple inner hits for each collapsed hit

To obtain several groups of inner hits for each collapsed result, you can set different criteria for each group. For example, lets request the three most recent items for every bakery item:

```json
GET /bakery-items/_search
{
  "query": {
    "match": {
      "category": "cakes"
    }
  },
  "collapse": {
    "field": "item",
    "inner_hits": [
      {
        "name": "cheapest_items",
        "size": 1,
        "sort": ["price"]
      },
      {
        "name": "newest_items",
        "size": 3,
        "sort": [{ "baked_date": "desc" }]
      }
    ]
  },
  "sort": ["price"]
}


```
This query searches for documents in the `cakes` category and groups the search results by the `item_name` field. For each `item_name`, it retrieves the top three lowest-priced items and the top three most recent items, sorted by `baked_date` in descending order.

You can expand the groups by sending an additional query for each inner hit request corresponding to each collapsed hit in the response. This can significantly slow down the process if there are too many groups or inner hit requests. The `max_concurrent_group_searches` request parameter can be used to control the maximum number of concurrent searches allowed in this phase. The default is based on the number of data nodes and the default search thread pool size.

