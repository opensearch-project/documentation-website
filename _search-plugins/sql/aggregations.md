---
layout: default
title: Aggregation Functions
parent: SQL
nav_order: 11
---

# Aggregation functions

Aggregate functions use the `GROUP BY` clause to group sets of values into subsets.

## Group By

Use the `GROUP BY` clause as an identifier, ordinal, or expression.

### Identifier

```sql
SELECT gender, sum(age) FROM accounts GROUP BY gender;
```

| gender | sum (age)
:--- | :---
F | 28 |
M | 101 |

### Ordinal

```sql
SELECT gender, sum(age) FROM accounts GROUP BY 1;
```

| gender | sum (age)
:--- | :---
F | 28 |
M | 101 |

### Expression

```sql
SELECT abs(account_number), sum(age) FROM accounts GROUP BY abs(account_number);
```

| abs(account_number) | sum (age)
:--- | :---
| 1  | 32  |
| 13 | 28  |
| 18 | 33  |
| 6  | 36  |

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
