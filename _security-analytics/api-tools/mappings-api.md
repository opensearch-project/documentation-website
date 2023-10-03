---
layout: default
title: Mappings APIs
parent: API tools
nav_order: 45
---

# Mappings APIs

The following APIs can be used for a number of tasks related to mappings, from creating to getting and updating mappings.

---
## Get Mappings View

This API returns a view of the fields contained in an index used as a log source.

### Request fields

The following fields are used to get field mappings.

Field | Type | Description
:--- | :--- |:--- 
`index_name` | String | The name of the index used for log ingestion. 
`rule_topic` | String | The log type of the index. 

#### Example request

```json
GET /_plugins/_security_analytics/mappings/view

{
   "index_name": "windows",
   "rule_topic": "windows"
}
```

#### Example response

```json
{
    "properties": {
        "windows-event_data-CommandLine": {
            "path": "CommandLine",
            "type": "alias"
        },
        "event_uid": {
            "path": "EventID",
            "type": "alias"
        }
    },
    "unmapped_index_fields": [
        "windows-event_data-CommandLine",
        "unmapped_HiveName",
        "src_ip",
        "sha1",
        "processPath",
        "CallerProcessName",
        "CallTrace",
        "AuthenticationPackageName",
        "AuditSourceName",
        "AuditPolicyChanges",
        "AttributeValue",
        "AttributeLDAPDisplayName",
        "ApplicationPath",
        "Application",
        "AllowedToDelegateTo",
        "Address",
        "Action",
        "AccountType",
        "AccountName",
        "Accesses",
        "AccessMask",
        "AccessList"
    ]
}
```

---
## Create Mappings

#### Example request

```json
POST /_plugins/_security_analytics/mappings

{
   "index_name": "windows",
   "rule_topic": "windows",
   "partial": true,
   "alias_mappings": {
        "properties": {
            "event_uid": {
            "type": "alias",
            "path": "EventID"
          }
       }
   }
}
```

#### Example response

```json
{
    "acknowledged": true
}
```

---
## Get Mappings

#### Example request

```json
GET /_plugins/_security_analytics/mappings
```

#### Example response

```json
{
    "windows": {
        "mappings": {
            "properties": {
                "windows-event_data-CommandLine": {
                    "type": "alias",
                    "path": "CommandLine"
                },
                "event_uid": {
                    "type": "alias",
                    "path": "EventID"
                }
            }
        }
    }
}
```

---
## Update Mappings

#### Example request

```json
PUT /_plugins/_security_analytics/mappings

{
   "index_name": "windows",
   "field": "CommandLine",
   "alias": "windows-event_data-CommandLine"
}
```

#### Example response

```json
{
    "acknowledged": true
}
```

