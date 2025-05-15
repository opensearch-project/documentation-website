---
layout: default
title: Delete Policy API
parent: Snapshot Management APIs
nav_order: 55
---

# Delete Policy API

**Introduced 2.4**
{: .label .label-purple }

The Delete Policy API removes a snapshot management policy from the system. This operation is permanent and cannot be undone. It is commonly used to deprecate policies that are no longer needed or to clean up test configurations.

<!-- spec_insert_start
api: sm.delete_policy
component: endpoints
-->
## Endpoints
```json
DELETE /_plugins/_sm/policies/{policy_name}
```
<!-- spec_insert_end -->

<!-- spec_insert_start
api: sm.delete_policy
component: path_parameters
-->
## Path parameters

The following table lists the available path parameters.

| Parameter | Required | Data type | Description |
| :--- | :--- | :--- | :--- |
| `policy_name` | **Required** | String | The name of the snapshot management policy to delete. |

<!-- spec_insert_end -->



## Example request

The following example deletes the `daily-snapshots` policy:

```json
DELETE /_plugins/_sm/policies/daily-snapshots
```
{% include copy-curl.html %}

## Example response

```json
{
  "_id": "daily-snapshots",
  "_index": ".opensearch-snapshot-management-policies",
  "_primary_term": 1,
  "_seq_no": 15,
  "_shards": {
    "total": 2,
    "successful": 2,
    "failed": 0
  },
  "_version": 3,
  "forced_refresh": true,
  "result": "deleted"
}
```

## Response body fields

The response body is a JSON object with the following fields:

| Property  | Required   | Data type | Description      |
| :--- | :--- | :--- | :---- |
| `_id`   | **Required** | String    | The ID of the deleted policy.  |
| `_index`   | **Required** | String    | The index name where the policy was stored.             |
| `_primary_term`  | **Required** | Integer   | The primary term for optimistic concurrency control.    |
| `_seq_no`        | **Required** | Integer   | The sequence number for optimistic concurrency control. |
| `_shards`        | **Required** | Object    | Information about shard operations.                     |
| `_version`       | **Required** | Integer   | The version number of the operation.                    |
| `forced_refresh` | **Required** | Boolean   | Whether a refresh was forced after the operation.       |
| `result`         | **Required** | String    | The result of the delete operation.                     |

<details markdown="block">
  <summary>
    Response body fields: <code>_shards</code>
  </summary>
  {: .text-delta}

The `_shards` object provides information about how the operation affected the index shards.

| Property     | Data type | Description    |
| :--- | :--- | :---- |
| `failed`     | Integer   | The number of shards that failed.   |
| `successful` | Integer   | The number of shards that completed successfully. |
| `total`      | Integer   | The total number of shards.    |

</details>


