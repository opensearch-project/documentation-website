---
layout: default
title: "replace"
parent: "Commands"
grand_parent: "PPL"
nav_order: 31
---
# replace


The `replace` command replaces text in one or more fields in the search results. Supports literal string replacement and wildcard patterns using `*`.

## Syntax

Use the following syntax:

`replace '<pattern>' WITH '<replacement>' [, '<pattern>' WITH '<replacement>']... IN <field-name>[, <field-name>]...`
* `pattern`: mandatory. The text pattern you want to replace.  
* `replacement`: mandatory. The text you want to replace with.  
* `field-name`: mandatory. One or more field names where the replacement should occur.  
  

## Example 1: Replace text in one field  

The following example PPL query shows how to use `replace` to replace text in one field.
  
```sql
source=accounts
| replace "IL" WITH "Illinois" IN state
| fields state
```
{% include copy.html %}
  
Expected output:
  
| state |
| --- |
| Illinois |
| TN |
| VA |
| MD |
  

## Example 2: Replace text in multiple fields  

The following example PPL query shows how to use `replace` to replace text in multiple fields.
  
```sql
source=accounts
| replace "IL" WITH "Illinois" IN state, address
| fields state, address
```
{% include copy.html %}
  
Expected output:
  
| state | address |
| --- | --- |
| Illinois | 880 Holmes Lane |
| TN | 671 Bristol Street |
| VA | 789 Madison Street |
| MD | 467 Hutchinson Court |
  

## Example 3: Replace with other commands in a pipeline  

The following example PPL query shows how to use `replace` with other commands in a query pipeline.
  
```sql
source=accounts
| replace "IL" WITH "Illinois" IN state
| where age > 30
| fields state, age
```
{% include copy.html %}
  
Expected output:
  
| state | age |
| --- | --- |
| Illinois | 32 |
| TN | 36 |
| MD | 33 |
  

## Example 4: Replace with multiple pattern/replacement pairs  

The following example PPL query shows how to use `replace` with multiple pattern/replacement pairs in a single replace command. The replacements are applied sequentially.
  
```sql
source=accounts
| replace "IL" WITH "Illinois", "TN" WITH "Tennessee" IN state
| fields state
```
{% include copy.html %}
  
Expected output:
  
| state |
| --- |
| Illinois |
| Tennessee |
| VA |
| MD |
  

## Example 5: Pattern matching with LIKE and replace  

Since replace command only supports plain string literals, you can use LIKE command with replace for pattern matching needs.
  
```sql
source=accounts
| where LIKE(address, '%Holmes%')
| replace "Holmes" WITH "HOLMES" IN address
| fields address, state, gender, age, city
```
{% include copy.html %}
  
Expected output:
  
| address | state | gender | age | city |
| --- | --- | --- | --- | --- |
| 880 HOLMES Lane | IL | M | 32 | Brogan |
  

## Example 6: Wildcard suffix match  

Replace values that end with a specific pattern. The wildcard `*` matches any prefix.
  
```sql
source=accounts
| replace "*IL" WITH "Illinois" IN state
| fields state
```
{% include copy.html %}
  
Expected output:
  
| state |
| --- |
| Illinois |
| TN |
| VA |
| MD |
  

## Example 7: Wildcard prefix match  

Replace values that start with a specific pattern. The wildcard `*` matches any suffix.
  
```sql
source=accounts
| replace "IL*" WITH "Illinois" IN state
| fields state
```
{% include copy.html %}
  
Expected output:
  
| state |
| --- |
| Illinois |
| TN |
| VA |
| MD |
  

## Example 8: Wildcard capture and substitution  

Use wildcards in both pattern and replacement to capture and reuse matched portions. The number of wildcards must match in pattern and replacement.
  
```sql
source=accounts
| replace "* Lane" WITH "Lane *" IN address
| fields address
```
{% include copy.html %}
  
Expected output:
  
| address |
| --- |
| Lane 880 Holmes |
| 671 Bristol Street |
| 789 Madison Street |
| 467 Hutchinson Court |
  

## Example 9: Multiple wildcards for pattern transformation  

Use multiple wildcards to transform patterns. Each wildcard in the replacement substitutes the corresponding captured value.
  
```sql
source=accounts
| replace "* *" WITH "*_*" IN address
| fields address
```
{% include copy.html %}
  
Expected output:
  
| address |
| --- |
| 880_Holmes Lane |
| 671_Bristol Street |
| 789_Madison Street |
| 467_Hutchinson Court |
  

## Example 10: Wildcard with zero wildcards in replacement  

When replacement has zero wildcards, all matching values are replaced with the literal replacement string.
  
```sql
source=accounts
| replace "*IL*" WITH "Illinois" IN state
| fields state
```
{% include copy.html %}
  
Expected output:
  
| state |
| --- |
| Illinois |
| TN |
| VA |
| MD |
  

## Example 11: Matching literal asterisks  

Use `\*` to match literal asterisk characters (`\*` = literal asterisk, `\\` = literal backslash).
  
```sql
source=accounts
| eval note = 'price: *sale*'
| replace 'price: \*sale\*' WITH 'DISCOUNTED' IN note
| fields note
```
{% include copy.html %}
  
Expected output:
  
| note |
| --- |
| DISCOUNTED |
| DISCOUNTED |
| DISCOUNTED |
| DISCOUNTED |
  

## Example 12: Wildcard with no replacement wildcards  

Use wildcards in pattern but none in replacement to create a fixed output.
  
```sql
source=accounts
| eval test = 'prefix-value-suffix'
| replace 'prefix-*-suffix' WITH 'MATCHED' IN test
| fields test
```
{% include copy.html %}
  
Expected output:
  
| test |
| --- |
| MATCHED |
| MATCHED |
| MATCHED |
| MATCHED |
  

## Example 13: Escaped asterisks with wildcards  

Combine escaped asterisks (literal) with wildcards for complex patterns.
  
```sql
source=accounts
| eval label = 'file123.txt'
| replace 'file*.*' WITH '\**.*' IN label
| fields label
```
{% include copy.html %}
  
Expected output:
  
| label |
| --- |
| *123.txt |
| *123.txt |
| *123.txt |
| *123.txt |
  

## Limitations  

* `Wildcards`: `*` matches zero or more characters (case-sensitive)  
* Replacement wildcards must match pattern wildcard count, or be zero  
* Escape sequences: `\*` (literal asterisk), `\\` (literal backslash)  