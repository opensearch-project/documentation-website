---
layout: default
title: Multi-match
parent: Full-text queries
nav_order: 50
---

# Multi-match queries

A `multi_match` query runs a [`match`]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match/) query against several fields at once and combines the per-field results into one score. The `type` parameter controls how the fields are combined.

Use a `multi_match` query in the following scenarios:

- Searching a title and a body field, where a match in the title should count for more.
- Searching the same text indexed using several analyzers, such as a stemmed and an unstemmed subfield.
- Searching structured data in which one concept is split across fields, such as a first name and a last name.
- Building search-as-you-type experiences across several fields by using the `phrase_prefix` or `bool_prefix` type.

Use the `^` operator to boost certain fields. Boosts are multipliers that weigh matches in one field more heavily than matches in other fields. In the following example, a match for "wind" in the title field influences `_score` four times as much as a match in the plot field:

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

You can use wildcards in the field name. For example, the following query searches the `speaker` field and all fields that start with `play_`, for example, `play_name` or `play_title`:

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

If you don't provide the `fields` parameter, the `multi_match` query searches the fields specified in the `index.query.default_field` setting, which defaults to `*`. The `*` value selects all fields in the mapping that are eligible for [term-level queries]({{site.url}}{{site.baseurl}}/query-dsl/term/index/), excluding metadata fields, and the query searches all of them.

Each field adds at least one clause to the query, and the total number of clauses is limited by the `indices.query.bool.max_clause_count` setting, which defaults to 1,024. Searching many fields, either explicitly or by using a wildcard pattern such as `*`, can exceed this limit.
{: .note}

## Multi-match query types

OpenSearch supports the following multi-match query types, which differ in the way the query is executed internally:

- [`best_fields`](#best-fields) (default): Returns documents that match any field. Uses the `_score` of the best-matching field. 
- [`most_fields`](#most-fields): Returns documents that match any field. Uses the sum of the scores of all matching fields.
- [`cross_fields`](#cross-fields): Treats fields that have the same analyzer as one field and searches for each term in any of them.
- [`phrase`](#phrase): Runs a `match_phrase` query on each field. Uses the `_score` of the best-matching field.
- [`phrase_prefix`](#phrase-prefix): Runs a `match_phrase_prefix` query on each field. Uses the `_score` of the best-matching field.
- [`bool_prefix`](#boolean-prefix): Runs a `match_bool_prefix` query on each field. Uses the sum of the scores of all matching fields.

The `best_fields` and `most_fields` types are field centric: they build one query for each field and then combine the per-field scores. The `cross_fields` type is term centric: it looks up each query term across all fields together. Not every parameter applies to every type. For more information, see [Parameter support by type](#parameter-support-by-type).

## Best fields 

Use the `best_fields` type when the query terms are most meaningful if they appear together in the same field. For example, `northern lights` in a single field is a stronger match than `northern` in one field and `lights` in another.

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
  "took": 5,
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
    "max_score": 0.38367155,
    "hits": [
      {
        "_index": "articles",
        "_id": "1",
        "_score": 0.38367155,
        "_source": {
          "title": "Aurora borealis",
          "description": "Northern lights, or aurora borealis, explained"
        }
      },
      {
        "_index": "articles",
        "_id": "2",
        "_score": 0.2873873,
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

Use the `most_fields` query for multiple fields that contain the same text that is analyzed in different ways. For example, the original field may contain text analyzed with the `standard` analyzer and another field may contain the same text analyzed with the `english` analyzer, which performs stemming. The stemmed field matches the most documents, and the unstemmed field moves the closest matches to the top of the results.

The following request creates a `recipes` index in which the `title` field has an `english` subfield:

```json
PUT /recipes
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

Consider the following two documents that are indexed in the `recipes` index:

```json
PUT /recipes/_doc/1
{
  "title": "Buttered toasts"
}
```
{% include copy-curl.html %}

```json
PUT /recipes/_doc/2
{
  "title": "Buttering a toast"
}
```
{% include copy-curl.html %}

The `standard` analyzer analyzes the title `Buttered toasts` into [`buttered`, `toasts`] and the title `Buttering a toast` into [`buttering`, `a`, `toast`]. On the other hand, the `english` analyzer produces the same token list [`butter`, `toast`] for both titles because it applies stemming and removes the stopword `a`.

The following `most_fields` query searches both the `title` field and its `english` subfield:

```json
GET /recipes/_search
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
GET recipes/_search
{
  "query": {
    "bool": {
      "should": [
        { "match": { "title": "buttered toast" }},
        { "match": { "title.english": "buttered toast" }}
      ]
    }
  }
}
```

To calculate the relevance score, OpenSearch adds together the scores of all `match` clauses that match the document.

Both documents match the `title.english` field equally because their stemmed tokens are identical. In the `title` field, document 1 matches the term `buttered` and document 2 matches the term `toast`. Each term appears in only one document, but the `title` field of document 1 contains fewer tokens, so its match scores higher. Without the `title.english` field, documents that use a different form of a word, such as `buttering`, would match only on the remaining terms:

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
      "value": 2,
      "relation": "eq"
    },
    "max_score": 0.508889,
    "hits": [
      {
        "_index": "recipes",
        "_id": "1",
        "_score": 0.508889,
        "_source": {
          "title": "Buttered toasts"
        }
      },
      {
        "_index": "recipes",
        "_id": "2",
        "_score": 0.4569852,
        "_source": {
          "title": "Buttering a toast"
        }
      }
    ]
  }
}
```

Document 1 scores `0.34314215` for the `title` field and `0.16574687` for the `title.english` field, and its final score is the sum of the two, `0.508889`.

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
GET customers/_search
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

The intent of the `and` operator in this query is to find a document that matches `John` and `Doe`. However, the query does not return any results. You can learn how the query is executed by running the [Validate Query API]({{site.url}}{{site.baseurl}}/api-reference/search-apis/validate/):

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
      "explanation": "((+last_name:john +last_name:doe) | (+first_name:john +first_name:doe))"
    }
  ]
}
```

Because neither field contains both words, no results are returned. 

A better alternative for searching across fields is to use the [`cross_fields`](#cross-fields) query. Unlike the field-centric `best_fields` and `most_fields` queries, the `cross_fields` query is term centric.

## Cross fields 

Use the `cross_fields` query to search for data across multiple fields. For example, if an index contains customer data, the first name and last name of the customer reside in different fields. Yet, when you search for `John Doe`, you want to receive documents in which `John` is in the `first_name` field and `Doe` is in the `last_name` field.

The `most_fields` query does not work in this case because of the following problems:

- The [`operator` and `minimum_should_match`](#operator-and-minimum-should-match) parameters are applied on a field basis instead of on a term basis.
- Term frequencies in the `first_name` and `last_name` fields can lead to unexpected results. For example, if someone's first name happens to be `Doe`, a document with this name will be presumed a better match because this first name will not appear in any other documents.

One way to avoid both problems is to copy the values of `first_name` and `last_name` into a single `full_name` field at index time by using the [`copy_to`]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/copy-to/) mapping parameter and then search that field. The `cross_fields` query solves the same problems at query time, without changes to the mapping.

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
  "took": 1,
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
    "max_score": 0.3979403,
    "hits": [
      {
        "_index": "customers",
        "_id": "1",
        "_score": 0.3979403,
        "_source": {
          "first_name": "John",
          "last_name": "Doe"
        }
      }
    ]
  }
}
```

Use the Validate Query API to see how the preceding query is executed:

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

From the response, you can see that each term must be present in at least one of the fields:

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

Each `blended` clause scores a term as if all of its fields were one field. To do this, OpenSearch adjusts the document frequency of the term in each field. The field in which the term is most common keeps its document frequency, and every other field receives that frequency plus one. For example, if `doe` appears in the `last_name` field of 3 documents and in the `first_name` field of 1 document, the [Explain API]({{site.url}}{{site.baseurl}}/api-reference/search-apis/explain/) reports a document frequency of 3 for `last_name:doe` and 4 for `first_name:doe`. As a result, a rare occurrence of `doe` in the `first_name` field no longer outscores the common occurrence in the `last_name` field, and matches in `last_name`, the field most likely to contain `doe`, score slightly higher.

The `cross_fields` query is usually only useful on short string fields with a `boost` of 1. In other cases, the score does not produce a meaningful blend of term statistics because of the way boosts, term frequencies, and length normalization contribute to the score.
{: .note}

The `fuzziness` parameter is not supported for `cross_fields` queries. For more information, see [Parameter support by type](#parameter-support-by-type).
{: .note}

### Analysis

The `cross_fields` query blends terms only across fields that use the same search analyzer, because only those fields produce the same terms from the query string. OpenSearch groups the fields by analyzer, builds one set of `blended` clauses for each group, and then combines the groups in a [`dis_max`]({{site.url}}{{site.baseurl}}/query-dsl/compound/disjunction-max/) query. The best-scoring group determines the score, and the `tie_breaker` parameter controls how much the other groups contribute.

For example, the following request creates a `customer_names` index in which the `first_name` and `last_name` fields use the default `standard` analyzer and their `edge` subfields use an edge n-gram analyzer:

```json
PUT customer_names
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

Index one document into the `customer_names` index:

```json
PUT /customer_names/_doc/1
{
  "first_name": "John",
  "last_name": "Doe"
}
```
{% include copy-curl.html %}

The following `cross_fields` query searches for `John` in all four fields:

```json
GET /customer_names/_search
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

To see how the query is executed, run the Validate Query API:

```json
GET /customer_names/_validate/query?explain
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

The response shows two groups separated by the `|` (`dis_max`) operator. The `last_name` and `first_name` fields form one group, and the `last_name.edge` and `first_name.edge` fields form another. Within the second group, the edge n-gram analyzer splits `John` into the terms `Jo`, `Joh`, and `John`. Because the custom analyzer has no `lowercase` filter, these terms keep their original case:

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
      "index": "customer_names",
      "valid": true,
      "explanation": "(blended(terms:[last_name:john, first_name:john]) | (blended(terms:[last_name.edge:Jo, first_name.edge:Jo]) blended(terms:[last_name.edge:Joh, first_name.edge:Joh]) blended(terms:[last_name.edge:John, first_name.edge:John])))"
    }
  ]
}
```

#### Combining field groups with operator and minimum should match

The `operator` and `minimum_should_match` parameters apply to each field group separately. When groups produce different numbers of terms, this can lead to the problem described in [`operator` and `minimum_should_match`](#operator-and-minimum-should-match). For example, with `"operator": "and"`, the query `John Doe` requires the `edge` group to match every n-gram of `John Doe`, including `John D` and `John Do`, which never occur in the index. The document can then match only through the `standard` group.

To control each group independently, rewrite the query as two `cross_fields` subqueries combined in a `bool` query, and apply `minimum_should_match` to only one of the subqueries:

```json
GET /customer_names/_search
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

#### Forcing all fields into one group

To place all fields in one group, specify an `analyzer` in the query. OpenSearch then analyzes the query string once using that analyzer and searches for the resulting terms in every field:

```json
GET customer_names/_search
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

Running the Validate Query API on the preceding query shows one `blended` clause for each term, covering all four fields:

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
      "index": "customer_names",
      "valid": true,
      "explanation": "blended(terms:[last_name.edge:john, last_name:john, first_name:john, first_name.edge:john]) blended(terms:[last_name.edge:doe, last_name:doe, first_name:doe, first_name.edge:doe])"
    }
  ]
}
```

When you override the analyzer, the query terms no longer match the way the subfields were indexed. In this example, the `standard` analyzer produces the lowercase term `jo` for the query `Jo`, but the `edge` subfields contain only `Jo`. As a result, a search for `Jo` using `"analyzer": "standard"` returns no documents, while the same search without the `analyzer` parameter matches document 1 through the `edge` subfields. Override the analyzer only when all grouped fields can match the terms it produces.
{: .important}

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

By default, a `phrase` query matches only when the terms appear next to each other in the same order. Document 2 contains both terms but not as a phrase, so only document 1 is returned in the results:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 1,
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
    "max_score": 0.38367155,
    "hits": [
      {
        "_index": "articles",
        "_id": "1",
        "_score": 0.38367155,
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

Use the `slop` parameter to allow other words between the words in the query phrase. For example, the following query accepts text as a match if up to two words are between `fluorescent` and `therapy`:

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

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 1,
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
    "max_score": 0.31835568,
    "hits": [
      {
        "_index": "articles",
        "_id": "2",
        "_score": 0.31835568,
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

The `fuzziness` parameter is not supported for `phrase` queries. For more information, see [Parameter support by type](#parameter-support-by-type).
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

The `phrase_prefix` type accepts the `slop` parameter, which works the same way as for the `phrase` type. It also accepts the `max_expansions` parameter, which limits the number of terms to which the last term in the query is expanded. Default is `50`.

The `fuzziness` parameter is not supported for `phrase_prefix` queries. For more information, see [Parameter support by type](#parameter-support-by-type).
{: .note}

## Boolean prefix 

The `bool_prefix` query scores documents similarly to the [`most_fields`](#most-fields) query but uses a [`match_bool_prefix`]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match-bool-prefix/) query instead of a `match` query. The `match_bool_prefix` query matches every term except the last one exactly and treats the last term as a prefix, which makes it useful for search-as-you-type experiences.

The following is an example `bool_prefix` query for the index described in the [`best_fields`](#best-fields) section:

```json
GET articles/_search
{
  "query": {
    "multi_match" : {
      "query": "northern li",
      "type": "bool_prefix",
      "fields": [ "title", "description" ]
    }
  }
}
```
{% include copy-curl.html %}

The preceding query is executed as the following Boolean query with a `match_bool_prefix` query for each field. The scores of all matching clauses are added together:

```json
GET articles/_search
{
  "query": {
    "bool": {
      "should": [
        { "match_bool_prefix": { "title": "northern li" }},
        { "match_bool_prefix": { "description": "northern li" }}
      ]
    }
  }
}
```

Both documents are returned. Document 1 matches `northern` and the prefix `li` (`lights`) in the `description` field. Document 2 matches `northern` in the `title` field and the prefix `li` in the `description` field:

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
      "value": 2,
      "relation": "eq"
    },
    "max_score": 1.3037697,
    "hits": [
      {
        "_index": "articles",
        "_id": "1",
        "_score": 1.3037697,
        "_source": {
          "title": "Aurora borealis",
          "description": "Northern lights, or aurora borealis, explained"
        }
      },
      {
        "_index": "articles",
        "_id": "2",
        "_score": 1.261565,
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

The `fuzziness`, `prefix_length`, `max_expansions`, `fuzzy_rewrite`, and `fuzzy_transpositions` parameters are supported for the terms that are used to construct term queries, but they do not have an effect on the prefix query constructed from the final term. The `slop` parameter is not supported for `bool_prefix` queries.
{: .note}

## Parameters

The query accepts the following parameters. All parameters except `query` are optional.

Parameter | Data type | Description
:--- | :--- | :---
`query` | String | The query string to use for search. Required.
`auto_generate_synonyms_phrase_query` | Boolean | Specifies whether to create a [match phrase query]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match-phrase/) automatically for multi-term synonyms. For example, if you specify `ba,batting average` as synonyms and search for `ba`, OpenSearch searches for `ba OR "batting average"` (if this option is `true`) or `ba OR (batting AND average)` (if this option is `false`). Default is `true`.
`analyzer` | String | The [analyzer]({{site.url}}{{site.baseurl}}/analyzers/index/) used to tokenize the query string text. Default is the index-time analyzer specified for the `default_field`. If no analyzer is specified for the `default_field`, the `analyzer` is the default analyzer for the index. For more information about `index.query.default_field`, see [Dynamic index settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/index-settings/#dynamic-index-settings).
`boost` | Floating-point | Boosts the clause by the given multiplier. Useful for weighing clauses in compound queries. Values in the [0, 1) range decrease relevance, and values greater than 1 increase relevance. Default is `1`.
`fields` | Array of strings | The list of fields in which to search. If you don't provide the `fields` parameter, `multi_match` query searches the fields specified in the `index.query.default_field` setting, which defaults to `*`. 
`fuzziness` | String | The number of character edits (insert, delete, substitute) that it takes to change one word to another when determining whether a term matched a value. For example, the distance between `wined` and `wind` is 1. Valid values are non-negative integers or `AUTO`. The default, `AUTO`, dynamically selects the edit distance based on the search term's length. You can customize the thresholds using the syntax `AUTO:[low],[high]`, where `low` and `high` define the character length boundaries. When omitted, OpenSearch uses `AUTO:3,6` as the default, which applies the following rules: <br>- Terms containing 0--2 characters: Requires an exact match (0 edits). <br>- Terms containing 3--5 characters: Allows a maximum of 1 edit. <br>- Terms containing 6 or more characters: Allows a maximum of 2 edits. <br>For example, `AUTO:4,7` requires exact matches for terms containing 0--3 characters, allows a maximum of 1 edit for terms containing 4--6 characters, and allows a maximum of 2 edits for terms containing 7 or more characters. Using `AUTO` is recommended for most scenarios. Not supported for `phrase`, `phrase_prefix`, and `cross_fields` queries.
`fuzzy_rewrite` | String | Determines how OpenSearch rewrites the query. Valid values are `constant_score`, `scoring_boolean`, `constant_score_boolean`, `top_terms_N`, `top_terms_boost_N`, and `top_terms_blended_freqs_N`. If the `fuzziness` parameter is not `0`, the query uses a `fuzzy_rewrite` method of `top_terms_blended_freqs_${max_expansions}` by default. Default is `constant_score`. 
`fuzzy_transpositions` | Boolean | Setting `fuzzy_transpositions` to `true` (default) adds swaps of adjacent characters to the insert, delete, and substitute operations of the `fuzziness` option. For example, the distance between `wind` and `wnid` is 1 if `fuzzy_transpositions` is true (swap "n" and "i") and 2 if it is false (delete "n", insert "n"). If `fuzzy_transpositions` is false, `rewind` and `wnid` have the same distance (2) from `wind`, despite the more human-centric opinion that `wnid` is an obvious typo. The default is a good choice for most use cases.
`lenient` | Boolean | Setting `lenient` to `true` ignores data type mismatches between the query and the document field. For example, a query string of `"8.2"` could match a field of type `float`. Default is `false`.
`max_expansions` | Positive integer |  The maximum number of terms to which the query can expand. Fuzzy queries “expand to” a number of matching terms that are within the distance specified in `fuzziness`. Then OpenSearch tries to match those terms. Default is `50`.
`minimum_should_match` | Positive or negative integer, positive or negative percentage, combination | If the query string contains multiple search terms and you use the `or` operator, the number of terms that need to match for the document to be considered a match. For example, if `minimum_should_match` is 2, `wind often rising` does not match `The Wind Rises.` If `minimum_should_match` is `1`, it matches. For details, see [Minimum should match]({{site.url}}{{site.baseurl}}/query-dsl/minimum-should-match/).
`operator` | String | If the query string contains multiple search terms, whether all terms need to match (`AND`) or only one term needs to match (`OR`) for a document to be considered a match. Valid values are:<br>- `OR`: The string `to be` is interpreted as `to OR be`<br>- `AND`: The string `to be` is interpreted as `to AND be`<br> Default is `OR`.
`prefix_length` | Non-negative integer | The number of leading characters that are not considered in fuzziness. Default is `0`.
`slop` | `0` (default) or a positive integer | Controls the degree to which words in a query can be misordered and still be considered a match. From the [Lucene documentation](https://lucene.apache.org/core/{{site.lucene_version}}/core/org/apache/lucene/search/PhraseQuery.html#getSlop--): "The number of other words permitted between words in query phrase. For example, to switch the order of two words requires two moves (the first move places the words atop one another), so to permit reorderings of phrases, the slop must be at least two. A value of zero requires an exact match." Supported for `phrase` and `phrase_prefix` query types.
`tie_breaker` | Floating-point | A factor between 0 and 1.0 that is used to give more weight to documents that match multiple query clauses. For more information, see [The `tie_breaker` parameter](#the-tie_breaker-parameter).
`type` | String | The multi-match query type. Valid values are `best_fields`, `most_fields`, `cross_fields`, `phrase`, `phrase_prefix`, `bool_prefix`. Default is `best_fields`.
`zero_terms_query` | String | In some cases, the analyzer removes all terms from a query string. For example, the `stop` analyzer removes all terms from the string `an but this`. In those cases, `zero_terms_query` specifies whether to match no documents (`none`) or all documents (`all`). Valid values are `none` and `all`. Default is `none`.

### Parameter support by type

Not every parameter applies to every query type. OpenSearch rejects the following combinations with a `400` error.

Parameter | Query types | Error
:--- | :--- | :---
`fuzziness` | `cross_fields`, `phrase`, `phrase_prefix` | `Fuzziness not allowed for type [<type>]`
`slop` | `bool_prefix` | `[slop] not allowed for type [bool_prefix]`

Other parameters that a query type does not use are ignored without an error. For example, the `slop` parameter has no effect on `best_fields` or `most_fields` queries. The following table lists the parameters that have an effect for each query type, in addition to `query`, `fields`, `type`, `analyzer`, `boost`, `lenient`, and `zero_terms_query`, which apply to all types.

Query type | Additional supported parameters
:--- | :---
`best_fields` | `auto_generate_synonyms_phrase_query`, `fuzziness`, `fuzzy_rewrite`, `fuzzy_transpositions`, `max_expansions`, `minimum_should_match`, `operator`, `prefix_length`, `tie_breaker`
`most_fields` | `auto_generate_synonyms_phrase_query`, `fuzziness`, `fuzzy_rewrite`, `fuzzy_transpositions`, `max_expansions`, `minimum_should_match`, `operator`, `prefix_length`, `tie_breaker`
`cross_fields` | `auto_generate_synonyms_phrase_query`, `minimum_should_match`, `operator`, `tie_breaker`
`phrase` | `slop`, `tie_breaker`
`phrase_prefix` | `max_expansions`, `slop`, `tie_breaker`
`bool_prefix` | `auto_generate_synonyms_phrase_query`, `fuzziness`, `fuzzy_rewrite`, `fuzzy_transpositions`, `max_expansions`, `minimum_should_match`, `operator`, `prefix_length`, `tie_breaker`

For the `bool_prefix` type, the fuzzy parameters apply to every term except the last one, which is always matched as a prefix.

### The tie_breaker parameter

The `tie_breaker` parameter determines how the scores of matching fields are combined. For the `cross_fields` type, it also determines how the scores of the fields within each `blended` clause and of the field groups are combined. The `tie_breaker` parameter accepts the following values:

- 0.0 (default for `best_fields`, `cross_fields`, `phrase`, and `phrase_prefix` queries): Take the single best score returned by any field in a group.
- 1.0 (default for `most_fields` and `bool_prefix` queries): Add the scores for all fields in a group.
- A floating-point value in the (0, 1) range: Take the single best score of the best-matching field and add (`tie_breaker` * `_score`) for all other matching fields.