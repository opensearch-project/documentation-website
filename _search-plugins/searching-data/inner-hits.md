---
layout: default
title: Retrieve inner hits
parent: Search options
has_children: false
nav_order: 75
---

# Retrieve inner hits

In OpenSearch, when you perform a search using [nested objects]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/nested/) or [parent-join]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/join/), the underlying hits (nested inner objects or child documents) are hidden by default. You can retrieve inner hits by using the `inner_hits` parameter in the search query.

You can also use `inner_hits` with the following features:

  - [Highlight query matches]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/highlight/)
  - [Explain]({{site.url}}{{site.baseurl}}/api-reference/explain/)

## Inner hits with nested objects
Nested objects allow you to index an array of objects and maintain their relationship within the same document. The following example request uses the `inner_hits` parameter to retrieve the underlying inner hits.

1. Create an index mapping with a nested object:

    ```json
    PUT /my_index
    {
      "mappings": {
        "properties": {
          "user": {
            "type": "nested",
            "properties": {
              "name": { "type": "text" },
              "age": { "type": "integer" }
            }
          }
        }
      }
    }
    ```
    {% include copy-curl.html %}

2. Index data:

    ```json
    POST /my_index/_doc/1
    {
      "group": "fans",
      "user": [
        {
          "name": "John Doe",
          "age": 28
        },
        {
          "name": "Jane Smith",
          "age": 34
        }
      ]
    }
    ```
    {% include copy-curl.html %}

3. Query with `inner_hits`:

    ```json
    GET /my_index/_search
    {
      "query": {
        "nested": {
          "path": "user",
          "query": {
            "bool": {
              "must": [
                { "match": { "user.name": "John" } }
              ]
            }
          },
          "inner_hits": {}
        }
      }
    }
    ```
    {% include copy-curl.html %}

The preceding query searches for nested user objects containing the name John and returns the matching nested documents in the `inner_hits` section of the response:

```json
{
  "hits" : {
    "total" : {
      "value" : 1,
      "relation" : "eq"
    },
    "max_score" : 0.6931471,
    "hits" : [
      {
        "_index" : "my_index",
        "_id" : "1",
        "_score" : 0.6931471,
        "_source" : {
          "group" : "fans",
          "user" : [
            {
              "name" : "John Doe",
              "age" : 28
            },
            {
              "name" : "Jane Smith",
              "age" : 34
            }
          ]
        },
        "inner_hits" : {
          "user" : {
            "hits" : {
              "total" : {
                "value" : 1,
                "relation" : "eq"
              },
              "max_score" : 0.6931471,
              "hits" : [
                {
                  "_index" : "my_index",
                  "_id" : "1",
                  "_nested" : {
                    "field" : "user",
                    "offset" : 0
                  },
                  "_score" : 0.6931471,
                  "_source" : {
                    "name" : "John Doe",
                    "age" : 28
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
## Inner hits with parent/child objects
Parent-join relationships allow you to create relationships between documents of different types within the same index. The following example request searches with `inner_hits` using parent/child objects.

1. Create an index with a parent-join field:

    ```json
    PUT /my_index
    {
      "mappings": {
        "properties": {
          "my_join_field": {
            "type": "join",
            "relations": {
              "parent": "child"
            }
          },
          "text": {
            "type": "text"
          }
        }
      }
    }
    ```
    {% include copy-curl.html %}

2. Index data:

    ```json
    # Index a parent document
    PUT /my_index/_doc/1
    {
      "text": "This is a parent document",
      "my_join_field": "parent"
    }
    
    # Index a child document
    PUT /my_index/_doc/2?routing=1
    {
      "text": "This is a child document",
      "my_join_field": {
        "name": "child",
        "parent": "1"
      }
    }
    ```
    {% include copy-curl.html %}

3. Search with `inner_hits`:

    ```json
    GET /my_index/_search
    {
      "query": {
        "has_child": {
          "type": "child",
          "query": {
            "match": {
              "text": "child"
            }
          },
          "inner_hits": {}
        }
      }
    }
    ```
    {% include copy-curl.html %}

The preceding query searches for parent documents that have child documents matching the query criteria (in this case, containing the term `"child"`). It returns the matching child documents in the `inner_hits` section of the response:

```json
{
  "hits" : {
    "total" : {
      "value" : 1,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "my_index",
        "_id" : "1",
        "_score" : 1.0,
        "_source" : {
          "text" : "This is a parent document",
          "my_join_field" : "parent"
        },
        "inner_hits" : {
          "child" : {
            "hits" : {
              "total" : {
                "value" : 1,
                "relation" : "eq"
              },
              "max_score" : 0.6931471,
              "hits" : [
                {
                  "_index" : "my_index",
                  "_id" : "2",
                  "_score" : 0.6931471,
                  "_routing" : "1",
                  "_source" : {
                    "text" : "This is a child document",
                    "my_join_field" : {
                      "name" : "child",
                      "parent" : "1"
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

## Using both parent-join and nested objects with `inner_hits`

The following example demonstrates using both parent-join and nested objects with `inner_hits`.

1. Create an index with the following mapping:

    ```json
    PUT /my_index
    {
      "mappings": {
        "properties": {
          "my_join_field": {
            "type": "join",
            "relations": {
              "parent": "child"
            }
          },
          "text": {
            "type": "text"
          },
          "comments": {
            "type": "nested",
            "properties": {
              "user": { "type": "text" },
              "message": { "type": "text" }
            }
          }
        }
      }
    }
    ```
    {% include copy-curl.html %}

2. Index data:

    ```json
    # Index a parent document
    PUT /my_index/_doc/1
    {
      "text": "This is a parent document",
      "my_join_field": "parent"
    }
    
    # Index a child document with nested comments
    PUT /my_index/_doc/2?routing=1
    {
      "text": "This is a child document",
      "my_join_field": {
        "name": "child",
        "parent": "1"
      },
      "comments": [
        {
          "user": "John",
          "message": "This is a comment"
        },
        {
          "user": "Jane",
          "message": "Another comment"
        }
      ]
    }
    ```
    {% include copy-curl.html %}

3. Query with `inner_hits`:

    ```json
    GET /my_index/_search
    {
      "query": {
        "has_child": {
          "type": "child",
          "query": {
            "nested": {
              "path": "comments",
              "query": {
                "bool": {
                  "must": [
                    { "match": { "comments.user": "John" } }
                  ]
                }
              },
              "inner_hits": {}
            }
          },
          "inner_hits": {}
        }
      }
    }
    ```
    {% include copy-curl.html %}

The preceding query searches for parent documents that have child documents containing comments made by John. Specifying `inner_hits` ensures that the matching child documents and their nested comments are returned:

```json
{
  "hits" : {
    "total" : {
      "value" : 1,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "my_index",
        "_id" : "1",
        "_score" : 1.0,
        "_source" : {
          "text" : "This is a parent document",
          "my_join_field" : "parent"
        },
        "inner_hits" : {
          "child" : {
            "hits" : {
              "total" : {
                "value" : 1,
                "relation" : "eq"
              },
              "max_score" : 0.6931471,
              "hits" : [
                {
                  "_index" : "my_index",
                  "_id" : "2",
                  "_score" : 0.6931471,
                  "_routing" : "1",
                  "_source" : {
                    "text" : "This is a child document",
                    "my_join_field" : {
                      "name" : "child",
                      "parent" : "1"
                    },
                    "comments" : [
                      {
                        "user" : "John",
                        "message" : "This is a comment"
                      },
                      {
                        "user" : "Jane",
                        "message" : "Another comment"
                      }
                    ]
                  },
                  "inner_hits" : {
                    "comments" : {
                      "hits" : {
                        "total" : {
                          "value" : 1,
                          "relation" : "eq"
                        },
                        "max_score" : 0.6931471,
                        "hits" : [
                          {
                            "_index" : "my_index",
                            "_id" : "2",
                            "_nested" : {
                              "field" : "comments",
                              "offset" : 0
                            },
                            "_score" : 0.6931471,
                            "_source" : {
                              "message" : "This is a comment",
                              "user" : "John"
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
        }
      }
    ]
  }
}
```

<!-- vale off -->
## inner_hits parameters
<!-- vale on -->
You can pass the following additional parameters to a search with `inner_hits` using both nested objects and parent-join relationships:

* `from`: The offset from where to start fetching hits in the `inner_hits` results.
* `size`: The maximum number of inner hits to return.
* `sort`: The sorting order for the inner hits.
* `name`: A custom name for the inner hits in the response. This is useful in differentiating between multiple inner hits in a single query.

<!-- vale off -->
### Example: inner_hits parameters with nested objects
<!-- vale on -->

1. Create an index with the following mappings:

    ```json
    PUT /products
    {
      "mappings": {
        "properties": {
          "product_name": { "type": "text" },
          "reviews": {
            "type": "nested",
            "properties": {
              "user": { "type": "text" },
              "comment": { "type": "text" },
              "rating": { "type": "integer" }
            }
          }
        }
      }
    }
    ```
    {% include copy-curl.html %}

2. Index data:

    ```json
    POST /products/_doc/1
    {
      "product_name": "Smartphone",
      "reviews": [
        { "user": "Alice", "comment": "Great phone", "rating": 5 },
        { "user": "Bob", "comment": "Not bad", "rating": 3 },
        { "user": "Charlie", "comment": "Excellent", "rating": 4 }
      ]
    }
    ```
    {% include copy-curl.html %}

    ```json
    POST /products/_doc/2
    {
      "product_name": "Laptop",
      "reviews": [
        { "user": "Dave", "comment": "Very good", "rating": 5 },
        { "user": "Eve", "comment": "Good value", "rating": 4 }
      ]
    }
    ```
    {% include copy-curl.html %}

3. Query with `inner_hits` and provide additional parameters:

    ```json
    GET /products/_search
    {
      "query": {
        "nested": {
          "path": "reviews",
          "query": {
            "match": { "reviews.comment": "Good" }
          },
          "inner_hits": {
            "from": 0,
            "size": 2,
            "sort": [
              { "reviews.rating": { "order": "desc" } }
            ],
            "name": "top_reviews"
          }
        }
      }
    }
    ```
    {% include copy-curl.html %}

The following is the expected result:

```json
{
  "hits" : {
    "total" : {
      "value" : 1,
      "relation" : "eq"
    },
    "max_score" : 0.83740485,
    "hits" : [
      {
        "_index" : "products",
        "_id" : "2",
        "_score" : 0.83740485,
        "_source" : {
          "product_name" : "Laptop",
          "reviews" : [
            {
              "user" : "Dave",
              "comment" : "Very good",
              "rating" : 5
            },
            {
              "user" : "Eve",
              "comment" : "Good value",
              "rating" : 4
            }
          ]
        },
        "inner_hits" : {
          "top_reviews" : {
            "hits" : {
              "total" : {
                "value" : 2,
                "relation" : "eq"
              },
              "max_score" : null,
              "hits" : [
                {
                  "_index" : "products",
                  "_id" : "2",
                  "_nested" : {
                    "field" : "reviews",
                    "offset" : 0
                  },
                  "_score" : null,
                  "_source" : {
                    "rating" : 5,
                    "comment" : "Very good",
                    "user" : "Dave"
                  },
                  "sort" : [
                    5
                  ]
                },
                {
                  "_index" : "products",
                  "_id" : "2",
                  "_nested" : {
                    "field" : "reviews",
                    "offset" : 1
                  },
                  "_score" : null,
                  "_source" : {
                    "rating" : 4,
                    "comment" : "Good value",
                    "user" : "Eve"
                  },
                  "sort" : [
                    4
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

<!-- vale off -->
### Example: inner_hits parameters with a parent-join relationship
<!-- vale on -->

1. Create an index with the following mappings:

    ```json
    PUT /company
    {
      "mappings": {
        "properties": {
          "my_join_field": {
            "type": "join",
            "relations": {
              "employee": "task"
            }
          },
          "name": { "type": "text" },
          "description": {
            "type": "text",
            "fields": {
              "keyword": { "type": "keyword" }
            }
          }
        }
      }
    }
    ```
    {% include copy-curl.html %}

2. Index data:

    ```json
    # Index a parent document
    PUT /company/_doc/1
    {
      "name": "Alice",
      "my_join_field": "employee"
    }
    ```
    {% include copy-curl.html %}
    
    ```json
    # Index child documents
    PUT /company/_doc/2?routing=1
    {
      "description": "Complete the project",
      "my_join_field": {
        "name": "task",
        "parent": "1"
      }
    }
    ```
    {% include copy-curl.html %}
    
    ```json
    PUT /company/_doc/3?routing=1
    {
      "description": "Prepare the report",
      "my_join_field": {
        "name": "task",
        "parent": "1"
      }
    }
    ```
    {% include copy-curl.html %}

    ```json
    PUT /company/_doc/4?routing=1
    {
      "description": "Update project",
      "my_join_field": {
        "name": "task",
        "parent": "1"
      }
    }
    ```
    {% include copy-curl.html %}

3. Query with `inner_hits` parameters:

    ```json
    GET /company/_search
    {
      "query": {
        "has_child": {
          "type": "task",
          "query": {
            "match": { "description": "project" }
          },
          "inner_hits": {
            "from": 0,
            "size": 10,
            "sort": [
              { "description.keyword": { "order": "asc" } }
            ],
            "name": "related_tasks"
          }
        }
      }
    }
    ```
    {% include copy-curl.html %}

The following is the expected result:

```json
{
  "hits" : {
    "total" : {
      "value" : 1,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits": [
      {
        "_index": "company",
        "_id": "1",
        "_score": 1,
        "_source": {
          "name": "Alice",
          "my_join_field": "employee"
        },
        "inner_hits": {
          "related_tasks": {
            "hits": {
              "total": {
                "value": 2,
                "relation": "eq"
              },
              "max_score": null,
              "hits": [
                {
                  "_index": "company",
                  "_id": "2",
                  "_score": null,
                  "_routing": "1",
                  "_source": {
                    "description": "Complete the project",
                    "my_join_field": {
                      "name": "task",
                      "parent": "1"
                    }
                  },
                  "sort": [
                    "Complete the project"
                  ]
                },
                {
                  "_index": "company",
                  "_id": "4",
                  "_score": null,
                  "_routing": "1",
                  "_source": {
                    "description": "Update project",
                    "my_join_field": {
                      "name": "task",
                      "parent": "1"
                    }
                  },
                  "sort": [
                    "Update project"
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
<!-- vale off -->
## Benefits of using inner_hits
<!-- vale on -->
* **Detailed query results**

    You can use `inner_hits` to retrieve detailed information about matching nested or child documents directly from the parent document's search results. This is particularly useful for understanding the context and specifics of the match without having to perform additional queries.
    
    Example use case: In a blog post index, you have comments as nested objects. When searching for blog posts containing specific comments, you can retrieve relevant comments that match the search criteria along with information about the post.

* **Optimized performance**

    Without `inner_hits`, you may need to run multiple queries to fetch related documents. Using `inner_hits` consolidates these into a single query, reducing the number of round trips to the OpenSearch server and improving overall performance.

    Example use case: In an e-commerce application, you have products as parent documents and reviews as child documents. A single query using `inner_hits` can fetch products and their relevant reviews, avoiding multiple separate queries.

* **Simplified query logic**

    You can combine parent/child or nested document logic in a single query to simplify the application code and reduce complexity. This helps to ensure that the code is more maintainable and consistent by centralizing the query logic in OpenSearch

    Example use case: In a job portal, you have jobs as parent documents and applications as nested or child documents. You can simplify the application logic by fetching jobs along with specific applications in one query.

* **Contextual relevance**

    Using `inner_hits` provides contextual relevance by showing exactly which nested or child documents match the query criteria. This is crucial for applications in which the relevance of results depends on a specific part of the document that matches the query.

    Example use case: In a customer support system, you have tickets as parent documents and comments or updates as nested or child documents. You can determine which specific comment matches the search in order to better understand the context of the ticket search.

## Next steps

- Learn about [joining queries]({{site.url}}{{site.baseurl}}/query-dsl/joining/) on [nested]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/nested/) or [join]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/join/) fields.