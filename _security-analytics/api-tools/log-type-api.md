---
layout: default
title: Log type APIs
parent: API tools
nav_order: 56
---

# Log type APIs

The log type APIs allow you to create a custom log type, search custom log types, update custom log types, and delete custom log types.


## Create log type

Creating a new custom log type involves entering a name and a description and specifying the source as `Custom`.


### Example request

```json
POST /_plugins/_security_analytics/logtype
{
  "description": "custom-log-type-desc",
  "name": "custom-log-type4",
  "source": "Custom"
}
```
{% include copy-curl.html %}


### Example response

```json
{
    "_id": "m98uk4kBlb9cbROIpEj2",
    "_version": 1,
    "logType": {
        "name": "custom-log-type4",
        "description": "custom-log-type-desc",
        "source": "Custom",
        "tags": {
            "correlation_id": 27
        }
    }
}
```


## Search custom log types

This API allows you to search log types in the system.


### Example request

```json
POST /_plugins/_security_analytics/logtype/_search
{
    "query": {
        "match_all": {}
    }
}
```
{% include copy-curl.html %}


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
            "value": 26,
            "relation": "eq"
        },
        "max_score": 2.0,
        "hits": [
            {
                "_index": ".opensearch-sap-log-types-config",
                "_id": "s3",
                "_score": 2.0,
                "_source": {
                    "name": "s3",
                    "description": "Windows logs",
                    "source": "Sigma",
                    "tags": {
                        "correlation_id": 21
                    }
                }
            },
            {
                "_index": ".opensearch-sap-log-types-config",
                "_id": "others_compliance",
                "_score": 2.0,
                "_source": {
                    "name": "others_compliance",
                    "description": "Compliance logs",
                    "source": "Sigma",
                    "tags": {
                        "correlation_id": 4
                    }
                }
            },
            {
                "_index": ".opensearch-sap-log-types-config",
                "_id": "github",
                "_score": 2.0,
                "_source": {
                    "name": "github",
                    "description": "Sys logs",
                    "source": "Sigma",
                    "tags": {
                        "correlation_id": 16
                    }
                }
            },
            {
                "_index": ".opensearch-sap-log-types-config",
                "_id": "others_application",
                "_score": 2.0,
                "_source": {
                    "name": "others_application",
                    "description": "Application logs",
                    "source": "Sigma",
                    "tags": {
                        "correlation_id": 0
                    }
                }
            },
            {
                "_index": ".opensearch-sap-log-types-config",
                "_id": "dns",
                "_score": 2.0,
                "_source": {
                    "name": "dns",
                    "description": "Compliance logs",
                    "source": "Sigma",
                    "tags": {
                        "correlation_id": 15
                    }
                }
            },
            {
                "_index": ".opensearch-sap-log-types-config",
                "_id": "m98uk4kBlb9cbROIpEj2",
                "_score": 2.0,
                "_source": {
                    "name": "custom-log-type-updated4",
                    "description": "custom-log-type-updated-desc",
                    "source": "Custom",
                    "tags": null
                }
            }
        ]
    }
}
```


## Update custom log type

This API allows you to update existing custom log types. Use the log type's ID in the route to specify the log type, as shown in the following example:

```json
PUT /_plugins/_security_analytics/logtype/<log_type_id>
```


### Example request

```json
PUT /_plugins/_security_analytics/logtype/m98uk4kBlb9cbROIpEj2
{
  "name": "custom-log-type4",
  "description": "custom-log-type-updated-desc",
  "source": "Custom"
}
```
{% include copy-curl.html %}


### Example response

```json
{
    "_id": "m98uk4kBlb9cbROIpEj2",
    "_version": 1,
    "logType": {
        "name": "custom-log-type4",
        "description": "custom-log-type-updated-desc",
        "source": "Custom",
        "tags": {
            "correlation_id": 27
        }
    }
}
```


## Delete custom log type

This API is used to delete a custom log type. Specify the log type's ID in the route to run the operation:

```json
DELETE /_plugins/_security_analytics/logtype/<log_type_id>
```


### Example request

```json
DELETE /_plugins/_security_analytics/logtype/m98uk4kBlb9cbROIpEj2
```
{% include copy-curl.html %}


### Example response

```json
200 OK
{
    "_id": "m98uk4kBlb9cbROIpEj2",
    "_version": 1
}
```

Only custom log types can be deleted. Trying to delete a standard OpenSearch-defined log type results in an error.
{: .note }

