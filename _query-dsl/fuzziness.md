---
layout: default
title: Fuzziness
nav_order: 82
---

# Fuzziness

The `fuzziness` parameter lets a query match terms that differ slightly from the search term, so searches still return results when the user makes a typo. For example, with fuzziness enabled, a search for `lantren` matches documents containing `lantern`.

Fuzziness is measured in edits. An edit is one of the following single-character changes:

- Inserting a character, for example, `tnt` to `tent`
- Deleting a character, for example, `tennt` to `tent`
- Substituting one character for another, for example, `tant` to `tent`
- Swapping two adjacent characters (a _transposition_), for example, `tnet` to `tent`

The number of edits needed to change one term into another is called the [Damerau–Levenshtein distance](https://en.wikipedia.org/wiki/Damerau–Levenshtein_distance). A term matches if its distance from the search term is no greater than the allowed number of edits.

The following queries and features support `fuzziness`:

- The [`fuzzy`]({{site.url}}{{site.baseurl}}/query-dsl/term/fuzzy/) query, for which fuzziness is enabled by default (`AUTO`)
- The [`match`]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match/), [`multi_match`]({{site.url}}{{site.baseurl}}/query-dsl/full-text/multi-match/), and [`match_bool_prefix`]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match-bool-prefix/) queries, for which fuzziness is disabled unless you specify it
- The `fuzzy` rule of the [`intervals`]({{site.url}}{{site.baseurl}}/query-dsl/full-text/intervals/) query
- The [`query_string`]({{site.url}}{{site.baseurl}}/query-dsl/full-text/query-string/) and [`simple_query_string`]({{site.url}}{{site.baseurl}}/query-dsl/full-text/simple-query-string/) queries, which use the `~` operator, for example, `tnt~` or `tnt~1`
- The [completion]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/completion/) suggester

## Fuzziness values

The following table lists the values that you can specify for `fuzziness`.

Value | Description
:--- | :---
`0`, `1`, or `2` | The maximum number of edits allowed. `0` requires an exact match. OpenSearch supports at most 2 edits: a larger integer is treated as `2`.
`AUTO` | Sets the number of allowed edits based on the length of the search term. Terms of 0--2 characters must match exactly, terms of 3--5 characters allow 1 edit, and terms of 6 or more characters allow 2 edits. Recommended for most searches.
`AUTO:<low>,<high>` | Works like `AUTO` but uses custom length thresholds. Terms shorter than `<low>` characters must match exactly, terms shorter than `<high>` characters allow 1 edit, and longer terms allow 2 edits. For example, `AUTO:4,7` requires an exact match for terms of 0--3 characters, allows 1 edit for terms of 4--6 characters, and allows 2 edits for terms of 7 or more characters. `AUTO` is equivalent to `AUTO:3,6`.

`AUTO` depends on the length of the search term, not on the length of the indexed term. For example, the 5-character search term `lntrn` allows only 1 edit, so it does not match `lantern`, which requires 2 edits. To allow 2 edits for 5-character terms, lower the high threshold, for example, to `AUTO:3,5`.

## Related parameters

The following parameters control how fuzzy matching is applied. Queries that support fuzziness accept some or all of them; parameter names can vary by query.

Parameter | Description
:--- | :---
`fuzzy_transpositions` | Whether a swap of two adjacent characters counts as one edit. If `false`, a transposition counts as two edits, and the distance is the [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance), which does not include transpositions. Default is `true`. In the `fuzzy` query and the `intervals` query, this parameter is named `transpositions`.
`prefix_length` | The number of leading characters that must match exactly. Edits are allowed only after this prefix. For example, with `prefix_length` set to `1`, `xent` does not match `tent`. Increasing `prefix_length` reduces the number of candidate terms and speeds up the query. Default is `0`.
`max_expansions` | The maximum number of candidate terms that the query expands to. Default is `50`. Lower values make the query faster but may skip matching terms. In the `query_string` and `simple_query_string` queries, this parameter is named `fuzzy_max_expansions`.
`fuzzy_rewrite` | The method used to rewrite the expanded query. For more information, see [Rewrite]({{site.url}}{{site.baseurl}}/query-dsl/rewrite-parameter/).

## Example: Matching a misspelled term

Index a document into the `fuzzy-test` index:

```json
PUT /fuzzy-test/_doc/1?refresh=true
{
  "product": "lantern"
}
```
{% include copy-curl.html %}

Search for the misspelled term `lantrn` using `AUTO` fuzziness. Because the term contains 6 characters, `AUTO` allows 2 edits, and `lantrn` is 1 edit (a missing `e`) from `lantern`:

```json
GET /fuzzy-test/_search
{
  "query": {
    "match": {
      "product": {
        "query": "lantrn",
        "fuzziness": "AUTO"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the `lantern` document.

## Example: Matching swapped characters

By default, swapping two adjacent characters counts as one edit. The following request searches for `lantren`, in which `e` and `r` are swapped, and allows only 1 edit:

```json
GET /fuzzy-test/_search
{
  "query": {
    "match": {
      "product": {
        "query": "lantren",
        "fuzziness": 1
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the `lantern` document because the transposition counts as 1 edit:

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
    "max_score": 0.11208393,
    "hits": [
      {
        "_index": "fuzzy-test",
        "_id": "1",
        "_score": 0.11208393,
        "_source": {
          "product": "lantern"
        }
      }
    ]
  }
}
```

If you set `fuzzy_transpositions` to `false` in the same request, the transposition counts as 2 edits, and the query returns no results.

## Example: Allowing more edits for short terms

With `AUTO`, the 5-character search term `lntrn` allows only 1 edit and does not match `lantern`, which requires 2 edits. The following request lowers the high threshold to 5 so that 5-character terms allow 2 edits:

```json
GET /fuzzy-test/_search
{
  "query": {
    "match": {
      "product": {
        "query": "lntrn",
        "fuzziness": "AUTO:3,5"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the `lantern` document.
