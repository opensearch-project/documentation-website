---
layout: default
title: Breaking changes
nav_order: 5
parent: OpenSearch documentation
permalink: /breaking-changes/
---

## 2.0.0

### Remove mapping types parameter

The `type` parameter has been removed from all OpenSearch API endpoints. Instead, indexes can be categorized by document type. For more details, see issue [#1940](https://github.com/opensearch-project/opensearch/issues/1940).

### Deprecate non-inclusive terms 

Non-inclusive terms are deprecated in version 2.x and will be permanently removed in OpenSearch 3.0.  We are using the following replacements: 

- "Whitelist" is now "Allow list"
- "Blacklist" is now "Deny list"
- "Master" is now "Cluster Manager"

### Add OpenSearch Notifications plugins

In OpenSearch 2.0, the Alerting plugin is now integrated with new plugins for Notifications. If you want to continue to use the notification action in the Alerting plugin, install the new backend plugins `notifications-core` and `notifications`. If you want to manage notifications in OpenSearch Dashboards, use the new `notificationsDashboards` plugin. For more information, see [Notifications]({{site.url}}{{site.baseurl}}/observing-your-data/notifications/index/) on the OpenSearch documentation page.


### Drop support for JDK 8

A Lucene upgrade forced OpenSearch to drop support for JDK 8. As a consequence, the [Java high-level REST client]({{site.url}}{{site.baseurl}}/clients/java-rest-high-level/) no longer supports JDK 8. Restoring JDK 8 support is currently an `opensearch-java` proposal [#156](https://github.com/opensearch-project/opensearch-java/issues/156) and will require removing OpenSearch core as a dependency from the Java client (issue [#262](https://github.com/opensearch-project/opensearch-java/issues/262)).
