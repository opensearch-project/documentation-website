---
layout: default
title: Span term
parent: Span queries
grand_parent: Query DSL
nav_order: 80
canonical_url: https://docs.opensearch.org/latest/query-dsl/span/span-term/
---

# Span term query

The `span_term` query is the most basic span query that matches spans containing a single term. It serves as a building block for more complex span queries.

For example, you can use the `span_term` query to:
- Find exact term matches that can be used in other span queries.
- Match specific words while maintaining position information.
- Create basic spans that can be combined with other span queries.

## Example

To try the examples in this section, complete the [setup steps]({{site.url}}{{site.baseurl}}/query-dsl/span/#setup).
{: .tip}

The following query searches for the exact term "formal":

```json
GET /clothing/_search
{
  "query": {
    "span_term": {
      "description": "formal"
    }
  }
}
```
{% include copy-curl.html %}

Alternatively, you can specify the search term in the `value` parameter:

```json
GET /clothing/_search
{
  "query": {
    "span_term": {
      "description": {
        "value": "formal"
      }
    }
  }
}
```
{% include copy-curl.html %}

You can also specify a `boost` value in order to boost the document score:

```json
GET /clothing/_search
{
  "query": {
    "span_term": {
      "description": {
        "value": "formal",
        "boost": 2
      }
    }
  }
}
```
{% include copy-curl.html %}

The query matches documents 1 and 2 because they contain the exact term "formal". Position information is preserved for use in other span queries.

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 2,
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
    "max_score": 1.498922,
    "hits": [
      {
        "_index": "clothing",
        "_id": "2",
        "_score": 1.498922,
        "_source": {
          "description": "Beautiful long dress in red silk, perfect for formal events."
        }
      },
      {
        "_index": "clothing",
        "_id": "1",
        "_score": 1.4466847,
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

The following table lists all top-level parameters supported by `span_term` queries.

| Parameter  | Data type | Description |
|:----------------|:------------|:--------|
| `<field>` | String or object | The name of the field in which to search. |
