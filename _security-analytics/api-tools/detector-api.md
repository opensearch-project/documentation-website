---
layout: default
title: Detector APIs
parent: API tools
nav_order: 35
---

# Detector APIs

The following APIs can be used for a number of tasks related to detectors, from creating detectors to updating and searching for detectors.

## Create Detector

Creates a new detector.

```json
POST _plugins/_security_analytics/detectors
```

### Request fields

You can specify the following fields when creating a detector.

Field | Type | Description
:--- | :--- |:--- |:--- |
`enabled` | Boolean | Enables the ability to add detectors through the API.
`type` | String | The type is specified as "detector".
`name` | String | Name of the detector.
`detector_type` | Object | The log type that defines the detector.
`schedule`| Object | the schedule that determines how often the detector runs.
`schedule`<br>&nbsp;&nbsp;&nbsp;&nbsp;`period` | Object | the frequency at which the detector runs in repetition.
`schedule`<br>&nbsp;&nbsp;&nbsp;&nbsp;`period`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`interval` | Integer | The duration of the period expressed as a number.
`schedule`<br>&nbsp;&nbsp;&nbsp;&nbsp;`period`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`unit` | String | The unit of measure for the interval.
`inputs` | Object | In process
`inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;`detector_inputs` | Object | In process
`inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;`detector_inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`description` | String | In process
`inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;`detector_inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`custom_rules` | Object | In process
`inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;`detector_inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`custom_rules`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`id` | String | In process
`inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;`detector_inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`indices` | String | In process
`inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;`detector_inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`pre_packaged_rules` | Object | In process
`inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;`detector_inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`pre_packaged_rules`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`id` | String | The rule ID for pre-packaged rules.
`triggers` | Object | In process
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`ids` | String | In process
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`types` | String | In process
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`tags` | String | In process
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`id` | String | In process
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`sev_levels` | String | In process
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`name` | String | In process
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`severity` | Integer | In process
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`actions` | Integer | In process
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`actions`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`id` | Integer | In process
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`actions`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`destination_id` | Integer | In process
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`actions`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`subject_template` | Object | In process
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`actions`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`subject_template`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`source` | String | In process
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`actions`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`subject_template`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`lang` | String | In process
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`actions`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`name` | String | In process
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`actions`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`throttle_enabled` | Boolean | In process
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`actions`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`message_template` | String | In process
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`actions`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`message_template`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`source` | String | In process
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`actions`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`message_template`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`lang` | String | In process
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`actions`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`throttle` | Object | In process
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`actions`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`throttle`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`unit` | String | In process
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`actions`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`throttle`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`value` | Integer | In process

### Sample request

```json
POST _plugins/_security_analytics/detectors
{
  "enabled": true,
  "schedule": {
    "period": {
      "interval": 1,
      "unit": "MINUTES"
    }
  },
  "detector_type": "WINDOWS",
  "type": "detector",
  "inputs": [
    {
      "detector_input": {
        "description": "windows detector for security analytics",
        "custom_rules": [
          {
            "id": "bc2RB4QBrbtylUb_1Pbm"
          }
        ],
        "indices": [
          "windows"
        ],
        "pre_packaged_rules": [
          {
            "id": "06724a9a-52fc-11ed-bdc3-0242ac120002"
          }
        ]
      }
    }
  ],
  "triggers": [
    {
      "ids": [
        "06724a9a-52fc-11ed-bdc3-0242ac120002"
      ],
      "types": [],
      "tags": [
        "attack.defense_evasion"
      ],
      "severity": "1",
      "actions": [{
          "id": "hVTLkZYzlA",
          "destination_id": "6r8ZBoQBKW_6dKriacQb",
          "subject_template": {
            "source": "Trigger: {{ctx.trigger.name}}",
            "lang": "mustache"
          },
          "name": "hello_world",
          "throttle_enabled": false,
          "message_template": {
            "source": "Detector {{ctx.detector.name}} just entered alert status. Please investigate the issue." +
						"- Trigger: {{ctx.trigger.name}}" +
						"- Severity: {{ctx.trigger.severity}}",
            "lang": "mustache"
          },
          "throttle": {
            "unit": "MINUTES",
            "value": 108
          }
        }
      ],
      "id": "8qhrBoQBYK1JzUUDzH-N",
      "sev_levels": [],
      "name": "test-trigger"
    }
  ],
  "name": "nbReFCjlfn"
}
```

### Sample response

```json
{
    "_id": "dc2VB4QBrbtylUb_Hfa3",
    "_version": 1,
    "detector": {
        "name": "nbReFCjlfn",
        "detector_type": "windows",
        "enabled": true,
        "schedule": {
            "period": {
                "interval": 1,
                "unit": "MINUTES"
            }
        },
        "inputs": [
            {
                "detector_input": {
                    "description": "windows detector for security analytics",
                    "indices": [
                        "windows"
                    ],
                    "custom_rules": [
                        {
                            "id": "bc2RB4QBrbtylUb_1Pbm"
                        }
                    ],
                    "pre_packaged_rules": [
                        {
                            "id": "06724a9a-52fc-11ed-bdc3-0242ac120002"
                        }
                    ]
                }
            }
        ],
        "triggers": [
            {
                "id": "8qhrBoQBYK1JzUUDzH-N",
                "name": "test-trigger",
                "severity": "1",
                "types": [],
                "ids": [
                    "06724a9a-52fc-11ed-bdc3-0242ac120002"
                ],
                "sev_levels": [],
                "tags": [
                    "attack.defense_evasion"
                ],
                "actions": [
                    {
                        "id": "hVTLkZYzlA",
                        "name": "hello_world",
                        "destination_id": "6r8ZBoQBKW_6dKriacQb",
                        "message_template": {
                            "source": "Trigger: {{ctx.trigger.name}}",
                            "lang": "mustache"
                        },
                        "throttle_enabled": false,
                        "subject_template": {
                            "source": "Detector {{ctx.detector.name}} just entered alert status. Please investigate the issue." +
										"- Trigger: {{ctx.trigger.name}}" +
										"- Severity: {{ctx.trigger.severity}}",
                            "lang": "mustache"
                        },
                        "throttle": {
                            "value": 108,
                            "unit": "MINUTES"
                        }
                    }
                ]
            }
        ],
        "last_update_time": "2022-10-24T01:22:03.738379671Z",
        "enabled_time": "2022-10-24T01:22:03.738376103Z"
    }
}
```

---
## Update Detector

The Update detector API is used for updating a detector.

```json
PUT /_plugins/_security_analytics/detectors/<detector_Id>
```

### Sample request

```json
PUT /_plugins/_security_analytics/detectors/J1RX1IMByX0LvTiGTddR
{
  "type": "detector",
  "detector_type": "windows",
  "name": "windows_detector",
  "enabled": true,
  "createdBy": "chip",
  "schedule": {
    "period": {
      "interval": 1,
      "unit": "MINUTES"
    }
  },
  "inputs": [
    {
      "input": {
        "description": "windows detector for security analytics",
        "indices": [
          "windows"
        ],
        "rules": [
          {
            "id": "46"
          }
        ]
      }
    }
  ],
  "triggers": [
    {
      "sev_levels": [],
      "tags": [],
      "actions": [],
      "types": [
        "windows"
      ],
      "name": "test-trigger",
      "id": "fyAy1IMBK2A1DZyOuW_b"
    }
  ]
}
```

### Sample response

```json
{
    "_id": "J1RX1IMByX0LvTiGTddR",
    "_version": 1,
    "detector": {
        "name": "windows_detector",
        "detector_type": "windows",
        "enabled": true,
        "schedule": {
            "period": {
                "interval": 1,
                "unit": "MINUTES"
            }
        },
        "inputs": [
            {
                "detector_input": {
                    "description": "windows detector for security analytics",
                    "indices": [
                        "windows"
                    ],
                    "rules": [
                        {
                            "id": "LFRY1IMByX0LvTiGZtfh"
                        }
                    ]
                }
            }
        ],
        "triggers": [],
        "last_update_time": "2022-10-14T02:36:32.909581688Z",
        "enabled_time": "2022-10-14T02:33:34.197Z"
    }
}
```

---
## Delete Detector

This API is used for deleting a detector.

### Sample request

```json
DELETE /_plugins/_security_analytics/detectors/IJAXz4QBrmVplM4JYxx_
```

### Sample response

```json
{
  "_id" : "IJAXz4QBrmVplM4JYxx_",
  "_version" : 1
}
```

---
## Get Detector

The Get detector API retrieves the detector details. Use the detector ID in the call to fetch detector details.

### Sample request

```json
GET /_plugins/_security_analytics/detectors/MFRg1IMByX0LvTiGHtcN
```

### Sample response

```json
{
    "_id": "MFRg1IMByX0LvTiGHtcN",
    "_version": 1,
    "detector": {
        "name": "windows_detector",
        "detector_type": "windows",
        "enabled": true,
        "schedule": {
            "period": {
                "interval": 1,
                "unit": "MINUTES"
            }
        },
        "inputs": [
            {
                "detector_input": {
                    "description": "windows detector for security analytics",
                    "indices": [
                        "windows"
                    ],
                    "rules": []
                }
            }
        ],
        "last_update_time": "2022-10-14T02:43:11.693Z",
        "enabled_time": "2022-10-14T02:43:11.693Z"
    }
}
```

---
## Search Detector

The Search detector API searches for detector matches by detector ID.

### Sample request

```json
POST /_plugins/_security_analytics/detectors/_search
{
    "query": {
        "match": {
            "_id": "MFRg1IMByX0LvTiGHtcN"
        }
    }
}
```

### Sample response

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
        "max_score": 1.0,
        "hits": [
            {
                "_index": ".opensearch-detectors-config",
                "_id": "MFRg1IMByX0LvTiGHtcN",
                "_version": 1,
                "_seq_no": 6,
                "_primary_term": 1,
                "_score": 1.0,
                "_source": {
                    "type": "detector",
                    "name": "windows_detector",
                    "detector_type": "WINDOWS",
                    "enabled": true,
                    "enabled_time": 1665715391693,
                    "schedule": {
                        "period": {
                            "interval": 1,
                            "unit": "MINUTES"
                        }
                    },
                    "inputs": [
                        {
                            "detector_input": {
                                "description": "windows detector for security analytics",
                                "indices": [
                                    "windows"
                                ],
                                "rules": []
                            }
                        }
                    ],
                    "triggers": [
                        {
                            "id": "fyAy1IMBK2A1DZyOuW_b",
                            "name": "test-trigger",
                            "types": [
                                "windows"
                            ],
                            "sev_levels": [],
                            "tags": [],
                            "actions": []
                        }
                    ],
                    "last_update_time": 1665715391693,
                    "monitor_id": [
                        "LlRf1IMByX0LvTiGzdeX"
                    ]
                }
            }
        ]
    }
}
```

