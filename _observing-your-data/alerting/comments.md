---
layout: default
title: Adding comments
nav_order: 35
parent: Alerting
has_children: false
redirect_from:
  - /monitoring-plugins/alerting/comments/
---

# Adding comments

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, see the associated [GitHub issue](https://github.com/opensearch-project/OpenSearch-Dashboards/issues/6999).
{: .warning}

When an alert is generated, add comments to share insights into its root cause and facilitate resolution. Comments are enabled by setting `plugins.alerting.comments_enabled` to `true` using the [` _cluster/settings` API]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/settings/).

Comments can be accessed through the alerts table view by clicking on the text bubble icon within an alert's row. From there, comments can be added, edited, and deleted. An alerting comments API is also available for programmatic comments management. For details, see the [Alerting API]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/api/).

## Viewing comment authors

If the Security plugin is installed, the author of a comment is displayed. Otherwise, comments on alerts are shown as `Unknown`.

## Assigning permissions

Comment permissions inherit from the Alert's backend roles, which in turn inherit from the generating Monitor. For more details, see [Limit access by backend role]({{site.url}}{{site.baseurl}}/observing-your-data/alerting/security/#advanced-limit-access-by-backend-role).
