---
layout: default
title: Resource sharing and access control
parent: Access control
nav_order: 110
has_children: true
has_toc: false
---

# Resource sharing and access control

**Introduced 3.3**
{: .label .label-purple }

The resource sharing and access control framework in the OpenSearch Security plugin provides *document-level*, fine-grained access management for plugin-defined resources. It extends OpenSearch's existing role-based access control by letting resource owners explicitly share individual resources with other principals.

A _resource_ is a document stored in a plugin's system index. Resource sharing information is stored in a central security-managed system index.

Resource sharing requires coordination between plugin developers, administrators, and users. Plugin developers must first implement resource sharing support in their plugins and define the resource types that can be shared (such as `ml-model-group` or `anomaly-detector`). Once plugins with resource sharing support are installed, administrators enable the feature cluster-wide and configure the resource types that use resource-level authorization. Finally, users can create and share resources through the UI or APIs, provided they have the necessary cluster permissions.

This documentation is intended for **users** and **administrators** who want to configure and use resource sharing. If you are a **plugin developer** implementing resource sharing support for your plugin, see the [developer documentation](https://github.com/opensearch-project/security/blob/main/docs/RESOURCE_SHARING_AND_ACCESS_CONTROL.md).

Resource sharing enables the following operations:

- **Resource owners** can share or revoke access to their resources.
- **Resource owners** can allow users with share permission to redistribute access.
- **Administrators** with superadmin privileges can view and manage all shareable resources.
- **All users** can search resource indexes with automatic per-user filtering applied by the Security plugin.

## Configuring resource sharing

Resource sharing is disabled by default. To configure resource sharing, follow these steps.

Before configuring resource sharing, ensure that the plugins you want to use with resource sharing have implemented resource sharing support. If you need to add resource sharing support to a plugin, see the [developer documentation](https://github.com/opensearch-project/security/blob/main/docs/RESOURCE_SHARING_AND_ACCESS_CONTROL.md).
{: .note}

### Step 1: Enable resource sharing

To enable resource sharing, add the following settings to the `opensearch.yml` file:

```yaml
plugins.security.resource_sharing.enabled: true
plugins.security.system_indices.enabled: true
```
{% include copy.html %}

Settings added to `opensearch.yml` take effect after a cluster restart. To update both resource sharing settings without restarting the cluster, use the Cluster Settings API:

```json
PUT _cluster/settings
{
  "transient": {
    "plugins.security.resource_sharing.enabled": true,
    "plugins.security.resource_sharing.protected_types": ["monitor", "alerting-workflow"]
  }
}
```
{% include copy-curl.html security=true %}

### Step 2: Configure protected resource types

Specify the resource types that use resource-level authorization by listing them in the protected types configuration. This setting determines the plugin-defined resources that use the sharing and access control framework:

```yaml
plugins.security.resource_sharing.protected_types: ["monitor", "alerting-workflow"]
```
{% include copy.html %}

The resource types you specify must exactly match the resource types supported by your installed plugins. To discover the resource types available in your cluster, follow these steps:

1. **Enable resource sharing** with an empty `protected_types` configuration initially.
2. **Use the [List resource types API]({{site.url}}{{site.baseurl}}/security/access-control/resource-sharing-api/#list-resource-types)** to discover all available resource types for your installed plugins.
3. **Update your `protected_types` configuration** with the resource types you want to enable.

#### Resource types that share an index

Starting with OpenSearch 3.10, the `plugins.security.resource_sharing.protected_types` setting must include either all or none of the registered resource types that share the same resource index. Types stored in different indexes can be configured independently. This rule applies even when `plugins.security.resource_sharing.enabled` is `false`.

For example, Alerting registers `monitor` and `alerting-workflow` for the `.opendistro-alerting-config` index. To protect Alerting resources, include both types. Specifying only `monitor` or only `alerting-workflow` is invalid. To stop protecting Alerting resources, remove both types from the list.

The Security plugin validates this configuration at startup and when you update it through the Cluster Settings API. If `opensearch.yml` contains a partial list, the node does not start. If a Cluster Settings API request contains a partial list, the request is rejected. The error identifies the resource index and the missing types. Rejected updates leave the existing configuration unchanged.

Both persistent and transient settings must satisfy this rule. An invalid persistent value is rejected even if a transient value would override it. The new list replaces the previous value, so include every resource type that you want to protect.

Before upgrading to OpenSearch 3.10 or later, check `opensearch.yml` and your persistent and transient cluster settings for partial lists. Add the missing types for each index you want to keep protected. If a plugin upgrade registers another resource type for an already protected index, add that type to the list as part of the upgrade.
{: .warning}

Resource types are grouped by the index that each installed plugin declares for them. Index aliases are not resolved, and documents in a resource index that are not associated with a resource type registered by an installed plugin are not included. Install the same plugins on all nodes, including cluster manager nodes. For the resource types that share an index, see the plugin documentation.

## Resource types by plugin

The following table describes the resource types registered by the plugins that support resource sharing. Each plugin's page describes the access levels for its resource types and the steps for migrating from the legacy backend role filtering settings.

| Plugin | Resource types | Plugin documentation |
| :--- | :--- | :--- |
| Alerting | `monitor`, `alerting-workflow` | [Alerting resource access control]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/alerting-access-control/) |
| Anomaly Detection | `anomaly-detector` | [Anomaly detector access control]({{site.url}}{{site.baseurl}}/observing-your-data/ad/detector-access-control/) |
| Anomaly Detection | `forecaster` | [Forecaster access control]({{site.url}}{{site.baseurl}}/observing-your-data/forecast/forecaster-access-control/) |
| Flow Framework | `workflow` | [Workflow access control]({{site.url}}{{site.baseurl}}/automating-configurations/workflow-access-control/) |
| Flow Framework | `workflow-state` | [Workflow state access control]({{site.url}}{{site.baseurl}}/automating-configurations/workflow-state-access-control/) |
| ML Commons | `ml-model-group` | [Model access control through resource sharing]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-sharing-access-control/) |
| Notifications | `notification_config` | [Notification access control]({{site.url}}{{site.baseurl}}/observing-your-data/notifications/notification-access-control/) |
| Reporting | `report-definition` | [Report definition access control]({{site.url}}{{site.baseurl}}/reporting/report-definition-access-control/) |
| Reporting | `report-instance` | [Report instance access control]({{site.url}}{{site.baseurl}}/reporting/report-instance-access-control/) |
| Security Analytics | `detector`, `correlation-rule` | [Security Analytics resource access control]({{site.url}}{{site.baseurl}}/security-analytics/resource-access-control/) |

The Security Analytics `detector` resource type is distinct from the Anomaly Detection `anomaly-detector` resource type, and the Alerting `alerting-workflow` resource type is distinct from the Flow Framework `workflow` resource type.
{: .note}

### Production resource types that share an index

The following production resource types share an index and must be protected together:

| Index | Resource types |
| :--- | :--- |
| `.opendistro-alerting-config` | Alerting `monitor`, `alerting-workflow` |

Installed plugin versions determine the resource registrations in a cluster. Use the [List resource types API]({{site.url}}{{site.baseurl}}/security/access-control/resource-sharing-api/#list-resource-types) to verify the current resource types before changing `protected_types`.

The following is an example configuration that protects the ML Commons and Anomaly Detection resource types:

```yaml
plugins.security.resource_sharing.protected_types: ["ml-model-group", "anomaly-detector", "forecaster"]
```
{% include copy.html %}

## Required permissions

To access shared resources through plugin APIs, users need cluster-level permissions for those specific plugins. Administrators should configure appropriate roles in `roles.yml`. The following example shows the configuration for a `sample-resource-plugin`:

```yaml
sample_full_access:
  cluster_permissions:
    - 'cluster:admin/sample-resource-plugin/*'

sample_read_access:
  cluster_permissions:
    - 'cluster:admin/sample-resource-plugin/get'
```
{% include copy.html %}

Resource sharing does not automatically grant API access. To access a resource using the API, users must have both:

1. Cluster permissions for the plugin APIs.
2. Resources shared with them through the sharing APIs.

## Data model

All sharing metadata (listed in the following table) is stored in a dedicated *security-owned* system index.

| Field         | Description                                    |
|:---|:---|
| `resource_id` | The unique identifier of the resource.              |
| `created_by`  | The resource creator username (and tenant, if applicable).    |
| `share_with`  | The mapping of action groups to allowed principals. |
| `source_idx`  | The resource index managed by the plugin.           |

The following example shows a resource with ID `model-group-123` created by the user `bob` in the `analytics` tenant. The resource is shared with specific users, roles, and backend roles with read-only access:

```json
{
  "resource_id": "model-group-123",
  "created_by": {
    "user": "bob",
    "tenant": "analytics"
  },
  "share_with": {
    "read_only": {
      "users": ["alice"],
      "roles": ["data_viewer"],
      "backend_roles": ["analytics_backend"]
    }
  }
}
```
{% include copy.html %}

In this example:

- At read-only level:

 - Users: `alice` can access the resource.

 - Roles: Any user assigned the `data_viewer` role can access the resource.

 - Backend roles: Any user mapped to the `analytics_backend` backend role can access the resource.

To make this resource public, set `users` to `["*"]`:

```json
PATCH _plugins/_security/api/resource/share
{
  "resource_id": "model-group-123",
  "resource_type": "ml-model-group",
  "add": {
    "read_only": { "users": ["*"] }
  }
}
```
{% include copy-curl.html security=true %}

To keep a resource private, make the `share_with` object empty:

```json
PUT _plugins/_security/api/resource/share
{
  "resource_id": "model-group-123",
  "resource_type": "ml-model-group",
  "share_with": {}
}
```
{% include copy-curl.html security=true %}

## REST APIs

You can use resource sharing API operations to share resources, manage access permissions, and automate resource sharing workflows.

For complete API documentation, see [Resource sharing APIs]({{site.url}}{{site.baseurl}}/security/access-control/resource-sharing-api/).

## Requirements and limitations

To ensure proper resource sharing and access control, the following requirements and limitations apply:

* Only resource owners, superadmins, or users explicitly granted sharing permissions can share or revoke access.
* All resources must reside in system indexes.
* System index protection must be enabled.
* Users still require plugin-level cluster permissions, including permission to create resources.
* Action groups must be defined in the plugin configuration.

## Best practices

When managing resource sharing, administrators should follow these best practices:

- Enable resource sharing on new clusters before usage.

- Keep system index protection enabled.

- Share resources minimally and explicitly to maintain security and control.

## Related documentation

- [Resource sharing APIs]({{site.url}}{{site.baseurl}}/security/access-control/resource-sharing-api/) -- REST API reference for programmatic management
- [Resource access management]({{site.url}}{{site.baseurl}}/dashboards/management/resource-sharing/) -- UI workflows and user guidance
- [Resource types by plugin](#resource-types-by-plugin) -- Per-plugin access levels and migration steps
- [Developer documentation](https://github.com/opensearch-project/security/blob/main/docs/RESOURCE_SHARING_AND_ACCESS_CONTROL.md) -- Detailed technical documentation for plugin developers, users, and administrators
