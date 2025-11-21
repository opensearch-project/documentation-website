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
**Replaces:** `plugins.anomaly_detection.filter_by_backend_roles` (on deprecation path; see note below)
{: .warning }

This page explains how **Anomaly Detection (AD)** integrates with the Security plugin’s **Resource Sharing and Access Control** framework to provide **document-level** authorization for detectors.

> For the end-to-end framework concepts and APIs, see [Resource Sharing and Access Control]({{site.url}}{{site.baseurl}}/security/access-control/resources/)
{: .note}

---

## Onboarding

- **Resource type:** `anomaly-detector`
- **System index:** `.opendistro-anomaly-detectors`
- **Onboarded in:** 3.3

When resource-level authorization is enabled for this type, each detector’s visibility is governed by a central sharing record. Owners and users with share capability can grant or revoke access for specific **users**, **roles**, or **backend roles**.

---

## Anomaly Detector access levels

AD exposes **three access levels** for granting access to detectors:

### 1. ad_read_only
This read-only access level grants a read and search only access to the shared detector.

Following actions are allowed with this access-level:
```yaml
- 'cluster:admin/opendistro/ad/detector/info'
- 'cluster:admin/opendistro/ad/detector/validate'
- 'cluster:admin/opendistro/ad/detector/preview'
- 'cluster:admin/opendistro/ad/detectors/get'
- 'cluster:admin/opendistro/ad/result/topAnomalies'
```

### 2. ad_read_write
This read-write access level grants full access to a detector except share.

Following actions are allowed with this access level:
```yaml
- "cluster:admin/opendistro/ad/*"
- 'cluster:monitor/*'
- "cluster:admin/ingest/pipeline/delete"
- "cluster:admin/ingest/pipeline/put"
```

### 3. ad_full_access
This access level grants complete access to a detector and will allow shared user owner-like permission.

Following actions are allowed with this access level:
```yaml
- "cluster:admin/ingest/pipeline/delete"
- "cluster:admin/ingest/pipeline/put"
- "cluster:admin/opendistro/ad/*"
- 'cluster:monitor/*'
- "cluster:admin/security/resource/share"
```
---

> These access-levels are non-configurable. If you would like to add more access-levels please file an issue on [the GitHub repo](https://github.com/opensearch-project/anomaly-detection/).
