---
layout: default
title: Update Replication Settings API
parent: Replication APIs
nav_order: 50
---

# Update Replication Settings API
Introduced 1.0
{: .label .label-purple }

The Update Replication Settings API allows you to modify configuration settings for an index that is being replicated. This API enables you to adjust replication parameters such as the number of replicas and shards without stopping the replication process.

<!-- spec_insert_start
api: replication.update_settings
component: endpoints
-->
## Endpoints
```json
PUT /_plugins/_replication/{index}/_update
```
<!-- spec_insert_end -->

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `index` | String | The name of the data stream, index, or index alias to update replication settings for. Required. |

## Request body fields

The following table lists the available request body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `settings` | Object | Object containing the settings to update for the replicated index. Required. |

<details markdown="block">
  <summary>
    Request body fields: <code>settings</code>
  </summary>
  {: .text-delta}

`settings` is a JSON object with the following fields:

| Field | Data type | Description |
| :--- | :--- | :--- |
| `index` | Object | Object containing index-specific settings to update. |

<details markdown="block">
  <summary>
    Request body fields: <code>settings</code> > <code>index</code>
  </summary>
  {: .text-delta}

`index` is a JSON object with the following fields:

| Field | Data type | Description |
| :--- | :--- | :--- |
| `number_of_replicas` | Integer | The number of replicas for the index. |
| `number_of_shards` | Integer | The number of shards for the index. |
</details>
</details>

## Example request

The following example updates the number of replicas for the `customer-data` index to 2:

```json
PUT /_plugins/_replication/customer-data/_update
{
  "settings": {
    "index": {
      "number_of_replicas": 2
    }
  }
}
```
{% include copy-curl.html %}

## Example response

The following example shows a successful API response:

```json
{
  "acknowledged": true
}
```
