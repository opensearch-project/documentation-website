---
layout: default
title: Regexp
parent: Term-level queries
grand_parent: Query DSL
nav_order: 60
---

# Regexp query

Use the `regexp` query to search for terms that match a regular expression.

The following query searches for any term that starts with any uppercase or lowercase letter followed by `amlet`:

```json
GET shakespeare/_search
{
  "query": {
    "regexp": {
      "play_name": "[a-zA-Z]amlet"
    }
  }
}
```
{% include copy-curl.html %}

Note the following important considerations:

- Regular expressions are applied to the terms (that is, tokens) in the field---not to the entire field.
- By default, the maximum length of a regular expression is 1,000 characters. To change the maximum length, update the `index.max_regex_length` setting.
- Regular expressions use the Lucene syntax, which differs from more standardized implementations. Test thoroughly to ensure that you receive the results you expect. To learn more, see [the Lucene documentation](https://lucene.apache.org/core/8_9_0/core/index.html).
- To improve regexp query performance, avoid wildcard patterns without a prefix or suffix, such as `.*` or `.*?+`.
- `regexp` queries can be expensive operations and require the [`search.allow_expensive_queries`]({{site.url}}{{site.baseurl}}/query-dsl/index/#expensive-queries) setting to be set to `true`. Before making frequent `regexp` queries, test their impact on cluster performance and examine alternative queries that may achieve similar results.

## Parameters

The query accepts the name of the field (`<field>`) as a top-level parameter:

```json
GET _search
{
  "query": {
    "regexp": {
      "<field>": {
        "value": "[Ss]ample",
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
`value` | String | The regular expression used for matching terms in the field specified in `<field>`.
`case_insensitive` | Boolean | If `true`, allows case-insensitive matching of the regular expression value with the indexed field values. Default is `false` (case sensitivity is determined by the field's mapping).
`flags` | String | Enables optional operators for Lucene’s regular expression engine.
`max_determinized_states` | Integer | Lucene converts a regular expression to an automaton with a number of determinized states. This parameter specifies the maximum number of automaton states the query requires. Use this parameter to prevent high resource consumption. To run complex regular expressions, you may need to increase the value of this parameter. Default is 10,000.
`rewrite` | String | Determines how OpenSearch rewrites and scores multi-term queries. Valid values are `constant_score`, `scoring_boolean`, `constant_score_boolean`, `top_terms_N`, `top_terms_boost_N`, and `top_terms_blended_freqs_N`. Default is `constant_score`.

If [`search.allow_expensive_queries`]({{site.url}}{{site.baseurl}}/query-dsl/index/#expensive-queries) is set to `false`, `regexp` queries are not run.
{: .important}

