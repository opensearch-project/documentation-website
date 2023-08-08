---
layout: default
title: Query string queries
parent: Full-text queries
grand_parent: Query DSL
nav_order: 25

redirect_from:
  - /opensearch/query-dsl/full-text/query-string/
  - /query-dsl/query-dsl/full-text/query-string/
---

# Query string queries

A `query_string` query parses the query string based on the `query_string` syntax. It lets you create powerful yet concise queries that can incorporate wildcards and search multiple fields.

## Example

The following query searches for the speaker `KING` in the play name that ends with `well`:

```json
GET shakespeare/_search
{
 "query": {
    "query_string": {
      "query": "speaker:KING  AND play_name: *well"
    }
  }
}
```

## Parameters

The following table lists the parameters that `query_string` query supports. All parameters except `query` are optional.

Parameter | Data type | Description
:--- | :--- | :---
`query` | String | The query string to use for search. Required.
`fields` | String array | The list of fields to search (for example, `"fields": ["title^4", "description"]`). Supports wildcards.
`default_field` | String | The field in which to search if the field is not specified in the query string. Supports wildcards. Defaults to the value specified in the `index.query.default_field` index setting. By default, the `index.query.default_field` is `*`, which means extract all fields eligible for term query and filter the metadata fields. The extracted fields are combined into a query if the `prefix` is not specified. Eligible fields do not include nested documents. Searching all eligible fields could be a resource-intensive operation. The `indices.query.bool.max_clause_count` search setting defines the maximum value for the product of the number of fields and the number of terms that can be queried at one time. The default value for `indices.query.bool.max_clause_count` is 4,096.
`allow_leading_wildcard` | Boolean | Specifies whether `*` and `?` are allowed as first characters of a search term. Default is `true`.
`analyze_wildcard` | Boolean | Specifies whether OpenSearch should attempt to analyze wildcard terms. Default is `false`.
`analyzer` | String | The analyzer used to tokenize the query string text. Default is the index-time analyzer specified for the `default_field`. If no analyzer is specified for the `default_field`, the `analyzer` is the default analyzer for the index.
`quote_analyzer` | String | The analyzer used to tokenize quoted text in the query string. Overrides the `analyzer` parameter for quoted text. Default is the `search_quote_analyzer` specified for the `default_field`. 
`quote_field_suffix` | String | This option lets you search for exact matches (surrounded with quotation marks) using a different analysis method than non-exact matches use. For example, if `quote_field_suffix` is `.exact` and you search for `\"lightly\"` in the `title` field, OpenSearch searches for the word `lightly` in the `title.exact` field. This second field might use a different type (for example, `keyword` rather than `text`) or a different analyzer. 
`phrase_slop` | Integer | The maximum number of words that are allowed between the matched words. If `phrase_slop` is 2, a maximum of two words is allowed between matched words in a phrase. Transposed words have a slop of 2. Default is 0 (an exact phrase match where matched words must be next to each other).
`minimum_should_match` | Positive or negative integer, positive or negative percentage, combination | If the query string contains multiple search terms and you used the `or` operator, the number of terms that need to match for the document to be considered a match. For example, if `minimum_should_match` is 2, "wind often rising" does not match "The Wind Rises." If `minimum_should_match` is 1, it matches.
`rewrite` | String | Determines how OpenSearch rewrites and scores multi-term queries. Valid values are `constant_score`, `scoring_boolean`, `constant_score_boolean`, `top_terms_N`, `top_terms_boost_N`, and `top_terms_blended_freqs_N`. Default is `constant_score`.
`auto_generate_synonyms_phrase_query` | Boolean | Specifies whether to create [match queries]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/full-text/index#match) automatically for multi-term synonyms. Default is `true`.
`boost` | Floating-point | Boosts the clause by the given multiplier. Values less than 1.0 decrease relevance, and values greater than 1.0 increase relevance. Default is 1.0. 
`default_operator`| String | The default Boolean operator used if no operators are specified. Valid values are:<br>- `OR`: The string `to be` is interpreted as `to OR be`<br>- `AND`: The string `to be` is interpreted as `to AND be`<br> Default is `OR`.
`enable_position_increments` | Boolean | When true, resulting queries are aware of position increments. This setting is useful when the removal of stop words leaves an unwanted "gap" between terms. Default is `true`.
`fuzziness` | String | The number of character edits (insert, delete, substitute) that it takes to change one word to another when determining whether a term matched a value. For example, the distance between `wined` and `wind` is 1. Valid values are non-negative integers or `AUTO`. The default, `AUTO`, chooses a value based on the length of each term and is a good choice for most use cases.
`fuzzy_transpositions` | Boolean | Setting `fuzzy_transpositions` to `true` (default) adds swaps of adjacent characters to the insert, delete, and substitute operations of the `fuzziness` option. For example, the distance between `wind` and `wnid` is 1 if `fuzzy_transpositions` is true (swap "n" and "i") and 2 if it is false (delete "n", insert "n"). If `fuzzy_transpositions` is false, `rewind` and `wnid` have the same distance (2) from `wind`, despite the more human-centric opinion that `wnid` is an obvious typo. The default is a good choice for most use cases.
`fuzzy_max_expansions` | Positive integer | The maximum number of terms the fuzzy query will match. Default is 50.
`lenient` | Boolean | Setting `lenient` to true lets you ignore data type mismatches between the query and the document field. For example, a query string of "8.2" could match a field of type `float`. Default is `false`.
`max_determinized_states` | Positive integer | The maximum number of "[states](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/util/automaton/Operations.html#DEFAULT_MAX_DETERMINIZED_STATES)" (a measure of complexity) that Lucene can create for query strings that contain regular expressions (for example, `"query": "/wind.+?/"`). Larger numbers allow for queries that use more memory. Default is 10,000.
`time_zone` | String | Specifies the number of hours to offset the desired time zone from `UTC`. You need to indicate the time zone offset number if the query string contains a date range. For example, set `time_zone": "-08:00"` for a query with a date range such as `"query": "wind rises release_date[2012-01-01 TO 2014-01-01]"`). The default time zone format used to specify number of offset hours is `UTC`.