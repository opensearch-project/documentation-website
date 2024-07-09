---
layout: default
title: Retrieve specific fields
nav_order: 250
---

# Retrieve specific fields

When you run a basic search in OpenSearch, by default, the original JSON objects that were used during indexing are also returned in response for each hit under the `_source` field. This can be large amounts of data that is being transferred through network without adding any additional benefit to the user, increasing latency and cost. There are different ways to limit the responses to only the required information.

---

#### Table of contents
1. TOC
{:toc}


---

## Disabling `_source`

You can include `"_source": false` line in the search request to prevent the `_source` field from being included in the response. See following example:

```
GET "/index1/_search?pretty"
{
    "_source": false,
    "query": {
        "match_all": {}
  }
}
```

As no fields were selected in the previous search, the retrieved hits will only include `_index`, `_id` and `_score` of the hits. As can be seen in the following example:

```
{
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "index1",
        "_id" : "41",
        "_score" : 1.0
      },
      {
        "_index" : "index1",
        "_id" : "51",
        "_score" : 1.0
      }
    ]
  }
}
```

## Specifying the fields to retrieve

You can list the fields of interest in the search request using `fields` parameter. Wildcard patterns are also accepted. See following example:

```
GET "/index1/_search?pretty"
{
    "_source": false,
    "fields": ["age", "nam*"],
    "query": {
        "match_all": {}
  }
}
```

Example response:

```
{
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "index1",
        "_id" : "41",
        "_score" : 1.0,
        "fields" : {
          "name" : [
            "John Doe"
          ],
          "age" : [
            30
          ]
        }
      },
      {
        "_index" : "index1",
        "_id" : "51",
        "_score" : 1.0,
        "fields" : {
          "name" : [
            "Jane Smith"
          ],
          "age" : [
            25
          ]
        }
      }
    ]
  }
}
```

### Extracting fields with custom format

You can also use object notation, to apply a custom format to the chosen field, see following example.

If you have the following document:

```
{
  "_index": "my_index",
  "_type": "_doc",
  "_id": "1",
  "_source": {
    "title": "Document 1",
    "date": "2023-07-04T12:34:56Z"
  }
}
```

You can query with `fields` parameter and custom format:

```
GET /my_index/_search
{
  "query": {
    "match_all": {}
  },
  "fields": {
    "date": {
      "format": "yyyy-MM-dd"
    }
  },
  "_source": false
}
```

Additionally, you can also use [most fields]({{site.url}}{{site.baseurl}}/query-dsl/full-text/multi-match/#most-fields) and [field aliases]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/alias/) with `fields` parameter, as it queries both document `_source` and `_mappings` of the index.

## Searching with docvalue_fields

`docvalue_fields` is another parameter you can use in OpenSearch to retrieve specific fields from the index, but it works slightly differently compared to the `fields` parameter. The `docvalue_fields` parameter retrieves details from doc values rather than from the `_source` field, which is more efficient for fields that are not analyzed, like keyword, date, and numeric fields. Doc values are a columnar storage format optimized for efficient sorting and aggregations. It stores the values on disk in a way that is easy to read. When you use `docvalue_fields`, OpenSearch reads the values directly from this optimized storage format. It is useful for retrieving values of fields that are primarily used for sorting, aggregations, and for use in scripts.

To better understand `docvalue_fields` see following example.


1. Create index `my_index` with the following mappings:

    ```
    PUT my_index
    {
      "mappings": {
        "properties": {
          "title": { "type": "text" },
          "author": { "type": "keyword" },
          "publication_date": { "type": "date" },
          "price": { "type": "double" }
        }
      }
    }
    ```

2. Index the following documents using the newly created index:
    ```
    POST my_index/_doc/1
    {
      "title": "OpenSearch Basics",
      "author": "John Doe",
      "publication_date": "2021-01-01",
      "price": 29.99
    }
    
    POST my_index/_doc/2
    {
      "title": "Advanced OpenSearch",
      "author": "Jane Smith",
      "publication_date": "2022-01-01",
      "price": 39.99
    }
    ```
3. Retrieve only the `author` and `publication_date` fields using `docvalue_fields`:

    ```
    POST my_index/_search
    {
      "_source": false,
      "docvalue_fields": ["author", "publication_date"],
      "query": {
        "match_all": {}
      }
    }
    ```

Expected response:

```
{
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 1.0,
    "hits": [
      {
        "_index": "my_index",
        "_id": "1",
        "_score": 1.0,
        "fields": {
          "author": ["John Doe"],
          "publication_date": ["2021-01-01T00:00:00.000Z"]
        }
      },
      {
        "_index": "my_index",
        "_id": "2",
        "_score": 1.0,
        "fields": {
          "author": ["Jane Smith"],
          "publication_date": ["2022-01-01T00:00:00.000Z"]
        }
      }
    ]
  }
}
```

### Using docvalue_fields with nested objects

In OpenSearch, if you want to retrieve doc values for nested objects, you cannot directly use the `docvalue_fields` parameter because it will return an empty array. Instead, you should use the `inner_hits` parameter with its own `docvalue_fields` property, see following example.

1. Define the Index and Mappings:
    ```
    PUT my_index
    {
      "mappings": {
        "properties": {
          "title": { "type": "text" },
          "author": { "type": "keyword" },
          "comments": {
            "type": "nested",
            "properties": {
              "username": { "type": "keyword" },
              "content": { "type": "text" },
              "created_at": { "type": "date" }
            }
          }
        }
      }
    }
    ```

2. Index your data:
    ```
    POST my_index/_doc/1
    {
      "title": "OpenSearch Basics",
      "author": "John Doe",
      "comments": [
        {
          "username": "alice",
          "content": "Great article!",
          "created_at": "2023-01-01T12:00:00Z"
        },
        {
          "username": "bob",
          "content": "Very informative.",
          "created_at": "2023-01-02T12:00:00Z"
        }
      ]
    }
    ```

3. Perform a search with `inner_hits` and `docvalue_fields`:
    ```
    POST my_index/_search
    {
      "query": {
        "nested": {
          "path": "comments",
          "query": {
            "match_all": {}
          },
          "inner_hits": {
            "docvalue_fields": ["username", "created_at"]
          }
        }
      }
    }
    ```

Expected response:

```
{
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1.0,
    "hits": [
      {
        "_index": "my_index",
        "_id": "1",
        "_score": 1.0,
        "_source": {
          "title": "OpenSearch Basics",
          "author": "John Doe",
          "comments": [
            {
              "username": "alice",
              "content": "Great article!",
              "created_at": "2023-01-01T12:00:00Z"
            },
            {
              "username": "bob",
              "content": "Very informative.",
              "created_at": "2023-01-02T12:00:00Z"
            }
          ]
        },
        "inner_hits": {
          "comments": {
            "hits": {
              "total": {
                "value": 2,
                "relation": "eq"
              },
              "max_score": 1.0,
              "hits": [
                {
                  "_index": "my_index",
                  "_id": "1",
                  "_nested": {
                    "field": "comments",
                    "offset": 0
                  },
                  "docvalue_fields": {
                    "username": ["alice"],
                    "created_at": ["2023-01-01T12:00:00Z"]
                  }
                },
                {
                  "_index": "my_index",
                  "_id": "1",
                  "_nested": {
                    "field": "comments",
                    "offset": 1
                  },
                  "docvalue_fields": {
                    "username": ["bob"],
                    "created_at": ["2023-01-02T12:00:00Z"]
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

## Searching with stored fields 

`stored_fields` is another feature in OpenSearch that allows you to explicitly store and retrieve specific fields from documents, separate from the `_source` field. By default, OpenSearch stores the entire document in the `_source` field and uses it to return document contents in search results. However, sometimes you might want to store certain fields separately for more efficient retrieval.

Unlike `_source`, `stored_fields` must be explicitly defined in the mappings for fields you want to store separately. It can be useful if you frequently need to retrieve only a small subset of fields and want to avoid retrieving the entire `_source` field. See following example.

1. Create index and mappings:
    ```
    PUT my_index
    {
      "mappings": {
        "properties": {
          "title": {
            "type": "text",
            "store": true  // Store the title field separately
          },
          "author": {
            "type": "keyword",
            "store": true  // Store the author field separately
          },
          "publication_date": {
            "type": "date"
          },
          "price": {
            "type": "double"
          }
        }
      }
    }
    ```

2. Index your data
    ```
    POST my_index/_doc/1
    {
      "title": "OpenSearch Basics",
      "author": "John Doe",
      "publication_date": "2022-01-01",
      "price": 29.99
    }
    
    POST my_index/_doc/2
    {
      "title": "Advanced OpenSearch",
      "author": "Jane Smith",
      "publication_date": "2023-01-01",
      "price": 39.99
    }
    ```

3. Perform a search with `stored_fields`
    ```
    POST my_index/_search
    {
      "_source": false,
      "stored_fields": ["title", "author"],
      "query": {
        "match_all": {}
      }
    }
    ```

Expected response:

```
{
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 1.0,
    "hits": [
      {
        "_index": "my_index",
        "_id": "1",
        "_score": 1.0,
        "fields": {
          "title": ["OpenSearch Basics"],
          "author": ["John Doe"]
        }
      },
      {
        "_index": "my_index",
        "_id": "2",
        "_score": 1.0,
        "fields": {
          "title": ["Advanced OpenSearch"],
          "author": ["Jane Smith"]
        }
      }
    ]
  }
}
```

Stored_fields can be disabled completely in search request using `"stored_fields": "_none_"`.
{: .note}

### Searching `stored_fields` with nested objects

In OpenSearch, if you want to retrieve `stored_fields` for nested objects, you cannot directly use the `stored_fields` parameter because no data will be returned. Instead, you should use the `inner_hits` parameter with its own `stored_fields` property, see following example.

1. Create index and mappings:
    ```
    PUT my_index
    {
      "mappings": {
        "properties": {
          "title": { "type": "text" },
          "author": { "type": "keyword" },
          "comments": {
            "type": "nested",
            "properties": {
              "username": { "type": "keyword", "store": true },
              "content": { "type": "text", "store": true },
              "created_at": { "type": "date", "store": true }
            }
          }
        }
      }
    }
    ```

2. Index your data:
    ```
    POST my_index/_doc/1
    {
      "title": "OpenSearch Basics",
      "author": "John Doe",
      "comments": [
        {
          "username": "alice",
          "content": "Great article!",
          "created_at": "2023-01-01T12:00:00Z"
        },
        {
          "username": "bob",
          "content": "Very informative.",
          "created_at": "2023-01-02T12:00:00Z"
        }
      ]
    }
    ```

3. Perform a search with `inner_hits` and `stored_fields`:
    ```
    POST my_index/_search
    {
      "_source": false,
      "query": {
        "nested": {
          "path": "comments",
          "query": {
            "match_all": {}
          },
          "inner_hits": {
            "stored_fields": ["comments.username", "comments.content", "comments.created_at"]
          }
        }
      }
    }
    ```

Expected response:

```
{
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1.0,
    "hits": [
      {
        "_index": "my_index",
        "_id": "1",
        "_score": 1.0,
        "inner_hits": {
          "comments": {
            "hits": {
              "total": {
                "value": 2,
                "relation": "eq"
              },
              "max_score": 1.0,
              "hits": [
                {
                  "_index": "my_index",
                  "_id": "1",
                  "_nested": {
                    "field": "comments",
                    "offset": 0
                  },
                  "fields": {
                    "comments.username": ["alice"],
                    "comments.content": ["Great article!"],
                    "comments.created_at": ["2023-01-01T12:00:00.000Z"]
                  }
                },
                {
                  "_index": "my_index",
                  "_id": "1",
                  "_nested": {
                    "field": "comments",
                    "offset": 1
                  },
                  "fields": {
                    "comments.username": ["bob"],
                    "comments.content": ["Very informative."],
                    "comments.created_at": ["2023-01-02T12:00:00.000Z"]
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

## Using source filtering

Source filtering in OpenSearch is a way to control which parts of the `_source` field are included in the search response. This can help reduce the amount of data transferred over the network and improve performance by including only the necessary fields in the response.

You can include or exclude specific fields from the `_source` field in the search response using complete field names or simple wildcard patterns. See following example:

1. Index your data:
    ```
    PUT my_index/_doc/1
    {
      "title": "OpenSearch Basics",
      "author": "John Doe",
      "publication_date": "2021-01-01",
      "price": 29.99
    }
    ```

2. Perform a search using source filtering:
    ```
    POST my_index/_search
    {
      "_source": ["title", "author"],
      "query": {
        "match_all": {}
      }
    }
    ```

Expected response:

```
{
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1.0,
    "hits": [
      {
        "_index": "my_index",
        "_id": "1",
        "_score": 1.0,
        "_source": {
          "title": "OpenSearch Basics",
          "author": "John Doe"
        }
      }
    ]
  }
}
```

### Excluding fields with source filtering

You can choose to exclude fields using `"excludes"` parameter in search request, see following example:

```
POST my_index/_search
{
  "_source": {
    "excludes": ["price"]
  },
  "query": {
    "match_all": {}
  }
}
```

Expected response:

```
{
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1.0,
    "hits": [
      {
        "_index": "my_index",
        "_id": "1",
        "_score": 1.0,
        "_source": {
          "title": "OpenSearch Basics",
          "author": "John Doe",
          "publication_date": "2021-01-01"
        }
      }
    ]
  }
}
```

### Including and excluding fields in the same search

There might be cases where both `include` and `exclude` parameters are necessary. See following examples which demonstrates the usefulness of this option.

If you have an index `products` with the following document:
```
{
  "product_id": "123",
  "name": "Smartphone",
  "category": "Electronics",
  "price": 699.99,
  "description": "A powerful smartphone with a sleek design.",
  "reviews": [
    {
      "user": "john_doe",
      "rating": 5,
      "comment": "Great phone!",
      "date": "2023-01-01"
    },
    {
      "user": "jane_doe",
      "rating": 4,
      "comment": "Good value for money.",
      "date": "2023-02-15"
    }
  ],
  "supplier": {
    "name": "TechCorp",
    "contact_email": "support@techcorp.com",
    "address": {
      "street": "123 Tech St",
      "city": "Techville",
      "zipcode": "12345"
    }
  },
  "inventory": {
    "stock": 50,
    "warehouse_location": "A1"
  }
}
```

If you want to perform a search, but in the response you only want to include the `name`, `price`, `reviews`, and `supplier` fields and exclude any `contact_email` fields from the `supplier` object, and `comment` fields from the `reviews` object. Following is the search you can run:

```
GET /products/_search
{
  "_source": {
    "includes": ["name", "price", "reviews.*", "supplier.*"],
    "excludes": ["reviews.comment", "supplier.contact_email"]
  },
  "query": {
    "match": {
      "category": "Electronics"
    }
  }
}
```

Expected response:

```
{
  "hits": {
    "hits": [
      {
        "_source": {
          "name": "Smartphone",
          "price": 699.99,
          "reviews": [
            {
              "user": "john_doe",
              "rating": 5,
              "date": "2023-01-01"
            },
            {
              "user": "jane_doe",
              "rating": 4,
              "date": "2023-02-15"
            }
          ],
          "supplier": {
            "name": "TechCorp",
            "address": {
              "street": "123 Tech St",
              "city": "Techville",
              "zipcode": "12345"
            }
          }
        }
      }
    ]
  }
}
```

## Using scripted fields

The `script_fields` parameter in OpenSearch allows you to include custom fields in your search results, where the values of these fields are computed using scripts. This can be useful for calculating values on the fly based on the data in the document.

Following example demonstrates the power of `script_fields`.

Let's say you have an index of products, and each product document contains the fields `price` and `discount_percentage`. You want to include a custom field in the search results that shows the discounted price of each product.


1. Index the data:
    ```
    PUT /products/_doc/123
    {
      "product_id": "123",
      "name": "Smartphone",
      "price": 699.99,
      "discount_percentage": 10,
      "category": "Electronics",
      "description": "A powerful smartphone with a sleek design."
    }
    ```

2. Search using `script_fields`:
You can now use the `script_fields` parameter to include a custom field called `discounted_price` in the search results. This field will be calculated based on the `price` and `discount_percentage` fields using a script. See following example:
```
GET /products/_search
{
  "_source": ["product_id", "name", "price", "discount_percentage"],
  "query": {
    "match": {
      "category": "Electronics"
    }
  },
  "script_fields": {
    "discounted_price": {
      "script": {
        "lang": "painless",
        "source": "doc[\"price\"].value * (1 - doc[\"discount_percentage\"].value / 100)"
      }
    }
  }
}
```

Example response:
```
{
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1.0,
    "hits": [
      {
        "_index": "products",
        "_id": "123",
        "_score": 1.0,
        "_source": {
          "product_id": "123",
          "name": "Smartphone",
          "price": 699.99,
          "discount_percentage": 10
        },
        "fields": {
          "discounted_price": [629.991]
        }
      }
    ]
  }
}
```
