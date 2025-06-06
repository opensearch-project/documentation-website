---
layout: default
title: Resume Replication API
parent: Replication APIs
nav_order: 25
---

# Resume Replication API
Introduced 1.0
{: .label .label-purple }

The Resume Replication API restarts a previously paused replication process for a specified index. This API allows you to continue replication activities between leader and follower indices after they have been temporarily suspended.

<!-- spec_insert_start
api: replication.resume
component: endpoints
-->
## Endpoints
```json
POST /_plugins/_replication/{index}/_resume
```
<!-- spec_insert_end -->

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `index` | String | The name of the data stream, index, or index alias to resume replication on. Required. |

## Example request

The following example resumes replication on the `customer-data` index:

```json
POST /_plugins/_replication/customer-data/_resume
```
{% include copy-curl.html %}

## Example response

The following example shows a successful API response:

```json
{
  "acknowledged": true,
}
```

## Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `acknowledged` | Boolean | Whether the request was acknowledged. |
