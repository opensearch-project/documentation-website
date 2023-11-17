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

## Model access control API

Model access control is achieved through the Model Group APIs. These APIs include the register, search, update, and delete model group operations.

For information about model access control API, see [Model group APIs]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-group-apis/index/).