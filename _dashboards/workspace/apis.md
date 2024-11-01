---
layout: default
title: Workspace APIs
parent: Workspace
nav_order: 10
---

# Workspace APIs

## List workspaces API

List workspaces.

* Path and HTTP methods

```json
POST <osd host>:<port>/api/workspaces/_list
```

* Request body

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `search` | String | NO | A `simple_query_string` query DSL used to search the workspaces. |
| `searchFields` | Array | NO  |  The fields to perform the `simple_query_string` parsed query against. |
| `sortField` | String | NO  | The fields used for sorting the response. |
| `sortOrder` | String | NO  | The order used for sorting the response. |
| `perPage` | Number | NO  | The number of workspaces to return in each page. |
| `page` | Number | NO  | The page of workspaces to return. |
| `permissionModes` | Array | NO  | The permission mode list. |

* Example request

```json
POST /api/workspaces/_list
```
{% include copy-curl.html %}

* Example response

```json
{
    "success": true,
    "result": {
        "page": 1,
        "per_page": 20,
        "total": 3,
        "workspaces": [
            {
                "name": "test1",
                "features": [
                    "use-case-all"
                ],
                "id": "hWNZls"
            },
            {
                "name": "test2",
                "features": [
                    "use-case-observability"
                ],
                "id": "SnkOPt"
            }
        ]
    }
}
```

## Get workspace API

Retrieve a single workspace.

* Path and HTTP methods

```json
GET <osd host>:<port>/api/workspaces/<id>
```

* Path parameters

The following table lists the available path parameters. All path parameters are required.

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `<id>` | String | YES | The ID of the workspace. |

* Example request

```json
GET /api/workspaces/SnkOPt
```
{% include copy-curl.html %}

* Example response

```json
{
    "success": true,
    "result": {
        "name": "test2",
        "features": ["use-case-all"],
        "id": "SnkOPt"
    }
}
```

## Create workspace API

Create a workspace.

* Path and HTTP methods

```json
POST <osd host>:<port>/api/workspaces
```

* Request body

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `attributes` | Object | YES | The attributes of the workspace. |
| `permissions` | Object | NO  |  The permission info of the workspace. |


* Example request

```json
POST api/workspaces
{
    "attributes": {
        "name": "test4",
        "description": "test4"
    }
}
```
{% include copy-curl.html %}

* Example response

```json
{
    "success": true,
    "result": {
        "id": "eHVoCJ"
    }
}
```

## Update workspace API

Update the attributes and permissions of a workspace.

* Path and HTTP methods

```json
PUT <osd host>:<port>/api/workspaces/<id>
```

* Path parameters

The following table lists the available path parameters. All path parameters are required.

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `<id>` | String | YES | The ID of the workspace. |

* Request body

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `attributes` | Object | YES | The attributes of the workspace. |
| `permissions` | Object | NO  |  The permission info of the workspace. |


* Example request

```json
PUT api/workspaces/eHVoCJ
{
    "attributes": {
        "name": "test4",
        "description": "test update"
    }
}
```
{% include copy-curl.html %}

* Example response

```json
{
    "success": true,
    "result": true
}
```

## Delete workspace API

Delete a workspace.

* Path and HTTP methods

```json
DELETE <osd host>:<port>/api/workspaces/<id>
```

* Path parameters

The following table lists the available path parameters. All path parameters are required.

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `<id>` | String | YES | The ID of the workspace. |


* Example request

```json
DELETE api/workspaces/eHVoCJ
```
{% include copy-curl.html %}

* Example response

```json
{
    "success": true,
    "result": true
}
```

## Duplicate saved objects API

Duplicate saved objects among workspaces.

* Path and HTTP methods

```json
POST <osd host>:<port>/api/workspaces/_duplicate_saved_objects
```

* Request body

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `objects` | Array | YES | A list of saved objects to copy. |
| `targetWorkspace` | String | YES  | The ID of the workspace to copy to. |
| `includeReferencesDeep` | Boolean | NO | Copy all of the referenced objects of the specified objects to the target workspace . Defaults to `true`.|

The attributes of the object in the `objects` parameter are as follows:
| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `type` | String | YES | The type of the saved object, such as `index-pattern`, `config` and `dashboard`. |
| `id` | String | YES | The ID of the saved object. |

* Example request

```json
POST api/workspaces/_duplicate_saved_objects
{
    "objects": [
        {
            "type": "index-pattern",
            "id": "619cc200-ecd0-11ee-95b1-e7363f9e289d"
        }
    ],
    "targetWorkspace": "9gt4lB"
}
```
{% include copy-curl.html %}

* Example response

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

## Associate saved objects API

Associate saved objects into a workspace.

* Path and HTTP methods

```json
POST <osd host>:<port>/api/workspaces/_associate
```

* Request body

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `workspaceId` | String | YES | Target workspace you want the objects associated to |
| `savedObjects` | Array | YES | A list of saved objects to copy. |

The attrbutes of the object in the `savedObjects` parameter are as follows:
| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `type` | String | YES | The type of the saved object, such as `index-pattern`, `config` and `dashboard`. |
| `id` | String | YES | The ID of the saved object. |

* Example request

```json
POST api/workspaces/_associate
{
    "objects": [
        {
            "type": "index-pattern",
            "id": "619cc200-ecd0-11ee-95b1-e7363f9e289d"
        }
    ],
    "targetWorkspace": "9gt4lB"
}
```
{% include copy-curl.html %}

* Example response

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

## Dissociate saved objects API

Dissociate saved objects from a workspace.

* Path and HTTP methods

```json
POST <osd host>:<port>/api/workspaces/_dissociate
```

* Request body

| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `workspaceId` | String | YES | Target workspace you want the objects associated to |
| `savedObjects` | Array | YES | A list of saved objects to copy. |

The attrbutes of the object in the `savedObjects` parameter are as follows:
| Parameter | Data type | Required | Description |
| :--- | :--- | :--- | :--- |
| `type` | String | YES | The type of the saved object, such as `index-pattern`, `config` and `dashboard`. |
| `id` | String | YES | The ID of the saved object. |

* Example request

```json
POST api/workspaces/_dissociate
{
    "objects": [
        {
            "type": "index-pattern",
            "id": "619cc200-ecd0-11ee-95b1-e7363f9e289d"
        }
    ],
    "targetWorkspace": "9gt4lB"
}
```
{% include copy-curl.html %}

* Example response

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