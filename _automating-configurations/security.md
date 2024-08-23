---
layout: default
title: Workflow security
nav_order: 25
---

# Flow Framework security

You can use the Security plugin with flow framework in OpenSearch to limit non-admin users to specific actions. For example, you might want some users to only be able to create, update, or delete workflows, while others to only view workflows.

All flow framework indexes are protected as system indexes. Only a super admin user or an admin user with a TLS certificate can access system indexes. For more information, see [System indexes]({{site.url}}{{site.baseurl}}/security/configuration/system-indices/).


Security for flow framework works the same as [security for anomaly detection]({{site.url}}{{site.baseurl}}/monitoring-plugins/ad/security/).

## Basic permissions

As an admin user, you can use the Security plugin to assign specific permissions to users based on which APIs they need access to. For a list of supported APIs, see [Flow Framework API]({{site.url}}{{site.baseurl}}/automating-configurations/api/index/).

The Security plugin has two built-in roles that cover most flow framework use cases: `flow_framework_full_access` and `flow_framework_read_access`. For descriptions of each, see [Predefined roles]({{site.url}}{{site.baseurl}}/security/access-control/users-roles#predefined-roles).

If these roles don't meet your needs, mix and match individual flow framework [permissions]({{site.url}}{{site.baseurl}}/security/access-control/permissions/) to suit your use case. Each action corresponds to an operation in the REST API. For example, the `cluster:admin/opensearch/flow_framework/workflow/search` permission lets you search workflows.

### A note fine-grained access control

To reduce the chances of unintended users viewing metadata that could describe an index, we recommend that administrators enable role-based access control and keep these kinds of design elements in mind when assigning permissions to the intended group of users. See [Limit access by backend role](#advanced-limit-access-by-backend-role) for details.

## (Advanced) Limit access by backend role

Use backend roles to configure fine-grained access to individual workflows based on roles. For example, users of different departments in an organization can view workflows owned by their own department.

First, make sure your users have the appropriate [backend roles]({{site.url}}{{site.baseurl}}/security/access-control/index/). Backend roles usually come from an [LDAP server]({{site.url}}{{site.baseurl}}/security/configuration/ldap/) or [SAML provider]({{site.url}}{{site.baseurl}}/security/configuration/saml/), but if you use the internal user database, you can use the REST API to [add them manually]({{site.url}}{{site.baseurl}}/security/access-control/api#create-user).

Next, enable the following setting:

```json
PUT _cluster/settings
{
  "transient": {
    "plugins.flow_framework.filter_by_backend_roles": "true"
  }
}
```

Now when users view flow framework resources in OpenSearch Dashboards (or make REST API calls), they only see workflows created by users who share at least one backend role.
For example, consider two users: `alice` and `bob`.

`alice` has an analyst backend role:

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

`bob` has a human-resources backend role:

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

Both `alice` and `bob` have full access to flow framework:

```json
PUT _plugins/_security/api/rolesmapping/flow_framework_full_access
{
  "backend_roles": [],
  "hosts": [],
  "users": [
    "alice",
    "bob"
  ]
}
```

Because they have different backend roles, `alice` and `bob` cannot view each other's workflows or their results.

If users do not have backend roles, they still can view other users' flow framework results as long as they have `flow_framework_read_access`. This is the same for users who have `flow_framework_full_access`, as it includes all of the permissions as `flow_framework_read_access`. Administrators should inform users that having `flow_framework_read_access` allows for viewing of the results from any workflow in the cluster, including data not directly accessible to them. To limit access to the workflows results, administrators should use backend role filters at the time the workflow is created. This ensures only users with matching backend roles can access results from those particular workflows.