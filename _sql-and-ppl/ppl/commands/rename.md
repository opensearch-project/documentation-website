---
layout: default
title: rename
parent: Commands
grand_parent: PPL
nav_order: 37
---

<!-- vale off -->

# rename

<!-- vale on -->

The `rename` command renames one or more fields in the search results.

The `rename` command handles non-existent fields as follows:

* **Renaming a non-existent field to a non-existent field**: No change occurs to the search results.
* **Renaming a non-existent field to an existing field**: The existing target field is removed from the search results.
* **Renaming an existing field to an existing field**: The existing target field is removed and the source field is renamed to the target.

The `rename` command is not rewritten to [query domain-specific language (DSL)]({{site.url}}{{site.baseurl}}/query-dsl/). It is only executed on the coordinating node.
{: .note}

<!-- vale off -->

## Syntax

<!-- vale on -->

The `rename` command has the following syntax:

```sql
rename <source-field> AS <target-field>[, <source-field> AS <target-field>]...
```

<!-- vale off -->

## Parameters

<!-- vale on -->

The `rename` command supports the following parameters.

| Parameter | Required/Optional | Description |
| --- | --- | --- |
| `<source-field>` | Required | The name of the field you want to rename. Supports wildcard patterns using `*`. |
| `<target-field>` | Required | The name you want to rename to. Must contain the same number of wildcards as the source. |

<!-- vale off -->

## Example 1: Renaming a field  

<!-- vale on -->

The following query renames one field:
  
```sql
source=otellogs
| rename severityText as severity
| fields severity
| head 4
```
{% include copy.html %}
{% include try-in-playground.html %}
  
The query returns the following results:
  
<!-- vale off -->

| severity |
| --- |
| INFO |
| INFO |
| WARN |
| ERROR |

<!-- vale on -->
  

<!-- vale off -->

## Example 2: Renaming multiple fields  

<!-- vale on -->

The following query renames multiple fields:
  
```sql
source=otellogs
| rename severityText as severity, `resource.attributes.service.name` as service
| fields severity, service
| head 4
```
{% include copy.html %}
{% include try-in-playground.html %}
  
The query returns the following results:
  
<!-- vale off -->

| severity | service |
| --- | --- |
| INFO | frontend |
| INFO | cart |
| WARN | product-catalog |
| ERROR | payment |

<!-- vale on -->
  

<!-- vale off -->

## Example 3: Renaming fields using wildcards  

<!-- vale on -->

The following query renames multiple fields using a wildcard pattern. Both `severityText` and `severityNumber` match `severity*` and are renamed to `sev*`:
  
```sql
source=otellogs
| rename severity* as sev*
| fields sevText, sevNumber
| head 4
```
{% include copy.html %}
{% include try-in-playground.html %}
  
The query returns the following results:
  
<!-- vale off -->

| sevText | sevNumber |
| --- | --- |
| INFO | 9 |
| INFO | 9 |
| WARN | 13 |
| ERROR | 17 |

<!-- vale on -->
  

<!-- vale off -->

## Example 4: Renaming fields using multiple wildcard patterns  

<!-- vale on -->

The following query renames multiple fields using multiple wildcard patterns:
  
```sql
source=otellogs
| rename severity* as sev*, `@*` as otel_*
| fields sevText, sevNumber, otel_timestamp
| head 4
```
{% include copy.html %}
{% include try-in-playground.html %}
  
The query returns the following results:
  
<!-- vale off -->

| sevText | sevNumber | otel_timestamp |
| --- | --- | --- |
| INFO | 9 | 2024-02-01 09:10:00 |
| INFO | 9 | 2024-02-01 09:11:00 |
| WARN | 13 | 2024-02-01 09:12:00 |
| ERROR | 17 | 2024-02-01 09:13:00 |

<!-- vale on -->
  

<!-- vale off -->

## Example 5: Renaming an existing field to another existing field  

<!-- vale on -->

The following query renames an existing field to another existing field. The target field is removed and the source field is renamed to the target:
  
```sql
source=otellogs
| rename severityText as body
| fields body
| head 4
```
{% include copy.html %}
{% include try-in-playground.html %}
  
The query returns the following results:
  
<!-- vale off -->

| body |
| --- |
| INFO |
| INFO |
| WARN |
| ERROR |

<!-- vale on -->
  

<!-- vale off -->

## Limitations

<!-- vale on -->

The `rename` command has the following limitations:

* Literal asterisk (`*`) characters in field names cannot be replaced because the asterisk is used for wildcard matching.
