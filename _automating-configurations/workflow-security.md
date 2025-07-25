---
layout: default
title: Workflow template security
nav_order: 50
canonical_url: https://docs.opensearch.org/latest/automating-configurations/workflow-security/
---

# Workflow template security

In OpenSearch, automated workflow configurations are provided by the Flow Framework plugin. You can use the Security plugin together with the Flow Framework plugin to limit non-admin users to specific actions. For example, you might want some users to only be able to create, update, or delete workflows, while others may only be able to view workflows.

All Flow Framework indexes are protected as system indexes. Only a superadmin user or an admin user with a TLS certificate can access system indexes. For more information, see [System indexes]({{site.url}}{{site.baseurl}}/security/configuration/system-indices/).

Security for Flow Framework is set up similarly to [security for anomaly detection]({{site.url}}{{site.baseurl}}/monitoring-plugins/ad/security/).

## Basic permissions

As an admin user, you can use the Security plugin to assign specific permissions to users based on the APIs they need to access. For a list of supported Flow Framework APIs, see [Workflow APIs]({{site.url}}{{site.baseurl}}/automating-configurations/api/index/).

The Security plugin has two built-in roles that cover most Flow Framework use cases: `flow_framework_full_access` and `flow_framework_read_access`. For descriptions of each, see [Predefined roles]({{site.url}}{{site.baseurl}}/security/access-control/users-roles#predefined-roles).

If these roles don't meet your needs, you can assign users individual Flow Framework [permissions]({{site.url}}{{site.baseurl}}/security/access-control/permissions/) to suit your use case. Each action corresponds to an operation in the REST API. For example, the `cluster:admin/opensearch/flow_framework/workflow/search` permission lets you search workflows.

### Fine-grained access control

To reduce the chances of unintended users viewing metadata that describes an index, we recommend that administrators enable role-based access control when assigning permissions to the intended user group. For more information, see [Limit access by backend role](#advanced-limit-access-by-backend-role).

## (Advanced) Limit access by backend role

Use backend roles to configure fine-grained access to individual workflows based on roles. For example, users in different departments of an organization can view workflows owned by their own department.

First, make sure your users have the appropriate [backend roles]({{site.url}}{{site.baseurl}}/security/access-control/index/). Backend roles usually come from an [LDAP server]({{site.url}}{{site.baseurl}}/security/configuration/ldap/) or [SAML provider]({{site.url}}{{site.baseurl}}/security/configuration/saml/), but if you use an internal user database, you can [create users manually using the API]({{site.url}}{{site.baseurl}}/security/access-control/api#create-user).

Next, enable the following setting:

```json
PUT _cluster/settings
{
  "transient": {
    "plugins.flow_framework.filter_by_backend_roles": "true"
  }
}
```
{% include copy-curl.html %}

Now when users view workflow resources in OpenSearch Dashboards (or make REST API calls), they only see workflows created by users who share at least one backend role.

For example, consider two users: `alice` and `bob`.

`alice` has an `analyst` backend role:

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

`bob` has a `human-resources` backend role:

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

Both `alice` and `bob` have full access to the Flow Framework APIs:

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

Users without backend roles can still view other users' workflow results if they have `flow_framework_read_access`. This also applies to users who have `flow_framework_full_access` because this permission includes all of the permissions of `flow_framework_read_access`. 

Administrators should inform users that the `flow_framework_read_access` permission allows them to view the results of any workflow in a cluster, including data not directly accessible to them. To limit access to the results of a specific workflow, administrators should apply backend role filters when creating the workflow. This ensures that only users with matching backend roles can access that workflow's results.