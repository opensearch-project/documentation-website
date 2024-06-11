---
layout: default
title: Comments
nav_order: 1
parent: Alerting
has_children: false
redirect_from:
  - /monitoring-plugins/alerting/comments/
---

# Comments (experimental)

When an alert is generated, add comments to your Alert to share insights into its root cause, and facilitate its resolution.

## Enabling comments

Comments for the Alerting plugin is disabled by default because it is currently an experimental feature. To enable it, set the `plugins.alerting.comments_enabled` setting to "true" using the [cluster settings API]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/settings/).

## Security

### Displaying comment authors

The author of a comment is only displayed when the Security plugin is installed. If the Security plugin is not installed, comments can still be posted to Alerts, but authors will be displayed as `Unknown`.

### Role-based access control

Comments inherit the backend roles of the Alert it is attached to, which inherits from the Monitor that generated the Alert. For more details, see [Limit access by backend role]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/security/#advanced-limit-access-by-backend-role).
