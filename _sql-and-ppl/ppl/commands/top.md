---
layout: default
title: top
parent: Commands
grand_parent: PPL
nav_order: 50
---

# top {#top-command}

The `top` command finds the most common combination of values across all fields specified in the field list.

The `top` command is not rewritten to [query domain-specific language (DSL)]({{site.url}}{{site.baseurl}}/query-dsl/). It is only executed on the coordinating node.
{: .note}

## Syntax

The `top` command has the following syntax:

```sql
top [N] [top-options] <field-list> [by-clause]
```

## Parameters

The `top` command supports the following parameters.

| Parameter | Required/Optional | Description |
| --- | --- | --- |
| `<N>` | Optional | The number of results to return. Default is `10`. |
| `top-options` | Optional | `showcount`: Whether to create a field in the output that represents a count of the tuple of values. Default is `true`.<br>`countfield`: The name of the field that contains the count. Default is `count`.<br>`usenull`: Whether to output `null` values. Default is the value of `plugins.ppl.syntax.legacy.preferred`. |
| `<field-list>` | Required | A comma-delimited list of field names.  |
| `<by-clause>` | Optional | One or more fields to group the results by. |

## Example 1: Displaying counts in the default count column

The following query finds the most common severity levels:

```sql
source=otellogs
| top severityText
```
{% include copy.html %}
{% include try-in-playground.html %}

By default, the `top` command automatically includes a `count` column showing the frequency of each value:

| severityText | count |
| --- | --- |
| ERROR | 7 |
| INFO | 6 |
| WARN | 4 |
| DEBUG | 3 |

## Example 2: Finding the most common values without the count display

The following query uses `showcount=false` to hide the `count` column in the results:

```sql
source=otellogs
| top showcount=false severityText
```
{% include copy.html %}
{% include try-in-playground.html %}

The query returns the following results:

| severityText |
| --- |
| ERROR |
| INFO |
| WARN |
| DEBUG |

## Example 3: Renaming the count column

The following query uses the `countfield` parameter to specify a custom name (`cnt`) for the count column instead of the default `count`:
  
```sql
source=otellogs
| top countfield='cnt' severityText
```
{% include copy.html %}
{% include try-in-playground.html %}
  
The query returns the following results:
  
| severityText | cnt |
| --- | --- |
| ERROR | 7 |
| INFO | 6 |
| WARN | 4 |
| DEBUG | 3 |

## Example 4: Limiting the number of returned results

The following query returns the top 1 most common severity level:

```sql
source=otellogs
| top 1 showcount=false severityText
```
{% include copy.html %}
{% include try-in-playground.html %}

The query returns the following results:

| severityText |
| --- |
| ERROR |

## Example 5: Grouping the results

The following query finds the most common severity level within each service:

```sql
source=otellogs
| top 1 showcount=false severityText by `resource.attributes.service.name`
```
{% include copy.html %}
{% include try-in-playground.html %}

The query returns the following results:

| resource.attributes.service.name | severityText |
| --- | --- |
| product-catalog | WARN |
| frontend-proxy | WARN |
| recommendation | ERROR |
| payment | ERROR |
| checkout | ERROR |
| cart | DEBUG |
| frontend | INFO |

## Example 6: Specifying null value handling

The following query specifies `usenull=false` to exclude null values:

```sql
source=otellogs
| top usenull=false instrumentationScope.name
```
{% include copy.html %}
{% include try-in-playground.html %}
  
The query returns the following results:
  
| instrumentationScope.name | count |
| --- | --- |
| @opentelemetry/instrumentation-http | 2 |
| Microsoft.Extensions.Hosting | 1 |
| go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc | 1 |

The following query specifies `usenull=true` to include null values in the results:

```sql
source=otellogs
| top usenull=true instrumentationScope.name
```
{% include copy.html %}
{% include try-in-playground.html %}
  
The query returns the following results:
  
| instrumentationScope.name | count |
| --- | --- |
| null | 16 |
| @opentelemetry/instrumentation-http | 2 |
| Microsoft.Extensions.Hosting | 1 |
| go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc | 1 |
