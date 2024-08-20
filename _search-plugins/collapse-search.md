---
layout: default
title: Collapse search results
nav_order: 3
---

# Collapse search results

The collapse parameter in OpenSearch enables you to group search results by a particular field value, returning only the top document within each group. This feature is useful for reducing redundancy in search results by eliminating duplicates.

The collapse feature requires the field to be collapsed to be either a `keyword` or a `numeric` type.

## Example of collapsing search results

To populate our index with the data needed, we will define our index mappings and define an `item` field indexed as a `keyword`. 

#### Define the index mappings

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

#### Populate the index

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

The previous query will return the uncollapsed search results, showing all the documents, including both entries for "Chocolate Cake."

#### Search the index and collapse the results

To collapse search results by the `item` field and sort them by `price`, you can use the following query:

**Search query that collapses the results on the item field**

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

**Results collapsed on item field**

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

The collapsed search results example will show only one "Chocolate Cake" entry, demonstrating how collapsing works in reducing redundancy.

Collapsing affects only the top search results and does not change any aggregation results. The total number of hits shown in the response reflects all matching documents before collapsing is applied, including duplicates. However, the response doesn't tell you the exact number of unique groups formed by collapsing.

### Expanding collapsed results

You can expand each collapsed top hit with the `inner_hits` property. 

To demonstrate multiple inner hits, we'll retrieve the cheapest and most recent items for each type of cake.

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

To obtain several groups of inner hits for each collapsed result, you can set different criteria for each group. For example, you could request the three least expensive items and the three most recent items for every bakery item.

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
This query searches for documents in the `cakes` category and groups the search results by the `item_name` field. For each `item_name`, it retrieves the top 3 cheapest items and the top 3 most recent items, sorted by the `baked_date` in descending order.

The expansion of the group is done by sending an additional query for each inner hit request for each collapsed hit returned in the response. This can significantly slow down the process if there are too many groups and/or inner hit requests. The max_concurrent_group_searches request parameter can be used to control the maximum number of concurrent searches allowed in this phase. The default is based on the number of data nodes and the default search thread pool size.

By using collapsing and inner hits effectively, you can manage large datasets in your bakery inventory, reduce redundancy, and focus on the most relevant information. This technique helps streamline search results, providing a clear and concise view of your data.
