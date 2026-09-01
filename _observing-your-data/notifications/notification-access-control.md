---
layout: default
title: Notification access control
nav_order: 30
parent: Notifications
has_children: false
---

# Notification access control

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).
{: .warning}

Notifications integrates with the Security plugin's resource sharing and access control framework to provide document-level authorization for notification configurations. A notification configuration is the underlying document for a channel, so sharing a configuration controls access to the corresponding channel. This replaces the legacy `opensearch.notifications.general.filter_by_backend_roles` setting with a more flexible sharing system that allows resource owners to grant specific access levels to users, roles, or backend roles.

For the end-to-end framework concepts and APIs, see [Resource sharing and access control]({{site.url}}{{site.baseurl}}/security/access-control/resources/).
{: .note}

## Resource configuration

The following table describes the notification configuration resource.

| Field | Value |
| :--- | :--- |
| Resource type | `notification_config` |
| System index | `.opensearch-notifications-config` |
| Onboarded version | OpenSearch 3.8 |

When resource-level authorization is enabled, each notification configuration's visibility is governed by a central sharing record. Resource owners and users with sharing capabilities can grant or revoke access permissions for specific users, roles, or backend roles.

## Enable notification resource sharing

To enable resource sharing for notifications, add the notification configuration resource type to the protected types list and enable resource sharing cluster-wide.

Admin-only: These settings can be configured only by cluster administrators with superadmin privileges.
{: .important }

### Configuration using opensearch.yml

Add the following settings to your `opensearch.yml` configuration file to enable resource sharing for notifications:

```yaml
plugins.security.experimental.resource_sharing.enabled: true
plugins.security.system_indices.enabled: true
plugins.security.experimental.resource_sharing.protected_types:
  - "notification_config"
```
{% include copy.html %}

### Configuration using the Cluster Settings API

Alternatively, you can enable resource sharing dynamically using the Cluster Settings API:

```json
PUT _cluster/settings
{
  "transient": {
    "plugins.security.experimental.resource_sharing.enabled": true,
    "plugins.security.experimental.resource_sharing.protected_types": ["notification_config"]
  }
}
```
{% include copy-curl.html %}

When adding the notification configuration resource type to an existing configuration, include all previously configured resource types in the `protected_types` array.
{: .note}

## Notification access levels

Notifications provides three predefined access levels for notification configuration documents. These access levels determine the specific permissions granted to users who have been granted access to a notification configuration resource.

### notifications_read_only

The `notifications_read_only` read-only access level grants users the ability to view shared notification configurations and channels but not modify them. This access level includes the following permissions:

```yaml
- 'cluster:admin/opensearch/notifications/configs/get'
- 'cluster:admin/opensearch/notifications/channels/get'
- 'cluster:admin/opensearch/notifications/features'
```
{% include copy.html %}

### notifications_read_write

The `notifications_read_write` read-write access level grants users full access to notification configuration operations except for sharing capabilities. This access level includes all read permissions plus write and send operations:

```yaml
- 'cluster:admin/opensearch/notifications/configs/*'
- 'cluster:admin/opensearch/notifications/channels/get'
- 'cluster:admin/opensearch/notifications/features'
- 'cluster:admin/opensearch/notifications/feature/send'
- 'cluster:admin/opensearch/notifications/test_notification'
```
{% include copy.html %}

### notifications_full_access

The `notifications_full_access` full access level grants users complete control over a notification configuration, including owner-like permissions such as sharing the resource with other users. This access level includes all notification operations plus resource sharing permissions:

```yaml
- 'cluster:admin/opensearch/notifications/configs/*'
- 'cluster:admin/opensearch/notifications/channels/get'
- 'cluster:admin/opensearch/notifications/features'
- 'cluster:admin/opensearch/notifications/feature/send'
- 'cluster:admin/opensearch/notifications/test_notification'
- 'cluster:admin/security/resource/share'
```
{% include copy.html %}

These access levels are predefined and cannot be modified. To request additional access levels, create an issue in the [Notifications GitHub repository](https://github.com/opensearch-project/notifications/).
{: .note}

## Migrating from the legacy framework

After enabling resource sharing and marking the notification configuration resource type as protected, cluster administrators must run the migration API to transfer existing notification sharing information from the legacy framework to the new resource sharing system.

Admin-only: The Migrate API can only be executed by cluster administrators with superadmin or REST admin privileges.
{: .important }

Notification configuration documents track their authorized backend roles under `metadata.access` and do not store a per-user owner. Set `backend_roles_path` to `/metadata/access`. The `username_path` parameter is required by the API, but because notification documents have no owner name, the path does not resolve to a value, and ownership falls back to `default_owner`.

Use the following API call to migrate legacy notification sharing data to the resource sharing framework:

```json
POST _plugins/_security/api/resources/migrate
{
  "source_index": ".opensearch-notifications-config",
  "username_path": "/metadata/owner",
  "backend_roles_path": "/metadata/access",
  "default_owner": "<replace-with-existing-user>",
  "default_access_level": {
    "notification_config": "<select-appropriate-access-level>"
  }
}
```
{% include copy-curl.html %}

Replace `<replace-with-existing-user>` with the username of an existing user who should own notification configurations. Because notification documents do not carry an owner name, every migrated configuration is attributed to this user. Replace `<select-appropriate-access-level>` with one of the available notification access levels: `notifications_read_only`, `notifications_read_write`, or `notifications_full_access`.

## Related documentation

- [Resource sharing and access control]({{site.url}}{{site.baseurl}}/security/access-control/resources/) -- Backend concepts, configuration, and setup
- [Resource sharing APIs]({{site.url}}{{site.baseurl}}/security/access-control/resource-sharing-api/) -- REST API reference for programmatic management
- [Resource access management]({{site.url}}{{site.baseurl}}/dashboards/management/resource-sharing/) -- UI workflows and user guidance
