---
layout: default
title: Span within
parent: Span queries
grand_parent: Query DSL
nav_order: 90
---

# Span within query

The `span_within` query matches spans that are enclosed by another span query. It is the opposite of [`span_containing`]({{site.url}}{{site.baseurl}}/query-dsl/span/span-containing/): `span_containing` returns larger spans containing smaller ones, whereas `span_within` returns smaller spans enclosed by larger ones.

For example, you can use the `span_within` query to:
- Find shorter phrases that appear within longer phrases.
- Match terms that occur within specific contexts.
- Identify smaller patterns enclosed by larger patterns.

## Example

To try the examples in this section, complete the [setup steps]({{site.url}}{{site.baseurl}}/query-dsl/span/#setup).
{: .tip}

The following query searches for the word "dress" when it appears within a span containing "shirt" and "long":

```json
GET /clothing/_search
{
  "query": {
    "span_within": {
      "little": {
        "span_term": {
          "description": "dress"
        }
      },
      "big": {
        "span_near": {
          "clauses": [
            {
              "span_term": {
                "description": "shirt"
              }
            },
            {
              "span_term": {
                "description": "long"
              }
            }
          ],
          "slop": 2,
          "in_order": false
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The query matches document 1 because:
- The word "dress" appears within a larger span ("Long-sleeved dress shirt...").
- The larger span contains "shirt" and "long" within 2 words of each other (there are 2 words between them).

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

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
    "max_score": 1.4677674,
    "hits": [
      {
        "_index": "clothing",
        "_id": "1",
        "_score": 1.4677674,
        "_source": {
          "description": "Long-sleeved dress shirt with a formal collar and button cuffs. "
        }
      }
    ]
  }
}
```
</details>

## Parameters

The following table lists all top-level parameters supported by `span_within` queries. All parameters are required.

| Parameter | Data type | Description |
|:----------|:-----|:------------|
| `little` | Object | The span query that must be contained within the `big` span. This defines the span you're searching for within a larger context. |
| `big` | Object | The containing span query that defines the boundaries within which the `little` span must appear. This establishes the context for your search. |