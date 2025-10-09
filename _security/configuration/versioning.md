---
layout: default
title: Security configuration versioning
parent: Configuration
nav_order: 27
---

# Security Configuration Versioning and Rollback API
**Introduced 3.3**
{: .label .label-purple }

The Security Configuration Versioning and Rollback API provides version control for OpenSearch security configurations, enabling administrators to track changes, maintain audit trails, and restore previous configurations when needed.

This API automatically creates versions when security configurations change, allowing you to track the complete history of security configuration modifications, view detailed information about any previous version, and roll back to any previous configuration version, thus maintaining operational safety.

## How versioning works

The system automatically creates a new version when a security configuration change is detected, the change differs from the most recent saved version, and an administrator makes modifications through supported APIs.

Each version contains a version ID (unique identifier such as `v1`, `v2`), a configuration snapshot (complete security configuration at the time of creation), a timestamp indicating when the version was created, and user information identifying who made the change.

A new version is created **only when a change is detected** compared to the latest saved version. This prevents redundant versions and ensures meaningful version history.

## Enabling versioning

To use the security configuration versioning, you must enable it in your OpenSearch configuration. Add the following setting to your `opensearch.yml` configuration file:

```yaml
plugins.security.configurations_versions.enabled: true
```

Optionally, you can control the number of retained versions by specifying the following setting:

```yaml
plugins.security.config_version.retention_count: 10
```

The default retention count is 10 versions, with a valid range of v1 to vN versions. When the retention limit is reached, the oldest version is automatically removed to make space for new one version

After modifying `opensearch.yml`, restart your OpenSearch cluster for the changes to take effect. For more information, see [Experimental feature flags]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/experimental/).

## Endpoints

```json
GET /_plugins/_security/api/versions
GET /_plugins/_security/api/version/<version_id>
POST /_plugins/_security/api/version/rollback
POST /_plugins/_security/api/version/rollback/<version_id>
```

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `version_id` | String | The version identifier to view or roll back to (for example, `v1`, `v2`). Required for specific version operations. |

## View a specific version

Use this endpoint to retrieve the complete security configuration for a specified version.

### Endpoint

```json
GET /_plugins/_security/api/version/<version_id>
```

### Example request

```json
GET /_plugins/_security/api/version/v2
```
{% include copy-curl.html %}

### Example response

```json
{
  "versions": [
    {
      "version_id": "v2",
      "timestamp": "2025-05-23T06:56:20.081933886Z",
      "modified_by": "admin",
      "security_configs": {...}
    }
  ]
}
```

### Response body fields

The following table lists all response body fields for viewing a specific version.

<!-- fill in the table -->

| Field            | Data type | Description                                                                               |
|:-----------------|:----------|:------------------------------------------------------------------------------------------|
| versions         | Array     | Array of security configuration versions                                                  |
| version_id       | String    | Version of security configuration                                                         |
| timestamp        | Datetime  | Timestamp of security configuration change                                                |
| modified_by      | String    | User who modified security configuration                                                  |
| security_configs | String    | Security configuration for a particular version. It holds all the security configurations |

## View all versions

Use this endpoint to retrieve a list of all available configuration versions.

### Endpoint

```json
GET /_plugins/_security/api/versions
```

### Example request

```json
GET /_plugins/_security/api/versions
```
{% include copy-curl.html %}

### Example response

```json
{
  "versions": [
    {
      "version_id": "v1",
      "timestamp": "2025-05-22T08:46:11.887620466Z",
      "modified_by": "admin",
      "security_configs": {...}
    },
    {
      "version_id": "v2",
      "timestamp": "2025-05-23T06:56:20.081933886Z",
      "modified_by": "admin",
      "security_configs": {...}
    }
  ]
}
```

### Response body fields

The following table lists all response body fields for viewing all versions.

<!-- fill in the table -->

| Field | Data type | Description |
| :--- | :--- | :--- |
| versions         | Array     | Array of security configuration versions                                                  |
| version_id       | String    | Version of security configuration                                                         |
| timestamp        | Datetime  | Timestamp of security configuration change                                                |
| modified_by      | String    | User who modified security configuration                                                  |
| security_configs | String    | Security configuration for a particular version. It holds all the security configurations |

## Roll back to previous version

Use this endpoint to restore the security configuration to the immediately preceding version.

### Endpoint

```json
POST /_plugins/_security/api/version/rollback
```

### Example request

```json
POST /_plugins/_security/api/version/rollback
```
{% include copy-curl.html %}

### Example response

Assuming there are 5 versions and v4 is the preceding version

```json
{
  "status" : "OK",
  "message" : "config rolled back to version v4"
}
```

### Response body fields

The following table lists all response body fields for rollback operations.

| Field | Data type | Description |
| :--- | :--- | :--- |
| status  | String    | Rollback status                   |
| message | String    | Description of rollback operation |

## Roll back to a specific version

Use this endpoint to restore the security configuration to a specified version.

### Endpoint

```json
POST /_plugins/_security/api/version/rollback/<version_id>
```

### Example request

```json
POST /_plugins/_security/api/version/rollback/v2
```
{% include copy-curl.html %}

### Example response

```json
{
  "status" : "OK",
  "message" : "config rolled back to version v2"
}
```

### Response body fields

The following table lists all response body fields for rollback operations.

| Field   | Data type | Description                       |
|:--------|:----------|:----------------------------------|
| status  | String    | Rollback status                   |
| message | String    | Description of rollback operation |

## Required permissions

Ensure that you have the appropriate permissions for the operations you want to perform.

| Operation | Required Permission |
| :--- | :--- |
| View versions | `restapi:admin/view_version` |
| Rollback configuration | `restapi:admin/rollback_version` |

These permissions are included in the default `security_manager` and `all_access` roles.
These API follow same [access control]({{site.url}}{{site.baseurl}}/access-control/api/#access-control-for-the-api) like any other security API.
