---
layout: default
title: Has child
parent: Joining queries
nav_order: 10
canonical_url: https://docs.opensearch.org/latest/query-dsl/joining/has-child/
---

# Has child query

The `has_child` query returns parent documents whose child documents match a specific query. You can establish parent/child relationships between documents in the same index by using a [join]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/join/) field type.

The `has_child` query is slower than other queries because of the join operation it performs. Performance decreases as the number of matching child documents pointing to different parent documents increases. Each `has_child` query in your search may significantly impact query performance. If you prioritize speed, avoid using this query or limit its usage as much as possible.
{: .warning}

## Example 

Before you can run a `has_child` query, your index must contain a [join]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/join/) field in order to establish parent/child relationships. The index mapping request uses the following format:

```json
PUT /example_index
{
  "mappings": {
    "properties": {
      "relationship_field": {
        "type": "join",
        "relations": {
          "parent_doc": "child_doc"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

In this example, you'll configure an index that contains documents representing products and their brands. 

First, create the index and establish the parent/child relationship between `brand` and `product`:

```json
PUT testindex1
{
  "mappings": {
    "properties": {
      "product_to_brand": { 
        "type": "join",
        "relations": {
          "brand": "product" 
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Index two parent (brand) documents:

```json
PUT testindex1/_doc/1
{
  "name": "Luxury brand",
  "product_to_brand" : "brand" 
}
```
{% include copy-curl.html %}

```json
PUT testindex1/_doc/2
{
  "name": "Economy brand",
  "product_to_brand" : "brand" 
}
```
{% include copy-curl.html %}

Index three child (product) documents:

```json
PUT testindex1/_doc/3?routing=1
{
  "name": "Mechanical watch",
  "sales_count": 150,
  "product_to_brand": {
    "name": "product", 
    "parent": "1" 
  }
}
```
{% include copy-curl.html %}

```json
PUT testindex1/_doc/4?routing=2
{
  "name": "Electronic watch",
  "sales_count": 300,
  "product_to_brand": {
    "name": "product", 
    "parent": "2" 
  }
}
```
{% include copy-curl.html %}

```json
PUT testindex1/_doc/5?routing=2
{
  "name": "Digital watch",
  "sales_count": 100,
  "product_to_brand": {
    "name": "product", 
    "parent": "2" 
  }
}
```
{% include copy-curl.html %}

To search for the parent of a child, use a `has_child` query. The following query returns parent documents (brands) that make watches:

```json
GET testindex1/_search
{
  "query" : {
    "has_child": {
      "type":"product",
      "query": {
        "match" : {
            "name": "watch"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response returns both brands:

```json
{
  "took": 15,
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
        "_index": "testindex1",
        "_id": "1",
        "_score": 1,
        "_source": {
          "name": "Luxury brand",
          "product_to_brand": "brand"
        }
      },
      {
        "_index": "testindex1",
        "_id": "2",
        "_score": 1,
        "_source": {
          "name": "Economy brand",
          "product_to_brand": "brand"
        }
      }
    ]
  }
}
```

## Retrieving inner hits

To return child documents that matched the query, provide the `inner_hits` parameter:

```json
GET testindex1/_search
{
  "query" : {
    "has_child": {
      "type":"product",
      "query": {
        "match" : {
            "name": "watch"
        }
      },
      "inner_hits": {}
    }
  }
}
```
{% include copy-curl.html %}

The response contains child documents in the `inner_hits` field:

```json
{
  "took": 52,
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
        "_index": "testindex1",
        "_id": "1",
        "_score": 1,
        "_source": {
          "name": "Luxury brand",
          "product_to_brand": "brand"
        },
        "inner_hits": {
          "product": {
            "hits": {
              "total": {
                "value": 1,
                "relation": "eq"
              },
              "max_score": 0.53899646,
              "hits": [
                {
                  "_index": "testindex1",
                  "_id": "3",
                  "_score": 0.53899646,
                  "_routing": "1",
                  "_source": {
                    "name": "Mechanical watch",
                    "sales_count": 150,
                    "product_to_brand": {
                      "name": "product",
                      "parent": "1"
                    }
                  }
                }
              ]
            }
          }
        }
      },
      {
        "_index": "testindex1",
        "_id": "2",
        "_score": 1,
        "_source": {
          "name": "Economy brand",
          "product_to_brand": "brand"
        },
        "inner_hits": {
          "product": {
            "hits": {
              "total": {
                "value": 2,
                "relation": "eq"
              },
              "max_score": 0.53899646,
              "hits": [
                {
                  "_index": "testindex1",
                  "_id": "4",
                  "_score": 0.53899646,
                  "_routing": "2",
                  "_source": {
                    "name": "Electronic watch",
                    "sales_count": 300,
                    "product_to_brand": {
                      "name": "product",
                      "parent": "2"
                    }
                  }
                },
                {
                  "_index": "testindex1",
                  "_id": "5",
                  "_score": 0.53899646,
                  "_routing": "2",
                  "_source": {
                    "name": "Digital watch",
                    "sales_count": 100,
                    "product_to_brand": {
                      "name": "product",
                      "parent": "2"
                    }
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

For more information about retrieving inner hits, see [Inner hits]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/inner-hits/).

## Parameters

The following table lists all top-level parameters supported by `has_child` queries.

| Parameter  | Required/Optional | Description  |
|:---|:---|:---|
| `type` | Required | Specifies the name of the child relationship as defined in the `join` field mapping. |
| `query` | Required | The query to run on child documents. If a child document matches the query, the parent document is returned. |
| `ignore_unmapped` | Optional | Indicates whether to ignore unmapped `type` fields and not return documents instead of throwing an error. You can provide this parameter when querying multiple indexes, some of which may not contain the `type` field. Default is `false`. |
| `max_children` | Optional | The maximum number of matching child documents for a parent document. If exceeded, the parent document is excluded from the search results. |
| `min_children` | Optional | The minimum number of matching child documents required for a parent document to be included in the results. If not met, the parent is excluded. Default is `1`.|
| `score_mode` | Optional | Defines how scores of matching child documents influence the parent document's score. Valid values are: <br> - `none`: Ignores the relevance scores of child documents and assigns a score of `0` to the parent document. <br> - `avg`: Uses the average relevance score of all matching child documents. <br> - `max`: Assigns the highest relevance score from the matching child documents to the parent. <br> - `min`: Assigns the lowest relevance score from the matching child documents to the parent. <br> - `sum`: Sums the relevance scores of all matching child documents. <br> Default is `none`. |
| `inner_hits` | Optional | If provided, returns the underlying hits (child documents) that matched the query. |


## Sorting limitations

The `has_child` query does not support [sorting results]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/sort/) using standard sorting options. If you need to sort parent documents by fields in their child documents, you can use a [`function_score` query]({{site.url}}{{site.baseurl}}/query-dsl/compound/function-score/) and sort by the parent document's score. 

In the preceding example, you can sort parent documents (brands) based on the `sales_count` of their child products. This query multiplies the score by the `sales_count` field of the child documents and assigns the highest relevance score from the matching child documents to the parent:

```json
GET testindex1/_search
{
  "query": {
    "has_child": {
      "type": "product",
      "query": {
        "function_score": {
          "script_score": {
            "script": "_score * doc['sales_count'].value"
          }
        }
      },
      "score_mode": "max"
    }
  }
}
```
{% include copy-curl.html %}

The response contains the brands sorted by the highest child `sales_count`:

```json
{
  "took": 6,
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
    "max_score": 300,
    "hits": [
      {
        "_index": "testindex1",
        "_id": "2",
        "_score": 300,
        "_source": {
          "name": "Economy brand",
          "product_to_brand": "brand"
        }
      },
      {
        "_index": "testindex1",
        "_id": "1",
        "_score": 150,
        "_source": {
          "name": "Luxury brand",
          "product_to_brand": "brand"
        }
      }
    ]
  }
}
```

## Next steps

- Learn more about [retrieving inner hits]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/inner-hits/).