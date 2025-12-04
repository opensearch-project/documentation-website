---
layout: default
title: Anomaly detector access control
nav_order: 5
parent: Anomaly detection
has_children: false
redirect_from:
  - /monitoring-plugins/ad/detector-access-control/
---

# Anomaly detector access control

**Status:** Experimental  
**Replaces:** `plugins.anomaly_detection.filter_by_backend_roles`
{: .warning }

This page explains how **Anomaly Detection (AD)** integrates with the Security plugin’s **Resource Sharing and Access Control** framework to provide **document-level** authorization for detectors.

> For the end-to-end framework concepts and APIs, see [Resource Sharing and Access Control]({{site.url}}{{site.baseurl}}/security/access-control/resources/)
{: .note}

---

## Onboarding

- **Resource type:** `anomaly-detector`
- **System index:** `.opendistro-anomaly-detectors`
- **Onboarded in:** `3.3`

When resource-level authorization is enabled for this type, each detector’s visibility is governed by a central sharing record. Owners and users with share capability can grant or revoke access for specific **users**, **roles**, or **backend roles**.

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
  - "anomaly-detector"
````

### Dev Tools (3.4+)

```curl
PUT _cluster/settings
{
  "transient": {
    "plugins.security.experimental.resource_sharing.enabled": true,
    "plugins.security.experimental.resource_sharing.protected_types": ["anomaly-detector", <existing-resource-types>]
  }
}
```
{% include copy-curl.html %}

---

## Anomaly detector access levels

AD exposes **three access levels** for granting access to detectors:

### ad_read_only
This read-only access level grants a read and search only access to the shared detector.

Following actions are allowed with this access-level:
```yaml
- 'cluster:admin/opendistro/ad/detector/info'
- 'cluster:admin/opendistro/ad/detector/validate'
- 'cluster:admin/opendistro/ad/detector/preview'
- 'cluster:admin/opendistro/ad/detectors/get'
- 'cluster:admin/opendistro/ad/result/topAnomalies'
```

### ad_read_write
This read-write access level grants full access to a detector except share.

Following actions are allowed with this access level:
```yaml
- "cluster:admin/opendistro/ad/*"
- 'cluster:monitor/*'
- "cluster:admin/ingest/pipeline/delete"
- "cluster:admin/ingest/pipeline/put"
```

### ad_full_access
This access level grants complete access to a detector and will allow shared user owner-like permission.

Following actions are allowed with this access level:
```yaml
- "cluster:admin/ingest/pipeline/delete"
- "cluster:admin/ingest/pipeline/put"
- "cluster:admin/opendistro/ad/*"
- 'cluster:monitor/*'
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
  "source_index": ".opendistro-anomaly-detectors",
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
  "source_index": ".oopendistro-anomaly-detectors",
  "username_path": "/user/name",
  "backend_roles_path": "/user/backend_roles",
  "default_owner": "<replace-with-existing-user>",
  "default_access_level": {
    "anomaly-detector": "<pick-one-access-level>"
  }
}
```
{% include copy-curl.html %}
