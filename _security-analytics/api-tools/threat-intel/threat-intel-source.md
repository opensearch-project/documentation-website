---
layout: default
title: Threat intelligence source APIs
parent: API tools
nav_order: 50
---

# Threat intelligence source APIs

The following APIs can be used for tasks related to threat intelligence source configurations.

## Create threat intelligence source API

Creates a new threat intelligence source and loads IoC's from source.

```
POST _plugins/_security_analytics/threat_intel/sources
```

### Request fields

The following fields are used to create a threat intelligence source.

### Request Fields

| Field                                 | Type             | Description                                                                                                                                                               |
|:--------------------------------------|:-----------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
 | `type`                                | String           | The type of the threat intelligence source. Supported formats: `S3_CUSTOM`, `IOC_UPLOAD`.                                                                                 |
 | `name`                                | String           | The name of the threat intelligence source.                                                                                                                               |
 | `format`                              | String           | The format of the threat intelligence data. Example: `STIX2`.                                                                                                             |
 | `description`                         | String           | A description of the threat intelligence source.                                                                                                                          |
 | `enabled`                             | Boolean          | Indicates whether scheduled refresh of iocs from source is enabled i.e. the threat intelligence iocs downloaded from the source should be refreshed on a schedule or not. |
 | `ioc_types`                           | Array of Strings | The STIX2 types of IOCs that the source supports. Supported ioc types: `["hashes", "domain-name","ipv4-addr", "ipv6-addr"]`.                                              |
 | `source`                              | Object           | Contains the source details for the threat intelligence data.                                                                                                             |
 | `source.ioc_upload`                   | Object           | Details for IOC upload. Applicable for the `IOC_UPLOAD` type.                                                                                                             |
 | `source.ioc_upload.file_name`         | String           | The name of the file containing IOCs. Example: `test`. Applicable for the`IOC_UPLOAD` type.                                                                               |
 | `source.ioc_upload.iocs`              | Array of Objects | List of IOCs in STIX2 format.Applicable for `IOC_UPLOAD` type                                                                                                             |
| `source_config.source.s3`             | Object           | Contains details about the S3 source.    Applicable for `S3_CUSTOM` type                                                                                                  |
| `source_config.source.s3.bucket_name` | String           | The name of the S3 bucket. Example: `threat-intel-s3-test-bucket`. Applicable for `S3_CUSTOM` type                                                                        |
| `source_config.source.s3.object_key`  | String           | The key of the object in the S3 bucket. Example: `alltypess3object`. Applicable for `S3_CUSTOM` type                                                                      |
| `source_config.source.s3.region`      | String           | The region where the S3 bucket is located. Example: `us-west-2`. Applicable for `S3_CUSTOM` type                                                                          |
| `source_config.source.s3.role_arn`    | String           | The ARN of the role used to access the S3 bucket. Example: `arn:aws:iam::248279774929:role/threat_intel_s3_test_role`. Applicable for `S3_CUSTOM` type                    |

#### IOC Fields (STIX2)       

| Field          | Type             | Description                                                                                                                                          |
|:---------------|:-----------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------|
 | `id`           | String           | A unique identifier for the IOC. Example: `1`.                                                                                                       |
 | `name`         | String           | A human-readable name for the IOC. Example: `uldzafothwgik`.                                                                                         |
 | `type`         | String           | The type of IOC, such as `hashes`.                                                                                                                   |
 | `value`        | String           | The value of the IOC, such as a hash value. Example: `gof`.                                                                                          |
 | `severity`     | String           | The severity level of the IOC. Example: `thvvz`.                                                                                                     |
 | `created`      | Integer/String   | The timestamp when the IOC was created, either in UNIX epoch format or ISO 8601 format. Example: `1719519073` or `2024-06-20T01:06:20.562008Z`.      |
 | `modified`     | Integer/String   | The timestamp when the IOC was last modified, either in UNIX epoch format or ISO 8601 format. Example: `1719519073` or `2024-06-20T02:06:20.56201Z`. |
 | `description`  | String           | A description of the IOC. Example: `first one here`.                                                                                                 |
 | `labels`       | Array of Strings | Labels or tags associated with the IOC. Example: `["ik"]`.                                                                                           |
 | `feed_id`      | String           | A unique identifier for the feed to which the IOC belongs. Example: `jl`.                                                                            |
 | `spec_version` | String           | The specification version used for the IOC. Example: `gavvnespe`.                                                                                    |
 | `version`      | Integer          | A version number for the IOC. Example: `-4356924786557562654`.                                                                                       |

### Response Fields

| Field                                       | Data type         | Description                                                                                                     |
|:--------------------------------------------|:------------------|:----------------------------------------------------------------------------------------------------------------|
 | `_id`                                       | String            | The unique identifier for the threat intelligence source. Example: `pnf65pABgRuG4FjXQuJ1`.                      |
 | `_version`                                  | Integer           | The version number of the threat intelligence source. Example: `2`.                                             |
 | `source_config`                             | Object            | Contains configuration details of the threat intelligence source.                                               |
 | `source_config.name`                        | String            | The name of the threat intelligence source. Example: `my_custom_feed`.                                          |
 | `source_config.format`                      | String            | The format of the threat intelligence data. Example: `STIX2`.                                                   |
 | `source_config.type`                        | String            | The type of the threat intelligence source. Supported formats: `IOC_UPLOAD`.                                    |
 | `source_config.ioc_types`                   | Array of Strings  | The types of IOCs supported by the source. Example: `["hashes"]`.                                               |
 | `source_config.description`                 | String            | A description of the threat intelligence source. Example: `this is the description`.                            |
 | `source_config.created_by_user`             | String or Null    | The user who created the threat intelligence source. Example: `null`.                                           |
 | `source_config.created_at`                  | String (DateTime) | The date and time when the threat intelligence source was created. Example: `2024-07-24T23:01:19.093081Z`.      |
 | `source_config.source`                      | Object            | Contains details about the source of the threat intelligence data.                                              |
 | `source_config.source.ioc_upload`           | Object            | Contains details about the IOC upload.                                                                          |
 | `source_config.source.ioc_upload.file_name` | String            | The name of the file uploaded. Example: `test`.                                                                 |
 | `source_config.source.ioc_upload.iocs`      | Array of Objects  | Will always be an empty array if stored successfully.                                                           |
 | `source_config.enabled`                     | Boolean           | Indicates whether the threat intelligence source is enabled. Example: `false`.                                  |
 | `source_config.enabled_time`                | String or Null    | The date and time when the source was enabled. Example: `null`.                                                 |
 | `source_config.last_update_time`            | String (DateTime) | The date and time when the threat intelligence source was last updated. Example: `2024-07-24T23:01:19.846154Z`. |
 | `source_config.schedule`                    | String or Null    | The schedule for the threat intelligence source. Example: `null`.                                               |
 | `source_config.state`                       | String            | The current state of the threat intelligence source. Example: `AVAILABLE`.                                      |
 | `source_config.refresh_type`                | String            | The type of refresh applied to the source. Example: `FULL`.                                                     |
 | `source_config.last_refreshed_user`         | String or Null    | The user who last refreshed the source. Example: `null`.                                                        |
 | `source_config.last_refreshed_time`         | String (DateTime) | The date and time when the source was last refreshed. Example: `2024-07-24T23:01:19.338184Z`.                   |

### Example request for IOC_UPLOAD type

POST _plugins/_security_analytics/threat_intel/sources/
```json
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

### Example response for IOC_UPLOAD type

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

### Example request for S3_CUSTOM type source

POST _plugins/_security_analytics/threat_intel/sources/
```json
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

### Example response for S3_CUSTOM type source

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
## Update Threat intelligence Source API

Updates an existing threat intelligence source.

```
PUT _plugins/_security_analytics/threat_intel/sources/<threat_intel_source_id>
```

### Request fields

You can specify the following fields when updating a threat intelligence source.

### Request Fields

| Field                                 | Type             | Description                                                                                                                                                               |
|:--------------------------------------|:-----------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `name`                                | String           | The name of the threat intelligence source.                                                                                                                               |
| `format`                              | String           | The format of the threat intelligence data. Example: `STIX2`.                                                                                                             |
| `description`                         | String           | A description of the threat intelligence source.                                                                                                                          |
| `enabled`                             | Boolean          | Indicates whether scheduled refresh of iocs from source is enabled i.e. the threat intelligence iocs downloaded from the source should be refreshed on a schedule or not. |
| `ioc_types`                           | Array of Strings | The STIX2 types of IOCs that the source supports. Supported ioc types: `["hashes", "domain-name","ipv4-addr", "ipv6-addr"]`.                                              |
| `source`                              | Object           | Contains the source details for the threat intelligence data.                                                                                                             |
| `source.ioc_upload`                   | Object           | Details for IOC upload.                                                                                                                                                   |
| `source.ioc_upload.file_name`         | String           | The name of the file containing IOCs. Example: `test`.                                                                                                                    |
| `source.ioc_upload.iocs`              | Array of Objects | List of IOCs in STIX2 format.                                                                                                                                             |
| `source_config.source.s3`             | Object           | Contains details about the S3 source.                                                                                                                                     |
| `source_config.source.s3.bucket_name` | String           | The name of the S3 bucket. Example: `threat-intel-s3-test-bucket`.                                                                                                        |
| `source_config.source.s3.object_key`  | String           | The key of the object in the S3 bucket. Example: `alltypess3object`.                                                                                                      |
| `source_config.source.s3.region`      | String           | The region where the S3 bucket is located. Example: `us-west-2`.                                                                                                          |
| `source_config.source.s3.role_arn`    | String           | The ARN of the role used to access the S3 bucket. Example: `arn:aws:iam::248279774929:role/threat_intel_s3_test_role`.                                                    |

#### IOC Fields (STIX2)

| Field          | Type             | Description                                                                                                                                          |
|:---------------|:-----------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------|
| `id`           | String           | A unique identifier for the IOC. Example: `1`.                                                                                                       |
| `name`         | String           | A human-readable name for the IOC. Example: `uldzafothwgik`.                                                                                         |
| `type`         | String           | The type of IOC, such as `hashes`.                                                                                                                   |
| `value`        | String           | The value of the IOC, such as a hash value. Example: `gof`.                                                                                          |
| `severity`     | String           | The severity level of the IOC. Example: `thvvz`.                                                                                                     |
| `created`      | Integer/String   | The timestamp when the IOC was created, either in UNIX epoch format or ISO 8601 format. Example: `1719519073` or `2024-06-20T01:06:20.562008Z`.      |
| `modified`     | Integer/String   | The timestamp when the IOC was last modified, either in UNIX epoch format or ISO 8601 format. Example: `1719519073` or `2024-06-20T02:06:20.56201Z`. |
| `description`  | String           | A description of the IOC. Example: `first one here`.                                                                                                 |
| `labels`       | Array of Strings | Labels or tags associated with the IOC. Example: `["ik"]`.                                                                                           |
| `feed_id`      | String           | A unique identifier for the feed to which the IOC belongs. Example: `jl`.                                                                            |
| `spec_version` | String           | The specification version used for the IOC. Example: `gavvnespe`.                                                                                    |
| `version`      | Integer          | A version number for the IOC. Example: `-4356924786557562654`.                                                                                       |

### Response Fields

| Field                                       | Type              | Description                                                                                                     |
|:--------------------------------------------|:------------------|:----------------------------------------------------------------------------------------------------------------|
| `_id`                                       | String            | The unique identifier for the threat intelligence source. Example: `pnf65pABgRuG4FjXQuJ1`.                      |
| `_version`                                  | Integer           | The version number of the threat intelligence source. Example: `2`.                                             |
| `source_config`                             | Object            | Contains configuration details of the threat intelligence source.                                               |
| `source_config.name`                        | String            | The name of the threat intelligence source. Example: `my_custom_feed`.                                          |
| `source_config.format`                      | String            | The format of the threat intelligence data. Example: `STIX2`.                                                   |
| `source_config.type`                        | String            | The type of the threat intelligence source. Supported formats: `IOC_UPLOAD`.                                    |
| `source_config.ioc_types`                   | Array of Strings  | The types of IOCs supported by the source. Example: `["hashes"]`.                                               |
| `source_config.description`                 | String            | A description of the threat intelligence source. Example: `this is the description`.                            |
| `source_config.created_by_user`             | String or Null    | The user who created the threat intelligence source. Example: `null`.                                           |
| `source_config.created_at`                  | String (DateTime) | The date and time when the threat intelligence source was created. Example: `2024-07-24T23:01:19.093081Z`.      |
| `source_config.source`                      | Object            | Contains details about the source of the threat intelligence data.                                              |
| `source_config.source.ioc_upload`           | Object            | Contains details about the IOC upload.                                                                          |
| `source_config.source.ioc_upload.file_name` | String            | The name of the file uploaded. Example: `test`.                                                                 |
| `source_config.source.ioc_upload.iocs`      | Array of Objects  | Will always be an empty array if stored successfully.                                                           |
| `source_config.enabled`                     | Boolean           | Indicates whether the threat intelligence source is enabled. Example: `false`.                                  |
| `source_config.enabled_time`                | String or Null    | The date and time when the source was enabled. Example: `null`.                                                 |
| `source_config.last_update_time`            | String (DateTime) | The date and time when the threat intelligence source was last updated. Example: `2024-07-24T23:01:19.846154Z`. |
| `source_config.schedule`                    | String or Null    | The schedule for the threat intelligence source. Example: `null`.                                               |
| `source_config.state`                       | String            | The current state of the threat intelligence source. Example: `AVAILABLE`.                                      |
| `source_config.refresh_type`                | String            | The type of refresh applied to the source. Example: `FULL`.                                                     |
| `source_config.last_refreshed_user`         | String or Null    | The user who last refreshed the source. Example: `null`.                                                        |
| `source_config.last_refreshed_time`         | String (DateTime) | The date and time when the source was last refreshed. Example: `2024-07-24T23:01:19.338184Z`.                   |

### Example request for IOC_UPLOAD type

PUT _plugins/_security_analytics/threat_intel/sources/
```json
{
 "_id": "2c0u7JAB9IJUg27gcjUp",
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

### Example response for IOC_UPLOAD type

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
---

## Get threat intelligence source API

The Get Threat intelligence Source API retrieves the threat intelligence source configuration details. Use the mandatory path parameter threat intelligence source ID.

### Parameters

You can specify the following filtering parameters when listing threat intelligence sources.

```
GET /_plugins/_security_analytics/threat_intel/sources/a-jnfjkAF_uQjn8Weo4
```

### Example request

```
GET /_plugins/_security_analytics/threat_intel/sources/<threat intelligence source Id>
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

## Search Threat intelligence Sources API

The Search Threat intelligence Sources API searches for threat intelligence source matches based on search query passed.

The request expects a search source similar to the _search query in OpenSearch.

### Example request

    **Threat intelligence source config type**
POST /_plugins/_security_analytics/threat_intel/sources/_search
```json
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
## Delete threat intelligence source API

This API uses the threat intelligence source ID to specify and delete a threat intelligence source.

### Path and HTTP methods

```
DELETE /_plugins/_security_analytics/threat_intel/sources/IJAXz4QBrmVplM4JYxx_
```

### Example request

```
DELETE /_plugins/_security_analytics/threat_intel/sources/<threat_intel_source Id>
```
{% include copy-curl.html %}

### Example response

```json
{
  "_id": "2c0u7JAB9IJUg27gcjUp"
}
```
---
## Refresh threat intelligence source API

This API uses the threat intelligence source ID to donwload the iocs from a threat intelligence source on-demand. Only supported for S3_CUSTOM type source.

### Path and HTTP methods

```
POST /_plugins/_security_analytics/threat_intel/sources/<threat_intel_source Id>/_refresh
```

### Example request

```
POST /_plugins/_security_analytics/threat_intel/sources/IJAXz4QBrmVplM4JYxx_/_refresh
```
{% include copy-curl.html %}

### Example response

```json
{
 "acknowledged": true
}
```
