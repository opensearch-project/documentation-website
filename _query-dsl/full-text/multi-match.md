---
layout: default
title: Multi-match
parent: Full-text queries
grand_parent: Query DSL
nav_order: 50
---

# Multi-match queries

A multi-match operation functions similarly to the [match]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match/) operation. You can use a `multi_match` query to search multiple fields. 

The `^` "boosts" certain fields. Boosts are multipliers that weigh matches in one field more heavily than matches in other fields. In the following example, a match for "wind" in the title field influences `_score` four times as much as a match in the plot field:

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
{% include copy-curl.html %}

The result is that films like *The Wind Rises* and *Gone with the Wind* are near the top of the search results, and films like *Twister*, which presumably have "wind" in their plot summaries, are near the bottom.

You can use wildcards in the field name. For example, the following query will search the `speaker` field and all fields that start with `play_`, for example, `play_name` or `play_title`:

```json
GET _search
{
  "query": {
    "multi_match": {
      "query": "hamlet",
      "fields": ["speaker", "play_*"]
    }
  }
}
```
{% include copy-curl.html %}

If you don't provide the `fields` parameter, `multi_match` query searches the fields specified in the `index.query. Default_field` setting, which defaults to `*`. The default behavior is to extract all fields in the mapping that are eligible for [term-level queries]({{site.url}}{{site.baseurl}}/query-dsl/term/index/), filter the metadata fields, and combine all extracted fields to build a query.

The maximum number of clauses in a query is defined in the `indices.query.bool.max_clause_count` setting, which defaults to 1,024. 
{: .note}

## Multi-match query types

OpenSearch supports the following multi-match query types, which differ in the way the query is executed internally:

- [`best_fields`](#best-fields) (default): Returns documents that match any field. Uses the `_score` of the best-matching field. 
- [`most_fields`](#most-fields): Returns documents that match any field. Uses a combined score of each matching field.
- [`cross_fields`](#cross-fields): Treats all fields as if they were one field. Processes fields with the same `analyzer` and matches words in any field. 
- [`phrase`](#phrase): Runs a `match_phrase` query on each field. Uses the `_score` of the best-matching field.
- [`phrase_prefix`](#phrase-prefix): Runs a `match_phrase_prefix` query on each field. Uses the `_score` of the best-matching field.
- [`bool_prefix`](#boolean-prefix): Runs a `match_bool_prefix` query on each field. Uses a combined score of each matched field.

## Best fields 

If you're searching for two words that specify a concept, you want the results where the two words are next to each other to score higher. 

For example, consider an index that contains the following scientific articles:

```json
PUT /articles/_doc/1
{
  "title": "Aurora borealis",
  "description": "Northern lights, or aurora borealis, explained"
}
```
{% include copy-curl.html %}

```json
PUT /articles/_doc/2
{
  "title": "Sun deprivation in the Northern countries",
  "description": "Using fluorescent lights for therapy"
}
```
{% include copy-curl.html %}

You can search for articles containing `northern lights` in the title or description:

```json
GET articles/_search
{
  "query": {
    "multi_match" : {
      "query": "northern lights",
      "type": "best_fields",
      "fields": [ "title", "description" ],
      "tie_breaker": 0.3
    }
  }
}
```
{% include copy-curl.html %}

The preceding query is executed as the following [`dis_max`]({{site.url}}{{site.baseurl}}/query-dsl/compound/disjunction-max/) query with a `match` query for each field:

```json
GET /articles/_search
{
  "query": {
    "dis_max": {
      "queries": [
        { "match": { "title": "northern lights" }},
        { "match": { "description": "northern lights" }}
      ],
      "tie_breaker": 0.3
    }
  }
}
```

The results contain both documents, but document 1 is scored higher because both words are in the `description` field:

```json
{
  "took": 30,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 0.84407747,
    "hits": [
      {
        "_index": "articles",
        "_id": "1",
        "_score": 0.84407747,
        "_source": {
          "title": "Aurora borealis",
          "description": "Northern lights, or aurora borealis, explained"
        }
      },
      {
        "_index": "articles",
        "_id": "2",
        "_score": 0.6322521,
        "_source": {
          "title": "Sun deprivation in the Northern countries",
          "description": "Using fluorescent lights for therapy"
        }
      }
    ]
  }
}
```

The `best_fields` query uses the score of the best-matching field. If you specify a `tie_breaker`, the score is calculated using the following algorithm:

Take the score of the best-matching field and add (`tie_breaker` * `_score`) for all other matching fields.

## Most fields 

Use the `most_fields` query for multiple fields that contain the same text that is analyzed in different ways. For example, the original field may contain text analyzed with the `standard` analyzer and another field may contain the same text analyzed with the `english` analyzer, which performs stemming:

```json
PUT /articles
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

Consider the following two documents that are indexed in the `articles` index:

```json
PUT /articles/_doc/1
{
  "title": "Buttered toasts"
}
```
{% include copy-curl.html %}

```json
PUT /articles/_doc/2
{
  "title": "Buttering a toast"
}
```
{% include copy-curl.html %}

The `standard` analyzer analyzes the title `Buttered toast` into [`buttered`, `toasts`] and the title `Buttering a toast` into [`buttering`, `a`, `toast`]. On the other hand, the `english` analyzer produces the same token list [`butter`, `toast`] for both titles because of stemming.

You can use the `most_fields` query in order to return as many documents as possible:

```json
GET /articles/_search
{
  "query": {
    "multi_match": {
      "query": "buttered toast",
      "fields": [ 
        "title",
        "title.english"
      ],
      "type": "most_fields" 
    }
  }
}
```
{% include copy-curl.html %}

The preceding query is executed as the following Boolean query:

```json
GET articles/_search
{
  "query": {
    "bool": {
      "should": [
        { "match": { "title": "buttered toasts" }},
        { "match": { "title.english": "buttered toasts" }}
      ]
    }
  }
}
```

To calculate the relevance score, a document's scores for all `match` clauses are added together and then the result is divided by the number of `match` clauses.

Including the `title.english` field retrieves the second document that matches the stemmed tokens:

```json
{
  "took": 9,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 1.4418206,
    "hits": [
      {
        "_index": "articles",
        "_id": "1",
        "_score": 1.4418206,
        "_source": {
          "title": "Buttered toasts"
        }
      },
      {
        "_index": "articles",
        "_id": "2",
        "_score": 0.09304003,
        "_source": {
          "title": "Buttering a toast"
        }
      }
    ]
  }
}
```

Because both `title` and `title.english` fields match for the first document, it has a higher relevance score.

## Operator and minimum should match

The `best_fields` and `most_fields` queries generate a match query on a field basis (one per field). Thus, the `minimum_should_match` and `operator` parameters are applied to each field, which is normally not the desired behavior. 

For example, consider a `customers` index with the following documents: 

```json
PUT customers/_doc/1 
{
  "first_name": "John",
  "last_name": "Doe"
}
```
{% include copy-curl.html %}

```json
PUT customers/_doc/2 
{
  "first_name": "Jane",
  "last_name": "Doe"
}
```
{% include copy-curl.html %}

If you're searching for `John Doe` in the `customers` index, you might construct the following query:

```json
GET customers/_validate/query?explain
{
  "query": {
    "multi_match" : {
      "query": "John Doe",
      "type": "best_fields",
      "fields": [ "first_name", "last_name" ],
      "operator": "and" 
    }
  }
}
```
{% include copy-curl.html %}

The intent of the `and` operator in this query is to find a document that matches `John` and `Doe`. However, the query does not return any results. You can learn how the query is executed by running the Validate API:

```json
GET customers/_validate/query?explain
{
  "query": {
    "multi_match" : {
      "query":      "John Doe",
      "type":       "best_fields",
      "fields":     [ "first_name", "last_name" ],
      "operator":   "and" 
    }
  }
}
```
{% include copy-curl.html %}

From the response, you can see that the query is trying to match both `John` and `Doe` to either the `first_name` or `last_name` field:

```json
{
  "_shards": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "valid": true,
  "explanations": [
    {
      "index": "customers",
      "valid": true,
      "explanation": "((+first_name:john +first_name:doe) | (+last_name:john +last_name:doe))"
    }
  ]
}
```

Because neither field contains both words, no results are returned. 

A better alternative for searching across fields is to use the [`cross_fields`](#cross-fields) query. Unlike the field-centric `best_fields` and `most_fields` queries, `cross_fields` query is term-centric.

## Cross fields 

Use the `cross_fields` query to search for data across multiple fields. For example, if an index contains customer data, the first name and last name of the customer reside in different fields. Yet, when you search for `John Doe`, you want to receive documents in which `John` is in the `first_name` field and `Doe` is in the `last_name` field.

The `most_fields` query does not work in this case because of the following problems:

- The [`operator` and `minimum_should_match`](#operator-and-minimum-should-match) parameters are applied on a field basis instead of on a term basis.
- Term frequencies in the `first_name` and `last_name` fields can lead to unexpected results. For example, if someone's first name happens to be `Doe`, a document with this name will be presumed a better match because this first name will not appear in any other documents.

The `cross_fields` query analyzes the query string into individual terms and then searches for each of the terms in any of the fields, as if they were one field.

The following is the `cross_fields` query for `John Doe`:

```json
GET /customers/_search
{
  "query": {
    "multi_match" : {
      "query": "John Doe",
      "type": "cross_fields",
      "fields": [ "first_name", "last_name" ],
      "operator": "and"
    }
  }
}
```
{% include copy-curl.html %}

The response contains the only document in which both `John` and `Doe` are present:

```json
{
  "took": 19,
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
    "max_score": 0.8754687,
    "hits": [
      {
        "_index": "customers",
        "_id": "1",
        "_score": 0.8754687,
        "_source": {
          "first_name": "John",
          "last_name": "Doe"
        }
      }
    ]
  }
}
```

You can use the Validate API operation to gain insight into how the preceding query is executed:

```json
GET /customers/_validate/query?explain
{
  "query": {
    "multi_match" : {
      "query": "John Doe",
      "type": "cross_fields",
      "fields": [ "first_name", "last_name" ],
      "operator": "and"
    }
  }
}
```
{% include copy-curl.html %}

From the response, you can see that the query is searching for all terms in at least one field:

```json
{
  "_shards": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "valid": true,
  "explanations": [
    {
      "index": "customers",
      "valid": true,
      "explanation": "+blended(terms:[last_name:john, first_name:john]) +blended(terms:[last_name:doe, first_name:doe])"
    }
  ]
}
```

Thus, blending the term frequencies for all fields solves the problem of differing term frequencies by correcting for the differences.

The `cross_fields` query is usually only useful on short string fields with a `boost` of 1. In other cases, the score does not produce a meaningful blend of term statistics because of the way boosts, term frequencies, and length normalization contribute to the score.
{: .note}

The `fuzziness` parameter is not supported for `cross_fields` queries.
{: .note}

### Analysis

The `cross_fields` query only works as a term-centric query on fields with the same analyzer. Fields with the same analyzer are grouped together and these groups are combined with a Boolean query. 

For example, consider an index where the `first_name` and `last_name` fields are analyzed with the default `standard`
 analyzer and their `.edge` subfields are analyzed with an edge n-gram analyzer:

<details closed markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
PUT customers
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_analyzer": {
          "tokenizer": "my_tokenizer"
        }
      },
      "tokenizer": {
        "my_tokenizer": {
          "type": "edge_ngram",
          "min_gram": 2,
          "max_gram": 10
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "first_name": { 
        "type": "text",
        "fields": {
          "edge": { 
            "type": "text",
            "analyzer": "my_analyzer"
          }
        }
      },
      "last_name": { 
        "type": "text",
        "fields": {
          "edge": { 
            "type": "text",
            "analyzer": "my_analyzer"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

</details>

You index one document in the `customers` index:

```json
PUT /customers/_doc/1
{
  "first": "John",
  "last": "Doe"
}
```
{% include copy-curl.html %}

You can use a `cross_fields` query to search across the fields for `John Doe`:

```json
GET /customers/_search
{
  "query": {
    "multi_match" : {
      "query": "John",
      "type": "cross_fields",
      "fields": [
        "first_name", "first_name.edge",
        "last_name",  "last_name.edge"
      ]
    }
  }
}
```
{% include copy-curl.html %}

To see how the query is executed, you can run the Validate API:

```json
GET /customers/_validate/query?explain
{
  "query": {
    "multi_match" : {
      "query": "John",
      "type": "cross_fields",
      "fields": [
        "first_name", "first_name.edge",
        "last_name",  "last_name.edge"
      ]
    }
  }
}
```
{% include copy-curl.html %}

The response shows that the `last_name` and `first_name` fields are grouped together and treated as a single field. Similarly, the `last_name.edge` and `first_name.edge` fields are grouped together and treated as a single field:

```json
{
  "_shards": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "valid": true,
  "explanations": [
    {
      "index": "customers",
      "valid": true,
      "explanation": "(blended(terms:[last_name:john, first_name:john]) | (blended(terms:[last_name.edge:Jo, first_name.edge:Jo]) blended(terms:[last_name.edge:Joh, first_name.edge:Joh]) blended(terms:[last_name.edge:John, first_name.edge:John])))"
    }
  ]
}
```

Using the `operator` or `minimum_should_match` parameters with multiple field groups like the preceding ones can lead to the problem described in the [previous section](#operator-and-minimum-should-match). To avoid it, you can rewrite the previous query as two `cross_fields` subqueries combined with a Boolean query and apply the `minimum_should_match` to one of the subqueries:

```json
GET /customers/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "multi_match": {
            "query": "John Doe",
            "type": "cross_fields",
            "fields": [
              "first_name",
              "last_name"
            ],
            "minimum_should_match": "1"
          }
        },
        {
          "multi_match": {
            "query": "John Doe",
            "type": "cross_fields",
            "fields": [
              "first_name.edge",
              "last_name.edge"
            ]
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

To create one group for all fields, specify an analyzer in your query:

```json
GET customers/_search
{
  "query": {
   "multi_match" : {
      "query": "John Doe",
      "type": "cross_fields",
      "analyzer": "standard", 
      "fields": [ "first_name", "last_name", "*.edge" ]
    }
  }
}
```
{% include copy-curl.html %}

Running the Validate API on the previous query shows how the query is executed:

```json
{
  "_shards": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "valid": true,
  "explanations": [
    {
      "index": "customers",
      "valid": true,
      "explanation": "blended(terms:[last_name.edge:john, last_name:john, first_name:john, first_name.edge:john]) blended(terms:[last_name.edge:doe, last_name:doe, first_name:doe, first_name.edge:doe])"
    }
  ]
}
```

## Phrase 

The `phrase` query behaves similarly to the [`best_fields`](#best-fields) query but uses a `match_phrase` query instead of a `match` query.

The following is an example `phrase` query for the index described in the [`best_fields`](#best-fields) section:

```json
GET articles/_search
{
  "query": {
    "multi_match" : {
      "query": "northern lights",
      "type": "phrase",
      "fields": [ "title", "description" ]
    }
  }
}
```
{% include copy-curl.html %}

The preceding query is executed as the following [`dis_max`]({{site.url}}{{site.baseurl}}/query-dsl/compound/disjunction-max/) query with a `match_phrase` query for each field:

```json
GET articles/_search
{
  "query": {
    "dis_max": {
      "queries": [
        { "match_phrase": { "title": "northern lights" }},
        { "match_phrase": { "description": "northern lights" }}
      ]
    }
  }
}
```

Because by default a `phrase` query matches text only when the terms appear in the same order, only document 1 is returned in the results:

<details closed markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 3,
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
    "max_score": 0.84407747,
    "hits": [
      {
        "_index": "articles",
        "_id": "1",
        "_score": 0.84407747,
        "_source": {
          "title": "Aurora borealis",
          "description": "Northern lights, or aurora borealis, explained"
        }
      }
    ]
  }
}
```
</details>

You can use the `slop` parameter to allow other words between words in query phrase. For example, the following query accepts text as a match if up to two words are between `flourescent` and `therapy`:

```json
GET articles/_search
{
  "query": {
    "multi_match" : {
      "query": "fluorescent therapy",
      "type": "phrase",
      "fields": [ "title", "description" ],
      "slop": 2
    }
  }
}
```
{% include copy-curl.html %}

The response contains document 2:

<details closed markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 3,
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
    "max_score": 0.7003825,
    "hits": [
      {
        "_index": "articles",
        "_id": "2",
        "_score": 0.7003825,
        "_source": {
          "title": "Sun deprivation in the Northern countries",
          "description": "Using fluorescent lights for therapy"
        }
      }
    ]
  }
}
```
</details>

For `slop` values less than 2, no documents are returned.

The `fuzziness` parameter is not supported for `phrase` queries.
{: .note}

## Phrase prefix 

The `phrase_prefix` query behaves similarly to the [`phrase`](#phrase) query but uses a `match_phrase_prefix` query instead of a `match_phrase` query.

The following is an example `phrase_prefix` query for the index described in the [`best_fields`](#best-fields) section:

```json
GET articles/_search
{
  "query": {
    "multi_match" : {
      "query": "northern light",
      "type": "phrase_prefix",
      "fields": [ "title", "description" ]
    }
  }
}
```
{% include copy-curl.html %}

The preceding query is executed as the following [`dis_max`]({{site.url}}{{site.baseurl}}/query-dsl/compound/disjunction-max/) query with a `match_phrase_prefix` query for each field:

```json
GET articles/_search
{
  "query": {
    "dis_max": {
      "queries": [
        { "match_phrase_prefix": { "title": "northern light" }},
        { "match_phrase_prefix": { "description": "northern light" }}
      ]
    }
  }
}
```

You can use the `slop` parameter to allow other words between words in query phrase.

The `fuzziness` parameter is not supported for `phrase_prefix` queries.
{: .note}

## Boolean prefix 

The `bool_prefix` query scores documents similarly to the [`most_fields`](#most-fields) query but uses a [`match_bool_prefix`]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match-bool-prefix/) query instead of a `match` query.

The following is an example `bool_prefix` query for the index described in the [`best_fields`](#best-fields) section:

```json
GET articles/_search
{
  "query": {
    "multi_match" : {
      "query": "li northern",
      "type": "bool_prefix",
      "fields": [ "title", "description" ]
    }
  }
}
```
{% include copy-curl.html %}

The preceding query is executed as the following [`dis_max`]({{site.url}}{{site.baseurl}}/query-dsl/compound/disjunction-max/) query with a `match_bool_prefix` query for each field:

```json
GET articles/_search
{
  "query": {
    "dis_max": {
      "queries": [
        { "match_bool_prefix": { "title": "li northern" }},
        { "match_bool_prefix": { "description": "li northern" }}
      ]
    }
  }
}
```

The `fuzziness`, `prefix_length`, `max_expansions`, `fuzzy_rewrite`, and `fuzzy_transpositions` parameters are supported for the terms that are used to construct term queries, but they do not have an effect on the prefix query constructed from the final term.
{: .note}

## Parameters

The query accepts the following parameters. All parameters except `query` are optional.

Parameter | Data type | Description
:--- | :--- | :---
`query` | String | The query string to use for search. Required.
`auto_generate_synonyms_phrase_query` | Boolean | Specifies whether to create a [match phrase query]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match-phrase/) automatically for multi-term synonyms. For example, if you specify `ba,batting average` as synonyms and search for `ba`, OpenSearch searches for `ba OR "batting average"` (if this option is `true`) or `ba OR (batting AND average)` (if this option is `false`). Default is `true`.
`analyzer` | String | The [analyzer]({{site.url}}{{site.baseurl}}/analyzers/index/) used to tokenize the query string text. Default is the index-time analyzer specified for the `default_field`. If no analyzer is specified for the `default_field`, the `analyzer` is the default analyzer for the index.
`boost` | Floating-point | Boosts the clause by the given multiplier. Useful for weighing clauses in compound queries. Values in the [0, 1) range decrease relevance, and values greater than 1 increase relevance. Default is `1`.
`fields` | Array of strings | The list of fields in which to search. If you don't provide the `fields` parameter, `multi_match` query searches the fields specified in the `index.query. Default_field` setting, which defaults to `*`. 
`fuzziness` | String | The number of character edits (insert, delete, substitute) that it takes to change one word to another when determining whether a term matched a value. For example, the distance between `wined` and `wind` is 1. Valid values are non-negative integers or `AUTO`. The default, `AUTO`, chooses a value based on the length of each term and is a good choice for most use cases. Not supported for `phrase`, `phrase_prefix`, and `cross_fields` queries.
`fuzzy_rewrite` | String | Determines how OpenSearch rewrites the query. Valid values are `constant_score`, `scoring_boolean`, `constant_score_boolean`, `top_terms_N`, `top_terms_boost_N`, and `top_terms_blended_freqs_N`. If the `fuzziness` parameter is not `0`, the query uses a `fuzzy_rewrite` method of `top_terms_blended_freqs_${max_expansions}` by default. Default is `constant_score`. 
`fuzzy_transpositions` | Boolean | Setting `fuzzy_transpositions` to `true` (default) adds swaps of adjacent characters to the insert, delete, and substitute operations of the `fuzziness` option. For example, the distance between `wind` and `wnid` is 1 if `fuzzy_transpositions` is true (swap "n" and "i") and 2 if it is false (delete "n", insert "n"). If `fuzzy_transpositions` is false, `rewind` and `wnid` have the same distance (2) from `wind`, despite the more human-centric opinion that `wnid` is an obvious typo. The default is a good choice for most use cases.
`lenient` | Boolean | Setting `lenient` to `true` ignores data type mismatches between the query and the document field. For example, a query string of `"8.2"` could match a field of type `float`. Default is `false`.
`max_expansions` | Positive integer |  The maximum number of terms to which the query can expand. Fuzzy queries “expand to” a number of matching terms that are within the distance specified in `fuzziness`. Then OpenSearch tries to match those terms. Default is `50`.
`minimum_should_match` | Positive or negative integer, positive or negative percentage, combination | If the query string contains multiple search terms and you use the `or` operator, the number of terms that need to match for the document to be considered a match. For example, if `minimum_should_match` is 2, `wind often rising` does not match `The Wind Rises.` If `minimum_should_match` is `1`, it matches. For details, see [Minimum should match]({{site.url}}{{site.baseurl}}/query-dsl/minimum-should-match/).
`operator` | String | If the query string contains multiple search terms, whether all terms need to match (`AND`) or only one term needs to match (`OR`) for a document to be considered a match. Valid values are:<br>- `OR`: The string `to be` is interpreted as `to OR be`<br>- `AND`: The string `to be` is interpreted as `to AND be`<br> Default is `OR`.
`prefix_length` | Non-negative integer | The number of leading characters that are not considered in fuzziness. Default is `0`.
`slop` | `0` (default) or a positive integer | Controls the degree to which words in a query can be misordered and still be considered a match. From the [Lucene documentation](https://lucene.apache.org/core/8_9_0/core/org/apache/lucene/search/PhraseQuery.html#getSlop--): "The number of other words permitted between words in query phrase. For example, to switch the order of two words requires two moves (the first move places the words atop one another), so to permit reorderings of phrases, the slop must be at least two. A value of zero requires an exact match." Supported for `phrase` and `phrase_prefix` query types.
`tie_breaker` | Floating-point | A factor between 0 and 1.0 that is used to give more weight to documents that match multiple query clauses. For more information, see [The `tie_breaker` parameter`](#the-tie_breaker-parameter).
`type` | String | The multi-match query type. Valid values are `best_fields`, `most_fields`, `cross_fields`, `phrase`, `phrase_prefix`, `bool_prefix`. Default is `best_fields`.
`zero_terms_query` | String | In some cases, the analyzer removes all terms from a query string. For example, the `stop` analyzer removes all terms from the string `an but this`. In those cases, `zero_terms_query` specifies whether to match no documents (`none`) or all documents (`all`). Valid values are `none` and `all`. Default is `none`.

The `fuzziness` parameter is not supported for `phrase`, `phrase_prefix`, and `cross_fields` queries.
{: .note}

The `slop` parameter is only supported for `phrase` and `phrase_prefix` queries.
{: .note}

### The `tie_breaker` parameter

Each term-level blended query calculates the document score as the best score returned by any field in a group. The scores from all blended queries are added together to produce the final score. You can change the way the score is calculated by using the `tie_breaker` parameter. The `tie_breaker` parameter accepts the following values:

- 0.0 (default for `best_fields`, `cross_fields`, `phrase`, and `phrase_prefix` queries): Take the single best score returned by any field in a group.
- 1.0 (default for `most_fields` and `bool_prefix` queries): Add the scores for all fields in a group.
- A floating-point value in the (0, 1) range: Take the single best score of the best-matching field and add (`tie_breaker` * `_score`) for all other matching fields.