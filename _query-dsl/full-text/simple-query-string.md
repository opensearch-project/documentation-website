---
layout: default
title: Simple query string
parent: Full-text queries
grand_parent: Query DSL
nav_order: 70
---

# Simple query string query

Use the `simple_query_string` type to specify multiple arguments delineated by regular expressions directly in the query string. Simple query string has a less strict syntax than query string because it discards any invalid portions of the string and does not return errors for invalid syntax.

This query uses a [simple syntax](#simple-query-string-syntax) to parse the query string based on special operators and split the string into terms. After parsing, the query analyzes each term independently and then returns matching documents.

The following query performs fuzzy search on the `title` field:

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
{% include copy-curl.html %}

## Simple query string syntax

A query string consists of _terms_ and _operators_. A term is a single word (for example, in the query `wind rises`, the terms are `wind` and `rises`). If several terms are surrounded by quotation marks, they are treated as one phrase where words are marched in the order they appear (for example, `"wind rises"`). Operators such as `+`, `|`, and `-` specify the Boolean logic used to interpret text in the query string. 

## Operators

Simple query string syntax supports the following operators.

Operator | Description
:--- | :---
`+` | Acts as the `AND` operator.
`|` | Acts as the `OR` operator.
`*` | When used at the end of a term, signifies a prefix query.
`"` | Wraps several terms into a phrase (for example, `"wind rises"`).
`(`, `)` | Wrap a clause for precedence (for example, `wind + (rises | rising)`).
`~n` | When used after a term (for example, `wnid~3`), sets `fuzziness`. When used after a phrase, sets `slop`. 
`-` | Negates the term.

All of the preceding operators are reserved characters. To refer to them as raw characters and not operators, escape any of them with a backslash. When sending a JSON request, use `\\` to escape reserved characters (because the backslash character is itself reserved, you must escape the backslash with another backslash).

## Default operator

The default operator is `OR` (unless you set the `default_operator` to `AND`). The default operator dictates the overall query behavior. For example, consider an index containing the following documents:

```json
PUT /customers/_doc/1
{
  "first_name":"Amber",
  "last_name":"Duke",
  "address":"880 Holmes Lane"
}
```
{% include copy-curl.html %}

```json
PUT /customers/_doc/2
{
  "first_name":"Hattie",
  "last_name":"Bond",
  "address":"671 Bristol Street"
}
```
{% include copy-curl.html %}

```json
PUT /customers/_doc/3
{
  "first_name":"Nanette",
  "last_name":"Bates",
  "address":"789 Madison St"
}
```
{% include copy-curl.html %}

```json
PUT /customers/_doc/4
{
  "first_name":"Dale",
  "last_name":"Amber",
  "address":"467 Hutchinson Court"
}
```
{% include copy-curl.html %}

The following query attempts to find documents, for which the address contains the words `street` or `st` and does not contain the word `madison`:

```json
GET /customers/_search
{
  "query": {
    "simple_query_string": {
      "fields": [ "address" ],
      "query": "street st -madison"
    }
  }
}

```
{% include copy-curl.html %}

However, the results include not only the expected document, but all four documents:

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
      "value": 4,
      "relation": "eq"
    },
    "max_score": 2.2039728,
    "hits": [
      {
        "_index": "customers",
        "_id": "2",
        "_score": 2.2039728,
        "_source": {
          "first_name": "Hattie",
          "last_name": "Bond",
          "address": "671 Bristol Street"
        }
      },
      {
        "_index": "customers",
        "_id": "3",
        "_score": 1.2039728,
        "_source": {
          "first_name": "Nanette",
          "last_name": "Bates",
          "address": "789 Madison St"
        }
      },
      {
        "_index": "customers",
        "_id": "1",
        "_score": 1,
        "_source": {
          "first_name": "Amber",
          "last_name": "Duke",
          "address": "880 Holmes Lane"
        }
      },
      {
        "_index": "customers",
        "_id": "4",
        "_score": 1,
        "_source": {
          "first_name": "Dale",
          "last_name": "Amber",
          "address": "467 Hutchinson Court"
        }
      }
    ]
  }
}
```
</details>

Because the default operator is `OR`, this query includes documents that contain the words `street` or `st` (documents 2 and 3) and documents that do not contain the word `madison` (documents 1 and 4).

To express the query intent correctly, precede `-madison` with `+`:

```json
GET /customers/_search
{
  "query": {
    "simple_query_string": {
      "fields": [ "address" ],
      "query": "street st +-madison"
    }
  }
}
```
{% include copy-curl.html %}

Alternatively, specify `AND` as the default operator and use disjunction for the words `street` and `st`:

```json
GET /customers/_search
{
  "query": {
    "simple_query_string": {
      "fields": [ "address" ],
      "query": "st|street -madison",
      "default_operator": "AND"
    }
  }
}
```
{% include copy-curl.html %}

The preceding query returns document 2:

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
    "max_score": 2.2039728,
    "hits": [
      {
        "_index": "customers",
        "_id": "2",
        "_score": 2.2039728,
        "_source": {
          "first_name": "Hattie",
          "last_name": "Bond",
          "address": "671 Bristol Street"
        }
      }
    ]
  }
}
```
</details>

## Limit operators

To limit the supported operators for the simple query string parser, include the operators that you want to support, separated by `|`, in the `flags` parameter. For example, the following query enables only `OR`, `AND`, and `FUZZY` operators:

```json
GET /customers/_search
{
  "query": {
    "simple_query_string": {
      "fields": [ "address" ],
      "query": "bristol | madison +stre~2",
      "flags": "OR|AND|FUZZY"
    }
  }
}
```
{% include copy-curl.html %}

The following table lists all available operator flags.

Flag | Description
:--- | :--- 
`ALL` (default) | Enables all operators. 
`AND` | Enables the `+` (`AND`) operator. 
`ESCAPE` | Enables the `\` as an escape character. 
`FUZZY` | Enables the `~n` operator after a word, where `n` is an integer denoting the allowed edit distance for matching.
`NEAR` | Enables the `~n` operator after a phrase, where `n` is the maximum number of positions allowed between matching tokens. Same as `SLOP`. 
`NONE` | Disables all operators. 
`NOT` | Enables the `-` (`NOT`) operator. 
`OR` | Enables the `|` (`OR`) operator. 
`PHRASE` | Enables the `"` (quotation marks) for phrase search. 
`PRECEDENCE` | Enables the `(` and `)` (parentheses) operators for operator precedence. 
`PREFIX` | Enables the `*` (prefix) operator. 
`SLOP` | Enables the `~n` operator after a phrase, where `n` is the maximum number of positions allowed between matching tokens. Same as `NEAR`. 
`WHITESPACE` | Enables white space characters as characters on which the text is split. 

## Wildcard expressions

You can specify wildcard expressions using the `*` special character, which replaces zero or more characters. For example, the following query searches in all fields that end with `name`:

```json
GET /customers/_search
{
  "query": {
    "simple_query_string" : {
      "query":    "Amber Bond",
      "fields": [ "*name" ] 
    }
  }
}
```
{% include copy-curl.html %}

## Boosting

Use the caret (`^`) boost operator to boost the relevance score of a field by a multiplier. Values in the [0, 1) range decrease relevance, and values greater than 1 increase relevance. Default is `1`. 

For example, the following query searches the `first_name` and `last_name` fields and boosts matches from the `first_name` field by a factor of 2:

```json
GET /customers/_search
{
  "query": {
    "simple_query_string" : {
      "query":    "Amber",
      "fields": [ "first_name^2", "last_name" ] 
    }
  }
}
```
{% include copy-curl.html %}

## Multi-position tokens

For multi-position tokens, simple query string creates a [match phrase query]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match-phrase/). Thus, if you specify `ml, machine learning` as synonyms and search for `ml`, OpenSearch searches for `ml OR "machine learning"`. 

Alternatively, you can match multi-position tokens using conjunctions. If you set `auto_generate_synonyms_phrase_query` to `false`, OpenSearch searches for `ml OR (machine AND learning)`. 

For example, the following query searches for the text `ml models` and specifies not to auto-generate a match phrase query for each synonym:

```json
GET /testindex/_search
{
  "query": {
    "simple_query_string": {
      "fields": ["title"],
      "query": "ml models",
      "auto_generate_synonyms_phrase_query": false
    }
  }
}
```
{% include copy-curl.html %}

For this query, OpenSearch creates the following Boolean query: `(ml OR (machine AND learning)) models`.

## Parameters

The following table lists the top-level parameters that `simple_query_string` query supports. All parameters except `query` are optional.

Parameter | Data type | Description
:--- | :--- | :---
`query`| String | The text that may contain expressions in the [simple query string syntax](#simple-query-string-syntax) to use for search. Required.
`analyze_wildcard` | Boolean | Specifies whether OpenSearch should attempt to analyze wildcard terms. Default is `false`.
`analyzer` | String | The analyzer used to tokenize the query string text. Default is the index-time analyzer specified for the `default_field`. If no analyzer is specified for the `default_field`, the `analyzer` is the default analyzer for the index.
`auto_generate_synonyms_phrase_query` | Boolean | Specifies whether to create [match_phrase queries]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match/) automatically for multi-term synonyms. Default is `true`.
`default_operator`| String | If the query string contains multiple search terms, whether all terms need to match (`AND`) or only one term needs to match (`OR`) for a document to be considered a match. Valid values are:<br>- `OR`: The string `to be` is interpreted as `to OR be`<br>- `AND`: The string `to be` is interpreted as `to AND be`<br> Default is `OR`.
`fields` | String array | The list of fields to search (for example, `"fields": ["title^4", "description"]`). Supports wildcards. If unspecified, defaults to the `index.query. Default_field` setting, which defaults to `["*"]`. The maximum number of fields that can be searched at the same time is defined by `indices.query.bool.max_clause_count`, which is 1,024 by default.
`flags` | String | A `|`-delimited string of [flags]({{site.baseurl}}/query-dsl/full-text/simple-query-string/) to enable (for example, `AND|OR|NOT`). Default is `ALL`. You can explicitly set the value for `default_field`. For example, to return all titles, set it to `"default_field": "title"`.
`fuzzy_max_expansions` | Positive integer | The maximum number of terms to which the query can expand. Fuzzy queries “expand to” a number of matching terms that are within the distance specified in `fuzziness`. Then OpenSearch tries to match those terms. Default is `50`.
`fuzzy_transpositions` | Boolean | Setting `fuzzy_transpositions` to `true` (default) adds swaps of adjacent characters to the insert, delete, and substitute operations of the `fuzziness` option. For example, the distance between `wind` and `wnid` is 1 if `fuzzy_transpositions` is true (swap "n" and "i") and 2 if it is false (delete "n", insert "n"). If `fuzzy_transpositions` is false, `rewind` and `wnid` have the same distance (2) from `wind`, despite the more human-centric opinion that `wnid` is an obvious typo. The default is a good choice for most use cases.
`fuzzy_prefix_length`| Integer | The number of beginning characters left unchanged for fuzzy matching. Default is 0. 
`lenient` | Boolean | Setting `lenient` to `true` ignores data type mismatches between the query and the document field. For example, a query string of `"8.2"` could match a field of type `float`. Default is `false`.
`minimum_should_match` | Positive or negative integer, positive or negative percentage, combination | If the query string contains multiple search terms and you use the `or` operator, the number of terms that need to match for the document to be considered a match. For example, if `minimum_should_match` is 2, `wind often rising` does not match `The Wind Rises.` If `minimum_should_match` is `1`, it matches. For details, see [Minimum should match]({{site.url}}{{site.baseurl}}/query-dsl/minimum-should-match/).
`quote_field_suffix` | String | This option supports searching for exact matches (surrounded with quotation marks) using a different analysis method than non-exact matches use. For example, if `quote_field_suffix` is `.exact` and you search for `\"lightly\"` in the `title` field, OpenSearch searches for the word `lightly` in the `title.exact` field. This second field might use a different type (for example, `keyword` rather than `text`) or a different analyzer.