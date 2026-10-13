---
layout: default
title: Percolate
parent: Specialized queries
nav_order: 55
---

# Percolate query

Use the `percolate` query to find saved queries that match a given document. This operation is the opposite of a regular search: instead of finding documents that match a query, you find queries that match a document. `percolate` queries are often used for alerting, notifications, and reverse search use cases.

When working with `percolate` queries, consider the following key points:

- You can percolate a document provided inline or fetch an existing document from an index.
- The document and the stored queries must use the same field names and types.
- You can combine percolation with filtering and scoring to build complex matching systems.
- `percolate` queries are considered [expensive queries]({{site.url}}{{site.baseurl}}/query-dsl/#expensive-queries) and run only if the cluster setting `search.allow_expensive_queries` is set to `true` (default). If this setting is `false`, OpenSearch rejects `percolate` queries.

`percolate` queries are useful in a variety of real-time matching scenarios. Some common use cases include:

- Users register interest in products, for example, "Notify me when new Apple laptops are in stock." When new product documents are indexed, the system finds all users with matching saved queries and sends them notifications.
- Job seekers save queries based on preferred job titles or locations, and new job postings are matched against these queries to trigger alerts.
- Incoming log or event data is percolated against saved security rules or anomaly patterns.
- Incoming news articles are matched against saved topic profiles to categorize them or deliver them to interested readers.

Saved queries are stored in a [`percolator` field]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/percolator/). When you run a `percolate` query, OpenSearch compares the document against the saved queries and returns each matching query, identified by its `_id`. If you enable highlighting, the response also contains the matching text from the document. If you percolate multiple documents, the `_percolator_document_slot` field identifies the documents that each query matched.

## Example

The following examples demonstrate how to save queries and test documents against them using different methods.

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

The index must also map every field that the saved queries search---in this example, `title`. OpenSearch uses these mappings to parse each saved query and the percolated document. If a field isn't mapped, saving a query that searches it fails with a `No field mapping can be found for the field with name [title]` error.

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

The response provides the saved query that searches for documents containing the word "apple" in the `title` field, identified by `_id`: `1`:

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

### Percolate in a filter context

By default, OpenSearch calculates a relevance score for each matching query. Whether a saved query matches can often be decided from its extracted terms alone, but scoring requires a full evaluation of each candidate query against the document. If you don't need scores, wrap the `percolate` query in a `constant_score` query or in the `filter` clause of a `bool` query:

```json
POST /my_percolator_index/_search
{
  "query": {
    "constant_score": {
      "filter": {
        "percolate": {
          "field": "query",
          "document": {
            "title": "Fresh Apple Harvest"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The same query matches, but each hit receives a constant score of `1.0`:

```json
{
  ...
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1.0,
    "hits": [
      {
        "_index": "my_percolator_index",
        "_id": "1",
        "_score": 1.0,
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

The query cache never stores a `percolate` query or any compound query that contains one because these queries use a large amount of memory.
{: .note}

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

The `_percolator_document_slot` field identifies each document that a saved query matched by the document's position in the `documents` array, starting at `0`:

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

You can reference an existing document already stored in another index to check for matching saved queries.

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

To make sure that you percolate the version of the document you expect, specify the `version` parameter. For example, to percolate the document only if it is still at version `1`, add `"version": 1` to the `percolate` query. If the document has been updated since then, the request fails with a `version_conflict_engine_exception` and a `409` status code.

### Percolate multiple documents in separate clauses

To percolate several documents with a separate `percolate` clause for each one, combine the clauses in a `bool` query and give each clause a `name`:

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

OpenSearch appends each clause's `name` to the `_percolator_document_slot` field, so the field name shows which clause, and therefore which document, each saved query matched:

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

If you omit `name` from multiple `percolate` clauses, OpenSearch appends the `field` value to the slot field name instead. In this example, both clauses would report matches in the same `_percolator_document_slot_query` field, so you couldn't tell which document each query matched.

Because each document has its own clause, you can also weight documents differently. In the following example, each `percolate` clause is wrapped in a `constant_score` query that assigns a different `boost`, so matches for the second document score higher:

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
                  "title": "Banana bread with honey"
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

The query that matches the second document receives the higher score:

```json
{
  ...
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 3.0,
    "hits": [
      {
        "_index": "my_percolator_index",
        "_id": "2",
        "_score": 3.0,
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
      },
      {
        "_index": "my_percolator_index",
        "_id": "1",
        "_score": 1.0,
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
      }
    ]
  }
}
```


## Batch percolation compared to separate clauses

Both batch percolation (using `documents`) and separate clauses (using `bool` with a named `percolate` clause for each document) percolate multiple documents and return the same matches. The following table compares how each approach structures the request, identifies matched documents, and supports per-document scoring.

| Feature                        | Batch (`documents`)                            | Separate clauses (`bool` + `percolate` + `name`) |
|-------------------------------|------------------------------------------------|--------------------------------------------------|
| Input format                  | One `percolate` clause containing an array of documents | One `percolate` clause per document     |
| Document identification       | By position in the `documents` array (`0`, `1`, ...) | By clause name (`apple_doc`, `banana_doc`) |
| Response field for match slot | `_percolator_document_slot: [0]`              | `_percolator_document_slot_<name>: [0]`          |
| Highlight prefix              | `0_title`, `1_title`                           | `apple_doc_title`, `banana_doc_title`            |
| Boosts                        | One boost for the whole clause, applied to all documents | A separate boost for each document's clause |
| Query parsing                 | Each saved query is parsed and matched once for all documents | Each clause matches its document separately |
| Use case                      | Bulk matching jobs, large event streams        | Per-document tracing, testing, per-document weighting |


## Highlighting matches

Highlights in a `percolate` response mark terms in the document you submitted. Each hit's highlight shows the terms that its saved query matched, so two saved queries that match the same document can highlight different parts of it.

### Highlighting a single document

This example uses the saved queries in `my_percolator_index`. Use the following request to highlight matches in the `title` field:

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

Each hit highlights the terms that its saved query matched:

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

When percolating multiple documents using the `documents` array, the highlight keys take the following form, where `<slot>` is the document's position in the `documents` array, starting at `0`:

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

## Performance considerations

When you index a saved query, OpenSearch extracts the query's terms and indexes them alongside the query. At search time, OpenSearch places the percolated document in a temporary in-memory index and uses the extracted terms to select candidate queries. Only these candidates are then run against the document, so most saved queries are never evaluated.

Terms can't be extracted from some query types, such as `wildcard` and `geo_shape` queries. For a `bool` query, extraction fails if the unsupported query is the only `must` or `filter` clause, or if it is one of the `should` clauses in a query that has no `must` or `filter` clause. If another required clause, such as a `match` query in `must` or `filter`, has extractable terms, OpenSearch selects candidates using those terms instead. A saved query whose terms can't be extracted is evaluated against every percolated document, which slows down percolation as the number of such queries grows. These queries still match correctly.

To find saved queries whose terms couldn't be extracted, search for the `failed` value in the `extraction_result` subfield of the `percolator` field. The following example adds a `wildcard` query and then searches for queries that failed term extraction:

```json
POST /my_percolator_index/_doc/3?refresh=true
{
  "query": {
    "wildcard": {
      "title": "cher*"
    }
  }
}
```
{% include copy-curl.html %}

```json
GET /my_percolator_index/_search
{
  "query": {
    "term": {
      "query.extraction_result": "failed"
    }
  }
}
```
{% include copy-curl.html %}

The response contains the `wildcard` query:

```json
{
  ...
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1.0,
    "hits": [
      {
        "_index": "my_percolator_index",
        "_id": "3",
        "_score": 1.0,
        "_source": {
          "query": {
            "wildcard": {
              "title": "cher*"
            }
          }
        }
      }
    ]
  }
}
```

Store saved queries and percolated documents in separate indexes, as the preceding examples do. Separate indexes provide the following advantages:

- Documents in each index share the same fields, so OpenSearch stores them more compactly.
- You can configure the saved query index's settings, such as the number of primary shards, independently of the document index. This matters because percolation performance scales differently from regular search performance.

## Parameters

The `percolate` query supports the following parameters. Provide the document to percolate either inline (using `document` or `documents`) or by reference (using `index` and `id`).

| Parameter | Required/Optional | Description |
|-----------|-------------------|-------------|
| `field` | Required | The `percolator` field containing the saved queries. |
| `document` | Optional | A single inline document to match against saved queries. |
| `documents` | Optional | An array of inline documents to match against saved queries. |
| `index` | Optional | The index containing the stored document to percolate. Required if `id` is specified. |
| `id` | Optional | The ID of the stored document to percolate. Required if `index` is specified. |
| `routing` | Optional | The routing value to use when fetching the stored document. |
| `preference` | Optional | The shard preference to use when fetching the stored document. |
| `version` | Optional | The expected version of the stored document. If the document's current version is different, the request fails with a version conflict error. |
| `name` | Optional | A name for the `percolate` clause. OpenSearch appends the name to the `_percolator_document_slot` field in the response. Use `name` to distinguish matches when a search contains multiple `percolate` clauses. |
