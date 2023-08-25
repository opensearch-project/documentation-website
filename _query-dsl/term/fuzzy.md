---
layout: default
title: Fuzzy
parent: Term-level queries
grand_parent: Query DSL
nav_order: 20
---

# Fuzzy query

A fuzzy query searches for documents containing terms that are similar to the search term within the maximum allowed [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance). The Levenshtein distance measures the number of one-character changes needed to change one term to another term. These changes include:

- Replacements: **c**at to **b**at
- Insertions: cat to cat**s**
- Deletions: **c**at to at
- Transpositions: **ca**t to **ac**t

A fuzzy query creates a list of all possible expansions of the search term that fall within the Levenshtein distance. You can specify the maximum number of such expansions in the `max_expansions` field. Then it searches for documents that match any of the expansions.

The following example query searches for the speaker `HALET` (misspelled `HAMLET`). The maximum edit distance is not specified, so the default `AUTO` edit distance is used:

```json
GET shakespeare/_search
{
  "query": {
    "fuzzy": {
      "speaker": {
        "value": "HALET"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains all documents in which `HAMLET` is the speaker.

The following example query searches for the word `HALET` with advanced parameters:

```json
GET shakespeare/_search
{
  "query": {
    "fuzzy": {
      "speaker": {
        "value": "HALET",
        "fuzziness": "2",
        "max_expansions": 40,
        "prefix_length": 0,
        "transpositions": true,
        "rewrite": "constant_score"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Parameters

The query accepts the name of the field (`<field>`) as a top-level parameter:

```json
GET _search
{
  "query": {
    "fuzzy": {
      "<field>": {
        "value": "sample",
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
`value` | String | The term to search for in the field specified in `<field>`.
`fuzziness` | `AUTO`, `0`, or a positive integer | The number of character edits (insert, delete, substitute) needed to change one word to another when determining whether a term matched a value. For example, the distance between `wined` and `wind` is 1. The default, `AUTO`, chooses a value based on the length of each term and is a good choice for most use cases.
`max_expansions` | Positive integer |  The maximum number of terms to which the query can expand. Fuzzy queries “expand to” a number of matching terms that are within the distance specified in `fuzziness`. Then OpenSearch tries to match those terms. Default is `50`.
`prefix_length` | Non-negative integer | The number of leading characters that are not considered in fuzziness. Default is `0`.
`rewrite` | String | Determines how OpenSearch rewrites and scores multi-term queries. Valid values are `constant_score`, `scoring_boolean`, `constant_score_boolean`, `top_terms_N`, `top_terms_boost_N`, and `top_terms_blended_freqs_N`. Default is `constant_score`.
`transpositions` | Boolean | Specifies whether to allow transpositions of two adjacent characters (`ab` to `ba`) as edits. Default is `true`. 

Specifying a large value in `max_expansions` can lead to poor performance, especially if `prefix_length` is set to `0`, because of the large number of variations of the word that OpenSearch tries to match.
{: .warning}

If [`search.allow_expensive_queries`]({{site.url}}{{site.baseurl}}/query-dsl/index/#expensive-queries) is set to `false`, fuzzy queries are not run.
{: .important}