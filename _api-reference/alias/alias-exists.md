---
layout: default
title: Alias exists
parent: Alias APIs
grand_parent: Index APIs
nav_order: 40
---

# Index Alias Exists API
**Introduced 1.0**
{: .label .label-purple }

Checks if an alias exists.

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

The API returns one of the following response codes.

| Response code | Description |
| :--- | :--- |
| `200` | Indicates that all specified aliases exist. |
| `404` | Indicates that one or more specified aliases do not exist. |

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

## Related documentation

For more information about index aliases, see [Index aliases]({{site.url}}{{site.baseurl}}/im-plugin/index-alias/).