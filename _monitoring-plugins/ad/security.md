---
layout: default
title: Anomaly detection security
nav_order: 10
parent: Anomaly detection
has_children: false
canonical_url: https://docs.opensearch.org/latest/observing-your-data/ad/security/
---

# Anomaly detection security

You can use the security plugin with anomaly detection in OpenSearch to limit non-admin users to specific actions. For example, you might want some users to only be able to create, update, or delete detectors, while others to only view detectors.

All anomaly detection indices are protected as system indices. Only a super admin user or an admin user with a TLS certificate can access system indices. For more information, see [System indices]({{site.url}}{{site.baseurl}}/security-plugin/configuration/system-indices/).


Security for anomaly detection works the same as [security for alerting]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/security/).

## Basic permissions

As an admin user, you can use the security plugin to assign specific permissions to users based on which APIs they need access to. For a list of supported APIs, see [Anomaly detection API]({{site.url}}{{site.baseurl}}/monitoring-plugins/ad/api/).

The security plugin has two built-in roles that cover most anomaly detection use cases: `anomaly_full_access` and `anomaly_read_access`. For descriptions of each, see [Predefined roles]({{site.url}}{{site.baseurl}}/security-plugin/access-control/users-roles#predefined-roles).

If these roles don't meet your needs, mix and match individual anomaly detection [permissions]({{site.url}}{{site.baseurl}}/security-plugin/access-control/permissions/) to suit your use case. Each action corresponds to an operation in the REST API. For example, the `cluster:admin/opensearch/ad/detector/delete` permission lets you delete detectors.

## (Advanced) Limit access by backend role

Use backend roles to configure fine-grained access to individual detectors based on roles. For example, users of different departments in an organization can view detectors owned by their own department.

First, make sure your users have the appropriate [backend roles]({{site.url}}{{site.baseurl}}/security-plugin/access-control/index/). Backend roles usually come from an [LDAP server]({{site.url}}{{site.baseurl}}/security-plugin/configuration/ldap/) or [SAML provider]({{site.url}}{{site.baseurl}}/security-plugin/configuration/saml/), but if you use the internal user database, you can use the REST API to [add them manually]({{site.url}}{{site.baseurl}}/security-plugin/access-control/api#create-user).

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
