---
layout: default
title: Notifications security
nav_order: 60
parent: Notifications
redirect_from:
  - /notifications-plugin/alerting-security/
---

# OpenSearch security for Notifications plugin

If you use the Notifications plugin, you might want to limit certain users to certain actions. For example, you might want some users to only be able to view and acknowledge alerts, while others can modify monitors and destinations.

<!--- Look at Notifications API list to add examples at the end of this para.--->

## Basic permissions

The security plugin has three built-in roles that cover most notifications use cases: `notifications_full_access` and `notifications_read_access`. For descriptions of each, see [Predefined roles]({{site.url}}{{site.baseurl}}/security/access-control/users-roles#predefined-roles).

If these roles don't meet your needs, mix and match individual notifications [permissions]({{site.url}}{{site.baseurl}}/security/access-control/permissions/) to suit your use case. Each action corresponds to an operation in the REST API. For example, the `cluster:admin/opensearch/alerting/destination/delete` permission lets you delete destinations.

### A note on alerts and fine-grained access control

When a trigger generates an alert, the monitor configuration, the alert itself, and any notification that is sent to a channel may include metadata describing the index being queried. By design, the plugin must extract the data and store it as metadata outside of the index. [Document-level security]({{site.url}}{{site.baseurl}}/security/access-control/document-level-security) (DLS) and [field-level security]({{site.url}}{{site.baseurl}}/security/access-control/field-level-security) (FLS) access controls are designed to protect the data in the index. But once the data is stored outside the index as metadata, users with access to the monitor configurations, alerts, and their notifications will be able to view this metadata and possibly infer the contents and quality of data in the index, which would otherwise be concealed by DLS and FLS access control.

To reduce the chances of unintended users viewing metadata that could describe an index, we recommend that administrators enable role-based access control and keep these kinds of design elements in mind when assigning permissions to the intended group of users. See [Limit access by backend role](#advanced-limit-access-by-backend-role) for details.

## (Advanced) Limit access by backend role

Out of the box, the Notifications plugin has no concept of ownership. For example, if you have the `cluster:admin/opensearch/notifications/monitor/write` permission, you can edit *all* monitors, regardless of whether you created them. If a small number of trusted users manage your monitors and destinations, this lack of ownership generally isn't a problem. A larger organization might need to segment access by backend role.

First, make sure that your users have the appropriate [backend roles]({{site.url}}{{site.baseurl}}/security/access-control/index/). Backend roles usually come from an [LDAP server]({{site.url}}{{site.baseurl}}/security/configuration/ldap/) or [SAML provider]({{site.url}}{{site.baseurl}}/security/configuration/saml/). However, if you use the internal user database, you can use the REST API to add them manually with a create user operation. To add a backend role to a create user request, follow the [Create user]({{site.url}}{{site.baseurl}}/security/access-control/api#create-user) instructions in the Security Plugin API documentation.

Next, enable the following setting:

```json
PUT _cluster/settings
{
  "transient": {
    "plugins.notifications.filter_by_backend_roles": "true"
  }
}
```

Now when users view notifications resources in OpenSearch Dashboards (or make REST API calls), they only see monitors and destinations that are created by users who share *at least one* backend role. For example, consider three users who all have full access to alerting: `jdoe`, `jroe`, and `psantos`.

`jdoe` and `jroe` are on the same team at work and both have the `analyst` backend role. `psantos` has the `human-resources` backend role.

If `jdoe` creates a monitor, `jroe` can see and modify it, but `psantos` can't. If that monitor generates an alert, the situation is the same: `jroe` can see and acknowledge it, but `psantos` can't. If `psantos` creates a destination, `jdoe` and `jroe` can't see or modify it.

<!-- ## (Advanced) Limit access by individual

If you only want users to be able to see and modify their own monitors and destinations, duplicate the `alerting_full_access` role and add the following [DLS query]({{site.url}}{{site.baseurl}}/security/access-control/document-level-security/) to it:

```json
{
  "bool": {
    "should": [{
      "match": {
        "monitor.created_by": "${user.name}"
      }
    }, {
      "match": {
        "destination.created_by": "${user.name}"
      }
    }]
  }
}
```

Then, use this new role for all notifications users. -->
