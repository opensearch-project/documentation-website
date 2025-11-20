---
layout: default
title: Sharing resources between access roles
parent: Access control
nav_order: 130
---

# Resource Sharing and Access Control

**Introduced 3.3**
{: .label .label-purple }

This feature is **experimental**.
{: .warning }

The **Resource Sharing and Access Control** framework in the OpenSearch Security plugin provides *document-level*, fine-grained access management for plugin-defined resources. It extends OpenSearch’s existing role-based access control (RBAC) by letting resource owners explicitly share individual resources with other principals.

With this feature, you can:

- Share or revoke access to your resources.
- Allow users with share permission to redistribute access.
- View and manage all shareable resources as a super administrator.
- Integrate shareable resource types through a standardized **Resource Sharing SPI**.
- Search resource indices with automatic per-user filtering applied by the Security plugin.

A **resource** is currently defined as a **document stored in a plugin’s system index**, and sharing information is stored in a **central security-managed system index**.

---

# Enabling resource sharing

The feature is controlled through the cluster settings configuration.

## Cluster settings

To enable resource sharing:

```yaml
plugins.security.experimental.resource_sharing.enabled: true
plugins.security.system_indices.enabled: true
```
{% include copy.html %}

### Protected resource types

Administrators must list which resource types use resource-level authorization:

```yaml
plugins.security.experimental.resource_sharing.protected_types: ["sample-resource", "ml-model"]
```
{% include copy.html %}

These types must match the resource types declared by plugins implementing the `ResourceSharingExtension` SPI.

### Dynamic updates (3.4+)

Starting with **3.4**, both settings can be updated dynamically:

```curl
PUT _cluster/settings
{
  "transient": {
    "plugins.security.experimental.resource_sharing.enabled": true,
    "plugins.security.experimental.resource_sharing.protected_types": ["sample-resource"]
  }
}
```
{% include copy-curl.html %}

In **3.3**, these settings can be updated **only through `opensearch.yml`** and require a restart.

---

# Required permissions

Resource sharing requires plugin-specific cluster permissions. Add the following to `roles.yml`:

```yaml
sample_full_access:
  cluster_permissions:
    - 'cluster:admin/sample-resource-plugin/*'

sample_read_access:
  cluster_permissions:
    - 'cluster:admin/sample-resource-plugin/get'
```
{% include copy.html %}

Users must have both:

1. Cluster permissions for the plugin APIs
2. Resources shared with them through the sharing APIs

Sharing alone does **not** grant API access.

---

# Resource sharing components

The resource sharing framework includes several internal components and APIs.

## Service Provider Interface (SPI)

Plugins integrate through the **`opensearch-security-spi`** package.

Plugins must implement:

* `ResourceSharingExtension`
  Declares shareable resource types and system indices.
* `ResourceSharingClientAccessor`
  Provides access to verification, sharing, and listing operations.

Plugins must also register:

```
src/main/resources/META-INF/services/org.opensearch.security.spi.ResourceSharingExtension
```

Containing only:

```
com.example.MyResourceSharingExtension
```

{% include copy.html %}

## resource-action-groups.yml

Plugins define access levels using action groups:

```yaml
resource_types:
  sample-resource:
    sample_read_only:
      allowed_actions:
        - "cluster:admin/sample-resource-plugin/get"

    sample_read_write:
      allowed_actions:
        - "cluster:admin/sample-resource-plugin/*"
```

These action groups become the valid “access levels” a user may share.

---

# Data model

All sharing metadata is stored in a dedicated *security-owned* system index.

| Field         | Description                                    |
|---------------|------------------------------------------------|
| `resource_id` | Unique identifier of the resource              |
| `created_by`  | Creator username (and tenant if applicable)    |
| `share_with`  | Mapping of action-groups to allowed principals |
| `source_idx`  | Resource index managed by the plugin           |

### Example document

```json
{
  "resource_id": "model-group-123",
  "created_by": {
    "user": "darshit",
    "tenant": "analytics"
  },
  "share_with": {
    "read_only": {
      "users": ["alice"],
      "roles": ["data_viewer"],
      "backend_roles": ["analytics_backend"]
    }
  }
}
```

To make a resource public:

```json
{
  "share_with": {
    "read_only": {
      "users": ["*"]
    }
  }
}
```
NOTE: Resource will be marked public only if "*" is added to user list.
{: .note} yellow

To keep a resource private:

```json
{ "share_with": {} }
```

---

# Access filtering for plugins

When plugins perform a search on their system index:

* The plugin performs the search using its system identity
* Security automatically filters documents based on:

    * resource owner
    * shared principals
    * privileges

For example, only documents whose `all_shared_principals` list matches the authenticated user or roles will be returned.

This filtering is done automatically if the plugin:

* Implements `IdentityAwarePlugin`
* Uses system identity for index access (no `stashContext`)

---

# Java APIs for plugins

Plugins call the ResourceSharingClient to enforce access.

### Verify resource access

```
client.verifyAccess(resourceId, resourceIndex, action, listener);
```

### List accessible resource IDs

```
client.getAccessibleResourceIds(resourceIndex, listener);
```

### Check if feature enabled for type

```
client.isFeatureEnabledForType(resourceType);
```

---

# REST APIs

## 1. Share a resource

Replace the entire sharing configuration.

```curl
PUT _plugins/_security/api/resource/share
{
  "resource_id": "123",
  "resource_type": "sample-resource",
  "share_with": {
    "read_only": {
      "users": ["alice"],
      "roles": ["auditor"]
    }
  }
}
```
{% include copy-curl.html %}

---

## 2. Modify sharing configuration

Add or revoke access.

```curl
PATCH/POST _plugins/_security/api/resource/share
{
  "resource_id": "123",
  "resource_type": "sample-resource",
  "add": {
    "read_only": { "users": ["bob"] }
  },
  "revoke": {
    "read_only": { "users": ["alice"] }
  }
}
```
{% include copy-curl.html %}

---

## 3. Get sharing info

```curl
GET _plugins/_security/api/resource/share?resource_id=<id>&resource_type=<resource-type>
```
{% include copy-curl.html %}

---

## 4. List resource types

```curl
GET _plugins/_security/api/resource/types
```
{% include copy-curl.html %}

Returns action groups declared by plugins.

---

## 5. List accessible resources

```curl
GET _plugins/_security/api/resource/list?resource_type=<resource-type>
```
{% include copy-curl.html %}

Returns only resources visible to the caller.

---

## 6. Migration API (admin-only)

Used once to import legacy plugin-managed sharing metadata.

```curl
POST _plugins/_security/api/resources/migrate
{
  "source_index": "<source-index>",
  "username_path": "<json-path-to-owner-name>", # e.g. /owner/name
  "backend_roles_path": "<json-path-to-backend-roles>", # e.g. /owner/backend_roles
  "default_owner": "some_user",
  "default_access_level": {
    "<resource-type>": "<access-level>" # if resource-index has more than one resource type add more entries
  }
}

```
{% include copy-curl.html %}


---

# Restrictions

* Only owners, super-admins and users with sharing access can share or revoke access.
* All resource indices must be system indices.
* System index protection must be enabled.
* Users still require plugin-level cluster permissions, specifically for creating resources.
* Action-groups must be declared in plugin configuration.

---

# Best practices

For developers:

* Use SPI and ResourceSharingClient instead of custom ACL logic.
* Store only consistent resource types in a resource index.
* Use the implicit DLS filtering by running searches under system identity.

For admins:

* Enable the feature on fresh clusters first.
* Keep system index protection enabled.
* Share resources minimally and explicitly.

---

# Conclusion

The Resource Sharing and Access Control framework provides a unified and secure way to implement document-level access control for plugin-defined resources in OpenSearch. It introduces a standardized SPI, central sharing index, and new REST APIs for fine-grained authorization.

For implementation examples, see the **sample-resource-plugin** in the security plugin repository.
For more detailed documentation on this feature, please see [RESOURCE_SHARING_AND_ACCESS_CONTROL.md](https://github.com/opensearch-project/security/blob/main/RESOURCE_SHARING_AND_ACCESS_CONTROL.md).

---

