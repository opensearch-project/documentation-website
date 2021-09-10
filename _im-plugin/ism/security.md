---
layout: default
title: ISM security
nav_order: 10
parent: Index State Management
has_children: false
---

# ISM security

Using the security plugin with index state management lets you limit non-admin users to certain actions. For example, you might want to set up your security such that a group of users can only read ISM policies, while others can create, delete, or change policies.

All index state management data are protected as system indices, and only a super admin or an admin with a Transport Layer Security (TLS) certificate can access system indices. For more information, see [System indices]({{site.url}}{{site.baseurl}}/security-plugin/configuration/system-indices).

## Basic permissions

The security plugin comes with two built-in roles that cover most ISM use cases: `ism_read_access` and `ism_full_access`. For descriptions of each, see [Predefined roles]({{site.url}}{{site.baseurl}}/security-plugin/access-control/users-roles#predefined-roles).

With security enabled, users not only need the correct index management permissions, but they also need permissions to relevant indices to execute [REST API]({{site.url}}{{site.baseurl}}/im-plugin/ism/api) calls. For example, if a user wants to use the REST API to attach a policy to an index named `system-logs`, they would need the necessary REST API permissions as well as access to `system-logs`.

## (Advanced) Limit access by backend role

You can use backend roles to configure fine-grained access to ISM policies and actions. For example, users of different departments in an organization might view different policies depending on what roles and permissions they are assigned.

First, ensure your users have the appropriate [backend roles]({{site.url}}{{site.baseurl}}/security-plugin/access-control/index/). Backend roles usually come from an [LDAP server]({{site.url}}{{site.baseurl}}/security-plugin/configuration/ldap/) or [SAML provider]({{site.url}}{{site.baseurl}}/security-plugin/configuration/saml/). However, if you use the internal user database, you can use the REST API to [add them manually]({{site.url}}{{site.baseurl}}/security-plugin/access-control/api#create-user).

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
