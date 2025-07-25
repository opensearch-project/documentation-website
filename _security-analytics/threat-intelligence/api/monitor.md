---
layout: default
title: Monitor API
parent: Threat intelligence APIs
grand_parent: Threat intelligence
nav_order: 35
canonical_url: https://docs.opensearch.org/latest/security-analytics/threat-intelligence/api/monitor/
---

# Monitor API

You can use the threat intelligence Monitor API to create, search, and update [monitors](https://docs.opensearch.org/latest/observing-your-data/alerting/monitors/) for your threat intelligence feeds.


---
## Create or update a threat intelligence monitor

Creates or updates a threat intelligence monitor.

### Path and HTTP methods

The `POST` method creates a new monitor. The `PUT` method updates a monitor.

```json
POST _plugins/_security_analytics/threat_intel/monitors
PUT _plugins/_security_analytics/threat_intel/monitors/<monitor_id>
```

### Request fields

You can specify the following fields in the request body.

| Field  | Type | Description  |
| :--- |  :---  | :--- |
| `name`  | String  | The name of the monitor. Required. |
| `schedule`  | Object  | The schedule that determines how often the monitor runs. Required.  |
| `schedule.period` | Object  | Information about the frequency of the schedule. Required.  |
| `schedule.period.interval`   | Integer | The interval at which the monitor runs. Required.   |
| `schedule.period.unit`   | String  | The unit of time for the interval.  |
| `enabled` | Object  | Information about the user who created the monitor. Required.    |
| `user.backend_roles`   | Array   | The backend roles associated with the user. Optional.  |
| `user.roles`   | Array   | The roles associated with the user. Optional. |
| `user.custom_attribute_names`   | Array   | Custom attribute names associated with the user. Optional.   |
| `user.user_requested_tenant`   | String  | The tenant requested by the user. Optional.   |
| `indices`   | Array   | The log data sources used for the monitor. Required.  |
| `per_ioc_type_scan_input_list`  | Array   | A list of inputs to scan based on the indicator of compromise (IOC) types. Required.   |
| `per_ioc_type_scan_input_list.ioc_type`   | String  | The type of IOC (for example, hashes). Required.  |
| `per_ioc_type_scan_input_list.index_to_fields_map`  | Object  |The index field mappings that contain values for the given IOC type. Required. |
| `per_ioc_type_scan_input_list.index_to_fields_map.<index>` | Array   | A list of fields contained in the specified index. Required.   |
| `triggers`  | Array   | The trigger settings for alerts. Required.   |
| `triggers.data_sources`   | Array   | A list of data sources associated with the trigger. Required.  |
| `triggers.name`  | String  | The name of the trigger. Required.  |
| `triggers.severity`  | String  | The severity level of the trigger (for example, high, medium, or low). Required.  |

### Example requests

The following section provides example requests for the Monitor API.


#### Create a monitor

```json
{
    "name": "Threat intel monitor",
    "schedule": {
        "period": {
            "interval": 1,
            "unit": "MINUTES"
        }
    },
    "enabled": false,
    "user": {
        "name": "",
        "backend_roles": [],
        "roles": [],
        "custom_attribute_names": [],
        "user_requested_tenant": null
    },
    "indices": [
        "windows"
    ],
    "per_ioc_type_scan_input_list": [
        {
            "ioc_type": "hashes",
            "index_to_fields_map": {
                "windows": [
                    "file_hash"
                ]
            }
        }
    ],
  "triggers": [
        {
            "data_sources": [
                "windows",
                "random"
            ],
            "name": "regwarg",
            "severity": "high"
        }
    ]
}
```

### Update a monitor

```json
{
    "name": "Threat intel monitor",
    "schedule": {
        "period": {
            "interval": 1,
            "unit": "MINUTES"
        }
    },
    "enabled": false,
    "user": {
        "name": "",
        "backend_roles": [],
        "roles": [],
        "custom_attribute_names": [],
        "user_requested_tenant": null
    },
    "indices": [
        "windows"
    ],
    "per_ioc_type_scan_input_list": [
        {
            "ioc_type": "hashes",
            "index_to_fields_map": {
                "windows": [
                    "file_hash"
                ]
            }
        }
    ],
  "triggers": [
        {
            "data_sources": [
                "windows",
                "random"
            ],
            "name": "regwarg",
            "severity": "high"
        }
    ]
}
```


### Example response

```json
{
    "id": "B8p88ZAB1vBjq44wkjEy",
    "name": 1,
    "seq_no": 0,
    "primary_term": 1,
    "monitor": {
        "id": "B8p88ZAB1vBjq44wkjEy",
        "name": "Threat intel monitor",
        "per_ioc_type_scan_input_list": [
            {
                "ioc_type": "hashes",
                "index_to_fields_map": {
                    "windows": [
                        "file_hash"
                    ]
                }
            }
        ],
        "schedule": {
            "period": {
                "interval": 1,
                "unit": "MINUTES"
            }
        },
        "enabled": false,
        "user": {
            "name": "",
            "backend_roles": [],
            "roles": [],
            "custom_attribute_names": [],
            "user_requested_tenant": null
        },
        "indices": [
            "windows"
        ],
        "triggers": [
            {
                "data_sources": [
                    "windows",
                    "random"
                ],
                "ioc_types": [],
                "actions": [],
                "id": "afdd80cc-a669-4487-98a0-d84bea8e1e39",
                "name": "regwarg",
                "severity": "high"
            }
        ]
    }
}
```
---

## Delete a monitor

Deletes an existing threat intelligence monitor.

### Path and HTTP methods

```json
DELETE /_plugins/_security_analytics/threat_intel/monitors/<monitor_id>
```

### Example request

```json
DELETE /_plugins/_security_analytics/threat_intel/monitors/B8p88ZAB1vBjq44wkjEy
```
{% include copy-curl.html %}

### Example response

```json
{
  "_id" : "B8p88ZAB1vBjq44wkjEy",
  "_version" : 1
}
```

## Search for a monitor

Searches for an existing monitor using a query. The request body expects a search query. For query options, see [Query DSL]({{site.url}}{{site.baseurl}}/query-dsl/).
 
### Example request

The following example request using a match query with the monitor's ID to search for the monitor:

```json
POST /_plugins/_security_analytics/detectors/_search
{
    "query": {
        "match": {
            "_id": "HMqq_5AB1vBjq44wpTIN"
        }
    }
}
```
{% include copy-curl.html %}

### Example response

```json
{
  "took": 11,
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
    "max_score": 2.0,
    "hits": [
      {
        "_index": ".opendistro-alerting-config",
        "_id": "HMqq_5AB1vBjq44wpTIN",
        "_version": 1,
        "_seq_no": 8,
        "_primary_term": 1,
        "_score": 2.0,
        "_source": {
          "id": "HMqq_5AB1vBjq44wpTIN",
          "name": "Threat intel monitor",
          "per_ioc_type_scan_input_list": [
            {
              "ioc_type": "hashes",
              "index_to_fields_map": {
                "windows": [
                  "file_hash"
                ]
              }
            }
          ],
          "schedule": {
            "period": {
              "interval": 1,
              "unit": "MINUTES"
            }
          },
          "enabled": false,
          "user": {
            "name": "",
            "backend_roles": [],
            "roles": [],
            "custom_attribute_names": [],
            "user_requested_tenant": null
          },
          "indices": [
            "windows"
          ],
          "triggers": [
            {
              "data_sources": [
                "windows",
                "random"
              ],
              "ioc_types": [],
              "actions": [],
              "id": "63426758-c82d-4c87-a52c-f86ee6a8a06d",
              "name": "regwarg",
              "severity": "high"
            }
          ]
        }
      }
    ]
  }
}
```