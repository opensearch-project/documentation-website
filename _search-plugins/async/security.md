---
layout: default
title: Asynchronous search security
nav_order: 2
parent: Asynchronous search
has_children: false
redirect_from:
 - /search-plugins/async/security/
---

# Asynchronous search security

You can use the Security plugin with asynchronous searches to limit non-admin users to specific actions. For example, you might want some users to only be able to submit or delete asynchronous searches, while you might want others to only view the results.

All asynchronous search indexes are protected as system indexes. Only a super admin user or an admin user with a Transport Layer Security (TLS) certificate can access system indexes. For more information, see [System indexes]({{site.url}}{{site.baseurl}}/security/configuration/system-indices/).

## Basic permissions

As an admin user, you can use the Security plugin to assign specific permissions to users based on which API operations they need access to. For a list of supported APIs operations, see [Asynchronous search]({{site.url}}{{site.baseurl}}/).

The Security plugin has two built-in roles that cover most asynchronous search use cases: `asynchronous_search_full_access` and `asynchronous_search_read_access`. For descriptions of each, see [Predefined roles]({{site.url}}{{site.baseurl}}/security/access-control/users-roles#predefined-roles).

If these roles don’t meet your needs, mix and match individual asynchronous search permissions to suit your use case. Each action corresponds to an operation in the REST API. For example, the `cluster:admin/opensearch/asynchronous_search/delete` permission lets you delete a previously submitted asynchronous search.

### A note on Asynchronous Search and fine-grained access control

By design, the Asynchronous Search plugin extracts data from a target index and stores the data in a separate index to make search results available to users with the proper permissions. Although a user with either the `asynchronous_search_read_access` or `cluster:admin/opensearch/asynchronous_search/get` permission cannot submit the asynchronous search request itself, that user can get and view the search results using the associated search ID. [Document-level security]({{site.url}}{{site.baseurl}}/security/access-control/document-level-security) (DLS) and [field-level security]({{site.url}}{{site.baseurl}}/security/access-control/field-level-security) (FLS) access controls are designed to protect the data in the target index. But once the data is stored outside this index, users with these access permissions are able to use search IDs to get and view asynchronous search results, which may include data that is otherwise concealed by DLS and FLS access control in the target index.

To reduce the chances of unintended users viewing search results that could describe an index, we recommend that administrators enable role-based access control and keep these kinds of design elements in mind when assigning permissions to the intended group of users. See [Limit access by backend role](#advanced-limit-access-by-backend-role) for details.

## (Advanced) Limit access by backend role

Use backend roles to configure fine-grained access to asynchronous searches based on roles. For example, users of different departments in an organization can view asynchronous searches owned by their own department.

First, make sure your users have the appropriate [backend roles]({{site.url}}{{site.baseurl}}/security/access-control/index/). Backend roles usually come from an [LDAP server]({{site.url}}{{site.baseurl}}/security/configuration/ldap/) or [SAML provider]({{site.url}}{{site.baseurl}}/security/configuration/saml/). However, if you use the internal user database, you can use the REST API to [add them manually]({{site.url}}{{site.baseurl}}/security/access-control/api#create-user).

Now when users view asynchronous search resources in OpenSearch Dashboards (or make REST API calls), they only see asynchronous searches submitted by users who have a subset of the backend role.
For example, consider two users: `judy` and `elon`.

`judy` has an IT backend role:

```json
PUT _plugins/_security/api/internalusers/judy
{
  "password": "judy",
  "backend_roles": [
    "IT"
  ],
  "attributes": {}
}
```

`elon` has an admin backend role:

```json
PUT _plugins/_security/api/internalusers/elon
{
  "password": "elon",
  "backend_roles": [
    "admin"
  ],
  "attributes": {}
}
```

Both `judy` and `elon` have full access to asynchronous search:

```json
PUT _plugins/_security/api/rolesmapping/async_full_access
{
  "backend_roles": [],
  "hosts": [],
  "users": [
    "judy",
    "elon"
  ]
}
```

Because they have different backend roles, an asynchronous search submitted by `judy` will not be visible to `elon` and vice versa.

`judy` needs to have at least the superset of all roles that `elon` has to see `elon`'s asynchronous searches.

For example, if `judy` has five backend roles and `elon` has one of these roles, then `judy` can see asynchronous searches submitted by `elon`, but `elon` can’t see the asynchronous searches submitted by `judy`. This means that `judy` can perform GET and DELETE operations on asynchronous searches submitted by `elon`, but not the reverse.

If none of the users have any backend roles, all three will be able to see the others' searches.

For example, consider three users: `judy`, `elon`, and `jack`.

`judy`, `elon`, and `jack` have no backend roles set up:

```json
PUT _plugins/_security/api/internalusers/judy
{
  "password": "judy",
  "backend_roles": [],
  "attributes": {}
}
```

```json
PUT _plugins/_security/api/internalusers/elon
{
  "password": "elon",
  "backend_roles": [],
  "attributes": {}
}
```

```json
PUT _plugins/_security/api/internalusers/jack
{
  "password": "jack",
  "backend_roles": [],
  "attributes": {}
}
```

Both `judy` and `elon` have full access to asynchronous search:

```json
PUT _plugins/_security/api/rolesmapping/async_full_access
{
  "backend_roles": [],
  "hosts": [],
  "users": ["judy","elon"]
}
```

`jack` has read access to asynchronous search results:

```json
PUT _plugins/_security/api/rolesmapping/async_read_access
{
  "backend_roles": [],
  "hosts": [],
  "users": ["jack"]
}
```

Because none of the users have backend roles, they will be able to see each other's asynchronous searches. So, if `judy` submits an asynchronous search, `elon`, who has full access, will be able to see that search. `jack`, who has read access, will also be able to see `judy`'s asynchronous search.