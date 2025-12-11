---
layout: default
title: Forecaster access control
parent: Forecasting
nav_order: 50
has_children: false
---

# Forecaster access control

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).
{: .warning}

The forecaster resource integrates with the Security plugin's resource sharing and access control framework to provide document-level authorization for forecaster resources. This replaces the legacy `plugins.forecast.filter_by_backend_roles` setting with a more flexible sharing system that allows resource owners to grant specific access levels to users, roles, or backend roles.

For the end-to-end framework concepts and APIs, see [Resource sharing and access control]({{site.url}}{{site.baseurl}}/security/access-control/resources/).
{: .note}

## Resource configuration

The following table describes the forecaster resource configuration:

| Field | Value |
| :--- | :--- |
| Resource type | `forecaster` |
| System index | `.opensearch-forecasters` |
| Onboarded version | OpenSearch 3.3 |

When resource-level authorization is enabled for forecasters, each forecaster's visibility is governed by a central sharing record. Resource owners and users with sharing capabilities can grant or revoke access permissions for specific users, roles, or backend roles.

## Enable forecaster resource sharing

To enable resource sharing for forecasters, you must add the forecaster resource type to the protected types list and enable resource sharing cluster-wide.

Admin-only: These settings can be configured only by cluster administrators with superadmin privileges.
{: .important }

### Configuration using opensearch.yml

Add the following settings to your `opensearch.yml` configuration file to enable resource sharing for forecasters:

```yaml
plugins.security.experimental.resource_sharing.enabled: true
plugins.security.system_indices.enabled: true
plugins.security.experimental.resource_sharing.protected_types:
  - "forecaster"
```
{% include copy.html %}

### Configuration using cluster settings API

Alternatively, you can enable resource sharing dynamically using the Cluster Settings API:

```json
PUT _cluster/settings
{
  "transient": {
    "plugins.security.experimental.resource_sharing.enabled": true,
    "plugins.security.experimental.resource_sharing.protected_types": ["forecaster"]
  }
}
```
{% include copy-curl.html %}

When adding the forecaster resource type to an existing configuration, include all previously configured resource types in the `protected_types` array.
{: .note}

## Forecaster access levels

The forecaster plugin provides three predefined access levels for forecaster documents. These access levels determine the specific permissions granted to users who have been granted access to a forecaster resource.

### forecast_read_only

The `forecast_read_only` read-only access level grants users the ability to view and search shared forecasters but not modify them. This access level includes the following permissions:

```yaml
- 'cluster:admin/plugin/forecast/forecaster/info'
- 'cluster:admin/plugin/forecast/forecaster/stats'
- 'cluster:admin/plugin/forecast/forecaster/suggest'
- 'cluster:admin/plugin/forecast/forecaster/validate'
- 'cluster:admin/plugin/forecast/forecasters/get'
- 'cluster:admin/plugin/forecast/forecasters/info'
- 'cluster:admin/plugin/forecast/result/topForecasts'
```
{% include copy.html %}

### forecast_read_write

The `forecast_read_write` read-write access level grants users full access to forecaster operations except for sharing capabilities. This access level includes all read permissions plus write operations:

```yaml
- 'cluster:admin/plugin/forecast/*'
- 'cluster:monitor/*'
- 'cluster:admin/settings/update'
```
{% include copy.html %}

### forecast_full_access

The `forecast_full_access` full access level grants users complete control over a forecaster, including owner-like permissions such as sharing the resource with other users. This access level includes all forecaster operations plus resource sharing permissions:

```yaml
- 'cluster:admin/plugin/forecast/*'
- 'cluster:monitor/*'
- 'cluster:admin/settings/update'
- "cluster:admin/security/resource/share"
```
{% include copy.html %}

These access levels are predefined and cannot be modified. To request additional access levels, file an issue in the [Anomaly Detection GitHub repository](https://github.com/opensearch-project/anomaly-detection/).
{: .note}

## Migrating from legacy framework

After enabling resource sharing and marking forecasters as a protected resource type, cluster administrators must run the migration API to transfer existing forecaster sharing information from the legacy framework to the new resource sharing system.

Admin-only: The Migrate API can only be executed by cluster administrators with superadmin or REST admin privileges.
{: .important }

Use the following API call to migrate legacy forecaster sharing data to the resource sharing framework:

```json
POST _plugins/_security/api/resources/migrate
{
  "source_index": ".opensearch-forecasters",
  "username_path": "/user/name",
  "backend_roles_path": "/user/backend_roles",
  "default_owner": "<replace-with-existing-user>",
  "default_access_level": {
    "forecaster": "<select-appropriate-access-level>"
  }
}
```
{% include copy-curl.html %}

Replace `<replace-with-existing-user>` with the username of an existing user who should own forecasters without explicit ownership information. Replace `<select-appropriate-access-level>` with one of the available forecaster access levels: `forecast_read_only`, `forecast_read_write`, or `forecast_full_access`.

## Related documentation

- [Resource sharing and access control]({{site.url}}{{site.baseurl}}/security/access-control/resources/) -- Backend concepts, configuration, and setup
- [Resource sharing APIs]({{site.url}}{{site.baseurl}}/security/access-control/resource-sharing-api/) -- REST API reference for programmatic management
- [Resource access management]({{site.url}}{{site.baseurl}}/dashboards/management/resource-sharing/) -- UI workflows and user guidance