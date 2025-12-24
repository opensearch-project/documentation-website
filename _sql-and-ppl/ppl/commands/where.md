---
layout: default
title: where
parent: Commands
grand_parent: PPL
nav_order: 47
---

# where

The `where` command filters the search results. It only returns results that match the specified conditions.

## Syntax

The `where` command has the following syntax:

```sql
where <boolean-expression>
```

## Parameters

The `where` command supports the following parameters.

| Parameter | Required/Optional | Description |
| --- | --- | --- |
| `<boolean-expression>` | Required | The condition used to filter the results. Only rows in which this condition evaluates to `true` are returned. |

## Example 1: Filter by numeric values

The following query returns accounts in which `balance` is greater than `30000`:

```sql
source=accounts
| where balance > 30000
| fields account_number, balance
```
{% include copy.html %}

The query returns the following results:

| account_number | balance |
| --- | --- |
| 1 | 39225 |
| 13 | 32838 |


## Example 2: Filter using combined criteria

The following query combines multiple conditions using an `AND` operator:

```sql
source=accounts
| where age > 30 AND gender = 'M'
| fields account_number, age, gender
```
{% include copy.html %}

The query returns the following results:

| account_number | age | gender |
| --- | --- | --- |
| 1 | 32 | M |
| 6 | 36 | M |
| 18 | 33 | M |


## Example 3: Filter with multiple possible values

The following query fetches all the documents from the `accounts` index in which `account_number` is `1` or `gender` is `F`:

```sql
source=accounts
| where account_number=1 or gender="F"
| fields account_number, gender
```
{% include copy.html %}

The query returns the following results:

| account_number | gender |
| --- | --- |
| 1 | M |
| 13 | F |
  

## Example 4: Filter by text patterns 

The `LIKE` operator enables pattern matching on string fields using wildcards.

### Matching a single character

The following query uses an underscore (`_`) to match a single character:

```sql
source=accounts
| where LIKE(state, 'M_')
| fields account_number, state
```
{% include copy.html %}

The query returns the following results:

| account_number | state |
| --- | --- |
| 18 | MD |

### Matching multiple characters

The following query uses a percent sign (`%`) to match multiple characters:

```sql
source=accounts
| where LIKE(state, 'V%')
| fields account_number, state
```
{% include copy.html %}

The query returns the following results:

| account_number | state |
| --- | --- |
| 13 | VA |

## Example 5: Filter by excluding specific values  

The following query uses a `NOT` operator to exclude matching records:
  
```sql
source=accounts
| where NOT state = 'CA'
| fields account_number, state
```
{% include copy.html %}
  
The query returns the following results:
  
| account_number | state |
| --- | --- |
| 1 | IL |
| 6 | TN |
| 13 | VA |
| 18 | MD |
  

## Example 6: Filter using value lists  

The following query uses an `IN` operator to match multiple values:
  
```sql
source=accounts
| where state IN ('IL', 'VA')
| fields account_number, state
```
{% include copy.html %}
  
The query returns the following results:
  
| account_number | state |
| --- | --- |
| 1 | IL |
| 13 | VA |
  

## Example 7: Filter records with missing data  

The following query returns records in which the `employer` field is `null`:
  
```sql
source=accounts
| where ISNULL(employer)
| fields account_number, employer
```
{% include copy.html %}
  
The query returns the following results:
  
| account_number | employer |
| --- | --- |
| 18 | null |
  

## Example 8: Filter using grouped conditions  

The following query combines multiple conditions using parentheses and logical operators:
  
```sql
source=accounts
| where (balance > 40000 OR age > 35) AND gender = 'M'
| fields account_number, balance, age, gender
```
{% include copy.html %}
  
The query returns the following results:
  
| account_number | balance | age | gender |
| --- | --- | --- | --- |
| 6 | 5686 | 36 | M |
  