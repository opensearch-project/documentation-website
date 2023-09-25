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

When a document is indexed, the `text` fields are [analyzed]({{site.url}}{{site.baseurl}}/analyzers/index/). Analysis includes tokenizing and lowercasing the text and removing punctuation. Unlike `match` queries, which analyze the query text, `term` queries only match the exact term and thus may not return relevant results. Avoid using `term` queries on `text` fields. For more information, see [Term-level and full-text queries compared]({{site.url}}{{site.baseurl}}/query-dsl/term-vs-full-text/).

You can specify that the query should be case insensitive in the `case_insensitive` parameter:

```json
GET shakespeare/_search
{
  "query": {
    "term": {
      "speaker": {
        "value": "HAMLET",
        "case_insensitive": true
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the matching documents despite any differences in case:

```json
"hits": {
  "total": {
    "value": 1582,
    "relation": "eq"
  },
  "max_score": 2,
  "hits": [
    {
      "_index": "shakespeare",
      "_id": "32700",
      "_score": 2,
      "_source": {
        "type": "line",
        "line_id": 32701,
        "play_name": "Hamlet",
        "speech_number": 9,
        "line_number": "1.2.66",
        "speaker": "HAMLET",
        "text_entry": "[Aside]  A little more than kin, and less than kind."
      }
    },
  ...
}
```

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
`boost` | Floating-point | Boosts the query by the given multiplier. Useful for searches that contain more than one query. Values in the [0, 1) range decrease relevance, and values greater than 1 increase relevance. Default is `1`. 
`case_insensitive` | Boolean | If `true`, allows case-insensitive matching of the value with the indexed field values. Default is `false` (case sensitivity is determined by the field's mapping).