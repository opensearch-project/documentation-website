---
layout: default
title: Model access control
has_children: false
nav_order: 20
---

# Model access control
**Introduced 2.9**
{: .label .label-purple }

You can use the Security plugin with ML Commons to manage access to specific models for non-admin users. For example, one department in an organization might want to restrict users in other departments from accessing their models.

To accomplish this, users are assigned one or more [_backend roles_]({{site.url}}{{site.baseurl}}/security/access-control/index/). Rather than assign individual roles to individual users during user configuration, backend roles provide a way to map a set of users to a role by assigning the backend role to users when they log in. For example, users may be assigned an `IT` backend role that includes the `ml_full_access` role and have full access to all ML Commons features. Alternatively, other users may be assigned an `HR` backend role that includes the `ml_readonly_access` role and be limited to read-only access to machine learning (ML) features. Given this flexibility, backend roles can provide finer-grained access to models and make it easier to assign multiple users to a role rather than mapping a user and role individually.

## ML Commons roles

The ML Commons plugin has two reserved roles:

- `ml_full_access`: Grants full access to all ML features, including starting new ML tasks and reading or deleting models.
- `ml_readonly_access`: Grants read-only access to ML tasks, trained models, and statistics relevant to the model's cluster. Does not grant permissions to start or delete ML tasks or models.

## Model groups

For access control, models are organized into _model groups_---collections of versions of a particular model. Like users, model groups can be assigned one or more backend roles. All versions of the same model share the same model name and have the same backend role or roles. 

You are considered a model _owner_ when you create a new model group. You remain the owner of the model and all its versions even if another user registers a model to this model group. When a model owner creates a model group, the owner can specify one of the following _access modes_ for this model group:

- `public`: All users who have access to the cluster can access this model group.
- `private`: Only the model owner or an admin user can access this model group.
- `restricted`: The owner, an admin user, or any user who shares one of the model group's backend roles can access any model in this model group. When creating a `restricted` model group, the owner must attach one or more of the owner's backend roles to the model. 

An admin can access all model groups in the cluster regardless of their access mode.
{: .note}

## Model access control prerequisites

Before using model access control, you must satisfy the following prerequisites:

1. Enable the Security plugin on your cluster. For more information, see [Security in OpenSearch]({{site.url}}{{site.baseurl}}/security/). 
2. For `restricted` model groups, ensure that an admin has [assigned backend roles to users](#assigning-backend-roles-to-users).
3. [Enable model access control](#enabling-model-access-control) on your cluster.

If any of the prerequisites are not met, all models in the cluster are `public` and can be accessed by any user who has access to the cluster.
{: .note}

## Assigning backend roles to users

Create the appropriate backend roles and assign those roles to users. Backend roles usually come from an [LDAP server]({{site.url}}{{site.baseurl}}/security/configuration/ldap/) or [SAML provider]({{site.url}}{{site.baseurl}}/security/configuration/saml/), but if you use the internal user database, you can use the REST API to [add them manually]({{site.url}}{{site.baseurl}}/security/access-control/api#create-user).

Only admin users can assign backend roles to users.
{: .note}

When assigning backend roles, consider the following example of two users: `alice` and `bob`.

The following request assigns the user `alice` the `analyst` backend role:

```json
PUT _plugins/_security/api/internalusers/alice
{
  "password": "alice",
  "backend_roles": [
    "analyst"
  ],
  "attributes": {}
}
```

The next request assigns the user `bob` the `human-resources` backend role:

```json
PUT _plugins/_security/api/internalusers/bob
{
  "password": "bob",
  "backend_roles": [
    "human-resources"
  ],
  "attributes": {}
}
```

Finally, the last request assigns both `alice` and `bob` the role that gives them full access to ML Commons:

```json
PUT _plugins/_security/api/rolesmapping/ml_full_access
{
  "backend_roles": [],
  "hosts": [],
  "users": [
    "alice",
    "bob"
  ]
}
```

If `alice` creates a model group and assigns it the `analyst` backend role, `bob` cannot access this model.

## Enabling model access control

You can enable model access control dynamically as follows:

```json
PUT _cluster/settings
{
  "transient": {
    "plugins.ml_commons.model_access_control_enabled": "true"
  }
}
```
{% include copy-curl.html %}

## Registering a model group

To register a model group, send a `POST` request to the `_register` endpoint. You can register a model group in `public`, `private`, or `restricted` access mode. 

Each model group name in the cluster must be globally unique.
{: .important}

### Path and HTTP method

```json
POST /_plugins/_ml/model_groups/_register
```

### Request fields

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

### Response fields

The following table lists the available response fields. 

Field |Data type | Description 
:--- | :--- | :---
`model_group_id` | String | The model group ID that you can use to access this model group.
`status` | String | The operation status. 

### Registering a public model group

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

### Registering a restricted model group

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

### Registering a private model group

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

### Registering a model group in a cluster where model access control is disabled

If model access control is disabled on your cluster (one of the [prerequisites](#model-access-control-prerequisites) is not met), you can register a model group with a `name` and `description` but cannot specify any of the access parameters (`model_access_name`, `backend_roles`, or `add_backend_roles`). By default, in such a cluster, all model groups are public.

## Updating a model group

To update a model group, send a `PUT` request to the `model_groups` endpoint and provide the ID of the model group you want to update.

When updating a model group, the following restrictions apply:

- The model owner or an admin user can update all fields. Any user who shares one or more backend roles with the model group can update the `name` and `description` fields only.
- When updating the `access_mode` to `restricted`, you must specify either `backend_roles` or `add_all_backend_roles` but not both.
- When updating the `name`, ensure the name is globally unique in the cluster.

### Path and HTTP method

```json
PUT /_plugins/_ml/model_groups/<model_group_id>
```

### Request fields

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

### Updating a model group in a cluster where model access control is disabled

If model access control is disabled on your cluster (one of the [prerequisites](#model-access-control-prerequisites) is not met), you can update only the `name` and `description` of a model group but cannot update any of the access parameters (`model_access_name`, `backend_roles`, or `add_backend_roles`). 

## Searching for a model group

When you search for a model group, only those model groups to which you have access will be returned. For example, for a match all query, model groups that will be returned are:

- All public model groups in the index 
- Private model groups for which you are the owner 
- Model groups that share at least one of the `backend_roles` with you

### Path and HTTP method

```json
POST /_plugins/_ml/model_groups/_search
GET /_plugins/_ml/model_groups/_search
```

#### Example request: Match all

The following request is sent by `user1` who has the `IT` and `HR` roles:

```json
POST /_plugins/_ml/model_groups/_search
{
  "query": {
    "match_all": {}
  },
  "size": 1000
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "took": 31,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 7,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": ".plugins-ml-model-group",
        "_id": "TRqZfYgBD7s2oEFdvrQj",
        "_version": 1,
        "_seq_no": 2,
        "_primary_term": 1,
        "_score": 1,
        "_source": {
          "backend_roles": [
            "HR",
            "IT"
          ],
          "owner": {
            "backend_roles": [
              "HR",
              "IT"
            ],
            "custom_attribute_names": [],
            "roles": [
              "ml_full_access",
              "own_index",
              "test_ml"
            ],
            "name": "user1",
            "user_requested_tenant": "__user__"
          },
          "created_time": 1685734407714,
          "access": "restricted",
          "latest_version": 0,
          "last_updated_time": 1685734407714,
          "name": "model_group_test",
          "description": "This is an example description"
        }
      },
      {
        "_index": ".plugins-ml-model-group",
        "_id": "URqZfYgBD7s2oEFdyLTm",
        "_version": 1,
        "_seq_no": 3,
        "_primary_term": 1,
        "_score": 1,
        "_source": {
          "backend_roles": [
            "IT"
          ],
          "owner": {
            "backend_roles": [
              "HR",
              "IT"
            ],
            "custom_attribute_names": [],
            "roles": [
              "ml_full_access",
              "own_index",
              "test_ml"
            ],
            "name": "user1",
            "user_requested_tenant": "__user__"
          },
          "created_time": 1685734410470,
          "access": "restricted",
          "latest_version": 0,
          "last_updated_time": 1685734410470,
          "name": "model_group_test",
          "description": "This is an example description"
        }
      },
      ...
    ]
  }
}
```

#### Example request: Search for model groups with an owner name

The following request to search for model groups of `user` is sent by `user2` who has the `IT` backend role:

```json
GET /_plugins/_ml/model_groups/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "nested": {
            "query": {
              "term": {
                "owner.name.keyword": {
                  "value": "user1",
                  "boost": 1
                }
              }
            },
            "path": "owner",
            "ignore_unmapped": false,
            "score_mode": "none",
            "boost": 1
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "took": 6,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 4,
      "relation": "eq"
    },
    "max_score": 0,
    "hits": [
      {
        "_index": ".plugins-ml-model-group",
        "_id": "TRqZfYgBD7s2oEFdvrQj",
        "_version": 1,
        "_seq_no": 2,
        "_primary_term": 1,
        "_score": 0,
        "_source": {
          "backend_roles": [
            "HR",
            "IT"
          ],
          "owner": {
            "backend_roles": [
              "HR",
              "IT"
            ],
            "custom_attribute_names": [],
            "roles": [
              "ml_full_access",
              "own_index",
              "test_ml"
            ],
            "name": "user1",
            "user_requested_tenant": "__user__"
          },
          "created_time": 1685734407714,
          "access": "restricted",
          "latest_version": 0,
          "last_updated_time": 1685734407714,
          "name": "model_group_test",
          "description": "This is an example description"
        }
      },
      ...
    ]
  }
}
```

#### Example request: Search for model groups with a model group ID

```json
GET /_plugins/_ml/model_groups/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "terms": {
            "_id": [
              "HyPNK4gBwNxGowI0AtDk"
            ]
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}

#### Example response

```json
{
  "took": 2,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": ".plugins-ml-model-group",
        "_id": "HyPNK4gBwNxGowI0AtDk",
        "_version": 3,
        "_seq_no": 16,
        "_primary_term": 5,
        "_score": 1,
        "_source": {
          "backend_roles": [
            "IT"
          ],
          "owner": {
            "backend_roles": [
              "",
              "HR",
              "IT"
            ],
            "custom_attribute_names": [],
            "roles": [
              "ml_full_access",
              "own_index",
              "test-ml"
            ],
            "name": "user1",
            "user_requested_tenant": null
          },
          "created_time": 1684362035938,
          "latest_version": 2,
          "last_updated_time": 1684362571300,
          "name": "model_group_test",
          "description": "This is an example description"
        }
      }
    ]
  }
}
```

## Deleting a model group

You can only delete a model group if it does not contain any model versions. 
{: .important}

If model access control is enabled on your cluster, only the owner or users with matching backend roles can delete the model group. Any users can delete any public model group.

If model access control is disabled on your cluster, users with the `delete model group API` permission can delete any model group. 

Admin users can delete any model group.
{: .note}

When you delete the last model version in a model group, that model group is automatically deleted from the index.
{: .important}

#### Example request

```json
DELETE _plugins/_ml/model_groups/<model_group_id>
```
{% include copy-curl.html %}

#### Example response

```json
{
  "_index": ".plugins-ml-model-group",
  "_id": "l8nnQogByXnLJ-QNpEk2",
  "_version": 5,
  "result": "deleted",
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 70,
  "_primary_term": 23
}
```
