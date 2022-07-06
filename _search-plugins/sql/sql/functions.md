---
layout: default
title: Functions
parent: SQL
grand_parent: SQL Plugin - SQL & PPL
nav_order: 7
---

# Functions

`SQL` language supports all SQL plugin [functions]({{site.url}}{{site.baseurl}}/search-plugins/sql/functions/), including [relevance search]({{site.url}}{{site.baseurl}}/search-plugins/sql/full-text/), but also introduces few function synonyms which are available in `SQL` only.
These synonyms are provided by `V1` engine, please see [limitations page]({{site.url}}{{site.baseurl}}/search-plugins/sql/limitation) for more info about it.

## Match query

`MATCHQUERY` and `MATCH_QUERY` are synonyms for [`MATCH`]({{site.url}}{{site.baseurl}}/search-plugins/sql/full-text#match) relevance function. They don't accept additional arguments, but provide an alternate syntax.

### Syntax

Pass in your search query and the field name that you want to search against.

```sql
match_query(field_expression, query_expression[, option=<option_value>]*)
matchquery(field_expression, query_expression[, option=<option_value>]*)
field_expression = match_query(query_expression[, option=<option_value>]*)
field_expression = matchquery(query_expression[, option=<option_value>]*)
```

You can specify the following options in any order:

- `analyzer`
- `boost`

### Example

```sql
SELECT account_number, address
FROM accounts
WHERE MATCHQUERY(address, 'Holmes')
```

Alternate syntax:

```sql
SELECT account_number, address
FROM accounts
WHERE address = MATCH_QUERY('Holmes')
```

| account_number | address
:--- | :---
1 | 880 Holmes Lane

## Multi match

There are 3 synonyms for [`MULTI_MATCH`]({{site.url}}{{site.baseurl}}/search-plugins/sql/full-text#multi-match) which have slightly different syntax. They accept query string and fields list with weights, and accept additional parameters.

### Syntax

```sql
multimatch('query'=query_expression[, 'fields'=field_expression][, option=<option_value>]*)
multi_match('query'=query_expression[, 'fields'=field_expression][, option=<option_value>]*)
multimatchquery('query'=query_expression[, 'fields'=field_expression][, option=<option_value>]*)
```

`fields` is optional parameter, it could be a single field or a comma-separated list; whitespaces are not allowed there. The weight is optional and is specified after the field name. It should be delimited by the `caret` character -- `^` -- without whitespaces. Please, refer to examples below:

```sql
multi_match('fields' = "Tags^2,Title^3.4,Body,Comments^0.3", ...)
multi_match('fields' = "Title", ...)
```

You can specify the following options in any order:

- `analyzer`
- `boost`
- `slop`
- `type`
- `tie_breaker`
- `operator`

## Query string

`QUERY` is a [`QUERY_STRING`]({{site.url}}{{site.baseurl}}/search-plugins/sql/full-text#query-string) synonym.

### Syntax

```sql
query('query'=query_expression[, 'fields'=field_expression][, option=<option_value>]*)
```

`fields` is optional parameter, it could be a single field or a comma-separated list; whitespaces are not allowed there. The weight is optional and is specified after the field name. It should be delimited by the `caret` character -- `^` -- without whitespaces. Please, refer to examples below:

```sql
query('fields' = "Tags^2,Title^3.4,Body,Comments^0.3", ...)
query('fields' = "Tags", ...)
```

You can specify the following options in any order:

- `analyzer`
- `boost`
- `slop`
- `default_field`

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

could be called using `query` function

```sql
SELECT account_number, address
FROM accounts
WHERE query('address:Lane OR address:Street')
```

| account_number | address
:--- | :---
1 | 880 Holmes Lane
6 | 671 Bristol Street
13 | 789 Madison Street

## Match phrase

`MATCHPHRASEQUERY` is a [`MATCH_PHRASE`]({{site.url}}{{site.baseurl}}/search-plugins/sql/full-text#query-string) synonym.

### Syntax

```sql
matchphrasequery(query_expression, field_expression[, option=<option_value>]*)
```

You can specify the following options in any order:

- `analyzer`
- `boost`
- `slop`

## Score query

To return a relevance score along with every matching document, use `SCORE`, `SCOREQUERY`, or `SCORE_QUERY` functions.

### Syntax

`SCORE` expects two arguments. The first is the [`MATCH_QUERY`](#match-query) expression. The second is an optional floating point number to boost the score (default value is 1.0).

```sql
SCORE(match_query_expression, score)
SCOREQUERY(match_query_expression, score)
SCORE_QUERY(match_query_expression, score)
```

### Example

```sql
SELECT account_number, address, _score
FROM accounts
WHERE SCORE(MATCH_QUERY(address, 'Lane'), 0.5) OR
  SCORE(MATCH_QUERY(address, 'Street'), 100)
ORDER BY _score
```

| account_number | address | score
:--- | :--- | :---
1 | 880 Holmes Lane | 0.5
6 | 671 Bristol Street | 100
13 | 789 Madison Street | 100

## Wildcard query

To search documents by given wildcard use `WILDCARDQUERY` or `WILDCARD_QUERY` functions.

### Syntax

```sql
wildcardquery(field_expression, query_expression[, boost=<value>])
wildcard_query(field_expression, query_expression[, boost=<value>])
```

### Example

```sql
SELECT account_number, address
FROM accounts
WHERE wildcard_query(address, '*Holmes*');
```

| account_number | address
:--- | :---
1 | 880 Holmes Lane
