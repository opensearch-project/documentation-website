---
layout: default
title: Has parent
parent: Joining queries
nav_order: 20
canonical_url: https://docs.opensearch.org/latest/query-dsl/joining/has-parent/
---

# Has parent query

The `has_parent` query returns child documents whose parent documents match a specific query. You can establish parent/child relationships between documents in the same index by using a [join]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/join/) field type.

The `has_parent` query is slower than other queries because of the join operation it performs. Performance decreases as the number of matching parent documents increases. Each `has_parent` query in your search may significantly impact query performance. If you prioritize speed, avoid using this query or limit its usage as much as possible.
{: .warning}

## Example 

Before you can run a `has_parent` query, your index must contain a [join]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/join/) field in order to establish parent/child relationships. The index mapping request uses the following format:

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

For this example, first configure an index that contains documents representing products and their brands as described in the [`has_child` query example]({{site.url}}{{site.baseurl}}/query-dsl/joining/has-child/). 

To search for the child of a parent, use a `has_parent` query. The following query returns child documents (products) made by the brand matching the query `economy`:

```json
GET testindex1/_search
{
  "query" : {
    "has_parent": {
      "parent_type":"brand",
      "query": {
        "match" : {
          "name": "economy"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response returns all products made by the brand:

```json
{
  "took": 11,
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
        "_id": "4",
        "_score": 1,
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
        "_score": 1,
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
```

## Retrieving inner hits

To return parent documents that matched the query, provide the `inner_hits` parameter:

```json
GET testindex1/_search
{
  "query" : {
    "has_parent": {
      "parent_type":"brand",
      "query": {
        "match" : {
          "name": "economy"
        }
      },
      "inner_hits": {}
    }
  }
}
```
{% include copy-curl.html %}

The response contains parent documents in the `inner_hits` field:

```json
{
  "took": 11,
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
        "_id": "4",
        "_score": 1,
        "_routing": "2",
        "_source": {
          "name": "Electronic watch",
          "sales_count": 300,
          "product_to_brand": {
            "name": "product",
            "parent": "2"
          }
        },
        "inner_hits": {
          "brand": {
            "hits": {
              "total": {
                "value": 1,
                "relation": "eq"
              },
              "max_score": 1.3862942,
              "hits": [
                {
                  "_index": "testindex1",
                  "_id": "2",
                  "_score": 1.3862942,
                  "_source": {
                    "name": "Economy brand",
                    "product_to_brand": "brand"
                  }
                }
              ]
            }
          }
        }
      },
      {
        "_index": "testindex1",
        "_id": "5",
        "_score": 1,
        "_routing": "2",
        "_source": {
          "name": "Digital watch",
          "sales_count": 100,
          "product_to_brand": {
            "name": "product",
            "parent": "2"
          }
        },
        "inner_hits": {
          "brand": {
            "hits": {
              "total": {
                "value": 1,
                "relation": "eq"
              },
              "max_score": 1.3862942,
              "hits": [
                {
                  "_index": "testindex1",
                  "_id": "2",
                  "_score": 1.3862942,
                  "_source": {
                    "name": "Economy brand",
                    "product_to_brand": "brand"
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

The following table lists all top-level parameters supported by `has_parent` queries.

| Parameter  | Required/Optional | Description  |
|:---|:---|:---|
| `parent_type` | Required | Specifies the name of the parent relationship as defined in the `join` field mapping. |
| `query` | Required | The query to run on parent documents. If a parent document matches the query, the child document is returned. |
| `ignore_unmapped` | Optional | Indicates whether to ignore unmapped `parent_type` fields and not return documents instead of throwing an error. You can provide this parameter when querying multiple indexes, some of which may not contain the `parent_type` field. Default is `false`. |
| `score` | Optional | Indicates whether the relevance score of a matching parent document is aggregated into its child documents. If `false`, then the relevance score of the parent document is ignored, and each child document is assigned a relevance score equal to the query's `boost`, which defaults to `1`. If `true`, then the relevance score of the matching parent document is aggregated into the relevance scores of its child documents. Default is `false`. |
| `inner_hits` | Optional | If provided, returns the underlying hits (parent documents) that matched the query. |


## Sorting limitations

The `has_parent` query does not support [sorting results]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/sort/) using standard sorting options. If you need to sort child documents by fields in their parent documents, you can use a [`function_score` query]({{site.url}}{{site.baseurl}}/query-dsl/compound/function-score/) and sort by the child document's score. 

For the preceding example, first add a `customer_satisfaction` field by which you'll sort the child documents belonging to the parent (brand) documents:

```json
PUT testindex1/_doc/1
{
  "name": "Luxury watch brand",
  "product_to_brand" : "brand",
  "customer_satisfaction": 4.5
}
```
{% include copy-curl.html %}

```json
PUT testindex1/_doc/2
{
  "name": "Economy watch brand",
  "product_to_brand" : "brand",
  "customer_satisfaction": 3.9
}
```
{% include copy-curl.html %}

Now you can sort child documents (products) based on the `customer_satisfaction` field of their parent brands. This query multiplies the score by the `customer_satisfaction` field of the parent documents:

```json
GET testindex1/_search
{
  "query": {
    "has_parent": {
      "parent_type": "brand",
      "score": true,
      "query": {
        "function_score": {
          "script_score": {
            "script": "_score * doc['customer_satisfaction'].value"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the products, sorted by the highest parent `customer_satisfaction`:

```json
{
  "took": 11,
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
    "max_score": 4.5,
    "hits": [
      {
        "_index": "testindex1",
        "_id": "3",
        "_score": 4.5,
        "_routing": "1",
        "_source": {
          "name": "Mechanical watch",
          "sales_count": 150,
          "product_to_brand": {
            "name": "product",
            "parent": "1"
          }
        }
      },
      {
        "_index": "testindex1",
        "_id": "4",
        "_score": 3.9,
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
        "_score": 3.9,
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
```

## Next steps

- Learn more about [retrieving inner hits]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/inner-hits/).