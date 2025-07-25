---
layout: default
title: Asynchronous search security
nav_order: 2
parent: Asynchronous search
has_children: false
canonical_url: https://docs.opensearch.org/latest/search-plugins/async/security/
---

# Asynchronous search security

You can use the security plugin with asynchronous searches to limit non-admin users to specific actions. For example, you might want some users to only be able to submit or delete asynchronous searches, while you might want others to only view the results.

All asynchronous search indices are protected as system indices. Only a super admin user or an admin user with a Transport Layer Security (TLS) certificate can access system indices. For more information, see [System indices]({{site.url}}{{site.baseurl}}/security-plugin/configuration/system-indices/).

## Basic permissions

As an admin user, you can use the security plugin to assign specific permissions to users based on which API operations they need access to. For a list of supported APIs operations, see [Asynchronous search]({{site.url}}{{site.baseurl}}/).

The security plugin has two built-in roles that cover most asynchronous search use cases: `asynchronous_search_full_access` and `asynchronous_search_read_access`. For descriptions of each, see [Predefined roles]({{site.url}}{{site.baseurl}}/security-plugin/access-control/users-roles#predefined-roles).

If these roles don’t meet your needs, mix and match individual asynchronous search permissions to suit your use case. Each action corresponds to an operation in the REST API. For example, the `cluster:admin/opensearch/asynchronous_search/delete` permission lets you delete a previously submitted asynchronous search.

## (Advanced) Limit access by backend role

Use backend roles to configure fine-grained access to asynchronous searches based on roles. For example, users of different departments in an organization can view asynchronous searches owned by their own department.

First, make sure your users have the appropriate [backend roles]({{site.url}}{{site.baseurl}}/security-plugin/access-control/index/). Backend roles usually come from an [LDAP server]({{site.url}}{{site.baseurl}}/security-plugin/configuration/ldap/) or [SAML provider]({{site.url}}{{site.baseurl}}/security-plugin/configuration/saml/). However, if you use the internal user database, you can use the REST API to [add them manually]({{site.url}}{{site.baseurl}}/security-plugin/access-control/api#create-user).

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
