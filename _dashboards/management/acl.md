---
layout: default
title: ACL - permission control for saved objects
parent: Dashboards Management
nav_order: 50
---

# ACL - permission control for saved objects
ACL is introduced for users to manage the permissions to access the saved objects they own, with the purpose to enable AuthZ on saved objects without relying on backend plugin.

## ACL data model

The ACLs can be represented as following:

```
{
  "permissions": {
    "<permission_type_1>": {
        "users": ["<principal_1>", "<principal_2>"],
        "groups": ["<principal_3>", "<principal_4>"]
    }
  } 
}
```

We can also allow wildcard `*` to indicate any authenticated identity in the ACL.

For example, if we want to allow finance_manager group to manage the workspace, and allow *finance_analyst* groups to build dashboards in the workspace, the workspace ACLs may look like:

```
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

While if we want to allow user-1 to modify a saved object, and one can only view a saved object, the ACL of that common saved object will look like:

```
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

## Types of ACL

ACL can be applied to 2 cases:
1. Workspace ACL
2. Objects ACL

### Workspace ACL

Objects within a workspace will inherit the permission policy from the workspace, for more details please refer to [Workspace ACL](../../workspace/workspace-acl)

### Objects ACL

Standalone objects can have ACL policy as well, and any operations to the objects have to go through the ACL policy validation.

## Enabling ACL feature

To enable *ACL* in OpenSearch Dashboards, locate your copy of the `opensearch_dashboards.yml` file and set the following option:

```yaml
savedObjects.permission.enabled: true
```
{% include copy-curl.html %}