---
layout: default
title: Position increment gap
parent: Mapping parameters
grand_parent: Mapping and field types
nav_order: 140
has_children: false
has_toc: false
---

# Position increment gap

The `position_increment_gap` mapping parameter defines the positional distance between tokens of multi-valued fields during indexing. This affects how [`match_phrase`]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match-phrase/) and [`span`]({{site.url}}{{site.baseurl}}/query-dsl/span/index/) queries behave when searching across multiple values of the same field.

By default, each new value in a multi-valued field is treated as if it is separated from the previous one by a gap of `100` positions. This helps prevent false positives when searching for phrases that may span across different field values.

## Setting a position increment gap

Use the following request to create an index named `articles` with a `tags` field of type `text`, setting `position_increment_gap` to `0`:

```json
PUT /articles
{
  "mappings": {
    "properties": {
      "tags": {
        "type": "text",
        "position_increment_gap": 0
      }
    }
  }
}
```
{% include copy-curl.html %}

## Indexing a multi-valued field

Use the following request to index a document in which the `tags` field contains multiple values:

```json
PUT /articles/_doc/1
{
  "tags": ["machine", "learning"]
}
```
{% include copy-curl.html %}

## Search using a `match_phrase` query

Use the following `match_phrase` query to search for "machine learning" in the `tags` field:

```json
GET /articles/_search
{
  "query": {
    "match_phrase": {
      "tags": "machine learning"
    }
  }
}
```
{% include copy-curl.html %}

The result demonstrates that the phrase match succeeds because the `position_increment_gap` is set to `0`, allowing tokens from separate values to be treated as adjacent:

```json
{
  ...
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 0.5753642,
    "hits": [
      {
        "_index": "articles",
        "_id": "1",
        "_score": 0.5753642,
        "_source": {
          "tags": [
            "machine",
            "learning"
          ]
        }
      }
    ]
  }
}
```

If the `position_increment_gap` remained at `100`, no hits would be returned because tokens `machine` and `learning` would be considered to be 100 positions away from each other.
