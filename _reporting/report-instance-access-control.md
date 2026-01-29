---
layout: default
title: Report instance access control
nav_order: 20
---

# Report instance access control

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).
{: .warning}

Reporting plugin integrates with the Security plugin's resource sharing and access control framework to provide document-level authorization for workflow records. This replaces the legacy `plugins.alerting.filter_by_backend_roles` setting with a more flexible sharing system that allows resource owners to grant specific access levels to users, roles, or backend roles.

For the end-to-end framework concepts and APIs, see [Resource sharing and access control]({{site.url}}{{site.baseurl}}/security/access-control/resources/).
{: .note}

## Resource configuration

The following table describes the workflow resource configuration.

| Field | Value                             |
| :--- |:----------------------------------|
| Resource type | `report-instance`               |
| System index | `.opendistro-reports-instances` |
| Onboarded version | OpenSearch 3.5                    |

When resource-level authorization is enabled for report-instances, each report-instance's visibility is governed by a central sharing record. Resource owners and users with sharing capabilities can grant or revoke access permissions for specific users, roles, or backend roles.

## Enable report instance resource sharing

To enable resource sharing for report-instance, you must add the report-instance resource type to the protected types list and enable resource sharing cluster-wide.

Admin-only: These settings can be configured only by cluster administrators with superadmin privileges.
{: .important }

### Configuration using opensearch.yml

Add the following settings to your `opensearch.yml` configuration file to enable resource sharing for report-instances:

```yaml
plugins.security.experimental.resource_sharing.enabled: true
plugins.security.system_indices.enabled: true
plugins.security.experimental.resource_sharing.protected_types:
  - "report-instance"
```
{% include copy.html %}

### Configuration using the Cluster Settings API

Alternatively, you can enable resource sharing dynamically using the Cluster Settings API:

```json
PUT _cluster/settings
{
  "transient": {
    "plugins.security.experimental.resource_sharing.enabled": true,
    "plugins.security.experimental.resource_sharing.protected_types": ["report-instance"]
  }
}
```
{% include copy-curl.html %}

When adding the report-instance resource type to an existing configuration, include all previously configured resource types in the `protected_types` array.
{: .note}

## Report instance access levels

Reporting plugin provides the following predefined access levels for report-instance documents. These access levels determine the specific permissions granted to users who have been granted access to a report-instance resource.

### ri_read_only

The `ri_read_only` read-only access level grants users the ability to view and search shared report-instances but not modify them. This access level includes the following permissions:

```yaml
- "cluster:admin/opendistro/reports/instance/get"
- "cluster:admin/opendistro/reports/instance/list"
- "cluster:admin/opendistro/reports/menu/download"
```
{% include copy.html %}

### ri_read_write

The `ri_read_write` read-write access level grants users full access to report-instance operations except for sharing capabilities. This access level includes all read permissions plus write operations:

```yaml
- "cluster:admin/opendistro/reports/instance/*"
- "cluster:admin/opendistro/reports/menu/download"
```
{% include copy.html %}

### ri_full_access

The `ri_full_access` full access level grants users complete control over a report-instance, including owner-like permissions such as sharing the resource with other users. This access level includes all report-instance operations plus resource sharing permissions:

```yaml
- "cluster:admin/opendistro/reports/instance/*"
- "cluster:admin/opendistro/reports/menu/download"
- "cluster:admin/security/resource/share"
```
{% include copy.html %}

These access levels are predefined and cannot be modified. To request additional access levels, create an issue in the [Flow Framework GitHub repository](https://github.com/opensearch-project/flow-framework/).
{: .note}

## Migrating from the legacy framework

After enabling resource sharing and marking report-instances as a protected resource type, cluster administrators must run the migration API to transfer existing report-instance sharing information from the legacy framework to the new resource sharing system.

Admin-only: The Migrate API can only be executed by cluster administrators with superadmin or REST admin privileges.
{: .important }

Use the following API call to migrate legacy report-instance sharing data to the resource sharing framework:

```json
POST _plugins/_security/api/resources/migrate
{
  "source_index": ".opendistro-reports-instances",
  "username_path": "/user/name",
  "backend_roles_path": "/user/backend_roles",
  "default_owner": "<replace-with-existing-user>",
  "default_access_level": {
    "report-instance": "<select-appropriate-access-level>"
  }
}
```
{% include copy-curl.html %}

Replace `<replace-with-existing-user>` with the username of an existing user who should own report-instances without explicit ownership information. Replace `<select-appropriate-access-level>` with one of the available report-instance access levels: `ri_read_only`, `ri_read_write`, or `ri_full_access`.

## Related documentation

- [Resource sharing and access control]({{site.url}}{{site.baseurl}}/security/access-control/resources/) -- Backend concepts, configuration, and setup
- [Resource sharing APIs]({{site.url}}{{site.baseurl}}/security/access-control/resource-sharing-api/) -- REST API reference for programmatic management
- [Resource access management]({{site.url}}{{site.baseurl}}/dashboards/management/resource-sharing/) -- UI workflows and user guidance
- [Report instance access control]({{site.url}}{{site.baseurl}}/reporting/report-instance-access-control/) -- Access control for report-instances