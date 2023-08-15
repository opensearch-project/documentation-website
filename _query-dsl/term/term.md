---
layout: default
title: Term
parent: Term-level queries
grand_parent: Query DSL
nav_order: 70
---

# Term query

Use the `term` query to search for an exact term in a field. For example, the following query searches for a line with an exact line number:

```json
GET shakespeare/_search
{
  "query": {
    "term": {
      "line_id": {
        "value": "61809"
      }
    }
  }
}
```
{% include copy-curl.html %}

When a document is indexed, the `text` fields are [analyzed]({{site.url}}{{site.baseurl}}/analyzers/index/). Analysis includes tokenizing and lowercasing the text and removing punctuation. Unlike `match` queries, which analyze the query text, `term` queries only match the exact term and thus may not return relevant results. Avoid using `term` queries on `text` fields. For details, see the [comparison of `term` and `match` queries]({{site.url}}{{site.baseurl}}/query-dsl/term-vs-full-text/).

## Parameters

The query accepts the name of the field (`<field>`) as a top-level parameter:

```json
GET _search
{
  "query": {
    "term": {
      "<field>": {
        "value": "sample",
        ... 
      }
    }
  }
}
```
{% include copy-curl.html %}

The `<field>` accepts the following parameters. All parameters except `value` are optional.

Parameter | Data type | Description
:--- | :--- | :---
`value` | String | The term to search for in the field specified in `<field>`. A document is returned in the results only if its field value exactly matches the term, with the correct spacing and capitalization.
`boost` | Floating-point | Boosts the query by the given multiplier. Useful for searches that contain more than one query. Values less than 1 decrease relevance, and values greater than 1 increase relevance. Default is `1`. 
`case_insensitive` | Boolean | If `true`, allows case-insensitive matching of the value with the indexed field values. Default is `false` (case sensitivity is determined by the field's mapping).