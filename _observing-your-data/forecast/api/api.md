---
layout: default
title: Forecasting API
parent: Forecasting
nav_order: 1
---

# Forecasting API

Use these operations to programmatically create and manage *forecasters* that generate forecasts over your time‑series data.

---

## Table of contents
- TOC
{:toc}

---

## Create forecaster

Introduced 3.1
{: .label .label-purple }

Creates a forecaster.  
A forecaster can be **single‑stream** (no category field) or **high‑cardinality (HC)** (one or more category fields). When you create a forecaster you define:
* Source index or indices
* Forecast interval (forecast_interval)
* Forecast horizon (the number of future intervals to predict)
* Feature to forecast (one numeric field; multiple features are not supported)
* Category fields (optional, for entity-specific forecasts)
* Custom result index (optional)

Request syntax
```http
POST _plugins/_forecast/forecasters
```

Request body

Field | Type | Required | Description
---|---|---|---
`name` | string | ✓ | Forecaster name.
`description` | string |  | Free‑form description.
`time_field` | string | ✓ | Timestamp field.
`indices` | string&#124;string[] | ✓ | One or more source indices or index aliases.
`feature_attributes` | object[] | ✓ | Defines the feature—referred to as an indicator in OpenSearch Dashboards. Only one feature/indicator is allowed. Each object must include both feature_name and an aggregation_query.
`forecast_interval` | period-object | ✓ | Forecasting interval (bucket length).
`horizon` | integer |  | Number of future intervals the model predicts.
`window_delay` | period-object |  | Delay applied when collecting data to accommodate ingest latency.
`category_field` | string[] |  | One or two fields that partition the series (HC forecaster).
`result_index` | string |  | Custom index alias for storing forecast results. The alias must begin with `opensearch-forecast-result-`. If omitted, results are stored under the default alias `opensearch-forecast-results`, which automatically manages data retention (e.g., keeps results for at least 30 days before deletion).
`suggested_seasonality` | integer | | The consistent seasonal variation of the data (in intervals). Forecaster expects the suggested seasonality to be in the range of 8 and 256.
`recency_emphasis` | integer | | Controls how much recent data influences the forecast. Higher values emphasize recent data less sharply, similar to a moving average but with exponential decay. Defaults to **2560**.
`history` | integer | | How far back the model looks for training data.
`result_index_min_size` | integer | | Minimum primary shard size (in MB) to trigger index rollover. Example: 51200 MB.
`result_index_min_age` | integer | | Minimum index age (in days) to trigger rollover.
`result_index_ttl` | integer | | Minimum age (in days) required to delete rolled-over indexes.
`flatten_custom_result_index` | boolean | | Flattens nested fields in custom results indexes to ease aggregation and visualization. The plugin creates a dedicated index with a flattened structure and a Painless ingest pipeline.
`shingle_size` | integer | | Number of past forecast intervals that strongly influence the next forecast. Default is **8**. Expected range: **4–128**. Smaller for rapidly changing data, larger for strong cyclical patterns.


Example – single‑stream

```http
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
    "history": 3
}
```

Response
```json
{
  "_id": "4WnXAYoBU2pVBal92lXD",
  "_version": 1,
  "forecaster": {
    "...": "Configuration (omitted)"
  }
}
```

Example – high-cardinality (categorical)

```http
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
    "history": 3,
    "category_field": ["host_nest.host2"],
}
```

Response
```json
{
  "_id": "Doj0AIoBEU5Xd2ccoe_9",
  "_version": 1,
  "forecaster": {
    "...": "Configuration (omitted)"
  }
}
```

---

## Validate forecaster

Introduced 3.1
{: .label .label-purple }

Checks that a _prospective_ configuration is syntactically correct, refers to existing fields, and is likely to succeed during training.

Request syntax
There are two variants:

* **Configuration‑only validation**
  ```http
  POST _plugins/_forecast/forecasters/_validate              # shortcut  
  POST _plugins/_forecast/forecasters/_validate/forecaster  # explicit
  ```

* **Training‑feasibility validation**
  ```http
  POST _plugins/_forecast/forecasters/_validate/model
  ```

The request body is identical to **Create forecaster**.  
If the configuration is valid, the API returns an empty object (`{}`).  
Otherwise it returns a structure that pin‑points the problem.

Example – missing `forecast_interval`

```http
POST _plugins/_forecast/forecasters/_validate
{
  "name": "invalid-forecaster",
  ...
}
```
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

Introduced 3.1
{: .label .label-purple }

Returns reasonable values for one or more forecaster parameters (`forecast_interval`, `horizon`, `history`, `window_delay`) based on the cadence and density of your data.

Request syntax
```http
POST _plugins/_forecast/forecasters/_suggest/<comma‑separated types>
```

`types` must be one or more of `forecast_interval`, `horizon`, `history`, `window_delay`.

Example – suggest interval
```http
POST _plugins/_forecast/forecasters/_suggest/forecast_interval
{
  "name": "interval‑suggest",
  "time_field": "@timestamp",
  "indices": ["network-requests"],
  ...
}
```
```json
{
  "interval": {
    "period": { "interval": 1, "unit": "Minutes" }
  }
}
```

---

## Get forecaster

Introduced 3.1
{: .label .label-purple }

Retrieves a forecaster and (optionally) its latest tasks.

Request syntax
```http
GET _plugins/_forecast/forecasters/<forecaster_id>[?task=(true|false)]
```

Example – include tasks
```http
GET _plugins/_forecast/forecasters/d7-r1YkB_Z-sgDOKo3Z5?task=true
```

Response includes `forecaster`, `realtime_task`, and `run_once_task` sections.

---

## Update forecaster

Introduced 3.1
{: .label .label-purple }

The API overwrites the existing forecaster configuration. Ensure you stop any active forecasting jobs before updating the forecaster.

```http
PUT _plugins/_forecast/forecasters/<forecaster_id>
```

You can modify any field, but changes impacting the model—such as edits to the category_field, result_index, or feature/indicator definitions—will invalidate previous results displayed in the Dashboards UI.

For example, the current definition of forecaster `forecaster-i1nwqooBLXq6T-gGbXI-` before your changes is:


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

Request to update the name, result index, and categorical fields:

```http
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

---

## Delete forecaster

Introduced 3.1
{: .label .label-purple }

Deletes the configuration **after** you stop real‑time and run‑once jobs.

```http
DELETE _plugins/_forecast/forecasters/<forecaster_id>
```

A `400` error is returned if analysis is still running.

---

## Start forecaster job

Introduced 3.1
{: .label .label-purple }

Begins real‑time forecasting for a forecaster.

```http
POST _plugins/_forecast/forecasters/<forecaster_id>/_start
```

Example
```json
{ "_id": "4WnXAYoBU2pVBal92lXD" }
```

---

## Stop forecaster job

Introduced 3.1
{: .label .label-purple }

Stops real‑time forecasting for a forecaster.

```http
POST _plugins/_forecast/forecasters/<forecaster_id>/_stop
```

---

## Run once analysis

Introduced 3.1
{: .label .label-purple }

Runs back‑testing (historical) forecasting. You cannot run it while a real‑time job is active.

```http
POST _plugins/_forecast/forecasters/<forecaster_id>/_run_once
```

Response returns only the task ID:

```json
{ "taskId": "vXZG85UBAlM4LplcKI0f" }
```

Use the returned taskId to search for historical forecast results:

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

This query returns the most recent ten forecast results matching the specified task id.

---

## Search forecasters

Introduced 3.1
{: .label .label-purple }

This API provides standard `_search` functionality on the `.opensearch-forecasters` system index, which stores forecaster configurations. You must use this API to query `.opensearch-forecasters` index directly, as the index is a system index and cannot be accessed through regular OpenSearch queries.


```http
GET _plugins/_forecast/forecasters/_search
```

Example

To find forecasters whose source index names begin with network, use a wildcard that anchors the pattern at the start of the string:

```http
Request:

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

network* matches network, network-metrics, network_2025-06, etc.

Response:

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
                "category_field": [
                    "server"
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
                "shingle_size": 8
            }
        }]
    }
}
```

---

## Search tasks

Introduced 3.1
{: .label .label-purple }

Query tasks in the `.opensearch-forecast-state` index.

```http
GET _plugins/_forecast/forecasters/tasks/_search
```

Filter by `forecaster_id`, `task_type`, `is_latest`, and sort by `execution_start_time` to retrieve either run-once or real-time tasks.

Example:

Search previous run-once tasks (excluding the latest):

```http
GET _plugins/_forecast/forecasters/tasks/_search
{
    "from": 0,
    "size": 1000,
    "query": {
        "bool": {
            "filter": [
                {
                    "term": {
                        "forecaster_id": {
                            "value": "m5apnooBHh7Wss2wewfW",
                            "boost": 1.0
                        }
                    }
                },
                {
                    "term": {
                        "is_latest": {
                            "value": false,
                            "boost": 1.0
                        }
                    }
                },
                {
                    "terms": {
                        "task_type": [
                            "RUN_ONCE_FORECAST_SINGLE_STREAM",
                            "RUN_ONCE_FORECAST_HC_FORECASTER"
                        ],
                        "boost": 1.0
                    }
                }
            ],
            "adjust_pure_negative": true,
            "boost": 1.0
        }
    },
    "sort": [
        {
            "execution_start_time": {
                "order": "desc"
            }
        }
    ]
}
```

Response:

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
        "total": {
            "value": 1,
            "relation": "eq"
        },
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
                        "ui_metadata": {
                            "aabb": {
                                "ab": "bb"
                            }
                        },
                        "feature_attributes": [
                            {
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
                        "name": "Second-Test-Forecaster-5",
                        "filter_query": {
                            "match_all": {
                                "boost": 1.0
                            }
                        },
                        "shingle_size": 8
                    }
                },
                "sort": [
                    1694879333168
                ]
            }
        ]
    }
}
```


---

## Top forecasts

Introduced 3.1
{: .label .label-purple }

Returns the *top‑k* entities for a given timestamp range, based on built‑in or custom metrics.

```http
POST _plugins/_forecast/forecasters/<forecaster_id>/results/_topForecasts
```

Parameters:

Name | Type | Required | Description
---|---|---|---
`split_by` | string | ✓ | Field to group by (e.g. `service`).
`forecast_from` | epoch‑ms | ✓ | `data_end_time` of the *first* forecast in the evaluation window.
`size` | integer |  | Number of buckets to return (default `5`).
`filter_by` | enum | ✓ | `BUILD_IN_QUERY` or `CUSTOM_QUERY`.
`build_in_query` | enum | | One of `MIN_CONFIDENCE_INTERVAL_WIDTH`, `MAX_CONFIDENCE_INTERVAL_WIDTH`, `MIN_VALUE_WITHIN_THE_HORIZON`, `MAX_VALUE_WITHIN_THE_HORIZON`, `DISTANCE_TO_THRESHOLD_VALUE`.
`threshold`, `relation_to_threshold` |  | Required if `DISTANCE_TO_THRESHOLD_VALUE`.
`filter_query` | query‑DSL | | Used when `filter_by=CUSTOM_QUERY`.
`subaggregations` | array | | Nested aggregations (custom order criteria).

Example 1 – Built-in query: entities with the **narrowest** confidence interval (`MIN_CONFIDENCE_INTERVAL_WIDTH`, ascending)

```http
POST _plugins/_forecast/forecasters/AG_3t4kBkYqqimCe86bP/results/_topForecasts
{
  "split_by": "service",
  "filter_by": "BUILD_IN_QUERY",
  "build_in_query": "MIN_CONFIDENCE_INTERVAL_WIDTH",
  "forecast_from": 1691008679297
}
```

Returns a `buckets` array sorted by the chosen metric.

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

Example 2 – built-in query: distance below a threshold

The following call returns the **entities whose forecast values are farthest *below* a user-defined threshold** at a given point in time:

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

DISTANCE_TO_THRESHOLD_VALUE calculates forecast_value – threshold. Because relation_to_threshold is LESS_THAN, the API returns negative distances only and sorts them ascending (most negative first). Each bucket represents one service and includes:
* doc_count – number of forecast points that matched
* DISTANCE_TO_THRESHOLD_VALUE – the worst (lowest) distance within the horizon

Response:

```json
{
  "buckets": [
    {
      "key": { "service": "service_5" },
      "doc_count": 18,
      "bucket_index": 0,
      "DISTANCE_TO_THRESHOLD_VALUE": -330387.12   // farthest below the threshold
    },
    ...
    {
      "key": { "service": "service_0" },
      "doc_count": 1,
      "bucket_index": 4,
      "DISTANCE_TO_THRESHOLD_VALUE": -83561.8     // closest to the threshold
    }
  ]
}

```

Example 3 – custom query with nested filter and sub-aggregation

This example shows how to rank entities using a custom filter and aggregation instead of the built-in metrics:

```http
POST _plugins/_forecast/AG_3t4kBkYqqimCe86bP/results/_topForecasts
{
  "split_by": "service",                    // build one bucket per "service"
  "forecast_from": 1691018993776,

  "filter_by": "CUSTOM_QUERY",              // use a custom DSL query
  "filter_query": {                         // Retain only entities whose service names begin with User.
    "nested": {
      "path": "entity",
      "query": {
        "bool": {
          "must": [
            { "term":      { "entity.name":  "service"  } },
            { "wildcard":  { "entity.value": "User*"    } }
          ]
        }
      }
    }
  },

  "subaggregations": [                      // compute an extra metric inside each bucket
    {
      "aggregation_query": {
        "forecast_value_max": {
          "max": { "field": "forecast_value" }
        }
      },
      "order": "DESC"                       // sort buckets by the max forecast value (highest first)
    }
  ]
}
```

filter_query narrows the result set to entities whose name is service and value matches service_*. subaggregations adds a custom metric (forecast_value_max) and sorts the buckets in descending order of that metric.

Response:

```json
{
  "buckets": [
    {
      "key":            { "service": "UserAuthService" },
      "doc_count":      24,
      "bucket_index":   0,
      "forecast_value_max": 269190.38   // highest max forecast value
    },
    {
      "key":            { "service": "UserProfileService" },
      "doc_count":      24,
      "bucket_index":   1,
      "forecast_value_max": 158846.23
    },
    ...
    {
      "key":            { "service": "UserDataSync" },
      "doc_count":      24,
      "bucket_index":   4,
      "forecast_value_max": 34.79564    // lowest max forecast value
    }
  ]
}

```

Use these patterns to build your own top-k queries that surface the most critical forecasted entities based on either built-in metrics or fully custom aggregations.

---

## Profile forecaster

Introduced 3.1
{: .label .label-purple }

Returns execution‑time state such as initialization progress, per‑entity model metadata, and errors.

```http
GET _plugins/_forecast/forecasters/<forecaster_id>/_profile[/<type1>,<type2>][?_all=true]
```

Types: `state`, `error`, `coordinating_node`, `total_size_in_bytes`, `init_progress`, `models`, `total_entities`, `active_entities`, `forecast_task`.  

Provide an `entity` array in the request body to profile a specific entity.


Example:

Retrieve the default profile (`state` and `error`) associated with an entity:

```http
GET _plugins/_forecast/forecasters/tLch1okBCBjX5EchixQ8/_profile
{
    "entity" : [
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

Response:

```json
{
    "state": "RUNNING"
}
```

You can specify multiple profile types for a forecaster in a single request as shown below:

```http
GET _plugins/_forecast/forecasters/mZ6P0okBTUNS6IWgvpwo/_profile/init_progress,error,total_entities,state
```

Alternatively, request all available profile types using the _all parameter:

```http
GET _plugins/_forecast/forecasters/d7-r1YkB_Z-sgDOKo3Z5/_profile?_all=true&pretty
```

---

## Forecaster stats

Introduced 3.1
{: .label .label-purple }

Cluster‑level or node‑level statistics.

```http
GET _plugins/_forecast/stats
GET _plugins/_forecast/<node_id>/stats
GET _plugins/_forecast/stats/<stat_name>
```

Stats include the number of forecasters, model counts, request counters, and index health.

Example

Request:

```http
GET _plugins/_forecast/stats
```

Response:

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
                        {
                            "name": "host_nest.host2",
                            "value": "server_2"
                        }
                    ]
                },
                {
                    "model_type": "rcf_caster",
                    "last_used_time": 1692245336890,
                    "model_id": "Doj0AIoBEU5Xd2ccoe_9_entity_7EHht_bcBHb6WXz5cP3GpQ",
                    "last_checkpoint_time": 1692233157167,
                    "entity": [
                        {
                            "name": "host_nest.host2",
                            "value": "server_3"
                        }
                    ]
                },
                {
                    "model_type": "rcf_caster",
                    "last_used_time": 1692245336901,
                    "model_id": "Doj0AIoBEU5Xd2ccoe_9_entity_6WgC5eXPRwb6vPjLwhI7Tw",
                    "last_checkpoint_time": 1692233157349,
                    "entity": [
                        {
                            "name": "host_nest.host2",
                            "value": "server_1"
                        }
                    ]
                },
                {
                    "model_type": "rcf_caster",
                    "last_used_time": 1692245379022,
                    "model_id": "CIjzAIoBEU5Xd2cc8u-R_model_rcf_0",
                    "last_checkpoint_time": 1692233139607
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

Request:

Retrieve statistics for node 8B2S4ClnRFK3GTjO45bwrw:

```http
GET _plugins/_forecast/8B2S4ClnRFK3GTjO45bwrw/stats
```

Retrieve the total count of high-cardinality forecaster requests across all nodes:

```http
GET _plugins/_forecast/stats/forecast_hc_execute_request_count
```

Retrieve the count of high-cardinality forecaster requests for a specific node (0ZpL8WEYShy-qx7hLJQREQ):

```http
GET _plugins/_forecast/0ZpL8WEYShy-qx7hLJQREQ/stats/forecast_hc_execute_request_count/
```

---

## Forecaster info

Introduced 3.1
{: .label .label-purple }

Returns a single integer representing the total number of forecaster configurations in the cluster.

```http
GET _plugins/_forecast/forecasters/count
```

Example response:

```json
{
  "count": 2,
  "match": false
}

```

Checks whether a forecaster that satisfies a given search criterion exists. The example below looks for a forecaster named Second-Test-Forecaster-3.

```http
GET _plugins/_forecast/forecasters/match?name=Second-Test-Forecaster-3

```

When a match is found, match is true because the name is already in use.

```json
{
  "count": 0,
  "match": true
}
```

When no match is found, match is false, indicating the name is available.

```json
{
  "count": 0,
  "match": false
}
```
