---
layout: default
title: Prefix
parent: Term-level queries
grand_parent: Query DSL
nav_order: 40
---

# Prefix query

Use the `prefix` query to search for terms that begin with a specific prefix. For example, the following query searches for documents in which the `speaker` field contains a term that starts with `KING H`:

```json
GET shakespeare/_search
{
  "query": {
    "prefix": {
      "speaker": "KING H"
    }
  }
}
```
{% include copy-curl.html %}

To provide parameters, you can use a query equivalent to the preceding one with the following extended syntax:

```json
GET shakespeare/_search
{
  "query": {
    "prefix": {
      "speaker": {
        "value": "KING H"
      }
    }
  }
}
```
{% include copy-curl.html %}


## Parameters

The query accepts the name of the field (`<field>`) as a top-level parameter:

```json
GET _search
{
  "query": {
    "prefix": {
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
`value` | String | The term to search for in the field specified in `<field>`.
`case_insensitive` | Boolean | If `true`, allows case-insensitive matching of the value with the indexed field values. Default is `false` (case sensitivity is determined by the field's mapping).
`rewrite` | String | Determines how OpenSearch rewrites and scores multi-term queries. Valid values are `constant_score`, `scoring_boolean`, `constant_score_boolean`, `top_terms_N`, `top_terms_boost_N`, and `top_terms_blended_freqs_N`. Default is `constant_score`.

If [`search.allow_expensive_queries`]({{site.url}}{{site.baseurl}}/query-dsl/index/#expensive-queries) is set to `false`, prefix queries are not run. If `index_prefixes` is enabled, the `search.allow_expensive_queries` setting is ignored and an optimized query is built and run.
{: .important}