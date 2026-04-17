---
layout: default
title: transpose
parent: Commands
grand_parent: PPL
nav_order: 51
---
# transpose

The `transpose` command outputs the requested number of rows as columns, effectively transposing each result row into a corresponding column of field values.

## Syntax

transpose [int] [column_name=<string>]

* number-of-rows: optional. The number of rows to transform into columns. Default value is 5. Maximum allowed is 10000.
* column_name: optional. The name of the first column to use when transposing rows. This column holds the field names.


## Example 1: Transpose severity breakdown

The following query transposes a severity breakdown into a columnar format, useful for creating compact summary views:

```sql
source=otellogs
| stats count() as log_count by severityText
| sort severityText
| transpose
```
{% include copy.html %}
{% include try-in-playground.html %}

Expected output:

| column | row 1 | row 2 | row 3 | row 4 | row 5 |
| --- | --- | --- | --- | --- | --- |
| log_count | 3 | 7 | 6 | 4 | null |
| severityText | DEBUG | ERROR | INFO | WARN | null |

## Example 2: Transpose with a limited number of rows

The following query transposes only the first 3 severity levels:

```sql
source=otellogs
| stats count() as log_count by severityText
| sort severityText
| transpose 3
```
{% include copy.html %}
{% include try-in-playground.html %}

Expected output:

| column | row 1 | row 2 | row 3 |
| --- | --- | --- | --- |
| log_count | 3 | 7 | 6 |
| severityText | DEBUG | ERROR | INFO |

## Limitations

The `transpose` command transforms up to a number of rows specified and if not enough rows found, it shows those transposed rows as null columns. 
