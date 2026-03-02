---
layout: default
title: rename
parent: Commands
grand_parent: PPL
nav_order: 31
---

# rename

The `rename` command renames one or more fields in the search results.

The `rename` command handles non-existent fields as follows:

* **Renaming a non-existent field to a non-existent field**: No change occurs to the search results.
* **Renaming a non-existent field to an existing field**: The existing target field is removed from the search results.
* **Renaming an existing field to an existing field**: The existing target field is removed and the source field is renamed to the target.

The `rename` command is not rewritten to [query domain-specific language (DSL)]({{site.url}}{{site.baseurl}}/query-dsl/). It is only executed on the coordinating node.
{: .note}

## Syntax

The `rename` command has the following syntax:

```sql
rename <source-field> AS <target-field>["," <source-field> AS <target-field>]...
```

## Parameters

The `rename` command supports the following parameters.

| Parameter | Required/Optional | Description |
| --- | --- | --- |
| `<source-field>` | Required | The name of the field you want to rename. Supports wildcard patterns using `*`. |
| `<target-field>` | Required | The name you want to rename to. Must contain the same number of wildcards as the source. |

## Example 1: Rename a field  

The following query renames one field:
  
```sql
source=accounts
| rename account_number as an
| fields an
```
{% include copy.html %}
  
The query returns the following results:
  
| an |
| --- |
| 1 |
| 6 |
| 13 |
| 18 |
  

## Example 2: Rename multiple fields  

The following query renames multiple fields:
  
```sql
source=accounts
| rename account_number as an, employer as emp
| fields an, emp
```
{% include copy.html %}
  
The query returns the following results:
  
| an | emp |
| --- | --- |
| 1 | Pyrami |
| 6 | Netagy |
| 13 | Quility |
| 18 | null |
  

## Example 3: Rename fields using wildcards  

The following query renames multiple fields using wildcard patterns:
  
```sql
source=accounts
| rename *name as *_name
| fields first_name, last_name
```
{% include copy.html %}
  
The query returns the following results:
  
| first_name | last_name |
| --- | --- |
| Amber | Duke |
| Hattie | Bond |
| Nanette | Bates |
| Dale | Adams |
  

## Example 4: Rename fields using multiple wildcard patterns  

The following query renames multiple fields using multiple wildcard patterns:
  
```sql
source=accounts
| rename *name as *_name, *_number as *number
| fields first_name, last_name, accountnumber
```
{% include copy.html %}
  
The query returns the following results:
  
| first_name | last_name | accountnumber |
| --- | --- | --- |
| Amber | Duke | 1 |
| Hattie | Bond | 6 |
| Nanette | Bates | 13 |
| Dale | Adams | 18 |
  

## Example 5: Rename an existing field to another existing field  

The following query renames an existing field to another existing field. The target field is removed and the source field is renamed to the target field:
  
```sql
source=accounts
| rename firstname as age
| fields age
```
{% include copy.html %}
  
The query returns the following results:
  
| age |
| --- |
| Amber |
| Hattie |
| Nanette |
| Dale |
  

## Limitations

The `rename` command has the following limitations:

* Literal asterisk (`*`) characters in field names cannot be replaced because the asterisk is used for wildcard matching.