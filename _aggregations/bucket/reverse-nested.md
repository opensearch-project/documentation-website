---
layout: default
title: Reverse nested
parent: Bucket aggregations
nav_order: 160
redirect_from:
  - /query-dsl/aggregations/bucket/reverse-nested/
---

# Reverse nested aggregations

The `reverse_nested` aggregation allows you to aggregate on parent document fields from within a [`nested` aggregation]({{site.url}}{{site.baseurl}}/aggregations/bucket/nested/) context. When you group by a nested field, the aggregation context shifts to the nested documents. The `reverse_nested` aggregation breaks out of that nested context and joins back to the parent (or root) document, making parent fields accessible for further subaggregations.

The `reverse_nested` aggregation must be defined inside a `nested` aggregation.
{: .note}

## Parameters

The `reverse_nested` aggregation takes the following parameters.

| Parameter | Required/Optional | Data type | Description |
| :--- | :--- | :--- | :--- |
| `path` | Optional | String | The nested object path to join back to. Default is empty (joins back to the root document). For multi-level nesting, specify an intermediate nested path to join to that level instead of the root. |

## Example setup

Create an index with issues containing nested comments:

```json
PUT /issues
{
  "mappings": {
    "properties": {
      "title": { "type": "text" },
      "tags": { "type": "keyword" },
      "comments": {
        "type": "nested",
        "properties": {
          "username": { "type": "keyword" },
          "comment": { "type": "text" }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Index some documents:

```json
POST /issues/_bulk?refresh=true
{"index":{"_id":"1"}}
{"title":"Add dark mode to settings page","tags":["ui","enhancement"],"comments":[{"username":"alice","comment":"Would love this feature"},{"username":"bob","comment":"Should support system preference detection"}]}
{"index":{"_id":"2"}}
{"title":"Export report as PDF","tags":["export","enhancement"],"comments":[{"username":"alice","comment":"CSV export would also be useful"},{"username":"carol","comment":"Added to the roadmap"}]}
{"index":{"_id":"3"}}
{"title":"Improve mobile navigation","tags":["ui","mobile"],"comments":[{"username":"bob","comment":"Hamburger menu would work well"},{"username":"carol","comment":"Agree, especially for tablets"}]}
```
{% include copy-curl.html %}

## Example

The following example finds the most active commenters and then uses `reverse_nested` to determine the issue tags with which each commenter is most involved. Without `reverse_nested`, the `tags` field would be inaccessible because the aggregation context is inside the nested `comments` objects:

```json
GET /issues/_search
{
  "size": 0,
  "aggs": {
    "comments": {
      "nested": {
        "path": "comments"
      },
      "aggs": {
        "top_commenters": {
          "terms": {
            "field": "comments.username"
          },
          "aggs": {
            "back_to_issue": {
              "reverse_nested": {},
              "aggs": {
                "top_tags": {
                  "terms": {
                    "field": "tags"
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

The response shows that Bob's comments appear on issues tagged with "ui" (2 issues), "enhancement" (1), and "mobile" (1):

```json
{
  ...
  "aggregations": {
    "comments": {
      "doc_count": 6,
      "top_commenters": {
        "doc_count_error_upper_bound": 0,
        "sum_other_doc_count": 0,
        "buckets": [
          {
            "key": "alice",
            "doc_count": 2,
            "back_to_issue": {
              "doc_count": 2,
              "top_tags": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                  {
                    "key": "enhancement",
                    "doc_count": 2
                  },
                  {
                    "key": "export",
                    "doc_count": 1
                  },
                  {
                    "key": "ui",
                    "doc_count": 1
                  }
                ]
              }
            }
          },
          {
            "key": "bob",
            "doc_count": 2,
            "back_to_issue": {
              "doc_count": 2,
              "top_tags": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                  {
                    "key": "ui",
                    "doc_count": 2
                  },
                  {
                    "key": "enhancement",
                    "doc_count": 1
                  },
                  {
                    "key": "mobile",
                    "doc_count": 1
                  }
                ]
              }
            }
          },
          {
            "key": "carol",
            "doc_count": 2,
            "back_to_issue": {
              "doc_count": 2,
              "top_tags": {
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                  {
                    "key": "enhancement",
                    "doc_count": 1
                  },
                  {
                    "key": "export",
                    "doc_count": 1
                  },
                  {
                    "key": "mobile",
                    "doc_count": 1
                  },
                  {
                    "key": "ui",
                    "doc_count": 1
                  }
                ]
              }
            }
          }
        ]
      }
    }
  }
}
```

## Example: Using the path parameter with multi-level nesting

When documents contain nested objects within nested objects, you can use the `path` parameter to join back to an intermediate level rather than the root. The following example uses a forum-style structure where posts contain nested comments, and each comment contains nested replies:

```json
PUT /forum_posts
{
  "mappings": {
    "properties": {
      "title": { "type": "keyword" },
      "comments": {
        "type": "nested",
        "properties": {
          "author": { "type": "keyword" },
          "replies": {
            "type": "nested",
            "properties": {
              "author": { "type": "keyword" }
            }
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a post with comments and replies:

```json
POST /forum_posts/_doc/1?refresh=true
{
  "title": "Post A",
  "comments": [
    { "author": "alice", "replies": [{"author": "bob"}, {"author": "carol"}] },
    { "author": "bob", "replies": [{"author": "alice"}] }
  ]
}
```
{% include copy-curl.html %}

The following aggregation groups by reply author, then uses `reverse_nested` with `"path": "comments"` to join back to the comment level (not the root) and find which comment authors each person replied to:

```json
GET /forum_posts/_search
{
  "size": 0,
  "aggs": {
    "comments": {
      "nested": { "path": "comments" },
      "aggs": {
        "replies": {
          "nested": { "path": "comments.replies" },
          "aggs": {
            "reply_authors": {
              "terms": { "field": "comments.replies.author" },
              "aggs": {
                "back_to_comment": {
                  "reverse_nested": { "path": "comments" },
                  "aggs": {
                    "comment_authors": {
                      "terms": { "field": "comments.author" }
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

The response shows that Bob replied to Alice's comment, and Carol also replied to Alice's comment:

```json
{
  ...
  "aggregations": {
    "comments": {
      "doc_count": 2,
      "replies": {
        "doc_count": 3,
        "reply_authors": {
          "doc_count_error_upper_bound": 0,
          "sum_other_doc_count": 0,
          "buckets": [
            {
              "key": "alice",
              "doc_count": 1,
              "back_to_comment": {
                "doc_count": 1,
                "comment_authors": {
                  "doc_count_error_upper_bound": 0,
                  "sum_other_doc_count": 0,
                  "buckets": [
                    {
                      "key": "bob",
                      "doc_count": 1
                    }
                  ]
                }
              }
            },
            {
              "key": "bob",
              "doc_count": 1,
              "back_to_comment": {
                "doc_count": 1,
                "comment_authors": {
                  "doc_count_error_upper_bound": 0,
                  "sum_other_doc_count": 0,
                  "buckets": [
                    {
                      "key": "alice",
                      "doc_count": 1
                    }
                  ]
                }
              }
            },
            {
              "key": "carol",
              "doc_count": 1,
              "back_to_comment": {
                "doc_count": 1,
                "comment_authors": {
                  "doc_count_error_upper_bound": 0,
                  "sum_other_doc_count": 0,
                  "buckets": [
                    {
                      "key": "alice",
                      "doc_count": 1
                    }
                  ]
                }
              }
            }
          ]
        }
      }
    }
  }
}
```

## Response body fields

The following table lists the response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `doc_count` | Integer | The number of parent documents that the aggregation joined back to. This count reflects distinct parent documents, not nested documents. |
