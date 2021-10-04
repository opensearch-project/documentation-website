---
layout: default
title: Anomaly detection API
parent: Anomaly detection
nav_order: 1
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

This command creates a detector named `test-detector` that finds anomalies based on the sum of the `value` field:


#### Request

```json
POST _plugins/_anomaly_detection/detectors
{
  "name": "test-detector",
  "description": "Test detector",
  "time_field": "timestamp",
  "indices": [
    "order*"
  ],
  "feature_attributes": [
    {
      "feature_name": "total_order",
      "feature_enabled": true,
      "aggregation_query": {
        "total_order": {
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
          "exists": {
            "field": "value",
            "boost": 1
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

#### Sample response

```json
{
  "_id": "m4ccEnIBTXsGi3mvMt9p",
  "_version": 1,
  "_seq_no": 3,
  "_primary_term": 1,
  "anomaly_detector": {
    "name": "test-detector",
    "description": "Test detector",
    "time_field": "timestamp",
    "indices": [
      "order*"
    ],
    "filter_query": {
      "bool": {
        "filter": [
          {
            "exists": {
              "field": "value",
              "boost": 1
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
    "schema_version": 0,
    "feature_attributes": [
      {
        "feature_id": "mYccEnIBTXsGi3mvMd8_",
        "feature_name": "total_order",
        "feature_enabled": true,
        "aggregation_query": {
          "total_order": {
            "sum": {
              "field": "value"
            }
          }
        }
      }
    ]
  }
}
```

To set a category field for high cardinality:

#### Request

```json
POST _plugins/_anomaly_detection/detectors
{
  "name": "Host OK Rate Detector",
  "description": "ok rate",
  "time_field": "@timestamp",
  "indices": [
    "host-cloudwatch"
  ],
  "category_field": [
    "host"
  ],
  "feature_attributes": [
    {
      "feature_name": "latency_max",
      "feature_enabled": true,
      "aggregation_query": {
        "latency_max": {
          "max": {
            "field": "latency"
          }
        }
      }
    }
  ],
  "window_delay": {
    "period": {
      "interval": 10,
      "unit": "MINUTES"
    }
  },
  "detection_interval": {
    "period": {
      "interval": 1,
      "unit": "MINUTES"
    }
  }
}
```

#### Sample response

```json
{
  "_id": "4CIGoHUBTpMGN-4KzBQg",
  "_version": 1,
  "_seq_no": 0,
  "anomaly_detector": {
    "name": "Host OK Rate Detector",
    "description": "ok rate",
    "time_field": "@timestamp",
    "indices": [
      "server-metrics"
    ],
    "filter_query": {
      "match_all": {
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
        "interval": 10,
        "unit": "MINUTES"
      }
    },
    "shingle_size": 1,
    "schema_version": 2,
    "feature_attributes": [
      {
        "feature_id": "0Kld3HUBhpHMyt2e_UHn",
        "feature_name": "latency_max",
        "feature_enabled": true,
        "aggregation_query": {
          "latency_max": {
            "max": {
              "field": "latency"
            }
          }
        }
      }
    ],
    "last_update_time": 1604707601438,
    "category_field": [
      "host"
    ]
  },
  "_primary_term": 1
}
```

You can specify the following options.

Options | Description | Type | Required
:--- | :--- |:--- |:--- |
`name` |  The name of the detector. | `string` | Yes
`description` |  A description of the detector. | `string` | Yes
`time_field` |  The name of the time field. | `string` | Yes
`indices`  |  A list of indices to use as the data source. | `list` | Yes
`feature_attributes` | Specify a `feature_name`, set the `enabled` parameter to `true`, and specify an aggregation query. | `list` | Yes
`filter_query` |  Provide an optional filter query for your feature. | `object` | No
`detection_interval` | The time interval for your anomaly detector. | `object` | Yes
`window_delay` | Add extra processing time for data collection. | `object` | No
`category_field` | Categorizes or slices data with a dimension. Similar to `GROUP BY` in SQL. | `list` | No

---

## Get detector
Introduced 1.0
{: .label .label-purple }

Returns all information about a detector based on the `detector_id`.

#### Request

```json
GET _plugins/_anomaly_detection/detectors/<detectorId>
```

#### Sample response

```json
{
  "_id" : "m4ccEnIBTXsGi3mvMt9p",
  "_version" : 1,
  "_primary_term" : 1,
  "_seq_no" : 3,
  "anomaly_detector" : {
    "name" : "test-detector",
    "description" : "Test detector",
    "time_field" : "timestamp",
    "indices" : [
      "order*"
    ],
    "filter_query" : {
      "bool" : {
        "filter" : [
          {
            "exists" : {
              "field" : "value",
              "boost" : 1.0
            }
          }
        ],
        "adjust_pure_negative" : true,
        "boost" : 1.0
      }
    },
    "detection_interval" : {
      "period" : {
        "interval" : 1,
        "unit" : "Minutes"
      }
    },
    "window_delay" : {
      "period" : {
        "interval" : 1,
        "unit" : "Minutes"
      }
    },
    "schema_version" : 0,
    "feature_attributes" : [
      {
        "feature_id" : "mYccEnIBTXsGi3mvMd8_",
        "feature_name" : "total_order",
        "feature_enabled" : true,
        "aggregation_query" : {
          "total_order" : {
            "sum" : {
              "field" : "value"
            }
          }
        }
      }
    ],
    "last_update_time" : 1589441737319
  }
}
```


Use `job=true` to get anomaly detection job information.

#### Request

```json
GET _plugins/_anomaly_detection/detectors/<detectorId>?job=true
```

#### Sample response

```json
{
  "_id": "LJxGsXcBoDQA8W1Q--A1",
  "_version": 1,
  "_primary_term": 1,
  "_seq_no": 0,
  "anomaly_detector": {
    "name": "test2",
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
        "feature_id": "K5xGsXcBoDQA8W1Q-uCF",
        "feature_name": "F1",
        "feature_enabled": "true",
        "aggregation_query": {
          "f_1": {
            "sum": {
              "field": "value"
            }
          }
        }
      }
    ],
    "last_update_time": 1613586955060,
    "detector_type": "MULTI_ENTITY"
  },
  "anomaly_detector_job": {
    "name": "LJxGsXcBoDQA8W1Q--A1",
    "schedule": {
      "interval": {
        "start_time": 1613587220387,
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
    "enabled": "false",
    "enabled_time": 1613587220387,
    "last_update_time": 1613587289169,
    "lock_duration_seconds": 60,
    "disabled_time": 1613587289169
  },
  "anomaly_detection_task": {
    "task_id": "WZ5LsXcBoDQA8W1QmUa3",
    "last_update_time": 1613587349022,
    "error": "Task cancelled by user",
    "state": "STOPPED",
    "detector_id": "LJxGsXcBoDQA8W1Q--A1",
    "task_progress": 0.26321793,
    "init_progress": 1,
    "current_piece": 1611030900000,
    "execution_start_time": 1613587257783,
    "execution_end_time": 1613587349022,
    "is_latest": "true",
    "task_type": "HISTORICAL",
    "coordinating_node": "NSw5j-3YQeGkH8KESVKlzw",
    "worker_node": "NSw5j-3YQeGkH8KESVKlzw",
    "detector": {
      "name": "test2",
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
          "feature_id": "K5xGsXcBoDQA8W1Q-uCF",
          "feature_name": "F1",
          "feature_enabled": "true",
          "aggregation_query": {
            "f_1": {
              "sum": {
                "field": "value"
              }
            }
          }
        }
      ],
      "last_update_time": 1613586955060,
      "detector_type": "MULTI_ENTITY"
    }
  }
}
```

Use `task=true` to get historical analysis task information.

#### Request

```json
GET _plugins/_anomaly_detection/detectors/<detectorId>?task=true
```

#### Sample response

```json
{
  "_id": "BwzKQXcB89DLS7G9rg7Y",
  "_version": 1,
  "_primary_term": 2,
  "_seq_no": 10,
  "anomaly_detector": {
    "name": "test-ylwu1",
    "description": "test",
    "time_field": "timestamp",
    "indices": [
      "ser*"
    ],
    "filter_query": {
      "match_all": {
        "boost": 1
      }
    },
    "detection_interval": {
      "period": {
        "interval": 10,
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
        "feature_id": "BgzKQXcB89DLS7G9rg7G",
        "feature_name": "F1",
        "feature_enabled": true,
        "aggregation_query": {
          "f_1": {
            "sum": {
              "field": "value"
            }
          }
        }
      }
    ],
    "ui_metadata": {
      "features": {
        "F1": {
          "aggregationBy": "sum",
          "aggregationOf": "value",
          "featureType": "simple_aggs"
        }
      }
    },
    "last_update_time": 1611716538071,
    "user": {
      "name": "admin",
      "backend_roles": [
        "admin"
      ],
      "roles": [
        "all_access",
        "own_index"
      ],
      "custom_attribute_names": [],
      "user_requested_tenant": "__user__"
    },
    "detector_type": "HISTORICAL_SINGLE_ENTITY",
    "detection_date_range": {
      "start_time": 1580094137997,
      "end_time": 1611716537997
    }
  },
  "anomaly_detection_task": {
    "task_id": "sgxaRXcB89DLS7G9RfIO",
    "last_update_time": 1611776648699,
    "started_by": "admin",
    "state": "FINISHED",
    "detector_id": "BwzKQXcB89DLS7G9rg7Y",
    "task_progress": 1,
    "init_progress": 1,
    "current_piece": 1611716400000,
    "execution_start_time": 1611776279822,
    "execution_end_time": 1611776648679,
    "is_latest": true,
    "task_type": "HISTORICAL",
    "coordinating_node": "gs213KqjS4q7H4Bmn_ZuLA",
    "worker_node": "PgfR3JhbT7yJMx7bwQ6E3w",
    "detector": {
      "name": "test-ylwu1",
      "description": "test",
      "time_field": "timestamp",
      "indices": [
        "ser*"
      ],
      "filter_query": {
        "match_all": {
          "boost": 1
        }
      },
      "detection_interval": {
        "period": {
          "interval": 10,
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
          "feature_id": "BgzKQXcB89DLS7G9rg7G",
          "feature_name": "F1",
          "feature_enabled": true,
          "aggregation_query": {
            "f_1": {
              "sum": {
                "field": "value"
              }
            }
          }
        }
      ],
      "ui_metadata": {
        "features": {
          "F1": {
            "aggregationBy": "sum",
            "aggregationOf": "value",
            "featureType": "simple_aggs"
          }
        }
      },
      "last_update_time": 1611716538071,
      "user": {
        "name": "admin",
        "backend_roles": [
          "admin"
        ],
        "roles": [
          "all_access",
          "own_index"
        ],
        "custom_attribute_names": [],
        "user_requested_tenant": "__user__"
      },
      "detector_type": "HISTORICAL_SINGLE_ENTITY",
      "detection_date_range": {
        "start_time": 1580094137997,
        "end_time": 1611716537997
      }
    },
    "user": {
      "name": "admin",
      "backend_roles": [
        "admin"
      ],
      "roles": [
        "all_access",
        "own_index"
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
To update a detector, you need to first stop the detector.

#### Request

```json
PUT _plugins/_anomaly_detection/detectors/<detectorId>
{
  "name": "test-detector",
  "description": "Test detector",
  "time_field": "timestamp",
  "indices": [
    "order*"
  ],
  "feature_attributes": [
    {
      "feature_name": "total_order",
      "feature_enabled": true,
      "aggregation_query": {
        "total_order": {
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
          "exists": {
            "field": "value",
            "boost": 1
          }
        }
      ],
      "adjust_pure_negative": true,
      "boost": 1
    }
  },
  "detection_interval": {
    "period": {
      "interval": 10,
      "unit": "MINUTES"
    }
  },
  "window_delay": {
    "period": {
      "interval": 1,
      "unit": "MINUTES"
    }
  }
}
```


#### Sample response

```json
{
  "_id" : "m4ccEnIBTXsGi3mvMt9p",
  "_version" : 2,
  "_seq_no" : 4,
  "_primary_term" : 1,
  "anomaly_detector" : {
    "name" : "test-detector",
    "description" : "Test detector",
    "time_field" : "timestamp",
    "indices" : [
      "order*"
    ],
    "filter_query" : {
      "bool" : {
        "filter" : [
          {
            "exists" : {
              "field" : "value",
              "boost" : 1.0
            }
          }
        ],
        "adjust_pure_negative" : true,
        "boost" : 1.0
      }
    },
    "detection_interval" : {
      "period" : {
        "interval" : 10,
        "unit" : "Minutes"
      }
    },
    "window_delay" : {
      "period" : {
        "interval" : 1,
        "unit" : "Minutes"
      }
    },
    "schema_version" : 0,
    "feature_attributes" : [
      {
        "feature_id" : "xxokEnIBcpeWMD987A1X",
        "feature_name" : "total_order",
        "feature_enabled" : true,
        "aggregation_query" : {
          "total_order" : {
            "sum" : {
              "field" : "value"
            }
          }
        }
      }
    ]
  }
}
```

---

## Preview detector
Introduced 1.0
{: .label .label-purple }

Passes a date range to the anomaly detector to return any anomalies within that date range.

#### Request

```json
POST _plugins/_anomaly_detection/detectors/<detectorId>/_preview
{
  "period_start": 1612982516000,
  "period_end": 1614278539000,
  "detector": {
    "name": "test-detector",
    "description": "test server_log",
    "time_field": "timestamp",
    "indices": [
      "server_log"
    ],
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
    "feature_attributes": [
      {
        "feature_name": "F1",
        "feature_enabled": true,
        "aggregation_query": {
          "f_1": {
            "sum": {
              "field": "value"
            }
          }
        }
      }
    ]
  }
}
```

#### Sample response

```json
{
  "anomaly_result": [
    ...
    {
      "detector_id": "m4ccEnIBTXsGi3mvMt9p",
      "data_start_time": 1588843020000,
      "data_end_time": 1588843620000,
      "feature_data": [
        {
          "feature_id": "xxokEnIBcpeWMD987A1X",
          "feature_name": "total_order",
          "data": 489.9929131106
        }
      ],
      "anomaly_grade": 0,
      "confidence": 0.99
    }
    ...
  ],
  "anomaly_detector": {
    "name": "test-detector",
    "description": "Test detector",
    "time_field": "timestamp",
    "indices": [
      "order*"
    ],
    "filter_query": {
      "bool": {
        "filter": [
          {
            "exists": {
              "field": "value",
              "boost": 1
            }
          }
        ],
        "adjust_pure_negative": true,
        "boost": 1
      }
    },
    "detection_interval": {
      "period": {
        "interval": 10,
        "unit": "MINUTES"
      }
    },
    "window_delay": {
      "period": {
        "interval": 1,
        "unit": "MINUTES"
      }
    },
    "schema_version": 0,
    "feature_attributes": [
      {
        "feature_id": "xxokEnIBcpeWMD987A1X",
        "feature_name": "total_order",
        "feature_enabled": true,
        "aggregation_query": {
          "total_order": {
            "sum": {
              "field": "value"
            }
          }
        }
      }
    ],
    "last_update_time": 1589442309241
  }
}
```

If you specify a category field, each result is associated with an entity:

#### Sample response

```json
{
  "anomaly_result": [
    {
      "detector_id": "4CIGoHUBTpMGN-4KzBQg",
      "data_start_time": 1604277960000,
      "data_end_time": 1604278020000,
      "schema_version": 0,
      "anomaly_grade": 0,
      "confidence": 0.99
    }
  ],
  "entity": [
    {
      "name": "host",
      "value": "i-00f28ec1eb8997686"
    }
  ]
},
{
  "detector_id": "4CIGoHUBTpMGN-4KzBQg",
  "data_start_time": 1604278020000,
  "data_end_time": 1604278080000,
  "schema_version": 0,
  "feature_data": [
    {
      "feature_id": "0Kld3HUBhpHMyt2e_UHn",
      "feature_name": "latency_max",
      "data": -17
    }
  ],
  "anomaly_grade": 0,
  "confidence": 0.99,
  "entity": [
    {
      "name": "host",
      "value": "i-00f28ec1eb8997686"
    }
  ]
}
...
```

Or, you can specify the detector ID:

```json
POST _plugins/_anomaly_detection/detectors/_preview
{
  "detector_id": "sYkUvHcBiZv51f-Lv8QN",
  "period_start": 1612982516000,
  "period_end": 1614278539000
}
```

---

## Start detector job
Introduced 1.0
{: .label .label-purple }

Starts a real-time or historical anomaly detector job.


#### Request

```json
POST _plugins/_anomaly_detection/detectors/<detectorId>/_start
```

#### Sample response

```json
{
  "_id" : "m4ccEnIBTXsGi3mvMt9p",
  "_version" : 1,
  "_seq_no" : 6,
  "_primary_term" : 1
}
```

To start historical analysis:

```json
POST _plugins/_anomaly_detection/detectors/<detectorId>/_start
{
  "start_time": 1503168590000,
  "end_time": 1617301324000
}
```

---

## Stop detector job
Introduced 1.0
{: .label .label-purple }

Stops a real-time or historical anomaly detector job.

#### Request

```json
POST _plugins/_anomaly_detection/detectors/<detectorId>/_stop
```

#### Sample response

```json
Stopped detector: m4ccEnIBTXsGi3mvMt9p
```

To stop historical analysis:

```json
POST _plugins/_anomaly_detection/detectors/<detectorId>/_stop?historical=true
```


---

## Search detector result
Introduced 1.0
{: .label .label-purple }

Returns all results for a search query.

#### Request

```json
GET _plugins/_anomaly_detection/detectors/results/_search
POST _plugins/_anomaly_detection/detectors/results/_search
{
  "query": {
    "bool": {
      "must": {
        "range": {
          "anomaly_score": {
            "gte": 0.6,
            "lte": 1
          }
        }
      }
    }
  }
}
```

#### Sample response

```json
{
  "took": 9,
  "timed_out": false,
  "_shards": {
    "total": 25,
    "successful": 25,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": ".opensearch-anomaly-results-history-2020.04.30-1",
        "_type": "_doc",
        "_id": "_KBrzXEBbpoKkFM5mStm",
        "_version": 1,
        "_seq_no": 58,
        "_primary_term": 1,
        "_score": 1,
        "_source": {
          "detector_id": "2KDozHEBbpoKkFM58yr6",
          "anomaly_score": 0.8995068350366767,
          "execution_start_time": 1588289313114,
          "data_end_time": 1588289313114,
          "confidence": 0.84214852704501,
          "data_start_time": 1588289253114,
          "feature_data": [
            {
              "feature_id": "X0fpzHEB5NGZmIRkXKcy",
              "feature_name": "total_error",
              "data": 20
            }
          ],
          "execution_end_time": 1588289313126,
          "anomaly_grade": 0
        }
      },
      {
        "_index": ".opensearch-anomaly-results-history-2020.04.30-1",
        "_type": "_doc",
        "_id": "EqB1zXEBbpoKkFM5qyyE",
        "_version": 1,
        "_seq_no": 61,
        "_primary_term": 1,
        "_score": 1,
        "_source": {
          "detector_id": "2KDozHEBbpoKkFM58yr6",
          "anomaly_score": 0.7086834513354907,
          "execution_start_time": 1588289973113,
          "data_end_time": 1588289973113,
          "confidence": 0.42162017029510446,
          "data_start_time": 1588289913113,
          "feature_data": [
            {
              "feature_id": "X0fpzHEB5NGZmIRkXKcy",
              "feature_name": "memory_usage",
              "data": 20.0347333108
            }
          ],
          "execution_end_time": 1588289973124,
          "anomaly_grade": 0
        }
      }
    ]
  }
}
```

In high cardinality detectors, the result contains entity information.

To see an ordered set of anomaly records for an entity with an anomaly within a certain time range for a specific feature value:

#### Request

```json
POST _plugins/_anomaly_detection/detectors/results/_search
{
  "query": {
    "bool": {
      "filter": [
        {
          "term": {
            "detector_id": "4CIGoHUBTpMGN-4KzBQg"
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
          "nested": {
            "path": "entity",
            "query": {
              "bool": {
                "must": [
                  {
                    "term": {
                      "entity.value": "i-00f28ec1eb8997685"
                    }
                  }
                ]
              }
            }
          }
        }
      ]
    }
  },
  "size": 8,
  "sort": [
    {
      "execution_end_time": {
        "order": "desc"
      }
    }
  ],
  "track_total_hits": true
}
```

#### Sample response

```json
{
  "took": 443,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 7,
      "relation": "eq"
    },
    "max_score": null,
    "hits": [
      {
        "_index": ".opensearch-anomaly-results-history-2020.11.07-1",
        "_type": "_doc",
        "_id": "BiItoHUBTpMGN-4KARY5",
        "_version": 1,
        "_seq_no": 206,
        "_primary_term": 1,
        "_score": null,
        "_source": {
          "detector_id": "4CIGoHUBTpMGN-4KzBQg",
          "schema_version": 2,
          "anomaly_score": 2.462550517055763,
          "execution_start_time": 1604710105400,
          "data_end_time": 1604710094516,
          "confidence": 0.8246254862573076,
          "data_start_time": 1604710034516,
          "feature_data": [
            {
              "feature_id": "0Kld3HUBhpHMyt2e_UHn",
              "feature_name": "latency_max",
              "data": 3526
            }
          ],
          "execution_end_time": 1604710105401,
          "anomaly_grade": 0.08045977011494891,
          "entity": [
            {
              "name": "host",
              "value": "i-00f28ec1eb8997685"
            }
          ]
        },
        "sort": [
          1604710105401
        ]
      },
      {
        "_index": ".opensearch-anomaly-results-history-2020.11.07-1",
        "_type": "_doc",
        "_id": "wiImoHUBTpMGN-4KlhXs",
        "_version": 1,
        "_seq_no": 156,
        "_primary_term": 1,
        "_score": null,
        "_source": {
          "detector_id": "4CIGoHUBTpMGN-4KzBQg",
          "schema_version": 2,
          "anomaly_score": 4.892453213261217,
          "execution_start_time": 1604709684971,
          "data_end_time": 1604709674522,
          "confidence": 0.8313735633713821,
          "data_start_time": 1604709614522,
          "feature_data": [
            {
              "feature_id": "0Kld3HUBhpHMyt2e_UHn",
              "feature_name": "latency_max",
              "data": 5709
            }
          ],
          "execution_end_time": 1604709684971,
          "anomaly_grade": 0.06542056074767538,
          "entity": [
            {
              "name": "host",
              "value": "i-00f28ec1eb8997685"
            }
          ]
        },
        "sort": [
          1604709684971
        ]
      },
      {
        "_index": ".opensearch-anomaly-results-history-2020.11.07-1",
        "_type": "_doc",
        "_id": "ZiIcoHUBTpMGN-4KhhVA",
        "_version": 1,
        "_seq_no": 79,
        "_primary_term": 1,
        "_score": null,
        "_source": {
          "detector_id": "4CIGoHUBTpMGN-4KzBQg",
          "schema_version": 2,
          "anomaly_score": 3.187717536855158,
          "execution_start_time": 1604709025343,
          "data_end_time": 1604709014520,
          "confidence": 0.8301116064308817,
          "data_start_time": 1604708954520,
          "feature_data": [
            {
              "feature_id": "0Kld3HUBhpHMyt2e_UHn",
              "feature_name": "latency_max",
              "data": 441
            }
          ],
          "execution_end_time": 1604709025344,
          "anomaly_grade": 0.040767386091133916,
          "entity": [
            {
              "name": "host",
              "value": "i-00f28ec1eb8997685"
            }
          ]
        },
        "sort": [
          1604709025344
        ]
      }
    ]
  }
}
```

You can query the anomaly results for historical analysis with the `task_id`:

#### Request

```json
GET _plugins/_anomaly_detection/detectors/results/_search
{
  "query": {
    "term": {
      "task_id": {
        "value": "NnlV9HUBQxqfQ7vBJNzy"
      }
    }
  }
}
```

#### Sample response

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
    "max_score": 2.1366,
    "hits": [
      {
        "_index": ".opensearch-anomaly-detection-state",
        "_type": "_doc",
        "_id": "CoM8WncBtt2qvI-LZO7_",
        "_version": 8,
        "_seq_no": 1351,
        "_primary_term": 3,
        "_score": 2.1366,
        "_source": {
          "detector_id": "dZc8WncBgO2zoQoFWVBA",
          "worker_node": "dk6-HuKQRMKm2fi8TSDHsg",
          "task_progress": 0.09486946,
          "last_update_time": 1612126667008,
          "execution_start_time": 1612126643455,
          "state": "RUNNING",
          "coordinating_node": "gs213KqjS4q7H4Bmn_ZuLA",
          "current_piece": 1583503800000,
          "task_type": "HISTORICAL",
          "started_by": "admin",
          "init_progress": 1,
          "is_latest": true,
          "detector": {
            "description": "test",
            "ui_metadata": {
              "features": {
                "F1": {
                  "aggregationBy": "sum",
                  "aggregationOf": "value",
                  "featureType": "simple_aggs"
                }
              }
            },
            "detection_date_range": {
              "start_time": 1580504240308,
              "end_time": 1612126640308
            },
            "feature_attributes": [
              {
                "feature_id": "dJc8WncBgO2zoQoFWVAt",
                "feature_enabled": true,
                "feature_name": "F1",
                "aggregation_query": {
                  "f_1": {
                    "sum": {
                      "field": "value"
                    }
                  }
                }
              }
            ],
            "schema_version": 0,
            "time_field": "timestamp",
            "last_update_time": 1612126640448,
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
                "interval": 10
              }
            },
            "name": "test-historical-detector",
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
                "all_access",
                "own_index"
              ],
              "name": "admin",
              "user_requested_tenant": "__user__"
            },
            "detector_type": "HISTORICAL_SINGLE_ENTITY"
          },
          "user": {
            "backend_roles": [
              "admin"
            ],
            "custom_attribute_names": [],
            "roles": [
              "all_access",
              "own_index"
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

---

## Search detector tasks
Introduced 1.1
{: .label .label-purple }

Searches detector tasks.

#### Request

```json
POST _plugins/_anomaly_detection/detectors/tasks/_search
{
  "query": {
    "bool": {
      "filter": [
        {
          "term": {
            "detector_id": {
              "value": "_6WPu3cBBnauGn7oxUAv"
            }
          }
        },
        {
          "term": {
            "task_type": {
              "value": "HISTORICAL_HC_DETECTOR"
            }
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
  ]
}
```


#### Sample response

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
    "max_score": null,
    "hits": [
      {
        "_index": ".opensearch-anomaly-detection-state",
        "_type": "_doc",
        "_id": "TM3tOHwBCi2h__AOXlyQ",
        "_version": 3,
        "_seq_no": 14,
        "_primary_term": 1,
        "_score": null,
        "_source": {
          "detector_id": "rlDtOHwBD5tpxlbyW7Nt",
          "error": "",
          "detection_date_range": {
            "start_time": 1632437852100,
            "end_time": 1633042652100
          },
          "task_progress": 0.5,
          "last_update_time": 1633042667358,
          "execution_start_time": 1633042652810,
          "state": "RUNNING",
          "coordinating_node": "2hEGbUw6ShaiKe05n_xLdA",
          "task_type": "HISTORICAL_HC_DETECTOR",
          "started_by": "admin",
          "init_progress": 0,
          "is_latest": true,
          "detector": {
            "category_field": [
              "type"
            ],
            "description": "test",
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
            "feature_attributes": [
              {
                "feature_id": "7VDtOHwBD5tpxlbyWqPs",
                "feature_enabled": true,
                "feature_name": "test-feature",
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
            "last_update_time": 1633042652012,
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
            "name": "test-detector",
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
              "user_requested_tenant": null
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
        },
        "sort": [
          1633042652810
        ]
      }
    ]
  }
}
```


---

## Delete detector
Introduced 1.0
{: .label .label-purple }

Deletes a detector based on the `detector_id`.
To delete a detector, you need to first stop the detector.

#### Request

```json
DELETE _plugins/_anomaly_detection/detectors/<detectorId>
```


#### Sample response

```json
{
  "_index": ".opensearch-anomaly-detectors",
  "_type": "_doc",
  "_id": "m4ccEnIBTXsGi3mvMt9p",
  "_version": 2,
  "result": "deleted",
  "forced_refresh": true,
  "_shards": {
    "total": 2,
    "successful": 2,
    "failed": 0
  },
  "_seq_no": 6,
  "_primary_term": 1
}
```

---

## Delete detector results
Introduced 1.1
{: .label .label-purple }

Deletes the results of a detector based on a query.

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


#### Sample response

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

## Search detector
Introduced 1.0
{: .label .label-purple }

Returns all anomaly detectors for a search query.

#### Request

```json
GET _plugins/_anomaly_detection/detectors/_search
POST _plugins/_anomaly_detection/detectors/_search
{
  "query": {
    "bool": {
      "filter": [
        {
          "terms": {
            "indices": [
              "server_log"
            ]
          }
        }
      ]
    }
  }
}
```

#### Sample response

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
      "value": 1,
      "relation": "eq"
    },
    "max_score": 0,
    "hits": [
      {
        "_index": ".opensearch-anomaly-detectors",
        "_type": "_doc",
        "_id": "rlDtOHwBD5tpxlbyW7Nt",
        "_version": 1,
        "_seq_no": 0,
        "_primary_term": 1,
        "_score": 0,
        "_source": {
          "name": "test-detector",
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
              "feature_id": "7VDtOHwBD5tpxlbyWqPs",
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
          "last_update_time": 1633042652012,
          "category_field": [
            "type"
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
            "user_requested_tenant": null
          },
          "detector_type": "MULTI_ENTITY"
        }
      }
    ]
  }
}
```

---

## Get detector stats
Introduced 1.0
{: .label .label-purple }

Provides information about how the plugin is performing.

#### Request

```json
GET _plugins/_anomaly_detection/stats
GET _plugins/_anomaly_detection/<nodeId>/stats
GET _plugins/_anomaly_detection/<nodeId>/stats/<stat>
GET _plugins/_anomaly_detection/stats/<stat>
```

#### Sample response

```json
{
  "anomaly_detectors_index_status": "yellow",
  "anomaly_detection_state_status": "yellow",
  "single_entity_detector_count": 0,
  "detector_count": 1,
  "multi_entity_detector_count": 0,
  "anomaly_detection_job_index_status": "yellow",
  "models_checkpoint_index_status": "yellow",
  "anomaly_results_index_status": "yellow",
  "nodes": {
    "hhfW2ZNVTJCtbs8rO-nF4g": {
      "ad_execute_request_count": 6,
      "models": [
        {
          "detector_id": "mmZFeXsB7JcKN0mdnMf4",
          "model_type": "entity",
          "last_used_time": 1629827578975,
          "model_id": "mmZFeXsB7JcKN0mdnMf4_entity_ic43SHH11NWr32xXgjRFwg",
          "last_checkpoint_time": 1629827339211,
          "entity": [
            {
              "name": "host",
              "value": "server_2"
            },
            {
              "name": "service",
              "value": "app_6"
            }
          ]
        },
        {
          "detector_id": "mmZFeXsB7JcKN0mdnMf4",
          "model_type": "entity",
          "last_used_time": 1629827578979,
          "model_id": "mmZFeXsB7JcKN0mdnMf4_entity_OIsxy2nXMVdngK6Vv3X0uw",
          "last_checkpoint_time": 1629827342444,
          "entity": [
            {
              "name": "host",
              "value": "server_2"
            },
            {
              "name": "service",
              "value": "app_2"
            }
          ]
        },
        {
          "detector_id": "mmZFeXsB7JcKN0mdnMf4",
          "model_type": "entity",
          "last_used_time": 1629827578978,
          "model_id": "mmZFeXsB7JcKN0mdnMf4_entity_I0L8K8ktyVnyL59CVFCLVQ",
          "last_checkpoint_time": 1629827342068,
          "entity": [
            {
              "name": "host",
              "value": "server_1"
            },
            {
              "name": "service",
              "value": "app_4"
            }
          ]
        },
        {
          "detector_id": "mmZFeXsB7JcKN0mdnMf4",
          "model_type": "entity",
          "last_used_time": 1629827578975,
          "model_id": "mmZFeXsB7JcKN0mdnMf4_entity_ZoNYVJsq5ry6e-SWXmAt1Q",
          "last_checkpoint_time": 1629827339435,
          "entity": [
            {
              "name": "host",
              "value": "server_1"
            },
            {
              "name": "service",
              "value": "app_6"
            }
          ]
        },
        {
          "detector_id": "mmZFeXsB7JcKN0mdnMf4",
          "model_type": "entity",
          "last_used_time": 1629827578978,
          "model_id": "mmZFeXsB7JcKN0mdnMf4_entity_qo2ANH_NS7Bg8iV4AJpHOw",
          "last_checkpoint_time": 1629827341187,
          "entity": [
            {
              "name": "host",
              "value": "server_3"
            },
            {
              "name": "service",
              "value": "app_0"
            }
          ]
        },
        {
          "detector_id": "mmZFeXsB7JcKN0mdnMf4",
          "model_type": "entity",
          "last_used_time": 1629827578980,
          "model_id": "mmZFeXsB7JcKN0mdnMf4_entity_412FoQwCykWTAhjVfDGQDg",
          "last_checkpoint_time": 1629827342983,
          "entity": [
            {
              "name": "host",
              "value": "server_1"
            },
            {
              "name": "service",
              "value": "app_2"
            }
          ]
        }
      ],
      "ad_canceled_batch_task_count": 0,
      "ad_hc_execute_request_count": 6,
      "ad_hc_execute_failure_count": 0,
      "model_count": 21,
      "ad_execute_failure_count": 0,
      "ad_batch_task_failure_count": 0,
      "ad_total_batch_task_execution_count": 0,
      "ad_executing_batch_task_count": 0
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

#### Sample response

```json
{
  "anomaly_detectors_index_status": "green",
  "anomaly_detection_state_status": "green",
  "single_entity_detector_count": 0,
  "detector_count": 1,
  "multi_entity_detector_count": 1,
  "anomaly_detection_job_index_status": "green",
  "models_checkpoint_index_status": "green",
  "anomaly_results_index_status": "green",
  "nodes": {
    "bCtWtxWPThq0BIn5P5I4Xw": {
      "ad_execute_request_count": 0,
      "models": [
        {
          "detector_id": "rlDtOHwBD5tpxlbyW7Nt",
          "model_type": "entity",
          "last_used_time": 1633044152729,
          "model_id": "rlDtOHwBD5tpxlbyW7Nt_entity_error20",
          "last_checkpoint_time": 1633043556222,
          "entity": [
            {
              "name": "type",
              "value": "error20"
            }
          ]
        },
        {
          "detector_id": "rlDtOHwBD5tpxlbyW7Nt",
          "model_type": "entity",
          "last_used_time": 1633044152767,
          "model_id": "rlDtOHwBD5tpxlbyW7Nt_entity_error31",
          "last_checkpoint_time": 1633043855146,
          "entity": [
            {
              "name": "type",
              "value": "error31"
            }
          ]
        },
        {
          "detector_id": "rlDtOHwBD5tpxlbyW7Nt",
          "model_type": "entity",
          "last_used_time": 1633044152732,
          "model_id": "rlDtOHwBD5tpxlbyW7Nt_entity_error16",
          "last_checkpoint_time": 1633043557253,
          "entity": [
            {
              "name": "type",
              "value": "error16"
            }
          ]
        }
      ],
      "ad_canceled_batch_task_count": 0,
      "ad_hc_execute_request_count": 0,
      "ad_hc_execute_failure_count": 0,
      "model_count": 8,
      "ad_execute_failure_count": 0,
      "ad_batch_task_failure_count": 0,
      "ad_total_batch_task_execution_count": 15,
      "ad_executing_batch_task_count": 3
    },
    "dIyavWhmSYWGz65b4u-lpQ": {
      "ad_execute_request_count": 0,
      "models": [
        {
          "detector_id": "rlDtOHwBD5tpxlbyW7Nt",
          "model_type": "entity",
          "last_used_time": 1633044152729,
          "model_id": "rlDtOHwBD5tpxlbyW7Nt_entity_error3",
          "last_checkpoint_time": 1633043256013,
          "entity": [
            {
              "name": "type",
              "value": "error3"
            }
          ]
        },
        {
          "detector_id": "rlDtOHwBD5tpxlbyW7Nt",
          "model_type": "entity",
          "last_used_time": 1633044152727,
          "model_id": "rlDtOHwBD5tpxlbyW7Nt_entity_error1",
          "last_checkpoint_time": 1633043254819,
          "entity": [
            {
              "name": "type",
              "value": "error1"
            }
          ]
        },
        {
          "detector_id": "rlDtOHwBD5tpxlbyW7Nt",
          "model_type": "entity",
          "last_used_time": 1633044152735,
          "model_id": "rlDtOHwBD5tpxlbyW7Nt_entity_error22",
          "last_checkpoint_time": 1633043557023,
          "entity": [
            {
              "name": "type",
              "value": "error22"
            }
          ]
        },
        {
          "detector_id": "rlDtOHwBD5tpxlbyW7Nt",
          "model_type": "entity",
          "last_used_time": 1633044152763,
          "model_id": "rlDtOHwBD5tpxlbyW7Nt_entity_error29",
          "last_checkpoint_time": 1633043855226,
          "entity": [
            {
              "name": "type",
              "value": "error29"
            }
          ]
        }
      ],
      "ad_canceled_batch_task_count": 0,
      "ad_hc_execute_request_count": 0,
      "ad_hc_execute_failure_count": 0,
      "model_count": 11,
      "ad_execute_failure_count": 0,
      "ad_batch_task_failure_count": 0,
      "ad_total_batch_task_execution_count": 14,
      "ad_executing_batch_task_count": 3
    },
    "2hEGbUw6ShaiKe05n_xLdA": {
      "ad_execute_request_count": 5,
      "models": [
        {
          "detector_id": "rlDtOHwBD5tpxlbyW7Nt",
          "model_type": "entity",
          "last_used_time": 1633044152714,
          "model_id": "rlDtOHwBD5tpxlbyW7Nt_entity_error5",
          "last_checkpoint_time": 1633043256689,
          "entity": [
            {
              "name": "type",
              "value": "error5"
            }
          ]
        },
        {
          "detector_id": "rlDtOHwBD5tpxlbyW7Nt",
          "model_type": "entity",
          "last_used_time": 1633044152720,
          "model_id": "rlDtOHwBD5tpxlbyW7Nt_entity_error15",
          "last_checkpoint_time": 1633043553786,
          "entity": [
            {
              "name": "type",
              "value": "error15"
            }
          ]
        },
        {
          "detector_id": "rlDtOHwBD5tpxlbyW7Nt",
          "model_type": "entity",
          "last_used_time": 1633044152724,
          "model_id": "rlDtOHwBD5tpxlbyW7Nt_entity_error17",
          "last_checkpoint_time": 1633043554909,
          "entity": [
            {
              "name": "type",
              "value": "error17"
            }
          ]
        },
        {
          "detector_id": "rlDtOHwBD5tpxlbyW7Nt",
          "model_type": "entity",
          "last_used_time": 1633044152751,
          "model_id": "rlDtOHwBD5tpxlbyW7Nt_entity_error27",
          "last_checkpoint_time": 1633043855105,
          "entity": [
            {
              "name": "type",
              "value": "error27"
            }
          ]
        }
      ],
      "ad_canceled_batch_task_count": 0,
      "ad_hc_execute_request_count": 5,
      "ad_hc_execute_failure_count": 0,
      "model_count": 13,
      "ad_execute_failure_count": 0,
      "ad_batch_task_failure_count": 0,
      "ad_total_batch_task_execution_count": 14,
      "ad_executing_batch_task_count": 3
    }
  }
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

#### Sample response

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
      "model_id": "rlDtOHwBD5tpxlbyW7Nt_entity_error20",
      "entity": [
        {
          "name": "type",
          "value": "error20"
        }
      ],
      "model_size_in_bytes": 403491,
      "node_id": "bCtWtxWPThq0BIn5P5I4Xw"
    },
    {
      "model_id": "rlDtOHwBD5tpxlbyW7Nt_entity_error31",
      "entity": [
        {
          "name": "type",
          "value": "error31"
        }
      ],
      "model_size_in_bytes": 403491,
      "node_id": "bCtWtxWPThq0BIn5P5I4Xw"
    },
    {
      "model_id": "rlDtOHwBD5tpxlbyW7Nt_entity_error21",
      "entity": [
        {
          "name": "type",
          "value": "error21"
        }
      ],
      "model_size_in_bytes": 403491,
      "node_id": "bCtWtxWPThq0BIn5P5I4Xw"
    },
    {
      "model_id": "rlDtOHwBD5tpxlbyW7Nt_entity_error13",
      "entity": [
        {
          "name": "type",
          "value": "error13"
        }
      ],
      "model_size_in_bytes": 403491,
      "node_id": "bCtWtxWPThq0BIn5P5I4Xw"
    },
    {
      "model_id": "rlDtOHwBD5tpxlbyW7Nt_entity_error24",
      "entity": [
        {
          "name": "type",
          "value": "error24"
        }
      ],
      "model_size_in_bytes": 403491,
      "node_id": "bCtWtxWPThq0BIn5P5I4Xw"
    },
    {
      "model_id": "rlDtOHwBD5tpxlbyW7Nt_entity_error25",
      "entity": [
        {
          "name": "type",
          "value": "error25"
        }
      ],
      "model_size_in_bytes": 403491,
      "node_id": "bCtWtxWPThq0BIn5P5I4Xw"
    },
    {
      "model_id": "rlDtOHwBD5tpxlbyW7Nt_entity_error28",
      "entity": [
        {
          "name": "type",
          "value": "error28"
        }
      ],
      "model_size_in_bytes": 403491,
      "node_id": "bCtWtxWPThq0BIn5P5I4Xw"
    },
    {
      "model_id": "rlDtOHwBD5tpxlbyW7Nt_entity_error16",
      "entity": [
        {
          "name": "type",
          "value": "error16"
        }
      ],
      "model_size_in_bytes": 403491,
      "node_id": "bCtWtxWPThq0BIn5P5I4Xw"
    },
    {
      "model_id": "rlDtOHwBD5tpxlbyW7Nt_entity_error3",
      "entity": [
        {
          "name": "type",
          "value": "error3"
        }
      ],
      "model_size_in_bytes": 403491,
      "node_id": "dIyavWhmSYWGz65b4u-lpQ"
    },
    {
      "model_id": "rlDtOHwBD5tpxlbyW7Nt_entity_error27",
      "entity": [
        {
          "name": "type",
          "value": "error27"
        }
      ],
      "model_size_in_bytes": 403491,
      "node_id": "2hEGbUw6ShaiKe05n_xLdA"
    }
  ],
  "total_size_in_bytes": 12911712,
  "init_progress": {
    "percentage": "100%"
  },
  "total_entities": 33,
  "active_entities": 32,
  "ad_task": {
    "ad_task": {
      "task_id": "Os4HOXwBCi2h__AONgpc",
      "last_update_time": 1633044347855,
      "started_by": "admin",
      "state": "RUNNING",
      "detector_id": "rlDtOHwBD5tpxlbyW7Nt",
      "task_progress": 0,
      "init_progress": 0,
      "execution_start_time": 1633044346460,
      "is_latest": true,
      "task_type": "HISTORICAL_HC_DETECTOR",
      "coordinating_node": "2hEGbUw6ShaiKe05n_xLdA",
      "detector": {
        "name": "test-detector",
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
            "feature_id": "7VDtOHwBD5tpxlbyWqPs",
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
        "last_update_time": 1633042652012,
        "category_field": [
          "type"
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
          "user_requested_tenant": null
        },
        "detector_type": "MULTI_ENTITY"
      },
      "detection_date_range": {
        "start_time": 1632437820000,
        "end_time": 1633042620000
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
    "node_id": "2hEGbUw6ShaiKe05n_xLdA",
    "task_id": "Os4HOXwBCi2h__AONgpc",
    "task_type": "HISTORICAL_HC_DETECTOR",
    "detector_task_slots": 10,
    "total_entities_count": 32,
    "pending_entities_count": 22,
    "running_entities_count": 10,
    "running_entities": [
      "error9",
      "error8",
      "error7",
      "error6",
      "error5",
      "error4",
      "error32",
      "error31",
      "error30",
      "error3"
    ],
    "entity_task_profiles": [
      {
        "shingle_size": 8,
        "rcf_total_updates": 994,
        "threshold_model_trained": true,
        "threshold_model_training_data_size": 0,
        "model_size_in_bytes": 1593240,
        "node_id": "bCtWtxWPThq0BIn5P5I4Xw",
        "entity": [
          {
            "name": "type",
            "value": "error6"
          }
        ],
        "task_id": "P84HOXwBCi2h__AOOgrC",
        "task_type": "HISTORICAL_HC_ENTITY"
      },
      {
        "shingle_size": 8,
        "rcf_total_updates": 994,
        "threshold_model_trained": true,
        "threshold_model_training_data_size": 0,
        "model_size_in_bytes": 1593240,
        "node_id": "dIyavWhmSYWGz65b4u-lpQ",
        "entity": [
          {
            "name": "type",
            "value": "error4"
          }
        ],
        "task_id": "Kc4HOXwBCi2h__AOOw6Y",
        "task_type": "HISTORICAL_HC_ENTITY"
      },
      {
        "shingle_size": 8,
        "rcf_total_updates": 994,
        "threshold_model_trained": true,
        "threshold_model_training_data_size": 0,
        "model_size_in_bytes": 1593240,
        "node_id": "dIyavWhmSYWGz65b4u-lpQ",
        "entity": [
          {
            "name": "type",
            "value": "error8"
          }
        ],
        "task_id": "Pc4HOXwBCi2h__AOOgqJ",
        "task_type": "HISTORICAL_HC_ENTITY"
      },
      {
        "shingle_size": 8,
        "rcf_total_updates": 994,
        "threshold_model_trained": true,
        "threshold_model_training_data_size": 0,
        "model_size_in_bytes": 1593240,
        "node_id": "2hEGbUw6ShaiKe05n_xLdA",
        "entity": [
          {
            "name": "type",
            "value": "error7"
          }
        ],
        "task_id": "Ps4HOXwBCi2h__AOOgqh",
        "task_type": "HISTORICAL_HC_ENTITY"
      }
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

The `model_count` parameter shows the total number of models that a detector runs in memory. This is useful if you have several models running on your cluster and want to know the count.

If you configured the category field, you can see the number of unique values in the field and all active entities with models running in memory.

You can use this data to estimate how much memory is required for anomaly detection so you can decide how to size your cluster. For example, if a detector has one million entities and only 10 of them are active in memory, you need to scale your cluster up or out.

#### Request

```json
GET _plugins/_anomaly_detection/detectors/<detectorId>/_profile?_all=true&pretty
{
  "state": "RUNNING",
  "error": "",
  "models": [
    {
      "model_id": "rlDtOHwBD5tpxlbyW7Nt_entity_error20",
      "entity": [
        {
          "name": "type",
          "value": "error20"
        }
      ],
      "model_size_in_bytes": 403491,
      "node_id": "bCtWtxWPThq0BIn5P5I4Xw"
    },
    {
      "model_id": "rlDtOHwBD5tpxlbyW7Nt_entity_error13",
      "entity": [
        {
          "name": "type",
          "value": "error13"
        }
      ],
      "model_size_in_bytes": 403491,
      "node_id": "bCtWtxWPThq0BIn5P5I4Xw"
    },
    {
      "model_id": "rlDtOHwBD5tpxlbyW7Nt_entity_error27",
      "entity": [
        {
          "name": "type",
          "value": "error27"
        }
      ],
      "model_size_in_bytes": 403491,
      "node_id": "2hEGbUw6ShaiKe05n_xLdA"
    }
  ],
  "total_size_in_bytes": 12911712,
  "init_progress": {
    "percentage": "100%"
  },
  "total_entities": 33,
  "active_entities": 32,
  "ad_task": {
    "ad_task": {
      "task_id": "Os4HOXwBCi2h__AONgpc",
      "last_update_time": 1633044347855,
      "started_by": "admin",
      "state": "RUNNING",
      "detector_id": "rlDtOHwBD5tpxlbyW7Nt",
      "task_progress": 0,
      "init_progress": 0,
      "execution_start_time": 1633044346460,
      "is_latest": true,
      "task_type": "HISTORICAL_HC_DETECTOR",
      "coordinating_node": "2hEGbUw6ShaiKe05n_xLdA",
      "detector": {
        "name": "test-detector",
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
            "feature_id": "7VDtOHwBD5tpxlbyWqPs",
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
        "last_update_time": 1633042652012,
        "category_field": [
          "type"
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
          "user_requested_tenant": null
        },
        "detector_type": "MULTI_ENTITY"
      },
      "detection_date_range": {
        "start_time": 1632437820000,
        "end_time": 1633042620000
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
    "node_id": "2hEGbUw6ShaiKe05n_xLdA",
    "task_id": "Os4HOXwBCi2h__AONgpc",
    "task_type": "HISTORICAL_HC_DETECTOR",
    "detector_task_slots": 10,
    "total_entities_count": 32,
    "pending_entities_count": 22,
    "running_entities_count": 10,
    "running_entities": [
      "error9",
      "error8",
      "error7",
      "error6",
      "error5",
      "error4",
      "error32",
      "error31",
      "error30",
      "error3"
    ],
    "entity_task_profiles": [
      {
        "shingle_size": 8,
        "rcf_total_updates": 994,
        "threshold_model_trained": true,
        "threshold_model_training_data_size": 0,
        "model_size_in_bytes": 1593240,
        "node_id": "bCtWtxWPThq0BIn5P5I4Xw",
        "entity": [
          {
            "name": "type",
            "value": "error6"
          }
        ],
        "task_id": "P84HOXwBCi2h__AOOgrC",
        "task_type": "HISTORICAL_HC_ENTITY"
      },
      {
        "shingle_size": 8,
        "rcf_total_updates": 994,
        "threshold_model_trained": true,
        "threshold_model_training_data_size": 0,
        "model_size_in_bytes": 1593240,
        "node_id": "bCtWtxWPThq0BIn5P5I4Xw",
        "entity": [
          {
            "name": "type",
            "value": "error5"
          }
        ],
        "task_id": "QM4HOXwBCi2h__AOOgre",
        "task_type": "HISTORICAL_HC_ENTITY"
      },
      {
        "shingle_size": 8,
        "rcf_total_updates": 994,
        "threshold_model_trained": true,
        "threshold_model_training_data_size": 0,
        "model_size_in_bytes": 1593240,
        "node_id": "bCtWtxWPThq0BIn5P5I4Xw",
        "entity": [
          {
            "name": "type",
            "value": "error9"
          }
        ],
        "task_id": "PM4HOXwBCi2h__AOOgp3",
        "task_type": "HISTORICAL_HC_ENTITY"
      },
      {
        "shingle_size": 8,
        "rcf_total_updates": 994,
        "threshold_model_trained": true,
        "threshold_model_training_data_size": 0,
        "model_size_in_bytes": 1593240,
        "node_id": "2hEGbUw6ShaiKe05n_xLdA",
        "entity": [
          {
            "name": "type",
            "value": "error3"
          }
        ],
        "task_id": "Fs4HOXwBCi2h__AOPBLH",
        "task_type": "HISTORICAL_HC_ENTITY"
      },
      {
        "shingle_size": 8,
        "rcf_total_updates": 994,
        "threshold_model_trained": true,
        "threshold_model_training_data_size": 0,
        "model_size_in_bytes": 1593240,
        "node_id": "2hEGbUw6ShaiKe05n_xLdA",
        "entity": [
          {
            "name": "type",
            "value": "error32"
          }
        ],
        "task_id": "Ks4HOXwBCi2h__AOOw7D",
        "task_type": "HISTORICAL_HC_ENTITY"
      },
      {
        "shingle_size": 8,
        "rcf_total_updates": 994,
        "threshold_model_trained": true,
        "threshold_model_training_data_size": 0,
        "model_size_in_bytes": 1593240,
        "node_id": "2hEGbUw6ShaiKe05n_xLdA",
        "entity": [
          {
            "name": "type",
            "value": "error7"
          }
        ],
        "task_id": "Ps4HOXwBCi2h__AOOgqh",
        "task_type": "HISTORICAL_HC_ENTITY"
      }
    ]
  },
  "model_count": 32
}
```

For a single-entity detector:

#### Sample response

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

Getting the total count of entities is an expensive operation for a detector with more than one category field. By default, a real-time detector counts the number of entities up to a value of 10,000 and historical analysis counts the number of entities up to a value of 1,000.

The `profile` operation also provides information about each entity, such as the entity’s `last_sample_timestamp` and `last_active_timestamp`. `last_sample_timestamp` shows the last document in the input data source index containing the entity, while `last_active_timestamp` shows the timestamp when the entity’s model was last seen in the model cache.

If there are no anomaly results for an entity, either the entity doesn't have any sample data or its model is removed from the model cache.


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
  "category_field": "host",
  "value": "i-00f28ec1eb8997686",
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

To get profile information for only historical analysis, specify `ad_task`:

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
      "task_id": "JXxyG3YBv5IHYYfMlFS2",
      "last_update_time": 1606778263543,
      "state": "STOPPED",
      "detector_id": "SwvxCHYBPhugfWD9QAL6",
      "task_progress": 0.010480972,
      "init_progress": 1,
      "current_piece": 1578140400000,
      "execution_start_time": 1606778262709,
      "is_latest": true,
      "task_type": "HISTORICAL",
      "detector": {
        "name": "historical_test1",
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
            "feature_id": "zgvyCHYBPhugfWD9Ap_F",
            "feature_name": "sum",
            "feature_enabled": true,
            "aggregation_query": {
              "sum": {
                "sum": {
                  "field": "value"
                }
              }
            }
          },
          {
            "feature_id": "zwvyCHYBPhugfWD9Ap_G",
            "feature_name": "max",
            "feature_enabled": true,
            "aggregation_query": {
              "max": {
                "max": {
                  "field": "value"
                }
              }
            }
          }
        ],
        "ui_metadata": {
          "features": {
            "max": {
              "aggregationBy": "max",
              "aggregationOf": "value",
              "featureType": "simple_aggs"
            },
            "sum": {
              "aggregationBy": "sum",
              "aggregationOf": "value",
              "featureType": "simple_aggs"
            }
          },
          "filters": [],
          "filterType": "simple_filter"
        },
        "last_update_time": 1606467935713,
        "detector_type": "HISTORICAL_SIGLE_ENTITY",
        "detection_date_range": {
          "start_time": 1577840400000,
          "end_time": 1606463775000
        }
      }
    },
    "shingle_size": 8,
    "rcf_total_updates": 1994,
    "threshold_model_trained": true,
    "threshold_model_training_data_size": 0,
    "node_id": "Q9yznwxvTz-yJxtz7rJlLg"
  }
}
```

---
