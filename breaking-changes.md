---
layout: default
title: Breaking changes
nav_order: 5
parent: OpenSearch documentation
permalink: /breaking-changes/
---

## 1.x

The following breaking changes are relevant to OpenSearch versions 1.x.

### Migrating to OpenSearch and limits on the number of nested JSON objects

Migrating from Elasticsearch OSS version 6.8 to OpenSearch version 1.x will fail when a cluster contains any document that includes more than 10,000 nested JSON objects across all fields. Elasticsearch version 7.0 introduced the `index.mapping.nested_objects.limit` setting to guard against out-of-memory errors and assigned the setting a default of `10000`. OpenSearch adopted this setting at its inception and enforces the limitation on nested JSON objects. However, because the setting is not present in Elasticsearch 6.8 and not recognized by this version, migration to OpenSearch 1.x can result in incompatibility issues that block shard relocation between Elasticsearch 6.8 and OpenSearch versions 1.x when the number of nested JSON objects in any document surpasses the default limit. 

Therefore, we recommend evaluating your data for these limits before attempting to migrate from Elasticsearch 6.8.


## 2.0.0

### Remove mapping types parameter

The `type` parameter has been removed from all OpenSearch API endpoints. Instead, indexes can be categorized by document type. For more details, see issue [#1940](https://github.com/opensearch-project/opensearch/issues/1940).

### Deprecate non-inclusive terms 

Non-inclusive terms are deprecated in version 2.x and will be permanently removed in OpenSearch 3.0.  We are using the following replacements: 

- "Whitelist" is now "Allow list"
- "Blacklist" is now "Deny list"
- "Master" is now "Cluster Manager"

### Add OpenSearch Notifications plugins

In OpenSearch 2.0, the Alerting plugin is now integrated with new plugins for Notifications. If you want to continue to use the notification action in the Alerting plugin, install the new backend plugins `notifications-core` and `notifications`. If you want to manage notifications in OpenSearch Dashboards, use the new `notificationsDashboards` plugin. For more information, see [Questions about destinations]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/monitors#questions-about-destinations) on the Monitors page.


### Drop support for JDK 8

A Lucene upgrade forced OpenSearch to drop support for JDK 8. As a consequence, the [Java high-level REST client]({{site.url}}{{site.baseurl}}/clients/java-rest-high-level/) no longer supports JDK 8. Restoring JDK 8 support is currently an `opensearch-java` proposal [#156](https://github.com/opensearch-project/opensearch-java/issues/156) and will require removing OpenSearch core as a dependency from the Java client (issue [#262](https://github.com/opensearch-project/opensearch-java/issues/262)).
