---
layout: default
title: Model-group access control
parent: Integrating ML models
has_children: false
nav_order: 15
---

# ML model group access control

**Status:** Experimental  
**Replaces:** `plugins.ml_commons.model_access_control_enabled` (on deprecation path; see note below)
{: .warning }

This page explains how **ML Commons** integrates with the Security plugin’s **Resource Sharing and Access Control** framework to provide **document-level** authorization for **ML model groups**.

> For the end-to-end framework concepts and APIs, see [Resource Sharing and Access Control]({{site.url}}{{site.baseurl}}/security/access-control/resources/)
{: .note}

---

## Onboarding

- **Resource type:** `ml-model-group`
- **System index:** `.plugins-ml-model-group`
- **Onboarded in:** 3.3

When resource-level authorization is enabled for this type, each model group’s visibility is governed by a central sharing record. Owners and users with share capability can grant or revoke access for specific **users**, **roles**, or **backend roles**.

Model-groups control access to models.
{: .note } green

---

## ML model group access levels

ML-commons exposes **three access levels** for granting access to a ml-model-group:

### 1. ml_read_only
This read-only access level grants a read and search only access to the shared model-group.

Following actions are allowed with this access-level:
```yaml
- "cluster:admin/opensearch/ml/model_groups/get"
- "cluster:admin/opensearch/ml/models/get"
```

### 2. ml_read_write
This read-write access level grants full access to a ml-model-group except share.

Following actions are allowed with this access level:
```yaml
- "cluster:admin/opensearch/ml/*"
```

### 3. ml_full_access
This access level grants complete access to a ml-model-group and will allow shared user owner-like permission.

Following actions are allowed with this access level:
```yaml
- "cluster:admin/opensearch/ml/*"
- "cluster:admin/security/resource/share"
```
---

> These access-levels are non-configurable. If you would like to add more access-levels please file an issue on [the GitHub repo](https://github.com/opensearch-project/ml-commons/).