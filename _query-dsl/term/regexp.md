---
layout: default
title: Regexp
parent: Term-level queries
nav_order: 100
---

# Regexp query

Use the `regexp` query to search for terms that match a regular expression. For more information about writing regular expressions, see [Regular expression syntax]({{site.url}}{{site.baseurl}}/query-dsl/regex-syntax/).

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
- Regular expressions use the Lucene syntax, which differs from more standardized implementations. Test thoroughly to ensure that you receive the results you expect. To learn more, see [the Lucene documentation](https://lucene.apache.org/core/{{site.lucene_version}}/core/index.html).
- To improve regexp query performance, avoid wildcard patterns without a prefix or suffix, such as `.*` or `.*?+`.
- `regexp` queries can be expensive operations and require the [`search.allow_expensive_queries`]({{site.url}}{{site.baseurl}}/query-dsl/#expensive-queries) setting to be set to `true`. Before making frequent `regexp` queries, test their impact on cluster performance and examine alternative queries that may achieve similar results.
- The [wildcard field type]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/wildcard/) builds an index that is specially designed to be very efficient for wildcard and regular expression queries.

## Matching terms instead of field values

A `regexp` query is not analyzed, but the field it searches might be. When a `text` field is indexed, the standard analyzer splits its value into lowercase terms, and the regular expression must match one of those terms. As a result, a pattern containing uppercase letters or spaces returns no results for a `text` field.

To try this, index a document into an index that uses dynamic mapping. The `title` field is mapped as `text` and has a `title.keyword` subfield:

```json
PUT my-index/_doc/1?refresh=true
{
  "title": "Henry IV"
}
```
{% include copy-curl.html %}

The `title` field contains the terms `henry` and `iv`, so the following query returns no results:

```json
GET my-index/_search
{
  "query": {
    "regexp": {
      "title": "Henry.*"
    }
  }
}
```
{% include copy-curl.html %}

To match the original field value, including its capitalization and spaces, search the `keyword` subfield:

```json
GET my-index/_search
{
  "query": {
    "regexp": {
      "title.keyword": "Henry I.*"
    }
  }
}
```
{% include copy-curl.html %}

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
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1.0,
    "hits": [
      {
        "_index": "my-index",
        "_id": "1",
        "_score": 1.0,
        "_source": {
          "title": "Henry IV"
        }
      }
    ]
  }
}
```
</details>

If a `regexp` query returns no results, also check the following:

- The pattern must match the entire term. For example, `hen` does not match the term `henry`, but `hen.*` does.
- The `^` and `$` anchors are not supported. For example, `^Henry.*` does not match `Henry IV` in a `keyword` field. For more information, see [Unsupported features]({{site.url}}{{site.baseurl}}/query-dsl/regex-syntax/#unsupported-features).
- Matching is case sensitive by default. To match terms regardless of case, set `case_insensitive` to `true`. For example, `henry iv` matches `Henry IV` in the `title.keyword` field when `case_insensitive` is `true`.

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
`boost` | Floating-point | A floating-point value that specifies the weight of this field toward the relevance score. Values above 1.0 increase the field’s relevance. Values between 0.0 and 1.0 decrease the field’s relevance. Default is 1.0.
`case_insensitive` | Boolean | If `true`, allows case-insensitive matching of the regular expression value with the indexed field values. Default is `false` (case sensitivity is determined by the field's mapping).
`flags` | String | Enables optional operators for Lucene's regular expression engine. For valid values, see [Optional operators]({{site.url}}{{site.baseurl}}/query-dsl/regex-syntax/#optional-operators).
`max_determinized_states` | Integer | Lucene converts a regular expression to an automaton with a number of determinized states. This parameter specifies the maximum number of automaton states the query requires. Use this parameter to prevent high resource consumption. To run complex regular expressions, you may need to increase the value of this parameter. Default is 10,000.
`rewrite` | String | Determines how OpenSearch rewrites and scores multi-term queries. Valid values are `constant_score`, `scoring_boolean`, `constant_score_boolean`, `top_terms_N`, `top_terms_boost_N`, and `top_terms_blended_freqs_N`. Default is `constant_score`.

If [`search.allow_expensive_queries`]({{site.url}}{{site.baseurl}}/query-dsl/index/#expensive-queries) is set to `false`, then `regexp` queries are not executed.
{: .important}
