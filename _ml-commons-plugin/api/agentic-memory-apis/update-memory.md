---
layout: default
title: Update agentic memory
parent: Agentic memory APIs
grand_parent: ML Commons APIs
nav_order: 52
---

# Update Agentic Memory API
**Introduced 3.3**
{: .label .label-purple }

Use this API to update a specific memory by its type and ID. This unified API supports updating `sessions`, `working`, and `long-term` [memory types]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agentic-memory/#memory-types). `history` memory does not support updates.

## Endpoints

```json
PUT /_plugins/_ml/memory_containers/{memory_container_id}/memories/{type}/{id}
```

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `memory_container_id` | String | Required | The ID of the memory container. |
| `type` | String | Required | The memory type. Valid values are `sessions`, `working`, and `long-term`. Note that `history` memory cannot be updated. |
| `id` | String | Required | The ID of the memory to update. |

## Request fields

The request fields vary depending on the memory type being updated. All request fields are optional, but the request body must contain at least one field. Each field that you provide replaces the existing value of that field. For example, providing `tags` replaces all existing tags.

### Session memory request fields

The following table lists all session memory request body fields. 

| Field      | Data type             | Description |
|:-----------|:----------------------| :--- |
| `summary`  | String                | The summary of the session.
| `metadata` | Object   | Additional metadata for the memory (for example, `status`, `branch`, or custom fields). |
| `agents`   | Object   | Additional information about the agents. |
| `additional_info` | Object | Additional metadata to associate with the session. |
| `pinned` | Boolean | Whether to pin the session so that it is exempt from the container's retention policy. Requires `plugins.ml_commons.memory.retention_enabled` to be `true`. For more information, see [Agentic memory retention]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agentic-memory-retention/). |

### Working memory request fields

The following table lists all working memory request body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `messages` | Array | Updated conversation messages (for conversation type). Optional. |
| `structured_data` | Object | Updated structured data content (for `data` memory payloads). |
| `structured_data_blob` | Object | Updated structured data that is stored but not indexed. |
| `binary_data` | String | Updated Base64-encoded binary data content (for `data` memory payloads). Optional. |
| `tags` | Object | Updated tags for categorization.                       |
| `metadata` | Object  | Additional metadata for the memory (for example, `status`, `branch`, or custom fields).

### Long-term memory request fields

The following table lists all long-term memory request body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `memory` | String | The updated memory content. Optional. |
| `tags` | Object | Updated tags for categorization. Optional. |
| `pinned` | Boolean | Whether to pin the memory so that it is exempt from the container's retention policy. Requires `plugins.ml_commons.memory.retention_enabled` to be `true`. Optional. |

When you update the `memory` field, OpenSearch regenerates the memory embedding.

## Example request: Update a session

```json
PUT /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/sessions/N2CDipkB2Mtr6INFFcX8
{
  "additional_info": {
    "key1": "value1",
    "last_activity": "2025-09-15T17:30:00Z"
  }
}
```
{% include copy-curl.html %}

## Example request: Update a working memory

```json
PUT /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/working/XyEuiJkBeh2gPPwzjYWM
{
  "tags": {
    "topic": "updated_topic",
    "priority": "high"
  }
}
```
{% include copy-curl.html %}

## Example request: Update a long-term memory

```json
PUT /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/long-term/DcxjTpkBvwXRq366C1Zz
{
  "memory": "User's name is Bob Smith",
  "tags": {
    "topic": "personal info",
    "updated": "true"
  }
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "_index": ".plugins-ml-am-default-memory-sessions",
  "_id": "N2CDipkB2Mtr6INFFcX8",
  "_version": 2,
  "result": "updated",
  "forced_refresh": true,
  "_shards": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 11,
  "_primary_term": 1
}
```

## Response fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `_index` | String | The name of the index that stores the memory. |
| `result` | String | The result of the update operation. |
| `_id` | String | The ID of the updated memory. |
| `_version` | Integer | The version number of the updated memory. |
| `forced_refresh` | Boolean | Whether a refresh was forced after the operation. |
| `_shards` | Object | Information about the shards involved in the operation. |
| `_seq_no` | Long | The sequence number assigned to the update operation. |
| `_primary_term` | Long | The primary term of the index. |
