---
layout: default
title: Resource sharing APIs
parent: Resource sharing and access control
grand_parent: Access control
nav_order: 10
---

# Resource sharing APIs
**Introduced 3.3**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).
{: .warning}

The Resource Sharing APIs provide programmatic access to manage fine-grained, document-level access control for plugin-defined resources. These APIs allow you to share resources, manage access permissions, and automate resource sharing workflows.

You can manage resource sharing directly using these REST APIs. Operations can only be performed if you are the owner, a superadmin, or have sharing access to the resource.

## Migrate legacy sharing metadata

Imports legacy plugin-managed sharing metadata. This API is intended for administrators to run once during system migration.

### Endpoint

```json
POST _plugins/_security/api/resources/migrate
```

### Request body fields

The following table lists the available request body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `source_index` | String | The source index containing legacy sharing metadata. Required. |
| `username_path` | String | A JSON path to the owner name (for example, `/owner/name`). Required. |
| `backend_roles_path` | String | A JSON path to backend roles (for example, `/owner/backend_roles`). Required. |
| `default_owner` | String | The default owner for resources without explicit ownership. Required. |
| `default_access_level` | Object | The default access levels by resource type. Add additional entries if the resource index contains multiple resource types. Required. |

### Example request

```json
POST _plugins/_security/api/resources/migrate
{
  "source_index": "legacy-sharing-index",
  "username_path": "/owner/name",
  "backend_roles_path": "/owner/backend_roles",
  "default_owner": "admin",
  "default_access_level": {
    "ml-model-group": "read_only",
    "anomaly-detector": "read_write"
  }
}
```
{% include copy-curl.html %}

### Example response

```json
{
  "summary": "Migration complete. migrated 10; skippedNoType 1; skippedExisting 0; failed 1",
  "resourcesWithDefaultOwner": ["doc-17"],
  "skippedResources": ["doc-22"]
}
```

### Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `summary` | String | A summary message describing the migration results, including counts of migrated, skipped, and failed resources. |
| `resourcesWithDefaultOwner` | Array | A list of resource IDs that were assigned the default owner because no owner information was found. |
| `skippedResources` | Array | A list of resource IDs that were skipped during migration (for example, missing type information or already migrated). |

### Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `restapi:admin/resource_sharing/migrate`.

## Get sharing configuration

Retrieves the current sharing configuration for a specific resource.

### Endpoint

```json
GET _plugins/_security/api/resource/share
```

### Query parameters

The following table lists the available query parameters. 

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `resource_id` | String | The unique identifier of the resource. Required. |
| `resource_type` | String | The type of the resource (for example, `ml-model-group`). Required. |

### Example request

```json
GET _plugins/_security/api/resource/share?resource_id=model-group-123&resource_type=ml-model-group
```
{% include copy-curl.html %}

### Example response

```json
{
  "sharing_info": {
    "resource_id": "model-group-123",
    "created_by": {
      "user": "admin"
    },
    "share_with": {
      "read_only": {
        "users": ["bob"],
        "roles": ["data_viewer"],
        "backend_roles": []
      },
      "read_write": {
        "users": ["charlie"],
        "roles": [],
        "backend_roles": ["ml_team"]
      }
    }
  }
}
```

### Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `sharing_info` | Object | Contains the complete sharing configuration for the resource. |
| `sharing_info.resource_id` | String | The unique identifier of the resource. |
| `sharing_info.created_by` | Object | Information about the resource creator. |
| `sharing_info.created_by.user` | String | The username of the resource creator. |
| `sharing_info.share_with` | Object | The sharing configuration organized by access level. |
| `sharing_info.share_with.<access_level>` | Object | An access level (for example, `read_only`, `read_write`) containing lists of principals. |
| `sharing_info.share_with.<access_level>.users` | Array | A list of usernames with this access level. |
| `sharing_info.share_with.<access_level>.roles` | Array | A list of roles with this access level. |
| `sharing_info.share_with.<access_level>.backend_roles` | Array | A list of backend roles with this access level. |

### Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `cluster:admin/security/resource/share`.

## Replace resource sharing configuration

Completely replaces the sharing configuration for a resource. This operation overwrites all existing sharing settings.

### Endpoint

```json
PUT _plugins/_security/api/resource/share
```

### Request body fields

The following table lists the available request body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `resource_id` | String | The unique identifier of the resource. Required. |
| `resource_type` | String | The type of the resource. Required. |
| `share_with` | Object | Sharing configuration organized by access level. Each access level can contain `users`, `roles`, and `backend_roles` arrays. Required. |

### Example request: Share with specific users and roles

```json
PUT _plugins/_security/api/resource/share
{
  "resource_id": "model-group-123",
  "resource_type": "ml-model-group",
  "share_with": {
    "read_only": {
      "users": ["bob"],
      "roles": ["data_viewer"]
    },
    "read_write": {
      "users": ["charlie"],
      "backend_roles": ["ml_team"]
    }
  }
}
```
{% include copy-curl.html %}

### Example request: Make a resource private

```json
PUT _plugins/_security/api/resource/share
{
  "resource_id": "model-group-123",
  "resource_type": "ml-model-group",
  "share_with": {}
}
```
{% include copy-curl.html %}

### Example response

```json
{
  "sharing_info": {
    "resource_id": "model-group-123",
    "created_by": {
      "user": "admin"
    },
    "share_with": {
      "read_only": {
        "users": ["bob"],
        "roles": ["data_viewer"],
        "backend_roles": []
      },
      "read_write": {
        "users": ["charlie"],
        "roles": [],
        "backend_roles": ["ml_team"]
      }
    }
  }
}
```

### Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `sharing_info` | Object | Contains the complete sharing configuration for the resource. |
| `sharing_info.resource_id` | String | The unique identifier of the resource. |
| `sharing_info.created_by` | Object | Information about the resource creator. |
| `sharing_info.created_by.user` | String | The username of the resource creator. |
| `sharing_info.share_with` | Object | The sharing configuration organized by access level. |
| `sharing_info.share_with.<access_level>` | Object | An access level (for example, `read_only`, `read_write`) containing lists of principals. |
| `sharing_info.share_with.<access_level>.users` | Array | A list of usernames with this access level. |
| `sharing_info.share_with.<access_level>.roles` | Array | A list of roles with this access level. |
| `sharing_info.share_with.<access_level>.backend_roles` | Array | A list of backend roles with this access level. |

### Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `cluster:admin/security/resource/share`.

## Update resource sharing configuration

Adds or removes access without affecting existing sharing configuration. This operation is non-destructive and preserves current access settings.

### Endpoint

```json
PATCH _plugins/_security/api/resource/share
```

### Request body fields

The following table lists the available request body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `resource_id` | String | The unique identifier of the resource. Required. |
| `resource_type` | String | The type of the resource. Required. |
| `add` | Object | Access to add, organized by access level. Optional. |
| `revoke` | Object | Access to remove, organized by access level. Optional. |

### Example request: Add and revoke access simultaneously

```json
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

### Example request: Make a resource public

```json
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

### Example request: Remove specific access

```json
PATCH _plugins/_security/api/resource/share
{
  "resource_id": "model-group-123",
  "resource_type": "ml-model-group",
  "revoke": {
    "read_write": { "users": ["charlie"] }
  }
}
```
{% include copy-curl.html %}

### Example response

```json
{
  "sharing_info": {
    "resource_id": "model-group-123",
    "created_by": {
      "user": "admin"
    },
    "share_with": {
      "read_only": {
        "users": ["bob", "dave"],
        "roles": ["data_viewer"],
        "backend_roles": []
      },
      "read_write": {}
    }
  }
}
```

### Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `sharing_info` | Object | Contains the complete sharing configuration for the resource after modifications. |
| `sharing_info.resource_id` | String | The unique identifier of the resource. |
| `sharing_info.created_by` | Object | Information about the resource creator. |
| `sharing_info.created_by.user` | String | The username of the resource creator. |
| `sharing_info.share_with` | Object | The updated sharing configuration organized by access level. |
| `sharing_info.share_with.<access_level>` | Object | An access level containing lists of principals after add/revoke operations. |
| `sharing_info.share_with.<access_level>.users` | Array | A list of usernames with this access level. |
| `sharing_info.share_with.<access_level>.roles` | Array | A list of roles with this access level. |
| `sharing_info.share_with.<access_level>.backend_roles` | Array | A list of backend roles with this access level. |

### Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `cluster:admin/security/resource/share`.

## List accessible resources

Returns all resources of a specific type that you have access to view or manage.

### Endpoint

```json
GET _plugins/_security/api/resource/list
```

### Query parameters

The following table lists the available query parameters. 

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `resource_type` | String | The type of resources to list. Required. |

### Example request

```json
GET _plugins/_security/api/resource/list?resource_type=ml-model-group
```
{% include copy-curl.html %}

### Example response

```json
{
  "resources": [
    {
      "resource_id": "model-group-123",
      "created_by": {
        "user": "admin",
        "tenant": "default"
      },
      "share_with": {
        "read_only": {
          "users": ["bob"]
        }
      },
      "can_share": true
    },
    {
      "resource_id": "model-group-456",
      "created_by": {
        "user": "alice",
        "tenant": "default"
      },
      "can_share": false
    }
  ]
}
```

### Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `resources` | Array | A list of resources accessible to the authenticated user. |
| `resources[].resource_id` | String | The unique identifier of the resource. |
| `resources[].created_by` | Object | Information about the resource creator. |
| `resources[].created_by.user` | String | The username of the resource creator. |
| `resources[].created_by.tenant` | String | The tenant associated with the resource creator (if applicable). |
| `resources[].share_with` | Object | The sharing configuration for this resource. This field may not be present if the resource has not been shared yet. |
| `resources[].share_with.<access_level>` | Object | An access level containing lists of principals. |
| `resources[].share_with.<access_level>.users` | Array | A list of usernames with this access level. |
| `resources[].can_share` | Boolean | Indicates whether the authenticated user has permission to share this resource. |

### Required permissions

This API requires authenticated access but does not require specific cluster permissions.

## List resource types

Returns all available shareable resource types and their supported access levels. OpenSearch Dashboards uses this API to determine supported access levels per resource type.

### Endpoint

```json
GET _plugins/_security/api/resource/types
```

### Example request

```json
GET _plugins/_security/api/resource/types
```
{% include copy-curl.html %}

### Example response

```json
{
  "types": [
    {
      "type": "ml-model-group",
      "action_groups": ["ml_read_only", "ml_read_write", "ml_full_access"]
    },
    {
      "type": "anomaly-detector",
      "action_groups": ["ad_read_only", "ad_full_access"]
    }
  ]
}
```

### Response body fields

The following table lists all response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `types` | Array | A list of resource types available in the system. |
| `types[].type` | String | The name of the resource type. |
| `types[].action_groups` | Array | A list of available action groups (access levels) for this resource type. |

### Required permissions

This API requires authenticated access but does not require specific cluster permissions.


## Related documentation

- [Resource sharing and access control]({{site.url}}{{site.baseurl}}/security/access-control/resources/) - Backend concepts, configuration, and setup
- [Resource access management]({{site.url}}{{site.baseurl}}/dashboards/management/resource-sharing/) - UI workflows and user guidance