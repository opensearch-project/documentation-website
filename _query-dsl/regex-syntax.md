---
layout: default
title: Regular expression syntax
nav_order: 100
canonical_url: https://docs.opensearch.org/latest/query-dsl/regex-syntax/
---

# Regular expression syntax

A [regular expression](https://en.wikipedia.org/wiki/Regular_expression) (regex) is a way to define search patterns using special symbols and operators. These patterns let you match sequences of characters in strings.

In OpenSearch, you can use regular expressions in the following query types:

* [`regexp`]({{site.url}}{{site.baseurl}}/query-dsl/term/regexp/)
* [`query_string`]({{site.url}}{{site.baseurl}}/query-dsl/full-text/query-string/)

OpenSearch uses the [Apache Lucene](https://lucene.apache.org/core/) regex engine, which has its own syntax and limitations. It does **not** use [Perl Compatible Regular Expressions (PCRE)](https://en.wikipedia.org/wiki/Perl_Compatible_Regular_Expressions), so some familiar regex features might behave differently or be unsupported.
{: .note}

## Choosing between regexp and query_string queries

Both `regexp` and `query_string` queries support regular expressions, but they behave differently and serve different use cases.

| Feature                   | `regexp` query                                     | `query_string` query                                |
| ------------------------- | -------------------------------------------------- | --------------------------------------------------- |
| Pattern matching   | Regex pattern must match the entire field value            | Regex pattern can match any part of the field                  |
| `flags` support           | `flags` enables optional regex operators                 | `flags` not supported                        |
| Query type                   | Term-level query (not scored)       | Full-text query (scored and parsed)           |
| Best use case             | Strict pattern matching on keyword or exact fields | Search within analyzed fields using a flexible query string that supports regex patterns       |
| Complex query composition | Limited to regex patterns                         | Supports `AND`, `OR`, wildcards, fields, boosts, and other features. See [Query string query]({{site.url}}{{site.baseurl}}/query-dsl/full-text/query-string/). |


## Reserved characters

Lucene's regex engine supports all Unicode characters. However, the following characters are treated as special operators:

```
. ? + * | { } [ ] ( ) " \
```

Depending on the enabled `flags` that specify [optional operators](#optional-operators), the following characters may also be reserved:

```
@ & ~ < >
```

To match these characters literally, either escape them with a backslash (`\`) or wrap the entire string in double quotation marks:

- `\&`: Matches a literal `&`
- `\\`: Matches a literal backslash (`\`)
- `"hello@world"`: Matches the full string `hello@world`


## Standard regex operators

Lucene supports a core set of regex operators:

- `.` – Matches any single character. **Example**: `f.n` matches `f` followed by any character and then `n` (for example, `fan` or `fin`).

- `?` – Matches zero or one of the preceding characters. **Example**: `colou?r` matches `color` and `colour`.

- `+` – Matches one or more of the preceding characters. **Example**: `go+` matches `g` followed by one or more `o`s (`go`, `goo`, `gooo`, and so on).

- `*` – Matches zero or more of the preceding characters. **Example**: `lo*se` matches `l` followed by zero or more `o`s and then `se` (`lse`, `lose`, `loose`, `loooose`, and so on).

- `{min,max}` – Matches a specific range of repetitions. If `max` is omitted, there is no upper limit on the number of characters matched. **Example**: `x{3}` matches exactly 3 `x`s (`xxx`); `x{2,4}` matches from 2 to 4 `x`s (`xx`, `xxx`, or `xxxx`); `x{3,}` matches 3 or more `x`s (`xxx`, `xxxx`, `xxxxx`, and so on).

- `|` – Acts as a logical `OR`. **Example**: `apple|orange` matches `apple` or `orange`.

- `( )` – Groups characters into a subpattern. **Example**: `ab(cd)?` matches `ab` and `abcd`.

- `[ ]` – Matches one character from a set or range. **Example**: `[aeiou]` matches any vowel.
    - `-` – When provided within the brackets, indicates a range unless escaped or is the first character within the brackets. **Example**: `[a-z]` matches any lowercase letter; `[-az]` matches `-`, `a`, or `z`; `[a\\-z]` matches `a`, `-`, or `z`.
    - `^` – When provided within the brackets, acts a logical `NOT`, negating a range of characters or any character in the set. **Example**: `[^az]` matches any character except `a` or `z`; `[^a-z]` matches any character except lowercase letters; `[^-az]` matches any character except `-`, `a`, and `z`; `[^a\\-z]` matches any character except `a`, `-`, and `z`.


## Optional operators

You can enable additional regex operators using the `flags` parameter. Separate multiple flags with `|`.

The following are the available flags:

- `ALL` (default) – Enables all optional operators.

{% comment %}
<!-- COMPLEMENT is deprecated and doesn't work. Leaving it here until https://github.com/opensearch-project/OpenSearch/issues/18397 is resolved. -->
{% endcomment %}

- `COMPLEMENT` – Enables `~`, which negates the shortest following expression. **Example**: `d~ef` matches `dgf`, `dxf`, but not `def`.

- `INTERSECTION` – Enables `&` as an `AND` logical operator. **Example**: `ab.+&.+cd` matches strings containing `ab` at the beginning and `cd` at the end.

- `INTERVAL` – Enables `<min-max>` syntax to match numeric ranges. **Example**: `id<10-12>` matches `id10`, `id11`, and `id12`.

- `ANYSTRING` – Enables `@` to match any string. You can combine this with `~` and `&` for exclusions. **Example**: `@&.*error.*&.*[0-9]{3}.*` matches strings containing both the word "error" and a sequence of three digits.

## Unsupported features

Lucene's engine does not support the following commonly used regex anchors:

- `^` – Start of line
- `$` – End of line

Instead, your pattern must match the entire string to produce a match.

## Example

To try regular expressions, index the following documents into the `logs` index:

```json
PUT /logs/_doc/1
{
  "message": "error404"
}
```
{% include copy-curl.html %}

```json
PUT /logs/_doc/2
{
  "message": "error500"
}
```
{% include copy-curl.html %}

```json
PUT /logs/_doc/3
{
  "message": "error1a"
}
```
{% include copy-curl.html %}

### Example: Basic query containing regular expressions

The following `regexp` query returns documents in which the entire value of the `message` field matches the pattern "error" followed by one or more digits. A value does not match if it only contains the pattern as a substring:

```json
GET /logs/_search
{
  "query": {
    "regexp": {
      "message": {
        "value": "error[0-9]+"
      }
    }
  }
}
```
{% include copy-curl.html %}

This query matches `error404` and `error500`:


```json
{
  "took": 28,
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
    "max_score": 1,
    "hits": [
      {
        "_index": "logs",
        "_id": "1",
        "_score": 1,
        "_source": {
          "message": "error404"
        }
      },
      {
        "_index": "logs",
        "_id": "2",
        "_score": 1,
        "_source": {
          "message": "error500"
        }
      }
    ]
  }
}
```

### Example: Using optional operators

The following query matches documents in which the `message` field exactly matches a string that starts with "error" followed by a number from 400 to 500, inclusive. The `INTERVAL` flag enables the use of `<min-max>` syntax for numeric ranges:

```json
GET /logs/_search
{
  "query": {
    "regexp": {
      "message": {
        "value": "error<400-500>",
        "flags": "INTERVAL"
      }
    }
  }
}
```
{% include copy-curl.html %}

This query matches `error404` and `error500`:

```json
{
  "took": 22,
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
    "max_score": 1,
    "hits": [
      {
        "_index": "logs",
        "_id": "1",
        "_score": 1,
        "_source": {
          "message": "error404"
        }
      },
      {
        "_index": "logs",
        "_id": "2",
        "_score": 1,
        "_source": {
          "message": "error500"
        }
      }
    ]
  }
}
```

### Example: Using ANYSTRING

When the `ANYSTRING` flag is enabled, the `@` operator matches an entire string. This is useful when combined with intersection (`&`) because it allows you to construct queries that match full strings under specific conditions.

The following query matches messages that contain both the word "error" and a sequence of three digits. Use `ANYSTRING` to assert that the entire field must match the intersection of both patterns:

```json
GET /logs/_search
{
  "query": {
    "regexp": {
      "message.keyword": {
        "value": "@&.*error.*&.*[0-9]{3}.*",
        "flags": "ANYSTRING|INTERSECTION"
      }
    }
  }
}
```
{% include copy-curl.html %}

This query matches `error404` and `error500`:

```json
{
  "took": 20,
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
    "max_score": 1,
    "hits": [
      {
        "_index": "logs",
        "_id": "1",
        "_score": 1,
        "_source": {
          "message": "error404"
        }
      },
      {
        "_index": "logs",
        "_id": "2",
        "_score": 1,
        "_source": {
          "message": "error500"
        }
      }
    ]
  }
}
```

Note that this query will also match `xerror500`, `error500x`, and `errorxx500`.