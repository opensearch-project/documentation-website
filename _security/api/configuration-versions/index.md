---
layout: default
title: Security configuration version APIs
parent: Security APIs
nav_order: 115
has_children: true
has_toc: false
redirect_from:
  - /security/api/configuration-versions/
  - /security/configuration/versioning/
---

# Security configuration version APIs
**Introduced 3.3**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).
{: .warning}

The security configuration version APIs track the history of the Security plugin configuration and restore a previous version of it. Use them to review how the configuration has changed over time and to return the cluster to a known state after an unintended change.

OpenSearch supports the following security configuration version APIs.

| API | Description |
| :--- | :--- |
| [Get Security Configuration Versions API]({{site.url}}{{site.baseurl}}/security/api/configuration-versions/get-versions/) | Retrieves the security configuration version history or a single version by ID. |
| [Roll Back Security Configuration API]({{site.url}}{{site.baseurl}}/security/api/configuration-versions/rollback/) | Restores a previous version of the security configuration. |

## Versioning

OpenSearch creates a version when a security configuration change differs from the most recent saved version. Identical changes do not create a version, so the history contains only meaningful entries.

Each version contains the following information:

- A version ID, such as `v1` or `v2`
- A snapshot of the complete security configuration at the time the version was created
- The time at which the version was created
- The user who made the change, if OpenSearch can attribute the change to a user

A rollback is itself a configuration change, so it creates a new version.

## Enabling versioning

Versioning is disabled by default. To enable it, add the following setting to `opensearch.yml`:

```yaml
plugins.security.configurations_versions.enabled: true
```
{% include copy.html %}

To change the number of retained versions, add the following setting to `opensearch.yml`:

```yaml
plugins.security.config_version.retention_count: 10
```
{% include copy.html %}

Default is `10`. When the cluster reaches the retention limit, OpenSearch removes the oldest version to make room for a new one.

Restart the cluster to apply these settings. For more information, see [Experimental feature flags]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/experimental/).

## Required permissions

These APIs use the same access control as all other Security APIs, so the calling user must be mapped to a role listed in `plugins.security.restapi.roles_enabled`. A user without such a role receives `403 Forbidden`. For more information, see [Access control for the API]({{site.url}}{{site.baseurl}}/security/access-control/api/#access-control-for-the-api).

To control the two operations separately, enable REST API admin permissions and grant a role the following cluster permissions. No built-in role includes them.

| Operation | Required permission |
| :--- | :--- |
| Get versions | `restapi:admin/view_version` |
| Roll back the configuration | `restapi:admin/rollback_version` |

To prevent a role from using either operation, disable the `VIEW_VERSION` or `ROLLBACK_VERSION` endpoint for that role using `plugins.security.restapi.endpoints_disabled`.
