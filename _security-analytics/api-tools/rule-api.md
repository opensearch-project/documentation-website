---
layout: default
title: Rule APIs
parent: API tools
nav_order: 40
---

# Rule APIs

The following APIs can be used for a number of tasks related to rules, from searching for pre-packaged rules to creating and updating custom rules.

---
## Create Custom Rule

The Create Custom Rule API uses Sigma security rule formatting to create a custom rule. For information about how to write a rule in Sigma format, see information provided at [Sigma's GitHub repository](https://github.com/SigmaHQ/sigma).

```json
POST /_plugins/_security_analytics/rules?category=windows
```

### Example request

```yml
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

### Example response

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

---
## Update Custom Rule (not forced)

### Example request

```json
PUT /_plugins/_security_analytics/rules/ZaFv1IMBdLpXWBiBa1XI?category=windows

Content-Type: application/json

Body:

title: Moriya Rooskit
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

### Example response

```json
{
    "error": {
        "root_cause": [
            {
                "type": "security_analytics_exception",
                "reason": "Rule with id ZaFv1IMBdLpXWBiBa1XI is actively used by detectors. Update can be forced by setting forced flag to true"
            }
        ],
        "type": "security_analytics_exception",
        "reason": "Rule with id ZaFv1IMBdLpXWBiBa1XI is actively used by detectors. Update can be forced by setting forced flag to true",
        "caused_by": {
            "type": "exception",
            "reason": "org.opensearch.OpenSearchStatusException: Rule with id ZaFv1IMBdLpXWBiBa1XI is actively used by detectors. Update can be forced by setting forced flag to true"
        }
    },
    "status": 500
}
```

---
## Update Custom Rule (forced)

### Example request

```json
PUT /_plugins/_security_analytics/rules/ZaFv1IMBdLpXWBiBa1XI?category=windows&forced=true

Content-Type: application/json

Body:

title: Moriya Rooskit
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

### Example response

```json
{
    "_id": "ZaFv1IMBdLpXWBiBa1XI",
    "_version": 1,
    "rule": {
        "category": "windows",
        "title": "Moriya Rooskit",
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
        "rule": "title: Moriya Rooskit\nid: 25b9c01c-350d-4b95-bed1-836d04a4f324\ndescription: Detects the use of Moriya rootkit as described in the securelist's Operation TunnelSnake report\nstatus: experimental\nauthor: Bhabesh Raj\ndate: 2021/05/06\nmodified: 2021/11/30\nreferences:\n    - https://securelist.com/operation-tunnelsnake-and-moriya-rootkit/101831\ntags:\n    - attack.persistence\n    - attack.privilege_escalation\n    - attack.t1543.003\nlogsource:\n    product: windows\n    service: system\ndetection:\n    selection:\n        Provider_Name: 'Service Control Manager'\n        EventID: 7045\n        ServiceName: ZzNetSvc\n    condition: selection\nlevel: critical\nfalsepositives:\n    - Unknown"
    }
}
```

---
## Search Pre-Packaged Rules

### Example request

```json
POST /_plugins/_security_analytics/rules/_search?pre_packaged=true

{
  "from": 0,
  "size": 20,  
  "query": {
    "nested": {
      "path": "rule",
      "query": {
        "bool": {
          "must": [
            { "match": { "rule.category": "windows" } }
          ]
        }
      }
    }
  }
}
```

### Example response

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
            "value": 1580,
            "relation": "eq"
        },
        "max_score": 0.25863406,
        "hits": [
            {
                "_index": ".opensearch-pre-packaged-rules-config",
                "_id": "6KFv1IMBdLpXWBiBelZg",
                "_version": 1,
                "_seq_no": 386,
                "_primary_term": 1,
                "_score": 0.25863406,
                "_source": {
                    "category": "windows",
                    "title": "Change Outlook Security Setting in Registry",
                    "log_source": "registry_set",
                    "description": "Change outlook email security settings",
                    "references": [
                        {
                            "value": "https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1137/T1137.md"
                        },
                        {
                            "value": "https://docs.microsoft.com/en-us/outlook/troubleshoot/security/information-about-email-security-settings"
                        }
                    ],
                    "tags": [
                        {
                            "value": "attack.persistence"
                        },
                        {
                            "value": "attack.t1137"
                        }
                    ],
                    "level": "medium",
                    "false_positives": [
                        {
                            "value": "Administrative scripts"
                        }
                    ],
                    "author": "frack113",
                    "status": "experimental",
                    "last_update_time": "2021-12-28T00:00:00.000Z",
                    "queries": [
                        {
                            "value": "((TargetObject: *\\\\SOFTWARE\\\\Microsoft\\\\Office\\\\*) AND (TargetObject: *\\\\Outlook\\\\Security\\\\*)) AND (EventType: \"SetValue\")"
                        }
                    ],
                    "rule": "title: Change Outlook Security Setting in Registry\nid: c3cefdf4-6703-4e1c-bad8-bf422fc5015a\ndescription: Change outlook email security settings\nauthor: frack113\ndate: 2021/12/28\nmodified: 2022/03/26\nstatus: experimental\nreferences:\n    - https://github.com/redcanaryco/atomic-red-team/blob/master/atomics/T1137/T1137.md\n    - https://docs.microsoft.com/en-us/outlook/troubleshoot/security/information-about-email-security-settings\nlogsource:\n    category: registry_set\n    product: windows\ndetection:\n    selection:\n        TargetObject|contains|all:\n            - '\\SOFTWARE\\Microsoft\\Office\\'\n            - '\\Outlook\\Security\\'\n        EventType: SetValue\n    condition: selection\nfalsepositives:\n    - Administrative scripts\nlevel: medium\ntags:\n  - attack.persistence\n  - attack.t1137\n"
                }
            }
        ]
    }
}
```

---
## Search Custom Rules

### Example request

```json
POST /_plugins/_security_analytics/rules/_search?pre_packaged=false

Body:

{
  "from": 0,
  "size": 20,  
  "query": {
    "nested": {
      "path": "rule",
      "query": {
        "bool": {
          "must": [
            { "match": { "rule.category": "windows" } }
          ]
        }
      }
    }
  }
}
```

### Example response

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
        "max_score": 0.2876821,
        "hits": [
            {
                "_index": ".opensearch-custom-rules-config",
                "_id": "ZaFv1IMBdLpXWBiBa1XI",
                "_version": 2,
                "_seq_no": 1,
                "_primary_term": 1,
                "_score": 0.2876821,
                "_source": {
                    "category": "windows",
                    "title": "Moriya Rooskit",
                    "log_source": "",
                    "description": "Detects the use of Moriya rootkit as described in the securelist's Operation TunnelSnake report",
                    "references": [
                        {
                            "value": "https://securelist.com/operation-tunnelsnake-and-moriya-rootkit/101831"
                        }
                    ],
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
                    "level": "critical",
                    "false_positives": [
                        {
                            "value": "Unknown"
                        }
                    ],
                    "author": "Bhabesh Raj",
                    "status": "experimental",
                    "last_update_time": "2021-05-06T00:00:00.000Z",
                    "queries": [
                        {
                            "value": "(Provider_Name: \"Service_ws_Control_ws_Manager\") AND (event_uid: 7045) AND (ServiceName: \"ZzNetSvc\")"
                        }
                    ],
                    "rule": "title: Moriya Rooskit\nid: 25b9c01c-350d-4b95-bed1-836d04a4f324\ndescription: Detects the use of Moriya rootkit as described in the securelist's Operation TunnelSnake report\nstatus: experimental\nauthor: Bhabesh Raj\ndate: 2021/05/06\nmodified: 2021/11/30\nreferences:\n    - https://securelist.com/operation-tunnelsnake-and-moriya-rootkit/101831\ntags:\n    - attack.persistence\n    - attack.privilege_escalation\n    - attack.t1543.003\nlogsource:\n    product: windows\n    service: system\ndetection:\n    selection:\n        Provider_Name: 'Service Control Manager'\n        EventID: 7045\n        ServiceName: ZzNetSvc\n    condition: selection\nlevel: critical\nfalsepositives:\n    - Unknown"
                }
            }
        ]
    }
}
```

---
## Delete Custom Rule (not forced)

### Example request

```json
DELETE /_plugins/_security_analytics/rules/ZaFv1IMBdLpXWBiBa1XI
```

### Example response

```json
{
    "error": {
        "root_cause": [
            {
                "type": "security_analytics_exception",
                "reason": "Rule with id ZaFv1IMBdLpXWBiBa1XI is actively used by detectors. Deletion can be forced by setting forced flag to true"
            }
        ],
        "type": "security_analytics_exception",
        "reason": "Rule with id ZaFv1IMBdLpXWBiBa1XI is actively used by detectors. Deletion can be forced by setting forced flag to true",
        "caused_by": {
            "type": "exception",
            "reason": "org.opensearch.OpenSearchStatusException: Rule with id ZaFv1IMBdLpXWBiBa1XI is actively used by detectors. Deletion can be forced by setting forced flag to true"
        }
    },
    "status": 500
}
```

---
## Delete Custom Rule (forced)

### Example request

```json
DELETE /_plugins/_security_analytics/rules/ZaFv1IMBdLpXWBiBa1XI?forced=true
```

### Example response

```json
{
    "_id": "ZaFv1IMBdLpXWBiBa1XI",
    "_version": 1
}
```

