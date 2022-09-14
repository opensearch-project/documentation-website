---
layout: default
title: Breaking Changes
nav_ord
permalink: /breaking-changes/
---

## 2.0.0

### Remove mapping types parameter

The `type` parameter has been removed from all OpenSearch API endpoints. Instead, indexes can be categorized by document type. For more details, see issue [#1940](https://github.com/opensearch-project/opensearch/issues/1940).

### Deprecate outdated nomenclature 

In order for OpenSearch to include more inclusive naming conventions, we've replaced the following terms in our code with more inclusive terms:

- "Whitelist" is now "Allow list"
- "Blacklist" is now "Deny list"
- "Master" is now "Cluster Manager"

If you are still using the outdated terms in the context of the security APIs or for node management, your calls and automation will continue to work until the terms are removed later in 2022. 

### Deprecate Compatibility override

The override main response setting `compatibility.override_main_response_version` is deprecated from OpenSearch version 1.x and removed from OpenSearch 2.0.0. This setting is no longer supported for compatibility with legacy clients.

### Add OpenSearch Notifications plugins

In OpenSearch 2.0, the Alerting plugin is now integrated with new plugins for Notifications. If you want to continue to use the notification action in the Alerting plugin, install the new backend plugins `notifications-core` and `notifications`. If you want to manage notifications in OpenSearch Dashboards, use the new `notificationsDashboards` plugin. For more information, see [Questions about destinations]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/monitors#questions-about-destinations) on the Monitors page.