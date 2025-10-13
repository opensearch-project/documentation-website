---
layout: default
title: Delete memory
parent: Agentic memory APIs
grand_parent: ML Commons APIs
nav_order: 53
---

# Delete Memory API
**Introduced 3.3**
{: .label .label-purple }

Use this API to delete a specific memory by its type and ID. This unified API supports deleting memories of any [memory type]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/agentic-memory-apis/#memory-types): `sessions`, `working`, `long-term`, or `history`.

## Endpoints

```json
DELETE /_plugins/_ml/memory_containers/<memory_container_id>/memories/<type>/<id>
```

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Required/Optional | Description |
| :--- | :--- | :--- | :--- |
| `memory_container_id` | String | Required | The ID of the memory container from which to delete the memory. |
| `type` | String | Required | The type of memory to delete. Valid values are `sessions`, `working`, `long-term`, and `history`. |
| `id` | String | Required | The ID of the specific memory to delete. |

## Example request: Delete a working memory

```json
DELETE /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/working/XyEuiJkBeh2gPPwzjYWM
```
{% include copy-curl.html %}

## Example request: Delete a long-term memory

```json
DELETE /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/long-term/DcxjTpkBvwXRq366C1Zz
```
{% include copy-curl.html %}

## Example request: Delete a sessions memory

```json
DELETE /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/sessions/CcxjTpkBvwXRq366A1aE
```
{% include copy-curl.html %}

## Example request: Delete a history memory

```json
DELETE /_plugins/_ml/memory_containers/HudqiJkB1SltqOcZusVU/memories/history/eMxnTpkBvwXRq366hmAU
```
{% include copy-curl.html %}

## Example response

```json
{
  "result": "deleted",
  "_id": "XyEuiJkBeh2gPPwzjYWM",
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
| `result` | String | The result of the delete operation. |
| `_id` | String | The ID of the deleted memory. |
| `_version` | Integer | The version number after deletion. |
| `_shards` | Object | Information about the shards involved in the operation. |
