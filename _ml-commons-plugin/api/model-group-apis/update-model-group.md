---
layout: default
title: Update model group
parent: Model group APIs
grand_parent: ML APIs
nav_order: 20
---

# Update Model Group API

To update a model group, send a `PUT` request to the `model_groups` endpoint and provide the ID of the model group you want to update.

When updating a model group, the following restrictions apply:

- The model owner or an admin user can update all fields. Any user who shares one or more backend roles with the model group can update the `name` and `description` fields only.
- When updating the `access_mode` to `restricted`, you must specify either `backend_roles` or `add_all_backend_roles` but not both.
- When updating the `name`, ensure the name is globally unique in the cluster.

For more information, see [Model access control]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control/).

## Path and HTTP method

```json
PUT /_plugins/_ml/model_groups/{model_group_id}
```

## Request body fields

The following table lists the available request body fields. All fields are optional.

Field |Data type | Description 
:--- | :--- | :---
`name` | String | The model group name. Must be unique in the cluster.
`description` | String | The model group description.
`access_mode` | String | The access mode for this model group. Valid values are `public`, `private`, and `restricted`. When this parameter is set to `restricted`, you must specify either `backend_roles` or `add_all_backend_roles`, but not both. Changing the access mode to `public` or `private` removes the model group's backend roles.
`backend_roles` | Array | A list of the model owner's backend roles to add to the model group. Can be specified only if `access_mode` is `restricted` or omitted. If you specify `backend_roles` without `access_mode`, the access mode changes to `restricted`. Cannot be specified at the same time as `add_all_backend_roles`.
`add_all_backend_roles` | Boolean | If `true`, all backend roles of the model owner are added to the model group. If you set this parameter to `true` without specifying `access_mode`, the access mode changes to `restricted`. Cannot be specified at the same time as `backend_roles`. Admin users cannot set this parameter to `true`.

## Example request

```json
PUT /_plugins/_ml/model_groups/{model_group_id}
{
    "name": "model_group_test",
    "description": "This is the updated description",
    "add_all_backend_roles": true
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "status": "Updated"
}
```

## Updating a model group in a cluster where model access control is disabled

If model access control is disabled on your cluster (one of the [prerequisites]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control/#model-access-control-prerequisites) is not met), you can update only the `name` and `description` of a model group but cannot update any of the access parameters (`access_mode`, `backend_roles`, or `add_all_backend_roles`). 