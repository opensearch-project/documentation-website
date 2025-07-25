---
layout: default
title: Alerting security
nav_order: 10
parent: Alerting
has_children: false
canonical_url: https://docs.opensearch.org/latest/observing-your-data/alerting/security/
---

# Alerting security

If you use the security plugin alongside alerting, you might want to limit certain users to certain actions. For example, you might want some users to only be able to view and acknowledge alerts, while others can modify monitors and destinations.


## Basic permissions

The security plugin has three built-in roles that cover most alerting use cases: `alerting_read_access`, `alerting_ack_alerts`, and `alerting_full_access`. For descriptions of each, see [Predefined roles]({{site.url}}{{site.baseurl}}/security-plugin/access-control/users-roles#predefined-roles).

If these roles don't meet your needs, mix and match individual alerting [permissions]({{site.url}}{{site.baseurl}}/security-plugin/access-control/permissions/) to suit your use case. Each action corresponds to an operation in the REST API. For example, the `cluster:admin/opensearch/alerting/destination/delete` permission lets you delete destinations.


## How monitors access data

Monitors run with the permissions of the user who created or last modified them. For example, consider the user `jdoe`, who works at a chain of retail stores. `jdoe` has two roles. Together, these two roles allow read access to three indices: `store1-returns`, `store2-returns`, and `store3-returns`.

`jdoe` creates a monitor that sends an email to management whenever the number of returns across all three indices exceeds 40 per hour.

Later, the user `psantos` wants to edit the monitor to run every two hours, but `psantos` only has access to `store1-returns`. To make the change, `psantos` has two options:

- Update the monitor so that it only checks `store1-returns`.
- Ask an administrator for read access to the other two indices.

After making the change, the monitor now runs with the same permissions as `psantos`, including any [document-level security]({{site.url}}{{site.baseurl}}/security-plugin/access-control/document-level-security/) queries, [excluded fields]({{site.url}}{{site.baseurl}}/security-plugin/access-control/field-level-security/), and [masked fields]({{site.url}}{{site.baseurl}}/security-plugin/access-control/field-masking/). If you use an extraction query to define your monitor, use the **Run** button to ensure that the response includes the fields you need.

Once a monitor is created, the Alerting plugin will continue executing the monitor, even if the user who created the monitor has their permissions removed. Only a user with the correct cluster permissions can manually disable or delete a monitor to stop it from executing:

- Disable a monitor: `cluster:admin/opendistro/alerting/monitor/write`
- Delete a monitor: `cluster:admin/opendistro/alerting/monitor/delete`

If your monitor's trigger has notifications configured, the Alerting plugin continues to send out notifications regardless of destination type. To stop notifications, a user must manually delete them in the trigger's actions.

## (Advanced) Limit access by backend role

Out of the box, the alerting plugin has no concept of ownership. For example, if you have the `cluster:admin/opensearch/alerting/monitor/write` permission, you can edit *all* monitors, regardless of whether you created them. If a small number of trusted users manage your monitors and destinations, this lack of ownership generally isn't a problem. A larger organization might need to segment access by backend role.

First, make sure that your users have the appropriate [backend roles]({{site.url}}{{site.baseurl}}/security-plugin/access-control/index/). Backend roles usually come from an [LDAP server]({{site.url}}{{site.baseurl}}/security-plugin/configuration/ldap/) or [SAML provider]({{site.url}}{{site.baseurl}}/security-plugin/configuration/saml/). However, if you use the internal user database, you can use the REST API to [add them manually]({{site.url}}{{site.baseurl}}/security-plugin/access-control/api#create-user).

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

If you only want users to be able to see and modify their own monitors and destinations, duplicate the `alerting_full_access` role and add the following [DLS query]({{site.url}}{{site.baseurl}}/security-plugin/access-control/document-level-security/) to it:

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
