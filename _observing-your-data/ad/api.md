---
layout: default
title: Anomaly detection API
parent: Anomaly detection
nav_order: 1
redirect_from: 
  - /monitoring-plugins/ad/api/
---

# Anomaly detection API

Use these anomaly detection operations to programmatically create and manage detectors.

---

#### Table of contents
- TOC
{:toc}


---

## Create anomaly detector
Introduced 1.0
{: .label .label-purple }

Creates an anomaly detector.

This command creates a single-entity detector named `test-detector` that finds anomalies based on the sum of the `value` field and stores the result in a custom `opensearch-ad-plugin-result-test` index:

#### Request

```json
POST _plugins/_anomaly_detection/detectors
{
  "name": "test-detector",
  "description": "Test detector",
  "time_field": "timestamp",
  "indices": [
    "server_log*"
  ],
  "feature_attributes": [
    {
      "feature_name": "test",
      "feature_enabled": true,
      "aggregation_query": {
        "test": {
          "sum": {
            "field": "value"
          }
        }
      }
    }
  ],
  "filter_query": {
    "bool": {
      "filter": [
        {
          "range": {
            "value": {
              "gt": 1
            }
          }
        }
      ],
      "adjust_pure_negative": true,
      "boost": 1
    }
  },
  "detection_interval": {
    "period": {
      "interval": 1,
      "unit": "Minutes"
    }
  },
  "window_delay": {
    "period": {
      "interval": 1,
      "unit": "Minutes"
    }
  },
  "result_index" : "opensearch-ad-plugin-result-test"
}
```

#### Example response

```json
{
  "_id": "VEHKTXwBwf_U8gjUXY2s",
  "_version": 1,
  "_seq_no": 5,
  "anomaly_detector": {
    "name": "test-detector",
    "description": "Test detector",
    "time_field": "timestamp",
    "indices": [
      "server_log*"
    ],
    "filter_query": {
      "bool": {
        "filter": [
          {
            "range": {
              "value": {
                "from": 1,
                "to": null,
                "include_lower": false,
                "include_upper": true,
                "boost": 1
              }
            }
          }
        ],
        "adjust_pure_negative": true,
        "boost": 1
      }
    },
    "detection_interval": {
      "period": {
        "interval": 1,
        "unit": "Minutes"
      }
    },
    "window_delay": {
      "period": {
        "interval": 1,
        "unit": "Minutes"
      }
    },
    "shingle_size": 8,
    "schema_version": 0,
    "feature_attributes": [
      {
        "feature_id": "U0HKTXwBwf_U8gjUXY2m",
        "feature_name": "test",
        "feature_enabled": true,
        "aggregation_query": {
          "test": {
            "sum": {
              "field": "value"
            }
          }
        }
      }
    ],
    "last_update_time": 1633392680364,
    "user": {
      "name": "admin",
      "backend_roles": [
        "admin"
      ],
      "roles": [
        "own_index",
        "all_access"
      ],
      "custom_attribute_names": [],
      "user_requested_tenant": "__user__"
    },
    "detector_type": "SINGLE_ENTITY"
  },
  "_primary_term": 1
}
```

To create a high cardinality detector by specifying a category field:

#### Request

```json
POST _plugins/_anomaly_detection/detectors
{
  "name": "test-hc-detector",
  "description": "Test detector",
  "time_field": "timestamp",
  "indices": [
    "server_log*"
  ],
  "feature_attributes": [
    {
      "feature_name": "test",
      "feature_enabled": true,
      "aggregation_query": {
        "test": {
          "sum": {
            "field": "value"
          }
        }
      }
    }
  ],
  "filter_query": {
    "bool": {
      "filter": [
        {
          "range": {
            "value": {
              "gt": 1
            }
          }
        }
      ],
      "adjust_pure_negative": true,
      "boost": 1
    }
  },
  "detection_interval": {
    "period": {
      "interval": 1,
      "unit": "Minutes"
    }
  },
  "window_delay": {
    "period": {
      "interval": 1,
      "unit": "Minutes"
    }
  },
  "category_field": [
    "ip"
  ]
}
```

#### Example response

```json
{
  "_id": "b0HRTXwBwf_U8gjUw43R",
  "_version": 1,
  "_seq_no": 6,
  "anomaly_detector": {
    "name": "test-hc-detector",
    "description": "Test detector",
    "time_field": "timestamp",
    "indices": [
      "server_log*"
    ],
    "filter_query": {
      "bool": {
        "filter": [
          {
            "range": {
              "value": {
                "from": 1,
                "to": null,
                "include_lower": false,
                "include_upper": true,
                "boost": 1
              }
            }
          }
        ],
        "adjust_pure_negative": true,
        "boost": 1
      }
    },
    "detection_interval": {
      "period": {
        "interval": 1,
        "unit": "Minutes"
      }
    },
    "window_delay": {
      "period": {
        "interval": 1,
        "unit": "Minutes"
      }
    },
    "shingle_size": 8,
    "schema_version": 0,
    "feature_attributes": [
      {
        "feature_id": "bkHRTXwBwf_U8gjUw43K",
        "feature_name": "test",
        "feature_enabled": true,
        "aggregation_query": {
          "test": {
            "sum": {
              "field": "value"
            }
          }
        }
      }
    ],
    "last_update_time": 1633393165265,
    "category_field": [
      "ip"
    ],
    "user": {
      "name": "admin",
      "backend_roles": [
        "admin"
      ],
      "roles": [
        "own_index",
        "all_access"
      ],
      "custom_attribute_names": [],
      "user_requested_tenant": "__user__"
    },
    "detector_type": "MULTI_ENTITY"
  },
  "_primary_term": 1
}
```

You can specify a maximum of two category fields:

```json
"category_field": [
  "ip"
]
```

```json
"category_field": [
  "ip", "error_type"
]
```

You can specify the following options.

Options | Description | Type | Required
:--- | :--- |:--- |:--- |
`name` |  The name of the detector. | `string` | Yes
`description` |  A description of the detector. | `string` | No
`time_field` |  The name of the time field. | `string` | Yes
`indices`  |  A list of indices to use as the data source. | `list` | Yes
`feature_attributes` | Specify a `feature_name`, set the `enabled` parameter to `true`, and specify an aggregation query. | `list` | Yes
`filter_query` |  Provide an optional filter query for your feature. | `object` | No
`detection_interval` | The time interval for your anomaly detector. | `object` | Yes
`window_delay` | Add extra processing time for data collection. | `object` | No
`category_field` | Categorizes or slices data with a dimension. Similar to `GROUP BY` in SQL. | `list` | No

---

## Validate detector
Introduced 1.2
{: .label .label-purple }

Returns whether the detector configuration has any issues that might prevent OpenSearch from creating the detector.

You can use the validate detector API operation to identify issues in your detector configuration before creating the detector.

The request body consists of the detector configuration and follows the same format as the request body of the [create detector API]({{site.url}}{{site.baseurl}}/monitoring-plugins/ad/api#create-anomaly-detector).

You have the following validation options:

- Only validate against the detector configuration and find any issues that would completely block detector creation:

```
POST _plugins/_anomaly_detection/detectors/_validate
POST _plugins/_anomaly_detection/detectors/_validate/detector
```

- Validate against the source data to see how likely the detector would complete model training.

```
POST _plugins/_anomaly_detection/detectors/_validate/model
```

Responses from this API operation return either blocking issues as detector type responses or a response indicating a field that could be revised to increase likelihood of model training completing successfully. Model type issues don’t need to be fixed for detector creation to succeed, but the detector would likely not train successfully if they aren’t addressed.

#### Request

```json
POST _plugins/_anomaly_detection/detectors/_validate
POST _plugins/_anomaly_detection/detectors/_validate/detector
{
  "name": "test-detector",
  "description": "Test detector",
  "time_field": "timestamp",
  "indices": [
    "server_log*"
  ],
  "feature_attributes": [
    {
      "feature_name": "test",
      "feature_enabled": true,
      "aggregation_query": {
        "test": {
          "sum": {
            "field": "value"
          }
        }
      }
    }
  ],
  "filter_query": {
    "bool": {
      "filter": [
        {
          "range": {
            "value": {
              "gt": 1
            }
          }
        }
      ],
      "adjust_pure_negative": true,
      "boost": 1
    }
  },
  "detection_interval": {
    "period": {
      "interval": 1,
      "unit": "Minutes"
    }
  },
  "window_delay": {
    "period": {
      "interval": 1,
      "unit": "Minutes"
    }
  }
}
```

If the validate detector API doesn’t find any issue in the detector configuration, it returns an empty response:

#### Example response

```json
{}
```

If the validate detector API finds an issue, it returns a message explaining what's wrong with the configuration. In this example, the feature query aggregates over a field that doesn’t exist in the data source:

#### Example response

```json
{
  "detector": {
    "feature_attributes": {
      "message": "Feature has invalid query returning empty aggregated data: average_total_rev",
      "sub_issues": {
        "average_total_rev": "Feature has invalid query returning empty aggregated data"
      }
    }
  }
}
```

The following request validates against the source data to see if model training might succeed. In this example, the data is ingested at a rate of every 5 minutes, and detector interval is set to 1 minute.

```json
POST _plugins/_anomaly_detection/detectors/_validate/model
{
  "name": "test-detector",
  "description": "Test detector",
  "time_field": "timestamp",
  "indices": [
    "server_log*"
  ],
  "feature_attributes": [
    {
      "feature_name": "test",
      "feature_enabled": true,
      "aggregation_query": {
        "test": {
          "sum": {
            "field": "value"
          }
        }
      }
    }
  ],
  "filter_query": {
    "bool": {
      "filter": [
        {
          "range": {
            "value": {
              "gt": 1
            }
          }
        }
      ],
      "adjust_pure_negative": true,
      "boost": 1
    }
  },
  "detection_interval": {
    "period": {
      "interval": 1,
      "unit": "Minutes"
    }
  },
  "window_delay": {
    "period": {
      "interval": 1,
      "unit": "Minutes"
    }
  }
}
```

If the validate detector API finds areas of improvement with your configuration, it returns a response with suggestions about how you can change your configuration to improve model training.

#### Sample Responses

In this example, the validate detector API returns a response indicating that changing the detector interval length to at least four minutes can increase the chances of successful model training.

```json
{
  "model": {
    "detection_interval": {
      "message": "The selected detector interval might collect sparse data. Consider changing interval length to: 4",
      "suggested_value": {
        "period": {
          "interval": 4,
          "unit": "Minutes"
        }
      }
    }
  }
}
```

Another response might indicate that you can change `filter_query` (data filter) because the currently filtered data is too sparse for the model to train correctly, which can happen because the index is also ingesting data that falls outside the chosen filter. Using another `filter_query` can make your data more dense.

```json
{
  "model": {
    "filter_query": {
      "message": "Data is too sparse after data filter is applied. Consider changing the data filter"
    }
  }
}
```

---

## Get detector
Introduced 1.0
{: .label .label-purple }

Returns all information about a detector based on the `detector_id`.

#### Request

```json
GET _plugins/_anomaly_detection/detectors/<detectorId>
```

#### Example response

```json
{
  "_id": "VEHKTXwBwf_U8gjUXY2s",
  "_version": 1,
  "_primary_term": 1,
  "_seq_no": 5,
  "anomaly_detector": {
    "name": "test-detector",
    "description": "Test detector",
    "time_field": "timestamp",
    "indices": [
      "server_log*"
    ],
    "filter_query": {
      "bool": {
        "filter": [
          {
            "range": {
              "value": {
                "from": 1,
                "to": null,
                "include_lower": false,
                "include_upper": true,
                "boost": 1
              }
            }
          }
        ],
        "adjust_pure_negative": true,
        "boost": 1
      }
    },
    "detection_interval": {
      "period": {
        "interval": 1,
        "unit": "Minutes"
      }
    },
    "window_delay": {
      "period": {
        "interval": 1,
        "unit": "Minutes"
      }
    },
    "shingle_size": 8,
    "schema_version": 0,
    "feature_attributes": [
      {
        "feature_id": "U0HKTXwBwf_U8gjUXY2m",
        "feature_name": "test",
        "feature_enabled": true,
        "aggregation_query": {
          "test": {
            "sum": {
              "field": "value"
            }
          }
        }
      }
    ],
    "last_update_time": 1633392680364,
    "user": {
      "name": "admin",
      "backend_roles": [
        "admin"
      ],
      "roles": [
        "own_index",
        "all_access"
      ],
      "custom_attribute_names": [],
      "user_requested_tenant": "__user__"
    },
    "detector_type": "SINGLE_ENTITY"
  }
}
```

A "job" is something that you schedule to run periodically, so it's only applicable for real-time anomaly detection and not historical analysis that you run just one time.

When you start a real-time detector, the anomaly detection plugin creates a job or if the job already exists updates it.
When you start or a restart a real-time detector, the plugin creates a new real-time task that records run-time information like detector configuration snapshot, real-time job states (initializing/running/stopped), init progress, and so on.

A single detector can only have one real-time job (job ID is the same as detector ID), but it can have multiple real-time tasks because each restart of a real-time job creates a new real-time task. You can limit the number of real-time tasks with the `plugins.anomaly_detection.max_old_ad_task_docs_per_detector` setting.

Historical analysis doesn't have an associated job. When you start or rerun historical analysis for a detector, the anomaly detection plugin creates a new historical batch task that tracks the historical analysis runtime information like state, coordinating/worker node, task progress, and so on. You can limit the historical task number with the `plugins.anomaly_detection.max_old_ad_task_docs_per_detector` setting.

Use `job=true` to get real-time analysis task information.

#### Request

```json
GET _plugins/_anomaly_detection/detectors/<detectorId>?job=true
```

#### Example response

```json
{
  "_id": "VEHKTXwBwf_U8gjUXY2s",
  "_version": 1,
  "_primary_term": 1,
  "_seq_no": 5,
  "anomaly_detector": {
    "name": "test-detector",
    "description": "Test detector",
    "time_field": "timestamp",
    "indices": [
      "server_log*"
    ],
    "filter_query": {
      "bool": {
        "filter": [
          {
            "range": {
              "value": {
                "from": 1,
                "to": null,
                "include_lower": false,
                "include_upper": true,
                "boost": 1
              }
            }
          }
        ],
        "adjust_pure_negative": true,
        "boost": 1
      }
    },
    "detection_interval": {
      "period": {
        "interval": 1,
        "unit": "Minutes"
      }
    },
    "window_delay": {
      "period": {
        "interval": 1,
        "unit": "Minutes"
      }
    },
    "shingle_size": 8,
    "schema_version": 0,
    "feature_attributes": [
      {
        "feature_id": "U0HKTXwBwf_U8gjUXY2m",
        "feature_name": "test",
        "feature_enabled": true,
        "aggregation_query": {
          "test": {
            "sum": {
              "field": "value"
            }
          }
        }
      }
    ],
    "last_update_time": 1633392680364,
    "user": {
      "name": "admin",
      "backend_roles": [
        "admin"
      ],
      "roles": [
        "own_index",
        "all_access"
      ],
      "custom_attribute_names": [],
      "user_requested_tenant": "__user__"
    },
    "detector_type": "SINGLE_ENTITY"
  },
  "anomaly_detector_job": {
    "name": "VEHKTXwBwf_U8gjUXY2s",
    "schedule": {
      "interval": {
        "start_time": 1633393656357,
        "period": 1,
        "unit": "Minutes"
      }
    },
    "window_delay": {
      "period": {
        "interval": 1,
        "unit": "Minutes"
      }
    },
    "enabled": true,
    "enabled_time": 1633393656357,
    "last_update_time": 1633393656357,
    "lock_duration_seconds": 60,
    "user": {
      "name": "admin",
      "backend_roles": [
        "admin"
      ],
      "roles": [
        "own_index",
        "all_access"
      ],
      "custom_attribute_names": [],
      "user_requested_tenant": "__user__"
    }
  }
}
```

Use `task=true` to get information for both real-time and historical analysis task information.

#### Request

```json
GET _plugins/_anomaly_detection/detectors/<detectorId>?task=true
```

#### Example response

```json
{
  "_id": "VEHKTXwBwf_U8gjUXY2s",
  "_version": 1,
  "_primary_term": 1,
  "_seq_no": 5,
  "anomaly_detector": {
    "name": "test-detector",
    "description": "Test detector",
    "time_field": "timestamp",
    "indices": [
      "server_log*"
    ],
    "filter_query": {
      "bool": {
        "filter": [
          {
            "range": {
              "value": {
                "from": 1,
                "to": null,
                "include_lower": false,
                "include_upper": true,
                "boost": 1
              }
            }
          }
        ],
        "adjust_pure_negative": true,
        "boost": 1
      }
    },
    "detection_interval": {
      "period": {
        "interval": 1,
        "unit": "Minutes"
      }
    },
    "window_delay": {
      "period": {
        "interval": 1,
        "unit": "Minutes"
      }
    },
    "shingle_size": 8,
    "schema_version": 0,
    "feature_attributes": [
      {
        "feature_id": "U0HKTXwBwf_U8gjUXY2m",
        "feature_name": "test",
        "feature_enabled": true,
        "aggregation_query": {
          "test": {
            "sum": {
              "field": "value"
            }
          }
        }
      }
    ],
    "last_update_time": 1633392680364,
    "user": {
      "name": "admin",
      "backend_roles": [
        "admin"
      ],
      "roles": [
        "own_index",
        "all_access"
      ],
      "custom_attribute_names": [],
      "user_requested_tenant": "__user__"
    },
    "detector_type": "SINGLE_ENTITY"
  },
  "realtime_detection_task": {
    "task_id": "nkTZTXwBjd8s6RK4QlMq",
    "last_update_time": 1633393776375,
    "started_by": "admin",
    "error": "",
    "state": "RUNNING",
    "detector_id": "VEHKTXwBwf_U8gjUXY2s",
    "task_progress": 0,
    "init_progress": 1,
    "execution_start_time": 1633393656362,
    "is_latest": true,
    "task_type": "REALTIME_SINGLE_ENTITY",
    "coordinating_node": "SWD7ihu9TaaW1zKwFZNVNg",
    "detector": {
      "name": "test-detector",
      "description": "Test detector",
      "time_field": "timestamp",
      "indices": [
        "server_log*"
      ],
      "filter_query": {
        "bool": {
          "filter": [
            {
              "range": {
                "value": {
                  "from": 1,
                  "to": null,
                  "include_lower": false,
                  "include_upper": true,
                  "boost": 1
                }
              }
            }
          ],
          "adjust_pure_negative": true,
          "boost": 1
        }
      },
      "detection_interval": {
        "period": {
          "interval": 1,
          "unit": "Minutes"
        }
      },
      "window_delay": {
        "period": {
          "interval": 1,
          "unit": "Minutes"
        }
      },
      "shingle_size": 8,
      "schema_version": 0,
      "feature_attributes": [
        {
          "feature_id": "U0HKTXwBwf_U8gjUXY2m",
          "feature_name": "test",
          "feature_enabled": true,
          "aggregation_query": {
            "test": {
              "sum": {
                "field": "value"
              }
            }
          }
        }
      ],
      "last_update_time": 1633392680364,
      "user": {
        "name": "admin",
        "backend_roles": [
          "admin"
        ],
        "roles": [
          "own_index",
          "all_access"
        ],
        "custom_attribute_names": [],
        "user_requested_tenant": "__user__"
      },
      "detector_type": "SINGLE_ENTITY"
    },
    "estimated_minutes_left": 0,
    "user": {
      "name": "admin",
      "backend_roles": [
        "admin"
      ],
      "roles": [
        "own_index",
        "all_access"
      ],
      "custom_attribute_names": [],
      "user_requested_tenant": "__user__"
    }
  },
  "historical_analysis_task": {
    "task_id": "99DaTXwB6HknB84StRN1",
    "last_update_time": 1633393797040,
    "started_by": "admin",
    "state": "RUNNING",
    "detector_id": "VEHKTXwBwf_U8gjUXY2s",
    "task_progress": 0.89285713,
    "init_progress": 1,
    "current_piece": 1633328940000,
    "execution_start_time": 1633393751412,
    "is_latest": true,
    "task_type": "HISTORICAL_SINGLE_ENTITY",
    "coordinating_node": "SWD7ihu9TaaW1zKwFZNVNg",
    "worker_node": "2Z4q22BySEyzakYt_A0A2A",
    "detector": {
      "name": "test-detector",
      "description": "Test detector",
      "time_field": "timestamp",
      "indices": [
        "server_log*"
      ],
      "filter_query": {
        "bool": {
          "filter": [
            {
              "range": {
                "value": {
                  "from": 1,
                  "to": null,
                  "include_lower": false,
                  "include_upper": true,
                  "boost": 1
                }
              }
            }
          ],
          "adjust_pure_negative": true,
          "boost": 1
        }
      },
      "detection_interval": {
        "period": {
          "interval": 1,
          "unit": "Minutes"
        }
      },
      "window_delay": {
        "period": {
          "interval": 1,
          "unit": "Minutes"
        }
      },
      "shingle_size": 8,
      "schema_version": 0,
      "feature_attributes": [
        {
          "feature_id": "U0HKTXwBwf_U8gjUXY2m",
          "feature_name": "test",
          "feature_enabled": true,
          "aggregation_query": {
            "test": {
              "sum": {
                "field": "value"
              }
            }
          }
        }
      ],
      "last_update_time": 1633392680364,
      "user": {
        "name": "admin",
        "backend_roles": [
          "admin"
        ],
        "roles": [
          "own_index",
          "all_access"
        ],
        "custom_attribute_names": [],
        "user_requested_tenant": "__user__"
      },
      "detector_type": "SINGLE_ENTITY"
    },
    "detection_date_range": {
      "start_time": 1632788951329,
      "end_time": 1633393751329
    },
    "user": {
      "name": "admin",
      "backend_roles": [
        "admin"
      ],
      "roles": [
        "own_index",
        "all_access"
      ],
      "custom_attribute_names": [],
      "user_requested_tenant": "__user__"
    }
  }
}
```

---

## Update detector
Introduced 1.0
{: .label .label-purple }

Updates a detector with any changes, including the description or adding or removing of features.
To update a detector, you need to first stop both real-time detection and historical analysis.

You can't update a category field.
{: .note }

#### Request

```json
PUT _plugins/_anomaly_detection/detectors/<detectorId>
{
  "name": "test-detector",
  "description": "Test update detector",
  "time_field": "timestamp",
  "indices": [
    "server_log*"
  ],
  "feature_attributes": [
    {
      "feature_name": "test",
      "feature_enabled": true,
      "aggregation_query": {
        "test": {
          "sum": {
            "field": "value"
          }
        }
      }
    }
  ],
  "filter_query": {
    "bool": {
      "filter": [
        {
          "range": {
            "value": {
              "gt": 1
            }
          }
        }
      ],
      "adjust_pure_negative": true,
      "boost": 1
    }
  },
  "detection_interval": {
    "period": {
      "interval": 1,
      "unit": "Minutes"
    }
  },
  "window_delay": {
    "period": {
      "interval": 1,
      "unit": "Minutes"
    }
  }
}
```


#### Example response

```json
{
  "_id": "VEHKTXwBwf_U8gjUXY2s",
  "_version": 2,
  "_seq_no": 7,
  "anomaly_detector": {
    "name": "test-detector",
    "description": "Test update detector",
    "time_field": "timestamp",
    "indices": [
      "server_log*"
    ],
    "filter_query": {
      "bool": {
        "filter": [
          {
            "range": {
              "value": {
                "from": 1,
                "to": null,
                "include_lower": false,
                "include_upper": true,
                "boost": 1
              }
            }
          }
        ],
        "adjust_pure_negative": true,
        "boost": 1
      }
    },
    "detection_interval": {
      "period": {
        "interval": 1,
        "unit": "Minutes"
      }
    },
    "window_delay": {
      "period": {
        "interval": 1,
        "unit": "Minutes"
      }
    },
    "shingle_size": 8,
    "schema_version": 0,
    "feature_attributes": [
      {
        "feature_id": "3kHiTXwBwf_U8gjUlY15",
        "feature_name": "test",
        "feature_enabled": true,
        "aggregation_query": {
          "test": {
            "sum": {
              "field": "value"
            }
          }
        }
      }
    ],
    "last_update_time": 1633394267522,
    "user": {
      "name": "admin",
      "backend_roles": [
        "admin"
      ],
      "roles": [
        "own_index",
        "all_access"
      ],
      "custom_attribute_names": [],
      "user_requested_tenant": "__user__"
    },
    "detector_type": "SINGLE_ENTITY"
  },
  "_primary_term": 1
}
```

---

## Delete detector
Introduced 1.0
{: .label .label-purple }

Deletes a detector based on the `detector_id`.
To delete a detector, you need to first stop both real-time detection and historical analysis.

#### Request

```json
DELETE _plugins/_anomaly_detection/detectors/<detectorId>
```

#### Example response

```json
{
  "_index": ".opensearch-anomaly-detectors",
  "_id": "70TxTXwBjd8s6RK4j1Pj",
  "_version": 2,
  "result": "deleted",
  "forced_refresh": true,
  "_shards": {
    "total": 2,
    "successful": 2,
    "failed": 0
  },
  "_seq_no": 9,
  "_primary_term": 1
}
```

---

## Preview detector
Introduced 1.0
{: .label .label-purple }

Passes a date range to the anomaly detector to return any anomalies within that date range.

To preview a single-entity detector:

#### Request

```json
POST _plugins/_anomaly_detection/detectors/_preview
{
  "period_start": 1633048868000,
  "period_end": 1633394468000,
  "detector": {
    "name": "test-detector",
    "description": "Test update detector",
    "time_field": "timestamp",
    "indices": [
      "server_log*"
    ],
    "feature_attributes": [
      {
        "feature_name": "test",
        "feature_enabled": true,
        "aggregation_query": {
          "test": {
            "sum": {
              "field": "value"
            }
          }
        }
      }
    ],
    "filter_query": {
      "bool": {
        "filter": [
          {
            "range": {
              "value": {
                "gt": 1
              }
            }
          }
        ],
        "adjust_pure_negative": true,
        "boost": 1
      }
    },
    "detection_interval": {
      "period": {
        "interval": 1,
        "unit": "Minutes"
      }
    },
    "window_delay": {
      "period": {
        "interval": 1,
        "unit": "Minutes"
      }
    }
  }
}
```

#### Example response

```json
{
  "anomaly_result": [
    {
      "detector_id": null,
      "data_start_time": 1633049280000,
      "data_end_time": 1633049340000,
      "schema_version": 0,
      "feature_data": [
        {
          "feature_id": "8EHmTXwBwf_U8gjU0Y0u",
          "feature_name": "test",
          "data": 0
        }
      ],
      "anomaly_grade": 0,
      "confidence": 0
    },
    ...
  ],
  "anomaly_detector": {
    "name": "test-detector",
    "description": "Test update detector",
    "time_field": "timestamp",
    "indices": [
      "server_log*"
    ],
    "filter_query": {
      "bool": {
        "filter": [
          {
            "range": {
              "value": {
                "from": 1,
                "to": null,
                "include_lower": false,
                "include_upper": true,
                "boost": 1
              }
            }
          }
        ],
        "adjust_pure_negative": true,
        "boost": 1
      }
    },
    "detection_interval": {
      "period": {
        "interval": 1,
        "unit": "Minutes"
      }
    },
    "window_delay": {
      "period": {
        "interval": 1,
        "unit": "Minutes"
      }
    },
    "shingle_size": 8,
    "schema_version": 0,
    "feature_attributes": [
      {
        "feature_id": "8EHmTXwBwf_U8gjU0Y0u",
        "feature_name": "test",
        "feature_enabled": true,
        "aggregation_query": {
          "test": {
            "sum": {
              "field": "value"
            }
          }
        }
      }
    ],
    "detector_type": "SINGLE_ENTITY"
  }
}
```

If you specify a category field, each result is associated with an entity:

#### Request

```json
POST _plugins/_anomaly_detection/detectors/_preview
{
  "period_start": 1633048868000,
  "period_end": 1633394468000,
  "detector": {
    "name": "test-detector",
    "description": "Test update detector",
    "time_field": "timestamp",
    "indices": [
      "server_log*"
    ],
    "feature_attributes": [
      {
        "feature_name": "test",
        "feature_enabled": true,
        "aggregation_query": {
          "test": {
            "sum": {
              "field": "value"
            }
          }
        }
      }
    ],
    "filter_query": {
      "bool": {
        "filter": [
          {
            "range": {
              "value": {
                "gt": 1
              }
            }
          }
        ],
        "adjust_pure_negative": true,
        "boost": 1
      }
    },
    "detection_interval": {
      "period": {
        "interval": 1,
        "unit": "Minutes"
      }
    },
    "window_delay": {
      "period": {
        "interval": 1,
        "unit": "Minutes"
      }
    },
    "category_field": [
      "error_type"
    ]
  }
}
```

#### Example response

```json
{
  "anomaly_result": [
    {
      "detector_id": null,
      "data_start_time": 1633049280000,
      "data_end_time": 1633049340000,
      "schema_version": 0,
      "feature_data": [
        {
          "feature_id": "tkTpTXwBjd8s6RK4DlOZ",
          "feature_name": "test",
          "data": 0
        }
      ],
      "anomaly_grade": 0,
      "confidence": 0,
      "entity": [
        {
          "name": "error_type",
          "value": "error1"
        }
      ]
    },
    ...
  ],
  "anomaly_detector": {
    "name": "test-detector",
    "description": "Test update detector",
    "time_field": "timestamp",
    "indices": [
      "server_log*"
    ],
    "filter_query": {
      "bool": {
        "filter": [
          {
            "range": {
              "value": {
                "from": 1,
                "to": null,
                "include_lower": false,
                "include_upper": true,
                "boost": 1
              }
            }
          }
        ],
        "adjust_pure_negative": true,
        "boost": 1
      }
    },
    "detection_interval": {
      "period": {
        "interval": 1,
        "unit": "Minutes"
      }
    },
    "window_delay": {
      "period": {
        "interval": 1,
        "unit": "Minutes"
      }
    },
    "shingle_size": 8,
    "schema_version": 0,
    "feature_attributes": [
      {
        "feature_id": "tkTpTXwBjd8s6RK4DlOZ",
        "feature_name": "test",
        "feature_enabled": true,
        "aggregation_query": {
          "test": {
            "sum": {
              "field": "value"
            }
          }
        }
      }
    ],
    "category_field": [
      "error_type"
    ],
    "detector_type": "MULTI_ENTITY"
  }
}
```

You can preview a detector with the detector ID:

```json
POST _plugins/_anomaly_detection/detectors/_preview
{
  "detector_id": "VEHKTXwBwf_U8gjUXY2s",
  "period_start": 1633048868000,
  "period_end": 1633394468000
}
```

Or:

```json
POST _opendistro/_anomaly_detection/detectors/VEHKTXwBwf_U8gjUXY2s/_preview
{
  "period_start": 1633048868000,
  "period_end": 1633394468000
}
```

#### Example response

```json
{
  "anomaly_result": [
    {
      "detector_id": "VEHKTXwBwf_U8gjUXY2s",
      "data_start_time": 1633049280000,
      "data_end_time": 1633049340000,
      "schema_version": 0,
      "feature_data": [
        {
          "feature_id": "3kHiTXwBwf_U8gjUlY15",
          "feature_name": "test",
          "data": 0
        }
      ],
      "anomaly_grade": 0,
      "confidence": 0,
      "user": {
        "name": "admin",
        "backend_roles": [
          "admin"
        ],
        "roles": [
          "own_index",
          "all_access"
        ],
        "custom_attribute_names": [],
        "user_requested_tenant": "__user__"
      }
    },
    ...
  ],
  "anomaly_detector": {
    "name": "test-detector",
    "description": "Test update detector",
    "time_field": "timestamp",
    "indices": [
      "server_log*"
    ],
    "filter_query": {
      "bool": {
        "filter": [
          {
            "range": {
              "value": {
                "from": 1,
                "to": null,
                "include_lower": false,
                "include_upper": true,
                "boost": 1
              }
            }
          }
        ],
        "adjust_pure_negative": true,
        "boost": 1
      }
    },
    "detection_interval": {
      "period": {
        "interval": 1,
        "unit": "Minutes"
      }
    },
    "window_delay": {
      "period": {
        "interval": 1,
        "unit": "Minutes"
      }
    },
    "shingle_size": 8,
    "schema_version": 0,
    "feature_attributes": [
      {
        "feature_id": "3kHiTXwBwf_U8gjUlY15",
        "feature_name": "test",
        "feature_enabled": true,
        "aggregation_query": {
          "test": {
            "sum": {
              "field": "value"
            }
          }
        }
      }
    ],
    "last_update_time": 1633394267522,
    "user": {
      "name": "admin",
      "backend_roles": [
        "admin"
      ],
      "roles": [
        "own_index",
        "all_access"
      ],
      "custom_attribute_names": [],
      "user_requested_tenant": "__user__"
    },
    "detector_type": "SINGLE_ENTITY"
  }
}
```

---

## Start detector job
Introduced 1.0
{: .label .label-purple }

Starts a real-time or historical anomaly detector job.

To start a real-time detector job:

#### Request

```json
POST _plugins/_anomaly_detection/detectors/<detectorId>/_start
```

#### Example response

```json
{
  "_id": "VEHKTXwBwf_U8gjUXY2s",
  "_version": 3,
  "_seq_no": 6,
  "_primary_term": 1
}
```

The `_id` represents the real-time job ID, which is the same as the detector ID.

To start historical analysis:

```json
POST _plugins/_anomaly_detection/detectors/<detectorId>/_start
{
  "start_time": 1633048868000,
  "end_time": 1633394468000
}
```

#### Example response

```json
{
  "_id": "f9DsTXwB6HknB84SoRTY",
  "_version": 1,
  "_seq_no": 958,
  "_primary_term": 1
}
```

The `_id` represents the historical batch task ID, which is a random universally unique identifier (UUID).

---

## Stop detector job
Introduced 1.0
{: .label .label-purple }

Stops a real-time or historical anomaly detector job.

To stop a real-time detector job:

#### Request

```json
POST _plugins/_anomaly_detection/detectors/<detectorId>/_stop
```

#### Example response

```json
{
  "_id": "VEHKTXwBwf_U8gjUXY2s",
  "_version": 0,
  "_seq_no": 0,
  "_primary_term": 0
}
```

To stop historical analysis:

Introduced 1.1
{: .label .label-purple }

```json
POST _plugins/_anomaly_detection/detectors/<detectorId>/_stop?historical=true
```

#### Example response

```json
{
  "_id": "f9DsTXwB6HknB84SoRTY",
  "_version": 0,
  "_seq_no": 0,
  "_primary_term": 0
}
```

---

## Search detector
Introduced 1.0
{: .label .label-purple }

Returns all anomaly detectors for a search query.

To search detectors using the `server_log*` index:

#### Request

```json
GET _plugins/_anomaly_detection/detectors/_search
POST _plugins/_anomaly_detection/detectors/_search
{
  "query": {
    "wildcard": {
      "indices": {
        "value": "server_log*"
      }
    }
  }
}
```

#### Example response

```json
{
  "took": 2,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 4,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": ".opensearch-anomaly-detectors",
        "_id": "Zi5zTXwBwf_U8gjUTfJG",
        "_version": 1,
        "_seq_no": 1,
        "_primary_term": 1,
        "_score": 1,
        "_source": {
          "name": "test",
          "description": "test",
          "time_field": "timestamp",
          "indices": [
            "server_log"
          ],
          "filter_query": {
            "match_all": {
              "boost": 1
            }
          },
          "detection_interval": {
            "period": {
              "interval": 5,
              "unit": "Minutes"
            }
          },
          "window_delay": {
            "period": {
              "interval": 1,
              "unit": "Minutes"
            }
          },
          "shingle_size": 8,
          "schema_version": 0,
          "feature_attributes": [
            {
              "feature_id": "ZS5zTXwBwf_U8gjUTfIn",
              "feature_name": "test_feature",
              "feature_enabled": true,
              "aggregation_query": {
                "test_feature": {
                  "sum": {
                    "field": "value"
                  }
                }
              }
            }
          ],
          "last_update_time": 1633386974533,
          "category_field": [
            "error_type"
          ],
          "user": {
            "name": "admin",
            "backend_roles": [
              "admin"
            ],
            "roles": [
              "own_index",
              "all_access"
            ],
            "custom_attribute_names": [],
            "user_requested_tenant": "__user__"
          },
          "detector_type": "MULTI_ENTITY"
        }
      },
      ...
    ]
  }
}
```

---

## Search detector tasks
Introduced 1.1
{: .label .label-purple }

Searches detector tasks.

To search for the latest detector level historical analysis task for a high cardinality detector

#### Request

```json
GET _plugins/_anomaly_detection/detectors/tasks/_search
POST _plugins/_anomaly_detection/detectors/tasks/_search
{
  "query": {
    "bool": {
      "filter": [
        {
          "term": {
            "detector_id": "Zi5zTXwBwf_U8gjUTfJG"
          }
        },
        {
          "term": {
            "task_type": "HISTORICAL_HC_DETECTOR"
          }
        },
        {
          "term": {
            "is_latest": "true"
          }
        }
      ]
    }
  }
}
```

#### Example response

```json
{
  "took": 1,
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
    "max_score": 0,
    "hits": [
      {
        "_index": ".opensearch-anomaly-detection-state",
        "_id": "fm-RTXwBYwCbWecgB753",
        "_version": 34,
        "_seq_no": 928,
        "_primary_term": 1,
        "_score": 0,
        "_source": {
          "detector_id": "Zi5zTXwBwf_U8gjUTfJG",
          "error": "",
          "detection_date_range": {
            "start_time": 1630794960000,
            "end_time": 1633386960000
          },
          "task_progress": 1,
          "last_update_time": 1633389090738,
          "execution_start_time": 1633388922742,
          "state": "FINISHED",
          "coordinating_node": "2Z4q22BySEyzakYt_A0A2A",
          "task_type": "HISTORICAL_HC_DETECTOR",
          "execution_end_time": 1633389090738,
          "started_by": "admin",
          "init_progress": 0,
          "is_latest": true,
          "detector": {
            "category_field": [
              "error_type"
            ],
            "description": "test",
            "ui_metadata": {
              "features": {
                "test_feature": {
                  "aggregationBy": "sum",
                  "aggregationOf": "value",
                  "featureType": "simple_aggs"
                }
              },
              "filters": []
            },
            "feature_attributes": [
              {
                "feature_id": "ZS5zTXwBwf_U8gjUTfIn",
                "feature_enabled": true,
                "feature_name": "test_feature",
                "aggregation_query": {
                  "test_feature": {
                    "sum": {
                      "field": "value"
                    }
                  }
                }
              }
            ],
            "schema_version": 0,
            "time_field": "timestamp",
            "last_update_time": 1633386974533,
            "indices": [
              "server_log"
            ],
            "window_delay": {
              "period": {
                "unit": "Minutes",
                "interval": 1
              }
            },
            "detection_interval": {
              "period": {
                "unit": "Minutes",
                "interval": 5
              }
            },
            "name": "testhc",
            "filter_query": {
              "match_all": {
                "boost": 1
              }
            },
            "shingle_size": 8,
            "user": {
              "backend_roles": [
                "admin"
              ],
              "custom_attribute_names": [],
              "roles": [
                "own_index",
                "all_access"
              ],
              "name": "admin",
              "user_requested_tenant": "__user__"
            },
            "detector_type": "MULTI_ENTITY"
          },
          "user": {
            "backend_roles": [
              "admin"
            ],
            "custom_attribute_names": [],
            "roles": [
              "own_index",
              "all_access"
            ],
            "name": "admin",
            "user_requested_tenant": "__user__"
          }
        }
      }
    ]
  }
}
```

To search for the latest entity-level tasks for the historical analysis of a high cardinality detector:

#### Request

```json
GET _plugins/_anomaly_detection/detectors/tasks/_search
POST _plugins/_anomaly_detection/detectors/tasks/_search
{
  "query": {
    "bool": {
      "filter": [
        {
          "term": {
            "detector_id": "Zi5zTXwBwf_U8gjUTfJG"
          }
        },
        {
          "term": {
            "task_type": "HISTORICAL_HC_ENTITY"
          }
        },
        {
          "term": {
            "is_latest": "true"
          }
        }
      ]
    }
  },
  "sort": [
    {
      "execution_start_time": {
        "order": "desc"
      }
    }
  ],
  "size": 100
}
```

To search and aggregate states for all entity-level historical tasks:

The `parent_task_id` is the same as the task ID that you can get with the profile detector API:
`GET _plugins/_anomaly_detection/detectors/<detector_ID>/_profile/ad_task`.
{: .note }


#### Request

```json
GET _plugins/_anomaly_detection/detectors/tasks/_search
POST _plugins/_anomaly_detection/detectors/tasks/_search
{
  "size": 0,
  "query": {
    "bool": {
      "filter": [
        {
          "term": {
            "detector_id": {
              "value": "Zi5zTXwBwf_U8gjUTfJG",
              "boost": 1
            }
          }
        },
        {
          "term": {
            "parent_task_id": {
              "value": "fm-RTXwBYwCbWecgB753",
              "boost": 1
            }
          }
        },
        {
          "terms": {
            "task_type": [
              "HISTORICAL_HC_ENTITY"
            ],
            "boost": 1
          }
        }
      ]
    }
  },
  "aggs": {
    "test": {
      "terms": {
        "field": "state",
        "size": 100
      }
    }
  }
}
```

#### Example response

```json
{
  "took": 2,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 32,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "test": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "FINISHED",
          "doc_count": 32
        }
      ]
    }
  }
}
```

---

## Search detector result
Introduced 1.0
{: .label .label-purple }

Returns all results for a search query.

You have the following search options:

- To search only the default result index, simply use the search API:

  ```json
  POST _plugins/_anomaly_detection/detectors/results/_search/
  ```

- To search both the custom result index and default result index, you can either add the custom result index to the search API:

  ```json
  POST _plugins/_anomaly_detection/detectors/results/_search/<custom_result_index>
  ```

  Or, add the custom result index and set the `only_query_custom_result_index` parameter to `false`:

  ```json
  POST _plugins/_anomaly_detection/detectors/results/_search/<custom_result_index>?only_query_custom_result_index=false
  ```

- To search only the custom result index, add the custom result index to the search API and set the `only_query_custom_result_index` parameter to `true`:

  ```json
  POST _plugins/_anomaly_detection/detectors/results/_search/<custom_result_index>?only_query_custom_result_index=true
  ```

The following example searches anomaly results for grade greater than 0 for real-time analysis:

#### Request

```json
GET _plugins/_anomaly_detection/detectors/results/_search/opensearch-ad-plugin-result-test
POST _plugins/_anomaly_detection/detectors/results/_search/opensearch-ad-plugin-result-test
{
  "query": {
    "bool": {
      "filter": [
        {
          "term": {
            "detector_id": "EWy02nwBm38sXcF2AiFJ"
          }
        },
        {
          "range": {
            "anomaly_grade": {
              "gt": 0
            }
          }
        }
      ],
      "must_not": [
        {
          "exists": {
            "field": "task_id"
          }
        }
      ]
    }
  }
}
```

If you specify the custom result index like in this example, the search results API searches both the default result indices and custom result indices.

If you don't specify the custom result index and you just use the `_plugins/_anomaly_detection/detectors/results/_search` URL, the anomaly detection plugin searches only the default result indices.

Real-time detection doesn't persist the task ID in the anomaly result, so the task ID will be null.

For information about the response body fields, see [Anomaly result mapping]({{site.url}}{{site.baseurl}}/monitoring-plugins/ad/result-mapping/#response-body-fields).

#### Example response

```json
{
  "took": 4,
  "timed_out": false,
  "_shards": {
    "total": 3,
    "successful": 3,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 90,
      "relation": "eq"
    },
    "max_score": 0,
    "hits": [
      {
        "_index": ".opensearch-anomaly-results-history-2021.10.04-1",
        "_id": "686KTXwB6HknB84SMr6G",
        "_version": 1,
        "_seq_no": 103622,
        "_primary_term": 1,
        "_score": 0,
        "_source": {
          "detector_id": "EWy02nwBm38sXcF2AiFJ",
          "confidence": 0.918886275269358,
          "model_id": "EWy02nwBm38sXcF2AiFJ_entity_error16",
          "schema_version": 4,
          "anomaly_score": 1.1093755891885446,
          "execution_start_time": 1633388475001,
          "data_end_time": 1633388414989,
          "data_start_time": 1633388114989,
          "feature_data": [
            {
              "feature_id": "ZS5zTXwBwf_U8gjUTfIn",
              "feature_name": "test_feature",
              "data": 0.532
            }
          ],
          "relevant_attribution": [
            {
              "feature_id": "ZS5zTXwBwf_U8gjUTfIn",
              "data": 1.0
            }
          ],
          "expected_values": [
            {
              "likelihood": 1,
              "value_list": [
                {
                  "feature_id": "ZS5zTXwBwf_U8gjUTfIn",
                  "data": 2
                }
              ]
            }
          ],
          "execution_end_time": 1633388475014,
          "user": {
            "backend_roles": [
              "admin"
            ],
            "custom_attribute_names": [],
            "roles": [
              "own_index",
              "all_access"
            ],
            "name": "admin",
            "user_requested_tenant": "__user__"
          },
          "anomaly_grade": 0.031023547546561225,
          "entity": [
            {
              "name": "error_type",
              "value": "error16"
            }
          ]
        }
      },
      ...
    ]
  }
}
```

You can run historical analysis as many times as you like. So, multiple tasks might exist for the same detector.

You can search for the latest historical batch task first and then search the historical batch task results.

To search anomaly results for `grade` greater than 0 for historical analysis with the `task_id`:

#### Request

```json
GET _plugins/_anomaly_detection/detectors/results/_search
POST _plugins/_anomaly_detection/detectors/results/_search
{
  "query": {
    "bool": {
      "filter": [
        {
          "term": {
            "detector_id": "Zi5zTXwBwf_U8gjUTfJG"
          }
        },
        {
          "range": {
            "anomaly_grade": {
              "gt": 0
            }
          }
        },
        {
          "term": {
            "task_id": "fm-RTXwBYwCbWecgB753"
          }
        }
      ]
    }
  }
}
```

#### Example response

```json
{
  "took": 915,
  "timed_out": false,
  "_shards": {
    "total": 3,
    "successful": 3,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 4115,
      "relation": "eq"
    },
    "max_score": 0,
    "hits": [
      {
        "_index": ".opensearch-anomaly-results-history-2021.10.04-1",
        "_id": "VRyRTXwBDx7vzPBV8jYC",
        "_version": 1,
        "_seq_no": 149657,
        "_primary_term": 1,
        "_score": 0,
        "_source": {
          "detector_id": "Zi5zTXwBwf_U8gjUTfJG",
          "confidence": 0.9642989263957601,
          "task_id": "fm-RTXwBYwCbWecgB753",
          "model_id": "Zi5zTXwBwf_U8gjUTfJG_entity_error24",
          "schema_version": 4,
          "anomaly_score": 1.2260712437521946,
          "execution_start_time": 1633388982692,
          "data_end_time": 1631721300000,
          "data_start_time": 1631721000000,
          "feature_data": [
            {
              "feature_id": "ZS5zTXwBwf_U8gjUTfIn",
              "feature_name": "test_feature",
              "data": 10
            }
          ],
          "execution_end_time": 1633388982709,
          "user": {
            "backend_roles": [
              "admin"
            ],
            "custom_attribute_names": [],
            "roles": [
              "own_index",
              "all_access"
            ],
            "name": "admin",
            "user_requested_tenant": "__user__"
          },
          "anomaly_grade": 0.14249628345655782,
          "entity": [
            {
              "name": "error_type",
              "value": "error1"
            }
          ]
        }
      },
      ...
    ]
  }
}
```

---

## Search top anomalies
Introduced 1.2
{: .label .label-purple }

Returns the top anomaly results for a high-cardinality detector, bucketed by categorical field values.

You can pass a `historical` boolean parameter to specify whether you want to analyze real-time or historical results.

#### Request

```json
GET _plugins/_anomaly_detection/detectors/<detectorId>/results/_topAnomalies?historical=false
{
  "size": 3,
  "category_field": [
    "ip"
  ],
  "order": "severity",
  "task_id": "example-task-id",
  "start_time_ms": 123456789000,
  "end_time_ms": 987654321000
}
```

#### Example response

```json
{
  "buckets": [
    {
      "key": {
        "ip": "1.2.3.4"
      },
      "doc_count": 10,
      "max_anomaly_grade": 0.8
    },
    {
      "key": {
        "ip": "5.6.7.8"
      },
      "doc_count": 12,
      "max_anomaly_grade": 0.6
    },
    {
      "key": {
        "ip": "9.10.11.12"
      },
      "doc_count": 3,
      "max_anomaly_grade": 0.5
    }
  ]
}
```

You can specify the following options.

Options | Description | Type | Required
:--- | :--- |:--- |:--- |
`size` |  Specify the number of top buckets that you want to see. Default is 10. The maximum number is 10,000. | `integer` | No
`category_field` |  Specify the set of category fields that you want to aggregate on. Defaults to all category fields for the detector. | `list` | No
`order` |  Specify `severity` (anomaly grade) or `occurrence` (number of anomalies). Default is `severity`. | `string` | No
`task_id`  |  Specify a historical task ID to see results only from that specific task. Use only when `historical=true`, otherwise the anomaly detection plugin ignores this parameter. | `string` | No
`start_time_ms` | Specify the time to start analyzing results, in Epoch milliseconds. | `long` | Yes
`end_time_ms` |  Specify the time to end analyzing results, in Epoch milliseconds. | `long` | Yes

---

## Get detector stats
Introduced 1.0
{: .label .label-purple }

Provides information about how the plugin is performing.

To get all stats:

#### Request

```json
GET _plugins/_anomaly_detection/stats
```

#### Example response

```json
{
  "anomaly_detectors_index_status": "green",
  "anomaly_detection_state_status": "green",
  "single_entity_detector_count": 2,
  "detector_count": 5,
  "multi_entity_detector_count": 3,
  "anomaly_detection_job_index_status": "green",
  "models_checkpoint_index_status": "green",
  "anomaly_results_index_status": "green",
  "nodes": {
    "2Z4q22BySEyzakYt_A0A2A": {
      "ad_execute_request_count": 95,
      "models": [
        {
          "detector_id": "WTBnTXwBjd8s6RK4b1Sz",
          "model_type": "rcf",
          "last_used_time": 1633398197185,
          "model_id": "WTBnTXwBjd8s6RK4b1Sz_model_rcf_0",
          "last_checkpoint_time": 1633396573679
        },
        ...
      ],
      "ad_canceled_batch_task_count": 0,
      "ad_hc_execute_request_count": 75,
      "ad_hc_execute_failure_count": 0,
      "model_count": 28,
      "ad_execute_failure_count": 1,
      "ad_batch_task_failure_count": 0,
      "ad_total_batch_task_execution_count": 27,
      "ad_executing_batch_task_count": 3
    },
    "SWD7ihu9TaaW1zKwFZNVNg": {
      "ad_execute_request_count": 12,
      "models": [
        {
          "detector_id": "Zi5zTXwBwf_U8gjUTfJG",
          "model_type": "entity",
          "last_used_time": 1633398375008,
          "model_id": "Zi5zTXwBwf_U8gjUTfJG_entity_error13",
          "last_checkpoint_time": 1633392973682,
          "entity": [
            {
              "name": "error_type",
              "value": "error13"
            }
          ]
        },
        ...
      ],
      "ad_canceled_batch_task_count": 1,
      "ad_hc_execute_request_count": 0,
      "ad_hc_execute_failure_count": 0,
      "model_count": 15,
      "ad_execute_failure_count": 2,
      "ad_batch_task_failure_count": 0,
      "ad_total_batch_task_execution_count": 27,
      "ad_executing_batch_task_count": 4
    },
    "TQDUXEzyTJyV0H6_T4hYUw": {
      "ad_execute_request_count": 0,
      "models": [
        {
          "detector_id": "Zi5zTXwBwf_U8gjUTfJG",
          "model_type": "entity",
          "last_used_time": 1633398375004,
          "model_id": "Zi5zTXwBwf_U8gjUTfJG_entity_error24",
          "last_checkpoint_time": 1633388177359,
          "entity": [
            {
              "name": "error_type",
              "value": "error24"
            }
          ]
        },
        ...
      ],
      "ad_canceled_batch_task_count": 0,
      "ad_hc_execute_request_count": 0,
      "ad_hc_execute_failure_count": 0,
      "model_count": 22,
      "ad_execute_failure_count": 0,
      "ad_batch_task_failure_count": 0,
      "ad_total_batch_task_execution_count": 28,
      "ad_executing_batch_task_count": 3
    }
  }
}
```

The `model_count` parameter shows the total number of models running on each node’s memory.
For historical analysis, you see the values for the following fields:

- `ad_total_batch_task_execution_count`
- `ad_executing_batch_task_count`
- `ad_canceled_batch_task_count`
- `ad_batch_task_failure_count`

If haven't run any historical analysis, these values show up as 0.

To get all stats for a specific node:

#### Request

```json
GET _plugins/_anomaly_detection/<nodeId>/stats
```

To get specific stats for a node:

#### Request

```json
GET _plugins/_anomaly_detection/<nodeId>/stats/<stat>
```

For example, to get the `ad_execute_request_count` value for node `SWD7ihu9TaaW1zKwFZNVNg`:

```json
GET _plugins/_anomaly_detection/SWD7ihu9TaaW1zKwFZNVNg/stats/ad_execute_request_count
```

#### Example response

```json
{
  "nodes": {
    "SWD7ihu9TaaW1zKwFZNVNg": {
      "ad_execute_request_count": 12
    }
  }
}
```

To get a specific type of stats:

#### Request

```json
GET _plugins/_anomaly_detection/stats/<stat>
```

For example:

```json
GET _plugins/_anomaly_detection/stats/ad_executing_batch_task_count
```

#### Example response

```json
{
  "nodes": {
    "2Z4q22BySEyzakYt_A0A2A": {
      "ad_executing_batch_task_count": 3
    },
    "SWD7ihu9TaaW1zKwFZNVNg": {
      "ad_executing_batch_task_count": 3
    },
    "TQDUXEzyTJyV0H6_T4hYUw": {
      "ad_executing_batch_task_count": 4
    }
  }
}
```

---

## Profile detector
Introduced 1.0
{: .label .label-purple }

Returns information related to the current state of the detector and memory usage, including current errors and shingle size, to help troubleshoot the detector.

This command helps locate logs by identifying the nodes that run the anomaly detector job for each detector.

It also helps track the initialization percentage, the required shingles, and the estimated time left.

#### Request

```json
GET _plugins/_anomaly_detection/detectors/<detectorId>/_profile/
GET _plugins/_anomaly_detection/detectors/<detectorId>/_profile?_all=true
GET _plugins/_anomaly_detection/detectors/<detectorId>/_profile/<type>
GET _plugins/_anomaly_detection/detectors/<detectorId>/_profile/<type1>,<type2>
```

#### Sample Responses

```json
GET _plugins/_anomaly_detection/detectors/<detectorId>/_profile

{
  "state": "DISABLED",
  "error": "Stopped detector: AD models memory usage exceeds our limit."
}

GET _plugins/_anomaly_detection/detectors/<detectorId>/_profile?_all=true&pretty

{
  "state": "RUNNING",
  "error": "",
  "models": [
    {
      "model_id": "3Dh6TXwBwf_U8gjURE0F_entity_KSLSh0Wv05RQXiBAQHTEZg",
      "entity": [
        {
          "name": "ip",
          "value": "192.168.1.1"
        },
        {
          "name": "error_type",
          "value": "error8"
        }
      ],
      "model_size_in_bytes": 403491,
      "node_id": "2Z4q22BySEyzakYt_A0A2A"
    },
    ...
  ],
  "total_size_in_bytes": 12911712,
  "init_progress": {
    "percentage": "100%"
  },
  "total_entities": 33,
  "active_entities": 32,
  "ad_task": {
    "ad_task": {
      "task_id": "D3I5TnwBYwCbWecg7lN9",
      "last_update_time": 1633399993685,
      "started_by": "admin",
      "state": "RUNNING",
      "detector_id": "3Dh6TXwBwf_U8gjURE0F",
      "task_progress": 0,
      "init_progress": 0,
      "execution_start_time": 1633399991933,
      "is_latest": true,
      "task_type": "HISTORICAL_HC_DETECTOR",
      "coordinating_node": "2Z4q22BySEyzakYt_A0A2A",
      "detector": {
        "name": "testhc-mc",
        "description": "test",
        "time_field": "timestamp",
        "indices": [
          "server_log"
        ],
        "filter_query": {
          "match_all": {
            "boost": 1
          }
        },
        "detection_interval": {
          "period": {
            "interval": 5,
            "unit": "Minutes"
          }
        },
        "window_delay": {
          "period": {
            "interval": 1,
            "unit": "Minutes"
          }
        },
        "shingle_size": 8,
        "schema_version": 0,
        "feature_attributes": [
          {
            "feature_id": "2zh6TXwBwf_U8gjUQ039",
            "feature_name": "test",
            "feature_enabled": true,
            "aggregation_query": {
              "test": {
                "sum": {
                  "field": "value"
                }
              }
            }
          }
        ],
        "ui_metadata": {
          "features": {
            "test": {
              "aggregationBy": "sum",
              "aggregationOf": "value",
              "featureType": "simple_aggs"
            }
          },
          "filters": []
        },
        "last_update_time": 1633387430916,
        "category_field": [
          "ip",
          "error_type"
        ],
        "user": {
          "name": "admin",
          "backend_roles": [
            "admin"
          ],
          "roles": [
            "own_index",
            "all_access"
          ],
          "custom_attribute_names": [],
          "user_requested_tenant": "__user__"
        },
        "detector_type": "MULTI_ENTITY"
      },
      "detection_date_range": {
        "start_time": 1632793800000,
        "end_time": 1633398600000
      },
      "user": {
        "name": "admin",
        "backend_roles": [
          "admin"
        ],
        "roles": [
          "own_index",
          "all_access"
        ],
        "custom_attribute_names": [],
        "user_requested_tenant": "__user__"
      }
    },
    "node_id": "2Z4q22BySEyzakYt_A0A2A",
    "task_id": "D3I5TnwBYwCbWecg7lN9",
    "task_type": "HISTORICAL_HC_DETECTOR",
    "detector_task_slots": 10,
    "total_entities_count": 32,
    "pending_entities_count": 22,
    "running_entities_count": 10,
    "running_entities": [      """[{"name":"ip","value":"192.168.1.1"},{"name":"error_type","value":"error9"}]""",
          ...],
    "entity_task_profiles": [
      {
        "shingle_size": 8,
        "rcf_total_updates": 1994,
        "threshold_model_trained": true,
        "threshold_model_training_data_size": 0,
        "model_size_in_bytes": 1593240,
        "node_id": "2Z4q22BySEyzakYt_A0A2A",
        "entity": [
          {
            "name": "ip",
            "value": "192.168.1.1"
          },
          {
            "name": "error_type",
            "value": "error7"
          }
        ],
        "task_id": "E3I5TnwBYwCbWecg9FMm",
        "task_type": "HISTORICAL_HC_ENTITY"
      },
      ...
    ]
  },
  "model_count": 32
}

GET _plugins/_anomaly_detection/detectors/<detectorId>/_profile/total_size_in_bytes

{
  "total_size_in_bytes": 13369344
}
```

You can see the `ad_task` field only for historical analysis.

The `model_count` parameter shows the total number of models that a detector runs on each node’s memory. This is useful if you have several models running on your cluster and want to know the count.

If you configured the category field, you can see the number of unique values in the field and all active entities with models running in memory.

You can use this data to estimate how much memory is required for anomaly detection so you can decide how to size your cluster. For example, if a detector has one million entities and only 10 of them are active in memory, you need to scale your cluster up or out.

For a single-entity detector:

#### Example response

```json
{
  "state": "INIT",
  "total_size_in_bytes": 0,
  "init_progress": {
    "percentage": "0%",
    "needed_shingles": 128
  },
  "ad_task": {
    "ad_task": {
      "task_id": "cfUNOXwBFLNqSEcxAlde",
      "last_update_time": 1633044731640,
      "started_by": "admin",
      "state": "RUNNING",
      "detector_id": "qL4NOXwB__6eNorTAKtJ",
      "task_progress": 0.49603173,
      "init_progress": 1,
      "current_piece": 1632739800000,
      "execution_start_time": 1633044726365,
      "is_latest": true,
      "task_type": "HISTORICAL_SINGLE_ENTITY",
      "coordinating_node": "bCtWtxWPThq0BIn5P5I4Xw",
      "worker_node": "dIyavWhmSYWGz65b4u-lpQ",
      "detector": {
        "name": "detector1",
        "description": "test",
        "time_field": "timestamp",
        "indices": [
          "server_log"
        ],
        "filter_query": {
          "match_all": {
            "boost": 1
          }
        },
        "detection_interval": {
          "period": {
            "interval": 5,
            "unit": "Minutes"
          }
        },
        "window_delay": {
          "period": {
            "interval": 1,
            "unit": "Minutes"
          }
        },
        "shingle_size": 8,
        "schema_version": 0,
        "feature_attributes": [
          {
            "feature_id": "p74NOXwB__6eNorTAKss",
            "feature_name": "test-feature",
            "feature_enabled": true,
            "aggregation_query": {
              "test_feature": {
                "sum": {
                  "field": "value"
                }
              }
            }
          }
        ],
        "ui_metadata": {
          "features": {
            "test-feature": {
              "aggregationBy": "sum",
              "aggregationOf": "value",
              "featureType": "simple_aggs"
            }
          },
          "filters": []
        },
        "last_update_time": 1633044725832,
        "user": {
          "name": "admin",
          "backend_roles": [
            "admin"
          ],
          "roles": [
            "own_index",
            "all_access"
          ],
          "custom_attribute_names": [],
          "user_requested_tenant": "__user__"
        },
        "detector_type": "SINGLE_ENTITY"
      },
      "detection_date_range": {
        "start_time": 1632439925885,
        "end_time": 1633044725885
      },
      "user": {
        "name": "admin",
        "backend_roles": [
          "admin"
        ],
        "roles": [
          "own_index",
          "all_access"
        ],
        "custom_attribute_names": [],
        "user_requested_tenant": "__user__"
      }
    },
    "shingle_size": 8,
    "rcf_total_updates": 1994,
    "threshold_model_trained": true,
    "threshold_model_training_data_size": 0,
    "model_size_in_bytes": 1593240,
    "node_id": "dIyavWhmSYWGz65b4u-lpQ",
    "detector_task_slots": 1
  }
}
```

The `total_entities` parameter shows you the total number of entities including the number of category fields for a detector.

Getting the total count of entities is an expensive operation for real-time analysis of a detector with more than one category field. By default, for a real-time detection profile, a detector counts the number of entities up to a value of 10,000. For historical analysis, the anomaly detection plugin only detects the top 1,000 entities by default and caches the top entities in memory, so it doesn't cost much to get the total count of entities for historical analysis.

The `profile` operation also provides information about each entity, such as the entity’s `last_sample_timestamp` and `last_active_timestamp`. `last_sample_timestamp` shows the last document in the input data source index containing the entity, while `last_active_timestamp` shows the timestamp when the entity’s model was last seen in the model cache.

If there are no anomaly results for an entity, either the entity doesn't have any sample data or resources such as memory and disk IO are constrained relative to the number of entities.

#### Request

```json
GET _plugins/_anomaly_detection/detectors/<detectorId>/_profile?_all=true
{
  "entity": [
    {
      "name": "host",
      "value": "i-00f28ec1eb8997686"
    }
  ]
}
```

#### Sample Responses

```json
{
  "is_active": true,
  "last_active_timestamp": 1604026394879,
  "last_sample_timestamp": 1604026394879,
  "init_progress": {
    "percentage": "100%"
  },
  "model": {
    "model_id": "TFUdd3UBBwIAGQeRh5IS_entity_i-00f28ec1eb8997686",
    "model_size_in_bytes": 712480,
    "node_id": "MQ-bTBW3Q2uU_2zX3pyEQg"
  },
  "state": "RUNNING"
}
```

To get profile information for only historical analysis, specify `ad_task`.
Specifying `_all` is an expensive operation for multi-category high cardinality detectors.

#### Request

```json
GET _plugins/_anomaly_detection/detectors/<detectorId>/_profile?_all
GET _plugins/_anomaly_detection/detectors/<detectorId>/_profile/ad_task
```

#### Sample Responses

```json
{
  "ad_task": {
    "ad_task": {
      "task_id": "CHI0TnwBYwCbWecgqgRA",
      "last_update_time": 1633399648413,
      "started_by": "admin",
      "state": "RUNNING",
      "detector_id": "3Dh6TXwBwf_U8gjURE0F",
      "task_progress": 0,
      "init_progress": 0,
      "execution_start_time": 1633399646784,
      "is_latest": true,
      "task_type": "HISTORICAL_HC_DETECTOR",
      "coordinating_node": "2Z4q22BySEyzakYt_A0A2A",
      "detector": {
        "name": "testhc-mc",
        "description": "test",
        "time_field": "timestamp",
        "indices": [
          "server_log"
        ],
        "filter_query": {
          "match_all": {
            "boost": 1
          }
        },
        "detection_interval": {
          "period": {
            "interval": 5,
            "unit": "Minutes"
          }
        },
        "window_delay": {
          "period": {
            "interval": 1,
            "unit": "Minutes"
          }
        },
        "shingle_size": 8,
        "schema_version": 0,
        "feature_attributes": [
          {
            "feature_id": "2zh6TXwBwf_U8gjUQ039",
            "feature_name": "test",
            "feature_enabled": true,
            "aggregation_query": {
              "test": {
                "sum": {
                  "field": "value"
                }
              }
            }
          }
        ],
        "ui_metadata": {
          "features": {
            "test": {
              "aggregationBy": "sum",
              "aggregationOf": "value",
              "featureType": "simple_aggs"
            }
          },
          "filters": []
        },
        "last_update_time": 1633387430916,
        "category_field": [
          "ip",
          "error_type"
        ],
        "user": {
          "name": "admin",
          "backend_roles": [
            "admin"
          ],
          "roles": [
            "own_index",
            "all_access"
          ],
          "custom_attribute_names": [],
          "user_requested_tenant": "__user__"
        },
        "detector_type": "MULTI_ENTITY"
      },
      "detection_date_range": {
        "start_time": 1632793800000,
        "end_time": 1633398600000
      },
      "user": {
        "name": "admin",
        "backend_roles": [
          "admin"
        ],
        "roles": [
          "own_index",
          "all_access"
        ],
        "custom_attribute_names": [],
        "user_requested_tenant": "__user__"
      }
    },
    "node_id": "2Z4q22BySEyzakYt_A0A2A",
    "task_id": "CHI0TnwBYwCbWecgqgRA",
    "task_type": "HISTORICAL_HC_DETECTOR",
    "detector_task_slots": 10,
    "total_entities_count": 32,
    "pending_entities_count": 22,
    "running_entities_count": 10,
    "running_entities" : [
      """[{"name":"ip","value":"192.168.1.1"},{"name":"error_type","value":"error9"}]""",
      ...
    ],
    "entity_task_profiles": [
      {
        "shingle_size": 8,
        "rcf_total_updates": 994,
        "threshold_model_trained": true,
        "threshold_model_training_data_size": 0,
        "model_size_in_bytes": 1593240,
        "node_id": "2Z4q22BySEyzakYt_A0A2A",
        "entity": [
          {
            "name": "ip",
            "value": "192.168.1.1"
          },
          {
            "name": "error_type",
            "value": "error6"
          }
        ],
        "task_id": "9XI0TnwBYwCbWecgsAd6",
        "task_type": "HISTORICAL_HC_ENTITY"
      },
      ...
    ]
  }
}
```

---

## Delete detector results
Introduced 1.1
{: .label .label-purple }

Deletes the results of a detector based on a query.

The delete detector results API only deletes anomaly result documents in the default result index. It doesn't support deleting anomaly result documents stored in any custom result indices.

You need to manually delete anomaly result documents that you don't need from custom result indices.

#### Request

```json
DELETE _plugins/_anomaly_detection/detectors/results
{
  "query": {
    "bool": {
      "filter": [
        {
          "term": {
            "detector_id": {
              "value": "rlDtOHwBD5tpxlbyW7Nt"
            }
          }
        },
        {
          "term": {
            "task_id": {
              "value": "TM3tOHwBCi2h__AOXlyQ"
            }
          }
        },
        {
          "range": {
            "data_start_time": {
              "lte": 1632441600000
            }
          }
        }
      ]
    }
  }
}
```

#### Example response

```json
{
  "took": 48,
  "timed_out": false,
  "total": 28,
  "updated": 0,
  "created": 0,
  "deleted": 28,
  "batches": 1,
  "version_conflicts": 0,
  "noops": 0,
  "retries": {
    "bulk": 0,
    "search": 0
  },
  "throttled_millis": 0,
  "requests_per_second": -1,
  "throttled_until_millis": 0,
  "failures": []
}
```

---

## Create monitor
Introduced 1.0
{: .label .label-purple }

Create a monitor to set up alerts for the detector.

#### Request

```json
POST _plugins/_alerting/monitors
{
  "type": "monitor",
  "name": "test-monitor",
  "enabled": true,
  "schedule": {
    "period": {
      "interval": 20,
      "unit": "MINUTES"
    }
  },
  "inputs": [
    {
      "search": {
        "indices": [
          ".opensearch-anomaly-results*"
        ],
        "query": {
          "size": 1,
          "query": {
            "bool": {
              "filter": [
                {
                  "range": {
                    "data_end_time": {
                      "from": "{{period_end}}||-20m",
                      "to": "{{period_end}}",
                      "include_lower": true,
                      "include_upper": true,
                      "boost": 1
                    }
                  }
                },
                {
                  "term": {
                    "detector_id": {
                      "value": "m4ccEnIBTXsGi3mvMt9p",
                      "boost": 1
                    }
                  }
                }
              ],
              "adjust_pure_negative": true,
              "boost": 1
            }
          },
          "sort": [
            {
              "anomaly_grade": {
                "order": "desc"
              }
            },
            {
              "confidence": {
                "order": "desc"
              }
            }
          ],
          "aggregations": {
            "max_anomaly_grade": {
              "max": {
                "field": "anomaly_grade"
              }
            }
          }
        }
      }
    }
  ],
  "triggers": [
    {
      "name": "test-trigger",
      "severity": "1",
      "condition": {
        "script": {
          "source": "return ctx.results[0].aggregations.max_anomaly_grade.value != null && ctx.results[0].aggregations.max_anomaly_grade.value > 0.7 && ctx.results[0].hits.hits[0]._source.confidence > 0.7",
          "lang": "painless"
        }
      },
      "actions": [
        {
          "name": "test-action",
          "destination_id": "ld7912sBlQ5JUWWFThoW",
          "message_template": {
            "source": "This is my message body."
          },
          "throttle_enabled": false,
          "subject_template": {
            "source": "TheSubject"
          }
        }
      ]
    }
  ]
}
```

#### Example response

```json
{
  "_id": "OClTEnIBmSf7y6LP11Jz",
  "_version": 1,
  "_seq_no": 10,
  "_primary_term": 1,
  "monitor": {
    "type": "monitor",
    "schema_version": 1,
    "name": "test-monitor",
    "enabled": true,
    "enabled_time": 1589445384043,
    "schedule": {
      "period": {
        "interval": 20,
        "unit": "MINUTES"
      }
    },
    "inputs": [
      {
        "search": {
          "indices": [
            ".opensearch-anomaly-results*"
          ],
          "query": {
            "size": 1,
            "query": {
              "bool": {
                "filter": [
                  {
                    "range": {
                      "data_end_time": {
                        "from": "{{period_end}}||-20m",
                        "to": "{{period_end}}",
                        "include_lower": true,
                        "include_upper": true,
                        "boost": 1
                      }
                    }
                  },
                  {
                    "term": {
                      "detector_id": {
                        "value": "m4ccEnIBTXsGi3mvMt9p",
                        "boost": 1
                      }
                    }
                  }
                ],
                "adjust_pure_negative": true,
                "boost": 1
              }
            },
            "sort": [
              {
                "anomaly_grade": {
                  "order": "desc"
                }
              },
              {
                "confidence": {
                  "order": "desc"
                }
              }
            ],
            "aggregations": {
              "max_anomaly_grade": {
                "max": {
                  "field": "anomaly_grade"
                }
              }
            }
          }
        }
      }
    ],
    "triggers": [
      {
        "id": "NilTEnIBmSf7y6LP11Jr",
        "name": "test-trigger",
        "severity": "1",
        "condition": {
          "script": {
            "source": "return ctx.results[0].aggregations.max_anomaly_grade.value != null && ctx.results[0].aggregations.max_anomaly_grade.value > 0.7 && ctx.results[0].hits.hits[0]._source.confidence > 0.7",
            "lang": "painless"
          }
        },
        "actions": [
          {
            "id": "NylTEnIBmSf7y6LP11Jr",
            "name": "test-action",
            "destination_id": "ld7912sBlQ5JUWWFThoW",
            "message_template": {
              "source": "This is my message body.",
              "lang": "mustache"
            },
            "throttle_enabled": false,
            "subject_template": {
              "source": "TheSubject",
              "lang": "mustache"
            }
          }
        ]
      }
    ],
    "last_update_time": 1589445384043
  }
}
```

---
