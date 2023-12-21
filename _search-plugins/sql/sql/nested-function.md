---
layout: default
title: Nested function
parent: SQL
grand_parent: SQL and PPL
nav_order: 13
has_toc: true
redirect_from:
- /search-plugins/sql/nested/
---

# Nested function

The `nested` function is used to created a query within a query. See the following sections for how and why to use the function in OpenSearch.   

## Using the function in a SELECT clause

To extract individual elements from nested object type collections within the `SELECT` clause, use the `nested` function. This process flattens nested structures, generating a Cartesian product when querying against nested collections. 

### Syntax

The `field_expression` parameter is required. The `path_expression` parameter is optional. Dot notation is used to show the nesting level for both the `field_expression` and `path_expression` parameters. For example, `nestedObj.innerFieldName` denotes a field nested one level. If the user does not provide the `path_expression` parameter, the path value is generated dynamically. For example, the field `user.office.cubicle` would dynamically generate the path `user.office`. The syntax is shown in the following example:

```sql
nested(field_expression | field_expression, path_expression)
```
{% include copy.html %}

### Selecting all inner fields of an object

In the `SELECT` clause, the `*` character in a nested function's `field_expression` parameter selects all fields under a nested object. For example, `nestedObj.*` retrieves all fields within `nestedObj`.

### Flattening

Flattening is a process in OpenSearch that transforms the response format by converting nested objects into key/value pairs. The full path of each object becomes the key, while the object itself becomes the value. The following are examples of an input, an output, a query, and a dataset. 

#### Example input

```json
{
  "comment": {
    "data": "abc"
  }
}
```
{% include copy-curl.html %}

#### Example output

```json
[
  { "comment.data": "abc" }
]
```

#### Example query

The following example uses a nested query in the `SELECT` clause:

```sql
SELECT nested(comment.data), nested(message.info) FROM nested_objects;
```
{% include copy.html %}


#### Example dataset

```json
{
  "comment": {
    "data": "abc"
  },
  "message": [
    { "info": "letter1" },
    { "info": "letter2" }
  ]
}
```
{% include copy-curl.html %}

The results contain the following documents that match the nested query:

```json
| nested(comment.data) | nested(message.info)
:----------------------|----
abc                    | letter1
abc                    | letter2
```

## Using the function in a WHERE clause

Nested object documents can be filtered in SQL using the `nested` function in the `WHERE` clause.

### Syntax

The `nested` function in a SQL `WHERE` clause offers two syntax options for filtering a nested field with a literal value, both achieving the same outcome. The two options are described in the following sections.

### Boolean condition inside the nested function

This option specifies the Boolean condition inside the nested function using the `condition_expression` parameter, as shown in the following example:

```sql
nested(path_expression, condition_expression)
```
{% include copy.html %}

### Nested function with predicate expression and literal expression

This option, which is supported by the V2 engine, places the `nested` function on the left of the predicate expression and on the right of the `literal_expression`. The `path_expression` is optional and automatically determined by the SQL plugin if not provided, as shown in the following example:

```sql
nested(field_expression | field_expression, path_expression) Operator Literal_expression
```
{% include copy.html %}

#### Example query

The following are examples of a query using nested queries in the `WHERE` clause, a sample dataset, and the query results:

```sql
SELECT nested(message.info) FROM nested_objects WHERE nested(message.info) = 'letter2';
SELECT nested(message.info) FROM nested_objects WHERE nested(message, message.info = 'letter2');
```
{% include copy.html %}

#### Example dataset

```json
{
  "message": {
    "message": [
      { "info": "letter1" },
      { "info": "letter2" }
    ]
  }
}
```
{% include copy-curl.html %}

The results contain documents that match the nested query:

```json
| nested(message.info) | 
:----------------------|
letter2                | 
```

## Using the function in an ORDER BY clause

In the `ORDER BY` clause, the `nested` function enables sorting across documents based on their nested fields.

### Syntax

The `ORDER BY` clause with the `nested` function defaults to ascending order (`ASC`). Specifying `DESC` (desending) after the function allows overriding this behavior. The syntax is shown in the following example: 

```sql
nested(field_expression | field_expression, path_expression)
```
{% include copy.html %}

#### Example query 

The following are examples of a query using nested queries in the `ORDER BY` clause, a sample dataset, and the query results:

```sql
SELECT nested(message.info) FROM nested_objects ORDER BY nested(message.info) DESC;
```

#### Example dataset

```json
{
  "message": {
    "message": [
      { "info": "letter1" },
      { "info": "letter2" }
    ]
  }
}
```
{% include copy-curl.html %}

The results contain the following documents that match the nested query:

```json
| nested(message.info) |
:----------------------|
letter2                |
letter1                |
```

## Using the function in aggregation queries

Nested fields can be aggregated in the `GROUP BY` clause and filtered in the `HAVING` clause using the `nested` function within SQL queries. 

### Syntax

The syntax is shown in the following example:

```sql
nested(field_expression | field_expression, path_expression)
```
{% include copy.html %}

#### Example query 

The following are examples of a query using nested queries in the `GROUP BY` and `HAVING` clauses:

```sql
SELECT count(*) FROM nested_objects GROUP BY nested(message.info) HAVING count(*) > 1;
```

#### Example dataset

```json
{
  {
    "message": [
      {"info": "letter1"},
      {"info": "letter2"}
    ]
  },
  {
    "message": [
      {"info": "letter1"},
      {"info": "letter3"}
    ]
  }
}
```
{% include copy-curl.html %}

The results contain the following documents that match the nested query:

```json
| count(*) |
:----------|
| 2        |
```

## Limitations

The `nested` function is supported in the V2 engine in the `SELECT` and `WHERE` clauses. See [Query processing engines](https://opensearch.org/docs/latest/search-plugins/sql/limitation/#query-processing-engines).