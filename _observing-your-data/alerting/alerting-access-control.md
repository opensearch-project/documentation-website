---
layout: default
title: Alerting resource access control
nav_order: 12
parent: Alerting
has_children: false
---

# Alerting resource access control

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).
{: .warning}

Alerting integrates with the Security plugin's resource sharing and access control framework to provide document-level authorization for monitors and workflows. This replaces the legacy `plugins.alerting.filter_by_backend_roles` setting with a more flexible sharing system that allows resource owners to grant specific access levels to users, roles, or backend roles.

For the end-to-end framework concepts and APIs, see [Resource sharing and access control]({{site.url}}{{site.baseurl}}/security/access-control/resources/).
{: .note}

## Resource configuration

Alerting registers two resource types, both stored in the alerting configuration index.

| Field | Value |
| :--- | :--- |
| Resource type | `monitor` |
| Resource type | `alerting-workflow` |
| System index | `.opendistro-alerting-config` |
| Onboarded version | OpenSearch 3.8 |

The workflow resource type is named `alerting-workflow` (not `workflow`) to avoid colliding with the `workflow` resource type registered by the Flow Framework plugin. Both types share the `.opendistro-alerting-config` index; the framework distinguishes them by the document's own fields.

When resource-level authorization is enabled, each monitor's and workflow's visibility is governed by a central sharing record. Resource owners and users with sharing capabilities can grant or revoke access permissions for specific users, roles, or backend roles.

Alerts and comments are subordinate to their monitor: they are not registered resource types, and access to them is derived from access to the monitor that produced them. A user who can access a monitor can read its alerts; adding a comment requires monitor access at the read-write or full-access level.

## Enable alerting resource sharing

To enable resource sharing for alerting, add the alerting resource types to the protected types list and enable resource sharing cluster-wide.

Admin-only: These settings can be configured only by cluster administrators with superadmin privileges.
{: .important }

### Configuration using opensearch.yml

Add the following settings to your `opensearch.yml` configuration file to enable resource sharing for alerting:

```yaml
plugins.security.experimental.resource_sharing.enabled: true
plugins.security.system_indices.enabled: true
plugins.security.experimental.resource_sharing.protected_types:
  - "monitor"
  - "alerting-workflow"
```
{% include copy.html %}

### Configuration using the Cluster Settings API

Alternatively, you can enable resource sharing dynamically using the Cluster Settings API:

```json
PUT _cluster/settings
{
  "transient": {
    "plugins.security.experimental.resource_sharing.enabled": true,
    "plugins.security.experimental.resource_sharing.protected_types": ["monitor", "alerting-workflow"]
  }
}
```
{% include copy-curl.html %}

When adding the alerting resource types to an existing configuration, include all previously configured resource types in the `protected_types` array.
{: .note}

## Alerting access levels

Alerting provides three predefined access levels that apply to both the `monitor` and `alerting-workflow` resource types. These access levels determine the specific permissions granted to users who have been granted access to a monitor or workflow resource.

### alerting_read_only

The `alerting_read_only` read-only access level grants users the ability to view and search shared monitors, workflows, and their alerts, but not modify them. This access level includes the following permissions:

```yaml
- 'cluster:admin/opendistro/alerting/monitor/get'
- 'cluster:admin/opendistro/alerting/monitor/search'
- 'cluster:admin/opendistro/alerting/alerts/get'
- 'cluster:admin/opensearch/alerting/workflow/get'
- 'cluster:admin/opensearch/alerting/workflow_alerts/get'
- 'cluster:admin/opensearch/alerting/findings/get'
- 'cluster:admin/opendistro/alerting/destination/get'
```
{% include copy.html %}

### alerting_read_write

The `alerting_read_write` read-write access level grants users full access to monitor and workflow operations, including alerts and comments, except for sharing capabilities. This access level includes all read permissions plus write operations:

```yaml
- 'cluster:admin/opendistro/alerting/monitor/*'
- 'cluster:admin/opensearch/alerting/workflow/*'
- 'cluster:admin/opendistro/alerting/alerts/*'
- 'cluster:admin/opensearch/alerting/workflow_alerts/*'
- 'cluster:admin/opensearch/alerting/findings/*'
- 'cluster:admin/opendistro/alerting/destination/*'
- 'cluster:admin/opensearch/alerting/comments/*'
```
{% include copy.html %}

### alerting_full_access

The `alerting_full_access` full access level grants users complete control over a monitor or workflow, including owner-like permissions such as sharing the resource with other users. This access level includes all alerting operations plus resource sharing permissions:

```yaml
- 'cluster:admin/opendistro/alerting/monitor/*'
- 'cluster:admin/opensearch/alerting/workflow/*'
- 'cluster:admin/opendistro/alerting/alerts/*'
- 'cluster:admin/opensearch/alerting/workflow_alerts/*'
- 'cluster:admin/opensearch/alerting/findings/*'
- 'cluster:admin/opendistro/alerting/destination/*'
- 'cluster:admin/opensearch/alerting/comments/*'
- 'cluster:admin/opensearch/alerting/remote/indexes/get'
- 'cluster:admin/security/resource/share'
```
{% include copy.html %}

These access levels are predefined and cannot be modified. To request additional access levels, create an issue in the [Alerting GitHub repository](https://github.com/opensearch-project/alerting/).
{: .note}

## Migrating from the legacy framework

After enabling resource sharing and marking the alerting resource types as protected, cluster administrators must run the migration API to transfer existing monitor and workflow sharing information from the legacy framework to the new resource sharing system.

Admin-only: The Migrate API can only be executed by cluster administrators with superadmin or REST admin privileges.
{: .important }

Both alerting resource types are stored in the same index and store owner information under different paths (`monitor.user` and `workflow.user`). Alerting declares these per-type paths on its resource providers, so the framework reads the owner from the correct path for each document. The request-level `username_path` and `backend_roles_path` remain required and are used as a fallback.

Use the following API call to migrate legacy alerting sharing data to the resource sharing framework:

```json
POST _plugins/_security/api/resources/migrate
{
  "source_index": ".opendistro-alerting-config",
  "username_path": "/monitor/user/name",
  "backend_roles_path": "/monitor/user/backend_roles",
  "default_owner": "<replace-with-existing-user>",
  "default_access_level": {
    "monitor": "<select-appropriate-access-level>",
    "alerting-workflow": "<select-appropriate-access-level>"
  }
}
```
{% include copy-curl.html %}

Replace `<replace-with-existing-user>` with the username of an existing user who should own monitors and workflows without explicit ownership information. Replace `<select-appropriate-access-level>` with one of the available alerting access levels: `alerting_read_only`, `alerting_read_write`, or `alerting_full_access`.

## Related documentation

- [Resource sharing and access control]({{site.url}}{{site.baseurl}}/security/access-control/resources/) -- Backend concepts, configuration, and setup
- [Resource sharing APIs]({{site.url}}{{site.baseurl}}/security/access-control/resource-sharing-api/) -- REST API reference for programmatic management
