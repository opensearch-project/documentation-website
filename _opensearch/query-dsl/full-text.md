---
layout: default
title: Full-text queries
parent: Query DSL
nav_order: 40
canonical_url: https://docs.opensearch.org/latest/query-dsl/full-text/index/
---

# Full-text queries

This page lists all full-text query types and common options. Given the sheer number of options and subtle behaviors, the best method of ensuring useful search results is to test different queries against representative indices and verify the output.


---

#### Table of contents
1. TOC
{:toc}


---

## Match

Creates a [boolean query](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/search/BooleanQuery.html) that returns results if the search term is present in the field.

The most basic form of the query provides only a field (`title`) and a term (`wind`):

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

The query accepts the following options. For descriptions of each, see [Options](#options).

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
        "cutoff_frequency": 0.01,
        "prefix_length": 0,
        "max_expansions": 50,
        "boost": 1
      }
    }
  }
}
```


## Multi match

Similar to [match](#match), but searches multiple fields.

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

The query accepts the following options. For descriptions of each, see [Options](#options).

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
      "cutoff_frequency": 0.01,
      "zero_terms_query": "none"
    }
  }
}
```


## Match boolean prefix

Similar to [match](#match), but creates a [prefix query](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/search/PrefixQuery.html) out of the last term in the query string.

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

The query accepts the following options. For descriptions of each, see [Options](#options).

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


## Match phrase

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

The query accepts the following options. For descriptions of each, see [Options](#options).

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


## Match phrase prefix

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

The query accepts the following options. For descriptions of each, see [Options](#options).

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

The query accepts the following options. For descriptions of each, see [Options](#options).

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


## Query string

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

The query accepts the following options. For descriptions of each, see [Options](#options).

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


## Simple query string

The simple query string query is like the query string query, but it lets advanced users specify many arguments directly in the query string. The query discards any invalid portions of the query string.

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
`~n` | When used after a term (e.g. `wnid~3`), sets `fuzziness`. When used after a phrase, sets `slop`. See [Options](#options).
`-` | Negates the term.

The query accepts the following options. For descriptions of each, see [Options](#options).

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


## Match all

Matches all documents. Can be useful for testing.

```json
GET _search
{
  "query": {
    "match_all": {}
  }
}
```


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


## Options

Option | Valid values | Description
:--- | :--- | :---
`allow_leading_wildcard` | Boolean | Whether `*` and `?` are allowed as the first character of a search term. The default is true.
`analyze_wildcard` | Boolean | Whether OpenSearch should attempt to analyze wildcard terms. Some analyzers do a poor job at this task, so the default is false.
`analyzer` | `standard, simple, whitespace, stop, keyword, pattern, <language>, fingerprint` | The analyzer you want to use for the query. Different analyzers have different character filters, tokenizers, and token filters. The `stop` analyzer, for example, removes stop words (e.g. "an," "but," "this") from the query string.
`auto_generate_synonyms_phrase_query` | Boolean | A value of true (default) automatically generates [phrase queries](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/search/PhraseQuery.html) for multi-term synonyms. For example, if you have the synonym `"ba, batting average"` and search for "ba," OpenSearch searches for `ba OR "batting average"` (if this option is true) or `ba OR (batting AND average)` (if this option is false).
`boost` | Floating-point | Boosts the clause by the given multiplier. Useful for weighing clauses in compound queries. The default is 1.0.
`cutoff_frequency` | Between `0.0` and `1.0` or a positive integer | This value lets you define high and low frequency terms based on number of occurrences in the index. Numbers between 0 and 1 are treated as a percentage. For example, 0.10 is 10%. This value means that if a word occurs within the search field in more than 10% of the documents on the shard, OpenSearch considers the word "high frequency" and deemphasizes it when calculating search score.<br /><br />Because this setting is *per shard*, testing its impact on search results can be challenging unless a cluster has many documents.
`enable_position_increments` | Boolean | When true, result queries are aware of position increments. This setting is useful when the removal of stop words leaves an unwanted "gap" between terms. The default is true.
`fields` | String array | The list of fields to search (e.g. `"fields": ["title^4", "description"]`). If unspecified, defaults to the `index.query.default_field` setting, which defaults to `["*"]`.
`flags` | String | A `|`-delimited string of [flags](#simple-query-string) to enable (e.g. `AND|OR|NOT`). The default is `ALL`.
`fuzziness` | `AUTO`, `0`, or a positive integer | The number of character edits (insert, delete, substitute) that it takes to change one word to another when determining whether a term matched a value. For example, the distance between `wined` and `wind` is 1. The default, `AUTO`, chooses a value based on the length of each term and is a good choice for most use cases.
`fuzzy_transpositions` | Boolean | Setting `fuzzy_transpositions` to true (default) adds swaps of adjacent characters to the insert, delete, and substitute operations of the `fuzziness` option. For example, the distance between `wind` and `wnid` is 1 if `fuzzy_transpositions` is true (swap "n" and "i") and 2 if it is false (delete "n", insert "n"). <br /><br />If `fuzzy_transpositions` is false, `rewind` and `wnid` have the same distance (2) from `wind`, despite the more human-centric opinion that `wnid` is an obvious typo. The default is a good choice for most use cases.
`lenient` | Boolean | Setting `lenient` to true lets you ignore data type mismatches between the query and the document field. For example, a query string of "8.2" could match a field of type `float`. The default is false.
`low_freq_operator` | `and, or` | The operator for low-frequency terms. The default is `or`. See [Common terms](#common-terms) queries and `operator` in this table.
`max_determinized_states` | Positive integer | The maximum number of "[states](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/util/automaton/Operations.html#DEFAULT_MAX_DETERMINIZED_STATES)" (a measure of complexity) that Lucene can create for query strings that contain regular expressions (e.g. `"query": "/wind.+?/"`). Larger numbers allow for queries that use more memory. The default is 10,000.
`max_expansions` | Positive integer | Fuzzy queries "expand to" a number of matching terms that are within the distance specified in `fuzziness`. Then OpenSearch tries to match those terms against its indices. `max_expansions` specifies the maximum number of terms that the fuzzy query expands to. The default is 50.
`minimum_should_match` | Positive or negative integer, positive or negative percentage, combination | If the query string contains multiple search terms and you used the `or` operator, the number of terms that need to match for the document to be considered a match. For example, if `minimum_should_match` is 2, "wind often rising" does not match "The Wind Rises." If `minimum_should_match` is 1, it matches. This option also has `low_freq` and `high_freq` properties for [Common terms](#common-terms) queries.
`operator` | `or, and` | If the query string contains multiple search terms, whether all terms need to match (`and`) or only one term needs to match (`or`) for a document to be considered a match.
`phrase_slop` | `0` (default) or a positive integer | See `slop`.
`prefix_length` | `0` (default) or a positive integer | The number of leading characters that are not considered in fuzziness.
`quote_field_suffix` | String | This option lets you search different fields depending on whether terms are wrapped in quotes. For example, if `quote_field_suffix` is `".exact"` and you search for `"lightly"` (in quotes) in the `title` field, OpenSearch searches the `title.exact` field. This second field might use a different type (e.g. `keyword` rather than `text`) or a different analyzer. The default is null.
`rewrite` | `constant_score, scoring_boolean, constant_score_boolean, top_terms_N, top_terms_boost_N, top_terms_blended_freqs_N` | Determines how OpenSearch rewrites and scores multi-term queries. The default is `constant_score`.
`slop` | `0` (default) or a positive integer | Controls the degree to which words in a query can be misordered and still be considered a match. From the [Lucene documentation](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/search/PhraseQuery.html#getSlop--): "The number of other words permitted between words in query phrase. For example, to switch the order of two words requires two moves (the first move places the words atop one another), so to permit re-orderings of phrases, the slop must be at least two. A value of zero requires an exact match."
`tie_breaker` | `0.0` (default) to `1.0` | Changes the way OpenSearch scores searches. For example, a `type` of `best_fields` typically uses the highest score from any one field. If you specify a `tie_breaker` value between 0.0 and 1.0, the score changes to highest score + `tie_breaker` * score for all other matching fields. If you specify a value of 1.0, OpenSearch adds together the scores for all matching fields (effectively defeating the purpose of `best_fields`).
`time_zone` | UTC offset | The time zone to use (e.g. `-08:00`) if the query string contains a date range (e.g. `"query": "wind rises release_date[2012-01-01 TO 2014-01-01]"`). The default is `UTC`.
`type` | `best_fields, most_fields, cross-fields, phrase, phrase_prefix` | Determines how OpenSearch executes the query and scores the results. The default is `best_fields`.
`zero_terms_query` | `none, all` | If the analyzer removes all terms from a query string, whether to match no documents (default) or all documents. For example, the `stop` analyzer removes all terms from the string "an but this."
