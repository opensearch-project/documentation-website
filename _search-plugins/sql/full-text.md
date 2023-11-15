---
layout: default
title: Full-Text Search
parent: SQL and PPL
nav_order: 11
redirect_from:
  - /search-plugins/sql/sql-full-text/
---

# Full-text search

Use SQL commands for full-text search. The SQL plugin supports a subset of full-text queries available in OpenSearch.

To learn about full-text queries in OpenSearch, see [Full-text queries]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/full-text/index).

## Match

Use the `MATCH` function to search documents that match a `string`, `number`, `date`, or `boolean` value for a given field.

### Syntax

```sql
match(field_expression, query_expression[, option=<option_value>]*)
```

You can specify the following options in any order:

- `analyzer`
- `auto_generate_synonyms_phrase`
- `fuzziness`
- `max_expansions`
- `prefix_length`
- `fuzzy_transpositions`
- `fuzzy_rewrite`
- `lenient`
- `operator`
- `minimum_should_match`
- `zero_terms_query`
- `boost`

Refer to the `match` query [documentation]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match/) for parameter descriptions and supported values.

### Example 1: Search the `message` field for the text "this is a test":

```json
GET my_index/_search
{
  "query": {
    "match": {
      "message": "this is a test"
    }
  }
}
```

*SQL query:*
```sql
SELECT message FROM my_index WHERE match(message, "this is a test")
```
*PPL query:*
```ppl
SOURCE=my_index | WHERE match(message, "this is a test") | FIELDS message
```

### Example 2: Search the `message` field with the `operator` parameter:

```json
GET my_index/_search
{
  "query": {
    "match": {
      "message": {
        "query": "this is a test",
        "operator": "and"
      }
    }
  }
}
```

*SQL query:*
```sql
SELECT message FROM my_index WHERE match(message, "this is a test", operator='and')
```
*PPL query:*
```ppl
SOURCE=my_index | WHERE match(message, "this is a test", operator='and') | FIELDS message
```

### Example 3: Search the `message` field with the `operator` and `zero_terms_query` parameters:

```json
GET my_index/_search
{
  "query": {
    "match": {
      "message": {
        "query": "to be or not to be",
        "operator": "and",
        "zero_terms_query": "all"
      }
    }
  }
}
```

*SQL query:*
```sql
SELECT message FROM my_index WHERE match(message, "this is a test", operator='and', zero_terms_query='all')
```
*PPL query:*
```sql
SOURCE=my_index | WHERE match(message, "this is a test", operator='and', zero_terms_query='all') | FIELDS message
```

## Multi-match

To search for text in multiple fields, use `MULTI_MATCH` function. This function maps to the `multi_match` query used in search engine, to returns the documents that match a provided text, number, date or boolean value with a given field or fields.

### Syntax

The `MULTI_MATCH` function *boosts* certain fields by using **^** character. Boosts are multipliers that weigh matches in one field more heavily than matches in other fields. The syntax supports specifying the fields with double quotes, single quotes, backticks, or without any quotes. Use star ``"*"`` to search all fields. Star symbol should be quoted.

```sql
multi_match([field_expression+], query_expression[, option=<option_value>]*)
```

The weight is optional and is specified after the field name. It could be delimited by the `caret` character -- `^` or by white space. Refer to the following examples:

```sql
multi_match(["Tags" ^ 2, 'Title' 3.4, `Body`, Comments ^ 0.3], ...)
multi_match(["*"], ...)
```

You can specify the following options for `MULTI_MATCH` in any order:

- `analyzer`
- `auto_generate_synonyms_phrase`
- `cutoff_frequency`
- `fuzziness`
- `fuzzy_transpositions`
- `lenient`
- `max_expansions`
- `minimum_should_match`
- `operator`
- `prefix_length`
- `tie_breaker`
- `type`
- `slop`
- `zero_terms_query`
- `boost`

Refer to `multi_match` query [documentation]({{site.baseurl}}/query-dsl/full-text/multi-match/) for parameter description and supported values.

### For example, REST API search for `Dale` in either the `firstname` or `lastname` fields:

```json
GET accounts/_search
{
  "query": {
    "multi_match": {
      "query": "Lane Street",
      "fields": [ "address" ],
    }
  }
}
```
could be called from *SQL* using `multi_match` function
```sql
SELECT firstname, lastname
FROM accounts
WHERE multi_match(['*name'], 'Dale')
```
or `multi_match` *PPL* function
```sql
SOURCE=accounts | WHERE multi_match(['*name'], 'Dale') | fields firstname, lastname
```

| firstname | lastname
:--- | :---
Dale | Adams

## Query string

To split text based on operators, use the `QUERY_STRING` function. The `QUERY_STRING` function supports logical connectives, wildcard, regex, and proximity search.
This function maps to the to the `query_string` query used in search engine, to return the documents that match a provided text, number, date or boolean value with a given field or fields.

### Syntax

The `QUERY_STRING` function has syntax similar to `MATCH_QUERY` and *boosts* certain fields by using **^** character. Boosts are multipliers that weigh matches in one field more heavily than matches in other fields. The syntax supports specifying the fields with double quotes, single quotes, backticks, or without any quotes. Use star ``"*"`` to search all fields. Star symbol should be quoted.

```sql
query_string([field_expression+], query_expression[, option=<option_value>]*)
```

The weight is optional and is specified after the field name. It could be delimited by the `caret` character -- `^` or by white space. Refer to the following examples:

```sql
query_string(["Tags" ^ 2, 'Title' 3.4, `Body`, Comments ^ 0.3], ...)
query_string(["*"], ...)
```

You can specify the following options for `QUERY_STRING` in any order:

- `analyzer`
- `allow_leading_wildcard`
- `analyze_wildcard`
- `auto_generate_synonyms_phrase_query`
- `boost`
- `default_operator`
- `enable_position_increments`
- `fuzziness`
- `fuzzy_rewrite`
- `escape`
- `fuzzy_max_expansions`
- `fuzzy_prefix_length`
- `fuzzy_transpositions`
- `lenient`
- `max_determinized_states`
- `minimum_should_match`
- `quote_analyzer`
- `phrase_slop`
- `quote_field_suffix`
- `rewrite`
- `type`
- `tie_breaker`
- `time_zone`

Refer to the `query_string` query [documentation]({{site.url}}{{site.baseurl}}/query-dsl/full-text/query-string/) for parameter descriptions and supported values.

### Example of using `query_string` in SQL and PPL queries:

The REST API search request

```json
GET accounts/_search
{
  "query": {
    "query_string": {
      "query": "Lane Street",
      "fields": [ "address" ],
    }
  }
}
```

could be called from *SQL*

```sql
SELECT account_number, address
FROM accounts
WHERE query_string(['address'], 'Lane Street', default_operator='OR')
```

or from *PPL*

```sql
SOURCE=accounts | WHERE query_string(['address'], 'Lane Street', default_operator='OR') | fields account_number, address
```

| account_number | address
:--- | :---
1 | 880 Holmes Lane
6 | 671 Bristol Street
13 | 789 Madison Street

## Match phrase

To search for exact phrases, use `MATCHPHRASE` or `MATCH_PHRASE` functions.

### Syntax

```sql
matchphrasequery(field_expression, query_expression)
matchphrase(field_expression, query_expression[, option=<option_value>]*)
match_phrase(field_expression, query_expression[, option=<option_value>]*)
```

The `MATCHPHRASE`/`MATCH_PHRASE` functions let you specify the following options in any order:

- `analyzer`
- `slop`
- `zero_terms_query`
- `boost`

Refer to the `match_phrase` query [documentation]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match-phrase/) for parameter descriptions and supported values.

### Example of using `match_phrase` in SQL and PPL queries:

The REST API search request
```json
GET accounts/_search
{
  "query": {
    "match_phrase": {
      "address": {
        "query": "880 Holmes Lane"
      }
    }
  }
}
```
could be called from *SQL*
```sql
SELECT account_number, address
FROM accounts
WHERE match_phrase(address, '880 Holmes Lane')
```
or *PPL*
```sql
SOURCE=accounts | WHERE match_phrase(address, '880 Holmes Lane') | FIELDS account_number, address
```

| account_number | address
:--- | :---
1 | 880 Holmes Lane


## Simple query string

The `simple_query_string` function maps to the `simple_query_string` query in OpenSearch. It returns the documents that match a provided text, number, date or boolean value with a given field or fields.
The **^** lets you *boost* certain fields. Boosts are multipliers that weigh matches in one field more heavily than matches in other fields.

### Syntax

The syntax supports specifying the fields with double quotes, single quotes, backticks, or without any quotes. Use star ``"*"`` to search all fields. Star symbol should be quoted.

```sql
simple_query_string([field_expression+], query_expression[, option=<option_value>]*)
```

The weight is optional and is specified after the field name. It could be delimited by the `caret` character -- `^` or by white space. Refer to the following examples:

```sql
simple_query_string(["Tags" ^ 2, 'Title' 3.4, `Body`, Comments ^ 0.3], ...)
simple_query_string(["*"], ...)
```

You can specify the following options for `SIMPLE_QUERY_STRING` in any order:

- `analyze_wildcard`
- `analyzer`
- `auto_generate_synonyms_phrase_query`
- `boost`
- `default_operator`
- `flags`
- `fuzzy_max_expansions`
- `fuzzy_prefix_length`
- `fuzzy_transpositions`
- `lenient`
- `minimum_should_match`
- `quote_field_suffix`

Refer to the `simple_query_string` query [documentation]({{site.url}}{{site.baseurl}}/query-dsl/full-text/simple-query-string/) for parameter descriptions and supported values.

### *Example* of using `simple_query_string` in SQL and PPL queries:

The REST API search request
```json
GET accounts/_search
{
  "query": {
    "simple_query_string": {
      "query": "Lane Street",
      "fields": [ "address" ],
    }
  }
}
```
could be called from *SQL*
```sql
SELECT account_number, address
FROM accounts
WHERE simple_query_string(['address'], 'Lane Street', default_operator='OR')
```
or from *PPL*
```sql
SOURCE=accounts | WHERE simple_query_string(['address'], 'Lane Street', default_operator='OR') | fields account_number, address
```

| account_number | address
:--- | :---
1 | 880 Holmes Lane
6 | 671 Bristol Street
13 | 789 Madison Street

## Match phrase prefix

To search for phrases by given prefix, use `MATCH_PHRASE_PREFIX` function to make a prefix query out of the last term in the query string.

### Syntax

```sql
match_phrase_prefix(field_expression, query_expression[, option=<option_value>]*)
```

The `MATCH_PHRASE_PREFIX` function lets you specify the following options in any order:

- `analyzer`
- `slop`
- `max_expansions`
- `zero_terms_query`
- `boost`

Refer to the `match_phrase_prefix` query [documentation]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match-phrase-prefix/) for parameter descriptions and supported values.

### *Example* of using `match_phrase_prefix` in SQL and PPL queries:

The REST API search request
```json
GET accounts/_search
{
  "query": {
    "match_phrase_prefix": {
      "author": {
        "query": "Alexander Mil"
      }
    }
  }
}
```
could be called from *SQL*
```sql
SELECT author, title
FROM books
WHERE match_phrase_prefix(author, 'Alexander Mil')
```
or *PPL*
```sql
source=books | where match_phrase_prefix(author, 'Alexander Mil') | fields author, title
```

| author | title
:--- | :---
Alan Alexander Milne | The House at Pooh Corner
Alan Alexander Milne | Winnie-the-Pooh


## Match boolean prefix

Use the `match_bool_prefix` function to search documents that match text only for a given field prefix.

### Syntax

```sql
match_bool_prefix(field_expression, query_expression[, option=<option_value>]*)
```

The `MATCH_BOOL_PREFIX` function lets you specify the following options in any order:

- `minimum_should_match`
- `fuzziness`
- `prefix_length`
- `max_expansions`
- `fuzzy_transpositions`
- `fuzzy_rewrite`
- `boost`
- `analyzer`
- `operator`

Refer to the `match_bool_prefix` query [documentation]({{site.url}}{{site.baseurl}}/query-dsl/full-text/match-bool-prefix/) for parameter descriptions and supported values.

### Example of using `match_bool_prefix` in SQL and PPL queries:

The REST API search request
```json
GET accounts/_search
{
  "query": {
    "match_bool_prefix": {
      "address": {
        "query": "Bristol Stre"
      }
    }
  }
}
```
could be called from *SQL*
```sql
SELECT firstname, address
FROM accounts
WHERE match_bool_prefix(address, 'Bristol Stre')
```
or *PPL*
```sql
source=accounts | where match_bool_prefix(address, 'Bristol Stre') | fields firstname, address
```

| firstname | address
:--- | :---
Hattie | 671 Bristol Street
Nanette | 789 Madison Street
