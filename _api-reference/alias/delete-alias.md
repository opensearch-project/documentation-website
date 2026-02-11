---
layout: default
title: Delete alias
parent: Alias APIs
grand_parent: Index APIs
nav_order: 30
canonical_url: https://docs.opensearch.org/latest/api-reference/alias/delete-alias/
---

# Delete Index Alias API
**Introduced 1.0**
{: .label .label-purple }

Deletes an existing alias.

## Endpoints

```json
DELETE /<index>/_alias/<alias>
DELETE /<index>/_aliases/<alias>
```

## Path parameters

The following table lists the available path parameters. All path parameters are required.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `<index>` | String | Comma-separated list or wildcard expression of index names used to limit the request. To include all indexes in the cluster, use `_all` or `*`. |
| `<alias>` | String | Comma-separated list or wildcard expression of alias names to delete. To delete all aliases, use `_all` or `*`. |

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `cluster_manager_timeout` | Time | The amount of time to wait for a response from the cluster manager node. Default is `30s`. |
| `timeout` | Time | The amount of time to wait for a response from the cluster. Default is `30s`. |

## Example request

The following request deletes the `alias1` alias from the `logs_20302801` index:

<!-- spec_insert_start
component: example_code
rest: DELETE /logs_20302801/_alias/alias1
-->
{% capture step1_rest %}
DELETE /logs_20302801/_alias/alias1
{% endcapture %}

{% capture step1_python %}


response = client.indices.delete_alias(
  index = "logs_20302801",
  name = "alias1"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->

## Example response

```json
{
    "acknowledged": true
}
```

## Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `acknowledged` | Boolean | Whether the request was received. |

## Related documentation

For more information about index aliases, see [Index aliases]({{site.url}}{{site.baseurl}}/im-plugin/index-alias/).