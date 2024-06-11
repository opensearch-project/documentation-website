---
layout: default
title: Comments
nav_order: 1
parent: Alerting
has_children: false
redirect_from:
  - /monitoring-plugins/alerting/comments/
---

# Comments (Experimental)

When an alert is generated, add comments to your Alert to share insights into its root cause, and facilitate its resolution.

## Enabling Comments

Comments for the Alerting plugin is disabled by default because it is currently an experimental feature. To enable it, set the `plugins.alerting.comments_enabled` setting to "true".

## Security

The author of a comment is only displayed when the Security plugin is installed. If the Security plugin is not installed, comments can still be posted to Alerts, but authors will be displayed as `Unknown`.