---
layout: default
title: Update model group
parent: Model group APIs
grand_parent: ML Commons API
nav_order: 20
---

# Update a model group

To update a model group, send a `PUT` request to the `model_groups` endpoint and provide the ID of the model group you want to update.

When updating a model group, the following restrictions apply:

- The model owner or an admin user can update all fields. Any user who shares one or more backend roles with the model group can update the `name` and `description` fields only.
- When updating the `access_mode` to `restricted`, you must specify either `backend_roles` or `add_all_backend_roles` but not both.
- When updating the `name`, ensure the name is globally unique in the cluster.

For more information, see [Model access control]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control/).

## Path and HTTP method

```json
PUT /_plugins/_ml/model_groups/<model_group_id>
```

## Request fields

Refer to [Request fields](#request-fields) for request field descriptions. 

#### Example request

```json
PUT /_plugins/_ml/model_groups/<model_group_id>
{
    "name": "model_group_test",
    "description": "This is the updated description",
    "add_all_backend_roles": true
}
```
{% include copy-curl.html %}

## Updating a model group in a cluster where model access control is disabled

If model access control is disabled on your cluster (one of the [prerequisites](ml-commons-plugin/model-access-control/#model-access-control-prerequisites) is not met), you can update only the `name` and `description` of a model group but cannot update any of the access parameters (`model_access_name`, `backend_roles`, or `add_backend_roles`). 