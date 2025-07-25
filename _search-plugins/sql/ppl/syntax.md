---
layout: default
title: Syntax
parent: PPL - Piped Processing Language
grand_parent: SQL and PPL
nav_order: 1
canonical_url: https://docs.opensearch.org/latest/search-plugins/sql/ppl/syntax/
---

# PPL syntax

Every PPL query starts with the `search` command. It specifies the index to search and retrieve documents from. Subsequent commands can follow in any order.

Currently, `PPL` supports only one `search` command, which can be omitted to simplify the query.
{ : .note}

## Syntax

```sql
search source=<index> [boolean-expression]
source=<index> [boolean-expression]
```

Field | Description | Required
:--- | :--- |:---
`search` | Specifies search keywords. | Yes
`index` | Specifies which index to query from. | No
`bool-expression` | Specifies an expression that evaluates to a Boolean value. | No

## Examples

**Example 1: Search through accounts index**

In the following example, the `search` command refers to an `accounts` index as the source and uses `fields` and `where` commands for the conditions:

```sql
search source=accounts
| where age > 18
| fields firstname, lastname
```

In the following examples, angle brackets `< >` enclose required arguments and square brackets `[ ]` enclose optional arguments.
{: .note }


**Example 2: Get all documents**

To get all documents from the `accounts` index, specify it as the `source`:

```sql
search source=accounts;
```

| account_number | firstname | address | balance | gender | city | employer | state | age | email | lastname |
:--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---
| 1  | Amber  | 880 Holmes Lane | 39225 | M | Brogan | Pyrami | IL | 32 | amberduke@pyrami.com  | Duke
| 6  | Hattie | 671 Bristol Street | 5686 | M | Dante | Netagy | TN | 36  | hattiebond@netagy.com | Bond
| 13 | Nanette | 789 Madison Street | 32838 | F | Nogal | Quility | VA | 28 | null | Bates
| 18 | Dale  | 467 Hutchinson Court | 4180 | M | Orick | null | MD | 33 | daleadams@boink.com | Adams

**Example 3: Get documents that match a condition**

To get all documents from the `accounts` index that either have `account_number` equal to 1 or have `gender` as `F`, use the following query:

```sql
search source=accounts account_number=1 or gender=\"F\";
```

| account_number | firstname | address | balance | gender | city | employer | state | age | email | lastname |
:--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---
| 1 | Amber | 880 Holmes Lane | 39225 | M | Brogan | Pyrami | IL | 32 | amberduke@pyrami.com | Duke |
| 13 | Nanette | 789 Madison Street | 32838 | F | Nogal | Quility | VA | 28 | null | Bates |
