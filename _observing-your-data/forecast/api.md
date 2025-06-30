---
layout: default
title: Forecasting API
parent: Forecasting
nav_order: 100
---

# Forecasting API

Use these operations to programmatically create and manage forecasters that generate forecasts over your time‑series data.

---

## Table of contents
- TOC
{:toc}

---

## Create forecaster

**Introduced 3.1**
{: .label .label-purple }

Creates a forecaster for generating time-series forecasts. A forecaster can be either single-stream (without a category field) or high-cardinality (with one or more category fields).

When creating a forecaster, you define the source indexes, the forecast interval and horizon, the feature to forecast, and optional parameters such as category fields and a custom result index.


### Endpoint

```
POST _plugins/_forecast/forecasters
```

### Request body fields

This API supports the following request body fields.

| Field                         | Data type           | Required | Description                                                                                                                                  |
| :---------------------------- | :------------------ | :------- | :------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                        | String              | Required | The forecaster name.                                                                                                                         |
| `description`                 | String              | Optional | A free-form description of the forecaster.                                                                                                   |
| `time_field`                  | String              | Required | The timestamp field for the source documents.                                                                                                |
| `indices`                     | String or string\[] | Required | One or more source indexes or index aliases.                                                                                                 |
| `feature_attributes`          | Array of objects    | Required | The feature to forecast. Only one feature is supported. Each object must include the `feature_name` and an `aggregation_query`.                  |
| `forecast_interval`           | Object              | Required | The interval over which forecasts are generated.                                                                                             |
| `horizon`                     | Integer             | Optional | The number of future intervals to forecast.                                                                                                  |
| `window_delay`                | Object              | Optional | A delay added to account for ingestion latency.                                                                                              |
| `category_field`              | String          | Optional | One or two fields used to group forecasts by entity.                                                                                         |
| `result_index`                | String              | Optional | A custom index alias for storing forecast results. Must begin with `opensearch-forecast-result-`. Defaults to `opensearch-forecast-results`. |
| `suggested_seasonality`       | Integer             | Optional | The seasonal pattern length in intervals. Expected range: 8–256.                                                                             |
| `recency_emphasis`            | Integer             | Optional | Controls how much recent data affects the forecast. Defaults to `2560`.                                                                      |
| `history`                     | Integer             | Optional | The number of past intervals used for model training.                                                                                        |
| `result_index_min_size`       | Integer             | Optional | The minimum primary shard size (in MB) required to trigger index rollover.                                                                                |
| `result_index_min_age`        | Integer             | Optional | The minimum index age (in days) required to trigger index rollover.                                                                                             |
| `result_index_ttl`            | Integer             | Optional | The minimum amount of time (in days) before rolled-over indexes are deleted.                                                                                |
| `flatten_custom_result_index` | Boolean             | Optional | If `true`, flattens nested fields in the custom result index for easier aggregation.                                                         |
| `shingle_size`                | Integer             | Optional | The number of past intervals used to influence the forecast. Defaults to `8`. Recommended range: 4–128.                                      |


### Example request: Single-stream forecaster

The following example creates a single-stream forecaster for the `network-requests` index. The forecaster predicts the maximum value of the `deny` field every 3 minutes, using the previous 300 intervals for training. The `window_delay` setting accounts for ingest latency by delaying the forecast window by 3 minutes:


```json
POST _plugins/_forecast/forecasters
{
    "name": "Second-Test-Forecaster-7",
    "description": "ok rate",
    "time_field": "@timestamp",
    "indices": [
        "network-requests"
    ],
    "feature_attributes": [
        {
            "feature_id": "deny_max",
            "feature_name": "deny max",
            "feature_enabled": true,
            "importance": 1,
            "aggregation_query": {
                "deny_max": {
                    "max": {
                        "field": "deny"
                    }
                }
            }
        }
    ],
    "window_delay": {
        "period": {
            "interval": 3,
            "unit": "MINUTES"
        }
    },
    "forecast_interval": {
        "period": {
            "interval": 3,
            "unit": "MINUTES"
        }
    },
    "schema_version": 2,
    "horizon": 3,
    "history": 300
}
```
{% include copy-curl.html %}

#### Example response 

```json
{
  "_id": "4WnXAYoBU2pVBal92lXD",
  "_version": 1,
  "forecaster": {
    "...": "Configuration (omitted)"
  }
}
```

### Example request: High-cardinality forecaster

The following example creates a high-cardinality forecaster that groups forecasts by the `host_nest.host2` field. Like the single-stream example, it forecasts the maximum value of the `deny` field at 3-minute intervals using historical data. This setup enables entity-specific forecasting across different hosts:

```json
POST _plugins/_forecast/forecasters
{
    "name": "Second-Test-Forecaster-7",
    "description": "ok rate",
    "time_field": "@timestamp",
    "indices": [
        "network-requests"
    ],
    "feature_attributes": [
        {
            "feature_id": "deny_max",
            "feature_name": "deny max",
            "feature_enabled": true,
            "importance": 1,
            "aggregation_query": {
                "deny_max": {
                    "max": {
                        "field": "deny"
                    }
                }
            }
        }
    ],
    "window_delay": {
        "period": {
            "interval": 3,
            "unit": "MINUTES"
        }
    },
    "forecast_interval": {
        "period": {
            "interval": 3,
            "unit": "MINUTES"
        }
    },
    "schema_version": 2,
    "horizon": 3,
    "history": 300,
    "category_field": ["host_nest.host2"],
}
```
{% include copy-curl.html %}

#### Example response 

```json
{
  "_id": "4WnXAYoBU2pVBal92lXD",
  "_version": 1,
  "forecaster": {
    "...": "Configuration (omitted)"
  }
}
```


---


## Validate forecaster

**Introduced 3.1**
{: .label .label-purple }

Use this API to verify that a forecaster configuration is valid. You can perform two types of validation:

- **Configuration-only validation**: Checks that the configuration is syntactically correct and references existing fields.
- **Training-feasibility validation**: Performs a comprehensive validation to ensure that the forecaster can be trained with the specified configuration.


### Endpoints

The following endpoints are available for validating forecasters.

**Configuration-only validation**:

```http
POST _plugins/_forecast/forecasters/_validate
```

**Training-feasibility validation**:

```http
POST _plugins/_forecast/forecasters/_validate/model
```

### Request body

The request body is identical to the request body used to create a forecaster. It must include at least the following required fields: `name`, `time_field`, `indices`, `feature_attributes`, and `forecast_interval`.

If the configuration is valid, the response returns an empty object (`{}`). If the configuration is invalid, the response includes detailed error messages.


### Example request: Missing `forecast_interval`

The following request shows an invalid forecaster configuration that omits the `forecast_interval`:

```json
POST _plugins/_forecast/forecasters/_validate
{
  "name": "invalid-forecaster",
  "time_field": "@timestamp",
  "indices": ["network-requests"],
  "feature_attributes": [
    {
      "feature_id": "deny_max",
      "feature_name": "deny max",
      "feature_enabled": true,
      "aggregation_query": {
        "deny_max": {
          "max": {
            "field": "deny"
          }
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Example response

```json
{
  "forecaster": {
    "forecast_interval": {
      "message": "Forecast interval should be set"
    }
  }
}
```


---

## Suggest configuration

**Introduced 3.1**
{: .label .label-purple }

Returns appropriate values for one or more forecaster parameters (`forecast_interval`, `horizon`, `history`, `window_delay`) based on the cadence and density of your data.


### Endpoints

```
POST _plugins/_forecast/forecasters/_suggest/<comma‑separated-types>
```

`types` must be one or more of `forecast_interval`, `horizon`, `history`, or `window_delay`.


### Example request: Suggest an interval

The following request analyzes the source data and suggests an appropriate `forecast_interval` value for the forecaster based on the average event frequency:

```
POST _plugins/_forecast/forecasters/_suggest/forecast_interval
{
  "name": "interval‑suggest",
  "time_field": "@timestamp",
  "indices": ["network-requests"],
  ...
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "interval": {
    "period": { "interval": 1, "unit": "Minutes" }
  }
}
```

---

## Get forecaster

**Introduced 3.1**
{: .label .label-purple }

Retrieves a forecaster and (optionally) its most recent tasks.

### Endpoints

```
GET _plugins/_forecast/forecasters/<forecaster_id>[?task=(true|false)]
```

### Example request: Include tasks

The following request returns metadata about the forecaster and, if specified, details about its associated tasks:

```json
GET _plugins/_forecast/forecasters/d7-r1YkB_Z-sgDOKo3Z5?task=true
```
{% include copy-curl.html %}

The response includes the `forecaster`, `realtime_task`, and `run_once_task` sections.

---

## Update forecaster

**Introduced 3.1**
{: .label .label-purple }

Updates the configuration of an existing forecaster. You must stop any active forecasting jobs before making updates. 

Any change that affects the model, such as modifying the `category_field`, `result_index`, or `feature_attributes`, invalidates previous results shown in the OpenSearch Dashboards UI.

### Endpoints

```
PUT _plugins/_forecast/forecasters/<forecaster_id>
```


### Example request: Update the name, result index, and category fields

The following displays the definition of forecaster `forecaster-i1nwqooBLXq6T-gGbXI-`:

```json
{
    "_index": ".opensearch-forecasters",
    "_id": "forecaster-i1nwqooBLXq6T-gGbXI-",
    "_version": 1,
    "_seq_no": 0,
    "_primary_term": 1,
    "_score": 1.0,
    "_source": {
        "category_field": [
            "service"
        ],
        "description": "ok rate",
        "feature_attributes": [{
            "feature_id": "deny_max",
            "feature_enabled": true,
            "feature_name": "deny max",
            "aggregation_query": {
                "deny_max": {
                    "max": {
                        "field": "deny"
                    }
                }
            }
        }],
        "forecast_interval": {
            "period": {
                "unit": "Minutes",
                "interval": 1
            }
        },
        "schema_version": 2,
        "time_field": "@timestamp",
        "last_update_time": 1695084997949,
        "horizon": 24,
        "indices": [
            "network-requests"
        ],
        "window_delay": {
            "period": {
                "unit": "Seconds",
                "interval": 20
            }
        },
        "transform_decay": 1.0E-4,
        "name": "Second-Test-Forecaster-3",
        "filter_query": {
            "match_all": {
                "boost": 1.0
            }
        },
        "shingle_size": 8,
        "result_index": "opensearch-forecast-result-a"
    }
}
```

The following request updates the `name`, `result_index`, and `category_field` properties of a forecaster:

```json
PUT localhost:9200/_plugins/_forecast/forecasters/forecast-i1nwqooBLXq6T-gGbXI-
{
    "name": "Second-Test-Forecaster-1",
    "description": "ok rate",
    "time_field": "@timestamp",
    "indices": [
        "network-requests"
    ],
    "feature_attributes": [
        {
            "feature_id": "deny_max",
            "feature_name": "deny max",
            "feature_enabled": true,
            "importance": 1,
            "aggregation_query": {
                "deny_max": {
                    "max": {
                        "field": "deny"
                    }
                }
            }
        }
    ],
    "window_delay": {
        "period": {
            "interval": 20,
            "unit": "SECONDS"
        }
    },
    "forecast_interval": {
        "period": {
            "interval": 1,
            "unit": "MINUTES"
        }
    },
    "ui_metadata": {
        "aabb": {
            "ab": "bb"
        }
    },
    "schema_version": 2,
    "horizon": 24,
    "category_field": ["service", "host"]
}
```
{% include copy-curl.html %}

---


## Delete forecaster

**Introduced 3.1**  
{: .label .label-purple }

Deletes a forecaster configuration. You must stop any associated real-time or run-once forecasting jobs before deletion. If a job is still running, the API returns a `400` error.

### Endpoint

```http
DELETE _plugins/_forecast/forecasters/<forecaster_id>
```

### Example request: Delete a forecaster

The following request deletes a forecaster configuration using its unique ID:

```http
DELETE _plugins/_forecast/forecasters/forecast-i1nwqooBLXq6T-gGbXI-
```
{% include copy-curl.html %}

---

## Start a forecaster job

**Introduced 3.1**  
{: .label .label-purple }

Begins real-time forecasting for a forecaster.

### Endpoints

```http
POST _plugins/_forecast/forecasters/<forecaster_id>/_start
```

### Example request: Start a forecaster job

The following request initiates real-time forecasting for the specified forecaster:

```bash
POST _plugins/_forecast/forecasters/4WnXAYoBU2pVBal92lXD/_start
```
{% include copy-curl.html %}

#### Example response

```json
{ "_id": "4WnXAYoBU2pVBal92lXD" }
```

---

## Stop a forecaster job

**Introduced 3.1**  
{: .label .label-purple }

Stops real-time forecasting for a forecaster.

### Endpoints
```http
POST _plugins/_forecast/forecasters/<forecaster_id>/_stop
```

### Example request: Stop a forecaster job

The following request stops the real-time forecasting job for the specified forecaster:

```bash
POST _plugins/_forecast/forecasters/4WnXAYoBU2pVBal92lXD/_stop
```
{% include copy-curl.html %}


---

## Run one analysis

**Introduced 3.1**
{: .label .label-purple }

Runs backtesting (historical) forecasting. It cannot run while a real-time job is active.

### Endpoint
```http
POST _plugins/_forecast/forecasters/<forecaster_id>/_run_once
```

### Example request: Run a backtesting forecast

The following request starts a run-once forecast analysis for the specified forecaster:

```bash
POST _plugins/_forecast/forecasters/<forecaster_id>/_run_once
```
{% include copy-curl.html %}

#### Example response

The response returns the task ID assigned to the run-once job:

```json
{ "taskId": "vXZG85UBAlM4LplcKI0f" }
```

### Example request: Search forecast results by task ID

Use the returned `taskId` to query the `opensearch-forecast-results*` index for historical forecast output:

```json
GET opensearch-forecast-results*/_search?pretty
{
  "sort": {
    "data_end_time": "desc"
  },
  "size": 10,
  "query": {
    "bool": {
      "filter": [
        { "term": { "task_id": "vXZG85UBAlM4LplcKI0f" } },
        {
          "range": {
            "data_end_time": {
              "format": "epoch_millis",
              "gte": 1742585746033
            }
          }
        }
      ]
    }
  },
  "track_total_hits": true
}
```
{% include copy-curl.html %}

This query returns the 10 most recent forecast results matching the specified task ID.


---

## Search forecasters

**Introduced 3.1**  
{: .label .label-purple }

Provides standard `_search` functionality on the `.opensearch-forecasters` system index, which stores forecaster configurations. You must use this API to query `.opensearch-forecasters` directly because the index is a system index and cannot be accessed through regular OpenSearch queries.

### Endpoint

```http
GET _plugins/_forecast/forecasters/_search
```

### Example request: Wildcard search by index

The following request searches for forecasters whose source index names begin with `network` using a leading-anchored wildcard:

```json
GET _plugins/_forecast/forecasters/_search
{
  "query": {
    "wildcard": {
      "indices": {
        "value": "network*"
      }
    }
  }
}
```
{% include copy-curl.html %}

`network*` matches `network`, `network-metrics`, `network_2025-06`, and similar index names.

#### Example response

```json
{
  "took": 5,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1.0,
    "hits": [{
      "_index": ".opensearch-forecasters",
      "_id": "forecast-i1nwqooBLXq6T-gGbXI-",
      "_version": 1,
      "_seq_no": 0,
      "_primary_term": 1,
      "_score": 1.0,
      "_source": {
        "category_field": ["server"],
        "description": "ok rate",
        "feature_attributes": [{
          "feature_id": "deny_max",
          "feature_enabled": true,
          "feature_name": "deny max",
          "aggregation_query": {
            "deny_max": {
              "max": {
                "field": "deny"
              }
            }
          }
        }],
        "forecast_interval": {
          "period": {
            "unit": "Minutes",
            "interval": 1
          }
        },
        "schema_version": 2,
        "time_field": "@timestamp",
        "last_update_time": 1695084997949,
        "horizon": 24,
        "indices": ["network-requests"],
        "window_delay": {
          "period": {
            "unit": "Seconds",
            "interval": 20
          }
        },
        "transform_decay": 1.0E-4,
        "name": "Second-Test-Forecaster-3",
        "filter_query": {
          "match_all": {
            "boost": 1.0
          }
        },
        "shingle_size": 8
      }
    }]
  }
}
```

---

## Search tasks

**Introduced 3.1**
{: .label .label-purple }

Query tasks in the `.opensearch-forecast-state` index.

### Endpoint

```http
GET _plugins/_forecast/forecasters/tasks/_search
```

### Example request: Search previous run-once tasks

The following request retrieves previous run-once tasks (excluding the most recent) for a specific forecaster and sorts them by `execution_start_time` in descending order:

```json
GET _plugins/_forecast/forecasters/tasks/_search
{
  "from": 0,
  "size": 1000,
  "query": {
    "bool": {
      "filter": [
        { "term": { "forecaster_id": { "value": "m5apnooBHh7Wss2wewfW", "boost": 1.0 }}},
        { "term": { "is_latest": { "value": false, "boost": 1.0 }}},
        { "terms": {
            "task_type": [
              "RUN_ONCE_FORECAST_SINGLE_STREAM",
              "RUN_ONCE_FORECAST_HC_FORECASTER"
            ],
            "boost": 1.0
        }}
      ],
      "adjust_pure_negative": true,
      "boost": 1.0
    }
  },
  "sort": [
    { "execution_start_time": { "order": "desc" }}
  ]
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "took": 3,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": { "value": 1, "relation": "eq" },
    "max_score": null,
    "hits": [
      {
        "_index": ".opensearch-forecast-state",
        "_id": "4JaunooBHh7Wss2wOwcw",
        "_version": 3,
        "_seq_no": 5,
        "_primary_term": 1,
        "_score": null,
        "_source": {
          "last_update_time": 1694879344264,
          "execution_start_time": 1694879333168,
          "forecaster_id": "m5apnooBHh7Wss2wewfW",
          "state": "TEST_COMPLETE",
          "task_type": "RUN_ONCE_FORECAST_SINGLE_STREAM",
          "is_latest": false,
          "forecaster": {
            "description": "ok rate",
            "ui_metadata": { "aabb": { "ab": "bb" }},
            "feature_attributes": [
              {
                "feature_id": "deny_max",
                "feature_enabled": true,
                "feature_name": "deny max",
                "aggregation_query": {
                  "deny_max": {
                    "max": { "field": "deny" }
                  }
                }
              }
            ],
            "forecast_interval": {
              "period": {
                "unit": "Minutes",
                "interval": 1
              }
            },
            "schema_version": 2,
            "time_field": "@timestamp",
            "last_update_time": 1694879022036,
            "horizon": 24,
            "indices": [ "network-requests" ],
            "window_delay": {
              "period": {
                "unit": "Seconds",
                "interval": 20
              }
            },
            "transform_decay": 1.0E-4,
            "name": "Second-Test-Forecaster-5",
            "filter_query": { "match_all": { "boost": 1.0 }},
            "shingle_size": 8
          }
        },
        "sort": [ 1694879333168 ]
      }
    ]
  }
}
```

---

## Top forecasters
**Introduced 3.1**
{: .label .label-purple }

Returns the *top‑k* entities for a given timestamp range, based on built‑in or custom metrics.

### Endpoint

```http
POST _plugins/_forecast/forecasters/<forecaster_id>/results/_topForecasts
```

### Query parameters

The following query parameters are supported.

| Name                    | Type        | Required | Description |
| :--- | :--- | :--- | :--- |
| `split_by` | String | Required | The field to group by (such as `service`). |
| `forecast_from` | Epoch‑ms | Required | The `data_end_time` of the first forecast in the evaluation window. |
| `size` | Integer | Optional | The number of buckets to return. Defaults is `5`. |
| `filter_by` | Enum | Required | Specifies whether to use a built-in or custom query. Must be either `BUILD_IN_QUERY` or `CUSTOM_QUERY`. |
| `build_in_query` | Enum | Optional | One of the following built-in ranking criteria is required:<br> `MIN_CONFIDENCE_INTERVAL_WIDTH` -- Sorts by the narrowest forecast confidence intervals (most precise).<br> `MAX_CONFIDENCE_INTERVAL_WIDTH` -- Sorts by the widest forecast confidence intervals (least precise).<br> `MIN_VALUE_WITHIN_THE_HORIZON` -- Sorts by the lowest forecast value observed within the prediction window.<br> `MAX_VALUE_WITHIN_THE_HORIZON` -- Sorts by the highest forecast value observed within the prediction window.<br> `DISTANCE_TO_THRESHOLD_VALUE` -- Sorts by the difference between the forecast value and a user-defined threshold. |
| `threshold`, `relation_to_threshold` | Mixed | Conditional | Required only if `build_in_query` is `DISTANCE_TO_THRESHOLD_VALUE`. |
| `filter_query` | Query DSL | Optional | A custom query used when `filter_by=CUSTOM_QUERY`. |
| `subaggregations` | Array | Optional | A list of nested aggregations and sort options used to compute additional metrics within each bucket. |

### Example request: Built-in query for narrow confidence intervals

The following request returns the top forecasted entities ranked by the narrowest confidence intervals:

```json
POST _plugins/_forecast/forecasters/AG_3t4kBkYqqimCe86bP/results/_topForecasts
{
  "split_by": "service",
  "filter_by": "BUILD_IN_QUERY",
  "build_in_query": "MIN_CONFIDENCE_INTERVAL_WIDTH",
  "forecast_from": 1691008679297
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "buckets": [
    {
      "key": { "service": "service_6" },
      "doc_count": 1,
      "bucket_index": 0,
      "MIN_CONFIDENCE_INTERVAL_WIDTH": 27.655361
    },
    ...
  ]
}
```

### Example request: Built-in query with the narrowest confidence interval

The following request returns a sorted list of entities whose forecast values have the narrowest confidence intervals. The results are ranked in ascending order based on the `MIN_CONFIDENCE_INTERVAL_WIDTH` metric:

```json
POST _plugins/_forecast/forecasters/AG_3t4kBkYqqimCe86bP/results/_topForecasts
{
  "split_by": "service",
  "filter_by": "BUILD_IN_QUERY",
  "build_in_query": "MIN_CONFIDENCE_INTERVAL_WIDTH",
  "forecast_from": 1691008679297
}
```
{% include copy-curl.html %}

#### Example response

```json
{
    "buckets": [
        {
            "key": {
                "service": "service_6"
            },
            "doc_count": 1,
            "bucket_index": 0,
            "MIN_CONFIDENCE_INTERVAL_WIDTH": 27.655361
        },
        {
            "key": {
                "service": "service_4"
            },
            "doc_count": 1,
            "bucket_index": 1,
            "MIN_CONFIDENCE_INTERVAL_WIDTH": 1324.7734
        },
        {
            "key": {
                "service": "service_0"
            },
            "doc_count": 1,
            "bucket_index": 2,
            "MIN_CONFIDENCE_INTERVAL_WIDTH": 2211.0781
        },
        {
            "key": {
                "service": "service_2"
            },
            "doc_count": 1,
            "bucket_index": 3,
            "MIN_CONFIDENCE_INTERVAL_WIDTH": 3372.0469
        },
        {
            "key": {
                "service": "service_3"
            },
            "doc_count": 1,
            "bucket_index": 4,
            "MIN_CONFIDENCE_INTERVAL_WIDTH": 3980.2812
        }
    ]
}
```

### Example request: Built-in query with distance under a threshold

The following request returns the top entities whose forecast values fall farthest from a specified threshold, based on the `DISTANCE_TO_THRESHOLD_VALUE` metric:

```http
POST _plugins/_forecast/AG_3t4kBkYqqimCe86bP/results/_topForecasts
{
  "split_by": "service",                      // group forecasts by the "service" entity field
  "filter_by": "BUILD_IN_QUERY",              // use a built-in ranking metric
  "build_in_query": "DISTANCE_TO_THRESHOLD_VALUE",
  "forecast_from": 1691008679297,             // data_end_time of the first forecast in scope
  "threshold": -82561.8,                      // user-supplied threshold
  "relation_to_threshold": "LESS_THAN"        // keep only forecasts below the threshold
}
```

#### Example response

The `DISTANCE_TO_THRESHOLD_VALUE` metric calculates `forecast_value – threshold`. Because `relation_to_threshold` is `LESS_THAN`, the API returns negative distances only and sorts them in ascending order (most negative first). Each bucket includes the following values:

- `doc_count`: The number of forecast points that matched.
- `DISTANCE_TO_THRESHOLD_VALUE`: The largest distance within the forecast horizon from the threshold value.

The following response returns the `DISTANCE_TO_THRESHOLD_VALUE`:

```json
{
  "buckets": [
    {
      "key": { "service": "service_5" },
      "doc_count": 18,
      "bucket_index": 0,
      "DISTANCE_TO_THRESHOLD_VALUE": -330387.12
    },
    ...
    {
      "key": { "service": "service_0" },
      "doc_count": 1,
      "bucket_index": 4,
      "DISTANCE_TO_THRESHOLD_VALUE": -83561.8
    }
  ]
}
```

### Example request: Custom query and nested aggregations

The following request uses a custom query to match services by name and ranks them by the highest forecast value:

```json
POST _plugins/_forecast/AG_3t4kBkYqqimCe86bP/results/_topForecasts
{
  "split_by": "service",
  "forecast_from": 1691018993776,
  "filter_by": "CUSTOM_QUERY",
  "filter_query": {
    "nested": {
      "path": "entity",
      "query": {
        "bool": {
          "must": [
            { "term": { "entity.name": "service" } },
            { "wildcard": { "entity.value": "User*" } }
          ]
        }
      }
    }
  },
  "subaggregations": [
    {
      "aggregation_query": {
        "forecast_value_max": {
          "max": { "field": "forecast_value" }
        }
      },
      "order": "DESC"
    }
  ]
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "buckets": [
    {
      "key": { "service": "UserAuthService" },
      "doc_count": 24,
      "bucket_index": 0,
      "forecast_value_max": 269190.38
    },
    ...
  ]
}
```
---

## Profile forecaster

**Introduced 3.1**  
{: .label .label-purple }

Returns execution-time state such as initialization progress, per-entity model metadata, and errors. This API is useful for inspecting forecaster intervals during runtime.

### Endpoints

```http
GET _plugins/_forecast/forecasters/<forecaster_id>/_profile[/<type1>,<type2>][?_all=true]
```

You can retrieve specific profile types or request all available types using the `_all` query parameter.

The following profile types are supported:

- `state`
- `error`
- `coordinating_node`
- `total_size_in_bytes`
- `init_progress`
- `models`
- `total_entities`
- `active_entities`
- `forecast_task`

If you include an `entity` array in the request body, the profile is scoped to that entity only.

### Example request: Default profile with an entity filter

The following request returns the default profile types (`state` and `error`) for the specified entity:

```http
GET _plugins/_forecast/forecasters/tLch1okBCBjX5EchixQ8/_profile
{
  "entity": [
    {
      "name": "service",
      "value": "app_1"
    },
    {
      "name": "host",
      "value": "server_2"
    }
  ]
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "state": "RUNNING"
}
```

### Example request: Multiple profile types

The following request retrieves `init_progress`, `error`, `total_entities`, and `state` profile types:

```http
GET _plugins/_forecast/forecasters/mZ6P0okBTUNS6IWgvpwo/_profile/init_progress,error,total_entities,state
```
{% include copy-curl.html %}

### Example request: All profile types

The following request returns all available profile types:

```http
GET _plugins/_forecast/forecasters/d7-r1YkB_Z-sgDOKo3Z5/_profile?_all=true&pretty
```
{% include copy-curl.html %}


---

## Forecaster stats
**Introduced 3.1**  
{: .label .label-purple }

Returns cluster-level or node-level statistics, including the number of forecasters, model counts, request counters, and the health of internal forecast indexes.

### Endpoints

```http
GET _plugins/_forecast/stats
GET _plugins/_forecast/<node_id>/stats
GET _plugins/_forecast/stats/<stat_name>
```

### Example request: Retrieve all statistics

The following request retrieves cluster-level statistics for all forecasters, including counts, model information, and index status:

```http
GET _plugins/_forecast/stats
```
{% include copy-curl.html %}

#### Example response

```json
{
  "hc_forecaster_count": 1,
  "forecast_results_index_status": "yellow",
  "forecast_models_checkpoint_index_status": "yellow",
  "single_stream_forecaster_count": 1,
  "forecastn_state_status": "yellow",
  "forecaster_count": 2,
  "job_index_status": "yellow",
  "config_index_status": "yellow",
  "nodes": {
    "8B2S4ClnRFK3GTjO45bwrw": {
      "models": [
        {
          "model_type": "rcf_caster",
          "last_used_time": 1692245336895,
          "model_id": "Doj0AIoBEU5Xd2ccoe_9_entity_SO2kPi_PAMsvThWyE-zYHg",
          "last_checkpoint_time": 1692233157256,
          "entity": [
            { "name": "host_nest.host2", "value": "server_2" }
          ]
        }
      ],
      "forecast_hc_execute_request_count": 204,
      "forecast_model_corruption_count": 0,
      "forecast_execute_failure_count": 0,
      "model_count": 4,
      "forecast_execute_request_count": 409,
      "forecast_hc_execute_failure_count": 0
    }
  }
}
```

### Example request: Retrieve statistics for a specific node

The following request retrieves forecaster statistics for a specific node, identified by node ID:

```http
GET _plugins/_forecast/8B2S4ClnRFK3GTjO45bwrw/stats
```
{% include copy-curl.html %}

### Example request: Retrieve the total number of high-cardinality requests

The following request retrieves the total number of high-cardinality forecaster requests across all nodes:

```http
GET _plugins/_forecast/stats/forecast_hc_execute_request_count
```
{% include copy-curl.html %}

### Example request: Retrieve the high-cardinality request count for a specific node

The following request retrieves the number of high-cardinality forecaster requests executed by a specific node:

```http
GET _plugins/_forecast/0ZpL8WEYShy-qx7hLJQREQ/stats/forecast_hc_execute_request_count/
```
{% include copy-curl.html %}


---

## Forecaster info
**Introduced 3.1**
{: .label .label-purple }

Returns a single integer representing the total number of forecaster configurations in the cluster or checks whether a forecaster that satisfies a given search criterion exists.


### Endpoints
```http
GET _plugins/_forecast/forecasters/count
GET _plugins/_forecast/forecasters/match?name=<forecaster_name>
```

### Example request: Count forecasters

The following request returns the number of forecaster configurations currently stored in the cluster:

```http
GET _plugins/_forecast/forecasters/count
```
{% include copy-curl.html %}

### Example response

```json
{
  "count": 2,
  "match": false
}
```

### Example request: Match forecaster name

The following request looks for a forecaster named `Second-Test-Forecaster-3`:

```http
GET _plugins/_forecast/forecasters/match?name=Second-Test-Forecaster-3
```
{% include copy-curl.html %}

### Example response: Match found

```json
{
  "count": 0,
  "match": true
}
```

### Example response: No match found

```json
{
  "count": 0,
  "match": false
}
```
