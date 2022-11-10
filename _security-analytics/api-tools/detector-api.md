---
layout: default
title: Management APIs
parent: API tools
nav_order: 35
---

# Detector APIs

The following APIs can be used for a number of tasks related to detectors, from creating detectors to updating and searching for detectors.

## Create detector

Creates a new detector.

```json
POST _plugins/_security_analytics/detectors
```

## Sample request

```json
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
            "source": "Hello World",
            "lang": "mustache"
          },
          "name": "hello_world",
          "throttle_enabled": false,
          "message_template": {
            "source": "Hello World",
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

## Sample response

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
                            "source": "Hello World",
                            "lang": "mustache"
                        },
                        "throttle_enabled": false,
                        "subject_template": {
                            "source": "Hello World",
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

### Parameters

You can specify the following parameters when creating a detector.

Parameter | Type | Description 
:--- | :--- |:--- |:--- |
`enabled` | Boolean | Enables the ability to add detectors through the API.
`type` | String | The type is specified as "detector".
`name` | String | Name of the detector.
`detector_type` | Object | The log type that defines the detector.
`schedule`<br>&nbsp;&nbsp;&nbsp;&nbsp;`period` | Object | the frequency at which the detector runs in repetition.
`schedule`<br>&nbsp;&nbsp;&nbsp;&nbsp;`period`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`interval` | Integer | The duration of the period expressed as a number.
`schedule`<br>&nbsp;&nbsp;&nbsp;&nbsp;`period`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`unit` | String | The unit of measure for the interval.
`inputs` | Object | TBD
`inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;`detector_inputs` | Object | TBD
`inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;`detector_inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`description` | String | TBD
`inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;`detector_inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`custom_rules` | Object | TBD
`inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;`detector_inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`custom_rules` | Object | TBD
`inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;`detector_inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`custom_rules` | Object | TBD
`inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;`detector_inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`custom_rules`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`id` | String | TBD
`inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;`detector_inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`indices` | String | TBD
`inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;`detector_inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`pre_packaged_rules` | Object | TBD
`inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;`detector_inputs`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`pre_packaged_rules`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`id` | String | TBD
`triggers` | Object | TBD
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`ids` | String | TBD
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`types` | String | TBD
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`tags` | String | TBD
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`id` | String | TBD
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`sev_levels` | String | TBD
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`name` | String | TBD
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`severity` | Integer | TBD
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`actions` | Integer | TBD
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`actions`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`id` | Integer | TBD
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`actions`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`destination_id` | Integer | TBD
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`actions`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`subject_template` | Object | TBD
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`actions`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`subject_template`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`source` | String | TBD
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`actions`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`subject_template`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`lang` | String | TBD
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`actions`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`name` | String | TBD
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`actions`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`throttle_enabled` | Boolean | TBD
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`actions`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`message_template` | String | TBD
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`actions`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`message_template`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`source` | String | TBD
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`actions`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`message_template`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`lang` | String | TBD
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`actions`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`throttle` | Object | TBD
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`actions`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`throttle`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`unit` | String | TBD
`triggers`<br>&nbsp;&nbsp;&nbsp;&nbsp;`actions`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`throttle`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`value` | Integer | TBD



## Update detector

## Delete detector

## Get detector

## Search detector






