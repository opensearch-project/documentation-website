---
layout: default
title: Workspaces APIs
parent: Workspace for OpenSearch Dashboards
nav_order: 10
---

# Workspaces APIs
Introduced 2.18
{: .label .label-purple }

The Workspaces API provides a set of endpoints for managing workspaces in OpenSearch Dashboards.

## List Workspaces API

You can use the following endpoint to retrieve a list of workspaces:

```json
POST <osd host>:<port>/api/workspaces/_list
```
{% include copy.html %}

The following table lists the available path parameters.

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `search` | String | Optional | A query string used to filter workspaces with simple query syntax, for example, `simple_query_string`. |
| `searchFields` | Array | Optional | Specifies which fields to perform the search query against. |
| `sortField` | String | Optional | The field name to use for sorting results. |
| `sortOrder` | String | Optional | Specifies ascending or descending sort order. |
| `perPage` | Number | Optional | The number of workspace results per page. |
| `page` | Number | Optional | The number of pages of results to retrieve. |
| `permissionModes` | Array | Optional | A list of permissions to filter by. |

#### Example request

```json
curl -k -u admin:admin \
  -H 'osd-xsrf: true' \
  -H 'Content-Type: application/json' \
  -X POST 'https://localhost:5601/api/workspaces/_list' \
  -d '{}'
```
{% include copy.html %}

The following example response shows a successful API call:

```json
{
  "success": true,
  "result": {
    "page": 1,
    "per_page": 20,
    "total": 1,
    "workspaces": [
      {
        "name": "test4",
        "description": "test4",
        "features": [
          "use-case-all"
        ],
        "lastUpdatedTime": "2025-09-10T14:47:04.741Z",
        "id": "B9Le1w",
        "permissionMode": "read"
      }
    ]
  }
}
```

## Get Workspaces API

You can use the following endpoint to retrieve a single workspace:

```json
GET <osd host>:<port>/api/workspaces/<id>
```
{% include copy.html %}

The following table lists the available path parameters. All path parameters are required.

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `<id>` | String | Required | Identifies the unique workspace to be retrieved. |

#### Example request

```json
curl -k -u admin:admin -X GET 'https://localhost:5601/api/workspaces/B9Le1w'
```
{% include copy.html %}

The following example response shows a successful API call:

```json
{
  "success": true,
  "result": {
    "name": "test4",
    "description": "test4",
    "features": [
      "use-case-all"
    ],
    "lastUpdatedTime": "2025-09-10T14:47:04.741Z",
    "id": "B9Le1w"
  }
}
```

## Create Workspaces API

You can use the following endpoint to create a workspace:

```json
POST <osd host>:<port>/api/workspaces
```
{% include copy.html %}

The following table lists the available path parameters.

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `attributes` | Object | Required | Defines the workspace attributes. |
| `permissions` | Object | Optional | Specifies the permissions for the workspace. |

#### Example request

```json
curl -k -XPOST "https://localhost:5601/api/workspaces" \
  -H "Content-Type: application/json" \
  -H "osd-xsrf: true" \
  -d '{
    "attributes": {
      "name": "test4",
      "description": "test4",
      "features": ["use-case-all"]
    }
  }' -u admin:admin
```
{% include copy.html %}

The following example response shows a successful API call:

```json
{
    "success": true,
    "result": {
        "id": "B9Le1w"
    }
}
```

## Update Workspaces API

You can use the following endpoint to update the attributes and permissions for a workspace:

```json
PUT <osd host>:<port>/api/workspaces/<id>
```
{% include copy.html %}

The following table lists the available path parameters.

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `<id>` | String | Required | Identifies the unique workspace to be retrieved. |
| `attributes` | Object | Required | Defines the workspace attributes. |
| `permissions` | Object | Optional | Specifies the permissions for the workspace. |

#### Example request without permissions object

```json
curl -k -XPUT "https://localhost:5601/api/workspaces/B9Le1w" \
  -H "Content-Type: application/json" \
  -H "osd-xsrf: true" \
  -d '{
    "attributes": {
      "name": "test5",
      "description": "Updated description"
    }
  }' -u admin:admin
```
{% include copy.html %}

The following example response shows a successful API call:

```json
{
    "success": true,
    "result": true
}
```

#### Example request with permissions object

```json
curl -k -u admin:admin \
  -H 'osd-xsrf: true' \
  -H 'Content-Type: application/json' \
  -X PUT 'https://localhost:5601/api/workspaces/B9Le1w' \
  -d '{
    "attributes": {},
    "settings": {
      "permissions": {
        "library_write": { "groups": ["obs-admins"] },
        "read": { "groups": ["obs-users"] }
      }
    }
  }'
```
{% include copy.html %}

The following example response shows a successful API call:

```json
{
    "success": true,
    "result": true
}
```

## Delete Workspaces API

You can use the following endpoint to delete a workspace:

```json
DELETE <osd host>:<port>/api/workspaces/<id>
```
{% include copy.html %}

The following table lists the available path parameters. All path parameters are required.

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `<id>` | String | Required | Identifies the unique workspace to be retrieved. |

#### Example request

```json
curl -k -u admin:admin \
  -H 'osd-xsrf: true' \
  -X DELETE 'https://localhost:5601/api/workspaces/B9Le1w'
```
{% include copy.html %}

The following example response shows a successful API call:

```json
{
    "success": true,
    "result": true
}
```

## Duplicate Saved Objects Workspaces API

You can use the following endpoint to copy saved objects between workspaces:

```json
POST <osd host>:<port>/api/workspaces/_duplicate_saved_objects
```
{% include copy.html %}

The following table lists the available path parameters.

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `objects` | Array | Required | Specifies the saved objects to be duplicated. |
| `targetWorkspace` | String | Required | Identifies the destination workspace for copying. |
| `includeReferencesDeep` | Boolean | Optional | Determines whether to copy all referenced objects to the target workspace. Default is `true`. |

The following table lists the attributes of the object in the `objects` parameter.

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `type` | String | Required | Defines the saved object classification, such as `index-pattern`, `config`, or `dashboard`. |
| `id` | String | Required | The ID of the saved object. |

#### Example request

```json
curl -k -u admin:admin \
  -H 'osd-xsrf: true' \
  -H 'Content-Type: application/json' \
  -X POST 'https://localhost:5601/api/workspaces/_duplicate_saved_objects' \
  -d '{
    "objects": [
      { "type": "index-pattern", "id": "619cc200-ecd0-11ee-95b1-e7363f9e289d" }
    ],
    "targetWorkspace": "9gt4lB"
  }'
```
{% include copy.html %}

The following example response shows a successful API call:

```json
{
    "successCount": 1,
    "success": true,
    "successResults": [
        {
            "type": "index-pattern",
            "id": "619cc200-ecd0-11ee-95b1-e7363f9e289d",
            "meta": {
                "title": "test*",
                "icon": "indexPatternApp"
            },
            "destinationId": "f4b724fd-9647-4bbf-bf59-610b43a62c75"
        }
    ]
}
```

## Associate Saved Objects Workspaces API

You can use the following endpoint to associate saved objects with a workspace:

```json
POST <osd host>:<port>/api/workspaces/_associate
```
{% include copy.html %}

The following table lists the available path parameters.

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `workspaceId` | String | Required | Identifies the target workspace for object association. |
| `savedObjects` | Array | Required | Specifies the list of saved objects to be copied. |

The following table lists the attributes of the object in the `objects` parameter.

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `type` | String | Required | Defines the saved object classification, such as `index-pattern`, `config`, or `dashboard`. |
| `id` | String | Required | The ID of the saved object. |

#### Example request

```json
curl -k -u admin:admin \
  -H 'osd-xsrf: true' \
  -H 'Content-Type: application/json' \
  -X POST 'https://localhost:5601/api/workspaces/_associate' \
  -d '{
    "objects": [
      { "type": "index-pattern", "id": "619cc200-ecd0-11ee-95b1-e7363f9e289d" }
    ],
    "targetWorkspace": "9gt4lB"
  }'
```
{% include copy.html %}

The following example response shows a successful API call:

```json
{
    "success": true,
    "result": [
        {
            "id": "619cc200-ecd0-11ee-95b1-e7363f9e289d",
        }
    ]
}
```

## Dissociate Saved Objects Workspaces API

You can use the following endpoint to dissociate saved objects from a workspace:

```json
POST <osd host>:<port>/api/workspaces/_dissociate
```
{% include copy.html %}

The following table lists the available path parameters.

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `workspaceId` | String | Required | The target workspace with which to associate the objects. |
| `savedObjects` | Array | Required | A list of saved objects to copy. |

The following table lists the attributes of the `savedObjects` parameter.

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `type` | String | Required | The type of the saved object, such as `index-pattern`, `config`, or `dashboard`. |
| `id` | String | Required | The ID of the saved object. |

#### Example request

```json
curl -k -u admin:admin \
  -H 'osd-xsrf: true' \
  -H 'Content-Type: application/json' \
  -X POST 'https://localhost:5601/api/workspaces/_dissociate' \
  -d '{
    "objects": [
      { "type": "index-pattern", "id": "619cc200-ecd0-11ee-95b1-e7363f9e289d" }
    ],
    "targetWorkspace": "9gt4lB"
  }'

```
{% include copy.html %}

The following example response shows a successful API call:

```json
{
    "success": true,
    "result": [
        {
            "id": "619cc200-ecd0-11ee-95b1-e7363f9e289d",
        }
    ]
}
```
