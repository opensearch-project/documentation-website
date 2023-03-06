---
layout: default
title: Index rollups API
parent: Index rollups
nav_order: 9
---

# Index rollups API

Use the index rollup operations to programmatically work with index rollup jobs.

---

#### Table of contents
- TOC
{:toc}


---

## Create or update an index rollup job
Introduced 1.0
{: .label .label-purple }

Creates or updates an index rollup job.
You must provide the `seq_no` and `primary_term` parameters.

#### Request

```json
PUT _plugins/_rollup/jobs/<rollup_id> // Create
PUT _plugins/_rollup/jobs/<rollup_id>?if_seq_no=1&if_primary_term=1 // Update
{
  "rollup": {
    "source_index": "nyc-taxi-data",
    "target_index": "rollup-nyc-taxi-data",
    "schedule": {
      "interval": {
        "period": 1,
        "unit": "Days"
      }
    },
    "description": "Example rollup job",
    "enabled": true,
    "page_size": 200,
    "delay": 0,
    "roles": [
      "rollup_all",
      "nyc_taxi_all",
      "example_rollup_index_all"
    ],
    "continuous": false,
    "dimensions": {
      "date_histogram": {
        "source_field": "tpep_pickup_datetime",
        "fixed_interval": "1h",
        "timezone": "America/Los_Angeles"
      },
      "terms": {
        "source_field": "PULocationID"
      },
      "metrics": [
        {
          "source_field": "passenger_count",
          "metrics": [
            {
              "avg": {}
            },
            {
              "sum": {}
            },
            {
              "max": {}
            },
            {
              "min": {}
            },
            {
              "value_count": {}
            }
          ]
        }
      ]
    }
  }
}
```

You can specify the following options.

Options | Description | Type | Required
:--- | :--- |:--- |:--- |
`source_index` |  The name of the detector. | String | Yes
`target_index` |  Specify the target index that the rolled up data is ingested into. You can either create a new target index or use an existing index. The target index cannot be a combination of raw and rolled up data. This field supports dynamically generated index names like {% raw %}`rollup_{{ctx.source_index}}`{% endraw %}, where `source_index` cannot contain wildcards.  | String | Yes
`schedule` |  Schedule of the index rollup job which can be an interval or a cron expression. | Object | Yes
`schedule.interval`  |  Specify the frequency of execution of the rollup job. | Object | No
`schedule.interval.start_time` | Start time of the interval. | Timestamp | Yes
`schedule.interval.period` |  Define the interval period. | String | Yes
`schedule.interval.unit` | Specify the time unit of the interval. | String | Yes
`schedule.interval.cron` | Optionally, specify a cron expression to define therollup frequency. | List | No
`schedule.interval.cron.expression` | Specify a Unix cron expression. | String | Yes
`schedule.interval.cron.timezone` | Specify timezones as defined by the IANA Time Zone Database. Defaults to UTC. | String | No
`description` | Optionally, describe the rollup job. | String | No
`enabled` | When true, the index rollup job is scheduled. Default is true. | Boolean | Yes
`continuous` | Specify whether or not the index rollup job continuously rolls up data forever or just executes over the current data set once and stops. Default is false. | Boolean | Yes
`error_notification` | Set up a Mustache message template sent for error notifications. For example, if an index rollup job fails, the system sends a message to a Slack channel. | Object | No
`page_size` | Specify the number of buckets to paginate through at a time while rolling up. | Number | Yes
`delay` | The number of milliseconds to delay execution of the index rollup job. | Long | No
`dimensions` | Specify aggregations to create dimensions for the roll up time window. | Object | Yes
`dimensions.date_histogram` | Specify either fixed_interval or calendar_interval, but not both. Either one limits what you can query in the target index. | Object | No
`dimensions.date_histogram.fixed_interval` | Specify the fixed interval for aggregations in milliseconds, seconds, minutes, hours, or days. | String | No
`dimensions.date_histogram.calendar_interval` | Specify the calendar interval for aggregations in minutes, hours, days, weeks, months, quarters, or years. | String | No
`dimensions.date_histogram.field` | Specify the date field used in date histogram aggregation. | String | No
`dimensions.date_histogram.timezone` | Specify the timezones as defined by the IANA Time Zone Database. The default is UTC. | String | No
`dimensions.terms` | Specify the term aggregations that you want to roll up. | Object | No
`dimensions.terms.fields` | Specify terms aggregation for compatible fields. | Object | No
`dimensions.histogram` | Specify the histogram aggregations that you want to roll up. | Object | No
`dimensions.histogram.field` | Add a field for histogram aggregations. | String | Yes
`dimensions.histogram.interval` | Specify the histogram aggregation interval for the field. | Long | Yes
`dimensions.metrics` | Specify a list of objects that represent the fields and metrics that you want to calculate. | Nested object | No
`dimensions.metrics.field` | Specify the field that you want to perform metric aggregations on. | String | No
`dimensions.metrics.field.metrics` | Specify the metric aggregations you want to calculate for the field. | Multiple strings | No


#### Example response

```json
{
  "_id": "rollup_id",
  "_seqNo": 1,
  "_primaryTerm": 1,
  "rollup": { ... }
}
```


## Get an index rollup job
Introduced 1.0
{: .label .label-purple }

Returns all information about an index rollup job based on the `rollup_id`.

#### Request

```json
GET _plugins/_rollup/jobs/<rollup_id>
```


#### Example response

```json
{
  "_id": "my_rollup",
  "_seqNo": 1,
  "_primaryTerm": 1,
  "rollup": { ... }
}
```


---

## Delete an index rollup job
Introduced 1.0
{: .label .label-purple }

Deletes an index rollup job based on the `rollup_id`.

#### Request

```json
DELETE _plugins/_rollup/jobs/<rollup_id>
```

#### Example response

```json
200 OK
```

---


## Start or stop an index rollup job
Introduced 1.0
{: .label .label-purple }

Start or stop an index rollup job.

#### Request

```json
POST _plugins/_rollup/jobs/<rollup_id>/_start
POST _plugins/_rollup/jobs/<rollup_id>/_stop
```


#### Example response

```json
200 OK
```


---

## Explain an index rollup job
Introduced 1.0
{: .label .label-purple }

Returns detailed metadata information about the index rollup job and its current progress.

#### Request

```json
GET _plugins/_rollup/jobs/<rollup_id>/_explain
```


#### Example response

```json
{
  "example_rollup": {
    "rollup_id": "example_rollup",
    "last_updated_time": 1602014281,
    "continuous": {
      "next_window_start_time": 1602055591,
      "next_window_end_time": 1602075591
    },
    "status": "running",
    "failure_reason": null,
    "stats": {
      "pages_processed": 342,
      "documents_processed": 489359,
      "rollups_indexed": 3420,
      "index_time_in_ms": 30495,
      "search_time_in_ms": 584922
    }
  }
}
```
