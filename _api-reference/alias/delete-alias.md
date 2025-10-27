---
layout: default
title: Delete index alias
parent: Alias APIs
nav_order: 4
---

# Delete index alias API
**Introduced 1.0**
{: .label .label-purple }

Deletes an existing index alias.

An alias is a virtual index name that can point to one or more physical indexes. Creating and updating aliases are atomic operations, so you can reindex your data and point an alias at it without any downtime.

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

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `indices:admin/aliases`.