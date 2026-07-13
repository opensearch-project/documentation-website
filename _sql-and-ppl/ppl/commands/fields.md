---
layout: default
title: fields
parent: Commands
grand_parent: PPL
nav_order: 18
---

<!-- vale off -->

# fields

<!-- vale on -->

The `fields` command specifies the fields that should be included in or excluded from the search results.

<!-- vale off -->

## Syntax

<!-- vale on -->

The `fields` command has the following syntax:

```sql
fields [+|-] <field-list>
```

<!-- vale off -->

## Parameters

<!-- vale on -->

The `fields` command supports the following parameters.

| Parameter | Required/Optional | Description |
| --- | --- | --- |
| `<field-list>` | Required | A comma-delimited or space-delimited list of fields to keep or remove. Supports wildcard patterns. |
| `[+|-]` | Optional | If the plus sign (`+`) is used, only the fields specified in the `field-list` are included. If the minus sign (`-`) is used, all fields specified in the `field-list` are excluded. Default is `+`. |
  

<!-- vale off -->

## Example 1: Selecting the fields you need for triage

<!-- vale on -->

The following query selects specific fields from the search results:
  
```sql
source=otellogs
| where severityText IN ('ERROR', 'WARN')
| sort severityNumber, `resource.attributes.service.name`
| fields severityText, `resource.attributes.service.name`, body
| head 3
```
{% include copy.html %}
{% include try-in-playground.html %}
  
The query returns the following results:
  
<!-- vale off -->

| severityText | resource.attributes.service.name | body |
| --- | --- | --- |
| WARN | frontend-proxy | SSL certificate for api.example.com expires in 14 days |
| WARN | frontend-proxy | Rate limit threshold reached: 450/500 requests per minute for API key ending in ...abc789 |
| WARN | product-catalog | Slow query detected: SELECT \* FROM products WHERE category = 'electronics' took 3200ms |

<!-- vale on -->
  

<!-- vale off -->

## Example 2: Removing noisy fields from results 

<!-- vale on -->

The following query removes the raw `body` field after extracting what you need, keeping the output clean:
  
```sql
source=otellogs
| where severityText IN ('ERROR', 'WARN')
| sort severityNumber, `resource.attributes.service.name`
| fields severityText, `resource.attributes.service.name`, severityNumber, body
| fields - body, severityNumber
| head 3
```
{% include copy.html %}
{% include try-in-playground.html %}
  
The query returns the following results:
  
<!-- vale off -->

| severityText | resource.attributes.service.name |
| --- | --- |
| WARN | frontend-proxy |
| WARN | frontend-proxy |
| WARN | product-catalog |

<!-- vale on -->
  

<!-- vale off -->

## Example 3: Selecting all severity-related fields with a prefix wildcard

<!-- vale on -->

When you're not sure of the exact field names, use wildcards to grab all fields starting with a common prefix. This selects both `severityText` and `severityNumber`:
  
```sql
source=otellogs
| where severityText IN ('ERROR', 'WARN')
| sort severityNumber, `resource.attributes.service.name`
| fields severity*
| head 3
```
{% include copy.html %}
{% include try-in-playground.html %}
  
The query returns the following results:
  
<!-- vale off -->

| severityText | severityNumber |
| --- | --- |
| WARN | 13 |
| WARN | 13 |
| WARN | 13 |

<!-- vale on -->
  

<!-- vale off -->

## Example 4: Selecting trace correlation fields with a suffix wildcard

<!-- vale on -->

The following query grabs all fields ending with `Id`, useful for pulling trace correlation identifiers when debugging distributed requests:
  
```sql
source=otellogs
| where LENGTH(traceId) > 0
| fields *Id
| head 3
```
{% include copy.html %}
{% include try-in-playground.html %}
  
The query returns the following results:
  
<!-- vale off -->

| spanId | traceId |
| --- | --- |
| span0001 | abcd1234efgh5678 |
| span0002 | abcd1234efgh5678 |
| span0003 | abcd1234efgh5678 |

<!-- vale on -->
  

<!-- vale off -->

## Example 5: Combining explicit fields with wildcards

<!-- vale on -->

The following query selects specific fields alongside wildcard-matched fields. This grabs the severity text plus all trace identifiers in one query:
  
```sql
source=otellogs
| where LENGTH(traceId) > 0
| fields severityText, *Id
| head 3
```
{% include copy.html %}
{% include try-in-playground.html %}
  
The query returns the following results:
  
<!-- vale off -->

| severityText | spanId | traceId |
| --- | --- | --- |
| INFO | span0001 | abcd1234efgh5678 |
| INFO | span0002 | abcd1234efgh5678 |
| WARN | span0003 | abcd1234efgh5678 |

<!-- vale on -->
  

<!-- vale off -->

## Example 6: Removing trace fields with wildcard exclusion

<!-- vale on -->

The following query strips all identifier fields from the output, useful when you want the log content without the tracing metadata:
  
```sql
source=otellogs
| where severityText = 'ERROR'
| sort `resource.attributes.service.name`
| fields - *Id
| head 1
```
{% include copy.html %}
{% include try-in-playground.html %}
  
The query returns the following results:
  
<!-- vale off -->

| @timestamp | instrumentationScope | severityText | resource | flags | attributes | droppedAttributesCount | severityNumber | time | body |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2024-02-01 09:15:00 | {} | ERROR | {'attributes': {'service': {'name': 'checkout'}, 'host': {'name': 'checkout-8b4c2d-jp5r7'}}, 'droppedAttributesCount': 0} | 0 | {} | 0 | 17 | 2024-02-01 09:15:00 | NullPointerException in CheckoutService.placeOrder at line 142 |

<!-- vale on -->

<!-- vale off -->

## Example 7: Deduplicating fields

<!-- vale on -->

The following query automatically prevents duplicate columns when wildcards expand to already specified fields:

```sql
source=otellogs
| fields severityText, severity*
| head 3
```
{% include copy.html %}
{% include try-in-playground.html %}

The query returns the following results. Even though `severityText` is explicitly specified and also matches `severity*`, it appears only once because of automatic deduplication:

<!-- vale off -->

| severityText | severityNumber |
| --- | --- |
| INFO | 9 |
| INFO | 9 |
| WARN | 13 |

<!-- vale on -->

<!-- vale off -->

## Example 8: Selecting all fields  

<!-- vale on -->

The following query selects all fields defined in the index schema using `` `*` ``. Fields with null values are included in the The query returns the following results:
  
```sql
source=otellogs
| where severityText = 'WARN'
| fields `*`
| head 1
```
{% include copy.html %}
{% include try-in-playground.html %}
  
The query returns the following results:
  
<!-- vale off -->

| spanId | traceId | @timestamp | instrumentationScope | severityText | resource | flags | attributes | droppedAttributesCount | severityNumber | time | body |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| span0003 | abcd1234efgh5678 | 2024-02-01 09:12:00 | {'name': 'go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc', 'droppedAttributesCount': 0, 'version': '0.49.0'} | WARN | {'attributes': {'service': {'name': 'product-catalog'}, 'host': {'name': 'productcatalog-7c9d-zn4p2'}}, 'droppedAttributesCount': 0} | 0 | {} | 0 | 13 | 2024-02-01 09:12:00 | Slow query detected: SELECT \* FROM products WHERE category = 'electronics' took 3200ms |

<!-- vale on -->
  

<!-- vale off -->

## Related documentation 

<!-- vale on -->

- [`table`]({{site.url}}{{site.baseurl}}/sql-and-ppl/ppl/commands/table/) -- An alias command with identical functionality  
