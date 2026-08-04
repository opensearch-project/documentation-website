---
layout: default
title: Span near
parent: Span queries
grand_parent: Query DSL
nav_order: 50
canonical_url: https://docs.opensearch.org/latest/query-dsl/span/span-near/
---

# Span near query

The `span_near` query matches spans that are near one another. You can specify how far apart the spans can be and whether they need to appear in a specific order.

For example, you can use the `span_near` query to:
- Find terms that appear within a certain distance of each other.
- Match phrases in which words appear in a specific order.
- Find related concepts that appear close to each other in text.

## Example

To try the examples in this section, complete the [setup steps]({{site.url}}{{site.baseurl}}/query-dsl/span/#setup).
{: .tip}

The following query searches for any forms of "sleeve" and "long" appearing next to each other, in any order:

```json
GET /clothing/_search
{
  "query": {
    "span_near": {
      "clauses": [
        {
          "span_term": {
            "description.stemmed": "sleev"
          }
        },
        {
          "span_term": {
            "description.stemmed": "long"
          }
        }
      ],
      "slop": 1,
      "in_order": false
    }
  }
}
```
{% include copy-curl.html %}

The query matches documents 1 ("Long-sleeved...") and 2 ("...long fluttered sleeves..."). In document 1, the words are next to each other, while in document 2, they are within the specified slop distance of `1` (there is 1 word between them).

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
      "value": 2,
      "relation": "eq"
    },
    "max_score": 0.36496973,
    "hits": [
      {
        "_index": "clothing",
        "_id": "1",
        "_score": 0.36496973,
        "_source": {
          "description": "Long-sleeved dress shirt with a formal collar and button cuffs. "
        }
      },
      {
        "_index": "clothing",
        "_id": "4",
        "_score": 0.25312424,
        "_source": {
          "description": "A set of two midi silk shirt dresses with long fluttered sleeves in black. "
        }
      }
    ]
  }
}
```

## Parameters

The following table lists all top-level parameters supported by `span_near` queries.

| Parameter | Data type | Description | 
|:----------|:-----|:------------|
| `clauses` | An array of span queries that define the terms or phrases to match. All specified terms must appear within the defined slop distance. Required. |
| `slop` | Integer | The maximum number of intervening unmatched positions between spans. Required. |
| `in_order` | Boolean | Whether spans need to appear in the same order as in the `clauses` array. Optional. Default is `false`. |
