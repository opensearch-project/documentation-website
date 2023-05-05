---
layout: default
title: Index management security
nav_order: 40
has_children: false
---

# Index management security

Using the Security plugin with index management lets you limit non-admin users to certain actions. For example, you might want to set up your security such that a group of users can only read ISM policies, while others can create, delete, or change policies.

All index management data are protected as system indexes, and only a super admin or an admin with a Transport Layer Security (TLS) certificate can access system indexes. For more information, see [System indexes]({{site.url}}{{site.baseurl}}/security/configuration/system-indices).

## Basic permissions

The Security plugin comes with one role that offers full access to index management: `index_management_full_access`. For a description of the role's permissions, see [Predefined roles]({{site.url}}{{site.baseurl}}/security/access-control/users-roles#predefined-roles).

With security enabled, users not only need the correct index management permissions, but they also need permissions to execute actions to involved indexes. For example, if a user wants to use the REST API to attach a policy that executes a rollup job to an index named `system-logs`, they would need the permissions to attach a policy and execute a rollup job, as well as access to `system-logs`.

Finally, with the exceptions of Create Policy, Get Policy, and Delete Policy, users also need the `indices:admin/opensearch/ism/managedindex` permission to execute [ISM APIs]({{site.url}}{{site.baseurl}}/im-plugin/ism/api).

## (Advanced) Limit access by backend role

You can use backend roles to configure fine-grained access to index management policies and actions. For example, users of different departments in an organization might view different policies depending on what roles and permissions they are assigned.

First, ensure your users have the appropriate [backend roles]({{site.url}}{{site.baseurl}}/security/access-control/index/). Backend roles usually come from an [LDAP server]({{site.url}}{{site.baseurl}}/security/configuration/ldap/) or [SAML provider]({{site.url}}{{site.baseurl}}/security/configuration/saml/). However, if you use the internal user database, you can use the REST API to [add them manually]({{site.url}}{{site.baseurl}}/security/access-control/api#create-user).

Use the REST API to enable the following setting:

```json
PUT _cluster/settings
{
  "transient": {
    "plugins.index_management.filter_by_backend_roles": "true"
  }
}
```

With security enabled, only users who share at least one backend role can see and execute the policies and actions relevant to their roles.

For example, consider a scenario with three users: `John` and `Jill`, who have the backend role `helpdesk_staff`, and `Jane`, who has the backend role `phone_operator`. `John` wants to create a policy that performs a rollup job on an index named `airline_data`, so `John` would need a backend role that has permissions to access that index, create relevant policies, and execute relevant actions, and `Jill` would be able to access the same index, policy, and job. However, `Jane` cannot access or edit those resources or actions.
