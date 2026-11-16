---
layout: default
title: Span or
parent: Span queries
grand_parent: Query DSL
nav_order: 70
canonical_url: https://docs.opensearch.org/latest/query-dsl/span/span-or/
---

# Span or query

The `span_or` query combines multiple span queries and matches the union of their spans. A match occurs if at least one of the contained span queries matches.

For example, you can use the `span_or` query to:
- Find spans matching any of several patterns.
- Combine different span patterns as alternatives.
- Match multiple span variations in a single query.

## Example

To try the examples in this section, complete the [setup steps]({{site.url}}{{site.baseurl}}/query-dsl/span/#setup).
{: .tip}

The following query searches for either "formal collar" or "button collar" appearing within 2 words of each other:

```json
GET /clothing/_search
{
  "query": {
    "span_or": {
      "clauses": [
        {
          "span_near": {
            "clauses": [
              {
                "span_term": {
                  "description": "formal"
                }
              },
              {
                "span_term": {
                  "description": "collar"
                }
              }
            ],
            "slop": 0,
            "in_order": true
          }
        },
        {
          "span_near": {
            "clauses": [
              {
                "span_term": {
                  "description": "button"
                }
              },
              {
                "span_term": {
                  "description": "collar"
                }
              }
            ],
            "slop": 2,
            "in_order": true
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

The query matches documents 1 ("...formal collar...") and 3 ("...button-down collar...") within the specified slop distance.

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

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
      "value": 2,
      "relation": "eq"
    },
    "max_score": 2.170027,
    "hits": [
      {
        "_index": "clothing",
        "_id": "1",
        "_score": 2.170027,
        "_source": {
          "description": "Long-sleeved dress shirt with a formal collar and button cuffs. "
        }
      },
      {
        "_index": "clothing",
        "_id": "3",
        "_score": 1.2509141,
        "_source": {
          "description": "Short-sleeved shirt with a button-down collar, can be dressed up or down."
        }
      }
    ]
  }
}
```
</details>

## Parameters

The following table lists all top-level parameters supported by `span_or` queries.

| Parameter | Data type | Description |
|:----------|:-----|:------------|
| `clauses` | Array | The array of span queries to match. The query matches if any of these span queries match. Must contain at least one span query. Required. |
