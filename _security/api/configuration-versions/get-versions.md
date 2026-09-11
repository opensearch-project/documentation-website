---
layout: default
title: Get security configuration versions
parent: Security configuration version APIs
grand_parent: Security APIs
nav_order: 10
---

# Get Security Configuration Versions API
**Introduced 3.3**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).
{: .warning}

Retrieves the saved versions of the security configuration. Specify a version ID to retrieve one version, or omit it to retrieve all versions.

This API returns results only when versioning is enabled. For more information, see [Security configuration version APIs]({{site.url}}{{site.baseurl}}/security/api/configuration-versions/).

## Endpoints

```json
GET /_plugins/_security/api/versions
GET /_plugins/_security/api/version/{version_id}
```

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `version_id` | String | The version to retrieve, specified as `v` followed by a number, such as `v1` or `v2`. If omitted, the response contains all retained versions. |

## Example request

The following request retrieves all retained versions:

```json
GET /_plugins/_security/api/versions
```
{% include copy-curl.html security=true %}

The following request retrieves the `v2` version:

```json
GET /_plugins/_security/api/version/v2
```
{% include copy-curl.html security=true %}

## Example response

A request for all versions returns one entry per retained version. The `security_configs` object is abbreviated in the following response:

```json
{
  "versions": [
    {
      "version_id": "v1",
      "timestamp": "2026-09-10T16:45:53.947225761Z",
      "modified_by": "system",
      "security_configs": { ... }
    },
    {
      "version_id": "v2",
      "timestamp": "2026-09-10T16:49:14.553429756Z",
      "modified_by": "system",
      "security_configs": { ... }
    }
  ]
}
```

A request for one version returns only that version. Each key in `security_configs` is a configuration type, and the `configData` object holds the contents of that configuration file as it existed when the version was created. The following response is abbreviated:

```json
{
  "versions": [
    {
      "version_id": "v2",
      "timestamp": "2026-09-10T16:49:14.553429756Z",
      "modified_by": "system",
      "security_configs": {
        "internalusers": {
          "lastUpdated": "2026-09-10T16:49:14.553429756Z",
          "configData": {
            "_meta": {
              "type": "internalusers",
              "config_version": 2
            },
            "admin": {
              "backend_roles": [
                "admin"
              ],
              "opendistro_security_roles": [],
              "static": false,
              "hidden": false,
              "reserved": true,
              "description": "Demo admin user",
              "attributes": {},
              "hash": "$2y$12$cAO5zVKyJTyP7PuQ.cs4g.mxkwaPMmP76Ef8Uu2/l37BLgGzEQXZ2"
            }
          }
        },
        "roles": { ... },
        "rolesmapping": { ... },
        "actiongroups": { ... },
        "tenants": { ... },
        "config": { ... },
        "audit": { ... },
        "allowlist": { ... },
        "nodesdn": { ... }
      }
    }
  ]
}
```

If the requested version does not exist, OpenSearch returns `404 Not Found`:

```json
{
  "status": "NOT_FOUND",
  "message": "Version v99 not found"
}
```

## Response body fields

The response body is a JSON object with the following field.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `versions` | Array of objects | The retained versions of the security configuration, ordered from oldest to newest. |

Each object in `versions` contains the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `version_id` | String | The version identifier, such as `v1`. |
| `timestamp` | String | The time at which OpenSearch created the version, in ISO 8601 format. |
| `modified_by` | String | The user who made the configuration change, or `system` if OpenSearch cannot attribute the change to a user. |
| `security_configs` | Object | A snapshot of the complete security configuration at the time the version was created, keyed by configuration type. |

<details markdown="block">
  <summary>
    Response body fields: <code>security_configs</code>
  </summary>
  {: .text-delta}

Each key in `security_configs` is one of the following configuration types: `actiongroups`, `allowlist`, `audit`, `config`, `internalusers`, `nodesdn`, `roles`, `rolesmapping`, or `tenants`. Each type maps to an object with the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `lastUpdated` | String | The time at which OpenSearch captured this configuration type, in ISO 8601 format. |
| `configData` | Object | The contents of the configuration type, in the same form that the corresponding API returns. For example, the `internalusers` entry lists each user by name, and the `roles` entry lists each role by name. |

</details>
