---
layout: default
title: Collapse search results
nav_order: 3
---

# Collapse search results

The collapse parameter in OpenSearch enables you to group search results by a particular field value, returning only the top document within each group. This feature is useful for reducing redundancy in search results by eliminating duplicates.

### Example of collapsing search results

To collapse search results by the `item` field and sort them by `price`, you can use the following query:

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
  "sort": ["price"],
  "from": 0
}

```

Collapsing only impacts the top hits and does not influence aggregations. The total number of hits in the response represents the count of matching documents before any collapsing is applied. The exact number of unique groups formed by collapsing is not provided. For collapsing to work, the field must be a single-valued `keyword` or `numeric` type with `doc_values` enabled.

### Expanding collapsed results

You can expand each collapsed top hit with the `inner_hits` property. 

The following query will retrieve the top 5 items per bakery `item_name`, sorted by `price`.
``

```json
GET /bakery-items/_search
{
  "query": {
    "match": {
      "category": "Pastry"
    }
  },
  "collapse": {
    "field": "item_name",
    "inner_hits": {
      "name": "top_items",
      "size": 5,
      "sort": [{ "price": "asc" }]
    }
  },
  "sort": ["price"]
}

```

### Multiple Inner Hits for Each Collapsed Hit

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
    "field": "item_name",
    "inner_hits": [
      {
        "name": "cheapest_items",
        "size": 3,
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

### Second level of collapsing

Second level of collapsing is also supported and is applied to inner hits. 


```json
GET /bakery-items/_search
{
  "query": {
    "match": {
      "category": "cakes"
    }
  },
  "collapse": {
    "field": "baker",
    "inner_hits": {
      "name": "recent_items",
      "size": 3,
      "sort": [{ "baked_date": "desc" }]
    }
  }
}
```


response
```json
{
  "took": 8,
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
    "max_score": 0.61310446,
    "hits": [
      {
        "_index": "bakery-items",
        "_id": "fSW9KJEB3prnZWCKY5wg",
        "_score": 0.61310446,
        "_source": {
          "item_name": "Chocolate Cake",
          "category": "cakes",
          "price": 15,
          "baked_date": "2023-07-01T00:00:00Z",
          "baker": "Baker A"
        },
        "fields": {
          "baker": [
            "Baker A"
          ]
        },
        "inner_hits": {
          "recent_items": {
            "hits": {
              "total": {
                "value": 2,
                "relation": "eq"
              },
              "max_score": null,
              "hits": [
                {
                  "_index": "bakery-items",
                  "_id": "gCW9KJEB3prnZWCKY5wg",
                  "_score": null,
                  "_source": {
                    "item_name": "Chocolate Cake",
                    "category": "cakes",
                    "price": 18,
                    "baked_date": "2023-07-04T00:00:00Z",
                    "baker": "Baker A"
                  },
                  "sort": [
                    1688428800000
                  ]
                },
                {
                  "_index": "bakery-items",
                  "_id": "fSW9KJEB3prnZWCKY5wg",
                  "_score": null,
                  "_source": {
                    "item_name": "Chocolate Cake",
                    "category": "cakes",
                    "price": 15,
                    "baked_date": "2023-07-01T00:00:00Z",
                    "baker": "Baker A"
                  },
                  "sort": [
                    1688169600000
                  ]
                }
              ]
            }
          }
        }
      },
      {
        "_index": "bakery-items",
        "_id": "fiW9KJEB3prnZWCKY5wg",
        "_score": 0.61310446,
        "_source": {
          "item_name": "Vanilla Cake",
          "category": "cakes",
          "price": 12,
          "baked_date": "2023-07-02T00:00:00Z",
          "baker": "Baker B"
        },
        "fields": {
          "baker": [
            "Baker B"
          ]
        },
        "inner_hits": {
          "recent_items": {
            "hits": {
              "total": {
                "value": 2,
                "relation": "eq"
              },
              "max_score": null,
              "hits": [
                {
                  "_index": "bakery-items",
                  "_id": "gSW9KJEB3prnZWCKY5wg",
                  "_score": null,
                  "_source": {
                    "item_name": "Vanilla Cake",
                    "category": "cakes",
                    "price": 14,
                    "baked_date": "2023-07-05T00:00:00Z",
                    "baker": "Baker B"
                  },
                  "sort": [
                    1688515200000
                  ]
                },
                {
                  "_index": "bakery-items",
                  "_id": "fiW9KJEB3prnZWCKY5wg",
                  "_score": null,
                  "_source": {
                    "item_name": "Vanilla Cake",
                    "category": "cakes",
                    "price": 12,
                    "baked_date": "2023-07-02T00:00:00Z",
                    "baker": "Baker B"
                  },
                  "sort": [
                    1688256000000
                  ]
                }
              ]
            }
          }
        }
      },
      {
        "_index": "bakery-items",
        "_id": "fyW9KJEB3prnZWCKY5wg",
        "_score": 0.61310446,
        "_source": {
          "item_name": "Red Velvet Cake",
          "category": "cakes",
          "price": 20,
          "baked_date": "2023-07-03T00:00:00Z",
          "baker": "Baker C"
        },
        "fields": {
          "baker": [
            "Baker C"
          ]
        },
        "inner_hits": {
          "recent_items": {
            "hits": {
              "total": {
                "value": 2,
                "relation": "eq"
              },
              "max_score": null,
              "hits": [
                {
                  "_index": "bakery-items",
                  "_id": "giW9KJEB3prnZWCKY5wg",
                  "_score": null,
                  "_source": {
                    "item_name": "Red Velvet Cake",
                    "category": "cakes",
                    "price": 22,
                    "baked_date": "2023-07-06T00:00:00Z",
                    "baker": "Baker C"
                  },
                  "sort": [
                    1688601600000
                  ]
                },
                {
                  "_index": "bakery-items",
                  "_id": "fyW9KJEB3prnZWCKY5wg",
                  "_score": null,
                  "_source": {
                    "item_name": "Red Velvet Cake",
                    "category": "cakes",
                    "price": 20,
                    "baked_date": "2023-07-03T00:00:00Z",
                    "baker": "Baker C"
                  },
                  "sort": [
                    1688342400000
                  ]
                }
              ]
            }
          }
        }
      }
    ]
  }
}
```

By using collapsing and inner hits effectively, you can manage large datasets in your bakery inventory, reduce redundancy, and focus on the most relevant information. This technique helps streamline search results, providing a clear and concise view of your data.






