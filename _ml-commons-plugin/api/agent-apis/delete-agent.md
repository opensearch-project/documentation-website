---
layout: default
title: Delete agent
parent: Agent APIs
grand_parent: ML APIs
nav_order: 40
---

# Delete Agent API
**Introduced 2.13**
{: .label .label-purple }

You can use this API to delete an agent based on the `agent_id`.

## Endpoints

```json
DELETE /_plugins/_ml/agents/{agent_id}
```

## Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `agent_id` | String | The ID of the agent to delete. Required. |

## Example request

```json
DELETE /_plugins/_ml/agents/MzcIJX8BA7mbufL6DOwl
```
{% include copy-curl.html %}

## Example response

```json
{
  "_index" : ".plugins-ml-agent",
  "_id" : "MzcIJX8BA7mbufL6DOwl",
  "_version" : 2,
  "result" : "deleted",
  "forced_refresh" : true,
  "_shards" : {
    "total" : 2,
    "successful" : 2,
    "failed" : 0
  },
  "_seq_no" : 27,
  "_primary_term" : 18
}
```

## Error responses

If you attempt to delete an agent that doesn't exist, OpenSearch returns a 404 error:

```json
{
  "error": {
    "root_cause": [
      {
        "type": "status_exception",
        "reason": "Fail to find ml agent"
      }
    ],
    "type": "status_exception",
    "reason": "Fail to find ml agent"
  },
  "status": 404
}
```