---
layout: default
title: Query string
parent: Full-text queries
grand_parent: Query DSL
nav_order: 60

redirect_from:
  - /opensearch/query-dsl/full-text/query-string/
  - /query-dsl/query-dsl/full-text/query-string/
---

# Query string query

A `query_string` query parses the query string based on the [`query_string` syntax](#syntax). It lets you create powerful yet concise queries that can incorporate wildcards and search multiple fields.

The query string query splits text based on operators and analyzes each individually.

If you search using the HTTP request parameters (i.e. `_search?q=wind`), OpenSearch creates a query string query.
{: .note }

```json
GET _search
{
  "query": {
    "query_string": {
      "query": "the wind AND (rises OR rising)"
    }
  }
}
```
{% include copy-curl.html %}

## Syntax

A query string consists of _terms_ and _operators_. A term is a single word (for example, in the query `wind rises`, the terms are `wind` and `rises`). If several terms are surrounded by quotation marks, they are treated as one phrase where words are marched in the order they appear (for example, `"wind rises"`).

The examples in this section use an index containing the following mapping and documents:

```json
PUT /testindex
{
  "mappings": {
    "properties": {
      "title": { 
        "type": "text",
        "fields": {
          "english": { 
            "type": "text",
            "analyzer": "english"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

```json
PUT /testindex/_doc/1
{
  "title": "The wind rises"
}
```
{% include copy-curl.html %}

```json
PUT /testindex/_doc/2
{
  "title": "Gone with the wind",
  "description": "A 1939 American epic historical film"
}
```
{% include copy-curl.html %}

```json
PUT /testindex/_doc/3
{
  "title": "Windy city"
}
```
{% include copy-curl.html %}

```json
PUT /testindex/_doc/4
{
  "article title": "Wind turbines"
}
```
{% include copy-curl.html %}

### Field names

Specify the field name before the colon. The following table contains example queries with field names.

Query | Criterion for a document to match | Matching documents from the `testindex` index
:--- | :--- | :---
`title: wind` | The `title` field contains the word `wind`. | 1, 2
`title: (wind OR windy)` | The `title` field contains the word `wind` or the word `windy`. | 1, 2, 3
`title: \"wind rises\"` | The `title` field contains the phrase `wind rises`. Escape quotation marks with a backslash. | 1
`article\\ title: wind` | The `article title` field contains the word `wind`. Escape the space character with a backslash. | 4
`title.\\*: rise` | Every field that begins with `title.` (in this example, `title.english`) contains the word `rise`. Escape the wildcard character with a backslash. | 1
`_exists_: description` | The field `description` exists. | 2

### Wildcard expressions

You can specify wildcard expressions using special characters: `?` replaces a single character and `*` replaces zero or more characters.

#### Example

The following query searches for the speaker `KING` in the play name that ends with `well`:

```json
GET shakespeare/_search
{
 "query": {
    "query_string": {
      "query": "speaker: KING AND play_name: *well"
    }
  }
}
```
{% include copy-curl.html %}

Wildcard queries can use a significant amount of memory, which can degrade performance. Wildcards at the beginning of a word (for example, `*well`) are the most expensive because matching documents on such wildcards requires examining all terms in the index. To disable leading wildcards,set `allow_leading_wildcard` to `false`.
{: .warning}

For efficiency, pure wildcards such as `\*` are rewritten as `exists` queries. Therefore, the `play: *` wildcard will match documents containing an empty value in the `play` field but will not match documents in which the `play` field is either missing or has a `null` value.

If you set `analyze_wildcard` to `true`, OpenSearch will analyze queries that end with a * (such as `*well`) and will build a Boolean query comprised of the resulting tokens by taking the exact matches on the first N-1 tokens, and prefix matching the last token.

## Regular expressions

To specify regular expression patterns in a query string, surround them with forward slashes (`/`), for example `speaker: /K[A-Z]NG/`.

The `allow_leading_wildcard` parameter does not apply to regular expressions. For example, a query string such as  `/.*G/` will examine all terms in the index. 
{: .important}

## Fuzziness

You can run fuzzy queries using the `~` operator, for example `title: rise~`.

The query searches for documents containing terms that are similar to the search term within the maximum allowed edit distance. The edit distance is defined as the [Damerau-Levenshtein distance](https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance), which measures the number of one-character changes (insertions, deletions, substitutions, or transpositions) needed to change one term to another term.

The default edit distance of 2 should catch 80% of misspellings. To change the default edit distance, specify the new edit distance after the `~` operator. For example, to set the edit distance to `1`, use the query `title: rise~1`.

Do not mix fuzzy and wildcard operators. If you specify both fuzzy and wildcard operators, one of the operators will not be applied. For example, if you can search for `wnid*~1`, the wildcard operator `*` will be applied but the fuzzy operator `~1` will not be applied.
{: .important}

## Parameters

The following table lists the parameters that `query_string` query supports. All parameters except `query` are optional.

Parameter | Data type | Description
:--- | :--- | :---
`query` | String | The text, number, Boolean value, or date to use for search. Required.
`allow_leading_wildcard` | Boolean | Specifies whether `*` and `?` are allowed as first characters of a search term. Default is `true`.
`analyze_wildcard` | Boolean | Specifies whether OpenSearch should attempt to analyze wildcard terms. Default is `false`.
`analyzer` | String | The analyzer used to tokenize the query string text. Default is the index-time analyzer specified for the `default_field`. If no analyzer is specified for the `default_field`, the `analyzer` is the default analyzer for the index.
`boost` | Floating-point | Boosts the clause by the given multiplier. Useful for weighing clauses in compound queries. Values in the [0, 1) range decrease relevance, and values greater than 1 increase relevance. Default is `1`.
`default_field` | String | The field in which to search if the field is not specified in the query string. Supports wildcards. Defaults to the value specified in the `index.query.default_field` index setting. By default, the `index.query.default_field` is `*`, which means extract all fields eligible for term query and filter the metadata fields. The extracted fields are combined into a query if the `prefix` is not specified. Eligible fields do not include nested documents. Searching all eligible fields could be a resource-intensive operation. The `indices.query.bool.max_clause_count` search setting defines the maximum value for the product of the number of fields and the number of terms that can be queried at one time. The default value for `indices.query.bool.max_clause_count` is 4,096.
`default_operator`| String | If the query string contains multiple search terms, whether all terms need to match (`AND`) or only one term needs to match (`OR`) for a document to be considered a match. Valid values are:<br>- `OR`: The string `to be` is interpreted as `to OR be`<br>- `AND`: The string `to be` is interpreted as `to AND be`<br> Default is `OR`.
`enable_position_increments` | Boolean | When `true`, resulting queries are aware of position increments. This setting is useful when the removal of stop words leaves an unwanted "gap" between terms. Default is `true`.
`fields` | String array | The list of fields to search (for example, `"fields": ["title^4", "description"]`). Supports wildcards. If unspecified, defaults to the `index.query.default_field` setting, which defaults to `["*"]`.
`fuzziness` | String | The number of character edits (insert, delete, substitute) that it takes to change one word to another when determining whether a term matched a value. For example, the distance between `wined` and `wind` is 1. Valid values are non-negative integers or `AUTO`. The default, `AUTO`, chooses a value based on the length of each term and is a good choice for most use cases.
`fuzzy_max_expansions` | Positive integer | The maximum number of terms the fuzzy query will match. Default is `50`.
`fuzzy_transpositions` | Boolean | Setting `fuzzy_transpositions` to `true` (default) adds swaps of adjacent characters to the insert, delete, and substitute operations of the `fuzziness` option. For example, the distance between `wind` and `wnid` is 1 if `fuzzy_transpositions` is true (swap "n" and "i") and 2 if it is false (delete "n", insert "n"). If `fuzzy_transpositions` is false, `rewind` and `wnid` have the same distance (2) from `wind`, despite the more human-centric opinion that `wnid` is an obvious typo. The default is a good choice for most use cases.
`lenient` | Boolean | Setting `lenient` to `true` lets you ignore data type mismatches between the query and the document field. For example, a query string of `"8.2"` could match a field of type `float`. Default is `false`.
`max_determinized_states` | Positive integer | The maximum number of "[states](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/util/automaton/Operations.html#DEFAULT_MAX_DETERMINIZED_STATES)" (a measure of complexity) that Lucene can create for query strings that contain regular expressions (e.g. `"query": "/wind.+?/"`). Larger numbers allow for queries that use more memory. Default is `10,000`.
`minimum_should_match` | Positive or negative integer, positive or negative percentage, combination | If the query string contains multiple search terms and you use the `or` operator, the number of terms that need to match for the document to be considered a match. For example, if `minimum_should_match` is 2, `wind often rising` does not match `The Wind Rises.` If `minimum_should_match` is `1`, it matches. For details, see [Minimum should match]({{site.url}}{{site.baseurl}}/query-dsl/minimum-should-match/).
`phrase_slop` | Integer | The maximum number of words that are allowed between the matched words. If `phrase_slop` is 2, a maximum of two words is allowed between matched words in a phrase. Transposed words have a slop of 2. Default is 0 (an exact phrase match where matched words must be next to each other).
`quote_analyzer` | String | The analyzer used to tokenize quoted text in the query string. Overrides the `analyzer` parameter for quoted text. Default is the `search_quote_analyzer` specified for the `default_field`. 
`quote_field_suffix` | String | This option lets you search for exact matches (surrounded with quotation marks) using a different analysis method than non-exact matches use. For example, if `quote_field_suffix` is `.exact` and you search for `\"lightly\"` in the `title` field, OpenSearch searches for the word `lightly` in the `title.exact` field. This second field might use a different type (for example, `keyword` rather than `text`) or a different analyzer. 
`rewrite` | String | Determines how OpenSearch rewrites and scores multi-term queries. Valid values are `constant_score`, `scoring_boolean`, `constant_score_boolean`, `top_terms_N`, `top_terms_boost_N`, and `top_terms_blended_freqs_N`. Default is `constant_score`.
`auto_generate_synonyms_phrase_query` | Boolean | Specifies whether to create [match queries]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match/) automatically for multi-term synonyms. Default is `true`.
`time_zone` | String | Specifies the number of hours to offset the desired time zone from `UTC`. You need to indicate the time zone offset number if the query string contains a date range. For example, set `time_zone": "-08:00"` for a query with a date range such as `"query": "wind rises release_date[2012-01-01 TO 2014-01-01]"`). The default time zone format used to specify number of offset hours is `UTC`.