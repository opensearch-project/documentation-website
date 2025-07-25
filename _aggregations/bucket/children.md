---
layout: default
title: Children
parent: Bucket aggregations
grand_parent: Aggregations
nav_order: 15
canonical_url: https://docs.opensearch.org/latest/aggregations/bucket/children/
---

# Children

The `children` aggregation connects parent documents with their related child documents. This allows you to analyze relationships between different types of data in a single query, rather than needing to run multiple queries and combine the results manually.

---

## Example index, sample data, and children aggregation query

For example, if you have a parent-child relationship between authors, posts, and comments, you can analyze the relationships between the different data types (`authors`, `posts`, and `comments`) in a single query. 

The `authors` aggregation groups the documents by the `author.keyword` field. This allows you to see the number of documents associates with each author. 

In each author group, the `children` aggregation retrieves the associated posts. This gives you a breakdown of the posts written by each author. 

In the `posts` aggregation, another `children` aggregation fetches the comments associated with each post. This provides you a way to see the comments for each individual post. 

In the `comments` aggregation, the `value_count` aggregation counts the number of comments on each post. This allows you to gauge the engagement level for each post by seeing the number of comments it has received. 

#### Example index 

```json
PUT /blog-sample
{
  "mappings": {
    "properties": {
      "type": { "type": "keyword" },
      "name": { "type": "keyword" },
      "title": { "type": "text" },
      "content": { "type": "text" },
      "author": { "type": "keyword" },
      "post_id": { "type": "keyword" },
      "join_field": {
        "type": "join",
        "relations": {
          "author": "post",
          "post": "comment"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

#### Sample documents

```json
POST /blog-sample/_doc/1?routing=1
{
  "type": "author",
  "name": "John Doe",
  "join_field": "author"
}

POST /blog-sample/_doc/2?routing=1
{
  "type": "post",
  "title": "Introduction to OpenSearch",
  "content": "OpenSearch is a powerful search and analytics engine...",
  "author": "John Doe",
  "join_field": {
    "name": "post",
    "parent": "1"
  }
}

POST /blog-sample/_doc/3?routing=1
{
  "type": "comment",
  "content": "Great article! Very informative.",
  "join_field": {
    "name": "comment",
    "parent": "2"
  }
}

POST /blog-sample/_doc/4?routing=1
{
  "type": "comment",
  "content": "Thanks for the clear explanation.",
  "join_field": {
    "name": "comment",
    "parent": "2"
  }
}
```
{% include copy-curl.html %}

#### Example children aggregation query

```json
GET /blog-sample/_search
{
  "size": 0,
  "aggs": {
    "authors": {
      "terms": {
        "field": "name.keyword"
      },
      "aggs": {
        "posts": {
          "children": {
            "type": "post"
          },
          "aggs": {
            "post_titles": {
              "terms": {
                "field": "title.keyword"
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
  }
}
```
{% include copy-curl.html %}

#### Example response

The response should appear similar to the following example:

```json
{
  "took": 30,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 4,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "authors": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": []
    }
  }
}
```
