---
layout: default
title: show datasources
parent: Commands
grand_parent: PPL
nav_order: 35
---

# show datasources

The `show datasources` command queries data sources configured in the PPL engine. The `show datasources` command can only be used as the first command in the PPL query.

To use the `show datasources` command, `plugins.calcite.enabled` must be set to `false`.
{: .note}

## Syntax

The `show datasources` command has the following syntax:

```sql
show datasources
```

The `show datasources` command takes no parameters.  

## Example 1: Fetch all Prometheus data sources

The following query fetches all Prometheus data sources:
  
```sql
show datasources
| where CONNECTOR_TYPE='PROMETHEUS'
```
{% include copy.html %}
  
The query returns the following results:

| DATASOURCE_NAME | CONNECTOR_TYPE |
| --- | --- |
| my_prometheus | PROMETHEUS |

