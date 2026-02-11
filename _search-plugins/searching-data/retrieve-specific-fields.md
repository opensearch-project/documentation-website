---
layout: default
parent: Search options
title: Retrieve specific fields
nav_order: 80
canonical_url: https://docs.opensearch.org/latest/search-plugins/searching-data/retrieve-specific-fields/
---

# Retrieve specific fields

When you run a basic search in OpenSearch, by default, the original JSON objects that were used during indexing are also returned in the response for each hit in the `_source` object. This can lead to large amounts of data being transferred through the network, increasing latency and costs. There are several ways to limit the responses to only the required information.

<!-- vale off -->
## Disabling _source
<!-- vale on -->
You can set `_source` to `false` in a search request to exclude the `_source` field from the response:

```json
GET /index1/_search
{
    "_source": false,
    "query": {
        "match_all": {}
  }
}
```
{% include copy-curl.html %}

Because no fields were selected in the preceding search, the retrieved hits will only include the `_index`, `_id` and `_score` of the hits:

```json
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

The `_source` can also be disabled in index mappings by using the following configuration:

```json
"mappings": {
  "_source": {
    "enabled": false
  }
}
```

If `_source` is disabled in the index mappings, [searching with docvalue fields]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/retrieve-specific-fields/#searching-with-docvalue_fields) and [searching with stored fields]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/retrieve-specific-fields/#searching-with-stored_fields) become extremely useful.

## Specifying the fields to retrieve

You can list the fields you want to retrieve in the `fields` parameter. Wildcard patterns are also accepted:

```json
GET /index1/_search
{
    "_source": false,
    "fields": ["age", "nam*"],
    "query": {
        "match_all": {}
  }
}
```
{% include copy-curl.html %}

The response contains the `name` and `age` fields:

```json
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

### Extracting fields with a custom format

You can also use object notation to apply a custom format to the chosen field.

If you have the following document:

```json
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

Then you can query using the `fields` parameter and a custom format:

```json
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
{% include copy-curl.html %}

Additionally, you can use [most fields]({{site.url}}{{site.baseurl}}/query-dsl/full-text/multi-match/#most-fields) and [field aliases]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/alias/) in the `fields` parameter because it queries both the document `_source` and `_mappings` of the index.
<!-- vale off -->
## Searching with docvalue_fields
<!-- vale on -->
To retrieve specific fields from the index, you can also use the `docvalue_fields` parameter. This parameter works slightly differently as compared to the `fields` parameter. It retrieves information from doc values rather than from the `_source` field, which is more efficient for fields that are not analyzed, like keyword, date, and numeric fields. Doc values have a columnar storage format optimized for efficient sorting and aggregations. It stores the values on disk in a way that is easy to read. When you use `docvalue_fields`, OpenSearch reads the values directly from this optimized storage format. It is useful for retrieving values of fields that are primarily used for sorting, aggregations, and for use in scripts.

The following example demonstrates how to use the `docvalue_fields` parameter.


1. Create an index with the following mappings:

    ```json
    PUT /my_index
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
    {% include copy-curl.html %}

2. Index the following documents into the newly created index:

    ```json
    POST /my_index/_doc/1
    {
      "title": "OpenSearch Basics",
      "author": "John Doe",
      "publication_date": "2021-01-01",
      "price": 29.99
    }
    ```
    {% include copy-curl.html %}
    
    ```json
    POST /my_index/_doc/2
    {
      "title": "Advanced OpenSearch",
      "author": "Jane Smith",
      "publication_date": "2022-01-01",
      "price": 39.99
    }
    ```
    {% include copy-curl.html %}

3. Retrieve only the `author` and `publication_date` fields using `docvalue_fields`:

    ```json
    POST /my_index/_search
    {
      "_source": false,
      "docvalue_fields": ["author", "publication_date"],
      "query": {
        "match_all": {}
      }
    }
    ```
    {% include copy-curl.html %}

The response contains the `author` and `publication_date` fields:

```json
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
<!-- vale off -->
### Using docvalue_fields with nested objects
<!-- vale on -->
In OpenSearch, if you want to retrieve doc values for nested objects, you cannot directly use the `docvalue_fields` parameter because it will return an empty array. Instead, you should use the `inner_hits` parameter with its own `docvalue_fields` property, as shown in the following example.

1. Define the index mappings:

    ```json
    PUT /my_index
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
    {% include copy-curl.html %}

2. Index your data:

    ```json
    POST /my_index/_doc/1
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
    {% include copy-curl.html %}

3. Perform a search with `inner_hits` and `docvalue_fields`:

    ```json
    POST /my_index/_search
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
    {% include copy-curl.html %}

The following is the expected response:

```json
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
<!-- vale off -->
## Searching with stored_fields
<!-- vale on -->
By default, OpenSearch stores the entire document in the `_source` field and uses it to return document contents in search results. However, you might also want to store certain fields separately for more efficient retrieval. You can explicitly store and retrieve specific document fields separately from the `_source` field by using `stored_fields`. 

Unlike `_source`, `stored_fields` must be explicitly defined in the mappings for fields you want to store separately. It can be useful if you frequently need to retrieve only a small subset of fields and want to avoid retrieving the entire `_source` field. The following example demonstrates how to use the `stored_fields` parameter.

1. Create an index with the following mappings:

    ```json
    PUT /my_index
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
    {% include copy-curl.html %}

2. Index your data:

    ```json
    POST /my_index/_doc/1
    {
      "title": "OpenSearch Basics",
      "author": "John Doe",
      "publication_date": "2022-01-01",
      "price": 29.99
    }
    ```
    {% include copy-curl.html %}
    
    ```json
    POST my_index/_doc/2
    {
      "title": "Advanced OpenSearch",
      "author": "Jane Smith",
      "publication_date": "2023-01-01",
      "price": 39.99
    }
    ```
    {% include copy-curl.html %}

3. Perform a search with `stored_fields`:

    ```json
    POST /my_index/_search
    {
      "_source": false,
      "stored_fields": ["title", "author"],
      "query": {
        "match_all": {}
      }
    }
    ```
    {% include copy-curl.html %}

The following is the expected response:

```json
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

The `stored_fields` parameter can be disabled completely by setting `stored_fields` to `_none_`.
{: .note}
<!-- vale off -->
### Searching stored_fields with nested objects
<!-- vale on -->
In OpenSearch, if you want to retrieve `stored_fields` for nested objects, you cannot directly use the `stored_fields` parameter because no data will be returned. Instead, you should use the `inner_hits` parameter with its own `stored_fields` property, as shown in the following example.

1. Create an index with the following mappings:

    ```json
    PUT /my_index
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
    {% include copy-curl.html %}

2. Index your data:

    ```json
    POST /my_index/_doc/1
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
    {% include copy-curl.html %}

3. Perform a search with `inner_hits` and `stored_fields`:

    ```json
    POST /my_index/_search
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
    {% include copy-curl.html %}

The following is the expected response:

```json
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

Source filtering is a way to control which parts of the `_source` field are included in the search response. Including only the necessary fields in the response can help reduce the amount of data transferred over the network and improve performance.

You can include or exclude specific fields from the `_source` field in the search response using complete field names or simple wildcard patterns. The following example demonstrates how to include specific fields.

1. Index your data:

    ```json
    PUT /my_index/_doc/1
    {
      "title": "OpenSearch Basics",
      "author": "John Doe",
      "publication_date": "2021-01-01",
      "price": 29.99
    }
    ```
    {% include copy-curl.html %}

2. Perform a search using source filtering:

    ```json
    POST /my_index/_search
    {
      "_source": ["title", "author"],
      "query": {
        "match_all": {}
      }
    }
    ```
    {% include copy-curl.html %}

The following is the expected response:

```json
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

You can choose to exclude fields by using the `"excludes"` parameter in a search request, as shown in the following example:

```json
POST /my_index/_search
{
  "_source": {
    "excludes": ["price"]
  },
  "query": {
    "match_all": {}
  }
}
```
{% include copy-curl.html %}

The following is the expected response:

```json
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

In some cases, both the `include` and `exclude` parameters may be necessary. The following examples demonstrate how to include and exclude fields in the same search.

Consider a `products` index containing the following document:

```json
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

To perform a search on this index while including only the `name`, `price`, `reviews`, and `supplier` fields in the response, and excluding the `contact_email` field from the `supplier` object and the `comment` field from the `reviews` object, execute the following search:

```json
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
{% include copy-curl.html %}

The following is the expected response:

```json
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

The `script_fields` parameter allows you to include custom fields whose values are computed using scripts in your search results. This can be useful for calculating values dynamically based on the document data. You can also retrieve `derived fields` by using a similar approach. For more information, see [Retrieving fields]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/derived/#retrieving-fields).

If you have an index of products, where each product document contains the `price` and `discount_percentage` fields. You can use `script_fields` parameter to include a custom field in the search results that displays the discounted price of each product. The following example demonstrates how to use the `script_fields` parameter:


1. Index the data:

    ```json
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
    {% include copy-curl.html %}

2. Use the `script_fields` parameter to include a custom field called `discounted_price` in the search results. This field will be calculated based on the `price` and `discount_percentage` fields using a script:

    ```json
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
    {% include copy-curl.html %}

You should receive the following response:

```json
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
