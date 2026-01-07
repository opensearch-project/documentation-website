---
layout: default
title: System Functions
parent: Functions
grand_parent: PPL
nav_order: 14
---
# System Functions  

## TYPEOF  

### Description  

Usage: `typeof(expr)` function returns name of the data type of the value that is passed to it. This can be helpful for troubleshooting or dynamically constructing SQL queries.

**Argument type:** `ANY`  
**Return type:** `STRING`  

### Example  
  
```sql
source=people
| eval `typeof(date)` = typeof(DATE('2008-04-14')), `typeof(int)` = typeof(1), `typeof(now())` = typeof(now()), `typeof(column)` = typeof(accounts)
| fields `typeof(date)`, `typeof(int)`, `typeof(now())`, `typeof(column)`
```
{% include copy.html %}
  
Expected output:
  
| typeof(date) | typeof(int) | typeof(now()) | typeof(column) |
| --- | --- | --- | --- |
| DATE | INT | TIMESTAMP | STRUCT |
  
