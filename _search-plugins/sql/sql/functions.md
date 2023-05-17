---
layout: default
title: Functions
parent: SQL
grand_parent: SQL and PPL
nav_order: 7
Redirect_from:
  - /search-plugins/sql/functions/
---

# Functions

The SQL language supports all SQL plugin [common functions]({{site.url}}{{site.baseurl}}/search-plugins/sql/functions/), including [relevance search]({{site.url}}{{site.baseurl}}/search-plugins/sql/full-text/), but also introduces a few function synonyms, which are available in SQL only.
These synonyms are provided by the `V1` engine. For more information, see [Limitations]({{site.url}}{{site.baseurl}}/search-plugins/sql/limitation).

## Match query

The `MATCHQUERY` and `MATCH_QUERY` functions are synonyms for the [`MATCH`]({{site.url}}{{site.baseurl}}/search-plugins/sql/full-text#match) relevance function. They don't accept additional arguments but provide an alternate syntax.

### Syntax

To use `matchquery` or `match_query`, pass in your search query and the field name that you want to search against:

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

You can use `MATCHQUERY` to replace `MATCH`:

```sql
SELECT account_number, address
FROM accounts
WHERE MATCHQUERY(address, 'Holmes')
```

Alternatively, you can use `MATCH_QUERY` to replace `MATCH`:

```sql
SELECT account_number, address
FROM accounts
WHERE address = MATCH_QUERY('Holmes')
```

The results contain documents in which the address contains "Holmes":

| account_number | address
:--- | :---
1 | 880 Holmes Lane

## Multi-match

There are three synonyms for [`MULTI_MATCH`]({{site.url}}{{site.baseurl}}/search-plugins/sql/full-text#multi-match), each with a slightly different syntax. They accept a query string and a fields list with weights. They can also accept additional optional parameters.

### Syntax

```sql
multimatch('query'=query_expression[, 'fields'=field_expression][, option=<option_value>]*)
multi_match('query'=query_expression[, 'fields'=field_expression][, option=<option_value>]*)
multimatchquery('query'=query_expression[, 'fields'=field_expression][, option=<option_value>]*)
```

The `fields` parameter is optional and can contain a single field or a comma-separated list (whitespace characters are not allowed). The weight for each field is optional and is specified after the field name. It should be delimited by the `caret` character -- `^` -- without whitespace. 

### Example

The following queries show the `fields` parameter of a multi-match query with a single field and a field list: 

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

The `QUERY` function is a synonym for [`QUERY_STRING`]({{site.url}}{{site.baseurl}}/search-plugins/sql/full-text#query-string).

### Syntax

```sql
query('query'=query_expression[, 'fields'=field_expression][, option=<option_value>]*)
```

The `fields` parameter is optional and can contain a single field or a comma-separated list (whitespace characters are not allowed). The weight for each field is optional and is specified after the field name. It should be delimited by the `caret` character -- `^` -- without whitespace. 

### Example

The following queries show the `fields` parameter of a multi-match query with a single field and a field list: 

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

The following is a sample REST API search request in OpenSearch DSL.

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

The request above is equivalent to the following `query` function:

```sql
SELECT account_number, address
FROM accounts
WHERE query('address:Lane OR address:Street')
```

The results contain addresses that contain "Lane" or "Street":

| account_number | address
:--- | :---
1 | 880 Holmes Lane
6 | 671 Bristol Street
13 | 789 Madison Street

## Match phrase

The `MATCHPHRASEQUERY` function is a synonym for [`MATCH_PHRASE`]({{site.url}}{{site.baseurl}}/search-plugins/sql/full-text#query-string).

### Syntax

```sql
matchphrasequery(query_expression, field_expression[, option=<option_value>]*)
```

You can specify the following options in any order:

- `analyzer`
- `boost`
- `slop`

## Score query

To return a relevance score along with every matching document, use the `SCORE`, `SCOREQUERY`, or `SCORE_QUERY` functions.

### Syntax

The `SCORE` function expects two arguments. The first argument is the [`MATCH_QUERY`](#match-query) expression. The second argument is an optional floating-point number to boost the score (the default value is 1.0):

```sql
SCORE(match_query_expression, score)
SCOREQUERY(match_query_expression, score)
SCORE_QUERY(match_query_expression, score)
```

### Example

The following example uses the `SCORE` function to boost the documents' scores:

```sql
SELECT account_number, address, _score
FROM accounts
WHERE SCORE(MATCH_QUERY(address, 'Lane'), 0.5) OR
  SCORE(MATCH_QUERY(address, 'Street'), 100)
ORDER BY _score
```

The results contain matches with corresponding scores:

| account_number | address | score
:--- | :--- | :---
1 | 880 Holmes Lane | 0.5
6 | 671 Bristol Street | 100
13 | 789 Madison Street | 100

## Wildcard query

To search documents by a given wildcard, use the `WILDCARDQUERY` or `WILDCARD_QUERY` functions.

### Syntax

```sql
wildcardquery(field_expression, query_expression[, boost=<value>])
wildcard_query(field_expression, query_expression[, boost=<value>])
```

### Example

The following example uses a wildcard query:

```sql
SELECT account_number, address
FROM accounts
WHERE wildcard_query(address, '*Holmes*');
```

The results contain documents that match the wildcard expression:

| account_number | address
:--- | :---
1 | 880 Holmes Lane
