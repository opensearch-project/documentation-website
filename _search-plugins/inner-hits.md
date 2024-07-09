---
layout: default
title: Inner hits
has_children: false
nav_order: 215
---

# Inner_hits

In OpenSearch, when you perform a search using parent-join or nested objects, the underlying hits that resulted in the hits being returned (child documents or nested inner objects) are hidden by default. Whether you are using parent/child, nested objects or both, there could different reasons why retrieving these underlying hits is important. This is achieved using `inner_hits` parameter in the search query.

## Inner_hits with nested objects

Nested objects allow you to index an array of objects and maintain their relationship within the same document. See the following example of using `inner_hits` parameter to retrieve underlying inner hits:

1. Create index mapping with nested object
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

2. Index data
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

3. Querying with `inner_hits`
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

1. Create index with parent-join field
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

2. Index data

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

3. Searching
  The following is a search query using `inner_hits` to retrieve child documents that match a query and are associated with a specific parent.
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

1. Create the index with mapping
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

2. Index data
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

3. Query with inner_hits
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

## Benefits of using `inner_hits`

1. Detailed Query Results
Inner Hits allows you to retrieve detailed information about matching nested or child documents directly within the parent document's search result. This is particularly useful for understanding the context and specifics of the match without having to perform additional queries.

Example use case: In a blog post index, you have comments as nested objects. When searching for blog posts with specific comments, you can retrieve the relevant comments that matched the search criteria along with the post details.

2. Optimized Performance
Without inner_hits, you might need to perform multiple queries to fetch related documents. Inner_hits consolidates this into a single query, reducing the number of round trips to the OpenSearch server and improving overall performance.

Example use case: In an e-commerce application, you have products as parent documents and reviews as child documents. A single query with inner_hits can fetch products with their relevant reviews, avoiding multiple separate queries.

3. Simplified Query Logic
Combining parent and child or nested documents logic in a single query simplifies the application code and reduces complexity. It helps maintain cleaner and more maintainable code by centralizing the query logic within OpenSearch.

Example use case: In a job portal, jobs are parent documents, and applications are nested or child documents. Fetching jobs along with specific applications in one query keeps the application logic simple.

4. Contextual Relevance
Inner_hits provides contextual relevance by showing exactly which nested or child documents matched the query criteria. This is crucial for applications where the relevance of results depends on the specific part of the document that matched the query.

Example use case: In a customer support system, tickets are parent documents, and comments or updates are nested or child documents. Knowing which specific comment matched the search helps in understanding the context of the ticket search.