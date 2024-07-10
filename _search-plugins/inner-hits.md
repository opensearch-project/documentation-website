---
layout: default
title: Inner hits
has_children: false
nav_order: 215
---



# Inner_hits

In OpenSearch, when you perform a search using parent-join or nested objects, the underlying hits that resulted in the hits being returned (child documents or nested inner objects) are hidden by default. Whether you are using parent/child, nested objects or both, there could different reasons why retrieving these underlying hits is important. This is achieved using `inner_hits` parameter in the search query.

---

#### Table of contents
1. TOC
{:toc}


---

## Inner_hits with nested objects

Nested objects allow you to index an array of objects and maintain their relationship within the same document. See the following example of using `inner_hits` parameter to retrieve underlying inner hits:

1. Create index mapping with nested object:
    ```
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

2. Index data:
    ```
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

3. Query with `inner_hits`:
    ```
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

This query searches for nested user objects with the name "John" and returns the matching nested documents within the inner_hits section of the response. The following is the retrieved result:

```
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

## Inner_hits with parent/child objects

Parent-join relationships allow you to create relationships between documents of different types within the same index. See following example using search with `inner_hits` with parent/child objects:

1. Create index with parent-join field:
    ```
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

2. Index data:

    ```
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

3. Search with `inner_hits`:
    ```
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

This query searches for parent documents that have a child document matching the query criteria (`"child"` in this case) and returns the matching child documents within the `inner_hits` section of the response. See the following expected result:
```
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

## Full example using both parent-join and nested object with inner_hits

Combining both features into a comprehensive example:

1. Create the index with mapping:
    ```
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

2. Index data:
    ```
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

3. Query with `inner_hits`:
    ```
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

In this query you can see how search for parent documents that have child documents containing comments made by "John". The `inner_hits` feature is used to return the matching child documents and their nested comments.
Expected result:

```
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

## `inner_hits` options

There are additional options that can be passed to search with `inner_hits` using both nested objects and parent-join relationships in OpenSearch. Such as `from`, `size`, `sort` and `name`.

* `from`: The offset from where to start fetching hits within the inner_hits results.
* `size`: The maximum number of inner hits to return.
* `sort`: The sorting order for the inner hits.
* `name`: A custom name for the inner hits in the response. This is useful to differentiate between multiple inner hits in a single query.

### Example of `inner_hits` options with nested objects

1. Create index and mappings:
    ```
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

2. Index data:
    ```
    POST /products/_doc/1
    {
      "product_name": "Smartphone",
      "reviews": [
        { "user": "Alice", "comment": "Great phone", "rating": 5 },
        { "user": "Bob", "comment": "Not bad", "rating": 3 },
        { "user": "Charlie", "comment": "Excellent", "rating": 4 }
      ]
    }
    
    POST /products/_doc/2
    {
      "product_name": "Laptop",
      "reviews": [
        { "user": "Dave", "comment": "Very good", "rating": 5 },
        { "user": "Eve", "comment": "Good value", "rating": 4 }
      ]
    }
    ```

3. Query with `inner_hits` options:
    ```
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

Expected result:
```
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

### Example of `inner_hits` options with Parent-Join Relationship

1. Create index and mappings:
    ```
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

2. Index data:
    ```
    # Index a parent document
    PUT /company/_doc/1
    {
      "name": "Alice",
      "my_join_field": "employee"
    }
    
    # Index child documents
    PUT /company/_doc/2?routing=1
    {
      "description": "Complete the project",
      "my_join_field": {
        "name": "task",
        "parent": "1"
      }
    }
    
    PUT /company/_doc/3?routing=1
    {
      "description": "Prepare the report",
      "my_join_field": {
        "name": "task",
        "parent": "1"
      }
    }
    ```

3. Query with Inner Hits Options:
    ```
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
            "size": 1,
            "sort": [
              { "description.keyword": { "order": "asc" } }
            ],
            "name": "related_tasks"
          }
        }
      }
    }
    ```

Expected result:
```
{
  "hits" : {
    "total" : {
      "value" : 1,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "company",
        "_id" : "1",
        "_score" : 1.0,
        "_source" : {
          "name" : "Alice",
          "my_join_field" : "employee"
        },
        "inner_hits" : {
          "related_tasks" : {
            "hits" : {
              "total" : {
                "value" : 1,
                "relation" : "eq"
              },
              "max_score" : null,
              "hits" : [
                {
                  "_index" : "company",
                  "_id" : "2",
                  "_score" : null,
                  "_routing" : "1",
                  "_source" : {
                    "description" : "Complete the project",
                    "my_join_field" : {
                      "name" : "task",
                      "parent" : "1"
                    }
                  },
                  "sort" : [
                    "Complete the project"
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

## Benefits of using `inner_hits`

* **Detailed Query Results**

    `inner_hits` allows you to retrieve detailed information about matching nested or child documents directly within the parent document's search result. This is particularly useful for understanding the context and specifics of the match without having to perform additional queries.
    
    Example use case: In a blog post index, you have comments as nested objects. When searching for blog posts with specific comments, you can retrieve the relevant comments that matched the search criteria along with the post details.

* **Optimized Performance**

    Without `inner_hits`, you might need to perform multiple queries to fetch related documents. `inner_hits` consolidates this into a single query, reducing the number of round trips to the OpenSearch server and improving overall performance.

    Example use case: In an e-commerce application, you have products as parent documents and reviews as child documents. A single query with `inner_hits` can fetch products with their relevant reviews, avoiding multiple separate queries.

* **Simplified Query Logic**

    Combining parent and child or nested documents logic in a single query simplifies the application code and reduces complexity. It helps maintain cleaner and more maintainable code by centralizing the query logic within OpenSearch.

    Example use case: In a job portal, jobs are parent documents, and applications are nested or child documents. Fetching jobs along with specific applications in one query keeps the application logic simple.

* **Contextual Relevance**

    `inner_hits` provides contextual relevance by showing exactly which nested or child documents matched the query criteria. This is crucial for applications where the relevance of results depends on the specific part of the document that matched the query.

    Example use case: In a customer support system, tickets are parent documents, and comments or updates are nested or child documents. Knowing which specific comment matched the search helps in understanding the context of the ticket search.