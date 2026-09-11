---
layout: default
title: Roll back security configuration
parent: Security configuration version APIs
grand_parent: Security APIs
nav_order: 20
---

# Roll Back Security Configuration API
**Introduced 3.3**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).
{: .warning}

Restores a previous version of the security configuration. Specify a version ID to roll back to that version, or omit it to roll back to the version immediately preceding the current one.

A rollback replaces the entire security configuration, including users, roles, role mappings, action groups, and tenants. Retrieve the target version with the [Get Security Configuration Versions API]({{site.url}}{{site.baseurl}}/security/api/configuration-versions/get-versions/) and confirm its contents before rolling back.
{: .warning}

A rollback is itself a configuration change, so OpenSearch records a new version for it. For example, rolling back a cluster running `v6` to `v5` leaves the cluster on the `v5` configuration and adds `v7` to the version history.

## Endpoints

```json
POST /_plugins/_security/api/version/rollback
POST /_plugins/_security/api/version/rollback/{version_id}
```

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `version_id` | String | The version to restore, specified as `v` followed by a number, such as `v1` or `v2`. If omitted, OpenSearch restores the version immediately preceding the current one. |

## Example request

The following request restores the preceding version:

```json
POST /_plugins/_security/api/version/rollback
```
{% include copy-curl.html security=true %}

The following request restores the `v2` version:

```json
POST /_plugins/_security/api/version/rollback/v2
```
{% include copy-curl.html security=true %}

## Example response

The response names the version that OpenSearch restored. A cluster running `v6` returns the following response when rolling back to the preceding version:

```json
{
  "status": "OK",
  "message": "config rolled back to version v5"
}
```

A request that names `v2` returns the following response:

```json
{
  "status": "OK",
  "message": "config rolled back to version v2"
}
```

If the requested version does not exist, OpenSearch returns `404 Not Found` and leaves the configuration unchanged:

```json
{
  "status": "NOT_FOUND",
  "message": "Version v99 not found"
}
```

## Response body fields

The response body is a JSON object with the following fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `status` | String | The status of the rollback. `OK` indicates that OpenSearch restored the version. |
| `message` | String | A message naming the version that OpenSearch restored. |
