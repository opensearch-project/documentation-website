---
layout: default
title: transpose
parent: Commands
grand_parent: PPL
nav_order: 51
---

<!-- vale off -->

# transpose

<!-- vale on -->

The `transpose` command outputs the requested number of rows as columns, converting each result row into a corresponding column of field values.

<!-- vale off -->

## Syntax

<!-- vale on -->

The `transpose` command has the following syntax:

```sql
transpose [int] [column_name=<string>]
```

<!-- vale off -->

## Parameters

<!-- vale on -->

The `transpose` command supports the following parameters.

| Parameter | Required/Optional | Description |
|---|---|---|
| `<int>` | Optional | The number of rows to transform into columns. Default is `5`. Maximum is `10000`. |
| `column_name=<string>` | Optional | The name of the first column to use when transposing rows. This column holds the field names. |

<!-- vale off -->

## Example 1: Transposing a severity breakdown

<!-- vale on -->

The following query transposes a severity breakdown into a columnar format. This is useful for creating compact summary views:

```sql
source=otellogs
| stats count() as log_count by severityText
| sort severityText
| transpose
```
{% include copy.html %}
{% include try-in-playground.html %}

The query returns the following results:

<!-- vale off -->

| column | row 1 | row 2 | row 3 | row 4 | row 5 |
| --- | --- | --- | --- | --- | --- |
| log_count | 3 | 7 | 6 | 4 | null |
| severityText | DEBUG | ERROR | INFO | WARN | null |

<!-- vale on -->

<!-- vale off -->

## Example 2: Transposing a limited number of rows

<!-- vale on -->

The following query transposes only the first three severity levels:

```sql
source=otellogs
| stats count() as log_count by severityText
| sort severityText
| transpose 3
```
{% include copy.html %}
{% include try-in-playground.html %}

The query returns the following results:

<!-- vale off -->

| column | row 1 | row 2 | row 3 |
| --- | --- | --- | --- |
| log_count | 3 | 7 | 6 |
| severityText | DEBUG | ERROR | INFO |

<!-- vale on -->

<!-- vale off -->

## Limitations

<!-- vale on -->

The `transpose` command converts a specified number of rows into columns. If fewer rows are available, the missing values are represented as `null` columns.
