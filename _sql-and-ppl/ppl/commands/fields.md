---
layout: default
title: fields
parent: Commands
grand_parent: PPL
nav_order: 16
---

# fields

The `fields` command specifies the fields that should be included in or excluded from the search results.

## Syntax

The `fields` command has the following syntax:

```sql
fields [+|-] <field-list>
```

## Parameters

The `fields` command supports the following parameters.

| Parameter | Required/Optional | Description |
| --- | --- | --- |
| `<field-list>` | Required | A comma-delimited or space-delimited list of fields to keep or remove. Supports wildcard patterns. |
| `[+|-]` | Optional | If the plus sign (`+`) is used, only the fields specified in the `field-list` are included. If the minus sign (`-`) is used, all fields specified in the `field-list` are excluded. Default is `+`. |
  

## Example 1: Select specified fields from the search result

The following query shows how to retrieve the `account_number`, `firstname`, and `lastname` fields from the search results:
  
```sql
source=accounts
| fields account_number, firstname, lastname
```
{% include copy.html %}
  
The query returns the following results:
  
| account_number | firstname | lastname |
| --- | --- | --- |
| 1 | Amber | Duke |
| 6 | Hattie | Bond |
| 13 | Nanette | Bates |
| 18 | Dale | Adams |
  

## Example 2: Remove specified fields from the search results 

The following query shows how to remove the `account_number` field from the search results:
  
```sql
source=accounts
| fields account_number, firstname, lastname
| fields - account_number
```
{% include copy.html %}
  
The query returns the following results:
  
| firstname | lastname |
| --- | --- |
| Amber | Duke |
| Hattie | Bond |
| Nanette | Bates |
| Dale | Adams |
  

## Example 3: Space-delimited field selection  

Fields can be specified using spaces instead of commas, providing a more concise syntax:
  
```sql
source=accounts
| fields firstname lastname age
```
{% include copy.html %}
  
The query returns the following results:
  
| firstname | lastname | age |
| --- | --- | --- |
| Amber | Duke | 32 |
| Hattie | Bond | 36 |
| Nanette | Bates | 28 |
| Dale | Adams | 33 |
  

## Example 4: Prefix wildcard pattern  

The following query selects fields starting with a pattern using prefix wildcards:
  
```sql
source=accounts
| fields account*
```
{% include copy.html %}
  
The query returns the following results:
  
| account_number |
| --- |
| 1 |
| 6 |
| 13 |
| 18 |
  

## Example 5: Suffix wildcard pattern  

The following query selects fields ending with a pattern using suffix wildcards:
  
```sql
source=accounts
| fields *name
```
{% include copy.html %}
  
The query returns the following results:
  
| firstname | lastname |
| --- | --- |
| Amber | Duke |
| Hattie | Bond |
| Nanette | Bates |
| Dale | Adams |
  

## Example 6: Wildcard pattern matching  

The following query selects fields containing a pattern using `contains` wildcards:
  
```sql
source=accounts
| fields *a*
| head 1
```
{% include copy.html %}
  
The query returns the following results:
  
| account_number | firstname | address | balance | state | age | email | lastname |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Amber | 880 Holmes Lane | 39225 | IL | 32 | amberduke@pyrami.com | Duke |
  

## Example 7: Mixed delimiter syntax  

The following query combines spaces and commas for flexible field specification:
  
```sql
source=accounts
| fields firstname, account* *name
```
{% include copy.html %}
  
The query returns the following results:
  
| firstname | account_number | lastname |
| --- | --- | --- |
| Amber | 1 | Duke |
| Hattie | 6 | Bond |
| Nanette | 13 | Bates |
| Dale | 18 | Adams |
  

## Example 8: Field deduplication  

The following query automatically prevents duplicate columns when wildcards expand to already specified fields:
  
```sql
source=accounts
| fields firstname, *name
```
{% include copy.html %}
  
The query returns the following results. Even though `firstname` is explicitly specified and also matches `*name`, it appears only once because of automatic deduplication:
  
| firstname | lastname |
| --- | --- |
| Amber | Duke |
| Hattie | Bond |
| Nanette | Bates |
| Dale | Adams |

## Example 9: Full wildcard selection  

The following query selects all available fields using `*` or `` `*` ``. This expression selects all fields defined in the index schema, including fields that may contain null values. The `*` wildcard selects fields based on the index schema, not on the data content, so fields with null values are included in the result set. Use backticks (`` `*` ``) if the plain `*` does not return all expected fields:
  
```sql
source=accounts
| fields `*`
| head 1
```
{% include copy.html %}
  
The query returns the following results:
  
| account_number | firstname | address | balance | gender | city | employer | state | age | email | lastname |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Amber | 880 Holmes Lane | 39225 | M | Brogan | Pyrami | IL | 32 | amberduke@pyrami.com | Duke |

## Example 10: Wildcard exclusion  

The following query removes fields using wildcard patterns containing the minus (`-`) operator:
  
```sql
source=accounts
| fields - *name
```
{% include copy.html %}
  
The query returns the following results:
  
| account_number | address | balance | gender | city | employer | state | age | email |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 880 Holmes Lane | 39225 | M | Brogan | Pyrami | IL | 32 | amberduke@pyrami.com |
| 6 | 671 Bristol Street | 5686 | M | Dante | Netagy | TN | 36 | hattiebond@netagy.com |
| 13 | 789 Madison Street | 32838 | F | Nogal | Quility | VA | 28 | null |
| 18 | 467 Hutchinson Court | 4180 | M | Orick | null | MD | 33 | daleadams@boink.com |
  

## Related documentation 

- [`table`]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/table/) -- An alias command with identical functionality  