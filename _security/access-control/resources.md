---
layout: default
title: Sharing resources between access roles
parent: Access control
nav_order: 130
---

# Sharing resources between access roles

**Introduced 3.0**
{: .label .label-purple }

This is an experimental feature and we don't recommend using it in a production environment. For updates on the feature's progress or to provide feedback, join the discussion in the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

The Resource Sharing extension in the OpenSearch Security plugin provides fine-grained, resource-level access management for plugin-declared resources. It builds on top of existing index-level authorization to enable you to:

- Share and revoke access as a resource owner.
- View and manage all resources as a super-admin.
- Define custom shareable resources through a standardized Service Provider Interface (SPI).

## Enabling the resource sharing extension

To enable the resource sharing extension, set up the plugin and permission settings.

### Plugin settings

To enable resource sharing, add the following settings to `opensearch.yaml`:

```yaml
plugins.security.experimental.resource_sharing.enabled: true
plugins.security.system_indices.enabled: true
```
{% include copy.html %}

For information about implementing this feature in your plugin, see [Resource access control for plugins](https://github.com/opensearch-project/security/blob/main/RESOURCE_ACCESS_CONTROL_FOR_PLUGINS.md).
{: .tip }

### Cluster permissions

The Security plugin must have the following access:

- Permissions to make share, verify, and list requests.
- Shared access to all cluster components, or be the owner of the cluster.

To grant the resource sharing extension these permissions, add the following roles to `roles.yaml`. These roles will be assigned to anyone conducting resource sharing:

```yaml
sample_full_access:
  cluster_permissions:
    - 'cluster:admin/sample-resource-plugin/*'

sample_read_access:
  cluster_permissions:
    - 'cluster:admin/sample-resource-plugin/get'
```
{% include copy.html %}


## Action groups

Action groups define permission levels for shared resources. As of OpenSearch 3.0, the only supported action group for resource sharing is `default`. To share resources across the action groups, use the `share_with` array in that resource's configuration and add wildcards for each default role:

```json
{
  "share_with": {
    "default": {
      "users": ["*"],
      "roles": ["*"],
      "backend_roles": ["*"]
    }
  }
}
```
{% include copy.html %}

To keep a resource private, keep the `share_with` array empty:

```json
{ "share_with": {} }
```
{% include copy.html %}

## Restrictions

Before implementing resource sharing and access control, be aware of the following limitations that help maintain security and consistency across the system:

- Only resource owners or super-admins can share or revoke access.
- Resources must reside in system indexes.
- Disabling system index protection exposes resources to direct index-level access.

## Best practices

To ensure secure and efficient implementation of resource sharing and access control, follow these recommended practices:

- Declare and register extensions correctly.
- Use the SPI client APIs instead of manual index queries.
- Enable only on fresh 3.0.0+ clusters to avoid upgrade issues.
- Grant minimal required permissions when sharing resources.

These practices help maintain security, improve maintainability, and prevent potential issues during upgrades or system changes.
