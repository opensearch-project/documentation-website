---
layout: default
title: Resource Sharing and Access Control
parent: Access control
nav_order: 130
---

# Resource Sharing and Access Control
**Introduced 3.0**
{: .label .label-purple }


Available from version 3.0.0 on fresh clusters only.
{: .info }

Marked experimental and is disabled by default.
{: .warning }

To enable, set:
```yaml
plugins.security.resource_sharing.enabled: true
```
{: .note } 

## 1. Overview

OpenSearch lacked a fine-grained access control (FGAC) mechanism at the resource level for plugins, forcing each plugin to develop its own custom authorization logic. This lack of standardization led to inconsistent security enforcement, with broad permissions being assigned and an increased risk of unauthorized access. Maintaining separate access control implementations across multiple plugins also resulted in high maintenance overhead. For example, in the Anomaly Detection plugin a user with delete permissions could remove all detectors instead of just their own, illustrating the need for a centralized, standardized solution.

The Resource Sharing and Access Control extension in the OpenSearch Security Plugin provides fine-grained, resource-level access management for plugin-declared resources. It builds on top of existing index-level authorization to let:

Resource owners share and revoke access

Super-admins view and manage all resources

Plugin authors define custom shareable resources via a standardized SPI interface

---

## 2. Components

### 2.1 `opensearch-security-spi`

A Service Provider Interface (SPI) that:

- Defines `ResourceSharingExtension` for plugin implementations.
- Tracks registered resource plugins at startup.
- Exposes a `ResourceSharingClient` for performing share, revoke, verify, and list operations.

#### Plugin Requirements

##### 1. Feature Flag and Protection
    - Enable `plugins.security.resource_sharing.enabled: true`
    - Resource indices must be system indices with system index protection enabled (`plugins.security.system_indices.enabled: true`).

##### 2. Build Configuration  
   Add to `build.gradle`:
   ```gradle
   compileOnly group: 'org.opensearch', name: 'opensearch-security-spi', version: "${opensearch_build}"
   opensearchplugin {
     name '<your-plugin>'
     description '<description>'
     classname '<your.classpath>'
     extendedPlugins = ['opensearch-security;optional=true']
   }
   ```

##### 3. SPI Registration  
   Create `src/main/resources/META-INF/services/org.opensearch.security.spi.ResourceSharingExtension` containing your implementation’s fully qualified class name:
   ```
   com.example.MyResourceSharingExtension
   ```

---

## 3. API Design

All sharing metadata is stored in the system index `.opensearch_resource_sharing`.

| Field         | Type   | Description                                 |
| ------------- | ------ | ------------------------------------------- |
| `source_idx`  | String | System index holding the resource           |
| `resource_id` | String | Unique resource identifier                  |
| `created_by`  | Object | Creator information                         |
| `share_with`  | Object | Map of action-groups to access definitions  |

### 3.1 Document Structure

```json
{
  "source_idx": ".plugins-ml-model-group",
  "resource_id": "model-group-123",
  "created_by": {
    "user": "darshit"
  },
  "share_with": {
    "default": {
      "users": ["user1"],
      "roles": ["viewer_role"],
      "backend_roles": ["data_analyst"]
    }
  }
}
```

### 3.2 Java Client APIs

```java
ResourceSharingClient client = ResourceSharingClientAccessor.getResourceSharingClient();

// 1. Verify access
client.verifyResourceAccess(resourceId, indexName, listener);

// 2. Share resource
client.share(resourceId, indexName, recipients, listener);

// 3. Revoke access
client.revoke(resourceId, indexName, recipients, listener);

// 4. List accessible IDs
client.getAccessibleResourceIds(indexName, listener);
```

---

## 4. Action Groups

- Action-groups define permission levels (currently only default).
- To make a resource public, use wildcards:
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
- To keep a resource private (only owner and super-admin):
  ```json
  { "share_with": {} }
  ```

---

## 5. User and Admin Setup

### 5.1 Cluster Permissions

In `roles.yml`, grant plugin API permissions:

```yaml
sample_full_access:
  cluster_permissions:
    - 'cluster:admin/sample-resource-plugin/*'

sample_read_access:
  cluster_permissions:
    - 'cluster:admin/sample-resource-plugin/get'
```

### 5.2 Access Rules

1. Must have plugin API permission to call share, verify, or list.
2. Resource must be shared or the user must be the owner to grant access.
3. No additional index permissions are needed; system indices are protected.

---

## 6. Restrictions

- Only resource owners or super-admins can share or revoke access.
- Resources must reside in system indices.
- Disabling system index protection exposes resources to direct index-level access.

---

## 7. Best Practices

- Declare and register extensions correctly.
- Use the SPI client APIs instead of manual index queries.
- Enable only on fresh 3.0.0+ clusters to avoid upgrade issues.
- Grant minimal required scope when sharing.

---

## 8. Additional Notes

- Requires `plugins.security.resource_sharing.enabled: true`.
- Relies on system index protection (`plugins.security.system_indices.enabled: true`).
- Experimental feature subject to future API changes.
