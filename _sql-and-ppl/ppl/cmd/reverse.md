---
layout: default
title: "reverse"
parent: "Commands"
grand_parent: "PPL"
nav_order: 32
---
# reverse


The `reverse` command reverses the display order of search results. The same results are returned, but in reverse order.

## Syntax

Use the following syntax:

`reverse`  
* No parameters: The reverse command takes no arguments or options.  
  

## Note  

The `reverse` command processes the entire dataset. If applied directly to millions of records, it will consume significant memory resources on the coordinating node. Users should only apply the `reverse` command to smaller datasets, typically after aggregation operations.

## Example 1: Basic reverse operation  

The following example PPL query shows how to use `reverse` to reverse the order of all documents.
  
```sql
source=accounts
| fields account_number, age
| reverse
```
{% include copy.html %}
  
Expected output:
  
| account_number | age |
| --- | --- |
| 6 | 36 |
| 18 | 33 |
| 1 | 32 |
| 13 | 28 |
  

## Example 2: Reverse with sort  

The following example PPL query shows how to use `reverse` to reverse results after sorting by age in ascending order, effectively giving descending order.
  
```sql
source=accounts
| sort age
| fields account_number, age
| reverse
```
{% include copy.html %}
  
Expected output:
  
| account_number | age |
| --- | --- |
| 6 | 36 |
| 18 | 33 |
| 1 | 32 |
| 13 | 28 |
  

## Example 3: Reverse with head  

The following example PPL query shows how to use `reverse` with head to get the last 2 records from the original order.
  
```sql
source=accounts
| reverse
| head 2
| fields account_number, age
```
{% include copy.html %}
  
Expected output:
  
| account_number | age |
| --- | --- |
| 6 | 36 |
| 18 | 33 |
  

## Example 4: Double reverse  

The following example PPL query demonstrates that applying reverse twice returns to the original order.
  
```sql
source=accounts
| reverse
| reverse
| fields account_number, age
```
{% include copy.html %}
  
Expected output:
  
| account_number | age |
| --- | --- |
| 13 | 28 |
| 1 | 32 |
| 18 | 33 |
| 6 | 36 |
  

## Example 5: Reverse with complex pipeline  

The following example PPL query shows how to use `reverse` with filtering and field selection.
  
```sql
source=accounts
| where age > 30
| fields account_number, age
| reverse
```
{% include copy.html %}
  
Expected output:
  
| account_number | age |
| --- | --- |
| 6 | 36 |
| 18 | 33 |
| 1 | 32 |
  