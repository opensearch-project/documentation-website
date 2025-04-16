---
layout: default
title: Term vector
parent: Mapping parameters
grand_parent: Mapping and field types
nav_order: 190
has_children: false
has_toc: false
---

# Term vector

The `term_vector` mapping parameter controls whether term-level information is stored for individual text fields during indexing. This information includes details such as term frequency, position, and character offsets, which can be used for advanced features like custom scoring and highlighting.

By default, `term_vector` is disabled. When enabled, term vectors are stored and can be retrieved using the `_termvectors` API.

Enabling `term_vector` increases index size. Use only when you need detailed term-level data.
{: .important}

## Configuration options

The `term_vector` parameter supports the following valid values:

- `no` (default): Term vectors are not stored.
- `yes`: Store term frequencies and basic positions.
- `with_positions`: Store term positions.
- `with_offsets`: Store character offsets.
- `with_positions_offsets`: Store both positions and offsets.
- `with_positions_payloads`: Store positions and payloads (if payloads are indexed).
- `with_positions_offsets_payloads`: Store all term vector data.

## Enabling term_vector on a field

The following request creates an index named `articles` with the `content` field configured to store term vectors, including positions and offsets:

```json
PUT /articles
{
  "mappings": {
    "properties": {
      "content": {
        "type": "text",
        "term_vector": "with_positions_offsets"
      }
    }
  }
}
```
{% include copy-curl.html %}


Index a sample document:

```json
PUT /articles/_doc/1
{
  "content": "OpenSearch is an open-source search and analytics suite."
}
```
{% include copy-curl.html %}


Retrieve term-level statistics using the `_termvectors` API:

```json
POST /articles/_termvectors/1
{
  "fields": ["content"],
  "term_statistics": true,
  "positions": true,
  "offsets": true
}
```
{% include copy-curl.html %}

Expected result:

```json
{
  "_index": "articles",
  "_id": "1",
  "_version": 1,
  "found": true,
  "took": 4,
  "term_vectors": {
    "content": {
      "field_statistics": {
        "sum_doc_freq": 9,
        "doc_count": 1,
        "sum_ttf": 9
      },
      "terms": {
        "an": {
          "doc_freq": 1,
          "ttf": 1,
          "term_freq": 1,
          "tokens": [
            {
              "position": 2,
              "start_offset": 14,
              "end_offset": 16
            }
          ]
        },
        "analytics": {
          "doc_freq": 1,
          "ttf": 1,
          "term_freq": 1,
          "tokens": [
            {
              "position": 7,
              "start_offset": 40,
              "end_offset": 49
            }
          ]
        },
        "and": {
          "doc_freq": 1,
          "ttf": 1,
          "term_freq": 1,
          "tokens": [
            {
              "position": 6,
              "start_offset": 36,
              "end_offset": 39
            }
          ]
        },
        "is": {
          "doc_freq": 1,
          "ttf": 1,
          "term_freq": 1,
          "tokens": [
            {
              "position": 1,
              "start_offset": 11,
              "end_offset": 13
            }
          ]
        },
        "open": {
          "doc_freq": 1,
          "ttf": 1,
          "term_freq": 1,
          "tokens": [
            {
              "position": 3,
              "start_offset": 17,
              "end_offset": 21
            }
          ]
        },
        "opensearch": {
          "doc_freq": 1,
          "ttf": 1,
          "term_freq": 1,
          "tokens": [
            {
              "position": 0,
              "start_offset": 0,
              "end_offset": 10
            }
          ]
        },
        "search": {
          "doc_freq": 1,
          "ttf": 1,
          "term_freq": 1,
          "tokens": [
            {
              "position": 5,
              "start_offset": 29,
              "end_offset": 35
            }
          ]
        },
        "source": {
          "doc_freq": 1,
          "ttf": 1,
          "term_freq": 1,
          "tokens": [
            {
              "position": 4,
              "start_offset": 22,
              "end_offset": 28
            }
          ]
        },
        "suite": {
          "doc_freq": 1,
          "ttf": 1,
          "term_freq": 1,
          "tokens": [
            {
              "position": 8,
              "start_offset": 50,
              "end_offset": 55
            }
          ]
        }
      }
    }
  }
}
```

## Highlighting with term vectors

Use the following command to search for the term "analytics" and highlight it using the field's stored term vectors:

```json
POST /articles/_search
{
  "query": {
    "match": {
      "content": "analytics"
    }
  },
  "highlight": {
    "fields": {
      "content": {
        "type": "fvh"
      }
    }
  }
}
```
{% include copy-curl.html %}

Expected result:

```json
{
  ...
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 0.2876821,
    "hits": [
      {
        "_index": "articles",
        "_id": "1",
        "_score": 0.2876821,
        "_source": {
          "content": "OpenSearch is an open-source search and analytics suite."
        },
        "highlight": {
          "content": [
            "OpenSearch is an open-source search and <em>analytics</em> suite."
          ]
        }
      }
    ]
  }
}
```