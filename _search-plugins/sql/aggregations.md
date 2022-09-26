---
layout: default
title: Aggregate Functions
parent: SQL
nav_order: 11
---

# Aggregate functions

Aggregate functions use the `GROUP BY` clause to group sets of values into subsets.

OpenSearch supports the following aggregate functions:

Function | Description
:--- | :---
AVG | Returns the average of the results.
COUNT | Returns the number of results.
SUM | Returns the sum of the results.
MIN | Returns the minimum of the results.
MAX | Returns the maximum of the results.
VAR_POP or VARIANCE | Returns the population variance of the results after discarding nulls.
VAR_SAMP | Returns the sample variance of the results after discarding nulls.
STD or STDDEV | Returns the sample standard deviation of the results. Returns 0 when it has only one row of results.
STDDEV_POP | Returns the population standard deviation of the results.
STDDEV_SAMP | Returns the sample standard deviation of the results. Returns null when it has only one row of results.


The examples below reference an `accounts` table. You can try out the examples by indexing the following documents into OpenSearch using the bulk index operation:

```json
```json
PUT accounts/_bulk?refresh
{"index":{"_id":"1"}}
{"account_number":1,"balance":39225,"firstname":"Amber","lastname":"Duke","age":32,"gender":"M","address":"880 Holmes Lane","employer":"Pyrami","email":"amberduke@pyrami.com","city":"Brogan","state":"IL","acct_open_date":"2008-01-23"}
{"index":{"_id":"6"}}
{"account_number":6,"balance":5686,"firstname":"Hattie","lastname":"Bond","age":36,"gender":"M","address":"671 Bristol Street","employer":"Netagy","email":"hattiebond@netagy.com","city":"Dante","state":"TN","acct_open_date":"2008-06-07"}
{"index":{"_id":"13"}}
{"account_number":13,"balance":32838,"firstname":"Nanette","lastname":"Bates","age":28,"gender":"F","address":"789 Madison Street","employer":"Quility","email":"nanettebates@quility.com","city":"Nogal","state":"VA","acct_open_date":"2010-04-11"}
{"index":{"_id":"18"}}
{"account_number":18,"balance":4180,"firstname":"Dale","lastname":"Adams","age":33,"gender":"M","address":"467 Hutchinson Court","email":"daleadams@boink.com","city":"Orick","state":"MD","acct_open_date":"2022-11-05"}
```



## Group By

Use the `GROUP BY` clause as an identifier, ordinal, or expression.

### Identifier

The following query returns the gender and average age of customers in the `accounts` index and groups the results by gender:

```sql
SELECT gender, avg(age) FROM accounts GROUP BY gender;
```

| gender | avg(age)
:--- | :---
F | 28.0  |
M | 33.666666666666664 |

### Ordinal

The following query returns the gender and average age of customers in the `accounts` index. It groups the results by the first column of the result set, which in this case is `gender`:

```sql
SELECT gender, avg(age) FROM accounts GROUP BY 1;
```

| gender | sum (age)
:--- | :---
F | 28.0  |
M | 33.666666666666664 |

### Expression

The following query 

```sql
SELECT abs(account_number), avg(age) FROM accounts GROUP BY abs(account_number);
```

| abs(account_number) | avg(age)
:--- | :---
| 1  | 32.0  |
| 13 | 28.0  |
| 18 | 33.0  |
| 6  | 36.0  |

## Aggregation

Use aggregations as a select, expression, or an argument of an expression.

### Select

```sql
SELECT gender, sum(age) FROM accounts GROUP BY gender;
```

| gender | sum (age)
:--- | :---
F | 28 |
M | 101 |

### Argument

```sql
SELECT gender, sum(age) * 2 as sum2 FROM accounts GROUP BY gender;
```

| gender | sum2
:--- | :---
F | 56 |
M | 202 |

### Expression

```sql
SELECT gender, sum(age * 2) as sum2 FROM accounts GROUP BY gender;
```

| gender | sum2
:--- | :---
F | 56 |
M | 202 |

### COUNT

Use the `COUNT` function to accept arguments such as a `*` or a literal like `1`.
The meaning of these different forms are as follows:

- `COUNT(field)` - Only counts if given a field (or expression) is not null or missing in the input rows.
- `COUNT(*)` - Counts the number of all its input rows.
- `COUNT(1)` (same as `COUNT(*)`) - Counts any non-null literal.

## Having

Use the `HAVING` clause to filter out aggregated values.

### HAVING with GROUP BY

You can use aggregate expressions or its aliases defined in a `SELECT` clause in a `HAVING` condition.

We recommend using a non-aggregate expression in the `WHERE` clause although you can do this in a `HAVING` clause.

The aggregations in a `HAVING` clause are not necessarily the same as that in a select list. As an extension to the SQL standard, you're not restricted to using identifiers only in the `GROUP BY` list.
For example:

```sql
SELECT gender, sum(age)
FROM accounts
GROUP BY gender
HAVING sum(age) > 100;
```

| gender | sum (age)
:--- | :---
M | 101 |

Here's another example for using an alias in a `HAVING` condition.

```sql
SELECT gender, sum(age) AS s
FROM accounts
GROUP BY gender
HAVING s > 100;
```

| gender | s
:--- | :---
M | 101 |

If an identifier is ambiguous, for example, present both as a select alias and as an index field (preference is alias). In this case, the identifier is replaced with an expression aliased in the `SELECT` clause:

### HAVING without GROUP BY

You can use a `HAVING` clause without the `GROUP BY` clause. This is useful because aggregations are not supported in a `WHERE` clause:

```sql
SELECT 'Total of age > 100'
FROM accounts
HAVING sum(age) > 100;
```

| Total of age > 100 |
:--- |
Total of age > 100 |
