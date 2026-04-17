---
layout: default
title: mvexpand
parent: Commands
grand_parent: PPL
nav_order: 31
---

# mvexpand

The `mvexpand` command expands each value in a multivalue (array) field into a separate row. For each document, every element in the specified array field is returned as a new row.

## Syntax

The `mvexpand` command has the following syntax:

```sql
mvexpand <field> [limit=<int>]
```

## Parameters

The `mvexpand` command supports the following parameters.

| Parameter | Required/Optional | Description |
| --- | --- | --- |
| `<field>` | Required | The multivalue (array) field to expand. |
| `limit` | Optional | Maximum number of values per document to expand. If not specified, all array elements are expanded. |

## Example 1: Basic expansion

The following query creates an array and expands it into separate rows:

```sql
source=people
| eval tags = array('error', 'warning', 'info')
| fields tags
| head 1
| mvexpand tags
| fields tags
```
{% include copy.html %}

The query returns the following results:

| tags |
| --- |
| error |
| warning |
| info |

## Example 2: Expansion with limit

The following query expands an array but limits the number of expanded rows:

```sql
source=people
| eval ids = array(1, 2, 3, 4, 5)
| fields ids
| head 1
| mvexpand ids limit=3
| fields ids
```
{% include copy.html %}

The query returns the following results:

| ids |
| --- |
| 1 |
| 2 |
| 3 |

## Example 3: Expand nested fields

The following query expands a multivalue `projects` field into one row per project:

```sql
source=people
| head 1
| fields projects
| mvexpand projects
| fields projects.name
```
{% include copy.html %}

The query returns the following results:

| projects.name |
| --- |
| AWS Redshift Spectrum querying |
| AWS Redshift security |
| AWS Aurora security |

## Example 4: Single-value array

A single-element array expands to one row:

```sql
source=people
| eval tags = array('error')
| fields tags
| head 1
| mvexpand tags
| fields tags
```
{% include copy.html %}

The query returns the following results:

| tags |
| --- |
| error |

## Example 5: Missing field

If the field does not exist in the input schema, `mvexpand` throws a semantic check exception:

```sql
source=people
| eval some_field = 'x'
| fields some_field
| head 1
| mvexpand tags
| fields tags
```
{% include copy.html %}

```text
{'reason': 'Invalid Query', 'details': "Field 'tags' not found in the schema", 'type': 'SemanticCheckException'}
```

## Related commands

- [`nomv`]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/nomv/) -- Converts a multivalue field into a single-value string
- [`mvcombine`]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/mvcombine/) -- Combines multiple rows into a single row with multivalue fields
