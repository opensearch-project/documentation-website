---
layout: default
title: OpenSearch Security for Security Analytics
nav_order: 2
has_children: false
---

# OpenSearch Security for Security Analytics

You can use OpenSearch Security with Security Analytics to assign user permissions and manage the actions that users can and cannot perform. For example, you might want one group of users to be able to create, update, or delete detectors and another group of users to only view detectors. You may want still another group to be able to receive and acknowledge alerts but to be prevented from performing other tasks. The OpenSearch Security framework allows you to control the level of access users have to Security Analytics functionality.

---
## Security Analytics system indexes

Security Analytics indexes are protected as system indexes and treated differently than other indexes in a cluster. System indexes store configurations and other system settings and, for that reason, cannot be modified using the REST API or the OpenSearch Dashboards interface. Only a user with a TLS [admin certificate]({{site.url}}{{site.baseurl}}/security/configuration/tls/#configuring-admin-certificates) can access system indexes. For more information about working with this type of index, see [System indexes]({{site.url}}{{site.baseurl}}/security/configuration/system-indices/).

---
## Basic permissions

As an administrator, you can use OpenSearch Dashboards or the Security REST API to assign specific permissions to users based on the specific APIs they need to access. For a list of supported APIs, see [API tools]({{site.url}}{{site.baseurl}}/security-analytics/api-tools/index/).

OpenSearch Security has three built-in roles that cover most Security Analytics use cases: `security_analytics_full_access`, `security_analytics_read_access`, and `security_analytics_ack_alerts`. For descriptions of these and other roles, see [Predefined roles]({{site.url}}{{site.baseurl}}/security/access-control/users-roles#predefined-roles).

If these roles don't meet your needs, mix and match individual Security Analytics [permissions]({{site.url}}{{site.baseurl}}/security/access-control/permissions/#security-analytics-permissions) to suit your use case. Each action corresponds to an operation in the REST API. For example, the `cluster:admin/opensearch/securityanalytics/detector/delete` permission allows you to delete detectors.

---
## (Advanced) Limit access by backend role

You can use backend roles to configure fine-grained access to individual detectors based on roles. For example, backend roles can be assigned to users working in different departments of an organization so that they can view only those detectors owned by the departments in which they work.

First, make sure your users have the appropriate [backend roles]({{site.url}}{{site.baseurl}}/security/access-control/index/). Backend roles usually come from an [LDAP server]({{site.url}}{{site.baseurl}}/security/configuration/ldap/) or [SAML provider]({{site.url}}{{site.baseurl}}/security/configuration/saml/). However, if you use the internal user database, you can use the REST API to [add them manually]({{site.url}}{{site.baseurl}}/security/access-control/api#create-user).

Next, enable the following setting:

```json
PUT /_cluster/settings
{
  "transient": {
    "plugins.security_analytics.filter_by_backend_roles": "true"
  }
}
```
{% include copy-curl.html %}

Now when users view Security Analytics resources in OpenSearch Dashboards (or make REST API calls), they only see detectors created by users who share at least one backend role.
For example, consider two users: `alice` and `bob`.

The following example assigns the user `alice` the `analyst` backend role:

```json
PUT /_plugins/_security/api/internalusers/alice
{
  "password": "alice",
  "backend_roles": [
    "analyst"
  ],
  "attributes": {}
}
```
{% include copy-curl.html %}

The next example assigns the user `bob` the `human-resources` backend role:

```json
PUT /_plugins/_security/api/internalusers/bob
{
  "password": "bob",
  "backend_roles": [
    "human-resources"
  ],
  "attributes": {}
}
```
{% include copy-curl.html %}

Finally, this last example assigns both `alice` and `bob` the role that gives them full access to Security Analytics:

```json
PUT /_plugins/_security/api/rolesmapping/security_analytics_full_access
{
  "backend_roles": [],
  "hosts": [],
  "users": [
    "alice",
    "bob"
  ]
}
```
{% include copy-curl.html %}

However, because they have different backend roles, `alice` and `bob` cannot view each other's detectors or their results.

---
## A note on using fine-grained access control with the plugin

When a trigger generates an alert, the detector configurations, the alert itself, and any notifications that are sent to a channel may include metadata describing the index being queried. By design, the plugin must extract the data and store it as metadata outside of the index. [Document-level security]({{site.url}}{{site.baseurl}}/security/access-control/document-level-security) (DLS) and [field-level security]({{site.url}}{{site.baseurl}}/security/access-control/field-level-security) (FLS) access controls are designed to protect the data in the index. But once the data is stored outside the index as metadata, users with access to the detector and monitor configurations, alerts, and their notifications will be able to view this metadata and possibly infer the contents and quality of data in the index, which would otherwise be concealed by DLS and FLS access control.

To reduce the chances of unintended users viewing metadata that could describe an index, we recommend that administrators enable role-based access control and keep these kinds of design elements in mind when assigning permissions to the intended group of users. See [Limit access by backend role](#advanced-limit-access-by-backend-role) for more information.
