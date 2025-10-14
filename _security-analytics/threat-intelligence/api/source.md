---
layout: default
title:  Source API
parent: Threat intelligence APIs
grand_parent: Threat intelligence
nav_order: 50
canonical_url: https://docs.opensearch.org/latest/security-analytics/threat-intelligence/api/source/
---

# Source API

The threat intelligence Source API updates and returns information about tasks related to threat intelligence source configurations.

## Create or update a threat intelligence source

Creates or updates a threat intelligence source and loads indicators of compromise (IOCs) from that source.

### Endpoints

```json
POST _plugins/_security_analytics/threat_intel/sources
PUT _plugins/_security_analytics/threat_intel/sources/<source_id>
```

### Request body fields

| Field  | Type  | Description  |
| :---  | :--- | :---- |
| `type`  | String | The type of threat intelligence source, such as `S3_CUSTOM` or `IOC_UPLOAD`.   |
| `name`  | String   | The name of the threat intelligence source.   |
| `format`  | String   | The format of the threat intelligence data, such as `STIX2`.   |
| `description`    | String   | A description of the threat intelligence source.  |
| `enabled`   | Boolean | Indicates whether the scheduled refresh of IOCs from the source is enabled. |
| `ioc_types` | Array of strings | The `STIX2` types of IOCs that the source supports, for example, `hashes`, `domain-name`, `ipv4-addr`, or `ipv6-addr`.                                             |
| `source`  | Object   | The source information for the threat intelligence data.   |
| `source.ioc_upload`   | Object   | Information about the IOC upload. Applicable to the `IOC_UPLOAD` type.  |
| `source.ioc_upload.file_name`  | String   | The name of the file containing IOCs, such as `test`. Applicable to the`IOC_UPLOAD` type.  |
| `source.ioc_upload.iocs`   | Array of objects | A list of IOCs in `STIX2` format. Applicable to the `IOC_UPLOAD` type. |
| `source_config.source.s3`   | Object   | Information about the Amazon Simple Storage Service (Amazon S3) source. Applicable to the `S3_CUSTOM` type.   |
| `source_config.source.s3.bucket_name` | String  | The name of the S3 bucket, such as `threat-intel-s3-test-bucket`. Applicable to the `S3_CUSTOM` type.                                                                        |
| `source_config.source.s3.object_key`  | String   | The key for the object in the S3 bucket, such `alltypess3object`. Applicable to the `S3_CUSTOM` type.   |
| `source_config.source.s3.region`  | String | The AWS Region in which the S3 bucket is located. Example: `us-west-2`. Applicable to the `S3_CUSTOM` type.  |
| `source_config.source.s3.role_arn`    | String   | The Amazon Resource Name (ARN) of the role used to access the S3 bucket, such as `arn:aws:iam::248279774929:role/threat_intel_s3_test_role`. Applicable to the `S3_CUSTOM` type. |

#### IOC fields (STIX2)  

The following fields modify the `ioc_types` option.

| Field  | Type  | Description   |
| :--- | :---- | :----  |
| `id`  | String  | A unique identifier for the IOC, such as `1`.  |
| `name`   | String   | A human-readable name for the IOC, such as `ioc-name`.  |
| `type`  | String  | The type of IOC, such as `hashes`. |
| `value`   | String  | The value of the IOC, which can be a hash value, such as `gof`.   |
| `severity`     | String   | The severity level of the IOC. Example: `thvvz`.    |
| `created`  | Integer/String   | The timestamp indicating when the IOC was created, either in UNIX epoch format or ISO_8601 format, for example, `1719519073` or `2024-06-20T01:06:20.562008Z`.   |
| `modified` | Integer/String   | The timestamp indicating when the IOC was last modified, either in UNIX epoch format or ISO_8601 format, for example, `1719519073` or `2024-06-20T01:06:20.562008Z.` |
| `description`  | String     | A description of the IOC.    |
| `labels`   | Array of strings | Any labels or tags associated with the IOC.  |
| `feed_id`   | String           | A unique identifier for the feed to which the IOC belongs.    |
| `spec_version` | String           | The specification version used for the IOC.    |
| `version`      | Integer    | A version number for the IOC.    |

### Response body fields

| Field     | Data type   | Description   |
| :---- | :--- |:----- |
| `_id`     | String    | The unique identifier for the threat intelligence source.     |
| `_version`  | Integer           | The version number of the threat intelligence source.   |
| `source_config`    | Object   | The configuration details of the threat intelligence source.    |
| `source_config.name`    | String    | The name of the threat intelligence source.   |
| `source_config.format`   | String     | The format of the threat intelligence data.    |
| `source_config.type`   | String   | The type of the threat intelligence source.   |
| `source_config.ioc_types`  | Array of strings  | The types of IOCs supported by the source.   |
| `source_config.description`   | String  | A description of the threat intelligence source.  |
| `source_config.created_by_user`  | String or null    | The user who created the threat intelligence source.    |
| `source_config.created_at`    | String (DateTime) | The date and time when the threat intelligence source was created.      |
| `source_config.source`  | Object   | Contains information about the source of the threat intelligence data.   |
| `source_config.source.ioc_upload`    | Object    | Information about the IOC upload.   |
| `source_config.source.ioc_upload.file_name` | String   | The name of the uploaded file. Example: `test`. |
| `source_config.source.ioc_upload.iocs`      | Array of objects  | Any additional information about the IOC upload. When the IOC is stored successfully, this appears as an empty array.   |
| `source_config.enabled`   | Boolean    | Indicates whether the threat intelligence source is enabled.  |
| `source_config.enabled_time`    | String or null    | The date and time when the source was enabled.   |
| `source_config.last_update_time`  | String (DateTime) | The date and time when the threat intelligence source was last updated.  |
| `source_config.schedule`  | String or null    | The schedule for the threat intelligence source.  |
| `source_config.state`    | String    | The current state of the threat intelligence source.  |
| `source_config.refresh_type`    | String   | The type of refresh applied to the source.  |
| `source_config.last_refreshed_user`   | String or null    | The user who last refreshed the source. |
| `source_config.last_refreshed_time`         | String (DateTime) | The date and time when the source was last refreshed. |

### Example requests 

The following example requests show you how to use the Source API.

#### IOC_UPLOAD type

```json
POST _plugins/_security_analytics/threat_intel/sources/
{
  "type": "IOC_UPLOAD",
  "name": "my_custom_feed",
  "format": "STIX2",
  "description": "this is the description",
  "store_type": "OS",
  "enabled": "false",
  "ioc_types": [
    "hashes"
  ],
  "source": {
    "ioc_upload": {
      "file_name": "test",
      "iocs": [
        {
          "id": "1",
          "name": "uldzafothwgik",
          "type": "hashes",
          "value": "gof",
          "severity": "thvvz",
          "created": 1719519073,
          "modified": 1719519073,
          "description": "first one here",
          "labels": [
            "ik"
          ],
          "feed_id": "jl",
          "spec_version": "gavvnespe",
          "version": -4356924786557562654
        },
        {
          "id": "2",
          "name": "uldzafothwgik",
          "type": "hashes",
          "value": "example-has00001",
          "severity": "thvvz",
          "created": "2024-06-20T01:06:20.562008Z",
          "modified": "2024-06-20T02:06:20.56201Z",
          "description": "first one here",
          "labels": [
            "ik"
          ],
          "feed_id": "jl",
          "spec_version": "gavvnespe",
          "version": -4356924786557562654
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

#### S3_CUSTOM type source

```json
POST _plugins/_security_analytics/threat_intel/sources/
{
 "type": "S3_CUSTOM",
 "name": "example-ipv4-from-SAP-account",
 "format": "STIX2",
 "store_type": "OS",
 "enabled": "true",
 "schedule": {
  "interval": {
   "start_time": 1717097122,
   "period": "10",
   "unit": "DAYS"
  }
 },
 "source": {
  "s3": {
   "bucket_name": "threat-intel-s3-test-bucket",
   "object_key": "alltypess3object",
   "region": "us-west-2",
   "role_arn": "arn:aws:iam::248279774929:role/threat_intel_s3_test_role"
  }
 },
 "ioc_types": [
  "domain-name",
  "ipv4-addr"
 ]
}
```
{% include copy-curl.html %}

### Example responses

The following example responses show what OpenSearch returns after a successful request.


#### IOC_UPLOAD type

```json
{
  "_id": "2c0u7JAB9IJUg27gcjUp",
  "_version": 2,
  "source_config": {
    "name": "my_custom_feed",
    "format": "STIX2",
    "type": "IOC_UPLOAD",
    "ioc_types": [
      "hashes"
    ],
    "description": "this is the description",
    "created_by_user": null,
    "created_at": "2024-07-25T23:16:25.257697Z",
    "source": {
      "ioc_upload": {
        "file_name": "test",
        "iocs": []
      }
    },
    "enabled": false,
    "enabled_time": null,
    "last_update_time": "2024-07-25T23:16:26.011774Z",
    "schedule": null,
    "state": "AVAILABLE",
    "refresh_type": "FULL",
    "last_refreshed_user": null,
    "last_refreshed_time": "2024-07-25T23:16:25.522735Z"
  }
}
```

#### S3_CUSTOM type source

```json
{
 "id": "rGO5zJABLVyN2kq1wbFS",
 "version": 206,
 "name": "example-ipv4-from-SAP-account",
 "format": "STIX2",
 "type": "S3_CUSTOM",
 "ioc_types": [
  "domain-name",
  "ipv4-addr"
 ],
 "created_by_user": {
  "name": "admin",
  "backend_roles": [],
  "roles": [
   "security_manager",
   "all_access"
  ],
  "custom_attribute_names": []
 },
 "created_at": "2024-07-19T20:40:44.114Z",
 "source": {
  "s3": {
   "bucket_name": "threat-intel-s3-test-bucket",
   "object_key": "alltypess3object",
   "region": "us-west-2",
   "role_arn": "arn:aws:iam::248279774929:role/threat_intel_s3_test_role"
  }
 },
 "enabled": true,
 "enabled_time": "2024-07-19T20:40:44.114Z",
 "last_update_time": "2024-07-25T20:58:18.213Z",
 "schedule": {
  "interval": {
   "start_time": 1717097122,
   "period": 10,
   "unit": "Days"
  }
 },
 "state": "AVAILBLE",
 "refresh_type": "FULL",
 "last_refreshed_user": {
  "name": "admin",
  "backend_roles": [],
  "roles": [
   "security_manager",
   "all_access"
  ],
  "custom_attribute_names": [],
  "user_requested_tenant": null
 },
 "last_refreshed_time": "2024-07-25T20:58:17.131Z"
}
```

---

## Get threat intelligence source configuration details

Retrieves the threat intelligence source configuration details.

### Endpoints


```json
GET /_plugins/_security_analytics/threat_intel/sources/<source-id>
```

### Example request

```json
GET /_plugins/_security_analytics/threat_intel/sources/<source-id>
```
{% include copy-curl.html %}

### Example response

```json
{
  "_id": "a-jnfjkAF_uQjn8Weo4",
  "_version": 2,
  "source_config": {
    "name": "my_custom_feed_2",
    "format": "STIX2",
    "type": "S3_CUSTOM",
    "ioc_types": [
      "ipv4_addr",
      "hashes"
    ],
    "description": "this is the description",
    "created_by_user": null,
    "created_at": "2024-06-27T00:52:56.373Z",
    "source": {
      "s3": {
        "bucket_name": "threat-intel-s3-test-bucket",
        "object_key": "bd",
        "region": "us-west-2",
        "role_arn": "arn:aws:iam::540654354201:role/threat_intel_s3_test_role"
      }
    },
    "enabled": true,
    "enabled_time": "2024-06-27T00:52:56.373Z",
    "last_update_time": "2024-06-27T00:52:57.824Z",
    "schedule": {
      "interval": {
        "start_time": 1717097122,
        "period": 1,
        "unit": "Days"
      }
    },
    "state": "AVAILABLE",
    "refresh_type": "FULL",
    "last_refreshed_user": null,
    "last_refreshed_time": "2024-06-27T00:52:56.533Z"
  }
}
```
---

## Search for a threat intelligence source 

Searches for threat intelligence source matches based on the search query. The request body expects a search query. For query options, see [Query DSL]({{site.url}}{{site.baseurl}}/query-dsl/).


### Endpoints

```json
POST /_plugins/_security_analytics/threat_intel/sources/_search
```

### Example request

```json
POST /_plugins/_security_analytics/threat_intel/sources/_search
{
    "query": {
        "match": {
            "source_config.type": "S3_CUSTOM"
        }
    }
}
```
{% include copy-curl.html %}

### Example response

```json
{
    "took": 20,
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
                "_index": ".opensearch-sap--job",
                "_id": "YEAuV5ABx0lQn6qhY5C1",
                "_version": 2,
                "_seq_no": 1,
                "_primary_term": 1,
                "_score": 1.0,
                "_source": {
                    "source_config": {
                        "name": "my_custom_feed_2",
                        "format": "STIX2",
                        "type": "S3_CUSTOM",
                        "description": "this is the description",
                        "created_by_user": null,
                        "source": {
                            "s3": {
                                "bucket_name": "threat-intelligence-s3-test-bucket",
                                "object_key": "bd",
                                "region": "us-west-2",
                                "role_arn": "arn:aws:iam::540654354201:role/threat_intel_s3_test_role"
                            }
                        },
                        "created_at": 1719449576373,
                        "enabled_time": 1719449576373,
                        "last_update_time": 1719449577824,
                        "schedule": {
                            "interval": {
                                "start_time": 1717097122,
                                "period": 1,
                                "unit": "Days"
                            }
                        },
                        "state": "AVAILABLE",
                        "refresh_type": "FULL",
                        "last_refreshed_time": 1719449576533,
                        "last_refreshed_user": null,
                        "enabled": true,
                        "ioc_types": [
                            "ip",
                            "hash"
                        ]
                    }
                }
            }
        ]
    }
}
```

---

## Delete Threat Intelligence Source API

Deletes a threat intelligence source.

### Endpoints

```json
DELETE /_plugins/_security_analytics/threat_intel/sources/<source-id>
```

### Example request

```json
DELETE /_plugins/_security_analytics/threat_intel/sources/2c0u7JAB9IJUg27gcjUp
```
{% include copy-curl.html %}

### Example response

```json
{
  "_id": "2c0u7JAB9IJUg27gcjUp"
}
```
---

## Refresh the source 

Downloads any IOCs from the threat intelligence source. Only supports the `S3_CUSTOM` type source.

### Endpoints

```json
POST /_plugins/_security_analytics/threat_intel/sources/<source-id>/_refresh
```

### Example request

```json
POST /_plugins/_security_analytics/threat_intel/sources/IJAXz4QBrmVplM4JYxx_/_refresh
```
{% include copy-curl.html %}

### Example response

```json
{
 "acknowledged": true
}
```
