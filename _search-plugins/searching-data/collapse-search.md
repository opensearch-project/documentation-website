---
layout: default
title: Collapse search results
parent: Customizing search results
nav_order: 40
redirect_from:
  - /search-plugins/collapse-search/
---

# Collapse search results

The `collapse` parameter groups search results by a particular field value. This returns only the top document within each group, which helps reduce redundancy by eliminating duplicates.

The `collapse` parameter requires the field being collapsed to be of either a `keyword` or a `numeric` type, have [doc values]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/doc-values/) enabled, and contain a single value in each document. OpenSearch rejects a collapse search if any matching document contains several values for the field.

You cannot use `collapse` in a [scroll]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/paginate/#scroll-search) search or together with [`rescore`]({{site.url}}{{site.baseurl}}/query-dsl/rescore/). OpenSearch rejects these requests. To page through collapsed results, use [`search_after`](#collapse-with-search_after).
{: .note}

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

This query returns the non-collapsed search results, showing all documents, including both entries for "Chocolate Cake".

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
      "value": 3,
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
          "baked_date": "2023-07-02T00:00:00Z"
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
          "baked_date": "2023-07-01T00:00:00Z"
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

## Collapse with search_after

The `from` and `size` parameters apply to the collapsed groups, so you can page through groups using them. For example, with `from` set to `1` and `size` set to `2`, the search skips the first group and returns the second and third groups. You can also paginate collapsed search results using the `search_after` parameter. The collapsed field and sort field must be the same, and only one sort field can be specified.

The following example shows how to use `collapse` with `search_after`:

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
  "sort": [
    {
      "item": "asc"
    }
  ],
  "search_after": ["Chocolate Cake"]
}
```
{% include copy-curl.html %}

## Expanding collapsed results

You can expand each collapsed top hit with the `inner_hits` property. For all options that you can specify in `inner_hits`, see [Inner hits]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/inner-hits/).

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

### Second-level collapsing

You can also collapse the inner hits of each group by specifying a `collapse` object in `inner_hits`. This returns the top document for each combination of the two fields. To demonstrate, add two kinds of cookies to the `bakery-items` index:

```json
POST /bakery-items/_bulk?refresh=true
{ "index": {} }
{ "item": "Oatmeal Cookie", "category": "cookies", "price": 3, "baked_date": "2023-07-03T00:00:00Z" }
{ "index": {} }
{ "item": "Oatmeal Cookie", "category": "cookies", "price": 4, "baked_date": "2023-07-05T00:00:00Z" }
{ "index": {} }
{ "item": "Sugar Cookie", "category": "cookies", "price": 2, "baked_date": "2023-07-05T00:00:00Z" }
```
{% include copy-curl.html %}

The following request collapses the results by `category` and, within each category, collapses the inner hits by `item`. As a result, each category contains the cheapest document for each of its items:

```json
GET /bakery-items/_search
{
  "_source": ["item", "price"],
  "sort": ["price"],
  "collapse": {
    "field": "category",
    "inner_hits": {
      "name": "cheapest_per_item",
      "size": 3,
      "_source": ["item", "price"],
      "sort": ["price"],
      "collapse": {
        "field": "item"
      }
    }
  }
}
```
{% include copy-curl.html %}

In the response, the `cookies` group contains one document for each cookie, and the `cakes` group contains one document for each cake. The more expensive `Oatmeal Cookie` and `Chocolate Cake` documents are omitted:

```json
{
  ...
  "hits": {
    ...
    "hits": [
      {
        ...
        "_source": {
          "item": "Sugar Cookie",
          "price": 2
        },
        "fields": {
          "category": [
            "cookies"
          ]
        },
        "inner_hits": {
          "cheapest_per_item": {
            "hits": {
              ...
              "hits": [
                {
                  ...
                  "_source": {
                    "item": "Sugar Cookie",
                    "price": 2
                  },
                  "fields": {
                    "item": [
                      "Sugar Cookie"
                    ]
                  }
                },
                {
                  ...
                  "_source": {
                    "item": "Oatmeal Cookie",
                    "price": 3
                  },
                  "fields": {
                    "item": [
                      "Oatmeal Cookie"
                    ]
                  }
                }
              ]
            }
          }
        }
      },
      {
        ...
        "_source": {
          "item": "Vanilla Cake",
          "price": 12
        },
        "fields": {
          "category": [
            "cakes"
          ]
        },
        "inner_hits": {
          "cheapest_per_item": {
            "hits": {
              ...
              "hits": [
                {
                  ...
                  "_source": {
                    "item": "Vanilla Cake",
                    "price": 12
                  },
                  "fields": {
                    "item": [
                      "Vanilla Cake"
                    ]
                  }
                },
                {
                  ...
                  "_source": {
                    "item": "Chocolate Cake",
                    "price": 15
                  },
                  "fields": {
                    "item": [
                      "Chocolate Cake"
                    ]
                  }
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

A second-level `collapse` object cannot contain `inner_hits`, so you cannot collapse results on more than two levels.
