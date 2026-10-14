---
layout: default
title: Retrieve inner hits
parent: Customizing search results
has_children: false
nav_order: 60
---

# Retrieve inner hits

In OpenSearch, when you perform a search using [nested objects]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/nested/) or [parent-join]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/join/), the underlying hits (nested inner objects or child documents) are hidden by default. You can retrieve inner hits by using the `inner_hits` parameter in the search query.

Use inner hits in the following scenarios:

- Identifying which nested objects or child documents caused a document to match, for example, the comments on a blog post that contain the search terms or the update on a support ticket that matches a query.
- Retrieving documents together with their matching nested objects or child documents in one request, for example, products with their matching reviews or job postings with their matching applications. This avoids sending a separate query for the related documents.

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
### Identifying the matched nested object

Each inner hit for a nested object contains a `_nested` object that identifies the nested object that matched. The `field` property contains the name of the nested field, and the `offset` property contains the position of the object in that field's array in the original document, starting at `0`. In the preceding response, the `offset` of `0` means that the inner hit is the first object in the `user` array. Because inner hits are sorted by score or by the sort order you specify, the order of inner hits usually differs from the order of the objects in the document, so use `offset` to identify the original object.

By default, the `_source` of each inner hit contains only the matched nested object, not the entire source document. You can change the returned fields using [source filtering]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/retrieve-specific-fields/#using-source-filtering), disable `_source` for inner hits, or return the [stored fields]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/store/) of the nested object by specifying them in `stored_fields` in `inner_hits`.

### Retrieving nested inner hits without the source

Nested objects are not stored separately: their source is part of the source of the parent document. To return the `_source` of a nested inner hit, OpenSearch parses the parent document's source and extracts the matching object. Doing this for every inner hit increases the search time, especially if you increase `size` for the search or for `inner_hits`. To avoid this cost, disable `_source` for inner hits and retrieve the field values from doc values instead.

The following example uses an `articles` index containing nested `comments`. Create the index and add a document:

```json
PUT /articles
{
  "mappings": {
    "properties": {
      "comments": {
        "type": "nested",
        "properties": {
          "author": { "type": "keyword" },
          "text": { "type": "text" },
          "reactions": {
            "type": "nested",
            "properties": {
              "user": { "type": "keyword" },
              "emoji": { "type": "keyword" }
            }
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

```json
PUT /articles/_doc/1?refresh=true
{
  "title": "Choosing a backpacking tent",
  "comments": [
    {
      "author": "ana",
      "text": "Great overview of tent weights",
      "reactions": []
    },
    {
      "author": "ben",
      "text": "Which tent survives strong wind?",
      "reactions": [
        { "user": "ana", "emoji": "thumbs_up" },
        { "user": "chen", "emoji": "heart" }
      ]
    }
  ]
}
```
{% include copy-curl.html %}

The following request finds comments that mention `wind` and returns only the `author` of each matching comment from doc values:

```json
GET /articles/_search
{
  "_source": false,
  "query": {
    "nested": {
      "path": "comments",
      "query": {
        "match": { "comments.text": "wind" }
      },
      "inner_hits": {
        "_source": false,
        "docvalue_fields": ["comments.author"]
      }
    }
  }
}
```
{% include copy-curl.html %}

The inner hit contains the `fields` object in place of `_source`:

```json
"inner_hits": {
  "comments": {
    "hits": {
      "total": {
        "value": 1,
        "relation": "eq"
      },
      "max_score": 0.31506687,
      "hits": [
        {
          "_index": "articles",
          "_id": "1",
          "_nested": {
            "field": "comments",
            "offset": 1
          },
          "_score": 0.31506687,
          "fields": {
            "comments.author": [
              "ben"
            ]
          }
        }
      ]
    }
  }
}
```

### Inner hits for multi-level nested objects

If nested objects contain other nested objects, you can return inner hits from any level by specifying the full dotted path in the `nested` query. The following request returns the reactions by the user `ana`, which are nested in `comments.reactions`:

```json
GET /articles/_search
{
  "_source": false,
  "query": {
    "nested": {
      "path": "comments.reactions",
      "query": {
        "term": { "comments.reactions.user": "ana" }
      },
      "inner_hits": {}
    }
  }
}
```
{% include copy-curl.html %}

The inner hits are named after the full path. The `_nested` object of each inner hit contains another `_nested` object for each level. In this response, the reaction is the first object (`offset` `0`) in the `reactions` array of the second comment (`offset` `1`):

```json
{
  "took": 4,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "articles",
        "_id": "1",
        "_score": 1,
        "inner_hits": {
          "comments.reactions": {
            "hits": {
              "total": {
                "value": 1,
                "relation": "eq"
              },
              "max_score": 1,
              "hits": [
                {
                  "_index": "articles",
                  "_id": "1",
                  "_nested": {
                    "field": "comments",
                    "offset": 1,
                    "_nested": {
                      "field": "reactions",
                      "offset": 0
                    }
                  },
                  "_score": 1,
                  "_source": {
                    "emoji": "thumbs_up",
                    "user": "ana"
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

You can also specify `inner_hits` in a [`has_parent`]({{site.url}}{{site.baseurl}}/query-dsl/joining/has-parent/) query. In this case, the query returns the child documents, and the inner hits of each child contain its matching parent document.

## Using inner hits with both parent-join and nested objects

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

## Inner hits parameters

The following table lists the parameters that you can specify in `inner_hits` for both nested objects and parent-join relationships.

Parameter | Description
:--- | :---
`from` | The offset from which to start returning inner hits. Default is `0`.
`size` | The maximum number of inner hits to return. Default is `3`.
`sort` | The sort order for the inner hits. By default, inner hits are sorted by relevance score.
`name` | A custom name for the inner hits in the response. Useful for differentiating between multiple inner hits in a single query. By default, the name is the nested `path` for a `nested` query, the child relation name for a `has_child` query, and the parent relation name for a `has_parent` query.

Inner hits also accept many of the options that you can specify for the hits of a search request, including [`highlight`]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/highlight/), `explain`, [source filtering]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/retrieve-specific-fields/#using-source-filtering), [`script_fields`]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/retrieve-specific-fields/#using-scripted-fields), [`docvalue_fields`]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/retrieve-specific-fields/#searching-with-doc-value-fields), `version`, and `seq_no_primary_term`. Nested objects are not assigned sequence numbers, so OpenSearch rejects `seq_no_primary_term` in the inner hits of a `nested` query.

### Example: Inner hits parameters with nested objects

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

### Example: Inner hits parameters with a parent-join relationship

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
## Next steps

- Learn about [joining queries]({{site.url}}{{site.baseurl}}/query-dsl/joining/) on [nested]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/nested/) or [join]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/join/) fields.