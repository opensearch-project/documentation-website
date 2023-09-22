---
layout: default
title: Aggregate Functions
parent: SQL
grand_parent: SQL and PPL
nav_order: 11
Redirect_from:
  - /search-plugins/sql/aggregations/
---

# Aggregate functions

Aggregate functions operate on subsets defined by the `GROUP BY` clause. In the absence of a `GROUP BY` clause, aggregate functions operate on all elements of the result set. You can use aggregate functions in the `GROUP BY`, `SELECT`, and `HAVING` clauses.

OpenSearch supports the following aggregate functions.

Function | Description
:--- | :---
`AVG` | Returns the average of the results.
`COUNT` | Returns the number of results.
`SUM` | Returns the sum of the results.
`MIN` | Returns the minimum of the results.
`MAX` | Returns the maximum of the results.
`VAR_POP` or `VARIANCE` | Returns the population variance of the results after discarding nulls. Returns 0 when there is only one row of results.
`VAR_SAMP` | Returns the sample variance of the results after discarding nulls. Returns null when there is only one row of results.
`STD` or `STDDEV` | Returns the sample standard deviation of the results. Returns 0 when there is only one row of results.
`STDDEV_POP` | Returns the population standard deviation of the results. Returns 0 when there is only one row of results.
`STDDEV_SAMP` | Returns the sample standard deviation of the results. Returns null when there is only one row of results.

The examples below reference an `employees` table. You can try out the examples by indexing the following documents into OpenSearch using the bulk index operation:

```json
PUT employees/_bulk?refresh
{"index":{"_id":"1"}}
{"employee_id": 1, "department":1, "firstname":"Amber", "lastname":"Duke", "sales":1356, "sale_date":"2020-01-23"}
{"index":{"_id":"2"}}
{"employee_id": 1, "department":1, "firstname":"Amber", "lastname":"Duke", "sales":39224, "sale_date":"2021-01-06"}
{"index":{"_id":"6"}}
{"employee_id":6, "department":1, "firstname":"Hattie", "lastname":"Bond", "sales":5686, "sale_date":"2021-06-07"}
{"index":{"_id":"7"}}
{"employee_id":6, "department":1, "firstname":"Hattie", "lastname":"Bond", "sales":12432, "sale_date":"2022-05-18"}
{"index":{"_id":"13"}}
{"employee_id":13,"department":2, "firstname":"Nanette", "lastname":"Bates", "sales":32838, "sale_date":"2022-04-11"}
{"index":{"_id":"18"}}
{"employee_id":18,"department":2, "firstname":"Dale", "lastname":"Adams", "sales":4180, "sale_date":"2022-11-05"}
```

## GROUP BY

The `GROUP BY` clause defines subsets of a result set. Aggregate functions operate on these subsets and return one result row for each subset. 

You can use an identifier, ordinal, or expression in the `GROUP BY` clause.

### Using an identifier in GROUP BY

You can specify the field name (column name) to aggregate on in the `GROUP BY` clause. For example, the following query returns the department numbers and the total sales for each department: 
```sql
SELECT department, sum(sales) 
FROM employees 
GROUP BY department;
```

| department | sum(sales)
:--- | :---
1 | 58700  |
2 | 37018 |

### Using an ordinal in GROUP BY

You can specify the column number to aggregate on in the `GROUP BY` clause. The column number is determined by the column position in the `SELECT` clause. For example, the following query is equivalent to the query above. It returns the department numbers and the total sales for each department. It groups the results by the first column of the result set, which is `department`:

```sql
SELECT department, sum(sales) 
FROM employees 
GROUP BY 1;
```

| department | sum(sales)
:--- | :---
1 | 58700  |
2 | 37018 |

### Using an expression in GROUP BY

You can use an expression in the `GROUP BY` clause. For example, the following query returns the average sales for each year:

```sql
SELECT year(sale_date), avg(sales) 
FROM employees 
GROUP BY year(sale_date);
```

| year(start_date) | avg(sales)
:--- | :---
| 2020  | 1356.0 |
| 2021 | 22455.0 |
| 2022 | 16484.0  |

## SELECT

You can use aggregate expressions in the `SELECT` clause either directly or as part of a larger expression. In addition, you can use expressions as arguments of aggregate functions.

### Using aggregate expressions directly in SELECT

The following query returns the average sales for each department:

```sql
SELECT department, avg(sales) 
FROM employees 
GROUP BY department;
```

| department | avg(sales)
:--- | :---
1 | 14675.0 |
2 | 18509.0 |

### Using aggregate expressions as part of larger expressions in SELECT

The following query calculates the average commission for the employees of each department as 5% of the average sales:

```sql
SELECT department, avg(sales) * 0.05 as avg_commission 
FROM employees 
GROUP BY department;
```

| department | avg_commission
:--- | :---
1 | 733.75 |
2 | 925.45 |

### Using expressions as arguments to aggregate functions

The following query calculates the average commission amount for each department. First it calculates the commission amount for each `sales` value as 5% of the `sales`. Then it determines the average of all commission values:

```sql
SELECT department, avg(sales * 0.05) as avg_commission 
FROM employees 
GROUP BY department;
```

| department | avg_commission
:--- | :---
1 | 733.75 |
2 | 925.45 |

### COUNT

The `COUNT` function accepts arguments, such as `*`, or literals, such as `1`.
The following table describes how various forms of the `COUNT` function operate.

| Function type | Description
`COUNT(field)` | Counts the number of rows where the value of the given field (or expression) is not null.
`COUNT(*)` | Counts the total number of rows in a table.
`COUNT(1)` (same as `COUNT(*)`) | Counts any non-null literal.

For example, the following query returns the count of sales for each year:

```sql
SELECT year(sale_date), count(sales) 
FROM employees 
GROUP BY year(sale_date);
```

| year(sale_date) | count(sales)
:--- | :---
2020 | 1
2021 | 2
2022 | 3

## HAVING

Both `WHERE` and `HAVING` are used to filter results. The `WHERE` filter is applied before the `GROUP BY` phase, so you cannot use aggregate functions in a `WHERE` clause. However, you can use the `WHERE` clause to limit the rows to which the aggregate is then applied.

The `HAVING` filter is applied after the `GROUP BY` phase, so you can use the `HAVING` clause to limit the groups that are included in the results. 

### HAVING with GROUP BY

You can use aggregate expressions or their aliases defined in a `SELECT` clause in a `HAVING` condition.

The following query uses an aggregate expression in the `HAVING` clause. It returns the number of sales for each employee who made more than one sale:

```sql
SELECT employee_id, count(sales)
FROM employees
GROUP BY employee_id
HAVING count(sales) > 1;
```

| employee_id | count(sales)
:--- | :---
1 | 2 |
6 | 2

The aggregations in a `HAVING` clause do not have to be the same as the aggregations in a `SELECT` list. The following query uses the `count` function in the `HAVING` clause but the `sum` function in the `SELECT` clause. It returns the total sales amount for each employee who made more than one sale:

```sql
SELECT employee_id, sum(sales)
FROM employees
GROUP BY employee_id
HAVING count(sales) > 1;
```

| employee_id | sum (sales)
:--- | :---
1 | 40580 |
6 | 18120

As an extension of the SQL standard, you are not restricted to using only identifiers in the `GROUP BY` clause. The following query uses an alias in the `GROUP BY` clause and is equivalent to the previous query:

```sql
SELECT employee_id as id, sum(sales)
FROM employees
GROUP BY id
HAVING count(sales) > 1;
```

| id | sum (sales)
:--- | :---
1 | 40580 |
6 | 18120

You can also use an alias for an aggregate expression in the `HAVING` clause. The following query returns the total sales for each department where sales exceed $40,000:

```sql
SELECT department, sum(sales) as total
FROM employees
GROUP BY department
HAVING total > 40000;
```

| department | total
:--- | :---
1 | 58700 |

If an identifier is ambiguous (for example, present both as a `SELECT` alias and as an index field), the preference is given to the alias. In the following query the identifier is replaced with the expression aliased in the `SELECT` clause:

```sql
SELECT department, sum(sales) as sales
FROM employees
GROUP BY department
HAVING sales > 40000;
```

| department | sales
:--- | :---
1 | 58700 |

### HAVING without GROUP BY

You can use a `HAVING` clause without a `GROUP BY` clause. In this case, the whole set of data is to be considered one group. The following query will return `True` if there is more than one value in the `department` column:

```sql
SELECT 'True' as more_than_one_department FROM employees HAVING min(department) < max(department);
```

| more_than_one_department |
:--- |
True |

If all employees in the employee table belonged to the same department, the result would contain zero rows:

| more_than_one_department
:--- |
 |
