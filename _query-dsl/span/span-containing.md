---
layout: default
title: Span containing
parent: Span queries
grand_parent: Query DSL
nav_order: 10
---

# Span containing query

The `span_containing` query finds matches where a larger text pattern (like a phrase or a set of words) contains a smaller text pattern within its boundaries. Think of it as finding a word or phrase but only when it appears within a specific larger context.

For example, you can use the `span_containing` query to perform the following searches:

- Find the word "quick" but only when it appears in sentences that mention both foxes and behavior.
- Ensure that certain terms appear within the context of other terms---not just anywhere in the document.
- Search for specific words that appear within larger meaningful phrases.

## Example

To try the examples in this section, complete the [setup steps]({{site.url}}{{site.baseurl}}/query-dsl/span/#setup).
{: .tip}

The following query searches for occurrences of the word "red" that appear within a larger span containing the words "silk" and "dress" (not necessarily in that order) within 5 words of each other:

```json
GET /clothing/_search
{
  "query": {
    "span_containing": {
      "little": {
        "span_term": {
          "description": "red"
        }
      },
      "big": {
        "span_near": {
          "clauses": [
            {
              "span_term": {
                "description": "silk"
              }
            },
            {
              "span_term": {
                "description": "dress"
              }
            }
          ],
          "slop": 5,
          "in_order": false
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The query matches document 1 because:

- It finds a span in which "silk" and "dress" appear within at most 5 words of each other ("...dress in red silk..."). The terms "silk" and "dress" are within 2 words of each other (there are 2 words between them).
- Within this larger span, it finds the term "red".

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
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1.1577396,
    "hits": [
      {
        "_index": "clothing",
        "_id": "2",
        "_score": 1.1577396,
        "_source": {
          "description": "Beautiful long dress in red silk, perfect for formal events."
        }
      }
    ]
  }
}
```

</details>

Both `little` and `big` parameters can contain any type of span query, allowing for complex nested span queries when needed.

## Parameters

The following table lists all top-level parameters supported by `span_containing` queries. All parameters are required.

| Parameter |  Data type | Description |
|:-----------|:------|:-------------|
| `little` | Object | The span query that must be contained within the `big` span. This defines the span you're searching for within a larger context. |
| `big` | Object | The containing span query that defines the boundaries within which the `little` span must appear. This establishes the context for your search. |