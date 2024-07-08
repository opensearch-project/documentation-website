---
layout: default
title: Children
parent: Bucket aggregations
grand_parent: Aggregations
nav_order: 15
---

# Children

The `children` aggregation connects parent documents with their related child documents. This allows you to analyze relationships between different types of data in a single query, rather than having to run multiple queries and combine the results yourself.

For example, if you have a parent-child relationship between authors, posts, and comments, you can analyze the relationships between the data different types (`authors`, `posts`, and `comments`) in a single query, without having to run multiple queries and combine the results manually. 

The `authors` aggregation groups the documents by the `author.keyword` field. Within each author group, we have a `children` aggregation that looks at the associated posts. Inside the `posts` aggregation, another `children` aggregation looks at the comments associated with each post. Within the `comments` aggregation, the `value_count` aggregation counts the number of comments for each post.

#### Example

```json
GET /my_index/_search
{
  "size": 0,
  "aggs": {
    "authors": {
      "terms": {
        "field": "author.keyword"
      },
      "aggs": {
        "posts": {
          "children": {
            "type": "post"
          },
          "aggs": {
            "comments": {
              "children": {
                "type": "comment"
              },
              "aggs": {
                "comment_count": {
                  "value_count": {
                    "field": "_id"
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Example response

The response should be similar to the following example:

```json
{
  "took": 55,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 5,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "authors": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "Jane Smith",
          "doc_count": 1,
          "posts": {
            "doc_count": 0,
            "comments": {
              "doc_count": 0,
              "comment_count": {
                "value": 0
              }
            }
          }
        },
        {
          "key": "John Doe",
          "doc_count": 1,
          "posts": {
            "doc_count": 0,
            "comments": {
              "doc_count": 0,
              "comment_count": {
                "value": 0
              }
            }
          }
        }
      ]
    }
  }
}
```
