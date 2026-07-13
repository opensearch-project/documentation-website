---
layout: default
title: nomv
parent: Commands
grand_parent: PPL
nav_order: 32
---

<!-- vale off -->
# nomv
<!-- vale on -->

The `nomv` command converts a multivalue (array) field into a single-value string field by joining all array elements with newline characters (`\n`). This operation is performed in place, replacing the original field with its joined string representation.

The field must be an array type. For scalar fields, use the [`array()`]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/functions/collection/#array) function to convert the value into an array first.
{: .note}

<!-- vale off -->
## Syntax
<!-- vale on -->

The `nomv` command has the following syntax:

```sql
nomv <field>
```

<!-- vale off -->
## Parameters
<!-- vale on -->

The `nomv` command supports the following parameters.

| Parameter | Required/Optional | Description |
| --- | --- | --- |
| `<field>` | Required | The name of the field whose multivalue content should be converted to a single-value string. |

<!-- vale off -->
## Example: Convert a collected list to a single-value string
<!-- vale on -->

The following query collects all service names into an array. It then filters to include only services that reported errors and converts the array into a string:

```sql
source=otellogs
| where severityText = 'ERROR'
| stats list(`resource.attributes.service.name`) as affected_services by severityText
| nomv affected_services
| fields severityText, affected_services
```
{% include copy.html %}
{% include try-in-playground.html %}

The query returns the following results:

<!-- vale off -->
| severityText | affected_services |
| --- | --- |
| ERROR | payment |
|  | checkout |
|  | payment |
|  | frontend-proxy |
|  | recommendation |
|  | product-catalog |
|  | checkout |
<!-- vale on -->

<!-- vale off -->
## Limitations
<!-- vale on -->

The `nomv` command has the following limitations:

- The `nomv` command is only available when the Apache Calcite query engine is enabled.
- The newline delimiter (`\n`) is fixed and cannot be customized. For custom delimiters, use the [`mvjoin`]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/functions/collection/#mvjoin) function directly in an [`eval`]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/eval/) expression.
- `NULL` values within the array are automatically filtered out and do not appear in the output.

<!-- vale off -->
## Related commands
<!-- vale on -->

- [`mvcombine`]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/mvcombine/) -- Combines multiple rows into a single row with multivalue fields.
- [`mvexpand`]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/mvexpand/) -- Expands multivalue fields into separate rows.
