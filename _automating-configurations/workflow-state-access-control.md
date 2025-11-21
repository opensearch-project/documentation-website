---
layout: default
title: Workflow state access control
nav_order: 35
---

# Workflow state access control

**Status:** Experimental  
**Replaces:** `plugins.flow_framework.filter_by_backend_roles`
{: .warning }

This page explains how **Flow Framework** integrates with the Security plugin’s **Resource Sharing and Access Control** framework to provide **document-level** authorization for **workflows**.

> For the end-to-end framework concepts and APIs, see [Resource Sharing and Access Control]({{site.url}}{{site.baseurl}}/security/access-control/resources/)
{: .note}

---

## Onboarding

- **Resource type:** `workflow-state`
- **System index:** `.plugins-flow-framework-state`
- **Onboarded in:** `3.4`

When resource-level authorization is enabled for this type, each workflow-state’s visibility is governed by a central sharing record. Owners and users with share capability can grant or revoke access for specific **users**, **roles**, or **backend roles**.

---

## Enable or disable for this resource type

Add the type to the protected list and enable the feature.

### `opensearch.yml` (3.4+)

```yaml
plugins.security.experimental.resource_sharing.enabled: true
plugins.security.system_indices.enabled: true
plugins.security.experimental.resource_sharing.protected_types:
  - "workflow-state"
````

### Dev Tools (3.4+)

```curl
PUT _cluster/settings
{
  "transient": {
    "plugins.security.experimental.resource_sharing.enabled": true,
    "plugins.security.experimental.resource_sharing.protected_types": ["workflow-state", <existing-resource-types>]
  }
}
```
{% include copy-curl.html %}

---

## Workflow state access levels

Flow Framework exposes **three access levels** for workflow states.

### workflow_state_read_only

This read-only access level grants a read and search only access to the shared workflow-state.

Following actions are allowed with this access-level:
```yaml
- "cluster:admin/opensearch/flow_framework/workflow_state/get"
- "cluster:admin/opensearch/flow_framework/workflow_state/search"
```

### workflow_state_read_write

This read-write access level grants full access to a workflow-state except share.

Following actions are allowed with this access-level:
```yaml
- "cluster:admin/opensearch/flow_framework/workflow_state/*"
- "cluster:monitor/*"
```

### workflow_state_full_access

This access level grants complete access to a workflow-state and will allow shared user owner-like permission.

Following actions are allowed with this access-level:
```yaml
- "cluster:admin/opensearch/flow_framework/workflow_state/*"
- "cluster:monitor/*"
- "cluster:admin/security/resource/share"
```

---

> These access-levels are non-configurable. If you would like to add more access-levels, file an issue on [the GitHub repo](https://github.com/opensearch-project/flow-framework/).
