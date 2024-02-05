---
layout: default
title: Delete memory
parent: Memory APIs
grand_parent: ML Commons APIs
nav_order: 30
---

# Delete a memory
**Introduced 2.12**
{: .label .label-purple }

Deletes a memory based on the `memory_id`.

When the Security plugin is enabled, all memories exist in a `private` security mode. Only the user who created a memory can interact with that memory and its messages.
{: .important}

## Path and HTTP methods

```json
DELETE /_plugins/_ml/memory/<memory_id>
```

## Path parameters

The following table lists the available path parameters.

Parameter | Data type | Description
:--- | :--- | :---
`memory_id` | String | The ID of the memory to be deleted. 

#### Example request

```json
DELETE /_plugins/_ml/memory/MzcIJX8BA7mbufL6DOwl
```
{% include copy-curl.html %}

#### Example response

```json
{
  "success": true
}
```