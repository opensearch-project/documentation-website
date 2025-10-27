---
layout: default
title: Index alias exists
parent: Alias APIs
nav_order: 5
---

# Index alias exists API
**Introduced 1.0**
{: .label .label-purple }

Checks if an index alias exists.

An alias is a virtual index name that can point to one or more physical indexes. Creating and updating aliases are atomic operations, so you can reindex your data and point an alias at it without any downtime.

## Endpoints

```json
HEAD /_alias/<alias>
HEAD /<index>/_alias/<alias>
```

## Path parameters

The following table lists the available path parameters. All path parameters are required.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `<alias>` | String | Comma-separated list or wildcard expression of alias names to check. |
| `<index>` | String | Comma-separated list or wildcard expression of index names used to limit the request. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `expand_wildcards` | String | Type of index that wildcard expressions can match. Supports comma-separated values. Valid values are `all`, `open`, `closed`, `hidden`, and `none`. Default is `all`. |
| `ignore_unavailable` | Boolean | Whether to ignore unavailable indexes. Default is `false`. |
| `local` | Boolean | Whether to return information from the local node only instead of from the cluster manager node. Default is `false`. |

## Response codes

| Response code | Description |
| :--- | :--- |
| `200` | Indicates all specified index aliases exist. |
| `404` | Indicates one or more specified index aliases do not exist. |

## Example requests

<!-- spec_insert_start
component: example_code
rest: HEAD /_alias/2030
-->
{% capture step1_rest %}
HEAD /_alias/2030
{% endcapture %}

{% capture step1_python %}


response = client.indices.exists_alias(
  name = "2030"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `indices:admin/aliases/exists`.