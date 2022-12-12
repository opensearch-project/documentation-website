---
layout: default
title: Detector APIs
parent: API tools
nav_order: 35
---

# Detector APIs

The following APIs can be used for a number of tasks related to detectors, from creating detectors to updating and searching for detectors.

## Create Detector API

Creates a new detector.

```json
POST _plugins/_security_analytics/detectors
```

### Request fields

You can specify the following fields when creating a detector.

Field | Type | Description
:--- | :--- |:--- |:--- |
`enabled` | Boolean | Sets the detector as either Active (true) or Inactive (false). Default is `true` when a new detector is created.
`name` | String | Name of the detector. Name should only consist of upper and lowercase letters, numbers 0-9, hyphens, spaces, and underscores. Use between 5 and 50 characters. Required.
`detector_type` | String | The log type that defines the detector. Options are `linux`, `network` ,`windows`, `ad_ldap`, `apache_access`, `cloudtrail`, `dns`, and `s3`. Required.
`schedule` | Object | The schedule that determines how often the detector runs. For information on specifying fixed intervals in the API, see [Cron expression reference]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/cron/).
`schedule.period` | Object | Details for the frequency of the schedule.
`schedule.period.interval` | Integer | The interval at which the detector runs.
`schedule.period.unit` | String | The interval's unit of time.
`inputs` | Object | May be left as an empty array, but it must be present in the request payload.
`inputs.detector_input` | Array | An array that contains the indexes and definition used to create the monitor. 
`inputs.detector_input.description` | String | Description of the detector. Optional.
`inputs.detector_input.custom_rules` | Array | Detector inputs for custom rules. Optional if pre-packaged rules are specified.
`inputs.detector_input.custom_rules.id` | String | A valid rule ID for the custom rule. Valid rules are generated as a globally or universally unique identifier (UUID) See [Universally unique identifier](https://en.wikipedia.org/wiki/Universally_unique_identifier) for more information.
`inputs.detector_input.indices` | String | The log data source used for the detector. Required. Only one source allowed at this time. Support for multiple sources will be available in upcoming versions.
`inputs.detector_input.pre_packaged_rules` | Array | Detector inputs for pre-packaged rules (as opposed to custom rules).
`inputs.detector_input.pre_packaged_rules.id` | String | The rule ID for pre-packaged rules. See [Search Pre-Packaged Rules]({{site.url}}{{site.baseurl}}/security-analytics/api-tools/rule-api/#search-pre-packaged-rules) For information on how to use the API to search for rules.
`triggers` | Array | Trigger settings for alerts.
`triggers.ids` | Array | A list of rule IDs that become part of the trigger condition.
`triggers.tags` | Array | Tags are specified in a security rule. Tags can then be selected and applied to the alert trigger to focus generation of alerts. See an example of how tags are used in a Sigma rule in Sigma's [Rule Creation Guide](https://github.com/SigmaHQ/sigma/wiki/Rule-Creation-Guide#tags).
`triggers.id` | String | The unique ID for the trigger. User generated.
`triggers.sev_levels` | Array | Sigma rule severity levels: `informational`; `low`; `medium`; `high`; `criticial`. See [Level](https://github.com/SigmaHQ/sigma/wiki/Rule-Creation-Guide#level) in the Sigma Rule Creation Guide.
`triggers.name` | String | The name of the trigger. Name should only consist of upper and lowercase letters, numbers 0-9, hyphens, spaces, and underscores. Use between 5 and 50 characters. Required.
`triggers.severity` | Integer | Severity level for the trigger expressed as an integer: 5 = lowest; 4 = low; 3 = medium; 2 = high; 1 = highest. Trigger severity is part of the alert definition.
`triggers.actions` | Object | Actions send notifications when trigger conditions are met. Optional, as a notification message is not required as part of an alert.
`triggers.actions.id` | String | Unique ID for the action. User generated.
`triggers.actions.destination_id` | String | Unique ID for the notification destination. User generated. 
`triggers.actions.subject_template` | Object | Contains the information for the subject field of the notification message. Optional.
`triggers.actions.subject_template.source` | String | The subject for the notification message.
`triggers.actions.subject_template.lang` | String | The scripting language used to define the subject. Must be Mustache. See the [Mustache Manual](https://mustache.github.io/mustache.5.html) for more information about templates.
`triggers.actions.name` | String | Name for the trigger alert. Name should only consist of upper and lowercase letters, numbers 0-9, hyphens, spaces, and underscores. Use between 5 and 50 characters.
`triggers.actions.message_template` | String | Contains the information for the body of the notification message. Optional.
`triggers.actions.message_template.source` | String | The body of the notification message.
`triggers.actions.message_template.lang` | String | The scripting language used to define the message. Must be `Mustache`.
`triggers.actions.throttle_enabled` | Boolean | Enables throttling for alert notifications. Optional. Default is `false`.
`triggers.actions.throttle` | Object | Throttling limits the number of notifications you receive within a given span of time.
`triggers.actions.throttle.unit` | String | Unit of time for throttling.
`triggers.actions.throttle.value` | Integer | The value for the unit of time.

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

The Update detector API can be used to update a detector definition. It requires the detector ID to specify the detector.

```json
PUT /_plugins/_security_analytics/detectors/<detector_Id>
```

### Request fields

You can specify the following fields when updating a detector.

Field | Type | Description
:--- | :--- |:--- |:--- |
`detector_type` | String | The log type that defines the detector. Options are `linux`, `network` ,`windows`, `ad_ldap`, `apache_access`, `cloudtrail`, `dns`, and `s3`.
`name` | Boolean | Sets the detector as either Active (true) or Inactive (false).
`enabled` | Boolean | Sets the detector as either Active (true) or Inactive (false).
`schedule.period.interval` | Integer | The interval at which the detector runs.
`schedule.period.unit` | String | The interval's unit of time.
`inputs.input.description` | String | Description of the detector.
`inputs.input.indices` | Array | The log data source used for the detector. Only one source allowed at this time. Support for multiple sources will be available in upcoming versions.
`inputs.input.rules.id` | Array | A list of security rules for the detector definition.
`triggers.sev_levels` | Array | Sigma rule severity levels: `informational`; `low`; `medium`; `high`; `criticial`. See [Level](https://github.com/SigmaHQ/sigma/wiki/Rule-Creation-Guide#level) in the Sigma Rule Creation Guide.
`triggers.tags` | Array | Tags are specified in a security rule. Tags can then be selected and applied to the alert trigger to focus generation of alerts. See an example of how tags are used in a Sigma rule in Sigma's [Rule Creation Guide](https://github.com/SigmaHQ/sigma/wiki/Rule-Creation-Guide#tags).
`triggers.actions` | Object | Actions send notifications when trigger conditions are met. See trigger actions for [Create Detector API]({{site.url}}{{site.baseurl}}/security-analytics/api-tools/detector-api/#create-detector).


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

#### Response fields

Field | Type | Description
:--- | :--- |:--- |:--- |
`_version` | String | Version number for the update.
`detector.last_update_time` | String | Date and time of the last update.
`detector.enabled_time` | String | Date and time when the detector was last enabled.

---
## Delete Detector

This API uses the detector ID to specify and delete a detector.

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

