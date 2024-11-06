---
layout: default
title: Access control lists for saved objects
parent: Dashboards Management
nav_order: 50
---

# Access control lists for saved objects
Introduced 2.18
{: .label .label-purple }

You can use access control lists (ACLs) to manage permissions for your saved objects, providing authorization (AuthZ) capabilities without requiring backend plugin integration.

## Understanding ACL types

ACLs are applied at two levels:

1. **Workspace ACL:** Workspace objects inherit permissions from their parent workspace. See [Workspace ACL]({{site.url}}{{site.baseurl}}/dashboards/workspace/workspace-acl) for more information.
2. **Objects ACL:** Each individual object can have its own ACL policy. All operations on these objects must pass ACL policy validation.

## Enabling the ACL feature

The ACL feature must be enabled before you can define any access controls. Enable it by:

1. Opening your `opensearch_dashboards.yml` file.
2. Enabling permissions with `savedObjects.permission.enabled: true`.

## Defining ACL permissions

ACL permissions are defined using the following schema: 

```json
{
  "permissions": {
    "<permission_type_1>": {
        "users": ["<principal_1>", "<principal_2>"],
        "groups": ["<principal_3>", "<principal_4>"]
    }
  } 
}
```
{% include copy-curl.html %}

### Granting permissions to authenticated users

The wildcard character (`*`) grants permissions to all authenticated users. In the following example, the ACL grants workspace management permissions to the `finance_manager` group and dashboard creation permissions to the `finance_analyst` group:

```json
{
  "permissions": {
    "write": {
        "groups": ["finance_manager"]
    },
    "library_write": {
        "groups": ["finance_analyst"]
    }
  } 
}
```
{% include copy-curl.html %}

### Configuring mixed-level permissions

To allow one user, `user-1` for example, to modify an object while giving read-only access to others, you can configure the ACL policy as follows:

```json
{
  "permissions": {
    "read": {
        "users": ["*"]
    },
    "write": {
        "users": ["user-1"]
    },
  }
}
```
{% include copy-curl.html %}
