---
layout: default
title: Alerting security
nav_order: 10
parent: Alerting
has_children: false
redirect_from:
  - /monitoring-plugins/alerting/security/
---

# Alerting security

If you use the Security plugin alongside alerting, you might want to limit certain users to certain actions. For example, you might want some users to only be able to view and acknowledge alerts, while others can modify monitors and destinations.


## Basic permissions

The Security plugin has three built-in roles that cover most alerting use cases: `alerting_read_access`, `alerting_ack_alerts`, and `alerting_full_access`. For descriptions of each, see [Predefined roles]({{site.url}}{{site.baseurl}}/security/access-control/users-roles#predefined-roles).

If these roles don't meet your needs, mix and match individual alerting [permissions]({{site.url}}{{site.baseurl}}/security/access-control/permissions/) to suit your use case. Each action corresponds to an operation in the REST API. For example, the `cluster:admin/opensearch/alerting/destination/delete` permission lets you delete destinations.


## How monitors access data

Monitors run with the permissions of the user who created or last modified them. For example, consider the user `jdoe`, who works at a chain of retail stores. `jdoe` has two roles. Together, these two roles allow read access to three indexes: `store1-returns`, `store2-returns`, and `store3-returns`.

`jdoe` creates a monitor that sends an email to management whenever the number of returns across all three indexes exceeds 40 per hour.

Later, the user `psantos` wants to edit the monitor to run every two hours, but `psantos` only has access to `store1-returns`. To make the change, `psantos` has two options:

- Update the monitor so that it only checks `store1-returns`.
- Ask an administrator for read access to the other two indexes.

After making the change, the monitor now runs with the same permissions as `psantos`, including any [document-level security]({{site.url}}{{site.baseurl}}/security/access-control/document-level-security/) queries, [excluded fields]({{site.url}}{{site.baseurl}}/security/access-control/field-level-security/), and [masked fields]({{site.url}}{{site.baseurl}}/security/access-control/field-masking/). If you use an extraction query to define your monitor, use the **Run** button to ensure that the response includes the fields you need.

Once a monitor is created, the Alerting plugin will continue executing the monitor, even if the user who created the monitor has their permissions removed. Only a user with the correct cluster permissions can manually disable or delete a monitor to stop it from executing:

- Disable a monitor: `cluster:admin/opendistro/alerting/monitor/write`
- Delete a monitor: `cluster:admin/opendistro/alerting/monitor/delete`

If your monitor's trigger has notifications configured, the Alerting plugin continues to send out notifications regardless of destination type. To stop notifications, a user must manually delete them in the trigger's actions.

### A note on alerts and fine-grained access control

When a trigger generates an alert, the monitor configuration, the alert itself, and any notification that is sent to a channel may include metadata describing the index being queried. By design, the plugin must extract the data and store it as metadata outside of the index. [Document-level security]({{site.url}}{{site.baseurl}}/security/access-control/document-level-security) (DLS) and [field-level security]({{site.url}}{{site.baseurl}}/security/access-control/field-level-security) (FLS) access controls are designed to protect the data in the index. But once the data is stored outside the index as metadata, users with access to the monitor configurations, alerts, and their notifications will be able to view this metadata and possibly infer the contents and quality of data in the index, which would otherwise be concealed by DLS and FLS access control.

To reduce the chances of unintended users viewing metadata that could describe an index, we recommend that administrators enable role-based access control and keep these kinds of design elements in mind when assigning permissions to the intended group of users. See [Limit access by backend role](#advanced-limit-access-by-backend-role) for details.

## (Advanced) Limit access by backend role

Out of the box, the alerting plugin has no concept of ownership. For example, if you have the `cluster:admin/opensearch/alerting/monitor/write` permission, you can edit *all* monitors, regardless of whether you created them. If a small number of trusted users manage your monitors and destinations, this lack of ownership generally isn't a problem. A larger organization might need to segment access by backend role.

First, make sure that your users have the appropriate [backend roles]({{site.url}}{{site.baseurl}}/security/access-control/index/). Backend roles usually come from an [LDAP server]({{site.url}}{{site.baseurl}}/security/configuration/ldap/) or [SAML provider]({{site.url}}{{site.baseurl}}/security/configuration/saml/). However, if you use the internal user database, you can use the REST API to add them manually with a create user operation. To add a backend role to a create user request, follow the [Create user]({{site.url}}{{site.baseurl}}/security/access-control/api#create-user) instructions in the Security plugin API documentation.

Next, enable the following setting:

```json
PUT _cluster/settings
{
  "transient": {
    "plugins.alerting.filter_by_backend_roles": "true"
  }
}
```

Now when users view alerting resources in OpenSearch Dashboards (or make REST API calls), they only see monitors and destinations that are created by users who share *at least one* backend role. For example, consider three users who all have full access to alerting: `jdoe`, `jroe`, and `psantos`.

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

Then, use this new role for all alerting users. -->

### Specify RBAC backend roles

You can specify role-based access control (RBAC) backend roles when you create or update a monitor with the Alerting API.

In a create monitor scenario, follow these guidelines to specify roles:

User type  | Role is specified by user or not (Y/N) | How to use the RBAC roles
:--- | :--- | :---
Admin user | Yes | Use all the specified backend roles to associate to the monitor.
Regular user | Yes | Use all the specified backend roles from the list of backend roles that the user has permission to use to associate with the monitor.
Regular user | No | Copy user’s backend roles and associate them to the monitor.

In an update monitor scenario, follow these guidelines to specify roles:

User type  | Role is specified by user or not (Y/N) | How to use the RBAC roles
:--- | :--- | :---
Admin user | Yes | Remove all the backend roles associate to the monitor and then use all the specified backend roles associated to the monitor.
Regular user | Yes | Remove backend roles associated to the monitor that the user has access to, but didn’t specify. Then add all the other specified backend roles from the list of backend roles that the user has permission to use to the monitor.
Regular user | No | Don’t update the backend roles on the monitor.

- For admin users, an empty list is considered the same as removing all permissions that the user possesses. If a non-admin user passes in an empty list, that will throw an exception, because that is not allowed by non-admin users.
- If the user tries to associate roles that they don't have permission to use, it will throw an exception.
{: .note }

To create an RBAC role, follow instructions in the Security plugin API documentation to [Create role]({{site.url}}{{site.baseurl}}/security/access-control/api#create-role).
### Create a monitor with an RBAC role

When you create a monitor with the Alerting API, you can specify the RBAC roles at the bottom of the request body. Use the `rbac_roles` parameter.

The following sample shows the RBAC roles specified by the RBAC parameter:

```json
... 
  "rbac_roles": ["role1", "role2"]
}
```

To see a full request sample, see [Create a query-level monitor]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/api/#create-a-query-level-monitor).

