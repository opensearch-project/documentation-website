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

## Advanced filter options

You can filter your query results by using some of the optional query fields, such as wildcards, fuzzy query fields, or synonyms. You can also use analyzers as optional query fields. 

### Wildcard options

Option | Valid values | Description
:--- | :--- | :---
`allow_leading_wildcard` | Boolean | Whether `*` and `?` are allowed as the first character of a search term. The default is `true`.
`analyze_wildcard` | Boolean | Whether OpenSearch should attempt to analyze wildcard terms. Some analyzers do a poor job at this task, so the default is false.

### Fuzzy query options

Option | Valid values | Description
:--- | :--- | :---
`fuzziness` | `AUTO`, `0`, or a positive integer | The number of character edits (insert, delete, substitute) that it takes to change one word to another when determining whether a term matched a value. For example, the distance between `wined` and `wind` is 1. The default, `AUTO`, chooses a value based on the length of each term and is a good choice for most use cases.
`fuzzy_transpositions` | Boolean | Setting `fuzzy_transpositions` to true (default) adds swaps of adjacent characters to the insert, delete, and substitute operations of the `fuzziness` option. For example, the distance between `wind` and `wnid` is 1 if `fuzzy_transpositions` is true (swap "n" and "i") and 2 if it is false (delete "n", insert "n"). If `fuzzy_transpositions` is false, `rewind` and `wnid` have the same distance (2) from `wind`, despite the more human-centric opinion that `wnid` is an obvious typo. The default is a good choice for most use cases.
`fuzzy_max_expansions` | Positive integer | Fuzzy queries "expand to" a number of matching terms that are within the distance specified in `fuzziness`. Then OpenSearch tries to match those terms against its indexes.

### Synonyms in a multiple terms search

You can also use synonyms with the `terms` query type to search for multiple terms. Use the `auto_generate_synonyms_phrase_query` Boolean field. By default it is set to `true`. It automatically generates phrase queries for multiple term synonyms. For example, if you have the synonym `"ba, batting average"` and search for "ba," OpenSearch searches for `ba OR "batting average"` when the option is `true` or `ba OR (batting AND average)` when the option is `false`.

To learn more about the multiple terms query type, see [Terms]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/term/#terms). For more reference information about phrase queries, see the [Lucene documentation](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/search/PhraseQuery.html).

### Other advanced options

You can also use the following optional query fields to filter your query results.

Option | Valid values | Description
:--- | :--- | :---
`boost` | Floating-point | Boosts the clause by the given multiplier. Useful for weighing clauses in compound queries. The default is 1.0.
`enable_position_increments` | Boolean | When true, result queries are aware of position increments. This setting is useful when the removal of stop words leaves an unwanted "gap" between terms. The default is true.
`fields` | String array | The list of fields to search (e.g. `"fields": ["title^4", "description"]`). If unspecified, defaults to the `index.query.default_field` setting, which defaults to `["*"]`.
`flags` | String | A `|`-delimited string of [flags](#simple-query-string) to enable (e.g., `AND|OR|NOT`). The default is `ALL`. You can explicitly set the value for `default_field`. For example, to return all titles, set it to `"default_field": "title"`.
`lenient` | Boolean | Setting `lenient` to true lets you ignore data type mismatches between the query and the document field. For example, a query string of "8.2" could match a field of type `float`. The default is false.
`low_freq_operator` | `and, or` | The operator for low-frequency terms. The default is `or`. See also `operator` in this table.
`max_determinized_states` | Positive integer | The maximum number of "[states](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/util/automaton/Operations.html#DEFAULT_MAX_DETERMINIZED_STATES)" (a measure of complexity) that Lucene can create for query strings that contain regular expressions (e.g. `"query": "/wind.+?/"`). Larger numbers allow for queries that use more memory. The default is 10,000.
`max_expansions` | Positive integer |  `max_expansions` specifies the maximum number of terms to which the query can expand. The default is 50.
`minimum_should_match` | Positive or negative integer, positive or negative percentage, combination | If the query string contains multiple search terms and you used the `or` operator, the number of terms that need to match for the document to be considered a match. For example, if `minimum_should_match` is 2, "wind often rising" does not match "The Wind Rises." If `minimum_should_match` is 1, it matches.
`operator` | `or, and` | If the query string contains multiple search terms, whether all terms need to match (`and`) or only one term needs to match (`or`) for a document to be considered a match.
`phrase_slop` | `0` (default) or a positive integer | See `slop`.
`prefix_length` | `0` (default) or a positive integer | The number of leading characters that are not considered in fuzziness.
`quote_field_suffix` | String | This option lets you search different fields depending on whether terms are wrapped in quotes. For example, if `quote_field_suffix` is `".exact"` and you search for `"lightly"` (in quotes) in the `title` field, OpenSearch searches the `title.exact` field. This second field might use a different type (e.g. `keyword` rather than `text`) or a different analyzer. The default is null.
`rewrite` | `constant_score, scoring_boolean, constant_score_boolean, top_terms_N, top_terms_boost_N, top_terms_blended_freqs_N` | Determines how OpenSearch rewrites and scores multi-term queries. The default is `constant_score`.
`slop` | `0` (default) or a positive integer | Controls the degree to which words in a query can be misordered and still be considered a match. From the [Lucene documentation](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/search/PhraseQuery.html#getSlop--): "The number of other words permitted between words in query phrase. For example, to switch the order of two words requires two moves (the first move places the words atop one another), so to permit re-orderings of phrases, the slop must be at least two. A value of zero requires an exact match."
`tie_breaker` | `0.0` (default) to `1.0` | Changes the way OpenSearch scores searches. For example, a `type` of `best_fields` typically uses the highest score from any one field. If you specify a `tie_breaker` value between 0.0 and 1.0, the score changes to highest score + `tie_breaker` * score for all other matching fields. If you specify a value of 1.0, OpenSearch adds together the scores for all matching fields (effectively defeating the purpose of `best_fields`).
`time_zone` | UTC offset hours | Specifies the number of hours to offset the desired time zone from `UTC`. You need to indicate the time zone offset number if the query string contains a date range. For example, set `time_zone": "-08:00"` for a query with a date range such as `"query": "wind rises release_date[2012-01-01 TO 2014-01-01]"`). The default time zone format used to specify number of offset hours is `UTC`.
`type` | `best_fields, most_fields, cross_fields, phrase, phrase_prefix` | Determines how OpenSearch executes the query and scores the results. The default is `best_fields`.
`zero_terms_query` | `none, all` | If the analyzer removes all terms from a query string, whether to match no documents (default) or all documents. For example, the `stop` analyzer removes all terms from the string "an but this."
