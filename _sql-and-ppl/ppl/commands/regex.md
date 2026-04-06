---
layout: default
title: regex
parent: Commands
grand_parent: PPL
nav_order: 36
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

## Example 1: Find logs matching a pattern  

The following query finds error logs mentioning connection timeouts:
  
```sql
source=otellogs
| where severityText = 'ERROR'
| regex body=".*timeout.*"
| fields severityText, `resource.attributes.service.name`, body
```
{% include copy.html %}
{% include try-in-playground.html %}
  
The query returns the following results:
  
| severityText | resource.attributes.service.name | body |
| --- | --- | --- |
| ERROR | payment | Payment failed: connection timeout to payment gateway after 30000ms |
  

## Example 2: Exclude logs matching a pattern  

The following query finds all errors except those related to timeouts:
  
```sql
source=otellogs
| where severityText = 'ERROR'
| regex body!=".*timeout.*"
| fields severityText, `resource.attributes.service.name`, body
| head 3
```
{% include copy.html %}
{% include try-in-playground.html %}
  
The query returns the following results:
  
| severityText | resource.attributes.service.name | body |
| --- | --- | --- |
| ERROR | checkout | NullPointerException in CheckoutService.placeOrder at line 142 |
| ERROR | payment | Out of memory: Java heap space - shutting down pod payment-6f8d4b-ht7q3 |
| ERROR | frontend-proxy | [2024-02-01T09:20:00.456Z] "POST /api/checkout HTTP/1.1" 503 - 0 30000 checkout-8d4f7b-mk2p9 |
  

## Example 3: Filter by service name pattern  

The following query finds warning logs from services whose names end with "catalog":
  
```sql
source=otellogs
| where severityText = 'WARN'
| regex `resource.attributes.service.name`=".*catalog$"
| fields severityText, `resource.attributes.service.name`, body
```
{% include copy.html %}
{% include try-in-playground.html %}
  
The query returns the following results:
  
| severityText | resource.attributes.service.name | body |
| --- | --- | --- |
| WARN | product-catalog | Slow query detected: SELECT \* FROM products WHERE category = 'electronics' took 3200ms |
| WARN | product-catalog | Connection pool 80% utilized on database replica db-replica-02 |
  

## Example 4: Complex patterns with character classes

The following query uses complex regex patterns with character classes and quantifiers to match log messages containing service method calls:

```sql
source=otellogs
| where severityText = 'ERROR'
| regex body="[A-Z][a-zA-Z]+\\.[a-zA-Z]+"
| fields severityText, body
| head 3
```
{% include copy.html %}
{% include try-in-playground.html %}

The query returns the following results:

| severityText | body |
| --- | --- |
| ERROR | NullPointerException in CheckoutService.placeOrder at line 142 |

## Example 5: Case-sensitive matching

By default, regex matching is case sensitive. The following query searches for lowercase `error`:

```sql
source=otellogs
| regex severityText="error"
| fields severityText
```
{% include copy.html %}
{% include try-in-playground.html %}

The query returns no results because the regex pattern `error` (lowercase) does not match `ERROR` (uppercase):

## Limitations

The `regex` command has the following limitations:

* A field name must be specified in the `regex` command. Pattern-only syntax (for example, `regex "pattern"`) is not supported.
* The `regex` command only supports string fields. Using it on numeric or Boolean fields results in an error.  
