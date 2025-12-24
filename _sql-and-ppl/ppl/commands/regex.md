---
layout: default
title: regex
parent: Commands
grand_parent: PPL
nav_order: 30
---

# regex

The `regex` command filters search results by matching field values against a regular expression pattern. Only documents in which the specified field matches the pattern are included in the results.

## Syntax

The `regex` command has the following syntax:

```sql
regex <field> = <pattern>
regex <field> != <pattern>
```

The following operators are supported:

* `=` -- Positive matching (include matches)
* `!=` -- Negative matching (exclude matches)

The `regex` command uses Java's built-in regular expression engine, which supports:

* **Standard regex features**: Character classes, quantifiers, anchors.  
* **Named capture groups**: `(?<name>pattern)` syntax.  
* **Lookahead/lookbehind**: `(?=...)` and `(?<=...)` assertions.  
* **Inline flags**: Case-insensitive `(?i)`, multiline `(?m)`, dotall `(?s)`, and other modes.  

## Parameters

The `regex` command supports the following parameters.

| Parameter | Required/Optional | Description |
| --- | --- | --- |
| `<field>` | Required | The field name to match against. |
| `<pattern>` | Required | The regular expression pattern to match. Supports [Java regular expression syntax](https://docs.oracle.com/javase/8/docs/api/java/util/regex/Pattern.html). |

## Example 1: Basic pattern matching  

The following query uses the `regex` command to return any document in which the `lastname` field starts with an uppercase letter:
  
```sql
source=accounts
| regex lastname="^[A-Z][a-z]+$"
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
  

## Example 2: Negative matching

The following query excludes documents in which the `lastname` field ends with `ms`:

```sql
source=accounts
| regex lastname!=".*ms$"
| fields account_number, lastname
```
{% include copy.html %}
  
The query returns the following results:
  
| account_number | lastname |
| --- | --- |
| 1 | Duke |
| 6 | Bond |
| 13 | Bates |
  

## Example 3: Email domain matching  

The following query filters documents by email domain patterns:
  
```sql
source=accounts
| regex email="@pyrami\.com$"
| fields account_number, email
```
{% include copy.html %}
  
The query returns the following results:
  
| account_number | email |
| --- | --- |
| 1 | amberduke@pyrami.com |
  

## Example 4: Complex patterns with character classes  

The following query uses complex regex patterns with character classes and quantifiers:
  
```sql
source=accounts | regex address="\\d{3,4}\\s+[A-Z][a-z]+\\s+(Street|Lane|Court)" | fields account_number, address
```
{% include copy.html %}
  
The query returns the following results:
  
| account_number | address |
| --- | --- |
| 1 | 880 Holmes Lane |
| 6 | 671 Bristol Street |
| 13 | 789 Madison Street |
| 18 | 467 Hutchinson Court |
  

## Example 5: Case-sensitive matching  

By default, regex matching is case sensitive. The following query searches for the lowercase state name `va`:
  
```sql
source=accounts
| regex state="va"
| fields account_number, state
```
{% include copy.html %}
  
The query returns no results because the regex pattern `va` (lowercase) does not match any state values in the data.
  
The following query searches for the uppercase state name `VA`:

```sql
source=accounts
| regex state="VA"
| fields account_number, state
```
{% include copy.html %}
  
The query returns the following results:
  
| account_number | state |
| --- | --- |
| 13 | VA |
  

## Limitations

The `regex` command has the following limitations:

* A field name must be specified in the `regex` command. Pattern-only syntax (for example, `regex "pattern"`) is not supported.
* The `regex` command only supports string fields. Using it on numeric or Boolean fields results in an error.  