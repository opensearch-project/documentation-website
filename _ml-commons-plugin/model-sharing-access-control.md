---
layout: default
title: Model access control through resource sharing
parent: Integrating ML models
has_children: false
nav_order: 30
---

# Model access control through resource sharing

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).
{: .warning}

In ML Commons, access to models is controlled through [model groups]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control/#model-groups)---collections of versions of a particular model that share the same access permissions. ML Commons integrates with the Security plugin's resource sharing and access control framework to provide document-level authorization for these model group resources.

This resource sharing approach is the new method for controlling model group access and provides more flexible sharing capabilities than the [original model access control system]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control/). Resource owners can grant specific access levels to users, roles, or backend roles for individual model groups.

For the end-to-end framework concepts and APIs, see [Resource sharing and access control]({{site.url}}{{site.baseurl}}/security/access-control/resources/).
{: .note}

## Resource configuration

The following table describes the ML model group resource configuration:

| Field | Value |
| :--- | :--- |
| Resource type | `ml-model-group` |
| System index | `.plugins-ml-model-group` |
| Onboarded version | OpenSearch 3.3 |

When resource-level authorization is enabled for ML model groups, each model group's visibility is governed by a central sharing record. Resource owners and users with sharing capabilities can grant or revoke access permissions for specific users, roles, or backend roles.

## Enable ML model group resource sharing

To enable resource sharing for ML model groups, you must add the ml-model-group resource type to the protected types list and enable resource sharing cluster-wide.

Admin-only: These settings can be configured only by cluster administrators with superadmin privileges.
{: .important }

### Configuration using opensearch.yml

Add the following settings to your `opensearch.yml` configuration file to enable resource sharing for ML model groups:

```yaml
plugins.security.experimental.resource_sharing.enabled: true
plugins.security.system_indices.enabled: true
plugins.security.experimental.resource_sharing.protected_types:
  - "ml-model-group"
```
{% include copy.html %}

### Configuration using cluster settings API

Alternatively, you can enable resource sharing dynamically using the Cluster Settings API:

```json
PUT _cluster/settings
{
  "transient": {
    "plugins.security.experimental.resource_sharing.enabled": true,
    "plugins.security.experimental.resource_sharing.protected_types": ["ml-model-group"]
  }
}
```
{% include copy-curl.html %}

When adding the ml-model-group resource type to an existing configuration, include all previously configured resource types in the `protected_types` array.
{: .note}

## ML model group access levels

ML Commons provides three predefined access levels for ML model group documents. These access levels determine the specific permissions granted to users who have been granted access to a model group resource.

### ml_read_only

The `ml_read_only` read-only access level grants users the ability to view and search shared ML model groups but not modify them. This access level includes the following permissions:

```yaml
- "cluster:admin/opensearch/ml/model_groups/get"
- "cluster:admin/opensearch/ml/models/get"
```
{% include copy.html %}

### ml_read_write

The `ml_read_write` read-write access level grants users full access to ML model group operations except for sharing capabilities. This access level includes all read permissions plus write operations:

```yaml
- "cluster:admin/opensearch/ml/*"
```
{% include copy.html %}

### ml_full_access

The `ml_full_access` full access level grants users complete control over an ML model group, including owner-like permissions such as sharing the resource with other users. This access level includes all ML model group operations plus resource sharing permissions:

```yaml
- "cluster:admin/opensearch/ml/*"
- "cluster:admin/security/resource/share"
```
{% include copy.html %}

These access levels are predefined and cannot be modified. To request additional access levels, file an issue in the [ML Commons GitHub repository](https://github.com/opensearch-project/ml-commons/).
{: .note}

## Migrating from legacy framework

After enabling resource sharing and marking ML model groups as a protected resource type, cluster administrators must run the migration API to transfer existing model group sharing information from the legacy framework to the new resource sharing system.

Admin-only: The Migrate API can only be executed by cluster administrators with superadmin or REST admin privileges.
{: .important }

Use the following API call to migrate legacy ML model group sharing data to the resource sharing framework:

```json
POST _plugins/_security/api/resources/migrate
{
  "source_index": ".plugins-ml-model-group",
  "username_path": "/owner/name",
  "backend_roles_path": "/owner/backend_roles",
  "default_owner": "<replace-with-existing-user>",
  "default_access_level": {
    "ml-model-group": "<select-appropriate-access-level>"
  }
}
```
{% include copy-curl.html %}

Replace `<replace-with-existing-user>` with the username of an existing user who should own ML model groups without explicit ownership information. Replace `<select-appropriate-access-level>` with one of the available ML model group access levels: `ml_read_only`, `ml_read_write`, or `ml_full_access`.

## Related documentation

- [Resource sharing and access control]({{site.url}}{{site.baseurl}}/security/access-control/resources/) -- Backend concepts, configuration, and setup
- [Resource sharing APIs]({{site.url}}{{site.baseurl}}/security/access-control/resource-sharing-api/) -- REST API reference for programmatic management
- [Resource access management]({{site.url}}{{site.baseurl}}/dashboards/management/resource-sharing/) -- UI workflows and user guidance