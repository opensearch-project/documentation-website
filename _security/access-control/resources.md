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

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).
{: .warning}

The resource sharing and access control framework in the OpenSearch Security plugin provides *document-level*, fine-grained access management for plugin-defined resources. It extends OpenSearch's existing role-based access control by letting resource owners explicitly share individual resources with other principals.

A _resource_ is a document stored in a plugin's system index. Resource sharing information is stored in a central security-managed system index.

Resource sharing requires coordination between plugin developers, administrators, and users. Plugin developers must first implement resource sharing support in their plugins and define the resource types that can be shared (such as `ml-model-group` or `anomaly-detector`). Once plugins with resource sharing support are installed, administrators enable the feature cluster-wide and configure the resource types that use resource-level authorization. Finally, users can create and share resources through the UI or APIs, provided they have the necessary cluster permissions.

This documentation is intended for **users** and **administrators** who want to configure and use resource sharing. If you are a **plugin developer** implementing resource sharing support for your plugin, see the [developer documentation](https://github.com/opensearch-project/security/blob/main/RESOURCE_SHARING_AND_ACCESS_CONTROL.md).

Resource sharing enables the following operations:

- **Resource owners** can share or revoke access to their resources.
- **Resource owners** can allow users with share permission to redistribute access.
- **Administrators** with superadmin privileges can view and manage all shareable resources.
- **All users** can search resource indexes with automatic per-user filtering applied by the Security plugin.

## Configuring resource sharing

Resource sharing is disabled by default. To configure resource sharing, follow these steps.

Before configuring resource sharing, ensure that the plugins you want to use with resource sharing have implemented resource sharing support. If you need to add resource sharing support to a plugin, see the [developer documentation](https://github.com/opensearch-project/security/blob/main/RESOURCE_SHARING_AND_ACCESS_CONTROL.md).
{: .note}

### Step 1: Enable resource sharing

To enable resource sharing, add the following settings to the `opensearch.yml` file:

```yaml
plugins.security.experimental.resource_sharing.enabled: true
plugins.security.system_indices.enabled: true
```
{% include copy.html %}

For more information, see [Experimental feature flags]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/experimental/).

In OpenSearch 3.3, these settings can be updated only through `opensearch.yml` and require a cluster restart. 

Starting with OpenSearch 3.4, you can update both resource sharing settings dynamically without restarting the cluster:

```json
PUT _cluster/settings
{
  "transient": {
    "plugins.security.experimental.resource_sharing.enabled": true,
    "plugins.security.experimental.resource_sharing.protected_types": ["sample-resource"]
  }
}
```
{% include copy-curl.html %}

### Step 2: Configure protected resource types

Specify the resource types that use resource-level authorization by listing them in the protected types configuration. This setting determines the plugin-defined resources that use the sharing and access control framework:

```yaml
plugins.security.experimental.resource_sharing.protected_types: ["sample-resource", "ml-model"]
```
{% include copy.html %}

The resource types you specify must match exactly the resource types supported by your installed plugins. To discover the resource types available in your cluster, follow these steps:

1. **Enable resource sharing** with an empty `protected_types` configuration initially.
2. **Use the [List resource types API]({{site.url}}{{site.baseurl}}/security/access-control/resource-sharing-api/#list-resource-types)** to discover all available resource types from your installed plugins.
3. **Update your `protected_types` configuration** with the resource types you want to enable.

## Example resource types

The following are example resource types available for resource sharing:

- **ML Commons plugin:**
  - `ml-model-group` - Machine learning model groups

- **Anomaly Detection plugin:**
  - `anomaly-detector` - Anomaly detection jobs
  - `forecaster` - Time series forecasting jobs

Example configuration after discovering available types:

```yaml
plugins.security.experimental.resource_sharing.protected_types: ["ml-model-group", "anomaly-detector", "forecaster"]
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

This example shows a resource with ID `model-group-123` created by the user `bob` in the `analytics` tenant. The resource is shared with specific users, roles, and backend roles with read-only access:

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
{% include copy-curl.html %}

To keep a resource private, make the `share_with` object empty:

```json
PUT _plugins/_security/api/resource/share
{
  "resource_id": "model-group-123",
  "resource_type": "ml-model-group",
  "share_with": {}
}
```
{% include copy-curl.html %}

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

- [Resource sharing APIs]({{site.url}}{{site.baseurl}}/security/access-control/resource-sharing-api/) - REST API reference for programmatic management
- [Resource access management]({{site.url}}{{site.baseurl}}/dashboards/management/resource-sharing/) - UI workflows and user guidance
- [Sample resource plugin](https://github.com/opensearch-project/security/tree/main/src/test/java/org/opensearch/security/resources/sample) - Implementation examples in the security plugin repository
- [Developer documentation](https://github.com/opensearch-project/security/blob/main/RESOURCE_SHARING_AND_ACCESS_CONTROL.md) - Detailed technical documentation for plugin developers, users, and administrators
