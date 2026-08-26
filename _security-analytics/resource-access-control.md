---
layout: default
title: Security Analytics resource access control
nav_order: 3
has_children: false
---

# Security Analytics resource access control

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).
{: .warning}

Security Analytics integrates with the Security plugin's resource sharing and access control framework to provide document-level authorization for detectors and correlation rules. This replaces the legacy `plugins.security_analytics.filter_by_backend_roles` setting with a more flexible sharing system that allows resource owners to grant specific access levels to users, roles, or backend roles.

For the end-to-end framework concepts and APIs, see [Resource sharing and access control]({{site.url}}{{site.baseurl}}/security/access-control/resources/).
{: .note}

## Resource configuration

Security Analytics registers two resource types.

| Resource type | System index | Onboarded version |
| :--- | :--- | :--- |
| `detector` | `.opensearch-sap-detectors-config` | OpenSearch 3.8 |
| `correlation-rule` | `.opensearch-sap-correlation-rules-config` | OpenSearch 3.8 |

When resource-level authorization is enabled, each detector's and correlation rule's visibility is governed by a central sharing record. Resource owners and users with sharing capabilities can grant or revoke access permissions for specific users, roles, or backend roles.

## Enable Security Analytics resource sharing

To enable resource sharing for Security Analytics, add the Security Analytics resource types to the protected types list and enable resource sharing cluster-wide.

Admin-only: These settings can be configured only by cluster administrators with superadmin privileges.
{: .important }

### Configuration using opensearch.yml

Add the following settings to your `opensearch.yml` configuration file to enable resource sharing for Security Analytics:

```yaml
plugins.security.experimental.resource_sharing.enabled: true
plugins.security.system_indices.enabled: true
plugins.security.experimental.resource_sharing.protected_types:
  - "detector"
  - "correlation-rule"
```
{% include copy.html %}

### Configuration using the Cluster Settings API

Alternatively, you can enable resource sharing dynamically using the Cluster Settings API:

```json
PUT _cluster/settings
{
  "transient": {
    "plugins.security.experimental.resource_sharing.enabled": true,
    "plugins.security.experimental.resource_sharing.protected_types": ["detector", "correlation-rule"]
  }
}
```
{% include copy-curl.html %}

When adding the Security Analytics resource types to an existing configuration, include all previously configured resource types in the `protected_types` array.
{: .note}

## Security Analytics access levels

Security Analytics provides three predefined access levels that apply to both the `detector` and `correlation-rule` resource types. These access levels determine the specific permissions granted to users who have been granted access to a detector or correlation rule resource.

### sa_read_only

The `sa_read_only` read-only access level grants users the ability to view and search shared resources but not modify them. For detectors, this access level includes the following permissions:

```yaml
- 'cluster:admin/opensearch/securityanalytics/detector/get'
- 'cluster:admin/opensearch/securityanalytics/detector/search'
- 'cluster:admin/opensearch/securityanalytics/alerts/get'
- 'cluster:admin/opensearch/securityanalytics/findings/get'
- 'cluster:admin/opensearch/securityanalytics/mapping/get'
- 'cluster:admin/opensearch/securityanalytics/mapping/view/get'
```
{% include copy.html %}

For correlation rules, it includes the following permissions:

```yaml
- 'cluster:admin/opensearch/securityanalytics/correlation/rule/search'
- 'cluster:admin/opensearch/securityanalytics/correlations/list'
- 'cluster:admin/opensearch/securityanalytics/correlations/findings'
- 'cluster:admin/opensearch/securityanalytics/correlationAlerts/get'
```
{% include copy.html %}

### sa_read_write

The `sa_read_write` read-write access level grants users full access to resource operations except for sharing capabilities. For detectors, this access level includes the following permissions:

```yaml
- 'cluster:admin/opensearch/securityanalytics/detector/*'
- 'cluster:admin/opensearch/securityanalytics/alerts/*'
- 'cluster:admin/opensearch/securityanalytics/findings/*'
- 'cluster:admin/opensearch/securityanalytics/mapping/*'
- 'cluster:admin/opensearch/securityanalytics/rule/*'
```
{% include copy.html %}

For correlation rules, it includes the following permissions:

```yaml
- 'cluster:admin/index/correlation/rules/*'
- 'cluster:admin/opensearch/securityanalytics/correlation/rule/search'
- 'cluster:admin/opensearch/securityanalytics/correlations/*'
- 'cluster:admin/opensearch/securityanalytics/correlationAlerts/*'
```
{% include copy.html %}

### sa_full_access

The `sa_full_access` full access level grants users complete control over a resource, including owner-like permissions such as sharing the resource with other users. This access level includes all read-write permissions for the resource type plus the resource sharing permission:

```yaml
- 'cluster:admin/security/resource/share'
```
{% include copy.html %}

These access levels are predefined and cannot be modified. To request additional access levels, create an issue in the [Security Analytics GitHub repository](https://github.com/opensearch-project/security-analytics/).
{: .note}

## Migrating from the legacy framework

After enabling resource sharing and marking the Security Analytics resource types as protected, cluster administrators must run the migration API to transfer existing detector and correlation rule sharing information from the legacy framework to the new resource sharing system. Run the migration once per resource index.

Admin-only: The Migrate API can only be executed by cluster administrators with superadmin or REST admin privileges.
{: .important }

Use the following API call to migrate legacy detector sharing data to the resource sharing framework:

```json
POST _plugins/_security/api/resources/migrate
{
  "source_index": ".opensearch-sap-detectors-config",
  "username_path": "/user/name",
  "backend_roles_path": "/user/backend_roles",
  "default_owner": "<replace-with-existing-user>",
  "default_access_level": {
    "detector": "<select-appropriate-access-level>"
  }
}
```
{% include copy-curl.html %}

Run the migration again for the correlation rule index, using `.opensearch-sap-correlation-rules-config` as the `source_index` and `correlation-rule` as the `default_access_level` key.

Replace `<replace-with-existing-user>` with the username of an existing user who should own resources without explicit ownership information. Replace `<select-appropriate-access-level>` with one of the available Security Analytics access levels: `sa_read_only`, `sa_read_write`, or `sa_full_access`.

## Related documentation

- [Resource sharing and access control]({{site.url}}{{site.baseurl}}/security/access-control/resources/) -- Backend concepts, configuration, and setup
- [Resource sharing APIs]({{site.url}}{{site.baseurl}}/security/access-control/resource-sharing-api/) -- REST API reference for programmatic management
