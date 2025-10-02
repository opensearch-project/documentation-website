---
layout: default
title: Exploring search evaluation results
nav_order: 68
parent: Search Relevance Workbench
grand_parent: Search relevance
has_children: false
---

# Regularly scheduled experiments
Introduced 3.4
{: .label .label-purple }

An option for tracking the results from search evaluations overtime is to use regularly scheduled experiments.

## Creating scheduled experiments

You can create regularly scheduled experiments.

### Endpoint

```json
POST _plugins/_search_relevance/experiments/schedule
```

### Request body fields

The following table lists the available input parameters.

Field | Data type |  Description
:---  | :--- | :---
`experimentId` | String | The id of the experiment which will be rerun.
`cronExpression` | String | A cron expression representing the schedule for running the evaluation based on the UTC time.

### Example request: Run experiment every night at midnight

```json
POST _plugins/_search_relevance/experiments/schedule
{
  "experimentId": "6282afa6-fa14-49c8-a627-ac1d5204d357",
  "cronExpression": "0 0 * * *",
}
```

## Managing scheduled experiments

You can retrieve or delete scheduled experiments using the following APIs.

### Retrieve scheduled experiments

This API retrieves available scheduled experiments.

#### Endpoints

```json
GET _plugins/_search_relevance/experiments/schedule
GET _plugins/_search_relevance/experiments/schedule/<experiment_id>
```
{% include copy-curl.html %}

#### Example response

```json
{
  "took": 17,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": null,
    "hits": [
      {
        "_index": ".search-relevance-scheduled-experiment-jobs",
        "_id": "6282afa6-fa14-49c8-a627-ac1d5204d357",
        "_score": null,
        "_source": {
          "id": "6282afa6-fa14-49c8-a627-ac1d5204d357",
          "enabled": true,
          "schedule": {
            "cron": {
              "expression": "0 0 * * *",
              "timezone": "America/Los_Angeles"
            }
          },
          "enabledTime": 1758320475601,
          "lastUpdateTime": 1758320475601,
          "timestamp": "2025-09-19T00:00:00.602Z"
        },
        "sort": [
          "2025-09-19T00:00:00.602Z"
        ]
      }
    ]
  }
}
```

### Path parameters

The following table lists the available path parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `experiment_id` | String | The ID of the scheduled experiment to retrieve. Retrieves all scheduled experiments when empty. |

### Delete a scheduled experiment

You can delete a scheduled experiment using the scheduled experiment ID.

#### Endpoint

```json
DELETE _plugins/_search_relevance/experiments/schedule/<experiment_id>
```

#### Example request

```json
DELETE _plugins/_search_relevance/experiments/schedule/6282afa6-fa14-49c8-a627-ac1d5204d357
```

#### Example response

```json
{
  "_index": ".search-relevance-scheduled-experiment-jobs",
  "_id": "6282afa6-fa14-49c8-a627-ac1d5204d357",
  "_version": 2,
  "result": "deleted",
  "forced_refresh": true,
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 17,
  "_primary_term": 1
}
```

