---
layout: default
title: Span multi-term
parent: Span queries
grand_parent: Query DSL
nav_order: 40
---

# Span multi-term query

The `span_multi` query allows you to wrap a multi-term query (like `wildcard`, `fuzzy`, `prefix`, `range`, or `regexp`) as a span query. This enables you to use these more flexible matching queries within other span queries.

For example, you can use the `span_multi` query to:
- Find words with common prefixes near other terms.
- Match fuzzy variations of words within spans.
- Use regular expressions in span queries.

>`span_multi` queries can potentially match many terms. To avoid excessive memory usage, you can:
>- Set the `rewrite` parameter for the multi-term query.
>- Use the `top_terms_*` rewrite method.
>- Consider enabling the `index_prefixes` option for the text field if you use `span_multi` only for a `prefix` query. This automatically rewrites any `prefix` query on the field into a single-term query that matches the indexed prefix.
{: .note}

## Example

To try the examples in this section, complete the [setup steps]({{site.url}}{{site.baseurl}}/query-dsl/span/index/#setup).
{: .tip}

The `span_multi` query uses the following syntax to wrap the `prefix` query:

```json
"span_multi": {
  "match": {
    "prefix": {
      "description": {
        "value": "flutter"
      }
    }
  }
}
```

The following query searches for words starting with "dress" near any form of "sleeve" within at most 5 words of each other:

```json
GET /clothing/_search
{
  "query": {
    "span_near": {
      "clauses": [
        {
          "span_multi": {
            "match": {
              "prefix": {
                "description": {
                  "value": "dress"
                }
              }
            }
          }
        },
        {
          "field_masking_span": {
            "query": {
              "span_term": {
                "description.stemmed": "sleev"
              }
            },
            "field": "description"
          }
        }
      ],
      "slop": 5,
      "in_order": false
    }
  }
}
```
{% include copy-curl.html %}

The query matches documents 1 ("Long-sleeved dress...") and 4 ("...dresses with long fluttered sleeves...") because "dress" and "long" occur within the maximum distance in both documents.

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 5,
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
    "max_score": 1.7590723,
    "hits": [
      {
        "_index": "clothing",
        "_id": "1",
        "_score": 1.7590723,
        "_source": {
          "description": "Long-sleeved dress shirt with a formal collar and button cuffs. "
        }
      },
      {
        "_index": "clothing",
        "_id": "4",
        "_score": 0.84792376,
        "_source": {
          "description": "A set of two midi silk shirt dresses with long fluttered sleeves in black. "
        }
      }
    ]
  }
}
```
</details>

## Parameters

The following table lists all top-level parameters supported by `span_multi` queries. All parameters are required.

| Parameter | Data type | Description |
|:----------|:-----|:------------|
| `match` | Object | The multi-term query to wrap (can be `prefix`, `wildcard`, `fuzzy`, `range`, or `regexp`). |
