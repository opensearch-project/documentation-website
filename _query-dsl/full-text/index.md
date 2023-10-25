---
layout: default
title: Full-text queries
has_children: true
nav_order: 30
redirect_from:
  - /opensearch/query-dsl/full-text/
  - /opensearch/query-dsl/full-text/index/
  - /query-dsl/query-dsl/full-text/
  - /query-dsl/full-text/
---

# Full-text queries

This page lists all full-text query types and common options. There are many optional fields that you can use to create subtle search behaviors, so we recommend that you test out some basic query types against representative indexes and verify the output before you perform more advanced or complex searches with multiple options.

OpenSearch uses the Apache Lucene search library, which provides highly efficient data structures and algorithms for ingesting, indexing, searching, and aggregating data.

To learn more about search query classes, see [Lucene query JavaDocs](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/search/Query.html).

The full-text query types shown in this section use the standard analyzer, which analyzes text automatically when the query is submitted.

The following table lists all full-text query types.

Query type | Description
:--- | :--- 
[`intervals`]({{site.url}}{{site.baseurl}}/query-dsl/full-text/intervals/) | Allows fine-grained control of the of matching terms' proximity and order. 
[`match`]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match/) | The default full-text query, which can be used for fuzzy matching and phrase or proximity searches.
[`match_bool_prefix`]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match-bool-prefix/) | Creates a [Boolean query]({{site.url}}{{site.baseurl}}/query-dsl/compound/bool/) that matches all terms in any position, treating the last term as a prefix.
[`match_phrase`]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match-phrase/) | Similar to the `match` query but matches a whole phrase up to a configurable slop.
[`match_phrase_prefix`]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match-phrase-prefix/) | Similar to the `match_phrase` query but matches matches terms as a whole phrase, treating the last term as a prefix.
[`multi_match`]({{site.url}}{{site.baseurl}}/query-dsl/full-text/multi-match/) | Similar to the `match` query but is used on multiple fields.
[`query_string`]({{site.url}}{{site.baseurl}}/query-dsl/full-text/query-string/) | Uses a strict syntax to specify Boolean conditions and multi-field search within a single query string. 
[`simple_query_string`]({{site.url}}{{site.baseurl}}/query-dsl/full-text/simple-query-string/) | A simpler, less strict version of `query_string` query. 

### All parameters

<!-- remove this section when edited. This is so the editing effort is not duplicated. -->

Parameter | Data type | Description
:--- | :--- | :---
`query` | String | The text, number, Boolean value, or date to use for search. Required.
`allow_leading_wildcard` | Boolean | Specifies whether `*` and `?` are allowed as first characters of a search term. Default is `true`.
`analyze_wildcard` | Boolean | Specifies whether OpenSearch should attempt to analyze wildcard terms. Default is `false`.
`analyzer` | String | The [analyzer]({{site.url}}{{site.baseurl}}/analyzers/index/) used to tokenize the query string text. Default is the index-time analyzer specified for the `default_field`. If no analyzer is specified for the `default_field`, the `analyzer` is the default analyzer for the index.
`auto_generate_synonyms_phrase_query` | Boolean | Specifies whether to create a [match phrase query]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match-phrase/) automatically for multi-term synonyms. For example, if you specify `ba, batting average` as synonyms and search for `ba`, OpenSearch searches for `ba OR "batting average"` (if this option is `true`) or `ba OR (batting AND average)` (if this option is `false`). Default is `true`.
`boost` | Floating-point | Boosts the clause by the given multiplier. Useful for weighing clauses in compound queries. Values in the [0, 1) range decrease relevance, and values greater than 1 increase relevance. Default is `1`. 
`default_field` | String | The field in which to search if the field is not specified in the query string. Supports wildcards. Defaults to the value specified in the `index.query.default_field` index setting. By default, the `index.query.default_field` is `*`, which means extract all fields eligible for term query and filter the metadata fields. The extracted fields are combined into a query if the `prefix` is not specified. Eligible fields do not include nested documents. Searching all eligible fields could be a resource-intensive operation. The `indices.query.bool.max_clause_count` search setting defines the maximum value for the product of the number of fields and the number of terms that can be queried at one time. The default value for `indices.query.bool.max_clause_count` is 4,096.
`default_operator`| String | If the query string contains multiple search terms, whether all terms need to match (`AND`) or only one term needs to match (`OR`) for a document to be considered a match. Valid values are:<br>- `OR`: The string `to be` is interpreted as `to OR be`<br>- `AND`: The string `to be` is interpreted as `to AND be`<br> Default is `OR`.
`enable_position_increments` | Boolean | When `true`, resulting queries are aware of position increments. This setting is useful when the removal of stop words leaves an unwanted "gap" between terms. Default is `true`.
`fields` | String array | The list of fields to search (for example, `"fields": ["title^4", "description"]`). Supports wildcards. If unspecified, defaults to the `index.query.default_field` setting, which defaults to `["*"]`.
`flags` | String | A `|`-delimited string of [flags]({{site.baseurl}}/query-dsl/full-text/simple-query-string/) to enable (e.g., `AND|OR|NOT`). Default is `ALL`. You can explicitly set the value for `default_field`. For example, to return all titles, set it to `"default_field": "title"`.
`fuzziness` | `AUTO`, `0`, or a positive integer | The number of character edits (insert, delete, substitute) that it takes to change one word to another when determining whether a term matched a value. For example, the distance between `wined` and `wind` is 1. The default, `AUTO`, chooses a value based on the length of each term and is a good choice for most use cases.
`fuzzy_rewrite` | String | Determines how OpenSearch rewrites the query. Valid values are `constant_score`, `scoring_boolean`, `constant_score_boolean`, `top_terms_N`, `top_terms_boost_N`, `top_terms_blended_freqs_N`. If the `fuzziness` parameter is not `0`, the query uses a `fuzzy_rewrite` method of `top_terms_blended_freqs_${max_expansions}` by default. Default is `constant_score`. 
`fuzzy_transpositions` | Boolean | Setting `fuzzy_transpositions` to `true` (default) adds swaps of adjacent characters to the insert, delete, and substitute operations of the `fuzziness` option. For example, the distance between `wind` and `wnid` is 1 if `fuzzy_transpositions` is true (swap "n" and "i") and 2 if it is false (delete "n", insert "n"). If `fuzzy_transpositions` is false, `rewind` and `wnid` have the same distance (2) from `wind`, despite the more human-centric opinion that `wnid` is an obvious typo. The default is a good choice for most use cases.
`fuzzy_max_expansions` | Positive integer | The maximum number of terms to which the query can expand. Fuzzy queries “expand to” a number of matching terms that are within the distance specified in `fuzziness`. Then OpenSearch tries to match those terms. Default is `50`.
`lenient` | Boolean | Setting `lenient` to `true` lets you ignore data type mismatches between the query and the document field. For example, a query string of `"8.2"` could match a field of type `float`. Default is `false`.
`low_freq_operator` | `and, or` | The operator for low-frequency terms. Default is `or`. See also `operator` in this table.
`max_determinized_states` | Positive integer | The maximum number of "[states](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/util/automaton/Operations.html#DEFAULT_MAX_DETERMINIZED_STATES)" (a measure of complexity) that Lucene can create for query strings that contain regular expressions (e.g. `"query": "/wind.+?/"`). Larger numbers allow for queries that use more memory. Default is `10,000`.
`max_expansions` | Positive integer |  The maximum number of terms to which the query can expand. Fuzzy queries “expand to” a number of matching terms that are within the distance specified in `fuzziness`. Then OpenSearch tries to match those terms. Default is `50`.
`minimum_should_match` | Positive or negative integer, positive or negative percentage, combination | If the query string contains multiple search terms and you use the `or` operator, the number of terms that need to match for the document to be considered a match. For example, if `minimum_should_match` is 2, `wind often rising` does not match `The Wind Rises.` If `minimum_should_match` is `1`, it matches. For details, see [Minimum should match]({{site.url}}{{site.baseurl}}/query-dsl/minimum-should-match/).
`operator` | String | If the query string contains multiple search terms, whether all terms need to match (`and`) or only one term needs to match (`or`) for a document to be considered a match. Valid values are `or`, `and`. Default is `or`.
`phrase_slop` | Integer | The maximum number of words that are allowed between the matched words. If `phrase_slop` is 2, a maximum of two words is allowed between matched words in a phrase. Transposed words have a slop of 2. Default is `0` (an exact phrase match where matched words must be next to each other).
`prefix_length` | Non-negative integer | The number of leading characters that are not considered in fuzziness. Default is `0`.
`quote_analyzer` | String | The analyzer used to tokenize quoted text in the query string. Overrides the `analyzer` parameter for quoted text. Default is the `search_quote_analyzer` specified for the `default_field`. 
`quote_field_suffix` | String | This option lets you search for exact matches (surrounded with quotation marks) using a different analysis method than non-exact matches use. For example, if `quote_field_suffix` is `.exact` and you search for `\"lightly\"` in the `title` field, OpenSearch searches for the word `lightly` in the `title.exact` field. This second field might use a different type (for example, `keyword` rather than `text`) or a different analyzer. 
`rewrite` | String | Determines how OpenSearch rewrites and scores multi-term queries. Valid values are `constant_score`, `scoring_boolean`, `constant_score_boolean`, `top_terms_N`, `top_terms_boost_N`, and `top_terms_blended_freqs_N`. Default is `constant_score`.
`slop` | `0` (default) or a positive integer | Controls the degree to which words in a query can be misordered and still be considered a match. From the [Lucene documentation](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/search/PhraseQuery.html#getSlop--): "The number of other words permitted between words in query phrase. For example, to switch the order of two words requires two moves (the first move places the words atop one another), so to permit re-orderings of phrases, the slop must be at least two. A value of zero requires an exact match."
`tie_breaker` | `0.0` (default) to `1.0` | Changes the way OpenSearch scores searches. For example, a `type` of `best_fields` typically uses the highest score from any one field. If you specify a `tie_breaker` value between 0.0 and 1.0, the score changes to highest score + `tie_breaker` * score for all other matching fields. If you specify a value of 1.0, OpenSearch adds together the scores for all matching fields (effectively defeating the purpose of `best_fields`).
`time_zone` | String | Specifies the number of hours to offset the desired time zone from `UTC`. You need to indicate the time zone offset number if the query string contains a date range. For example, set `time_zone": "-08:00"` for a query with a date range such as `"query": "wind rises release_date[2012-01-01 TO 2014-01-01]"`). The default time zone format used to specify number of offset hours is `UTC`.
`type` | String | Determines how OpenSearch executes the query and scores the results. Valid values are `best_fields`, `most_fields`, `cross_fields`, `phrase`, and `phrase_prefix`. Default is `best_fields`.
`zero_terms_query` | String | In some cases, the analyzer removes all terms from a query string. For example, the `stop` analyzer removes all terms from the string `an but this`. In those cases, `zero_terms_query` specifies whether to match no documents (`none`) or all documents (`all`). Valid values are `none`, `all`. Default is `none`.
