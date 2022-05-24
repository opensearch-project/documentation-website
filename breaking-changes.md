---
layout: default
title: Breaking Changes
nav_order: 3
permalink: /breaking-changes/
---

## 2.0.0

### Removes mapping types

The `type` parameter has been removed from all OpenSearch API endpoints. Instead, indexes can be categorized by document type. For more details, see issue [#1940](https://github.com/opensearch-project/opensearch/issues/1940).

### Removal of outdated nomenclature 

In order for OpenSearch to include more inclusive naming conventions, we've replaced the following terms in our code with a more inclusive term:

- "White list" is now "Allow list".
- "Black list is now "White list".
- "Master" is now "Cluster Manager".

If you are still using the outdated terms in the context of the security APIs or for Node management, your calls and automation will continue to work until the terms are removed later in 2022. 

### Deprecate Compatibility Override

The override main response setting `compatibility.override_main_response_version` is deprecated from OpenSearch version 1.x and removed from OpenSearch 2.0.0. This setting is no longer supported for compatibility with legacy clients.

### Add OpenSearch Notifications Plugin

In OpenSearch 2.0, the Altering plugin is now integrated with the new OpenSearch Notifications plugin. To continue using the notification action in the Alerting plugin, you need to install the backend plugins `notifications-core` and `notifications`. You can also install the Notifications Dashboards plugin to manage Notification channels via OpenSearch Dashboards. For more information, see [Questions about destinations]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/monitors#questions-about-destinations) on the Monitors page.