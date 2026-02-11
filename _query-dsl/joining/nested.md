---
layout: default
title: Nested
parent: Joining queries
nav_order: 30
canonical_url: https://docs.opensearch.org/latest/query-dsl/joining/nested/
---

# Nested query

The `nested` query acts as a wrapper for other queries to search [nested]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/nested/) fields. The nested field objects are searched as though they were indexed as separate documents. If an object matches the search, the `nested` query returns the parent document at the root level.

## Example 

Before you can run a `nested` query, your index must contain a [nested]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/nested/) field. 

To configure an example index containing nested fields, send the following request:

```json
PUT /testindex 
{
  "mappings": {
    "properties": {
      "patient": {
        "type": "nested",
        "properties": {
          "name": {
            "type": "text"
          },
          "age": {
            "type": "integer"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Next, index a document into the example index:

```json
PUT /testindex/_doc/1
{
  "patient": {
    "name": "John Doe",
    "age": 56
  }
}
```
{% include copy-curl.html %}

To search the nested `patient` field, wrap your query in a `nested` query and provide the `path` to the nested field:

```json
GET /testindex/_search
{
  "query": {
    "nested": {
      "path": "patient",
      "query": {
        "match": {
          "patient.name": "John"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The query returns the matching document:

```json
{
  "took": 3,
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
    "max_score": 0.2876821,
    "hits": [
      {
        "_index": "testindex",
        "_id": "1",
        "_score": 0.2876821,
        "_source": {
          "patient": {
            "name": "John Doe",
            "age": 56
          }
        }
      }
    ]
  }
}
```

## Retrieving inner hits

To return inner hits that matched the query, provide the `inner_hits` parameter:

```json
GET /testindex/_search
{
  "query": {
    "nested": {
      "path": "patient",
      "query": {
        "match": {
          "patient.name": "John"
        }
      },
      "inner_hits": {}
    }
  }
}
```
{% include copy-curl.html %}

The response contains the additional `inner_hits` field. The `_nested` field identifies the specific inner object from which the inner hit originated. It contains the nested hit and the offset relative to its position in the `_source`. Because of sorting and scoring, the position of the hit objects in `inner_hits` often differs from their original location in the nested object.

By default, the `_source` of the hit objects within `inner_hits` is returned relative to the `_nested` field. In this example, the `_source` within `inner_hits` contains the `name` and `age` fields as opposed to the top-level `_source`, which contains the whole `patient` object:

```json
{
  "took": 38,
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
    "max_score": 0.2876821,
    "hits": [
      {
        "_index": "testindex",
        "_id": "1",
        "_score": 0.2876821,
        "_source": {
          "patient": {
            "name": "John Doe",
            "age": 56
          }
        },
        "inner_hits": {
          "patient": {
            "hits": {
              "total": {
                "value": 1,
                "relation": "eq"
              },
              "max_score": 0.2876821,
              "hits": [
                {
                  "_index": "testindex",
                  "_id": "1",
                  "_nested": {
                    "field": "patient",
                    "offset": 0
                  },
                  "_score": 0.2876821,
                  "_source": {
                    "name": "John Doe",
                    "age": 56
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

You can disable returning `_source` by configuring the `_source` field in the mappings. For more information, see [Source]({{site.url}}{{site.baseurl}}/mappings/metadata-fields/source/).
{: .tip}

For more information about retrieving inner hits, see [Inner hits]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/inner-hits/).

## Multi-level nested queries

You can search documents that have nested objects inside other nested objects using multi-level nested queries. In this example, you'll query multiple layers of nested fields by specifying a nested query for each level of the hierarchy.

First, create an index with multi-level nested fields:

```json
PUT /patients
{
  "mappings": {
    "properties": {
      "patient": {
        "type": "nested",
        "properties": {
          "name": {
            "type": "text"
          },
          "contacts": {
            "type": "nested",
            "properties": {
              "name": {
                "type": "text"
              },
              "relationship": {
                "type": "text"
              },
              "phone": {
                "type": "keyword"
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

Next, index a document into the example index:

```json
PUT /patients/_doc/1
{
  "patient": {
    "name": "John Doe",
    "contacts": [
      {
        "name": "Jane Doe",
        "relationship": "mother",
        "phone": "5551111"
      },
      {
        "name": "Joe Doe",
        "relationship": "father",
        "phone": "5552222"
      }
    ]
  }
}
```
{% include copy-curl.html %}

To search the nested `patient` field, use a multi-level `nested` query. The following query searches for patients whose contact information includes a person named `Jane` with a relationship of `mother`:

```json
GET /patients/_search
{
  "query": {
    "nested": {
      "path": "patient",
      "query": {
        "nested": {
          "path": "patient.contacts",
          "query": {
            "bool": {
              "must": [
                { "match": { "patient.contacts.relationship": "mother" } },
                { "match": { "patient.contacts.name": "Jane" } }
              ]
            }
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The query returns the patient who has a contact entry matching these details:

```json
{
  "took": 14,
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
    "max_score": 1.3862942,
    "hits": [
      {
        "_index": "patients",
        "_id": "1",
        "_score": 1.3862942,
        "_source": {
          "patient": {
            "name": "John Doe",
            "contacts": [
              {
                "name": "Jane Doe",
                "relationship": "mother",
                "phone": "5551111"
              },
              {
                "name": "Joe Doe",
                "relationship": "father",
                "phone": "5552222"
              }
            ]
          }
        }
      }
    ]
  }
}
```

## Parameters

The following table lists all top-level parameters supported by `nested` queries.

| Parameter  | Required/Optional | Description  |
|:---|:---|:---|
| `path` | Required | Specifies the path to the nested object that you want to search. |
| `query` | Required | The query to run on the nested objects within the specified `path`. If a nested object matches the query, the root parent document is returned. You can search nested fields using dot notation, such as `nested_object.subfield`. Multi-level nesting is supported and automatically detected. Thus, an inner `nested` query within another nested query automatically matches the correct nesting level, instead of the root. |
| `ignore_unmapped` | Optional | Indicates whether to ignore unmapped `path` fields and not return documents instead of throwing an error. You can provide this parameter when querying multiple indexes, some of which may not contain the `path` field. Default is `false`. |
| `score_mode` | Optional | Defines how scores of matching inner documents influence the parent document's score. Valid values are: <br> - `avg`: Uses the average relevance score of all matching inner documents. <br> - `max`: Assigns the highest relevance score from the matching inner documents to the parent. <br> - `min`: Assigns the lowest relevance score from the matching inner documents to the parent. <br> - `sum`: Sums the relevance scores of all matching inner documents. <br> - `none`: Ignores the relevance scores of inner documents and assigns a score of `0` to the parent document. <br> Default is `avg`. |
| `inner_hits` | Optional | If provided, returns the underlying hits that matched the query. |

## Next steps

- Learn more about [retrieving inner hits]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/inner-hits/).