---
layout: default
title: Access control
nav_order: 75
has_children: true
has_toc: false
redirect_from:
  - /security-plugin/access-control/index/
---

# Access control

After you [configure the Security plugin]({{site.url}}{{site.baseurl}}/security/configuration/index/) to use your own certificates and preferred authentication backend, you can start adding users, creating roles, and mapping roles to users.

This section of the documentation covers what a user is allowed to see and do after successfully authenticating.


## Concepts

Term | Description
:--- | :---
Permission | An individual action, such as creating an index (e.g. `indices:admin/create`). For a complete list, see [Permissions]({{site.url}}{{site.baseurl}}/security/access-control/permissions/).
Action group | A set of permissions. For example, the predefined `SEARCH` action group authorizes roles to use the `_search` and `_msearch` APIs.
Role | Security roles define the scope of a permission or action group: cluster, index, document, or field. For example, a role named `delivery_analyst` might have no cluster permissions, the `READ` action group for all indexes that match the `delivery-data-*` pattern, access to all document types within those indexes, and access to all fields except `delivery_driver_name`.
Backend role | (Optional) Arbitrary strings that you specify *or* that come from an external authentication system (for example, LDAP/Active Directory). Backend roles can help simplify the role mapping process. Rather than mapping a role to 100 individual users, you can map the role to a single backend role that all 100 users share.
User | Users make requests to OpenSearch clusters. A user has credentials (e.g. a username and password), zero or more backend roles, and zero or more custom attributes.
Role mapping | Users assume roles after they successfully authenticate. Role mappings map roles to users (or backend roles). For example, a mapping of `kibana_user` (role) to `jdoe` (user) means that John Doe gains all the permissions of `kibana_user` after authenticating. Likewise, a mapping of `all_access` (role) to `admin` (backend role) means that any user with the backend role of `admin` gains all the permissions of `all_access` after authenticating. You can map each role to multiple users and/or backend roles.

The Security plugin comes with a number of [predefined action groups]({{site.url}}{{site.baseurl}}/security/access-control/default-action-groups/), roles, mappings, and users. These entities serve as sensible defaults and are good examples of how to use the plugin.
