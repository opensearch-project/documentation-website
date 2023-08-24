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

<!-- to do: rewrite query type definitions per issue: https://github.com/opensearch-project/documentation-website/issues/1116
-->
---

#### Table of contents

1. TOC
{:toc}

---

Common terms queries and the optional query field `cutoff_frequency` are now deprecated.
{: .note }

## Query types

OpenSearch Query DSL provides multiple query types that you can use in your searches.

### Match

Use the `match` query for full-text search of a specific document field. The `match` query analyzes the provided search string and returns documents that match any of the string's terms.

You can use Boolean query operators to combine searches.

<!-- we don't need to include Lucene query definitions >
Creates a [boolean query](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/search/BooleanQuery.html) that returns results if the search term is present in the field.
-->

The following example shows a basic `match` search for the `title` field set to the value `wind`:

```json
GET _search
{
  "query": {
    "match": {
      "title": "wind"
    }
  }
}
```

For an example that uses [curl](https://curl.haxx.se/), try:

```bash
curl --insecure -XGET -u 'admin:admin' https://<host>:<port>/<index>/_search \
  -H "content-type: application/json" \
  -d '{
    "query": {
      "match": {
        "title": "wind"
      }
    }
  }'
```

The query accepts the following options. For descriptions of each, see [Advanced filter options](#advanced-filter-options).

```json
GET _search
{
  "query": {
    "match": {
      "title": {
        "query": "wind",
        "fuzziness": "AUTO",
        "fuzzy_transpositions": true,
        "operator":  "or",
        "minimum_should_match": 1,
        "analyzer": "standard",
        "zero_terms_query": "none",
        "lenient": false,
        "prefix_length": 0,
        "max_expansions": 50,
        "boost": 1
      }
    }
  }
}
```

### Multi-match

You can use the `multi_match` query type to search multiple fields. Multi-match operation functions similarly to the [match](#match) operation.

The `^` lets you "boost" certain fields. Boosts are multipliers that weigh matches in one field more heavily than matches in other fields. In the following example, a match for "wind" in the title field influences `_score` four times as much as a match in the plot field. The result is that films like *The Wind Rises* and *Gone with the Wind* are near the top of the search results, and films like *Twister* and *Sharknado*, which presumably have "wind" in their plot summaries, are near the bottom.

```json
GET _search
{
  "query": {
    "multi_match": {
      "query": "wind",
      "fields": ["title^4", "plot"]
    }
  }
}
```

The query accepts the following options. For descriptions of each, see [Advanced filter options](#advanced-filter-options).

```json
GET _search
{
  "query": {
    "multi_match": {
      "query": "wind",
      "fields": ["title^4", "description"],
      "type": "most_fields",
      "operator": "and",
      "minimum_should_match": 3,
      "tie_breaker": 0.0,
      "analyzer": "standard",
      "boost": 1,
      "fuzziness": "AUTO",
      "fuzzy_transpositions": true,
      "lenient": false,
      "prefix_length": 0,
      "max_expansions": 50,
      "auto_generate_synonyms_phrase_query": true,
      "zero_terms_query": "none"
    }
  }
}
```

### Match Boolean prefix

The `match_bool_prefix` query analyzes the provided search string and creates a `bool` query from the string's terms. It uses every term except the last term as a whole word for matching. The last term is used as a prefix. The `match_bool_prefix` query returns documents that contain either the whole-word terms or terms that start with the prefix term, in any order.

```json
GET _search
{
  "query": {
    "match_bool_prefix": {
      "title": "rises wi"
    }
  }
}
```

The query accepts the following options. For descriptions of each, see [Advanced filter options](#advanced-filter-options).

```json
GET _search
{
  "query": {
    "match_bool_prefix": {
      "title": {
        "query": "rises wi",
        "fuzziness": "AUTO",
        "fuzzy_transpositions": true,
        "max_expansions": 50,
        "prefix_length": 0,
        "operator":  "or",
        "minimum_should_match": 2,
        "analyzer": "standard"
      }
    }
  }
}
```

For more reference information about prefix queries, see the [Lucene documentation](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/search/PrefixQuery.html).

### Match phrase

Use the `match_phrase` query to match documents that contain an exact phrase in a specified order. You can add flexibility to phrase matching by providing the `slop` parameter.

Creates a [phrase query](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/search/PhraseQuery.html) that matches a sequence of terms.

```json
GET _search
{
  "query": {
    "match_phrase": {
      "title": "the wind rises"
    }
  }
}
```

The query accepts the following options. For descriptions of each, see [Advanced filter options](#advanced-filter-options).

```json
GET _search
{
  "query": {
    "match_phrase": {
      "title": {
        "query": "wind rises the",
        "slop": 3,
        "analyzer": "standard",
        "zero_terms_query": "none"
      }
    }
  }
}
```

### Match phrase prefix

Use the `match_phrase_prefix` query to specify a phrase to match in order. The documents that contain the phrase you specify will be returned. The last partial term in the phrase is interpreted as a prefix, so any documents that contain phrases that begin with the phrase and prefix of the last term will be returned.

Similar to [match phrase](#match-phrase), but creates a [prefix query](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/search/PrefixQuery.html) out of the last term in the query string.

```json
GET _search
{
  "query": {
    "match_phrase_prefix": {
      "title": "the wind ri"
    }
  }
}
```

The query accepts the following options. For descriptions of each, see [Advanced filter options](#advanced-filter-options).

```json
GET _search
{
  "query": {
    "match_phrase_prefix": {
      "title": {
        "query": "the wind ri",
        "analyzer": "standard",
        "max_expansions": 50,
        "slop": 3
      }
    }
  }
}
```
<!-- Common terms query has been deprecated. Saving docs in-case we get a request to add it back later. See code deprecation https://github.com/opensearch-project/OpenSearch/blob/main/server/src/main/java/org/opensearch/index/query/CommonTermsQueryBuilder.java#L72-L73>
## Common terms

The common terms query separates the query string into high- and low-frequency terms based on number of occurrences on the shard. Low-frequency terms are weighed more heavily in the results, and high-frequency terms are considered only for documents that already matched one or more low-frequency terms. In that sense, you can think of this query as having a built-in, ever-changing list of stop words.

```json
GET _search
{
  "query": {
    "common": {
      "title": {
        "query": "the wind rises"
      }
    }
  }
}
```

The query accepts the following options. For descriptions of each, see [Advanced filter options](#advanced-filter-options).

```json
GET _search
{
  "query": {
    "common": {
      "title": {
        "query": "the wind rises",
        "cutoff_frequency": 0.002,
        "low_freq_operator": "or",
        "boost": 1,
        "analyzer": "standard",
        "minimum_should_match": {
          "low_freq" : 2,
          "high_freq" : 3
        }
      }
    }
  }
}
```
-->
### Query string

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

The query accepts the following options. For descriptions of each, see [Advanced filter options](#advanced-filter-options).

```json
GET _search
{
  "query": {
    "query_string": {
      "query": "the wind AND (rises OR rising)",
      "default_field": "title",
      "type": "best_fields",
      "fuzziness": "AUTO",
      "fuzzy_transpositions": true,
      "fuzzy_max_expansions": 50,
      "fuzzy_prefix_length": 0,
      "minimum_should_match": 1,
      "default_operator": "or",
      "analyzer": "standard",
      "lenient": false,
      "boost": 1,
      "allow_leading_wildcard": true,
      "enable_position_increments": true,
      "phrase_slop": 3,
      "max_determinized_states": 10000,
      "time_zone": "-08:00",
      "quote_field_suffix": "",
      "quote_analyzer": "standard",
      "analyze_wildcard": false,
      "auto_generate_synonyms_phrase_query": true
    }
  }
}
```

### Simple query string

Use the `simple_query_string` type to specify directly in the query string multiple arguments delineated by regular expressions. Searches with this type will discard any invalid portions of the string.

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

Special character | Behavior
:--- | :---
`+` | Acts as the `and` operator.
`|` | Acts as the `or` operator.
`*` | Acts as a wildcard.
`""` | Wraps several terms into a phrase.
`()` | Wraps a clause for precedence.
`~n` | When used after a term (for example, `wnid~3`), sets `fuzziness`. When used after a phrase, sets `slop`. [Advanced filter options](#advanced-filter-options).
`-` | Negates the term.

The query accepts the following options. For descriptions of each, see [Advanced filter options](#advanced-filter-options).

```json
GET _search
{
  "query": {
    "simple_query_string": {
      "query": "\"rises wind the\"~4 | *ising~2",
      "fields": ["title"],
      "flags": "ALL",
      "fuzzy_transpositions": true,
      "fuzzy_max_expansions": 50,
      "fuzzy_prefix_length": 0,
      "minimum_should_match": 1,
      "default_operator": "or",
      "analyzer": "standard",
      "lenient": false,
      "quote_field_suffix": "",
      "analyze_wildcard": false,
      "auto_generate_synonyms_phrase_query": true
    }
  }
}
```

### Match all

The `match_all` query type will return all documents. This type can be useful in testing large document sets if you need to return the entire set.

```json
GET _search
{
  "query": {
    "match_all": {}
  }
}
```

<!-- need to research why a customer would need to match zero documents in a search >
## Match none

Matches no documents. Rarely useful.

```json
GET _search
{
  "query": {
    "match_none": {}
  }
}
```
-->
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

To learn more about the multiple terms query type, see [Terms]({{site.url}}{{site.baseurl}}/query-dsl/term/terms/). For more reference information about phrase queries, see the [Lucene documentation](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/search/PhraseQuery.html).

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

<!-- cutoff_frequency is now deprecated. See https://github.com/opensearch-project/OpenSearch/blob/main/server/src/main/java/org/opensearch/index/query/MatchQueryBuilder.java#L61-L72 >
`cutoff_frequency` | Between `0.0` and `1.0` or a positive integer | This value lets you define high and low frequency terms based on number of occurrences in the index. Numbers between 0 and 1 are treated as a percentage. For example, 0.10 is 10%. This value means that if a word occurs within the search field in more than 10% of the documents on the shard, OpenSearch considers the word "high frequency" and deemphasizes it when calculating search score.<br /><br />Because this setting is *per shard*, testing its impact on search results can be challenging unless a cluster has many documents. -->
