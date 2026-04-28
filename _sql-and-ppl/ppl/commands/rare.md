---
layout: default
title: rare
parent: Commands
grand_parent: PPL
nav_order: 35
canonical_url: https://docs.opensearch.org/latest/sql-and-ppl/ppl/commands/rare/
---

# rare

The `rare` command identifies the least common combination of values across all fields specified in the field list.

The command returns up to 10 results for each distinct combination of values in the group-by fields.
{: .note}

The `rare` command is not rewritten to [query domain-specific language (DSL)]({{site.url}}{{site.baseurl}}/query-dsl/). It is only executed on the coordinating node.
{: .note}

## Syntax

The `rare` command has the following syntax:

```sql
rare [rare-options] <field-list> [by-clause]
```

## Parameters

The `rare` command supports the following parameters.

| Parameter | Required/Optional | Description |
| --- | --- | --- |
| `<field-list>` | Required | A comma-delimited list of field names. |
| `<by-clause>` | Optional | One or more fields to group the results by. |
| `rare-options` | Optional | Additional options for controlling output: <br> - `showcount`: Whether to create a field in the output containing the frequency count for each combination of values. Default is `true`. <br> - `countfield`: The name of the field that contains the count. Default is `count`. <br> - `usenull`: Whether to output null values. Default is the value of `plugins.ppl.syntax.legacy.preferred`. |

## Example 1: Finding the least common values without showing counts

The following query uses `showcount=false` to find the least common severity levels without displaying frequency counts:

```sql
source=otellogs
| rare showcount=false severityText
```
{% include copy.html %}
{% include try-in-playground.html %}

The query returns the following results:

| severityText |
| --- |
| DEBUG |
| WARN |
| INFO |
| ERROR |

## Example 2: Finding the least common values grouped by field

The following query finds the least common severity levels grouped by service:

```sql
source=otellogs
| rare showcount=false severityText by `resource.attributes.service.name`
```
{% include copy.html %}
{% include try-in-playground.html %}

The query returns the following results:

| resource.attributes.service.name | severityText |
| --- | --- |
| product-catalog | DEBUG |
| product-catalog | ERROR |
| product-catalog | WARN |
| frontend-proxy | ERROR |
| frontend-proxy | WARN |
| recommendation | ERROR |
| payment | ERROR |
| checkout | INFO |
| checkout | ERROR |
| cart | INFO |
| cart | DEBUG |
| frontend | INFO |

## Example 3: Finding the least common values with frequency counts

The following query finds the least common severity levels with their frequency counts:

```sql
source=otellogs
| rare severityText
```
{% include copy.html %}
{% include try-in-playground.html %}

The query returns the following results:

| severityText | count |
| --- | --- |
| DEBUG | 3 |
| WARN | 4 |
| INFO | 6 |
| ERROR | 7 |

## Example 4: Customizing the count field name

The following query uses `countfield` to specify a custom name for the frequency count field:

```sql
source=otellogs
| rare countfield='cnt' severityText
```
{% include copy.html %}
{% include try-in-playground.html %}

The query returns the following results:

| severityText | cnt |
| --- | --- |
| DEBUG | 3 |
| WARN | 4 |
| INFO | 6 |
| ERROR | 7 |

## Example 5: Specifying null value handling

The following query uses `usenull=false` to exclude null values:

```sql
source=otellogs
| rare usenull=false instrumentationScope.name
```
{% include copy.html %}
{% include try-in-playground.html %}

The query returns the following results:

| instrumentationScope.name | count |
| --- | --- |
| Microsoft.Extensions.Hosting | 1 |
| go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc | 1 |
| @opentelemetry/instrumentation-http | 2 |

The following query uses `usenull=true` to include null values in the results:

```sql
source=otellogs
| rare usenull=true instrumentationScope.name
```
{% include copy.html %}
{% include try-in-playground.html %}

The query returns the following results:

| instrumentationScope.name | count |
| --- | --- |
| Microsoft.Extensions.Hosting | 1 |
| go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc | 1 |
| @opentelemetry/instrumentation-http | 2 |
| null | 16 |