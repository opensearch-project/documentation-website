---
layout: default
title: Span field masking
parent: Span queries
grand_parent: Query DSL
nav_order: 20
canonical_url: https://docs.opensearch.org/latest/query-dsl/span/span-field-masking/
---

# Span field masking query

The `field_masking_span` query allows span queries to match across different fields by "masking" the true field of a query. This is particularly useful when working with multi-fields (the same content indexed with different analyzers) or when you need to run span queries like `span_near` or `span_or` across different fields (which is normally not allowed).

For example, you can use the `field_masking_span` query to:
- Match terms across a raw field and its stemmed version.
- Combine span queries on different fields in a single span operation.
- Work with the same content indexed using different analyzers.

When using field masking, the relevance score is calculated using the characteristics (norms) of the masked field rather than the actual field being searched. This means that if the masked field has different properties (like length or boost values) than the field being searched, you might receive unexpected scoring results.
{: .note}

## Example

To try the examples in this section, complete the [setup steps]({{site.url}}{{site.baseurl}}/query-dsl/span/#setup).
{: .tip}

The following query searches for the word "long" near variations of the word "sleeve" in the stemmed field:

```json
GET /clothing/_search
{
  "query": {
    "span_near": {
      "clauses": [
        {
          "span_term": {
            "description": "long"
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
      "slop": 1,
      "in_order": true
    }
  }
}

```
{% include copy-curl.html %}

The query matches documents 1 and 4:
- The term "long" appears in the `description` field in both documents.
- Document 1 contains the word "sleeved", and document 4 contains the word "sleeves".
- The `field_masking_span` makes the stemmed field match appear as if it were in the raw field.
- The terms appear within 1 position of each other in the specified order ("long" must appear before "sleeve").

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 7,
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
    "max_score": 0.7444251,
    "hits": [
      {
        "_index": "clothing",
        "_id": "1",
        "_score": 0.7444251,
        "_source": {
          "description": "Long-sleeved dress shirt with a formal collar and button cuffs. "
        }
      },
      {
        "_index": "clothing",
        "_id": "4",
        "_score": 0.4291246,
        "_source": {
          "description": "A set of two midi silk shirt dresses with long fluttered sleeves in black. "
        }
      }
    ]
  }
}
```

## Parameters

The following table lists all top-level parameters supported by `field_masking_span` queries. All parameters are required.

| Parameter | Data type | Description |
|:----------|:-----|:------------|
| `query` | Object | The span query to execute on the actual field. |
| `field` | String | The field name used to mask the query. Other span queries will treat this query as if it were executing on this field. |
