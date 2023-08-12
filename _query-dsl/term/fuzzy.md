---
layout: default
title: Fuzzy
parent: Term-level queries
grand_parent: Query DSL
nav_order: 20
---

# Fuzzy query

A fuzzy query searches for documents with terms that are similar to the search term within the maximum allowed [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance). The Levenshtein distance measures the number of one-character changes needed to change one term to another term. These changes include:

- Replacements: **c**at to **b**at
- Insertions: cat to cat**s**
- Deletions: **c**at to at
- Transpositions: **ca**t to **ac**t

A fuzzy query creates a list of all possible expansions of the search term that fall within the Levenshtein distance. You can specify the maximum number of such expansions in the `max_expansions` field. Then is searches for documents that match any of the expansions.

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

The response contains all documents where `HAMLET` is the speaker.

The following example query searches for the word `cat` with advanced parameters:

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