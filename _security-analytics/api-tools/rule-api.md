---
layout: default
title: Rule APIs
parent: API tools
nav_order: 40
---

# Rule APIs

The following APIs can be used for a number of tasks related to rules, from searching for pre-packaged rules to creating and updating custom rules.

## Create custom rule

`POST /_plugins/_security_analytics/rules?category=windows`

### Sample request

```json
Header:
Content-Type: application/json

Body:

title: Moriya Rootkit
id: 25b9c01c-350d-4b95-bed1-836d04a4f324
description: Detects the use of Moriya rootkit as described in the securelist's Operation TunnelSnake report
status: experimental
author: Bhabesh Raj
date: 2021/05/06
modified: 2021/11/30
references:
    - https://securelist.com/operation-tunnelsnake-and-moriya-rootkit/101831
tags:
    - attack.persistence
    - attack.privilege_escalation
    - attack.t1543.003
logsource:
    product: windows
    service: system
detection:
    selection:
        Provider_Name: 'Service Control Manager'
        EventID: 7045
        ServiceName: ZzNetSvc
    condition: selection
level: critical
falsepositives:
    - Unknown
```

### Sample response

**Sample 1:**

```json
{
    "_id": "M1Rm1IMByX0LvTiGvde2",
    "_version": 1,
    "rule": {
        "category": "windows",
        "title": "Moriya Rootkit",
        "log_source": "",
        "description": "Detects the use of Moriya rootkit as described in the securelist's Operation TunnelSnake report",
        "tags": [
            {
                "value": "attack.persistence"
            },
            {
                "value": "attack.privilege_escalation"
            },
            {
                "value": "attack.t1543.003"
            }
        ],
        "references": [
            {
                "value": "https://securelist.com/operation-tunnelsnake-and-moriya-rootkit/101831"
            }
        ],
        "level": "critical",
        "false_positives": [
            {
                "value": "Unknown"
            }
        ],
        "author": "Bhabesh Raj",
        "status": "experimental",
        "last_update_time": "2021-05-06T00:00:00.000Z",
        "rule": "title: Moriya Rootkit\nid: 25b9c01c-350d-4b95-bed1-836d04a4f324\ndescription: Detects the use of Moriya rootkit as described in the securelist's Operation TunnelSnake report\nstatus: experimental\nauthor: Bhabesh Raj\ndate: 2021/05/06\nmodified: 2021/11/30\nreferences:\n    - https://securelist.com/operation-tunnelsnake-and-moriya-rootkit/101831\ntags:\n    - attack.persistence\n    - attack.privilege_escalation\n    - attack.t1543.003\nlogsource:\n    product: windows\n    service: system\ndetection:\n    selection:\n        Provider_Name: 'Service Control Manager'\n        EventID: 7045\n        ServiceName: ZzNetSvc\n    condition: selection\nlevel: critical\nfalsepositives:\n    - Unknown"
    }
}
```

**Sample 2:**

```json
{
  "error": {
    "root_cause": [
      {
        "type": "security_analytics_exception",
        "reason": "{\"error\":\"Sigma rule must have a log source\",\"error\":\"Sigma rule must have a detection definitions\"}"
      }
    ],
    "type": "security_analytics_exception",
    "reason": "{\"error\":\"Sigma rule must have a log source\",\"error\":\"Sigma rule must have a detection definitions\"}",
    "caused_by": {
      "type": "exception",
      "reason": "java.util.Arrays$ArrayList: {\"error\":\"Sigma rule must have a log source\",\"error\":\"Sigma rule must have a detection definitions\"}"
    }
  },
  "status": 400
}
```

## Update custom rule (not forced)

## Update custom rule (forced)

## Search pre-packaged rules

## Search custom rules

## Delete custom rule (not forced)

## Delete custom rule (forced)












