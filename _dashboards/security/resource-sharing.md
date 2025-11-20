---
layout: default
title: Resource Access Management via Dashboards
nav_order: 145
---

# Resource Access Management via Dashboards

**Introduced 3.3**
{: .label .label-purple }

Resource Sharing in OpenSearch Dashboards provides **fine-grained, document-level access control** for plugin-defined resources such as ML model groups, anomaly detectors, reports definitions, and other shareable objects. It extends OpenSearch’s role-based access control (RBAC) by allowing resource owners to specify *who* can access a resource and *what level of access* they have.

This feature is **experimental**.
{: .warning }

---

## How resource sharing works

A **resource** is a document created by a plugin and stored in a protected system index. Examples:

- ML model groups and models  
- Anomaly detectors  
- Reporting definitions  
- Workflows (Flow Framework)  
- Any plugin-defined resource type  

Default access:

| User             | Access                                  |
|------------------|-----------------------------------------|
| Resource creator | Full access (view, edit, delete, share) |
| Super-admin      | Full access                             |
| Other users      | No access unless shared                 |

Once a resource is shared with specific users, roles, or backend roles, it becomes visible to those users inside Dashboards. Dashboards automatically filters resource lists based on your identity, permissions, and the resource sharing configuration.

---

# Requirements

To use resource sharing in Dashboards, you must have:

### 1. Plugin-level cluster permissions  
These are assigned by an administrator. Required for resource creation.

### 2. Resource-level sharing access  
A resource must be shared with you explicitly unless you are the owner or a super-admin.

### 3. Security plugin settings enabled  

Admins must enable:

```yaml
plugins.security.experimental.resource_sharing.enabled: true
plugins.security.experimental.resource_sharing.protected_types: ["<resource-type>"]
plugins.security.system_indices.enabled: true
````

If you do not see sharing options in Dashboards, contact your administrator.
{: .note }

---

# Sharing resources through the Dashboards UI

On left-hand navigation page, under Management section `Resource Access Management` app must be visible if the resource-sharing feature is enabled.

## 1. Open a shareable resource

Click on `Resource Access Management` app. Once the page loads, you will see a drop-down with a label `Select a type...`.

Select a resource type that you would like to see your accessible resources for.

## 2. Open the Sharing panel

Once you select an available resource type, the Resources table will be populated will all resources you have access to. If you do not see any resources, create one or ask admins or resource owners to share them with you.


## 3. Choose an access level

Dashboards retrieves available access levels (action groups) dynamically from OpenSearch. Examples:
* `ad_read_only`
* `ml_read_write`
* `flow_framework_full_access`

NOTE: These access levels are plugin-specific levels and vary by resource-type.
{: .note } blue

Choose the level and proceed to next step.

## 4. Add users, roles, or backend roles

You can grant access to:

* Specific users
* Specific roles
* Specific backend roles

Example inputs:

* User: `alice`
* Role: `data_viewer`
* Backend role: `engineering_team`

Wildcards (`*`) are supported and come into effect only for users field which can be used to mark a resource as a publicly accessible at the chosen access level.

## 5. Save your changes

Dashboards updates the backend configuration and immediately applies access changes.

---

# Viewing and managing access

The Sharing panel shows:

* The **resource owner**
* All users/roles/backend roles with access
* Their access levels
* Whether you can reshare the resource

A user can share a resource only if:

* They are the owner
* Or the owner shared the resource with them *and* granted share permission
* Or they are a super-admin

Removing access immediately hides the resource from affected users.

---

# Listing resources shared with you

Dashboards automatically displays only the resources you can access. No special actions are required. Visibility is determined by:

* Ownership
* Sharing configuration
* Plugin cluster permissions
* Role/backend role membership
* Wildcards (`users: ["*"]` for public resources)

---

# Managing resource sharing using Dev Tools

You can also manage resource sharing directly using the **Dev Tools Console** in Dashboards. These operations can only be performed if you are the owner, a super-admin or have sharing access to the resource.

All APIs start with:

```
_plugins/_security/api/resource
```

---

## 1. Migration API (admin-only)

Used once to import legacy plugin-managed sharing metadata.

```
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

## 2. View sharing configuration

```
GET _plugins/_security/api/resource/share?resource_id=<id>&resource_type=<type>
```
{% include copy-curl.html %}

---

## 3. Share a resource (replace all access)

This **overwrites** the entire sharing configuration.

```
PUT _plugins/_security/api/resource/share
{
  "resource_id": "model-group-123",
  "resource_type": "ml-model-group",
  "share_with": {
    "read_only": { "users": ["bob"] },
    "read_write": { "users": ["charlie"] }
  }
}
```
{% include copy-curl.html %}

---

## 4. Add or revoke access (non-destructive)

This updates sharing without removing existing access.

```
PATCH _plugins/_security/api/resource/share
{
  "resource_id": "model-group-123",
  "resource_type": "ml-model-group",

  "add": {
    "read_only": { "users": ["dave"] }
  },

  "revoke": {
    "read_write": { "users": ["charlie"] }
  }
}
```
{% include copy-curl.html %}

---

## 5. List all resources you can access

```
GET _plugins/_security/api/resource/list?resource_type=<type>
```
{% include copy-curl.html %}

---

## 6. List all shareable resource types

```
GET _plugins/_security/api/resource/types
```
{% include copy-curl.html %}

Dashboards uses this to determine supported access levels per resource type.

---

## 7. Making a resource public

```
PATCH _plugins/_security/api/resource/share
{
  "resource_id": "model-group-123",
  "resource_type": "ml-model-group",
  "add": {
    "read_only": { "users": ["*"] }
  }
}
```
{% include copy-curl.html %}

---

## 8. Making a resource private

```
PUT _plugins/_security/api/resource/share
{
  "resource_id": "model-group-123",
  "resource_type": "ml-model-group",
  "share_with": {}
}
```
{% include copy-curl.html %}

This resets the resource to **owner-only**.

---

# Troubleshooting

| Issue                                        | Possible cause                         | Fix                                                                        |
|----------------------------------------------|----------------------------------------|----------------------------------------------------------------------------|
| `Resource Access Management` app not visible | Feature disabled                       | Ask admin to enable `resource_sharing.enabled`                             |
| User can't create resource                   | Missing plugin API permissions         | Ask admin to map to appropriate role                                       |
| User can't access a resource                 | Resource is not shared with them       | Ask owner to share it with them at appropriate access level                |
| API returns 403 in Dev Tools                 | Resource is not shared with them       | Ask owner to share it with them at appropriate access level                |
| Resource not listed in Dashboards            | Resource not marked as protected       | Ask admin to mark resource as protected `resource_sharing.protected_types` |
| PATCH does nothing                           | Access level not defined for that type | Verify plugin’s action-groups                                              |

---

# Summary

Resource Sharing in Dashboards allows you to:

* Keep resources private
* Share resources securely with specific users or teams
* Grant read-only or read-write access
* Modify or revoke access at any time
* Automate or batch operations using Dev Tools

Dashboards provides a simple UI for everyday access management, while Dev Tools offers full control for advanced workflows.

If resource sharing features are not visible in Dashboards, contact your OpenSearch administrator to enable the capability and assign appropriate permissions.

Looking for backend concepts, APIs, and YAML setup? See the backend guide: [Resource Sharing and Access Control]({{site.url}}{{site.baseurl}}/security/access-control/resources/)
{: .note}
