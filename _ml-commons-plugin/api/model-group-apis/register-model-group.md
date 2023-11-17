---
layout: default
title: Register model group
parent: Model group APIs
grand_parent: ML Commons API
nav_order: 10
---

# Register a model group

To register a model group, send a `POST` request to the `_register` endpoint. You can register a model group in `public`, `private`, or `restricted` access mode. 

Each model group name in the cluster must be globally unique.
{: .important}

For more information, see [Model access control]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control/).

## Path and HTTP method

```json
POST /_plugins/_ml/model_groups/_register
```

## Request fields

The following table lists the available request fields. 

Field |Data type | Description 
:--- | :--- | :---
`name` | String | The model group name. Required.
`description` | String | The model group description. Optional.
`access_mode` | String | The access mode for this model. Valid values are `public`, `private`, and `restricted`. When this parameter is set to `restricted`, you must specify either `backend_roles` or `add_all_backend_roles`, but not both. Optional. If you specify none of the security parameters (`access_mode`, `backend_roles`, and `add_all_backend_roles`), the default `access_mode` is `private`.
`backend_roles` | Array | A list of the model owner's backend roles to add to the model. Can be specified only if `access_mode` is `restricted`. Cannot be specified at the same time as `add_all_backend_roles`. Optional.
`add_all_backend_roles` | Boolean | If `true`, all backend roles of the model owner are added to the model group. Default is `false`. Cannot be specified at the same time as `backend_roles`. Admin users cannot set this parameter to `true`. Optional.

#### Example request

```json
POST /_plugins/_ml/model_groups/_register
{
    "name": "test_model_group_public",
    "description": "This is a public model group",
    "access_mode": "public"
}
```
{% include copy-curl.html %}

#### Example response

```json
{
    "model_group_id": "GDNmQ4gBYW0Qyy5ZcBcg",
    "status": "CREATED"
}
```

## Response fields

The following table lists the available response fields. 

Field |Data type | Description 
:--- | :--- | :---
`model_group_id` | String | The model group ID that you can use to access this model group.
`status` | String | The operation status. 

## Registering a public model group

If you register a model group with a `public` access mode, any model in this model group will be accessible to any user with access to the cluster. The following request registers a public model group:

```json
POST /_plugins/_ml/model_groups/_register
{
    "name": "test_model_group_public",
    "description": "This is a public model group",
    "access_mode": "public"
}
```
{% include copy-curl.html %}

## Registering a restricted model group

To limit access by backend role, you must register a model group with the `restricted` access mode. 

When registering a model group, you must attach one or more of your backend roles to the model using one but not both of the following methods:
    - Provide a list of backend roles in the `backend_roles` parameter.
    - Set the `add_all_backend_roles` parameter to `true` to add all your backend roles to the model group. This option is not available to admin users.

Any user who shares a backend role with the model group can access any model in this model group. This grants the user the permissions included with the user role that is mapped to the backend role. 

An admin user can access all model groups regardless of their access mode. 
{: .note}

#### Example request: A list of backend roles

The following request registers a restricted model group, which can be accessed only by users with the `IT` backend role:

```json
POST /_plugins/_ml/model_groups/_register
{
    "name": "model_group_test",
    "description": "This is an example description",
    "access_mode": "restricted",
    "backend_roles" : ["IT"]
}
```
{% include copy-curl.html %}

#### Example request: All backend roles

The following request registers a restricted model group, adding all backend roles of the user to the model group:

```json
POST /_plugins/_ml/model_groups/_register
{
    "name": "model_group_test",
    "description": "This is an example description",
    "access_mode": "restricted",
    "add_all_backend_roles": "true"
}
```
{% include copy-curl.html %}

## Registering a private model group

If you register a model group with a `private` access mode, any model in this model group will be accessible only to you and the admin users. The following request registers a private model group:

```json
POST /_plugins/_ml/model_groups/_register
{
    "name": "model_group_test",
    "description": "This is an example description",
    "access_mode": "private"
}
```
{% include copy-curl.html %}

If you don't specify any of the `access_mode`, `backend_roles`, or `add_all_backend_roles`, the model will have a `private` access mode:

```json
POST /_plugins/_ml/model_groups/_register
{
    "name": "model_group_test",
    "description": "This is an example description"
}
```
{% include copy-curl.html %}

## Registering a model group in a cluster where model access control is disabled

If model access control is disabled on your cluster (one of the [prerequisites](ml-commons-plugin/model-access-control/#model-access-control-prerequisites) is not met), you can register a model group with a `name` and `description` but cannot specify any of the access parameters (`model_access_name`, `backend_roles`, or `add_backend_roles`). By default, in such a cluster, all model groups are public.