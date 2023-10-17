---
layout: default
title: Basic Queries
parent: SQL
grand_parent: SQL and PPL
nav_order: 5
Redirect_from:
  - /search-plugins/sql/basic/
---


# Basic queries

Use the `SELECT` clause, along with `FROM`, `WHERE`, `GROUP BY`, `HAVING`, `ORDER BY`, and `LIMIT` to search and aggregate data.

Among these clauses, `SELECT` and `FROM` are required, as they specify which fields to retrieve and which indexes to retrieve them from. All other clauses are optional. Use them according to your needs.

### Syntax

The complete syntax for searching and aggregating data is as follows:

```sql
SELECT [DISTINCT] (* | expression) [[AS] alias] [, ...]
FROM index_name
[WHERE predicates]
[GROUP BY expression [, ...]
 [HAVING predicates]]
[ORDER BY expression [IS [NOT] NULL] [ASC | DESC] [, ...]]
[LIMIT [offset, ] size]
```

### Fundamentals

Apart from the predefined keywords of SQL, the most basic elements are literal and identifiers.
A literal is a numeric, string, date or boolean constant. An identifier is an OpenSearch index or field name.
With arithmetic operators and SQL functions, use literals and identifiers to build complex expressions.

Rule `expressionAtom`:

![expressionAtom]({{site.url}}{{site.baseurl}}/images/expressionAtom.png)

The expression in turn can be combined into a predicate with logical operator. Use a predicate in the `WHERE` and `HAVING` clause to filter out data by specific conditions.

Rule `expression`:

![expression]({{site.url}}{{site.baseurl}}/images/expression.png)

Rule `predicate`:

![expression]({{site.url}}{{site.baseurl}}/images/predicate.png)

### Execution Order

These SQL clauses execute in an order different from how they appear:

```sql
FROM index
 WHERE predicates
  GROUP BY expressions
   HAVING predicates
    SELECT expressions
     ORDER BY expressions
      LIMIT size
```

## Select

Specify the fields to be retrieved.

### Syntax

Rule `selectElements`:

![selectElements]({{site.url}}{{site.baseurl}}/images/selectElements.png)

Rule `selectElement`:

![selectElements]({{site.url}}{{site.baseurl}}/images/selectElement.png)

*Example 1*: Use `*` to retrieve all fields in an index:

```sql
SELECT *
FROM accounts
```

| account_number | firstname | gender | city | balance | employer | state | email | address | lastname | age
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---
| 1 | Amber | M | Brogan | 39225 | Pyrami | IL | amberduke@pyrami.com | 880 Holmes Lane | Duke | 32
| 16 | Hattie | M | Dante | 5686 | Netagy | TN | hattiebond@netagy.com | 671 Bristol Street | 	Bond | 36
| 13 | Nanette | F | Nogal | 32838 | Quility | VA | nanettebates@quility.com | 789 Madison Street | Bates | 28
| 18 | Dale | M | Orick | 4180 |  | MD | daleadams@boink.com | 467 Hutchinson Court | Adams | 33

*Example 2*: Use field name(s) to retrieve only specific fields:

```sql
SELECT firstname, lastname
FROM accounts
```

| firstname | lastname
| :--- | :---
| Amber | Duke
| Hattie | Bond
| Nanette | Bates
| Dale | Adams

*Example 3*: Use field aliases instead of field names. Field aliases are used to make field names more readable:

```sql
SELECT account_number AS num
FROM accounts
```

| num
:---
| 1
| 6
| 13
| 18

*Example 4*: Use the `DISTINCT` clause to get back only unique field values. You can specify one or more field names:

```sql
SELECT DISTINCT age
FROM accounts
```

| age
:---
| 28
| 32
| 33
| 36

## From

Specify the index that you want search.
You can specify subqueries within the `FROM` clause.

### Syntax

Rule `tableName`:

![tableName]({{site.url}}{{site.baseurl}}/images/tableName.png)

*Example 1*: Use index aliases to query across indexes. To learn about index aliases, see [Index Alias]({{site.url}}{{site.baseurl}}/opensearch/index-alias/).
In this sample query, `acc` is an alias for the `accounts` index:

```sql
SELECT account_number, accounts.age
FROM accounts
```

or

```sql
SELECT account_number, acc.age
FROM accounts acc
```

| account_number | age
| :--- | :---
| 1 | 32
| 6 | 36
| 13 | 28
| 18 | 33

*Example 2*: Use index patterns to query indexes that match a specific pattern:

```sql
SELECT account_number
FROM account*
```

| account_number
:---
| 1
| 6
| 13
| 18

## Where

Specify a condition to filter the results.

| Operators | Behavior
:--- | :---
`=` | Equal to.
`<>` | Not equal to.
`>` | Greater than.
`<` | Less than.
`>=` | Greater than or equal to.
`<=` | Less than or equal to.
`IN` | Specify multiple `OR` operators.
`BETWEEN` | Similar to a range query. For more information about range queries, see [Range query]({{site.url}}{{site.baseurl}}/query-dsl/term/range/).
`LIKE` | Use for full-text search. For more information about full-text queries, see [Full-text queries]({{site.url}}{{site.baseurl}}/opensearch/query-dsl/full-text/index/).
`IS NULL` | Check if the field value is `NULL`.
`IS NOT NULL` | Check if the field value is `NOT NULL`.

Combine comparison operators (`=`, `<>`, `>`, `>=`, `<`, `<=`) with boolean operators `NOT`, `AND`, or `OR` to build more complex expressions.

*Example 1*: Use comparison operators for numbers, strings, or dates:

```sql
SELECT account_number
FROM accounts
WHERE account_number = 1
```

| account_number
| :---
| 1

*Example 2*: OpenSearch allows for flexible schema，so documents in an index may have different fields. Use `IS NULL` or `IS NOT NULL` to retrieve only missing fields or existing fields. OpenSearch does not differentiate between missing fields and fields explicitly set to `NULL`:

```sql
SELECT account_number, employer
FROM accounts
WHERE employer IS NULL
```

| account_number | employer
| :--- | :---
| 18 |

*Example 3*: Deletes a document that satisfies the predicates in the `WHERE` clause:

```sql
DELETE FROM accounts
WHERE age > 30
```

## Group By

Group documents with the same field value into buckets.

*Example 1*: Group by fields:

```sql
SELECT age
FROM accounts
GROUP BY age
```

| id | age
:--- | :---
0 | 28
1 | 32
2 | 33
3 | 36

*Example 2*: Group by field alias:

```sql
SELECT account_number AS num
FROM accounts
GROUP BY num
```

| id | num
:--- | :---
0 | 1
1 | 6
2 | 13
3 | 18

*Example 4*: Use scalar functions in the `GROUP BY` clause:

```sql
SELECT ABS(age) AS a
FROM accounts
GROUP BY ABS(age)
```

| id | a
:--- | :---
0 | 28.0
1 | 32.0
2 | 33.0
3 | 36.0

## Having

Use the `HAVING` clause to aggregate inside each bucket based on aggregation functions (`COUNT`, `AVG`, `SUM`, `MIN`, and `MAX`).
The `HAVING` clause filters results from the `GROUP BY` clause:

*Example 1*:

```sql
SELECT age, MAX(balance)
FROM accounts
GROUP BY age HAVING MIN(balance) > 10000
```

| id | age | MAX (balance)
:--- | :---
0 | 28 | 32838
1 | 32 | 39225

## Order By

Use the `ORDER BY` clause to sort results into your desired order.

*Example 1*: Use `ORDER BY` to sort by ascending or descending order. Besides regular field names, using `ordinal`, `alias`, or `scalar` functions are supported:

```sql
SELECT account_number
FROM accounts
ORDER BY account_number DESC
```

| account_number
| :---
| 18
| 13
| 6
| 1

*Example 2*: Specify if documents with missing fields are to be put at the beginning or at the end of the results. The default behavior of OpenSearch is to return nulls or missing fields at the end. To push them before non-nulls, use the `IS NOT NULL` operator:

```sql
SELECT employer
FROM accounts
ORDER BY employer IS NOT NULL
```

| employer
| :---
||
| Netagy
| Pyrami
| Quility

## Limit

Specify the maximum number of documents that you want to retrieve. Used to prevent fetching large amounts of data into memory.

*Example 1*: If you pass in a single argument, it's mapped to the `size` parameter in OpenSearch and the `from` parameter is set to 0.

```sql
SELECT account_number
FROM accounts
ORDER BY account_number LIMIT 1
```

| account_number
| :---
| 1

*Example 2*: If you pass in two arguments, the first is mapped to the `from` parameter and the second to the `size` parameter in OpenSearch. You can use this for simple pagination for small indexes, as it's inefficient for large indexes.
Use `ORDER BY` to ensure the same order between pages:

```sql
SELECT account_number
FROM accounts
ORDER BY account_number LIMIT 1, 1
```

| account_number
| :---
| 6
