---
layout: default
title: Workflow state access control
nav_order: 35
---

# Workflow state access control

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).
{: .warning}

Flow Framework integrates with the Security plugin's resource sharing and access control framework to provide document-level authorization for workflow state records. This replaces the legacy `plugins.flow_framework.filter_by_backend_roles` setting with a more flexible sharing system that allows resource owners to grant specific access levels to users, roles, or backend roles.

For the end-to-end framework concepts and APIs, see [resource sharing and access control]({{site.url}}{{site.baseurl}}/security/access-control/resources/).
{: .note}

## Resource configuration

The following table describes the workflow state resource configuration:

| Field | Value |
| :--- | :--- |
| Resource type | `workflow-state` |
| System index | `.plugins-flow-framework-state` |
| Onboarded version | OpenSearch 3.4 |

When resource-level authorization is enabled for workflow states, each workflow state's visibility is governed by a central sharing record. Resource owners and users with sharing capabilities can grant or revoke access permissions for specific users, roles, or backend roles.

## Enable workflow state resource sharing

To enable resource sharing for workflow states, you must add the workflow-state resource type to the protected types list and enable resource sharing cluster-wide.

Admin-only: These settings can be configured only by cluster administrators with superadmin privileges.
{: .important }

### Configuration using opensearch.yml

Add the following settings to your `opensearch.yml` configuration file to enable resource sharing for workflow states:

```yaml
plugins.security.experimental.resource_sharing.enabled: true
plugins.security.system_indices.enabled: true
plugins.security.experimental.resource_sharing.protected_types:
  - "workflow-state"
```
{% include copy.html %}

### Configuration using cluster settings API

Alternatively, you can enable resource sharing dynamically using the Cluster Settings API:

```json
PUT _cluster/settings
{
  "transient": {
    "plugins.security.experimental.resource_sharing.enabled": true,
    "plugins.security.experimental.resource_sharing.protected_types": ["workflow-state"]
  }
}
```
{% include copy-curl.html %}

When adding the workflow-state resource type to an existing configuration, include all previously configured resource types in the `protected_types` array.
{: .note}

## Workflow state access levels

Flow Framework provides three predefined access levels for workflow state documents. These access levels determine the specific permissions granted to users who have been granted access to a workflow state resource.

### workflow_state_read_only

The `workflow_state_read_only` read-only access level grants users the ability to view and search shared workflow states but not modify them. This access level includes the following permissions:

```yaml
- "cluster:admin/opensearch/flow_framework/workflow_state/get"
- "cluster:admin/opensearch/flow_framework/workflow_state/search"
```
{% include copy.html %}

### workflow_state_read_write

The `workflow_state_read_write` read-write access level grants users full access to workflow state operations except for sharing capabilities. This access level includes all read permissions plus write operations:

```yaml
- "cluster:admin/opensearch/flow_framework/workflow_state/*"
- "cluster:monitor/*"
```
{% include copy.html %}

### workflow_state_full_access

The `workflow_state_full_access` full access level grants users complete control over a workflow state, including owner-like permissions such as sharing the resource with other users. This access level includes all workflow state operations plus resource sharing permissions:

```yaml
- "cluster:admin/opensearch/flow_framework/workflow_state/*"
- "cluster:monitor/*"
- "cluster:admin/security/resource/share"
```
{% include copy.html %}

These access levels are predefined and cannot be modified. To request additional access levels, file an issue in the [Flow Framework GitHub repository](https://github.com/opensearch-project/flow-framework/).
{: .note}

## Migrating from legacy framework

After enabling resource sharing and marking workflow states as a protected resource type, cluster administrators must run the migration API to transfer existing workflow state sharing information from the legacy framework to the new resource sharing system.

Admin-only: The Migrate API can only be executed by cluster administrators with superadmin or REST admin privileges.
{: .important }

Use the following API call to migrate legacy workflow state sharing data to the resource sharing framework:

```json
POST _plugins/_security/api/resources/migrate
{
  "source_index": ".plugins-flow-framework-state",
  "username_path": "/user/name",
  "backend_roles_path": "/user/backend_roles",
  "default_owner": "<replace-with-existing-user>",
  "default_access_level": {
    "workflow-state": "<select-appropriate-access-level>"
  }
}
```
{% include copy-curl.html %}

Replace `<replace-with-existing-user>` with the username of an existing user who should own workflow states without explicit ownership information. Replace `<select-appropriate-access-level>` with one of the available workflow state access levels: `workflow_state_read_only`, `workflow_state_read_write`, or `workflow_state_full_access`.

## Related documentation

- [Resource sharing and access control]({{site.url}}{{site.baseurl}}/security/access-control/resources/) -- Backend concepts, configuration, and setup
- [Resource sharing APIs]({{site.url}}{{site.baseurl}}/security/access-control/resource-sharing-api/) -- REST API reference for programmatic management
- [Resource access management]({{site.url}}{{site.baseurl}}/dashboards/management/resource-sharing/) -- UI workflows and user guidance
- [Workflow access control]({{site.url}}{{site.baseurl}}/automating-configurations/workflow-access-control/) -- Access control for workflow templates