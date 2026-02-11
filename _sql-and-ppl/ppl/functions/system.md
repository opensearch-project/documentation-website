---
layout: default
title: System functions
parent: Functions
grand_parent: PPL
nav_order: 14
canonical_url: https://docs.opensearch.org/latest/sql-and-ppl/ppl/functions/system/
---

# System functions

The following system functions are supported in PPL.

## TYPEOF

**Usage**: `TYPEOF(expr)`

Returns the data type of the given expression. This is useful for troubleshooting or dynamically constructing SQL queries.

**Parameters**:

- `expr` (Required): The expression to determine the data type for. Can be any data type.

**Return type**: `STRING`

### Example  
  
```sql
source=people
| eval `typeof(date)` = typeof(DATE('2008-04-14')), `typeof(int)` = typeof(1), `typeof(now())` = typeof(now()), `typeof(column)` = typeof(accounts)
| fields `typeof(date)`, `typeof(int)`, `typeof(now())`, `typeof(column)`
```
{% include copy.html %}
  
The query returns the following results:
  
| typeof(date) | typeof(int) | typeof(now()) | typeof(column) |
| --- | --- | --- | --- |
| DATE | INT | TIMESTAMP | STRUCT |
