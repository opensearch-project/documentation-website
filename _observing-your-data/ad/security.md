---
layout: default
title: Anomaly detection security
nav_order: 10
parent: Anomaly detection
has_children: false
redirect_from: 
  - /monitoring-plugins/ad/security/
---

# Anomaly detection security

You can use the Security plugin with anomaly detection in OpenSearch to limit non-admin users to specific actions. For example, you might want some users to only be able to create, update, or delete detectors, while others to only view detectors.

All anomaly detection indexes are protected as system indexes. Only a super admin user or an admin user with a TLS certificate can access system indexes. For more information, see [System indexes]({{site.url}}{{site.baseurl}}/security/configuration/system-indices/).


Security for anomaly detection works the same as [security for alerting]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/security/).

## Basic permissions

As an admin user, you can use the Security plugin to assign specific permissions to users based on which APIs they need access to. For a list of supported APIs, see [Anomaly detection API]({{site.url}}{{site.baseurl}}/monitoring-plugins/ad/api/).

The Security plugin has two built-in roles that cover most anomaly detection use cases: `anomaly_full_access` and `anomaly_read_access`. For descriptions of each, see [Predefined roles]({{site.url}}{{site.baseurl}}/security/access-control/users-roles#predefined-roles).

If these roles don't meet your needs, mix and match individual anomaly detection [permissions]({{site.url}}{{site.baseurl}}/security/access-control/permissions/) to suit your use case. Each action corresponds to an operation in the REST API. For example, the `cluster:admin/opensearch/ad/detector/delete` permission lets you delete detectors.

### A note on alerts and fine-grained access control

When a trigger generates an alert, the detector and monitor configurations, the alert itself, and any notification that is sent to a channel may include metadata describing the index being queried. By design, the plugin must extract the data and store it as metadata outside of the index. [Document-level security]({{site.url}}{{site.baseurl}}/security/access-control/document-level-security) (DLS) and [field-level security]({{site.url}}{{site.baseurl}}/security/access-control/field-level-security) (FLS) access controls are designed to protect the data in the index. But once the data is stored outside the index as metadata, users with access to the detector and monitor configurations, alerts, and their notifications will be able to view this metadata and possibly infer the contents and quality of data in the index, which would otherwise be concealed by DLS and FLS access control.

To reduce the chances of unintended users viewing metadata that could describe an index, we recommend that administrators enable role-based access control and keep these kinds of design elements in mind when assigning permissions to the intended group of users. See [Limit access by backend role](#advanced-limit-access-by-backend-role) for details.

## (Advanced) Limit access by backend role

Use backend roles to configure fine-grained access to individual detectors based on roles. For example, users of different departments in an organization can view detectors owned by their own department.

First, make sure your users have the appropriate [backend roles]({{site.url}}{{site.baseurl}}/security/access-control/index/). Backend roles usually come from an [LDAP server]({{site.url}}{{site.baseurl}}/security/configuration/ldap/) or [SAML provider]({{site.url}}{{site.baseurl}}/security/configuration/saml/), but if you use the internal user database, you can use the REST API to [add them manually]({{site.url}}{{site.baseurl}}/security/access-control/api#create-user).

Next, enable the following setting:

```json
PUT _cluster/settings
{
  "transient": {
    "plugins.anomaly_detection.filter_by_backend_roles": "true"
  }
}
```

Now when users view anomaly detection resources in OpenSearch Dashboards (or make REST API calls), they only see detectors created by users who share at least one backend role.
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

Both `alice` and `bob` have full access to anomaly detection:

```json
PUT _plugins/_security/api/rolesmapping/anomaly_full_access
{
  "backend_roles": [],
  "hosts": [],
  "users": [
    "alice",
    "bob"
  ]
}
```

Because they have different backend roles, `alice` and `bob` cannot view each other's detectors or their results.

If users do not have backend roles, they still can view other users' anomaly detection results as long as they have `anomaly_read_access`. This is the same for users who have `anomaly_full_access`, as it includes all of the permissions as `anomaly_read_access`. Administrators should inform users that having `anomaly_read_access` allows for viewing of the results from any detector in the cluster, including data not directly accessible to them. To limit access to the detector results, administrators should use backend role filters at the time the detector is created. This ensures only users with matching backend roles can access results from those particular detectors.