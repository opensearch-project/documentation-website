---
layout: default
title: Pause Replication API
parent: Replication APIs
nav_order: 20
---

# Pause Replication API
Introduced 1.0
{: .label .label-purple }

The Pause Replication API temporarily suspends the replication process for a specified index without removing the replication configuration. This allows you to pause replication activities when needed and resume them later.

<!-- spec_insert_start
api: replication.pause
component: endpoints
-->
## Endpoints
```json
POST /_plugins/_replication/{index}/_pause
```
<!-- spec_insert_end -->

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `index` | String | The name of the data stream, index, or index alias to pause replication on. Required. |

## Example request

The following example pauses replication on the `customer-data` index:

```json
POST /_plugins/_replication/customer-data/_pause
```
{% include copy-curl.html %}

## Example response

The following example shows a successful API response:

```json
{
  "acknowledged": true
}
```

## Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `acknowledged` | Boolean | Whether the request was acknowledged. |
