---
layout: default
title: Simple query string
parent: Full-text queries
grand_parent: Query DSL
nav_order: 70
---

# Simple query string query

Use the `simple_query_string` type to specify multiple arguments delineated by regular expressions directly in the query string. Simple query string has a less strict syntax than query string because it discards any invalid portions of the string and does not return errors for invalid syntax.

This query uses a [simple syntax](#simple-query-string-syntax) to parse the query string based on special operators and split the string into terms. After parsing, the query analyzes each term independently and then returns matching documents.

The following query performs fuzzy search on the `title` field:

```json
GET _search
{
  "query": {
    "simple_query_string": {
      "query": "\"rises wind the\"~4 | *ising~2",
      "fields": ["title"]
    }
  }
}
```
{% include copy-curl.html %}

## Simple query string syntax

Special character | Behavior
:--- | :---
`+` | Acts as the `and` operator.
`|` | Acts as the `or` operator.
`*` | Acts as a wildcard.
`""` | Wraps several terms into a phrase.
`()` | Wraps a clause for precedence.
`~n` | When used after a term (for example, `wnid~3`), sets `fuzziness`. When used after a phrase, sets `slop`. 
`-` | Negates the term.



```json
GET _search
{
  "query": {
    "simple_query_string": {
      "query": "\"rises wind the\"~4 | *ising~2",
      "fields": ["title"],
      "default_operator": "or",
      "analyze_wildcard": false,
      "analyzer": "standard",
      "auto_generate_synonyms_phrase_query": true,
      "flags": "ALL",
      "fuzzy_transpositions": true,
      "fuzzy_max_expansions": 50,
      "fuzzy_prefix_length": 0,
      "lenient": false,
      "minimum_should_match": 1,    
      "quote_field_suffix": "",
    }
  }
}
```

## Parameters

The following table lists the top-level parameters that `simple_query_string` query supports. All parameters except `query` are optional.

Parameter | Data type | Description
:--- | :--- | :---
`query`| String | The text that may contain expressions in the [simple query string syntax](#simple-query-string-syntax) to use for search. Required.
`analyze_wildcard` | Boolean | Specifies whether OpenSearch should attempt to analyze wildcard terms. Default is `false`.
`analyzer` | String | The analyzer used to tokenize the query string text. Default is the index-time analyzer specified for the `default_field`. If no analyzer is specified for the `default_field`, the `analyzer` is the default analyzer for the index.
`auto_generate_synonyms_phrase_query` | Boolean | Specifies whether to create [match_phrase queries]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match/) automatically for multi-term synonyms. Default is `true`.
`default_operator`| String | If the query string contains multiple search terms, whether all terms need to match (`AND`) or only one term needs to match (`OR`) for a document to be considered a match. Valid values are:<br>- `OR`: The string `to be` is interpreted as `to OR be`<br>- `AND`: The string `to be` is interpreted as `to AND be`<br> Default is `OR`.
`fields` | String array | The list of fields to search (for example, `"fields": ["title^4", "description"]`). Supports wildcards. If unspecified, defaults to the `index.query.default_field` setting, which defaults to `["*"]`. The maximum number of fields that can be searched at the same time is defined by `indices.query.bool.max_clause_count`, which is 1,024 by default.
`flags` | String | A `|`-delimited string of [flags]({{site.baseurl}}/query-dsl/full-text/simple-query-string/) to enable (e.g., `AND|OR|NOT`). Default is `ALL`. You can explicitly set the value for `default_field`. For example, to return all titles, set it to `"default_field": "title"`.
`fuzzy_max_expansions` | Positive integer | The maximum number of terms to which the query can expand. Fuzzy queries “expand to” a number of matching terms that are within the distance specified in `fuzziness`. Then OpenSearch tries to match those terms. Default is `50`.
`fuzzy_transpositions` is false, `rewind` and `wnid` have the same distance (2) from `wind`, despite the more human-centric opinion that `wnid` is an obvious typo. The default is a good choice for most use cases.
`fuzzy_prefix_length`| 
`lenient` | Boolean | Setting `lenient` to `true` lets you ignore data type mismatches between the query and the document field. For example, a query string of `"8.2"` could match a field of type `float`. Default is `false`.
`minimum_should_match` | Positive or negative integer, positive or negative percentage, combination | If the query string contains multiple search terms and you use the `or` operator, the number of terms that need to match for the document to be considered a match. For example, if `minimum_should_match` is 2, `wind often rising` does not match `The Wind Rises.` If `minimum_should_match` is `1`, it matches. For details, see [Minimum should match]({{site.url}}{{site.baseurl}}/query-dsl/minimum-should-match/).
`quote_field_suffix` | String | This option lets you search for exact matches (surrounded with quotation marks) using a different analysis method than non-exact matches use. For example, if `quote_field_suffix` is `.exact` and you search for `\"lightly\"` in the `title` field, OpenSearch searches for the word `lightly` in the `title.exact` field. This second field might use a different type (for example, `keyword` rather than `text`) or a different analyzer.