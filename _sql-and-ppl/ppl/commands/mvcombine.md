---
layout: default
title: mvcombine
parent: Commands
grand_parent: PPL
nav_order: 30
---

<!-- vale off -->

# mvcombine

<!-- vale on -->

The `mvcombine` command groups rows that are identical across all fields except a specified target field, and combines the values of that target field into a multivalue (array) field.

Rows are grouped by all fields currently in the pipeline except the target field. Rows in which the target field is missing or `null` are excluded from the combined multivalue output.
{: .note}

<!-- vale off -->

## Syntax

<!-- vale on -->

The `mvcombine` command has the following syntax:

```sql
mvcombine <field>
```

<!-- vale off -->

## Parameters

<!-- vale on -->

The `mvcombine` command supports the following parameters.

| Parameter | Required/Optional | Description |
| --- | --- | --- |
| `<field>` | Required | The name of the field whose values are combined into a multivalue field. |

<!-- vale off -->

## Example 1: Using basic mvcombine

<!-- vale on -->

The following query collapses rows into a single row and combines `packets_str` into a multivalue field:

```sql
source=mvcombine_data
| where ip='10.0.0.1' and bytes=100 and tags='t1'
| fields ip, bytes, tags, packets_str
| mvcombine packets_str
```
{% include copy.html %}

The query returns the following results:

<!-- vale off -->

| ip | bytes | tags | packets_str |
| --- | --- | --- | --- |
| 10.0.0.1 | 100 | t1 | [10,20,30] |

<!-- vale on -->

<!-- vale off -->

## Example 2: Combining multiple groups

<!-- vale on -->

The following query produces one output row per group key:

```sql
source=mvcombine_data
| where bytes=700 and tags='t7'
| fields ip, bytes, tags, packets_str
| sort ip, packets_str
| mvcombine packets_str
| sort ip
```
{% include copy.html %}

The query returns the following results:

<!-- vale off -->

| ip | bytes | tags | packets_str |
| --- | --- | --- | --- |
| 10.0.0.7 | 700 | t7 | [1,2] |
| 10.0.0.8 | 700 | t7 | [9] |

<!-- vale on -->

<!-- vale off -->

## Example 3: Missing target field in some rows

<!-- vale on -->

Rows missing the target field do not contribute a value to the combined output:

```sql
source=mvcombine_data
| where ip='10.0.0.3' and bytes=300 and tags='t3'
| fields ip, bytes, tags, packets_str
| mvcombine packets_str
```
{% include copy.html %}

The query returns the following results:

<!-- vale off -->

| ip | bytes | tags | packets_str |
| --- | --- | --- | --- |
| 10.0.0.3 | 300 | t3 | [5] |

<!-- vale on -->

<!-- vale off -->

## Example 4: Missing fields

<!-- vale on -->

The following query attempts to combine values for a field that does not exist in the current schema:

```sql
source=mvcombine_data
| mvcombine does_not_exist
```
{% include copy.html %}

The query returns the following error:

```text
{'reason': 'Invalid Query', 'details': 'Field [does_not_exist] not found.', 'type': 'IllegalArgumentException'}
```

<!-- vale off -->

## Related commands

<!-- vale on -->

- [`nomv`]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/nomv/) -- Converts a multivalue field into a single-value string
- [`mvexpand`]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/mvexpand/) -- Expands multivalue fields into separate rows
