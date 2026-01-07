---
layout: default
title: replace
parent: Commands
grand_parent: PPL
nav_order: 32
---

# replace

The `replace` command replaces text in one or more fields in the search results. It supports literal string replacement and wildcard patterns using `*`.

## Syntax

The `replace` command has the following syntax:

```sql
replace '<pattern>' WITH '<replacement>' [, '<pattern>' WITH '<replacement>']... IN <field-name>[, <field-name>]...
```

## Parameters

The `replace` command supports the following parameters.

| Parameter | Required/Optional | Description |
| --- | --- | --- |
| `<pattern>` | Required | The text pattern to be replaced. |
| `<replacement>` | Required | The text to use as the replacement. |
| `<field-name>` | Required | One or more fields to which the replacement should be applied. |

## Example 1: Replace text in one field  

The following query replaces text in one field:
  
```sql
source=accounts
| replace "IL" WITH "Illinois" IN state
| fields state
```
{% include copy.html %}
  
The query returns the following results:
  
| state |
| --- |
| Illinois |
| TN |
| VA |
| MD |
  

## Example 2: Replace text in multiple fields  

The following query replaces text in multiple fields:
  
```sql
source=accounts
| replace "IL" WITH "Illinois" IN state, address
| fields state, address
```
{% include copy.html %}
  
The query returns the following results:
  
| state | address |
| --- | --- |
| Illinois | 880 Holmes Lane |
| TN | 671 Bristol Street |
| VA | 789 Madison Street |
| MD | 467 Hutchinson Court |
  

## Example 3: Use the replace command in a pipeline

The following query uses the `replace` command with other commands in a query pipeline:
  
```sql
source=accounts
| replace "IL" WITH "Illinois" IN state
| where age > 30
| fields state, age
```
{% include copy.html %}
  
The query returns the following results:
  
| state | age |
| --- | --- |
| Illinois | 32 |
| TN | 36 |
| MD | 33 |
  

## Example 4: Replace text using multiple pattern-replacement pairs

The following query uses the `replace` command with multiple pattern and replacement pairs in a single replace command. The replacements are applied sequentially:
  
```sql
source=accounts
| replace "IL" WITH "Illinois", "TN" WITH "Tennessee" IN state
| fields state
```
{% include copy.html %}
  
The query returns the following results:
  
| state |
| --- |
| Illinois |
| Tennessee |
| VA |
| MD |
  

## Example 5: Pattern matching using LIKE

The following query uses the `LIKE` command with the `replace` command for pattern matching, since the `replace` command only supports plain string literals:
  
```sql
source=accounts
| where LIKE(address, '%Holmes%')
| replace "Holmes" WITH "HOLMES" IN address
| fields address, state, gender, age, city
```
{% include copy.html %}
  
The query returns the following results:
  
| address | state | gender | age | city |
| --- | --- | --- | --- | --- |
| 880 HOLMES Lane | IL | M | 32 | Brogan |
  

## Example 6: Wildcard suffix matching  

The following query shows wildcard suffix matching, in which `*` matches any characters before a specific ending pattern:
  
```sql
source=accounts
| replace "*IL" WITH "Illinois" IN state
| fields state
```
{% include copy.html %}
  
The query returns the following results:
  
| state |
| --- |
| Illinois |
| TN |
| VA |
| MD |
  

## Example 7: Wildcard prefix matching  

The following query shows wildcard prefix matching, in which `*` matches any characters after a specific starting pattern:
  
```sql
source=accounts
| replace "IL*" WITH "Illinois" IN state
| fields state
```
{% include copy.html %}
  
The query returns the following results:
  
| state |
| --- |
| Illinois |
| TN |
| VA |
| MD |
  

## Example 8: Wildcard capture and substitution  

The following query uses wildcards in both the pattern and replacement to capture and reuse matched portions. The number of wildcards must match in the pattern and replacement:
  
```sql
source=accounts
| replace "* Lane" WITH "Lane *" IN address
| fields address
```
{% include copy.html %}
  
The query returns the following results:
  
| address |
| --- |
| Lane 880 Holmes |
| 671 Bristol Street |
| 789 Madison Street |
| 467 Hutchinson Court |
  

## Example 9: Multiple wildcards for pattern transformation  

The following query uses multiple wildcards to transform patterns. Each wildcard in the replacement is substituted with the corresponding captured value:
  
```sql
source=accounts
| replace "* *" WITH "*_*" IN address
| fields address
```
{% include copy.html %}
  
The query returns the following results:
  
| address |
| --- |
| 880_Holmes Lane |
| 671_Bristol Street |
| 789_Madison Street |
| 467_Hutchinson Court |
  

## Example 10: Replace any match with a fixed value  

The following query shows that when the replacement contains zero wildcards, all matching values are replaced with the literal replacement string:
  
```sql
source=accounts
| replace "*IL*" WITH "Illinois" IN state
| fields state
```
{% include copy.html %}
  
The query returns the following results:
  
| state |
| --- |
| Illinois |
| TN |
| VA |
| MD |
  

## Example 11: Matching literal asterisks  

Use `\*` to match literal asterisk characters and `\\` to match literal backslash characters. The following query uses `\*`:
  
```sql
source=accounts
| eval note = 'price: *sale*'
| replace 'price: \*sale\*' WITH 'DISCOUNTED' IN note
| fields note
```
{% include copy.html %}
  
The query returns the following results:
  
| note |
| --- |
| DISCOUNTED |
| DISCOUNTED |
| DISCOUNTED |
| DISCOUNTED |

## Example 12: Replace text with literal asterisk symbols  

The following query shows how to insert literal asterisk symbols into text while using wildcards to preserve other parts of the pattern:
  
```sql
source=accounts
| eval label = 'file123.txt'
| replace 'file*.*' WITH '\**.*' IN label
| fields label
```
{% include copy.html %}
  
The query returns the following results:
  
| label |
| --- |
| \*123.txt |
| \*123.txt |
| \*123.txt |
| \*123.txt |
  

## Limitations

The `replace` command has the following limitations:

* **Wildcards**: The `*` wildcard matches zero or more characters and is case sensitive.
* **Wildcard matching**: Replacement wildcards must match the pattern wildcard count or be zero.
* **Escape sequences**: Use `\*` for literal asterisk and `\\` for literal backslash characters.  