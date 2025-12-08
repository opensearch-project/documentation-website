---
layout: default
title: "table"
parent: "Commands"
grand_parent: "PPL"
nav_order: 42
---
# table


The `table` command is an alias for the [`fields`]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/cmd/fields/) command and provides the same field selection capabilities. It allows you to keep or remove fields from the search results using enhanced syntax options.

## Syntax

Use the following syntax:

`table [+|-] <field-list>`
* `[+|-]`: optional. If the plus (+) is used, only the fields specified in the field list will be kept. If the minus (-) is used, all the fields specified in the field list will be removed. **Default:** +.  
* `field-list`: mandatory. Comma-delimited or space-delimited list of fields to keep or remove. Supports wildcard patterns.  
  

## Example 1: Basic table command usage  

The following example PPL query shows basic field selection using the table command.
  
```sql
source=accounts
| table firstname lastname age
```
{% include copy.html %}
  
Expected output:
  
| firstname | lastname | age |
| --- | --- | --- |
| Amber | Duke | 32 |
| Hattie | Bond | 36 |
| Nanette | Bates | 28 |
| Dale | Adams | 33 |
  

## See also  

- [fields]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/cmd/fields/) - Alias command with identical functionality  