---
layout: default
title: Evaluating search over time
nav_order: 70
parent: Search Relevance Workbench
grand_parent: Search relevance
has_children: false
---

# Regularly scheduled experiments
Introduced 3.4
{: .label .label-purple }

Search quality is rarely static.  Even when you aren't changing your algorithms, the data you index is changing, the signals being collected such as popularity and recency are constantly fluctuating, and the types of questions your users are asking are changing.  To guard against unexpected changes you need to monitor search quality over time.  To do that you can schedule a Search Evaluation experiment to be run on a regular basis.

Scheduling is done using a cron pattern and leverages OpenSearch's [Job Scheduler]({{site.url}}{{site.baseurl}}/monitoring-your-cluster/job-scheduler/) plugin under the covers.

You can have a single schedule per job, so if you need to change it, the process is to remove the existing schedule and add a new one.  Be aware that removing the schedule also removes any existing historical data as well.

## Scheduling through SRW UI

After you run a Search Evaluation the first time successfully then you will see a clock icon that lets you schedule the experiment:


<img src="{{site.url}}{{site.baseurl}}/images/search-relevance-workbench/experiment_scheduling_icon.png" alt="Schedule a Experiment to Run"/>{: .img-fluid }

When you open up the scheduling modal you can set up the schedule that you want:

<img src="{{site.url}}{{site.baseurl}}/images/search-relevance-workbench/experiment_scheduling_modal.png" alt="Setting the schedule of how often to run"/>{: .img-fluid }

### Evaluating Results

Once you schedule an Experiment to run you can start looking at the data over time.  You will see a new dashboard icon that is specific to looking at analytics over time. The dashboard is built around evaluating daily runs, so you will need to wait 24 hours for the data to populate so that the dashboard starts to display meaningful results.

**I NEED TO WAIT A WEEK TO HAVE SOME MEANINGFUL DATA IN THE DAHSBORD OR FAKE IT**


## Using the API

You can create regularly scheduled experiments.  The experiment you are scheduling must already be created.

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

### Example request: Run experiment every night at 1 AM.

```json
POST _plugins/_search_relevance/experiments/schedule
{
  "experimentId": "6282afa6-fa14-49c8-a627-ac1d5204d357",
  "cronExpression": "0 1 * * *"
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
