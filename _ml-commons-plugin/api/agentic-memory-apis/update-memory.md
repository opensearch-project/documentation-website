---
layout: default
title: Update memory
parent: Agentic memory APIs
grand_parent: ML Commons APIs
nav_order: 52
---

# Update Memory API
**Introduced 3.3**
{: .label .label-purple }

Use this API to update a specific memory by its type and ID. This unified API supports updating `sessions`, `working`, and `long-term` [memory types]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/#memory-types). `history` memory does not support updates.

## Endpoints

```json
PUT /_plugins/_ml/memory_containers/<memory_container_id>/memories/<type>/<id>
```

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `memory_container_id` | String | Required | The ID of the memory container. |
| `type` | String | Required | The memory type. Valid values are `sessions`, `working`, and `long-term`. Note that `history` memory cannot be updated. |
| `id` | String | Required | The ID of the memory to update. |

## Request fields

The request fields vary depending on the memory type being updated. All request fields are optional.

### Session memory request fields

The following table lists all session memory request body fields. 

| Field | Data type | Description |
| :--- | :--- | :--- |
| Field      | Data type             | Description |
|:-----------|:----------------------| :--- |
| `summary`  | String                | The summary of the session.
| `metadata` | Object   | Additional metadata for the memory (for example, `status`, `branch`, or custom fields). |
| `agents`   | Object   | Additional information about the agents. |
| `additional_info` | Object | Additional metadata to associate with the session. |

### Working memory request fields

The following table lists all working memory request body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `messages` | Array | Updated conversation messages (for conversation type). Optional. |
| `structured_data` | Object | Updated structured data content (for `data` memory payloads). |
| `binary_data` | Object | Updated binary data content (for `data` memory payloads). Optional.           |
| `tags` | Object | Updated tags for categorization.                       |
| `metadata` | Object  | Additional metadata for the memory (for example, `status`, `branch`, or custom fields).

### Long-term memory request fields

The following table lists all long-term memory request body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `memory` | String | The updated memory content. Optional. |
| `tags` | Object | Updated tags for categorization. Optional. |

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
  "result": "updated",
  "_id": "N2CDipkB2Mtr6INFFcX8",
  "_version": 2,
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  }
}
```

## Response fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `result` | String | The result of the update operation. |
| `_id` | String | The ID of the updated memory. |
| `_version` | Integer | The version number of the updated memory. |
| `_shards` | Object | Information about the shards involved in the operation. |
