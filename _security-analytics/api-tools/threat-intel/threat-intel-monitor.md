---
layout: default
title: Threat Intelligence Monitor APIs
parent: API tools
nav_order: 35
---

# Threat Intelligence Monitor APIs

The following APIs can be used for a number of tasks related to threat intelligence monitors, from creating monitors to updating and searching for monitors. Many API calls use the monitor ID in the request, which can be retrieved using the [Search Threat Intelligence Monitor API](#search-threat-intelligence-monitor-api).

---
## Create Threat Intelligence Monitor API

Creates a new Threat Intelligence Monitor

```
POST _plugins/_security_analytics/threat_intel/monitors
```

### Request fields
You can specify the following fields when creating a threat intelligence monitor

| Field                                                      | Type    | Description                                                                           |
|:-----------------------------------------------------------|:--------|:--------------------------------------------------------------------------------------|
| `name`                                                     | String  | Name of the monitor. Required.                                                        |
| `schedule`                                                 | Object  | The schedule that determines how often the monitor runs. Required.                    |
| `schedule.period`                                          | Object  | Details for the frequency of the schedule. Required.                                  |
| `schedule.period.interval`                                 | Integer | The interval at which the monitor runs. Required.                                     |
| `schedule.period.unit`                                     | String  | The interval's unit of time. Required.                                                |
| `enabled`                                                  | Boolean | Sets the monitor as either active (true) or inactive (false). Required.               |
| `user`                                                     | Object  | Details about the user who created the monitor. Required.                             |
| `user.name`                                                | String  | The name of the user. Optional.                                                       |
| `user.backend_roles`                                       | Array   | Backend roles associated with the user. Optional.                                     |
| `user.roles`                                               | Array   | Roles associated with the user. Optional.                                             |
| `user.custom_attribute_names`                              | Array   | Custom attribute names associated with the user. Optional.                            |
| `user.user_requested_tenant`                               | String  | The tenant requested by the user. Optional.                                           |
| `indices`                                                  | Array   | The log data sources used for the monitor. Required.                                  |
| `per_ioc_type_scan_input_list`                             | Array   | List of inputs for scanning based on indicator of compromise (IOC) types. Required.   |
| `per_ioc_type_scan_input_list.ioc_type`                    | String  | The type of IOC (e.g., hashes). Required.                                             |
| `per_ioc_type_scan_input_list.index_to_fields_map`         | Object  | Mapping of indexes to its fields that contain values of the given ioc type. Required. |
| `per_ioc_type_scan_input_list.index_to_fields_map.<index>` | Array   | List of fields in the specified index. Required.                                      |
| `triggers`                                                 | Array   | Trigger settings for alerts. Required.                                                |
| `triggers.data_sources`                                    | Array   | List of data sources associated with the trigger. Required.                           |
| `triggers.name`                                            | String  | Name of the trigger. Required.                                                        |
| `triggers.severity`                                        | String  | Severity level of the trigger (e.g., high, medium, low). Required.                    |

### Example Request
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
## Update Threat Intelligence Monitor API

Updates the definition of an existing Threat Intelligence Monitor by monitor ID.

```
PUT _plugins/_security_analytics/threat_intel/monitors/<monitor_id>
```

### Request fields
You can specify the following fields when creating a threat intelligence monitor

| Field                                                      | Type    | Description                                                                           |
|:-----------------------------------------------------------|:--------|:--------------------------------------------------------------------------------------|
| `name`                                                     | String  | Name of the monitor. Required.                                                        |
| `name`                                                     | String  | Name of the monitor. Required.                                                        |
| `schedule`                                                 | Object  | The schedule that determines how often the monitor runs. Required.                    |
| `schedule.period`                                          | Object  | Details for the frequency of the schedule. Required.                                  |
| `schedule.period.interval`                                 | Integer | The interval at which the monitor runs. Required.                                     |
| `schedule.period.unit`                                     | String  | The interval's unit of time. Required.                                                |
| `enabled`                                                  | Boolean | Sets the monitor as either active (true) or inactive (false). Required.               |
| `user`                                                     | Object  | Details about the user who created the monitor. Required.                             |
| `user.name`                                                | String  | The name of the user. Optional.                                                       |
| `user.backend_roles`                                       | Array   | Backend roles associated with the user. Optional.                                     |
| `user.roles`                                               | Array   | Roles associated with the user. Optional.                                             |
| `user.custom_attribute_names`                              | Array   | Custom attribute names associated with the user. Optional.                            |
| `user.user_requested_tenant`                               | String  | The tenant requested by the user. Optional.                                           |
| `indices`                                                  | Array   | The log data sources used for the monitor. Required.                                  |
| `per_ioc_type_scan_input_list`                             | Array   | List of inputs for scanning based on indicator of compromise (IOC) types. Required.   |
| `per_ioc_type_scan_input_list.ioc_type`                    | String  | The type of IOC (e.g., hashes). Required.                                             |
| `per_ioc_type_scan_input_list.index_to_fields_map`         | Object  | Mapping of indexes to its fields that contain values of the given ioc type. Required. |
| `per_ioc_type_scan_input_list.index_to_fields_map.<index>` | Array   | List of fields in the specified index. Required.                                      |
| `triggers`                                                 | Array   | Trigger settings for alerts. Required.                                                |
| `triggers.data_sources`                                    | Array   | List of data sources associated with the trigger. Required.                           |
| `triggers.name`                                            | String  | Name of the trigger. Required.                                                        |
| `triggers.severity`                                        | String  | Severity level of the trigger (e.g., high, medium, low). Required.                    |

### Example Request
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
## Delete Threat Intelligence Monitor API

This API uses the monitor ID to specify and delete a threat intelligence monitor.

### Path and HTTP methods

```
DELETE /_plugins/_security_analytics/threat_intel/monitors/<monitor_id>
```

### Example request

```
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
## Search Threat Intelligence Monitor API

The Search Threat Intelligence Monitor API searches for monitors by monitor ID, name or any other parameter present in monitor response.

### Example request

**Detector ID**
```
POST /_plugins/_security_analytics/detectors/_search
```
```json
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