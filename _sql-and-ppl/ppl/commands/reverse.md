---
layout: default
title: reverse
parent: Commands
grand_parent: PPL
nav_order: 39
---

# reverse

The `reverse` command reverses the display order of the search results. It returns the same results but in the opposite order.

The `reverse` command processes the entire dataset. If applied directly to millions of records, it consumes significant coordinating node memory resources. Only apply the `reverse` command to smaller datasets, typically after aggregation operations.
{: .note}

## Syntax

The `reverse` command has the following syntax:

```sql
reverse
```

## Example 1: Basic reverse operation

The following query reverses the order of all documents in the results:

```sql
source=otellogs
| fields severityText, `resource.attributes.service.name`
| head 5
| reverse
```
{% include copy.html %}
{% include try-in-playground.html %}

The query returns the following results:

| severityText | resource.attributes.service.name |
| --- | --- |
| DEBUG | cart |
| ERROR | payment |
| WARN | product-catalog |
| INFO | cart |
| INFO | frontend |

## Example 2: Use the reverse and sort commands

The following query reverses results after sorting by `severityNumber` in ascending order, effectively implementing descending order:

```sql
source=otellogs
| sort severityNumber
| fields severityText, severityNumber
| head 5
| reverse
```
{% include copy.html %}
{% include try-in-playground.html %}

The query returns the following results:

| severityText | severityNumber |
| --- | --- |
| INFO | 9 |
| INFO | 9 |
| DEBUG | 5 |
| DEBUG | 5 |
| DEBUG | 5 |

## Example 3: Use the reverse and head commands

The following query uses the `reverse` command together with the `head` command to retrieve the last two records from the original result order:

```sql
source=otellogs
| reverse
| head 2
| fields severityText, `resource.attributes.service.name`
```
{% include copy.html %}
{% include try-in-playground.html %}

The query returns the following results:

| severityText | resource.attributes.service.name |
| --- | --- |
| ERROR | checkout |
| DEBUG | cart |

## Example 4: Double reverse

The following query shows that applying `reverse` twice returns documents in the original order:

```sql
source=otellogs
| reverse
| reverse
| fields severityText, `resource.attributes.service.name`
| head 5
```
{% include copy.html %}
{% include try-in-playground.html %}

The query returns the following results:

| severityText | resource.attributes.service.name |
| --- | --- |
| INFO | frontend |
| INFO | cart |
| WARN | product-catalog |
| ERROR | payment |
| DEBUG | cart |

## Example 5: Use the reverse command with filtering

The following query uses the `reverse` command with filtering and field selection:

```sql
source=otellogs
| where severityText = 'ERROR'
| fields severityText, `resource.attributes.service.name`
| reverse
```
{% include copy.html %}
{% include try-in-playground.html %}

The query returns the following results:

| severityText | resource.attributes.service.name |
| --- | --- |
| ERROR | checkout |
| ERROR | product-catalog |
| ERROR | recommendation |
| ERROR | frontend-proxy |
| ERROR | payment |
| ERROR | checkout |
| ERROR | payment |
