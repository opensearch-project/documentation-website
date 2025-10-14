---
layout: default
title: Adding comments
nav_order: 35
parent: Alerting
has_children: false
redirect_from:
  - /monitoring-plugins/alerting/comments/
canonical_url: https://docs.opensearch.org/latest/observing-your-data/alerting/comments/
---

# Adding comments

When an alert is generated, add comments to share information about its root cause and facilitate resolution. Comments are enabled by setting `plugins.alerting.comments_enabled` to `true` using the [`cluster/settings` API]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/settings/).

Comments can be accessed through the alerts table view by selecting the comment icon within an alert's row. From there, comments can be added, edited, or deleted. An Alerting Comments API is also available for programmatic comment management. For more information, see [Alerting API]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/api/).

## Viewing comment authors

If the Security plugin is installed, then the comment's author is displayed. Otherwise, `Unknown` is displayed.

## Assigning permissions

Comment permissions are determined by the backend roles associated with the alert. These backend roles are inherited from the monitor that generated the alert. For more information about how to limit access based on backend roles, see [Limit access by backend role]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/security/#advanced-limit-access-by-backend-role).
