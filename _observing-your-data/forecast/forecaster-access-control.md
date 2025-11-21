---
layout: default
title: Forecaster access control
parent: Forecasting
nav_order: 5
has_children: false
---

# Forecaster access control

**Status:** Experimental  
**Replaces:** `plugins.forecast.filter_by_backend_roles`
{: .warning }

This page explains how the **Forecaster** resource integrates with the Security plugin’s **Resource Sharing and Access Control** framework to provide **document-level** authorization for forecasters.

> For the end-to-end framework concepts and APIs, see [Resource Sharing and Access Control]({{site.url}}{{site.baseurl}}/security/access-control/resources/)
{: .note}

---

## Onboarding

- **Resource type:** `forecaster`
- **System index:** `.opensearch-forecasters`
- **Onboarded in:** `3.3`

When resource-level authorization is enabled for this type, each forecaster’s visibility is governed by a central sharing record. Owners and users with share capability can grant or revoke access for specific **users**, **roles**, or **backend roles**.

---
## Enable or disable for this resource type

Add the type to the protected list and enable the feature.

> **Admin-only:** These settings can be configured **only by cluster administrators** (super-admins).
{: .important }

### `opensearch.yml` (3.3+)

```yaml
plugins.security.experimental.resource_sharing.enabled: true
plugins.security.system_indices.enabled: true
plugins.security.experimental.resource_sharing.protected_types:
  - "forecaster"
````

### Dev Tools (3.4+)

```curl
PUT _cluster/settings
{
  "transient": {
    "plugins.security.experimental.resource_sharing.enabled": true,
    "plugins.security.experimental.resource_sharing.protected_types": ["forecaster", <existing-resource-types>]
  }
}
```
{% include copy-curl.html %}

---

## Forecaster access levels

There are **three access levels** for granting access to forecasters:

### forecast_read_only
This read-only access level grants a read and search only access to the shared forecaster.

Following actions are allowed with this access-level:
```yaml
- 'cluster:admin/plugin/forecast/forecaster/info'
- 'cluster:admin/plugin/forecast/forecaster/stats'
- 'cluster:admin/plugin/forecast/forecaster/suggest'
- 'cluster:admin/plugin/forecast/forecaster/validate'
- 'cluster:admin/plugin/forecast/forecasters/get'
- 'cluster:admin/plugin/forecast/forecasters/info'
- 'cluster:admin/plugin/forecast/result/topForecasts'
```

### forecast_read_write
This read-write access level grants full access to a forecaster except share.

Following actions are allowed with this access level:
```yaml
- 'cluster:admin/plugin/forecast/*'
- 'cluster:monitor/*'
- 'cluster:admin/settings/update'
```

### forecast_full_access
This access level grants complete access to a forecaster and will allow shared user owner-like permission.

Following actions are allowed with this access level:
```yaml
- 'cluster:admin/plugin/forecast/*'
- 'cluster:monitor/*'
- 'cluster:admin/settings/update'
- "cluster:admin/security/resource/share"
```

> These access-levels are non-configurable. If you would like to add more access-levels, file an issue on [the GitHub repo](https://github.com/opensearch-project/anomaly-detection/).
{: .note } yellow

---

## Migrating from legacy framework

> **Admin-only:** The migrate API can only be run **by cluster administrators** (super-admins or rest-admins).
{: .important }
 
Once the feature is turned on, and the resource is marked as protected it is imperative that cluster-admins call the migrate API to migrate legacy-sharing information to the new framework: 

### 3.3 clusters
```curl
POST _plugins/_security/api/resources/migrate 
{
  "source_index": ".opensearch-forecasters",
  "username_path": "/user/name",
  "backend_roles_path": "/user/backend_roles",
  "default_access_level": "<pick-one-access-level>"
}
```
{% include copy-curl.html %}

### 3.4+ clusters

```curl
POST _plugins/_security/api/resources/migrate 
{
  "source_index": ".opensearch-forecasters",
  "username_path": "/user/name",
  "backend_roles_path": "/user/backend_roles",
  "default_owner": "<replace-with-existing-user>",
  "default_access_level": {
    "forecaster": "<pick-one-access-level>"
  }
}
```
{% include copy-curl.html %}
