---
layout: default
title: Percolate
parent: Specialized queries
nav_order: 55
---

# Percolate

Use the `percolate` query to find stored queries that match a given document. This operation is the opposite of a regular search: instead of finding documents that match a query, you find queries that match a document. `percolate` queries are often used for alerting, notifications, and reverse search use cases.

When working with `percolate` queries, consider the following key points:

- You can percolate a document provided inline or fetch an existing document from an index.
- The document and the stored queries must use the same field names and types.
- You can combine percolation with filtering and scoring to build complex matching systems.
- `percolate` queries are considered [expensive queries]({{site.url}}{{site.baseurl}}/query-dsl/#expensive-queries) and will only run if the cluster setting `search.allow_expensive_queries` is set to `true` (default). If this setting is `false`, `percolate` queries will be rejected.

`percolate` queries are useful in a variety of real-time matching scenarios. Some common use cases include:

- **E-commerce notifications**: Users can register interest in products, for example, "Notify me when new Apple laptops are in stock". When new product documents are indexed, the system finds all users with matching saved queries and sends alerts.
- **Job alerts**: Job seekers save queries based on preferred job titles or locations, and new job postings are matched against these to trigger alerts.
- **Security and alerting systems**: Percolate incoming log or event data against saved rules or anomaly patterns.
- **News filtering**: Match incoming articles against saved topic profiles to categorize or deliver relevant content.

## How percolation works

1. Saved queries are stored in a special [`percolator` field type]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/percolator/).
2. Documents are compared against all saved queries.
3. Each matching query is returned with its `_id`.
4. If highlighting is enabled, matched text snippets are also returned.
5. If multiple documents are sent, `_percolator_document_slot` displays the matching document.

## Example

The following examples demonstrate how to store `percolate` queries and test documents against them using different methods.

### Create an index for storing saved queries

First, create an index and configure its `mappings` with a [`percolator` field type]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/percolator/) to store the saved queries:

```json
PUT /my_percolator_index
{
  "mappings": {
    "properties": {
      "query": {
        "type": "percolator"
      },
      "title": {
        "type": "text"
      }
    }
  }
}
```
{% include copy-curl.html %}

Add a query matching "apple" in the `title` field:

```json
POST /my_percolator_index/_doc/1
{
  "query": {
    "match": {
      "title": "apple"
    }
  }
}
```
{% include copy-curl.html %}

Add a query matching "banana" in the `title` field:

```json
POST /my_percolator_index/_doc/2
{
  "query": {
    "match": {
      "title": "banana"
    }
  }
}
```
{% include copy-curl.html %}

### Percolate an inline document

Test an inline document against the saved queries:

```json
POST /my_percolator_index/_search
{
  "query": {
    "percolate": {
      "field": "query",
      "document": {
        "title": "Fresh Apple Harvest"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response provides the stored `percolate` query that searches for documents containing the word "apple" in the `title` field, identified by `_id`: `1`:

```json
{
  ...
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 0.13076457,
    "hits": [
      {
        "_index": "my_percolator_index",
        "_id": "1",
        "_score": 0.13076457,
        "_source": {
          "query": {
            "match": {
              "title": "apple"
            }
          }
        },
        "fields": {
          "_percolator_document_slot": [
            0
          ]
        }
      }
    ]
  }
}
```

### Percolate with multiple documents

To test multiple documents in the same query, use the following request:

```json
POST /my_percolator_index/_search
{
  "query": {
    "percolate": {
      "field": "query",
      "documents": [
        { "title": "Banana flavoured ice-cream" },
        { "title": "Apple pie recipe" },
        { "title": "Banana bread instructions" },
        { "title": "Cherry tart" }
      ]
    }
  }
}
```
{% include copy-curl.html %}

The `_percolator_document_slot` field helps you identify each document (by index) matching each saved query:

```json
{
  ...
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 0.54726034,
    "hits": [
      {
        "_index": "my_percolator_index",
        "_id": "1",
        "_score": 0.54726034,
        "_source": {
          "query": {
            "match": {
              "title": "apple"
            }
          }
        },
        "fields": {
          "_percolator_document_slot": [
            1
          ]
        }
      },
      {
        "_index": "my_percolator_index",
        "_id": "2",
        "_score": 0.31506687,
        "_source": {
          "query": {
            "match": {
              "title": "banana"
            }
          }
        },
        "fields": {
          "_percolator_document_slot": [
            0,
            2
          ]
        }
      }
    ]
  }
}
```

### Percolate an existing indexed document

You can reference an existing document already stored in another index to check for matching `percolate` queries.

Create a separate index for your documents:

```json
PUT /products
{
  "mappings": {
    "properties": {
      "title": {
        "type": "text"
      }
    }
  }
}
```
{% include copy-curl.html %}

Add a document:

```json
POST /products/_doc/1
{
  "title": "Banana Smoothie Special"
}
```
{% include copy-curl.html %}

Check whether the stored queries match the indexed document:

```json
POST /my_percolator_index/_search
{
  "query": {
    "percolate": {
      "field": "query",
      "index": "products",
      "id": "1"
    }
  }
}
```
{% include copy-curl.html %}

You must provide both `index` and `id` when using a stored document.
{: .note}

The corresponding query is returned:

```json
{
  ...
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 0.13076457,
    "hits": [
      {
        "_index": "my_percolator_index",
        "_id": "2",
        "_score": 0.13076457,
        "_source": {
          "query": {
            "match": {
              "title": "banana"
            }
          }
        },
        "fields": {
          "_percolator_document_slot": [
            0
          ]
        }
      }
    ]
  }
}
```

### Batch percolation (multiple documents)

You can check multiple documents in one request:

```json
POST /my_percolator_index/_search
{
  "query": {
    "percolate": {
      "field": "query",
      "documents": [
        { "title": "Apple event coming soon" },
        { "title": "Banana farms expand" },
        { "title": "Cherry season starts" }
      ]
    }
  }
}
```
{% include copy-curl.html %}

Each match indicates the matching document in the `_percolator_document_slot` field:

```json
{
  ...
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 0.46484798,
    "hits": [
      {
        "_index": "my_percolator_index",
        "_id": "2",
        "_score": 0.46484798,
        "_source": {
          "query": {
            "match": {
              "title": "banana"
            }
          }
        },
        "fields": {
          "_percolator_document_slot": [
            1
          ]
        }
      },
      {
        "_index": "my_percolator_index",
        "_id": "1",
        "_score": 0.41211313,
        "_source": {
          "query": {
            "match": {
              "title": "apple"
            }
          }
        },
        "fields": {
          "_percolator_document_slot": [
            0
          ]
        }
      }
    ]
  }
}
```

### Multi-query percolation using a named query

You can percolate different documents inside a named query:

```json
GET /my_percolator_index/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "percolate": {
            "field": "query",
            "document": {
              "title": "Apple pie recipe"
            },
            "name": "apple_doc"
          }
        },
        {
          "percolate": {
            "field": "query",
            "document": {
              "title": "Banana bread instructions"
            },
            "name": "banana_doc"
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

The `name` parameter is appended to `_percolator_document_slot` to provide the matching query:

```json
{
  ...
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 0.13076457,
    "hits": [
      {
        "_index": "my_percolator_index",
        "_id": "1",
        "_score": 0.13076457,
        "_source": {
          "query": {
            "match": {
              "title": "apple"
            }
          }
        },
        "fields": {
          "_percolator_document_slot_apple_doc": [
            0
          ]
        }
      },
      {
        "_index": "my_percolator_index",
        "_id": "2",
        "_score": 0.13076457,
        "_source": {
          "query": {
            "match": {
              "title": "banana"
            }
          }
        },
        "fields": {
          "_percolator_document_slot_banana_doc": [
            0
          ]
        }
      }
    ]
  }
}
```

This approach enables you to configure more custom query logic for individual documents. In the following example, the `title` field is queried in the first document and the `description` field is queried in the second document. The `boost` parameter is also provided:

```json
GET /my_percolator_index/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "constant_score": {
            "filter": {
              "percolate": {
                "field": "query",
                "document": {
                  "title": "Apple pie recipe"
                },
                "name": "apple_doc"
              }
            },
            "boost": 1.0
          }
        },
        {
          "constant_score": {
            "filter": {
              "percolate": {
                "field": "query",
                "document": {
                  "description": "Banana bread with honey"
                },
                "name": "banana_doc"
              }
            },
            "boost": 3.0
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}


## Batch percolation compared to named percolation

Both batch percolation (using `documents`) and named percolation (using `bool` with `name`) can be used to percolate multiple documents, but they differ in how results are labeled, interpreted, and controlled. They provide functionally similar results but with important structural differences, described in the following table.

| Feature                        | Batch (`documents`)                            | Named (`bool` + `percolate` + `name`)            |
|-------------------------------|------------------------------------------------|--------------------------------------------------|
| Input format                  | One percolate clause, array of documents       | Multiple percolate clauses, one per document     |
| Traceability per document     | By slot index (0, 1, ...)                      | By name (`apple_doc`, `banana_doc`)        |
| Response field for match slot | `_percolator_document_slot: [0]`              | `_percolator_document_slot_<name>: [0]`          |
| Highlight prefix              | `0_title`, `1_title`                           | `apple_doc_title`, `banana_doc_title`            |
| Custom control per doc        | Not supported                                | Can customize each clause                     |
| Supports boosts and filters     | No                                           | Yes (per clause)                              |
| Performance                   | Best for large batches                      | Slightly slower when there are many clauses              |
| Use case                      | Bulk matching jobs, large event streams        | Per-document tracing, testing, custom control    |


## Highlighting matches

`percolate` queries handle highlighting differently from regular queries:

- In a regular query, the document is stored in the index, and the search query is used to highlight the matching terms.
- In a `percolate` query, the roles are reversed: the saved queries (in the percolator index) are used to highlight the document.

This means that the document provided in `document` or `documents` is the target for highlighting and that the `percolate` queries determine the sections to be highlighted.

### Highlighting a single document

This example uses the previously defined searches in `my_percolator_index`. Use the following request to highlight matches in the `title` field:

```json
POST /my_percolator_index/_search
{
  "query": {
    "percolate": {
      "field": "query",
      "document": {
        "title": "Apple banana smoothie"
      }
    }
  },
  "highlight": {
    "fields": {
      "title": {}
    }
  }
}
```
{% include copy-curl.html %}

The matches are highlighted depending on the query that was matched:

```json
{
  ...
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 0.13076457,
    "hits": [
      {
        "_index": "my_percolator_index",
        "_id": "1",
        "_score": 0.13076457,
        "_source": {
          "query": {
            "match": {
              "title": "apple"
            }
          }
        },
        "fields": {
          "_percolator_document_slot": [
            0
          ]
        },
        "highlight": {
          "title": [
            "<em>Apple</em> banana smoothie"
          ]
        }
      },
      {
        "_index": "my_percolator_index",
        "_id": "2",
        "_score": 0.13076457,
        "_source": {
          "query": {
            "match": {
              "title": "banana"
            }
          }
        },
        "fields": {
          "_percolator_document_slot": [
            0
          ]
        },
        "highlight": {
          "title": [
            "Apple <em>banana</em> smoothie"
          ]
        }
      }
    ]
  }
}
```

### Highlighting multiple documents

When percolating multiple documents using the `documents` array, a slot index is assigned to each document. The highlight keys then take the following form, where `<slot>` is the index of the document in your `documents` array:

```json
"<slot>_<fieldname>": [ ... ]
```

Use the following command to percolate two documents with highlighting:

```json
POST /my_percolator_index/_search
{
  "query": {
    "percolate": {
      "field": "query",
      "documents": [
        { "title": "Apple pie recipe" },
        { "title": "Banana smoothie ideas" }
      ]
    }
  },
  "highlight": {
    "fields": {
      "title": {}
    }
  }
}
```
{% include copy-curl.html %}

The response contains highlighting fields prefixed with document slots, such as `0_title` and `1_title`:

```json
{
  ...
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 0.31506687,
    "hits": [
      {
        "_index": "my_percolator_index",
        "_id": "1",
        "_score": 0.31506687,
        "_source": {
          "query": {
            "match": {
              "title": "apple"
            }
          }
        },
        "fields": {
          "_percolator_document_slot": [
            0
          ]
        },
        "highlight": {
          "0_title": [
            "<em>Apple</em> pie recipe"
          ]
        }
      },
      {
        "_index": "my_percolator_index",
        "_id": "2",
        "_score": 0.31506687,
        "_source": {
          "query": {
            "match": {
              "title": "banana"
            }
          }
        },
        "fields": {
          "_percolator_document_slot": [
            1
          ]
        },
        "highlight": {
          "1_title": [
            "<em>Banana</em> smoothie ideas"
          ]
        }
      }
    ]
  }
}
```

## Parameters

The `percolate` query supports the following parameters.

| Parameter | Required/Optional | Description |
|-----------|-------------------|-------------|
| `field` | Required | The field containing the stored `percolate` queries. |
| `document` | Optional | A single inline document to match against saved queries. |
| `documents` | Optional | An array of multiple inline documents to match against saved queries. |
| `index` | Optional | An index containing the document you want to match. |
| `id` | Optional | The ID of the document to fetch from the index. |
| `routing` | Optional | The routing value to use when fetching the document. |
| `preference` | Optional | The preference for the shard routing when fetching the document. |
| `name` | Optional | The name assigned to a `percolate` clause. Helpful when using multiple `percolate` clauses in a `bool` query. |
