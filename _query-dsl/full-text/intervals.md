---
layout: default
title: Intervals
nav_order: 80
parent: Full-text queries
grand_parent: Query DSL
---

# Intervals query

The intervals query matches documents based on the proximity and order of matching terms. It applies a set of _matching rules_ to terms contained in the specified field. The query generates sequences of minimal intervals that span terms in the text. You can combine the intervals and filter them by parent sources.

Consider an index containing the following documents:

```json
PUT testindex/_doc/1 
{
  "title": "key-value pairs are efficiently stored in a hash table"
}
```
{% include copy-curl.html %}

```json
PUT /testindex/_doc/2
{
  "title": "store key-value pairs in a hash map"
}
```
{% include copy-curl.html %}

For example, the following query searches for documents containing the phrase `key-value pairs` (with no gap separating the terms) followed by either `hash table` or `hash map`:

```json
GET /testindex/_search
{
  "query": {
    "intervals": {
      "title": {
        "all_of": {
          "ordered": true,
          "intervals": [
            {
              "match": {
                "query": "key-value pairs",
                "max_gaps": 0,
                "ordered": true
              }
            },
            {
              "any_of": {
                "intervals": [
                  {
                    "match": {
                      "query": "hash table"
                    }
                  },
                  {
                    "match": {
                      "query": "hash map"
                    }
                  }
                ]
              }
            }
          ]
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The query returns both documents:

<details closed markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took": 1011,
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
    "max_score": 0.25,
    "hits": [
      {
        "_index": "testindex",
        "_id": "2",
        "_score": 0.25,
        "_source": {
          "title": "store key-value pairs in a hash map"
        }
      },
      {
        "_index": "testindex",
        "_id": "1",
        "_score": 0.14285713,
        "_source": {
          "title": "key-value pairs are efficiently stored in a hash table"
        }
      }
    ]
  }
}
```
</details>

## Parameters

The query accepts the name of the field (`<field>`) as a top-level parameter:

```json
GET _search
{
  "query": {
    "intervals": {
      "<field>": {
        ... 
      }
    }
  }
}
```
{% include copy-curl.html %}

The `<field>` accepts the following rule objects that are used to match documents based on terms, order, and proximity.

Rule | Description
:--- | :---
[`match`](#the-match-rule) | Matches analyzed text.
[`prefix`](#the-prefix-rule) | Matches terms that start with a specified set of characters.
[`wildcard`](#the-wildcard-rule) | Matches terms using a wildcard pattern.
[`fuzzy`](#the-fuzzy-rule) | Matches terms that are similar to the provided term within a specified edit distance. 
[`all_of`](#the-all_of-rule) | Combines multiple rules using a conjunction (`AND`).
[`any_of`](#the-any_of-rule) | Combines multiple rules using a disjunction (`OR`).

## The `match` rule

The `match` rule matches analyzed text. The following table lists all parameters the `match` rule supports.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :---
`query` | Required | String | Text for which to search. 
`analyzer` | Optional | String | The [analyzer]({{site.url}}{{site.baseurl}}/analyzers/index/) used to analyze the `query` text. Default is the analyzer specified for the `<field>`.
[`filter`](#the-filter-rule) | Optional | Interval filter rule object |  A rule used to filter returned intervals.  
`max_gaps` | Optional | Integer | The maximum allowed number of positions between the matching terms. Terms further apart than `max_gaps` are not considered matches.  If `max_gaps` is not specified or is set to `-1`, terms are considered matches regardless of their position. If `max_gaps` is set to `0`, matching terms must appear next to each other. Default is `-1`.
`ordered` | Optional | Boolean | Specifies whether matching terms must appear in their specified order. Default is `false`.
`use_field` | Optional | String | Specifies to search this field instead of the top-level <field>. Terms are analyzed using the search analyzer specified for this field. By specifying `use_field`, you can search across multiple fields as if they were all the same field. For example, if you index the same text into stemmed and unstemmed fields, you can search for stemmed tokens that are near unstemmed ones. 

## The `prefix` rule

The `prefix` rule matches terms that start with a specified set of characters (prefix). The prefix can expand to match at most 128 terms. If the prefix matches more than 128 terms, an error is returned. The following table lists all parameters the `prefix` rule supports.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :---
`prefix` | Required | String | The prefix used to match terms. 
`analyzer` | Optional | String | The [analyzer]({{site.url}}{{site.baseurl}}/analyzers/index/) used to normalize the `prefix`. Default is the analyzer specified for the `<field>`.
`use_field` | Optional | String | Specifies to search this field instead of the top-level <field>. The `prefix` is normalized using the search analyzer specified for this field, unless you specify an `analyzer`.

## The `wildcard` rule

The `wildcard` rule matches terms using a wildcard pattern. The wildcard pattern can expand to match at most 128 terms. If the pattern matches more than 128 terms, an error is returned. The following table lists all parameters the `wildcard` rule supports.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :---
`pattern` | Required | String | The wildcard pattern used to match terms. Specify `?` to match any single character or `*` to match zero or more characters.
`analyzer` | Optional | String | The [analyzer]({{site.url}}{{site.baseurl}}/analyzers/index/) used to normalize the `pattern`. Default is the analyzer specified for the `<field>`.
`use_field` | Optional | String | Specifies to search this field instead of the top-level <field>. The `prefix` is normalized using the search analyzer specified for this field, unless you specify an `analyzer`.

Specifying patterns that start with `*` or `?` can hinder search performance because it increases the number of iterations required to match terms.
{: .important}

## The `fuzzy` rule

The `fuzzy` rule matches terms that are similar to the provided term within a specified edit distance. The fuzzy pattern can expand to match at most 128 terms. If the pattern matches more than 128 terms, an error is returned. The following table lists all parameters the `fuzzy` rule supports.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :---
`term` | Required | String | The term to match. 
`analyzer` | Optional | String | The [analyzer]({{site.url}}{{site.baseurl}}/analyzers/index/) used to normalize the `term`. Default is the analyzer specified for the `<field>`.
`fuzziness` | Optional | String | The number of character edits (insert, delete, substitute) that it takes to change one word to another when determining whether a term matched a value. For example, the distance between `wined` and `wind` is 1. Valid values are non-negative integers or `AUTO`. The default, `AUTO`, chooses a value based on the length of each term and is a good choice for most use cases.
`transpositions` | Optional | Boolean | Setting `transpositions` to `true` (default) adds swaps of adjacent characters to the insert, delete, and substitute operations of the `fuzziness` option. For example, the distance between `wind` and `wnid` is 1 if `transpositions` is true (swap "n" and "i") and 2 if it is false (delete "n", insert "n"). If `transpositions` is `false`, `rewind` and `wnid` have the same distance (2) from `wind`, despite the more human-centric opinion that `wnid` is an obvious typo. The default is a good choice for most use cases.
`prefix_length`| Optional | Integer | The number of beginning characters left unchanged for fuzzy matching. Default is 0. 
`use_field` | Optional | String | Specifies to search this field instead of the top-level <field>. The `term` is normalized using the search analyzer specified for this field, unless you specify an `analyzer`.

## The `all_of` rule

The `all_of` rule combines multiple rules using a conjunction (`AND`). The following table lists all parameters the `all_of` rule supports.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :---
`intervals` | Required | Array of rule objects | An array of rules to combine. A document must match all rules in order to be returned in the results. 
[`filter`](#the-filter-rule) | Optional | Interval filter rule object | A rule used to filter returned intervals. 
`max_gaps` | Optional | Integer | The maximum allowed number of positions between the matching terms. Terms further apart than `max_gaps` are not considered matches.  If `max_gaps` is not specified or is set to `-1`, terms are considered matches regardless of their position. If `max_gaps` is set to `0`, matching terms must appear next to each other. Default is `-1`.
`ordered` | Optional | Boolean | If `true`, intervals generated by the rules should appear in the specified order. Default is `false`. 

## The `any_of` rule

The `any_of` rule combines multiple rules using a disjunction (`OR`). The following table lists all parameters the `any_of` rule supports.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :---
`intervals` | Required | Array of rule objects | An array of rules to combine. A document must match at least one rule in order to be returned in the results. 
[`filter`](#the-filter-rule) | Optional | Interval filter rule object | A rule used to filter returned intervals. 

## The `filter` rule

The `filter` rule is used to restrict the results. The following table lists all parameters the `filter` rule supports.

Parameter | Required/Optional | Data type | Description
:--- | :--- | :--- | :---
`after` | Optional | Query object | A query used to return intervals that follow an interval specified in the filter rule. 
`before` | Optional | Query object |  A query used to return intervals that are before an interval specified in the filter rule. 
`contained_by` | Optional | Query object |  A query used to return intervals contained by an interval specified in the filter rule. 
`containing` | Optional | Query object |  A query used to return intervals that contain an interval specified in the filter rule. 
`not_contained_by` | Optional | Query object |  A query used to return intervals that are not contained by an interval specified in the filter rule. 
`not_containing` | Optional | Query object |  A query used to return intervals that do not contain an interval specified in the filter rule. 
`not_overlapping` | Optional | Query object |  A query used to return intervals that do not overlap with an interval specified in the filter rule. 
`overlapping` | Optional | Query object |  A query used to return intervals that overlap with an interval specified in the filter rule. 
`script` | Optional | Script object |  A script used to match documents. This script must return `true` or `false`. 

#### Example: Filters

The following query searches for documents containing the words `pairs` and `hash` that are within five positions of each other and don't contain the word `efficiently` between them:

```json
POST /testindex/_search
{
  "query": {
    "intervals" : {
      "title" : {
        "match" : {
          "query" : "pairs hash",
          "max_gaps" : 5,
          "filter" : {
            "not_containing" : {
              "match" : {
                "query" : "efficiently"
              }
            }
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains only document 2:

<details closed markdown="block">
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
      "value": 1,
      "relation": "eq"
    },
    "max_score": 0.25,
    "hits": [
      {
        "_index": "testindex",
        "_id": "2",
        "_score": 0.25,
        "_source": {
          "title": "store key-value pairs in a hash map"
        }
      }
    ]
  }
}
```
</details>

#### Example: Script filters

Alternatively, you can write your own script filter to include with the `intervals` query using the following variables:

- `interval.start`: The position (term number) where the interval starts.
- `interval.end`: The position (term number) where the interval ends.
- `interval.gap`: The number of words between the terms. 

For example, the following query searches for the words `map` and `hash` that are next to each other within the specified interval. Terms are numbered starting with 0, so in the text `store key-value pairs in a hash map`, `store` is at position 0, `key`is at position `1`, and so on. The specified interval should start after `a` and end before the end of string:

```json
POST /testindex/_search
{
  "query": {
    "intervals" : {
      "title" : {
        "match" : {
          "query" : "map hash",
          "filter" : {
            "script" : {
              "source" : "interval.start > 5 && interval.end < 8 && interval.gaps == 0"
            }
          }
        }
      }
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
    "max_score": 0.5,
    "hits": [
      {
        "_index": "testindex",
        "_id": "2",
        "_score": 0.5,
        "_source": {
          "title": "store key-value pairs in a hash map"
        }
      }
    ]
  }
}
```
</details>

## Interval minimization

To ensure that queries run in linear time, the `intervals` query minimizes the intervals. For example, consider a document containing the text `a b c d c`. You can use the following query to search for `d` that is contained by `a` and `c`:

```json
POST /testindex/_search
{
  "query": {
    "intervals" : {
      "my_text" : {
        "match" : {
          "query" : "d",
          "filter" : {
            "contained_by" : {
              "match" : {
                "query" : "a c"
              }
            }
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The query returns no results because it matches the first two terms `a c` and finds no `d` between these terms.
